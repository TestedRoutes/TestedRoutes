import { redirect } from "next/navigation";

export default async function PackRedirect({ params }) {
  const { country } = await params;
  redirect(`/reader/${country}/tips/pack`);
}
