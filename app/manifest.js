// Web app manifest — gives Android/Chrome a proper home-screen icon and
// name. The site is a regular website, not a PWA, hence display: browser.
export default function manifest() {
  return {
    name: "TestedRoutes",
    short_name: "TestedRoutes",
    description:
      "Premium travel guides built from 15 years of independent travel across 140 countries.",
    start_url: "/",
    display: "browser",
    background_color: "#f4f3ef",
    theme_color: "#f4f3ef",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
