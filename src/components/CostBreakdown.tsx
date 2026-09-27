import { Lot } from "@/lib/types";

export function CostBreakdown({ lot }: { lot: Lot }) {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const feeAmount = Math.round((lot.hammerRangeLow * lot.feePct) / 100);
  const taxAmount = Math.round((lot.hammerRangeLow * lot.taxPct) / 100);

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
      <div className="mb-2 font-semibold text-slate-600">Full cost breakdown</div>
      <Row label="Estimated hammer price range" value={`${fmt(lot.hammerRangeLow)} – ${fmt(lot.hammerRangeHigh)}`} />
      <Row label={`AuctionIT fee (${lot.feePct}%)`} value={`≈ ${fmt(feeAmount)}`} />
      <Row label={`Applicable taxes (${lot.taxPct}% GST)`} value={`≈ ${fmt(taxAmount)}`} />
      {lot.charges.map((c) => (
        <Row key={c.name} label={c.name} value={fmt(c.amount)} />
      ))}
      {lot.varianceNote && (
        <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
          {lot.varianceNote}
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
