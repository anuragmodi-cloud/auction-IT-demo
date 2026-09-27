"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { CATEGORY_DEFS, LOTS, SEED_KB_ROWS } from "./mockData";
import {
  BidderState,
  BidEntry,
  CategoryId,
  CategoryState,
  ComplaintCategory,
  ComplaintStatus,
  RegistryOutcome,
  RejectReason,
  Tier,
} from "./types";

function emptyCategoryState(): CategoryState {
  return {
    selected: false,
    step: "not_started",
    fileName: null,
    registryOutcome: null,
    rejectReason: null,
  };
}

function initialState(): BidderState {
  const categories = {} as Record<CategoryId, CategoryState>;
  for (const c of CATEGORY_DEFS) categories[c.id] = emptyCategoryState();
  return {
    loggedIn: false,
    trustScore: 50,
    bidsPlaced: 0,
    consecutiveDefaults: 0,
    manipulationFlags: 0,
    banned: false,
    openLots: [],
    resolvedLots: [],
    bidHistories: {},
    categories,
    complaints: [],
    kb: SEED_KB_ROWS,
    lastCapLiftShown: false,
    lastBanShown: false,
    simulateFraudFlag: false,
    lastTimePassesMessage: null,
  };
}

export function getTier(score: number): Tier {
  if (score <= 40) return "Low";
  if (score <= 80) return "Medium";
  return "High";
}

export function getCap(tier: Tier): number {
  if (tier === "Low") return 1;
  if (tier === "Medium") return 3;
  return 8;
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, n));
}

// --- Bid history / market-state selectors -------------------------------
// These derive from state.bidHistories rather than being stored redundantly,
// so a rival (Ops-simulated) bid and the bidder's own bid can never drift
// out of sync with each other.

export function getBidHistory(state: BidderState, lotId: string): BidEntry[] {
  if (state.bidHistories[lotId]) return state.bidHistories[lotId];
  const lot = LOTS.find((l) => l.id === lotId);
  return lot ? lot.initialBidHistory : [];
}

export function getOtherHighest(state: BidderState, lotId: string): number | null {
  const history = getBidHistory(state, lotId).filter((b) => !b.isYou);
  if (history.length === 0) return null;
  return Math.max(...history.map((b) => b.amount));
}

export function getYourHighest(state: BidderState, lotId: string): number | null {
  const history = getBidHistory(state, lotId).filter((b) => b.isYou);
  if (history.length === 0) return null;
  return Math.max(...history.map((b) => b.amount));
}

export function getOverallHighest(state: BidderState, lotId: string): number | null {
  const other = getOtherHighest(state, lotId);
  const yours = getYourHighest(state, lotId);
  if (other === null && yours === null) return null;
  return Math.max(other ?? -Infinity, yours ?? -Infinity);
}

export function isYouHighestBidder(state: BidderState, lotId: string): boolean {
  const yours = getYourHighest(state, lotId);
  if (yours === null) return false;
  const other = getOtherHighest(state, lotId);
  return other === null || yours > other;
}

type Action =
  | { type: "LOGIN" }
  | { type: "RESET" }
  | { type: "TOGGLE_CATEGORY"; id: CategoryId }
  | { type: "SUBMIT_CERT"; id: CategoryId; fileName: string }
  | { type: "OCR_OUTCOME"; id: CategoryId; outcome: Exclude<RegistryOutcome, null> }
  | { type: "OPS_DECISION"; id: CategoryId; approve: boolean; reason?: RejectReason }
  | { type: "RESUBMIT_CATEGORY"; id: CategoryId }
  | { type: "PLACE_BID"; lotId: string; amount: number }
  | { type: "SIMULATE_RIVAL_BID"; lotId: string; amount: number }
  | {
      type: "SIMULATE_OUTCOME";
      lotId: string;
      outcome: "win_success" | "win_default" | "win_manipulation" | "no_sale" | "lost_to_rival";
    }
  | {
      type: "SUBMIT_COMPLAINT";
      lotId: string;
      lotName: string;
      category: ComplaintCategory;
      description: string;
      evidenceFileName: string | null;
      ticketId: string;
    }
  | { type: "SET_COMPLAINT_STATUS"; id: string; status: ComplaintStatus }
  | {
      type: "ADMIN_SET";
      trustScore?: number;
      bidsPlaced?: number;
      consecutiveDefaults?: number;
      simulateFraudFlag?: boolean;
    }
  | { type: "TIME_PASSES" }
  | { type: "ACK_CAP_LIFT" }
  | { type: "ACK_BAN" };

