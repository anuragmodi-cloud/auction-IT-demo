"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { state, dispatch, tier, cap } = useStore();
  const router = useRouter();

  if (!state.loggedIn) return null;

  const handleReset = () => {
    dispatch({ type: "RESET" });
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 text-sm">
        <button
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600 md:hidden"
        >
          ☰
        </button>
        <div className="font-bold text-indigo-700">AuctionIT · Bidder</div>

        <Stat label="Trust score" value={state.trustScore} />
        <Stat label="Tier" value={tier} />
        <Stat label="Lot cap" value={`${state.openLots.length} / ${cap}`} />
        <Stat label="Bids placed" value={state.bidsPlaced} />
        <Stat label="Consecutive defaults" value={`${state.consecutiveDefaults} / 4`} />

        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
            state.banned
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {state.banned ? "● Banned" : "● Active"}
        </span>

        <button
          onClick={handleReset}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          Reset demo
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
