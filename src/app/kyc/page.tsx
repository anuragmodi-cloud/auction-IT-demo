"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { CATEGORY_DEFS, CATEGORY_LABEL } from "@/lib/mockData";
import { HelpInfo } from "@/components/HelpInfo";
import { CategoryId, RejectReason } from "@/lib/types";

export default function KycPage() {
  return (
    <Suspense fallback={null}>
      <KycPageInner />
    </Suspense>
  );
}

function KycPageInner() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const needsCategory = searchParams.get("needsCategory") as CategoryId | null;
  const needsLotName = searchParams.get("lotName");

  const selectedCategories = CATEGORY_DEFS.filter((c) => state.categories[c.id].selected);
  const allCleared =
    selectedCategories.length > 0 &&
    selectedCategories.every((c) => state.categories[c.id].step === "cleared");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          KYC & category declaration
          <HelpInfo phase="A">
            Bidders declare which scrap categories they deal in. Non-restricted
            categories are cleared instantly since the risk of harm is low. Restricted
            categories (hazardous waste, chemical residues) require a certificate and a
            registry check, with any manual step handled by Ops rather than the seller,
            because bidding on these without proper authorization creates real
            regulatory and safety exposure for AuctionIT.
          </HelpInfo>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select every category this bidder deals in. Restricted categories show every
          intermediate state so the review flow is visible, not hidden behind one form.
        </p>
      </div>

      {needsCategory && state.categories[needsCategory]?.step !== "cleared" && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          KYC required for <strong>{CATEGORY_LABEL[needsCategory]}</strong>
          {needsLotName ? (
            <>
              {" "}
              before bidding on <strong>{needsLotName}</strong>
            </>
          ) : null}
          . Select it below to begin certification.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Scrap categories</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CATEGORY_DEFS.map((c) => {
            const cat = state.categories[c.id];
            const isNeeded = needsCategory === c.id && cat.step !== "cleared";
            return (
              <div key={c.id}>
                <label
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-50 ${
                    isNeeded
                      ? "border-amber-400 ring-2 ring-amber-300"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cat.selected}
                    onChange={() => dispatch({ type: "TOGGLE_CATEGORY", id: c.id })}
                  />
                  <span>{c.label}</span>
                  {c.restricted && (
                    <span className="ml-auto rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                      Restricted
                    </span>
                  )}
                  {cat.selected && cat.step === "cleared" && !c.restricted && (
                    <span className="ml-auto text-xs font-medium text-emerald-600">Cleared</span>
                  )}
                </label>
                {isNeeded && (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    ↑ KYC required for this category
                    {needsLotName ? ` to bid on "${needsLotName}"` : ""}.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedCategories
        .filter((c) => c.restricted)
        .map((c) => (
          <RestrictedCategoryFlow key={c.id} categoryId={c.id} />
        ))}

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">
          <Link href="/kyc/knowledge-base" className="text-indigo-600 hover:underline">
            View KYC knowledge base →
          </Link>
          <HelpInfo phase="A — data flywheel">
            Every submitted certificate and its outcome (cleared, rejected, escalated) is
            logged to a knowledge base of category → documents required → outcome. Over
            time this lets Ops spot patterns (e.g. a category that is frequently rejected
            for &ldquo;Expired&rdquo;) and refine what documentation is actually required.
          </HelpInfo>
        </div>
        <button
          disabled={!allCleared}
          onClick={() => router.push("/browse")}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
            allCleared ? "bg-indigo-600 hover:bg-indigo-700" : "cursor-not-allowed bg-slate-300"
          }`}
        >
          Proceed to platform
        </button>
      </div>
    </div>
  );
}

function RestrictedCategoryFlow({ categoryId }: { categoryId: CategoryId }) {
  const { state, dispatch } = useStore();
  const def = CATEGORY_DEFS.find((c) => c.id === categoryId)!;
  const cat = state.categories[categoryId];
  const [fileName, setFileName] = useState("");
  const [rejectReason, setRejectReason] = useState<RejectReason>("Wrong category");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">
        {def.label} — certification flow
      </h3>

      <ol className="space-y-3">
        <StepRow
          done={cat.step !== "submit" && cat.step !== "not_started"}
          active={cat.step === "submit"}
          label="a. Submit certificate"
        >
          {cat.step === "submit" && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="filename.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-56 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              />
              <button
                disabled={!fileName}
                onClick={() =>
                  dispatch({ type: "SUBMIT_CERT", id: categoryId, fileName: fileName || "certificate.pdf" })
                }
                className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white disabled:bg-slate-300"
              >
                Submit certificate
              </button>
            </div>
          )}
          {cat.fileName && cat.step !== "submit" && (
            <p className="mt-1 text-xs text-slate-500">Submitted: {cat.fileName}</p>
          )}
        </StepRow>

        <StepRow
          done={cat.step === "ops_review" || cat.step === "cleared" || cat.step === "rejected"}
          active={cat.step === "ocr"}
          label="b. OCR & registry check"
        >
          {cat.step === "ocr" && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-slate-500">
                Presenter controls — simulate the automatic OCR/registry outcome:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => dispatch({ type: "OCR_OUTCOME", id: categoryId, outcome: "match" })}
                  className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Simulate: Registry match found
                </button>
                <button
                  onClick={() => dispatch({ type: "OCR_OUTCOME", id: categoryId, outcome: "unavailable" })}
                  className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                >
                  Simulate: Registry unavailable
                </button>
                <button
                  onClick={() => dispatch({ type: "OCR_OUTCOME", id: categoryId, outcome: "unclear" })}
                  className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100"
                >
                  Simulate: OCR misread / unclear
                </button>
              </div>
              <div className="pt-1">
                <button
                  disabled
                  title="Forgery detection is out of scope for this design — flagged here only as a known limitation, not a solved case."
                  className="cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                >
                  Simulate: Detected as forged
                </button>
                <p className="mt-1 text-[11px] text-slate-400">
                  Known limitation: AI-forged documents are not detected by this design.
                </p>
              </div>
            </div>
          )}
          {cat.registryOutcome === "match" && cat.step === "cleared" && (
            <p className="mt-1 text-xs text-emerald-600">
              Registry match found — cleared automatically, no manual review needed.
            </p>
          )}
          {(cat.step === "ops_review" || cat.step === "cleared" || cat.step === "rejected") &&
            cat.registryOutcome &&
            cat.registryOutcome !== "match" && (
              <p className="mt-1 text-xs text-slate-500">
                {cat.registryOutcome === "unavailable" &&
                  "Registry API unavailable — routed to manual Ops review."}
                {cat.registryOutcome === "unclear" &&
                  "Entity details unclear — Ops will follow up to confirm requirement and authenticity."}
              </p>
            )}
        </StepRow>

        {cat.registryOutcome !== "match" && (
          <StepRow
            done={cat.step === "cleared" || cat.step === "rejected"}
            active={cat.step === "ops_review"}
            label={`c. ${
              cat.registryOutcome === "unavailable"
                ? "Pending Ops review"
                : cat.registryOutcome === "unclear"
                ? "Pending Ops follow-up"
                : "Pending Ops review"
            }`}
          >
            {cat.step === "ops_review" && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: "OPS_DECISION", id: categoryId, approve: true })}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    Ops approves
                  </button>
                  <select
                    value={rejectReason ?? "Wrong category"}
                    onChange={(e) => setRejectReason(e.target.value as RejectReason)}
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                  >
                    <option>Wrong category</option>
                    <option>Expired</option>
                    <option>Incomplete</option>
                  </select>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "OPS_DECISION",
                        id: categoryId,
                        approve: false,
                        reason: rejectReason,
                      })
                    }
                    className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Ops rejects
                  </button>
                </div>
              </div>
            )}
          </StepRow>
        )}
      </ol>

      {cat.step === "cleared" && (
        <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          ✓ Cleared — this category is now unlocked for bidding.
        </div>
      )}

      {cat.step === "rejected" && (
        <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Rejected — {cat.rejectReason}.{" "}
          <button
            onClick={() => dispatch({ type: "RESUBMIT_CATEGORY", id: categoryId })}
            className="ml-2 font-semibold underline"
          >
            Resubmit or choose different category
          </button>
        </div>
      )}
    </div>
  );
}

function StepRow({
  label,
  done,
  active,
  children,
}: {
  label: string;
  done: boolean;
  active: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-indigo-600 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? "✓" : "•"}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${active ? "font-semibold text-slate-800" : "text-slate-600"}`}>
          {label}
        </p>
        {children}
      </div>
    </li>
  );
}
