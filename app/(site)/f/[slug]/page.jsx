import { loadGuideBySlug } from "../../../_lib/loadGuides";
import FeedbackFormOpen from "./FeedbackFormOpen";

// /f/{slug} — the landing page for the feedback QR printed in the guide PDF
// (Tracker #58, Corrections section of the back-of-guide block). Deliberately
// short-pathed: this URL lives inside a QR code, and every character costs
// print density. Open submission, no buyer gate — see FeedbackFormOpen.
//
// The page renders even for a slug that matches no published guide: a QR is
// printed and frozen, so a typo'd or since-renamed slug must still land a
// reader somewhere the form works. The slug is recorded on the submission
// either way, which is itself the signal that a printed code is mislabelled.

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await loadGuideBySlug(String(slug || "").toLowerCase()).catch(() => null);
  return {
    title: guide?.title ? `Fix the guide: ${guide.title}` : "Fix the guide",
    // A utility page reached from print — nothing here for search to index,
    // and 100+ thin near-duplicate form pages would only dilute the site.
    robots: { index: false, follow: false },
  };
}

export default async function FeedbackQrPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = String(rawSlug || "").toLowerCase().trim();
  const guide = await loadGuideBySlug(slug).catch(() => null);

  return (
    <main className="min-h-screen w-full pb-16 pt-12 text-slate-900 md:pt-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {guide?.title || "TestedRoutes guide"}
          </p>
          <h1 className="font-serif font-normal leading-[1.1] text-brand-ink text-2xl md:text-4xl">
            Spotted something on the trip?
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            A closed trail, a changed fare, a better option – tell us and it
            fixes the guide for the next traveller. A person reads every note,
            and we typically respond within 24 hours when you leave an email.
          </p>
        </div>

        <FeedbackFormOpen guideSlug={slug} />

        <p className="text-xs text-slate-500">
          Prefer email? Write to{" "}
          <a
            href="mailto:hello@testedroutes.com"
            className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            hello@testedroutes.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
