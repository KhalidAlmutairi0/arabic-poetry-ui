import type { Config } from "tailwindcss";

export default {
  darkMode: "class" as const,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verse: "var(--verse)",
        "verse-highlight": "var(--verse-highlight)",
        "poet-accent": "var(--poet-accent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
