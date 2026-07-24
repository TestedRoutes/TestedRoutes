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
      boxShadow: {
        // Card treatment (2026-07 style pass): soft diffuse lift, tinted with
        // Coffee Bean so shadows stay warm on the Parchment background.
        // Replaces flat shadow-sm + visible Bone ring on boxes/pills/cards.
        card: "0 1px 2px rgba(31,13,7,0.04), 0 6px 16px rgba(31,13,7,0.06)",
        "card-hover":
          "0 2px 4px rgba(31,13,7,0.05), 0 12px 28px rgba(31,13,7,0.10)",
      },
      colors: {
        // Designer palette sheet (2026-07): Brandy #943d21, Parchment
        // #f4f3ef, Coffee Bean #1f0d07, Bone #dcdacd, Icy Blue #abddfe,
        // Taupe Grey #5f524d, Tiger Flame #fe6730 (CTA, white text).
        brand: {
          // Canvas gradient lands on Parchment (Bone at top), so the
          // token backing tab bars + fallbacks is Parchment again.
          cream: "#f4f3ef",
          parchment: "#f4f3ef",
          ink: "#1f0d07", // Coffee Bean
          terracotta: "#943d21", // Brandy
          "terracotta-soft": "#fdf3ea",
          bone: "#dcdacd",
          icy: "#abddfe",
          taupe: "#5f524d",
          flame: "#fe6730", // CTA only
          // Hairline for boxes/cards: 8% Coffee Bean. Neutral and near-
          // invisible, unlike the solid Bone ring which read warm-on-warm
          // and muddy against Parchment.
          line: "rgba(31,13,7,0.08)",
          // Trip-category colors (TestedRoutes-Styleguide.pdf, 2026-07):
          // one per guide tier, used on category tags/banners. Week-Long
          // reuses the old mint hue by design - category color only, not
          // a core palette return.
          cat: {
            day: "#ffe389",
            weekend: "#ffc188",
            week: "#8aebd4",
            multi: "#ffc7e7",
            expedition: "#ff866a",
          },
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
