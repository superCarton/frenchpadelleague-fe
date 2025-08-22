// app/bootstrap.client.ts
"use client";

import { useUserStore } from "@/store/store";
import { getMePlayer } from "@/lib/api";

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
    setToken(null);
    setProfile(null);
  } finally {
    setLoading(false);
  }
})();
