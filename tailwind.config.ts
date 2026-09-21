import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006194",
          container: "#007bb9",
          fixed: "#cce5ff",
          dim: "#93ccff",
        },
        secondary: {
          DEFAULT: "#855300",
          container: "#fea619",
          fixed: "#ffddb8",
        },
        tertiary: {
          DEFAULT: "#006947",
          container: "#00855b",
          fixed: "#6ffbbe",
        },
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#cbdbf5",
          low: "#eff4ff",
          lowest: "#ffffff",
          container: "#e5eeff",
          high: "#dce9ff",
          highest: "#d3e4fe",
        },
        "on-surface": "#0b1c30",
        "on-surface-variant": "#3f4850",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        outline: "#707881",
        "outline-variant": "#bfc7d2",
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
      },
      fontFamily: {
        sans: ["var(--font-vietnam)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
