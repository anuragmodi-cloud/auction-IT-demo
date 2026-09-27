"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getLot,
  getOtherHighest,
  getOverallHighest,
  getYourHighest,
  getBidHistory,
  useStore,
} from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";

const AUCTION_DURATION_SECONDS = 20 * 60;

export default function BiddingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, dispatch, tier, cap } = useStore();
  const lot = getLot(id);
  const [amount, setAmount] = useState("");
  const [showFormula, setShowFormula] = useState(false);
  const [rivalAmount, setRivalAmount] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(AUCTION_DURATION_SECONDS);

  // The countdown is local presentation state — it resets per lot and is not
  // part of the trust/cap model, but it must visibly run as soon as the
  // bidding window opens.
  useEffect(() => {
    setSecondsLeft(AUCTION_DURATION_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  if (!lot) return <p className="text-sm text-slate-500">Lot not found.</p>;

  const otherHighest = getOtherHighest(state, lot.id);
  const yourHighest = getYourHighest(state, lot.id);
  const overallHighest = getOverallHighest(state, lot.id);
  const bidHistory = [...getBidHistory(state, lot.id)].sort((a, b) => b.amount - a.amount);
  const isNewBidder = state.bidsPlaced < 3;

  const openLot = state.openLots.find((l) => l.lotId === lot.id);
  const atCapAndNewLot = !openLot && state.openLots.length >= cap;

  // New-bidder cap is 10% above the highest bid placed by OTHER bidders —
  // never the new bidder's own previous bid, otherwise repeated self-bids
  // would ratchet the ceiling upward with every bid.
  const newBidderCap = otherHighest !== null ? Math.floor(otherHighest * 1.1) : Math.floor(lot.reservePrice * 1.1);

  const numericAmount = Number(amount);
  const validAmount = (() => {
    if (amount === "" || Number.isNaN(numericAmount) || numericAmount <= 0) return false;
    if (isNewBidder) {
      // New bidders may place any amount, including below reserve — the only
      // constraint is the 10%-above-market ceiling.
      return numericAmount <= newBidderCap;
    }
    // Established bidders (4th bid onward) are uncapped but must top the
    // current overall highest bid.
    return overallHighest === null || numericAmount > overallHighest;
  })();

  const canBid = !state.banned && !atCapAndNewLot && validAmount;

  const placeBid = () => {
    if (!canBid) return;
    dispatch({ type: "PLACE_BID", lotId: lot.id, amount: numericAmount });
    setAmount("");
  };

  const placeRivalBid = () => {
    const rival = Number(rivalAmount);
    if (!rivalAmount || Number.isNaN(rival) || rival <= 0) return;
    dispatch({ type: "SIMULATE_RIVAL_BID", lotId: lot.id, amount: rival });
    setRivalAmount("");
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/lot/${lot.id}`} className="text-sm text-indigo-600 hover:underline">
          ← Back to lot detail
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Bidding — {lot.name}
          <HelpInfo phase="B">
            Two structural safeguards apply at bid time: a temporary price cap for
            unproven new bidders (to limit blast radius before they&rsquo;ve shown
            reliable behavior), and a concurrent-lot cap tied to trust tier (to prevent
            an unreliable bidder from over-committing across many lots at once). The cap
            is always measured against the highest bid placed by <em>other</em> bidders —
            never your own last bid — so it can&rsquo;t be ratcheted upward by bidding
            against yourself.
          </HelpInfo>
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Auction closes in {mm}:{ss}
        </div>
      </div>

      {state.banned && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
          This bidder is banned/suspended after 4 consecutive defaults. Bidding is
          disabled platform-wide.
        </div>
      )}

      {state.lastCapLiftShown && (
        <div className="flex items-center justify-between rounded-md bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
          <span>Price cap lifted — this is your 4th bid.</span>
          <button onClick={() => dispatch({ type: "ACK_CAP_LIFT" })} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-slate-500">Market highest bid (other bidders)</span>
            <span className="text-lg font-semibold text-slate-900">
              {otherHighest !== null ? `₹${otherHighest.toLocaleString("en-IN")}` : "No bids yet"}
            </span>
          </div>
          <div>
            <span className="block text-slate-500">Your highest bid</span>
            <span className="text-lg font-semibold text-slate-900">
              {yourHighest !== null ? `₹${yourHighest.toLocaleString("en-IN")}` : "—"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-slate-600">Your bid amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={state.banned || atCapAndNewLot}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
            placeholder={isNewBidder ? `up to ₹${newBidderCap.toLocaleString("en-IN")}` : "any amount above market highest"}
          />
          {isNewBidder && (
            <p className="mt-1 text-xs text-amber-600">
              New bidder — capped at 10% above the highest bid placed by other bidders
              (₹{newBidderCap.toLocaleString("en-IN")}) until your 4th bid. You may bid any
              amount up to that cap, including below the reserve price.
            </p>
          )}
          {amount !== "" && !validAmount && !state.banned && !atCapAndNewLot && (
            <p className="mt-1 text-xs text-red-600">
              {isNewBidder
                ? `Enter a positive amount at or below ₹${newBidderCap.toLocaleString("en-IN")}.`
                : `Enter an amount above the current overall highest bid${
                    overallHighest !== null ? ` (₹${overallHighest.toLocaleString("en-IN")})` : ""
                  }.`}
            </p>
          )}
        </div>

        {atCapAndNewLot && (
          <div className="mt-3 rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">
            <p className="font-medium">
              Blocked — you&rsquo;re at your concurrent-lot cap ({tier} tier, cap {cap}, currently
              bidding on {state.openLots.length}).
            </p>
            <Link href="/admin" className="mt-1 inline-block text-xs font-semibold underline">
              Go to admin panel to simulate resolving an existing lot
            </Link>
          </div>
        )}

        <button
          disabled={!canBid}
          onClick={placeBid}
          className={`mt-4 w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white ${
            canBid ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-slate-300"
          }`}
        >
          Place bid
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">
          All bids on this lot
          <HelpInfo phase="B — transparency">
            Every participant can see the full bid ladder — who bid what — because the
            new-bidder cap only makes sense if bidders can actually see the highest bid
            they&rsquo;re capped against. Hiding this would make the cap unverifiable and
            the auction feel rigged.
          </HelpInfo>
        </h2>
        {bidHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No bids placed yet on this lot.</p>
        ) : (
          <table className="mt-2 w-full text-sm">
            <tbody>
              {bidHistory.map((b, i) => (
                <tr key={i} className={b.isYou ? "bg-indigo-50" : ""}>
                  <td className="rounded-l-md px-2 py-1.5 font-medium text-slate-700">
                    {b.isYou ? "You" : b.who}
                    {i === 0 && (
                      <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Highest
                      </span>
                    )}
                  </td>
                  <td className="rounded-r-md px-2 py-1.5 text-right text-slate-800">
                    ₹{b.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Presenter tool — simulate a rival bidder
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            value={rivalAmount}
            onChange={(e) => setRivalAmount(e.target.value)}
            placeholder="Rival bid amount (₹)"
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            onClick={placeRivalBid}
            className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Simulate rival bid
          </button>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Use this to raise the market highest bid without it being your own bid — this is
          what actually lifts the new-bidder cap ceiling, not re-bidding against yourself.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
        <button
          onClick={() => setShowFormula((s) => !s)}
          className="flex w-full items-center justify-between text-left font-medium text-slate-700"
        >
          <span>
            Trust score formula
            <HelpInfo phase="B — scoring">
              These weights are illustrative placeholders meant to demonstrate the
              mechanic during this demo. In production they would be calibrated against
              real default and lift data rather than chosen arbitrarily.
            </HelpInfo>
          </span>
          <span className="text-xs text-slate-400">{showFormula ? "Hide ▲" : "Show ▼"}</span>
        </button>
        {showFormula && (
          <ul className="mt-3 space-y-1 text-xs text-slate-600">
            <li>Base score: 50</li>
            <li>+5 per successful lift</li>
            <li>−15 per default</li>
            <li>−25 per detected manipulation</li>
            <li className="text-slate-400">All weights are illustrative placeholders, to be calibrated against real data.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
