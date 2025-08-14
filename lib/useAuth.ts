// lib/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getToken, getCurrentUser } from "./api";

export function useAuth(required = true) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const currentUser = getCurrentUser();

    if (!token || !currentUser) {
      if (required) router.push("/login");
      setUser(null);
    } else {
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
