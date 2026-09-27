"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Home() {
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    router.replace(state.loggedIn ? "/browse" : "/login");
  }, [state.loggedIn, router]);

  return null;
}
