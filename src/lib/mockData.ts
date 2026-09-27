import { BidEntry, CategoryDef, KbRow, Lot } from "./types";

export const CATEGORY_DEFS: CategoryDef[] = [
  { id: "ferrous", label: "Ferrous scrap", restricted: false },
  { id: "nonferrous", label: "Non-ferrous scrap", restricted: false },
  { id: "machinery", label: "Used machinery", restricted: false },
  { id: "surplus", label: "Surplus inventory", restricted: false },
  {
    id: "hazardous",
    label: "Hazardous waste",
    restricted: true,
    documentsRequired: "Hazardous waste handling certificate + state pollution control board authorization",
  },
  {
    id: "chemical",
    label: "Chemical drums & residues",
    restricted: true,
    documentsRequired: "Chemical handling license + transport compliance certificate",
  },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORY_DEFS.map((c) => [c.id, c.label])
);

const LOTS_BASE: Omit<Lot, "initialBidHistory">[] = [
  {
    id: "lot-1",
    name: "80 MT mixed steel scrap — Plant X",
    category: "ferrous",
    quantity: "80 MT",
    reservePrice: 2_400_000,
    currentBid: 2_450_000,
    bidCount: 6,
    location: "Bhiwadi, Rajasthan",
    description:
      "Mixed HMS 1&2 steel scrap generated from decommissioned press-shop line. Pre-sorted, no oil contamination reported.",
    imagePlaceholder: "🔩",
    hammerRangeLow: 2_400_000,
    hammerRangeHigh: 2_650_000,
    feePct: 2.5,
    taxPct: 18,
    charges: [
      { name: "Loading charge", amount: 18_000 },
      { name: "Weighment charge", amount: 6_000 },
    ],
    varianceNote:
      "Final charge may vary with actual weighed quantity — this is a disclosed variance, not a hidden fee.",
    sellerTerms: `SELLER TERMS & CONDITIONS — LOT lot-1

1. LIFT WINDOW: The winning bidder must complete material lifting within 5 (five) working days from the date of full payment realization. Requests for extension beyond this window are subject to a demurrage charge of ₹5,000/day, payable directly to the seller.

2. PAYMENT DEADLINE: Full payment (hammer price + AuctionIT fee + applicable taxes) must be remitted within 48 hours of auction close. Failure to remit within this window will be treated as a default under AuctionIT's Trust Score policy.

3. SITE ACCESS RULES: Lifting operations may only take place between 09:00 and 17:00 IST on working days. All personnel entering Plant X premises must carry a valid government-issued photo ID and comply with the seller's on-site safety induction, including mandatory PPE (helmet, safety shoes, hi-vis vest). Vehicles above 16-wheel configuration are not permitted due to internal road width restrictions.

4. REQUIRED DOCUMENTS RECAP: Buyer must present (a) proof of payment, (b) GST registration certificate, (c) a valid weighbridge slip acknowledgment at the time of lifting, and (d) if applicable, category-specific clearance certificates as verified during KYC.

5. QUANTITY VARIANCE: The reserve price and cost breakdown shown are based on the seller's declared quantity. Actual quantity will be confirmed via weighbridge at the time of lifting, and final settlement will be adjusted pro-rata. This variance is disclosed and is not considered a hidden fee.

6. RISK TRANSFER: Risk in the goods passes to the buyer only upon completion of weighment and issuance of a signed gate-pass at the seller's premises, not upon auction close.

7. DISPUTE RESOLUTION: Any dispute regarding quality, quantity or condition of goods must be raised in writing within 24 hours of lifting, accompanied by photographic evidence. Disputes raised after this window will not be entertained by AuctionIT or the seller.

Please scroll to the end and click "Approve & continue" to confirm you have read and understood these terms before proceeding to bid.`,
  },
  {
    id: "lot-2",
    name: "12 MT copper wire scrap — Unit 4",
    category: "nonferrous",
    quantity: "12 MT",
    reservePrice: 6_800_000,
    currentBid: 6_950_000,
    bidCount: 11,
    location: "Vapi, Gujarat",
    description:
      "Bare bright copper wire scrap from cable stripping operations, no insulation/PVC content.",
    imagePlaceholder: "🧵",
    hammerRangeLow: 6_800_000,
    hammerRangeHigh: 7_300_000,
    feePct: 2.5,
    taxPct: 18,
    charges: [
      { name: "Loading charge", amount: 9_000 },
      { name: "Weighment charge", amount: 4_000 },
      { name: "Security escort charge", amount: 12_000 },
    ],
    varianceNote: null,
    sellerTerms: `SELLER TERMS & CONDITIONS — LOT lot-2

1. LIFT WINDOW: Buyer must lift material within 3 (three) working days of payment realization, given the high resale value and security considerations attached to non-ferrous material.

2. PAYMENT DEADLINE: Full payment must be remitted within 24 hours of auction close. Non-ferrous lots carry a shorter payment window than ferrous lots due to price volatility.

3. SITE ACCESS RULES: Only pre-registered vehicles with driver ID verified 24 hours in advance will be permitted entry. All lifting is escorted by seller security personnel; unescorted movement within the yard is prohibited.

4. REQUIRED DOCUMENTS RECAP: Buyer must present proof of payment, GST registration, PAN copy, and (if the buyer's declared trade category is non-ferrous) their cleared KYC confirmation screen.

5. QUANTITY VARIANCE: None expected for this lot — material was pre-weighed and sealed prior to listing.

6. RISK TRANSFER: Risk transfers upon seller's security team countersigning the gate-pass, not upon auction close or payment.

7. DISPUTE RESOLUTION: Disputes on purity/grade must be raised within 12 hours of lifting with an independent assay report; the seller's original assay certificate (available on request) will be the reference document.

Please scroll to the end and click "Approve & continue" to confirm you have read and understood these terms before proceeding to bid.`,
  },
  {
    id: "lot-3",
    name: "3 CNC lathes (2015–2017) — surplus line",
    category: "machinery",
    quantity: "3 units",
    reservePrice: 1_150_000,
    currentBid: 1_150_000,
    bidCount: 2,
    location: "Pune, Maharashtra",
    description:
      "Used CNC lathes retired from a surplus production line, sold as-is, functional at time of listing.",
    imagePlaceholder: "⚙️",
    hammerRangeLow: 1_150_000,
    hammerRangeHigh: 1_400_000,
    feePct: 3,
    taxPct: 18,
    charges: [
      { name: "Rigging & dismantling charge", amount: 35_000 },
      { name: "Loading charge", amount: 15_000 },
    ],
    varianceNote: null,
    sellerTerms: `SELLER TERMS & CONDITIONS — LOT lot-3

1. LIFT WINDOW: 10 (ten) working days from payment realization, to allow for professional rigging and dismantling coordination.

2. PAYMENT DEADLINE: Full payment within 72 hours of auction close.

3. SITE ACCESS RULES: Rigging contractors must be pre-approved by the seller's facilities team and carry valid insurance. Crane/forklift movement inside the shop floor requires a seller-issued permit.

4. REQUIRED DOCUMENTS RECAP: Proof of payment, GST registration, rigging contractor's insurance certificate, and site safety undertaking.

5. CONDITION DISCLOSURE: Machines are sold strictly as-is, where-is. The seller makes no warranty as to calibration accuracy or remaining tooling life. Buyer is encouraged to inspect before bidding.

6. RISK TRANSFER: Risk transfers upon signed handover at the loading bay.

7. DISPUTE RESOLUTION: Given as-is sale terms, disputes on machine condition are not eligible for resolution after auction close; pre-bid inspection is the buyer's sole remedy.

Please scroll to the end and click "Approve & continue" to confirm you have read and understood these terms before proceeding to bid.`,
  },
  {
    id: "lot-4",
    name: "220 drums — industrial solvent residue",
    category: "hazardous",
    quantity: "220 drums (200L)",
    reservePrice: 980_000,
    currentBid: 1_020_000,
    bidCount: 4,
    location: "Ankleshwar, Gujarat",
    description:
      "Spent solvent residue drums from a specialty chemicals plant, classified as hazardous waste under state PCB norms. Requires valid hazardous-waste handling certification to bid.",
    imagePlaceholder: "☣️",
    hammerRangeLow: 980_000,
    hammerRangeHigh: 1_150_000,
    feePct: 3.5,
    taxPct: 18,
    charges: [
      { name: "Hazmat handling charge", amount: 45_000 },
      { name: "Transport compliance filing fee", amount: 8_000 },
      { name: "Weighment charge", amount: 5_000 },
    ],
    varianceNote:
      "Final charge may vary with actual weighed quantity — this is a disclosed variance, not a hidden fee.",
    sellerTerms: `SELLER TERMS & CONDITIONS — LOT lot-4

1. LIFT WINDOW: 5 (five) working days from payment realization, coordinated with the seller's environmental compliance officer.

2. PAYMENT DEADLINE: Full payment within 48 hours of auction close.

3. SITE ACCESS RULES: Only vehicles and drivers licensed for hazardous material transport under applicable state and central rules will be permitted. Buyer must provide a valid hazardous waste transport authorization before entry is granted.

4. REQUIRED DOCUMENTS RECAP: Hazardous waste handling certificate (verified during KYC), transport authorization, manifest acknowledgment, and proof of payment.

5. QUANTITY VARIANCE: Final charge may vary with actual weighed quantity at lifting — disclosed variance, not a hidden fee.

6. RISK TRANSFER: Risk and regulatory liability transfer to the buyer only upon signed manifest handover, per hazardous waste movement rules.

7. DISPUTE RESOLUTION: Any manifest discrepancy must be flagged to the seller's compliance officer within 6 hours of lifting.

Please scroll to the end and click "Approve & continue" to confirm you have read and understood these terms before proceeding to bid.`,
  },
  {
    id: "lot-5",
    name: "Surplus packaging & warehouse stock — Q3 clearance",
    category: "surplus",
    quantity: "1 lot (mixed pallets)",
    reservePrice: 340_000,
    currentBid: 340_000,
    bidCount: 0,
    location: "Bhiwandi, Maharashtra",
    description:
      "Mixed surplus warehouse inventory — corrugated packaging stock, pallets, and shelving being cleared ahead of a facility downsizing.",
    imagePlaceholder: "📦",
    hammerRangeLow: 340_000,
    hammerRangeHigh: 410_000,
    feePct: 2,
    taxPct: 18,
    charges: [{ name: "Loading charge", amount: 4_000 }],
    varianceNote: null,
    sellerTerms: `SELLER TERMS & CONDITIONS — LOT lot-5

1. LIFT WINDOW: 7 (seven) working days from payment realization.

2. PAYMENT DEADLINE: Full payment within 72 hours of auction close.

3. SITE ACCESS RULES: Standard warehouse visiting hours (10:00–18:00), no special permits required.

4. REQUIRED DOCUMENTS RECAP: Proof of payment and GST registration only — no restricted-category clearance needed for this lot.

5. QUANTITY VARIANCE: None — this is a fixed mixed-pallet lot sold as a single unit.

6. RISK TRANSFER: Risk transfers upon signed gate-pass at pickup.

7. DISPUTE RESOLUTION: Since this lot is likely to close below reserve if bidding is thin, note that a "no sale" outcome carries no penalty for any bidder.

Please scroll to the end and click "Approve & continue" to confirm you have read and understood these terms before proceeding to bid.`,
  },
];

