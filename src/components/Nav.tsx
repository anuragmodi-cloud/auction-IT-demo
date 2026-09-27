"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const ITEMS = [
  { href: "/login", label: "Login" },
  { href: "/kyc", label: "KYC (A)" },
  { href: "/browse", label: "Browse (E)" },
  { href: "/lot/lot-1", label: "Lot detail & pre-bid gate (A+C)" },
  { href: "/lot/lot-1/bid", label: "Bidding (B)" },
  { href: "/outcomes", label: "Outcome simulation" },
  { href: "/deprioritized", label: "Deprioritized (D, F)" },
  { href: "/admin", label: "Admin / demo controls" },
  { href: "/how-to-demo", label: "How to demo this" },
];

export function Nav({
  open,
  onNavigate,
}: {
  open?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { state } = useStore();

  if (!state.loggedIn) return null;

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-40 w-64 -translate-x-full overflow-y-auto border-r border-slate-200 bg-slate-50 p-3 transition-transform duration-200 ease-out md:static md:z-auto md:w-60 md:shrink-0 md:translate-x-0 ${
        open ? "translate-x-0" : ""
      }`}
    >
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Buyer journey
      </div>
      <ul className="space-y-1">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/login" && pathname.startsWith(item.href) && item.href !== "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active
                    ? "bg-indigo-600 text-white font-medium"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
