// app/bootstrap.client.ts
"use client";

import { useUserStore } from "@/store/store";
import { getMePlayer } from "@/lib/api";

// Ce code sera exécuté une seule fois au démarrage du client
(async () => {
  const { token, setToken, setProfile, setLoading } = useUserStore.getState();

  setLoading(true);

  try {
    if (token) {
      const profile = await getMePlayer(token);

      setProfile(profile);
    } else {
      setProfile(null);
    }
  } catch (err) {
    console.error("Auth bootstrap error:", err);
    setToken(null);
    setProfile(null);
  } finally {
    setLoading(false);
  }
})();
