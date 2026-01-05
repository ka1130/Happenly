import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"], // Inter
        geistSans: ["var(--font-geist-sans)"],
        geistMono: ["var(--font-geist-mono)"],
        heading: ["var(--font-heading)"], // Space Grotesk
      },
    },
  },
  plugins: [],
};

export default config;
