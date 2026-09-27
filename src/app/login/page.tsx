"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { HelpInfo } from "@/components/HelpInfo";

export default function LoginPage() {
  const { dispatch } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("bidder@steelworks.example");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = () => {
    dispatch({ type: "LOGIN" });
    router.push("/kyc");
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Log in as bidder
          <HelpInfo phase="Scope note">
            This represents an existing, already-registered bidder account. New
            account signup and onboarding are out of scope for this demo — the
            prototype begins at the point a bidder has an account and needs to
            declare trade categories and get KYC-cleared before they can bid.
          </HelpInfo>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cosmetic fields only — clicking &ldquo;Log in&rdquo; always succeeds.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Log in
        </button>

        <p className="mt-4 text-xs text-slate-400">
          On login, the mock bidder is initialized: trust score 50 (Medium tier),
          concurrent-lot cap 3, zero bids placed, zero open lots, zero consecutive
          defaults, no categories cleared.
        </p>
      </div>
    </div>
  );
}
