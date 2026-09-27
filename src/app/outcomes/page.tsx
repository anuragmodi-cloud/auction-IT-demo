"use client";

import { getLot, getOtherHighest, getYourHighest, isYouHighestBidder, useStore } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";

export default function OutcomesPage() {
  const { state, dispatch } = useStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-1 inline-block rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
          Presenter tool — not a real bidder screen
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Outcome simulation
          <HelpInfo phase="B / H">
            Bidders never see this page — it exists so the presenter can advance a lot to
            any ending without waiting for a real auction clock. Winning outcomes are only
            offered when the mock bidder actually holds the current highest bid on that
            lot; if a rival bid has overtaken them, the only realistic ending is that they
            lose the lot, which carries no trust-score consequence of its own.
          </HelpInfo>
        </h1>
      </div>

      {state.banned && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
          Bidder is Banned/Suspended — 4 consecutive defaults reached. Further bidding is
          disabled platform-wide.
        </div>
      )}

      <TimePassesControl />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Open lots ({state.openLots.length})</h2>
        {state.openLots.length === 0 && (
          <p className="text-sm text-slate-500">
            No open lots. Place a bid from a lot&rsquo;s bidding page first.
          </p>
        )}
        <div className="space-y-3">
          {state.openLots.map((ol) => {
            const lot = getLot(ol.lotId);
            if (!lot) return null;
            const youHighest = isYouHighestBidder(state, ol.lotId);
            const yourAmount = getYourHighest(state, ol.lotId);
            const otherAmount = getOtherHighest(state, ol.lotId);

            return (
              <div key={ol.lotId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{lot.name}</p>
                    <p className="text-xs text-slate-500">
                      Your highest: {yourAmount !== null ? `₹${yourAmount.toLocaleString("en-IN")}` : "—"} ·
                      {" "}Other bidders&rsquo; highest: {otherAmount !== null ? `₹${otherAmount.toLocaleString("en-IN")}` : "none"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      youHighest ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {youHighest ? "You are highest bidder" : "Outbid by another bidder"}
                  </span>
                </div>

                {youHighest ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <OutcomeButton
                      label="Win & lift successfully"
                      style="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => dispatch({ type: "SIMULATE_OUTCOME", lotId: ol.lotId, outcome: "win_success" })}
                    />
                    <OutcomeButton
                      label="Win but default"
                      style="bg-amber-600 hover:bg-amber-700"
                      onClick={() => dispatch({ type: "SIMULATE_OUTCOME", lotId: ol.lotId, outcome: "win_default" })}
                    />
                    <OutcomeButton
                      label="Win but flagged as manipulation"
                      style="bg-red-600 hover:bg-red-700"
                      onClick={() => dispatch({ type: "SIMULATE_OUTCOME", lotId: ol.lotId, outcome: "win_manipulation" })}
                    />
                    <OutcomeButton
                      label="Auction ends below reserve, no sale"
                      style="bg-slate-500 hover:bg-slate-600"
                      onClick={() => dispatch({ type: "SIMULATE_OUTCOME", lotId: ol.lotId, outcome: "no_sale" })}
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-slate-500">
                      Another bidder currently holds the highest bid — winning outcomes are
                      unavailable until you place a higher bid. You can still resolve this
                      lot as lost:
                    </p>
                    <OutcomeButton
                      label="Resolve: lot awarded to another bidder"
                      style="bg-slate-500 hover:bg-slate-600"
                      onClick={() => dispatch({ type: "SIMULATE_OUTCOME", lotId: ol.lotId, outcome: "lost_to_rival" })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {state.lastBanShown && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">4th consecutive default reached — bidder is now Banned/Suspended.</p>
          <p className="mt-1">
            For comparison: 1–3 consecutive defaults trigger no action — within normal
            tolerance. It is only the 4th consecutive default that triggers the ban.
          </p>
          <button onClick={() => dispatch({ type: "ACK_BAN" })} className="mt-2 text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {!state.banned && state.consecutiveDefaults > 0 && state.consecutiveDefaults < 4 && (
        <p className="text-xs text-slate-500">
          Consecutive defaults: {state.consecutiveDefaults}/4 — no action taken, within
          normal tolerance.
        </p>
      )}

      <ResolvedLists />
    </div>
  );
}

function OutcomeButton({
  label,
  style,
  onClick,
}: {
  label: string;
  style: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white ${style}`}>
      {label}
    </button>
  );
}

function TimePassesControl() {
  const { state, dispatch } = useStore();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Simulate: time passes, no activity
          <HelpInfo phase="B — non-effect">
            This control exists to demonstrate a deliberate design decision: trust score
            does not decay or improve from mere inactivity. Only lift outcomes, defaults,
            and manipulation flags move the score.
          </HelpInfo>
        </span>
        <button
          onClick={() => dispatch({ type: "TIME_PASSES" })}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Simulate 30 days pass
        </button>
      </div>
      {state.lastTimePassesMessage && (
        <p className="mt-2 text-xs text-slate-500">{state.lastTimePassesMessage}</p>
      )}
    </div>
  );
}

function ResolvedLists() {
  const { state } = useStore();
  const completed = state.resolvedLots.filter((r) => r.outcome === "completed");
  const defaulted = state.resolvedLots.filter((r) => r.outcome === "defaulted");
  const manipulation = state.resolvedLots.filter((r) => r.outcome === "manipulation");
  const noSale = state.resolvedLots.filter((r) => r.outcome === "no_sale");
  const lostToRival = state.resolvedLots.filter((r) => r.outcome === "lost_to_rival");

  if (state.resolvedLots.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ResolvedGroup title="Completed lots" items={completed} tone="text-emerald-700" />
      <ResolvedGroup title="Defaulted, pending re-list" items={defaulted} tone="text-amber-700" />
      <ResolvedGroup title="Flagged for manipulation review" items={manipulation} tone="text-red-700" />
      <ResolvedGroup title="Ended without a sale" items={noSale} tone="text-slate-500" />
      <ResolvedGroup title="Lost to another bidder" items={lostToRival} tone="text-slate-500" />
    </div>
  );
}

function ResolvedGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: { lotId: string }[];
  tone: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className={`text-xs font-semibold uppercase tracking-wide ${tone}`}>{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {items.map((r, i) => {
          const lot = getLot(r.lotId);
          return <li key={`${r.lotId}-${i}`}>{lot?.name ?? r.lotId}</li>;
        })}
      </ul>
    </div>
  );
}
