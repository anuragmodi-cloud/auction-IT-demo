"use client";

import { useState } from "react";
import Link from "next/link";
import { LOTS, CATEGORY_LABEL } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";
import { CostBreakdown } from "@/components/CostBreakdown";
import { ComplaintCategory } from "@/lib/types";

export default function BrowsePage() {
  const { dispatch } = useStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [complaintFor, setComplaintFor] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Browse lots
          <HelpInfo phase="E">
            The default-rate problem often starts before bidding: buyers see an
            attractive headline price but discover fees, taxes and seller charges only
            after winning. Showing the complete cost breakdown up front — with no hidden
            fields — is meant to reduce &ldquo;surprise cost&rdquo; disputes and the
            defaults that follow from them.
          </HelpInfo>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          <Link href="/complaints" className="text-indigo-600 hover:underline">
            My complaints →
          </Link>
        </p>
      </div>

      {confirmation && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {confirmation}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LOTS.map((lot) => (
          <div key={lot.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                {lot.imagePlaceholder}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/lot/${lot.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                  {lot.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded bg-slate-100 px-2 py-0.5">{CATEGORY_LABEL[lot.category]}</span>
                  <span>{lot.quantity}</span>
                  <span>{lot.bidCount} bids</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-slate-500">Reserve price</span>
              <span className="font-semibold text-slate-800">
                ₹{lot.reservePrice.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => setExpanded((e) => ({ ...e, [lot.id]: !e[lot.id] }))}
              className="mt-2 text-left text-xs font-medium text-indigo-600 hover:underline"
            >
              {expanded[lot.id] ? "Hide full cost breakdown ▲" : "View full cost breakdown ▼"}
            </button>
            {expanded[lot.id] && (
              <div className="mt-2">
                <CostBreakdown lot={lot} />
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <Link
                href={`/lot/${lot.id}`}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                View lot
              </Link>
              <button
                onClick={() => setComplaintFor(lot.id)}
                className="text-xs font-medium text-red-500 hover:underline"
              >
                Report a fee issue
              </button>
            </div>
          </div>
        ))}
      </div>

      {complaintFor && (
        <ComplaintModal
          lotId={complaintFor}
          onClose={() => setComplaintFor(null)}
          onSubmitted={(ticketId) => {
            setComplaintFor(null);
            setConfirmation(
              `Complaint submitted — ticket ${ticketId}. You'll hear back within 48 hours.`
            );
          }}
        />
      )}
    </div>
  );
}

function ComplaintModal({
  lotId,
  onClose,
  onSubmitted,
}: {
  lotId: string;
  onClose: () => void;
  onSubmitted: (ticketId: string) => void;
}) {
  const { dispatch } = useStore();
  const lot = LOTS.find((l) => l.id === lotId)!;
  const [category, setCategory] = useState<ComplaintCategory>("Undisclosed fee");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");

  const submit = () => {
    const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    dispatch({
      type: "SUBMIT_COMPLAINT",
      lotId,
      lotName: lot.name,
      category,
      description,
      evidenceFileName: evidence || null,
      ticketId,
    });
    onSubmitted(ticketId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Report a fee issue</h2>
        <p className="mt-1 text-xs text-slate-500">{lot.name}</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Issue category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option>Undisclosed fee</option>
              <option>Fee changed after purchase</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Evidence (mock upload)</label>
            <input
              type="text"
              placeholder="screenshot.png"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Submit complaint
          </button>
        </div>
      </div>
    </div>
  );
}
