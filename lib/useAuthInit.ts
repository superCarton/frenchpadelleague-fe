"use client";

import { useEffect, useRef } from "react";

import { getMePlayer } from "./api";

import { useUserStore } from "@/store/store";

type UseAuthInitOptions = {
  onFinished?: () => void;
};

export function useAuthInit(options: UseAuthInitOptions = {}) {
  const { token, setToken, setProfile, setLoading } = useUserStore();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return; // <-- empêche relance
    didInit.current = true;
    const init = async () => {
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
        if (options.onFinished) {
          options.onFinished();
        }
      }
    };

    init();
  }, []);
}
