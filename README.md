# AuctionIT — Buyer Journey & Risk Management Prototype

A clickable, multi-page prototype demonstrating a proposed buyer journey and
risk-management system for AuctionIT, a B2B industrial scrap auction platform.
Built for a product-management case study presentation: every screen is real
and navigable, with an in-app "?" explaining the product rationale behind each
step, not just the happy path.

No real backend, auth, or database — all state lives in an in-memory React
context that persists only for the browser session and resets via the
"Reset demo" button in the header.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll land on the login page.

## Where things are

- `src/lib/store.tsx` — the mock bidder state machine (trust score, tier, caps,
  KYC category state, complaints, KB, resolved lots) via React Context + reducer.
- `src/lib/mockData.ts` — the 5 mock lots, category definitions, seeded KYC
  knowledge-base rows.
- `src/app/*` — one route per journey step (login, kyc, browse, lot detail,
  bidding, outcomes, deprioritized, admin), matching the phases in the spec.
- `src/components/HelpInfo.tsx` — the "?" popover used everywhere to explain
  the underlying design rationale for a step.
- `src/app/how-to-demo/page.tsx` — the in-app presenter script: recommended
  click-through order and which edge case to trigger at each step.

## Recommended demo order

See the in-app **How to demo this** page (also in the left nav) for the full
click-through script, including which edge cases to trigger at each step
(registry outcomes, price cap lift, concurrent-lot cap, consecutive-default
ban, manipulation flag, and the inactivity non-effect on trust score).
