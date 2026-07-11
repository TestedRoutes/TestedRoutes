/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Wired to next/font variables set on <html> in app/layout.jsx.
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Palette sampled from the designer's guide PDF (Figma export,
        // 2026-07): terracotta headers #943d21, ink text #1f0d07, cream
        // page #f4f3ef, mint badges #8aebd4, beige info cards #e2ded2.
        brand: {
          cream: "#f4f3ef",
          ink: "#1f0d07",
          terracotta: "#943d21",
          "terracotta-soft": "#fdf3ea",
          mint: "#8aebd4",
          sand: "#e2ded2",
        },
        // The site was built on Tailwind's cool-gray `slate` scale. Rather
        // than touch every class, the scale itself is remapped to warm
        // browns anchored to the guide palette (900 = brand ink, 200 ≈ the
        // PDF's beige card). `slate-*` here is warm, not blue-gray.
        slate: {
          50: "#f7f5f1",
          100: "#eeeae3",
          200: "#e2ded2",
          300: "#c9c1b2",
          400: "#a3988a",
          500: "#7f7264",
          600: "#665a4d",
          700: "#4d4136",
          800: "#352920",
          900: "#1f0d07",
          950: "#140803",
        },
      },
    },
  },
  plugins: [],
};
