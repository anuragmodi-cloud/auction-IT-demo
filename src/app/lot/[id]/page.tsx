"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLot, useStore } from "@/lib/store";
import { CATEGORY_LABEL } from "@/lib/mockData";
import { HelpInfo } from "@/components/HelpInfo";
import { CostBreakdown } from "@/components/CostBreakdown";

export default function LotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state } = useStore();
  const router = useRouter();
  const lot = getLot(id);

  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [approved, setApproved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset the terms gate whenever the lot changes — it must never carry
  // memory across lots, even within the same session.
  useEffect(() => {
    setScrolledToEnd(false);
    setApproved(false);
  }, [id]);

  if (!lot) {
    return <p className="text-sm text-slate-500">Lot not found.</p>;
  }

  const categoryCleared = state.categories[lot.category].step === "cleared";

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
      setScrolledToEnd(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/browse" className="text-sm text-indigo-600 hover:underline">
          ← Back to browse
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{lot.name}</h1>
        <div className="mt-1 flex gap-2 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-2 py-0.5">{CATEGORY_LABEL[lot.category]}</span>
          <span>{lot.quantity}</span>
          <span>{lot.location}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-4xl">
            {lot.imagePlaceholder}
          </div>
          <p className="text-sm text-slate-600">{lot.description}</p>
        </div>
        <div className="mt-4">
          <CostBreakdown lot={lot} />
        </div>
      </div>

      {/* GATE 1 */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">
          Gate 1 — category clearance
          <HelpInfo phase="A">
            Bidders sometimes browse categories they haven&rsquo;t completed KYC for. This
            gate blocks progress outright rather than just warning, because letting an
            uncleared bidder proceed to terms and bidding for a restricted category is the
            exact gap the KYC flow exists to close.
          </HelpInfo>
        </h2>
        {categoryCleared ? (
          <p className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            ✓ {CATEGORY_LABEL[lot.category]} is cleared for this bidder.
          </p>
        ) : (
          <div className="mt-2 rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">
            <p className="font-medium">
              Blocked — {CATEGORY_LABEL[lot.category]} is not cleared for this bidder yet.
            </p>
            <Link
              href={`/kyc?needsCategory=${lot.category}&lotName=${encodeURIComponent(lot.name)}`}
              className="mt-2 inline-block rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Complete KYC for this category
            </Link>
          </div>
        )}
      </div>

      {/* GATE 2 */}
      {categoryCleared && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Gate 2 — seller terms
            <HelpInfo phase="C">
              Bidders often bid based only on the scrap description and miss
              seller-specific conditions like lift deadlines or required documents. This
              gate forces exposure to those terms before a bid can be placed, since unread
              terms is a suspected cause of the 18% default rate. It re-triggers on every
              lot with no memory across lots, since each seller&rsquo;s terms differ.
            </HelpInfo>
          </h2>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="mt-2 h-56 overflow-y-auto whitespace-pre-wrap rounded-md border border-slate-300 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600"
          >
            {lot.sellerTerms}
          </div>
          {!scrolledToEnd && (
            <p className="mt-1 text-[11px] text-slate-400">
              Scroll to the bottom of the terms to enable the approval button.
            </p>
          )}
          <button
            disabled={!scrolledToEnd}
            onClick={() => setApproved(true)}
            className={`mt-3 rounded-md px-4 py-2 text-sm font-semibold text-white ${
              scrolledToEnd ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-slate-300"
            }`}
          >
            Approve & continue
          </button>
        </div>
      )}

      {categoryCleared && approved && (
        <button
          onClick={() => router.push(`/lot/${lot.id}/bid`)}
          className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Proceed to bidding →
        </button>
      )}
    </div>
  );
}
