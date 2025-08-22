import { Fira_Code as FontMono, Inter as FontSans, Oswald } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontOswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});