const BIDDER_NAMES = [
  "Bidder-482",
  "Bidder-771",
  "Bidder-093",
  "Bidder-654",
  "Bidder-215",
  "Bidder-908",
  "Bidder-331",
  "Bidder-560",
  "Bidder-127",
  "Bidder-843",
  "Bidder-406",
];

function buildBidHistory(reservePrice: number, currentBid: number, bidCount: number): BidEntry[] {
  if (bidCount === 0) return [];
  const entries: BidEntry[] = [];
  for (let i = 0; i < bidCount; i++) {
    const t = bidCount === 1 ? 1 : i / (bidCount - 1);
    const raw = reservePrice + (currentBid - reservePrice) * t;
    const amount = Math.round(raw / 1000) * 1000;
    entries.push({ who: BIDDER_NAMES[i % BIDDER_NAMES.length], amount, isYou: false });
  }
  entries[entries.length - 1].amount = currentBid;
  return entries;
}

export const LOTS: Lot[] = LOTS_BASE.map((lot) => ({
  ...lot,
  initialBidHistory: buildBidHistory(lot.reservePrice, lot.currentBid, lot.bidCount),
}));

export const SEED_KB_ROWS: KbRow[] = [
  {
    id: "kb-seed-1",
    category: "Hazardous waste",
    documentsRequired: "State PCB hazardous waste handling authorization",
    outcome: "Cleared — registry match found, no manual review required",
  },
  {
    id: "kb-seed-2",
    category: "Hazardous waste",
    documentsRequired: "State PCB hazardous waste handling authorization",
    outcome: "Rejected by Ops — Expired certificate, bidder resubmitted with renewed cert and was cleared",
  },
  {
    id: "kb-seed-3",
    category: "Chemical drums & residues",
    documentsRequired: "Chemical handling license + transport compliance certificate",
    outcome: "Registry unavailable — routed to manual Ops review, cleared after 1 business day",
  },
];
