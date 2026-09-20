import { redirect } from "next/navigation";

/** Spots is the country root; the old /spots URL redirects there. */
export default async function SpotsRedirect({ params }) {
  const { country } = await params;
  redirect(`/reader/${country}`);
}
