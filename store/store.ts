import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Player } from "@/lib/interfaces";

interface UserStore {
  profile: Player | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setProfile: (profile: Player | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      token: null,
      loading: true, // par défaut en attente
      setToken: (token) => set({ token }),
      setProfile: (profile) => set({ profile, loading: false }),
      logout: () => set({ profile: null, token: null, loading: false }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "fpl-storage",
    }
  )
);
