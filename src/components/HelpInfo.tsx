"use client";

import { useState } from "react";

export function HelpInfo({
  phase,
  children,
}: {
  phase: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle ml-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Why does this step exist?"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 text-[11px] font-bold text-slate-500 hover:bg-slate-100"
      >
        ?
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-7 z-50 w-80 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-xl">
            <div className="mb-2 inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Phase {phase}
            </div>
            <div className="text-sm leading-relaxed text-slate-700">{children}</div>
          </div>
        </>
      )}
    </span>
  );
}
