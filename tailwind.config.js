import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-oswald)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        bronze: {
          light: "#b25e32",
          DEFAULT: "#6f3310",
          dark: "#3a1b0a",
        },
        silver: {
          light: "#b3aea7",
          DEFAULT: "#959084",
          dark: "#6b6761",
        },
        gold: {
          light: "#f3c74d",
          DEFAULT: "#e2a21c",
          dark: "#a77414",
        },
        premium: {
          light: "#2a2a2a",
          DEFAULT: "#0b0b0b",
          dark: "#000000",
        },
        legend: {
          light: "#a52a2a",
          DEFAULT: "#820817",
          dark: "#4d040d",
        },
        quartz: {
          light: "#94189c",
          DEFAULT: "#501174",
          dark: "#2a0a57",
        },
        saphir: {
          light: "#0047d1",
          DEFAULT: "#00218f",
          dark: "#00125c",
        },
        emeraude: {
          light: "#008627",
          DEFAULT: "#003d10",
          dark: "#002f11",
        },
        rubis: {
          light: "#8b0013",
          DEFAULT: "#61000b",
          dark: "#3c0009",
        },
        diamant: {
          light: "#9b9b9c",
          DEFAULT: "#5d5c5d",
          dark: "#3e3d3d",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        radius: {
          small: 0,
          medium: 0,
          large: 0,
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#d7a63c",
            },
            secondary: {
              DEFAULT: "#3C6DD7",
            },
          },
        },
      },
    }),
    require("@tailwindcss/typography"),
  ],
};

module.exports = config;
