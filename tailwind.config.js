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
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        bronze: {
          light: "#b25e32",
          DEFAULT: "#6f3310",
          dark: "#3a1b0a",
        },
        silver: {
          light: "#d9d9d9",
          DEFAULT: "#c0c0c0",
          dark: "#8a8a8a",
        },
        gold: {
          light: "#ffe066",
          DEFAULT: "#ffd700",
          dark: "#bfa600",
        },
        premium: {
          light: "#333333",
          DEFAULT: "#000000",
          dark: "#000000",
        },
        legend: {
          light: "#f2f2f2",
          DEFAULT: "#e5e4e2",
          dark: "#bfbfbf",
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
