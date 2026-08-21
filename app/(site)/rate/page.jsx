import RateExperience from "./RateExperience";

// Landing page for the day-14 rating email's star links (Tracker #62).
// The rating is recorded by the client component after the page renders,
// not by this server render — email link-scanners fetch every URL in a
// message, and recording on the request would log phantom bot ratings.
// Scanners don't run the JavaScript, so they record nothing here.
export const metadata = {
  title: "Rate your trip · TestedRoutes",
  description: "Tell us how the guide held up.",
  robots: { index: false, follow: false },
};

export default async function RatePage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  const starsRaw = Number(params?.stars);
  const initialStars =
    Number.isInteger(starsRaw) && starsRaw >= 1 && starsRaw <= 5 ? starsRaw : 0;

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col px-6 pb-16 pt-12">
      <RateExperience token={token} initialStars={initialStars} />
    </main>
  );
}
