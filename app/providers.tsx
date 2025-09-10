"use client";

import "./bootstrap.client"; // runs once when Providers is mounted

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

import PadelLoader from "@/components/common/padelLoader";
import { useUserStore } from "@/store/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [showSplash, setShowSplash] = React.useState(true);
  const [fadeOut, setFadeOut] = React.useState(false);
  const [hasBootstrapped, setHasBootstrapped] = React.useState(false);

  const { loading } = useUserStore();

  React.useEffect(() => {
    if (!loading) {
      // quand loading passe à false, on attend 5s avant de cacher
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowSplash(false);
          setHasBootstrapped(true);
        }, 1000); // durée du fade
      }, 5000); // attente avant fade

      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <div className="fixed z-[100]">
          <ToastProvider placement="top-right" toastOffset={70} toastProps={{ timeout: 10000 }} />
        </div>

        {/* Splash uniquement au bootstrap */}
        {showSplash && !hasBootstrapped && (
          <div
            className={`
              z-100
              fixed inset-0 z-50 flex items-center justify-center bg-black
              transition-opacity duration-1000
              ${fadeOut ? "opacity-0" : "opacity-100"}
            `}
          >
            <PadelLoader />
          </div>
        )}

        {/* App */}
        <div>{children}</div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
