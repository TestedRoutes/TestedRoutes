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
        // Designer palette sheet (2026-07): Brandy #943d21, Parchment
        // #f4f3ef, Coffee Bean #1f0d07, Bone #dcdacd, Icy Blue #abddfe,
        // Taupe Grey #5f524d, Tiger Flame #fe6730 (CTA, white text).
        brand: {
          cream: "#f4f3ef", // Parchment
          ink: "#1f0d07", // Coffee Bean
          terracotta: "#943d21", // Brandy
          "terracotta-soft": "#fdf3ea",
          bone: "#dcdacd",
          icy: "#abddfe",
          taupe: "#5f524d",
          flame: "#fe6730", // CTA only
        },
        // The site was built on Tailwind's cool-gray `slate` scale. Rather
        // than touch every class, the scale itself is remapped to warm
        // browns anchored to the palette sheet (900 = Coffee Bean, 600 =
        // Taupe Grey, 200 = Bone). `slate-*` here is warm, not blue-gray.
        slate: {
          50: "#f7f5f1",
          100: "#eeeae3",
          200: "#dcdacd",
          300: "#c9c1b2",
          400: "#a3988a",
          500: "#7f7264",
          600: "#5f524d",
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
