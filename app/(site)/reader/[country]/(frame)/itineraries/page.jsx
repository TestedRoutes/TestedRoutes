import { redirect } from "next/navigation";

/** Itineraries is the country root; the old /itineraries URL redirects there. Route pages stay at /itineraries/<sku>. */
export default async function ItinerariesRedirect({ params }) {
  const { country } = await params;
  redirect(`/reader/${country}`);
}
