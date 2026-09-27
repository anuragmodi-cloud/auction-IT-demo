"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!state.loggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [state.loggedIn, pathname, router]);

  if (!state.loggedIn && pathname !== "/login") return null;
  return <>{children}</>;
}
