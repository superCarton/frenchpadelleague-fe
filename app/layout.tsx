import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Suspense } from "react";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontOswald } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import PadelLoader from "@/components/padelLoader";
import EmailConfirmationBanner from "@/components/emailConfirmationBanner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicons/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="fr">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-oswald antialiased",
          fontOswald.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
              <EmailConfirmationBanner />
            </div>
            <main className="pt-[64px] w-full bg-gray-50 text-gray-800">
              <Suspense fallback={<PadelLoader />}>{children}</Suspense>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
