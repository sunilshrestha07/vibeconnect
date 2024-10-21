import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      fontFamily: {
        Italianno: ["Italianno", "cursive"],
      },
      height: {
        'screen-minus-2rem': 'calc(100vh - 5.5rem)',
      },
    },
  },
  plugins: [],
};
export default config;
