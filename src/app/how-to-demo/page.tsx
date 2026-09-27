export default function HowToDemoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-slate-900">How to demo this</h1>
      <p>
        Suggested click-through order for a live presentation, with the edge case to
        trigger at each step.
      </p>

      <ol className="list-decimal space-y-4 pl-5">
        <li>
          <strong>Login</strong> — log in as bidder. Point out the header initializes to
          score 50 / Medium / cap 3.
        </li>
        <li>
          <strong>KYC (A)</strong> — select a non-restricted category (instant clear),
          then select <em>Hazardous waste</em>. Submit a certificate and simulate
          &ldquo;Registry match found&rdquo; to show it clears automatically with{" "}
          <em>no manual review at all</em>. Resubmit and this time simulate
          &ldquo;Registry unavailable&rdquo; or &ldquo;OCR misread&rdquo; to show it
          routes to Ops (never the seller) for a manual decision — show an Ops
          rejection with a reason, then resubmit and get Ops approval. Point at the
          disabled &ldquo;Detected as forged&rdquo; button as a named limitation. Open
          the KYC knowledge base to show the accumulating log.
        </li>
        <li>
          <strong>Browse (E)</strong> — expand a cost breakdown to show no hidden fields,
          point at the disclosed-variance note on lot-1/lot-4. Submit a &ldquo;Report a fee
          issue&rdquo; complaint, then go to My complaints and cycle its status through
          Open → Under review → Resolved.
        </li>
        <li>
          <strong>Lot detail & pre-bid gate (A+C)</strong> — open a lot in a category
          that&rsquo;s <em>not</em> cleared yet (e.g. copper wire / non-ferrous, before
          clearing it) to show Gate 1 blocking, and click through to KYC to show the
          exact category highlighted with a &ldquo;KYC required for this category&rdquo;
          note, rather than a generic message. Then clear it, return, and show Gate 2:
          the Approve button stays disabled until you scroll the terms box to the
          bottom. Switch lots to prove the gate re-triggers with no memory.
        </li>
        <li>
          <strong>Bidding (B)</strong> — open a lot&rsquo;s bidding page and point out
          the running countdown timer and the full bid ladder (who bid what). Place a
          bid at the new-bidder cap, then try to place another — note the cap ceiling
          does <em>not</em> move just because you bid, since it&rsquo;s pinned to other
          bidders&rsquo; highest bid. Use the &ldquo;Simulate rival bid&rdquo; presenter
          box to raise the market highest bid and show the cap ceiling move in response.
          Place 3 bids total as a new bidder to show the 10% cap message, then a 4th to
          show the &ldquo;cap lifted&rdquo; banner. Use the admin panel to set trust
          score to 0 and show the concurrent-lot cap floor never drops below 1.
        </li>
        <li>
          <strong>Outcome simulation</strong> — this presenter page shows &ldquo;win&rdquo;
          outcomes only for a lot where you currently hold the highest bid; if a rival
          bid (simulated on the Bidding page) has overtaken you, it instead shows
          &ldquo;Outbid by another bidder&rdquo; with a single &ldquo;lot awarded to
          another bidder&rdquo; resolution and no score impact. On a lot you&rsquo;re
          winning: run &ldquo;Win & lift successfully&rdquo; (+5), &ldquo;Win but
          default&rdquo; three times (no action banner each time), then a 4th default to
          show the ban. Reset consecutive defaults via admin and instead run
          &ldquo;flagged as manipulation&rdquo; to show the heavier −25 penalty that does
          not count toward the ban counter. Run &ldquo;time passes&rdquo; to show score
          is unaffected by inactivity.
        </li>
        <li>
          <strong>Admin / demo controls</strong> — the panel itself has a &ldquo;How to
          use this panel&rdquo; box at the top; the short version is: drag the trust
          score slider for instant tier jumps, type + Apply for bids placed / consecutive
          defaults, and use the per-lot &ldquo;Simulate rival bid&rdquo; box on the
          Bidding page (not this panel) to move a specific lot&rsquo;s market price.
        </li>
        <li>
          <strong>Deprioritized features</strong> — close by showing Phase D and F were
          designed and consciously scoped out in favor of default-rate prevention, not
          forgotten.
        </li>
      </ol>

      <p className="text-slate-400">
        Use &ldquo;Reset demo&rdquo; in the header at any point to return to a clean
        score-50 bidder before starting a new pass.
      </p>
    </div>
  );
}
