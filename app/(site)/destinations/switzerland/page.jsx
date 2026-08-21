import { redirect } from "next/navigation";
// SwitzerlandFilters stays in the tree untouched — restoring this page is
// this file's git history plus two registry lines (see _lib/destinations.js).

export const metadata = {
  title: "Explore Switzerland · TestedRoutes",
  description:
    "Self-guided travel routes across Switzerland – day trips, weekend trips, and multi-day itineraries you can follow independently.",
  alternates: { canonical: "/destinations/switzerland" },
};

// Hidden hub (founder 2026-08-21: outdated, no time to fix — it still
// carries Unsplash placeholders the brand book bans, tracker #72). The real
// 307 happens in vercel.json before this ever renders; this redirect is the
// backstop for environments that don't apply vercel.json (next dev without
// vercel dev, self-hosted builds).
export default function SwitzerlandPage() {
  redirect("/destinations");
}
