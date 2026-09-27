"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";
import { ComplaintStatus } from "@/lib/types";

const NEXT_STATUS: Record<ComplaintStatus, ComplaintStatus | null> = {
  Open: "Under review",
  "Under review": "Resolved",
  Resolved: null,
};

const STATUS_STYLE: Record<ComplaintStatus, string> = {
  Open: "bg-amber-100 text-amber-700",
  "Under review": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

export default function ComplaintsPage() {
  const { state, dispatch } = useStore();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My complaints
          <HelpInfo phase="E — trust loop">
            Complaints about undisclosed or changed fees are a leading indicator of the
            same distrust that drives defaults. Tracking them to resolution (Open → Under
            review → Resolved) with a stated SLA gives Ops a feedback loop separate from
            the cost-breakdown disclosure itself.
          </HelpInfo>
        </h1>
        <Link href="/browse" className="mt-1 inline-block text-sm text-indigo-600 hover:underline">
          ← Back to browse
        </Link>
      </div>

      {state.complaints.length === 0 && (
        <p className="text-sm text-slate-500">
          No complaints yet. Submit one from a lot card on the Browse page via
          &ldquo;Report a fee issue&rdquo;.
        </p>
      )}

      <div className="space-y-3">
        {state.complaints.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{c.lotName}</p>
                <p className="text-xs text-slate-500">
                  Ticket {c.ticketId} · {c.category}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[c.status]}`}>
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.description || "No description provided."}</p>
            {c.evidenceFileName && (
              <p className="mt-1 text-xs text-slate-400">Evidence: {c.evidenceFileName}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">SLA: response within 48 hours.</p>
            {NEXT_STATUS[c.status] && (
              <button
                onClick={() =>
                  dispatch({ type: "SET_COMPLAINT_STATUS", id: c.id, status: NEXT_STATUS[c.status]! })
                }
                className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Presenter: advance to &ldquo;{NEXT_STATUS[c.status]}&rdquo;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