function reducer(state: BidderState, action: Action): BidderState {
  switch (action.type) {
    case "LOGIN":
      return { ...initialState(), loggedIn: true };

    case "RESET":
      return initialState();

    case "TOGGLE_CATEGORY": {
      const cat = state.categories[action.id];
      const def = CATEGORY_DEFS.find((c) => c.id === action.id)!;
      const nowSelected = !cat.selected;
      const nextCat: CategoryState = nowSelected
        ? {
            ...emptyCategoryState(),
            selected: true,
            step: def.restricted ? "submit" : "cleared",
          }
        : emptyCategoryState();
      return {
        ...state,
        categories: { ...state.categories, [action.id]: nextCat },
      };
    }

    case "SUBMIT_CERT": {
      const cat = state.categories[action.id];
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.id]: { ...cat, fileName: action.fileName, step: "ocr" },
        },
      };
    }

    case "OCR_OUTCOME": {
      const cat = state.categories[action.id];

      // A registry match is auto-cleared — no manual review of any kind needed.
      if (action.outcome === "match") {
        const def = CATEGORY_DEFS.find((c) => c.id === action.id)!;
        const kbRow = {
          id: `kb-${Date.now()}-${action.id}`,
          category: def.label,
          documentsRequired: def.documentsRequired ?? "—",
          outcome: "Cleared — registry match found, no manual review required",
        };
        return {
          ...state,
          categories: {
            ...state.categories,
            [action.id]: { ...cat, registryOutcome: action.outcome, step: "cleared" },
          },
          kb: [kbRow, ...state.kb],
        };
      }

      // Unavailable / unclear both route to manual Ops review (never seller sign-off).
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.id]: {
            ...cat,
            registryOutcome: action.outcome,
            step: "ops_review",
          },
        },
      };
    }

    case "OPS_DECISION": {
      const cat = state.categories[action.id];
      const def = CATEGORY_DEFS.find((c) => c.id === action.id)!;
      const outcomeLabel = action.approve
        ? "Cleared — Ops approved certificate"
        : `Rejected — ${action.reason ?? "reason not specified"}`;
      const kbRow = {
        id: `kb-${Date.now()}-${action.id}`,
        category: def.label,
        documentsRequired: def.documentsRequired ?? "—",
        outcome: outcomeLabel,
      };
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.id]: {
            ...cat,
            step: action.approve ? "cleared" : "rejected",
            rejectReason: action.approve ? null : action.reason ?? null,
          },
        },
        kb: [kbRow, ...state.kb],
      };
    }

    case "RESUBMIT_CATEGORY": {
      const cat = state.categories[action.id];
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.id]: {
            ...cat,
            step: "submit",
            fileName: null,
            registryOutcome: null,
            rejectReason: null,
          },
        },
      };
    }

    case "PLACE_BID": {
      const existingHistory = getBidHistory(state, action.lotId);
      const bidEntry: BidEntry = { who: "You", amount: action.amount, isYou: true };
      const wasFourthBid = state.bidsPlaced === 3;

      const existingOpenLot = state.openLots.find((l) => l.lotId === action.lotId);
      const openLots = existingOpenLot
        ? state.openLots.map((l) =>
            l.lotId === action.lotId ? { ...l, bidsOnLot: l.bidsOnLot + 1 } : l
          )
        : [...state.openLots, { lotId: action.lotId, bidsOnLot: 1 }];

      return {
        ...state,
        bidsPlaced: state.bidsPlaced + 1,
        openLots,
        bidHistories: {
          ...state.bidHistories,
          [action.lotId]: [...existingHistory, bidEntry],
        },
        lastCapLiftShown: wasFourthBid ? true : state.lastCapLiftShown,
      };
    }

    case "SIMULATE_RIVAL_BID": {
      // Presenter-only: another bidder raises the market highest bid. This
      // never touches the mock bidder's own concurrent-lot count.
      const existingHistory = getBidHistory(state, action.lotId);
      const rivalEntry: BidEntry = {
        who: `Bidder-${Math.floor(100 + Math.random() * 900)}`,
        amount: action.amount,
        isYou: false,
      };
      return {
        ...state,
        bidHistories: {
          ...state.bidHistories,
          [action.lotId]: [...existingHistory, rivalEntry],
        },
      };
    }

    case "SIMULATE_OUTCOME": {
      const openLots = state.openLots.filter((l) => l.lotId !== action.lotId);
      const outcomeMap = {
        win_success: "completed",
        win_default: "defaulted",
        win_manipulation: "manipulation",
        no_sale: "no_sale",
        lost_to_rival: "lost_to_rival",
      } as const;
      const resolvedLots = [
        ...state.resolvedLots,
        { lotId: action.lotId, outcome: outcomeMap[action.outcome] },
      ];

      let trustScore = state.trustScore;
      let consecutiveDefaults = state.consecutiveDefaults;
      let manipulationFlags = state.manipulationFlags;
      let banned = state.banned;
      let lastBanShown = state.lastBanShown;

      if (action.outcome === "win_success") {
        trustScore = clampScore(trustScore + 5);
        consecutiveDefaults = 0;
      } else if (action.outcome === "win_default") {
        trustScore = clampScore(trustScore - 15);
        consecutiveDefaults += 1;
        if (consecutiveDefaults >= 4) {
          banned = true;
          lastBanShown = true;
        }
      } else if (action.outcome === "win_manipulation") {
        trustScore = clampScore(trustScore - 25);
        manipulationFlags += 1;
      }
      // no_sale / lost_to_rival: no score impact

      return {
        ...state,
        openLots,
        resolvedLots,
        trustScore,
        consecutiveDefaults,
        manipulationFlags,
        banned,
        lastBanShown,
      };
    }

    case "SUBMIT_COMPLAINT": {
      const id = `cmp-${Date.now()}`;
      return {
        ...state,
        complaints: [
          {
            id,
            ticketId: action.ticketId,
            lotId: action.lotId,
            lotName: action.lotName,
            category: action.category,
            description: action.description,
            evidenceFileName: action.evidenceFileName,
            status: "Open",
            submittedAt: Date.now(),
          },
          ...state.complaints,
        ],
      };
    }

    case "SET_COMPLAINT_STATUS":
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c
        ),
      };

    case "ADMIN_SET":
      return {
        ...state,
        trustScore:
          action.trustScore !== undefined ? clampScore(action.trustScore) : state.trustScore,
        bidsPlaced: action.bidsPlaced !== undefined ? action.bidsPlaced : state.bidsPlaced,
        consecutiveDefaults:
          action.consecutiveDefaults !== undefined
            ? action.consecutiveDefaults
            : state.consecutiveDefaults,
        banned:
          action.consecutiveDefaults !== undefined && action.consecutiveDefaults >= 4
            ? true
            : state.banned,
        simulateFraudFlag:
          action.simulateFraudFlag !== undefined
            ? action.simulateFraudFlag
            : state.simulateFraudFlag,
      };

    case "TIME_PASSES":
      return {
        ...state,
        lastTimePassesMessage:
          "30 days of simulated inactivity elapsed — trust score is unchanged (" +
          state.trustScore +
          "). Trust score only moves on lift outcomes, defaults, or manipulation flags — never on inactivity alone.",
      };

    case "ACK_CAP_LIFT":
      return { ...state, lastCapLiftShown: false };

    case "ACK_BAN":
      return { ...state, lastBanShown: false };

    default:
      return state;
  }
}

interface StoreValue {
  state: BidderState;
  dispatch: React.Dispatch<Action>;
  tier: Tier;
  cap: number;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const tier = getTier(state.trustScore);
  const cap = getCap(tier);
  const value = useMemo(() => ({ state, dispatch, tier, cap }), [state, tier, cap]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function getLot(id: string) {
  return LOTS.find((l) => l.id === id) ?? null;
}
