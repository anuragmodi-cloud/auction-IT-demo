"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Nav } from "./Nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setNavOpen((o) => !o)} />
      <div className="flex flex-1">
        {navOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}
        <Nav open={navOpen} onNavigate={() => setNavOpen(false)} />
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
