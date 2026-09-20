import { redirect } from "next/navigation";

export default async function BookingsRedirect({ params }) {
  const { country } = await params;
  redirect(`/reader/${country}/tips/bookings`);
}
