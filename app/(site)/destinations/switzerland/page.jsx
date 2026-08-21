import SwitzerlandFilters from "./SwitzerlandFilters";

export const metadata = {
  title: "Explore Switzerland · TestedRoutes",
  description:
    "Self-guided travel routes across Switzerland – day trips, weekend trips, and multi-day itineraries you can follow independently.",
  alternates: { canonical: "/destinations/switzerland" },
};

export default function SwitzerlandPage() {
  return <SwitzerlandFilters />;
}
