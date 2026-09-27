export type CategoryId =
  | "ferrous"
  | "nonferrous"
  | "machinery"
  | "surplus"
  | "hazardous"
  | "chemical";

export interface CategoryDef {
  id: CategoryId;
  label: string;
  restricted: boolean;
  documentsRequired?: string;
}

export type CertStep =
  | "not_started"
  | "submit"
  | "ocr"
  | "ops_review"
  | "cleared"
  | "rejected";

export type RegistryOutcome = "match" | "unavailable" | "unclear" | null;
export type RejectReason = "Wrong category" | "Expired" | "Incomplete" | null;

export interface CategoryState {
  selected: boolean;
  step: CertStep;
  fileName: string | null;
  registryOutcome: RegistryOutcome;
  rejectReason: RejectReason;
}

export type Tier = "Low" | "Medium" | "High";

export interface BidEntry {
  who: string;
  amount: number;
  isYou: boolean;
}

export interface OpenLot {
  lotId: string;
  bidsOnLot: number;
}

export type LotOutcome =
  | "completed"
  | "defaulted"
  | "manipulation"
  | "no_sale"
  | "lost_to_rival";

export interface ResolvedLot {
  lotId: string;
  outcome: LotOutcome;
}

export type ComplaintStatus = "Open" | "Under review" | "Resolved";
export type ComplaintCategory =
  | "Undisclosed fee"
  | "Fee changed after purchase"
  | "Other";

export interface Complaint {
  id: string;
  ticketId: string;
  lotId: string;
  lotName: string;
  category: ComplaintCategory;
  description: string;
  evidenceFileName: string | null;
  status: ComplaintStatus;
  submittedAt: number;
}

export interface KbRow {
  id: string;
  category: string;
  documentsRequired: string;
  outcome: string;
}

export interface Charge {
  name: string;
  amount: number;
}

export interface Lot {
  id: string;
  name: string;
  category: CategoryId;
  quantity: string;
  reservePrice: number;
  currentBid: number;
  bidCount: number;
  location: string;
  description: string;
  imagePlaceholder: string;
  hammerRangeLow: number;
  hammerRangeHigh: number;
  feePct: number;
  taxPct: number;
  charges: Charge[];
  varianceNote: string | null;
  sellerTerms: string;
  initialBidHistory: BidEntry[];
}

export interface BidderState {
  loggedIn: boolean;
  trustScore: number;
  bidsPlaced: number;
  consecutiveDefaults: number;
  manipulationFlags: number;
  banned: boolean;
  openLots: OpenLot[];
  resolvedLots: ResolvedLot[];
  bidHistories: Record<string, BidEntry[]>;
  categories: Record<CategoryId, CategoryState>;
  complaints: Complaint[];
  kb: KbRow[];
  lastCapLiftShown: boolean;
  lastBanShown: boolean;
  simulateFraudFlag: boolean;
  lastTimePassesMessage: string | null;
}
