/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["ui-serif", "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Direction palette per Brand Identity v1.0 §14. Final values pending
        // designer hand-off — treat as a starting point, not locked tokens.
        brand: {
          cream: "#f7f4ef",
          ink: "#1a1816",
          blue: "#1f3a5f",
          terracotta: "#b04a3a",
          "terracotta-soft": "#fdf3ea",
        },
      },
    },
  },
  plugins: [],
};
