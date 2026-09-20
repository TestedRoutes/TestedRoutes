import { redirect } from "next/navigation";

/** The place grid lives at /places; the old /spots URL redirects there (place pages stay at /spots/<pin>). */
export default async function SpotsRedirect({ params }) {
  const { country } = await params;
  redirect(`/reader/${country}/places`);
}
