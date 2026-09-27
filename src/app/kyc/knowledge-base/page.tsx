"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";

export default function KnowledgeBasePage() {
  const { state } = useStore();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          KYC knowledge base
          <HelpInfo phase="A — reference">
            This read-only table shows every certificate submitted for a restricted
            category and its final outcome. It is seeded with a few example rows so it
            demonstrates the concept immediately; new rows are appended live as the
            presenter runs certificates through the KYC flow. Over time this becomes the
            evidence base for calibrating which documents are actually required per
            category, and how often each rejection reason occurs.
          </HelpInfo>
        </h1>
        <Link href="/kyc" className="mt-1 inline-block text-sm text-indigo-600 hover:underline">
          ← Back to KYC
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Documents required</th>
              <th className="px-4 py-3">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {state.kb.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium text-slate-800">{row.category}</td>
                <td className="px-4 py-3 text-slate-600">{row.documentsRequired}</td>
                <td className="px-4 py-3 text-slate-600">{row.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
