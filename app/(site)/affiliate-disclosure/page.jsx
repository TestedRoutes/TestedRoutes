import Link from "next/link";

export const metadata = {
  title: "Affiliate Disclosure · TestedRoutes",
  description:
    "How affiliate links work on testedroutes.com, why we use them, and which programs we participate in.",
};

const LAST_UPDATED = "8 May 2026";

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Affiliate Disclosure
        </h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We independently review everything we recommend on testedroutes.com.
          When you buy through our links, we may earn a small commission at no
          extra cost to you.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          1. How affiliate links work
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Some links on testedroutes.com are affiliate links. If you click one
          and complete a qualifying purchase on the destination site – for
          example, booking a hotel on Booking.com, a tour on GetYourGuide, or
          buying gear on Amazon – we may earn a commission. The price you pay
          is exactly the same as if you went to that site directly. There is
          never an extra cost to you.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. Independence</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Affiliate income is how we keep guide prices low and stay independent
          of any single tour operator, hotel, or platform. We pick what to
          recommend based on what we have actually tested in the field – never
          based on which program pays the highest commission. If a free or
          non-affiliated option is the best choice, we say so.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          3. Amazon Associates
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          TestedRoutes is a participant in the Amazon Services LLC Associates
          Program, an affiliate advertising program designed to provide a
          means for sites to earn advertising fees by advertising and linking
          to Amazon properties. As an Amazon Associate, TestedRoutes earns
          from qualifying purchases.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          4. Programs we participate in
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We currently participate in affiliate programs operated by, among
          others, Amazon (US, UK, DE), Booking.com, Agoda, GetYourGuide,
          Viator (CJ), Tiqets, Skyscanner, SafetyWing, and brands accessed
          through the Awin and Impact networks. The exact set may change over
          time as we add or remove partners.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          5. Where you will see this disclosure
        </h2>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            in the footer of every page;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            above the body of each guide that contains affiliate links;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            on the booking-and-affiliate-links list for each guide.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">6. Questions</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . See also our{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>{" "}
          for how affiliate redirects and tracking pixels are handled.
        </p>
      </section>
    </main>
  );
}
