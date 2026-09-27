export default function DeprioritizedPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <span className="inline-block rounded bg-slate-300 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Reference only — consciously scoped out, not forgotten
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-slate-500">Deprioritized features</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 opacity-75">
        <h2 className="text-sm font-semibold text-slate-600">Runner-up EMD fallback (Phase D)</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Would have held the immediate runner-up bidder&rsquo;s EMD (earnest money
          deposit) at auction close, and if the winner defaulted, offered the lot to that
          runner-up with a 24-hour accept/decline window that auto-expires if unanswered.
          Deprioritized because it solves lot recovery and clear-rate after a default has
          already happened, rather than preventing the default in the first place — and
          default-rate prevention is this design&rsquo;s chosen focus area.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 opacity-75">
        <h2 className="text-sm font-semibold text-slate-600">Post-auction wait (Phase F)</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Would have let a seller opt in to a 30-minute post-auction window to accept a
          below-reserve bid rather than the lot going unsold. Deprioritized for the same
          reason as Phase D — it is a clear-rate lever aimed at closing more sales, not a
          default-rate lever aimed at preventing the failures this design targets.
        </p>
      </div>
    </div>
  );
}
