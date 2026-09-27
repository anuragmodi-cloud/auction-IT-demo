"use client";

import { useState } from "react";
import { useStore, getTier, getCap } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";

export default function AdminPage() {
  const { state, dispatch, tier, cap } = useStore();
  const [scoreInput, setScoreInput] = useState(state.trustScore);
  const [bidsInput, setBidsInput] = useState(state.bidsPlaced);
  const [defaultsInput, setDefaultsInput] = useState(state.consecutiveDefaults);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <span className="inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Presenter tool
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Admin / demo control panel
          <HelpInfo phase="Demo tooling">
            Trust-tier and cap logic depends on values that normally accumulate over many
            real auctions. This panel lets the presenter jump straight to any state
            (e.g. score 0, or 3 consecutive defaults) instead of clicking through the
            full flow every time to demo an edge case.
          </HelpInfo>
        </h1>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-900">
        <h2 className="mb-2 font-semibold">How to use this panel</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Trust score</strong> — drag the slider; it applies immediately (no
            separate step). Use it to jump straight to a tier (Low ≤40, Medium 41–80,
            High 81–100) instead of winning/defaulting your way there.
          </li>
          <li>
            <strong>Bids placed</strong> and <strong>Consecutive defaults</strong> —
            type a number, then click that field&rsquo;s &ldquo;Apply&rdquo; button to
            commit it. Set &ldquo;Bids placed&rdquo; to 3 to instantly demo the cap-lift
            on the next bid; set &ldquo;Consecutive defaults&rdquo; to 3 to demo the ban
            with a single more default on the Outcome simulation page.
          </li>
          <li>
            <strong>Simulate fraud flag</strong> — a placeholder toggle for a future
            fraud-detection integration; it doesn&rsquo;t change scoring in this demo.
          </li>
          <li>
            This panel does not control individual lots — to raise the market highest
            bid on a specific lot (which is what actually lifts a new bidder&rsquo;s
            cap), use the &ldquo;Simulate rival bid&rdquo; box on that lot&rsquo;s{" "}
            <em>Bidding</em> page instead.
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <div>
          <label className="mb-1 flex justify-between text-xs font-medium text-slate-600">
            <span>Trust score</span>
            <span>{scoreInput}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={scoreInput}
            onChange={(e) => setScoreInput(Number(e.target.value))}
            onMouseUp={(e) => dispatch({ type: "ADMIN_SET", trustScore: Number(e.currentTarget.value) })}
            onTouchEnd={(e) => dispatch({ type: "ADMIN_SET", trustScore: Number(e.currentTarget.value) })}
            onKeyUp={(e) => dispatch({ type: "ADMIN_SET", trustScore: Number(e.currentTarget.value) })}
            className="w-full touch-none"
          />
          <p className="mt-1 text-xs text-slate-400">
            Tier at {scoreInput}: {getTier(scoreInput)} · cap {getCap(getTier(scoreInput))}
            {scoreInput === 0 && " — floor rule: cap never goes below 1, even at score 0."}
          </p>
        </div>

        <NumberField
          label="Bids placed"
          value={bidsInput}
          onChange={setBidsInput}
          onCommit={() => dispatch({ type: "ADMIN_SET", bidsPlaced: bidsInput })}
        />

        <NumberField
          label="Consecutive defaults"
          value={defaultsInput}
          onChange={setDefaultsInput}
          onCommit={() => dispatch({ type: "ADMIN_SET", consecutiveDefaults: defaultsInput })}
        />

        <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
          <span>Simulate fraud flag</span>
          <input
            type="checkbox"
            checked={state.simulateFraudFlag}
            onChange={(e) => dispatch({ type: "ADMIN_SET", simulateFraudFlag: e.target.checked })}
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-sm">
        <h2 className="mb-2 font-semibold text-slate-700">Live derived state</h2>
        <dl className="space-y-1 text-slate-600">
          <Row label="Trust score" value={state.trustScore} />
          <Row label="Tier" value={tier} />
          <Row label="Concurrent-lot cap" value={cap} />
          <Row label="Open lots" value={`${state.openLots.length} / ${cap}`} />
          <Row label="Bids placed" value={state.bidsPlaced} />
          <Row label="Consecutive defaults" value={`${state.consecutiveDefaults} / 4`} />
          <Row label="Status" value={state.banned ? "Banned" : "Active"} />
        </dl>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  onCommit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  onCommit: () => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <button
          onClick={onCommit}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
