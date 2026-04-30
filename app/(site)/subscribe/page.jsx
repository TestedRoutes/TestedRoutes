import Link from "next/link";
import NewsletterForm from "../../_components/NewsletterForm";

export const metadata = {
  title: "Subscribe · TestedRoutes",
  description:
    "Field-tested travel routes, in your inbox when they drop. One email per route, no spam, unsubscribe anytime.",
};

// TODO(lead-magnet): point this at the actual signed PDF URL once the
// lead-magnet asset is authored and uploaded. Tracked in
// project_backlog.md → "Author the newsletter lead-magnet PDF".
const LEAD_MAGNET_HREF = null;

const HIGHLIGHTS = [
  {
    title: "One email per route",
    body: "When a new field-tested guide drops. No drip sequences, no daily digests. Just the new route, with a short note on why it's worth your time.",
  },
  {
    title: "Honest from the inbox",
    body: "I write every issue myself. If a route surprised me, you'll know. If something didn't work, you'll hear that too – the bits that don't make it into the published guide.",
  },
  {
    title: "Reader-shaped",
    body: "Half the guides I publish started as a subscriber question. Reply to any email; it goes straight to me.",
  },
  {
    title: "Easy out",
    body: "Unsubscribe link in every email, takes one click. We never share your email or sell to third parties – see our Privacy Policy.",
  },
];

export default function SubscribePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          TestedRoutes Newsletter
        </p>
        <h1 className="mt-3 font-['Georgia',serif] text-3xl font-semibold text-slate-900 md:text-4xl">
          Field-tested travel routes, in your inbox when they drop
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          One email per new guide. Written by Paulius after he&apos;s
          actually been there. No filler, no drip sequences, no spam.
        </p>

        <div className="mt-8">
          <NewsletterForm
            variant="story"
            source="subscribe-page"
            headline="Get the next guide first"
            subhead="Drop your email below. You'll get a confirmation email (double opt-in) so we know it's really you."
          />
        </div>
      </section>

      {LEAD_MAGNET_HREF ? (
        <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">
            Free with subscribing
          </p>
          <h2 className="mt-2 font-['Georgia',serif] text-2xl font-semibold text-slate-900">
            5 best Switzerland day trips from Zurich – free PDF
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            A condensed 10-page PDF with five tested day-trips from Zurich
            HB, including transport timings, prices, and the seasonal
            window. Yours when you confirm your subscription.
          </p>
        </section>
      ) : null}

      <section className="space-y-6 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">
          What you&apos;re signing up for
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="space-y-1">
              <p className="font-['Georgia',serif] text-base font-semibold text-slate-900">
                {h.title}
              </p>
              <p className="text-sm leading-relaxed text-slate-600">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">The fine print</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We use Beehiiv to send the newsletter. Your email is stored with
          them as our processor. You can unsubscribe at any time using the
          link at the bottom of any newsletter email, or by writing to{" "}
          <a
            className="underline hover:text-slate-700"
            href="mailto:newsletter@testedroutes.com"
          >
            newsletter@testedroutes.com
          </a>
          . Full details in our{" "}
          <Link className="underline hover:text-slate-700" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
