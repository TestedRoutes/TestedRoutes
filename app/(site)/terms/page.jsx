import Link from "next/link";

export const metadata = {
  title: "Terms of Service · TestedRoutes",
  description:
    "Terms governing the use of testedroutes.com and the purchase of TestedRoutes guides.",
};

const LAST_UPDATED = "29 April 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          These terms apply when you visit testedroutes.com and when you
          purchase a guide from us. Plain English where possible; legal
          language where it has to be.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Who we are</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          testedroutes.com is operated by <strong>MB TestedRoutes</strong>, a
          small private company (mažoji bendrija) registered in Lithuania.
        </p>
        <p className="text-xs text-slate-500">
          Legal entity details:{" "}
          <strong>
            [Company code · Registered address · VAT number – to be completed
            on registration]
          </strong>
          . Contact:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. What you agree to</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          By using the site or buying a guide you agree to these terms and to
          our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          . If you don't agree, please don't use the site.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. Our guides</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          TestedRoutes guides are digital travel guides – written by us,
          drawing on routes we have personally travelled. Each guide is
          delivered as a digital document immediately after payment.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          What &quot;tested&quot; means
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use the name <strong>TestedRoutes</strong> because every guide
          we publish is grounded in real travel – ours or, in a small number
          of cases, the trusted travel partners and contributors we work with.
          It is an honest, best-effort label, not a guarantee that every
          metre of every published route was walked, driven, or boated by us
          at the moment of publication.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Specifically, &quot;tested&quot; means:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            we have travelled the route, or
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            we have travelled significant parts of the route and have
            assembled the remainder from the best available local knowledge
            (operators, transport providers, official sources), or
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            the route has been adjusted since our last visit because something
            on the ground changed (a closure, a re-route, a permit change),
            and we have done our best to reflect that change accurately.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          If you find anything in a guide that is wrong, out of date, or no
          longer matches reality on the ground, please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . We update guides on receipt of credible reports – correcting them
          is part of the product.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Travel changes
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We work hard to keep guides accurate and up to date, but travel
          changes – transport timetables, prices, opening hours and route
          conditions all shift. The guides are advisory. You are responsible
          for your own travel decisions and your own safety.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. Payments and our payment processor</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Payments are processed by <strong>Polar Software Inc.</strong> (
          <a
            className="underline"
            href="https://polar.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            polar.sh
          </a>
          ), who acts as the <strong>Merchant of Record</strong> for the sale.
          Polar appears as the seller on your invoice, handles payment
          processing and customer billing, and is responsible for collecting
          and remitting any applicable sales taxes (including EU VAT).
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          By completing a purchase you also accept{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar's Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          for the transaction itself. Your contract for the underlying digital
          product is with us; the contract for the payment transaction is with
          Polar.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Your licence to use a guide</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          When you buy a guide we grant you a personal, non-transferable,
          worldwide licence to use it for your own travel planning. You may:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>print copies for your own use;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>share the file with members of your immediate travel party.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">You may not:</p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>redistribute the guide publicly, including on social media or file-sharing platforms;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>resell or sublicense it;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>use it for commercial trip-planning services without our written permission.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">6. Refunds</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We offer a 30-day, no-questions-asked refund on every guide. See the{" "}
          <Link className="underline" href="/refund-policy">
            Refund Policy
          </Link>{" "}
          for how to request one. This is in addition to any statutory
          consumer rights you have under the law of your country of residence.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">7. Newsletter</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If you subscribe to our newsletter, you'll receive a confirmation
          email (double opt-in). You can unsubscribe at any time using the link
          at the bottom of any newsletter email, or by writing to{" "}
          <a className="underline" href="mailto:newsletter@testedroutes.com">
            newsletter@testedroutes.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">8. Intellectual property</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          All content on testedroutes.com – guides, photographs, maps, text,
          and design – is owned by MB TestedRoutes or its licensors and is
          protected by copyright. The licence in section 5 is the only right
          you receive in our content; nothing else on the site grants you
          additional rights.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">9. Disclaimers</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The guides describe routes we have personally tested, but conditions
          change and your experience may differ. We provide the site and the
          guides "as is" and do not warrant that any specific outcome will
          follow from using them. Travel can involve risk; you are responsible
          for assessing whether a route is suitable for you and for taking
          reasonable safety precautions.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">10. Limitation of liability</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          To the maximum extent permitted by law, our total liability arising
          from your use of the site or any guide is limited to the amount you
          paid us for the guide in question. We are not liable for indirect or
          consequential losses (for example, missed connections, lost bookings,
          or trip cancellations).
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Nothing in these terms excludes or limits liability that cannot be
          excluded or limited by law, including liability for fraud or for
          death or personal injury caused by negligence.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">11. Changes to these terms</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We may update these terms from time to time. The "last updated" date
          at the top reflects the most recent revision. Material changes will
          be announced on the site or, where appropriate, by email. Continued
          use of the site after a change means you accept the updated terms.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">12. Governing law and disputes</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          These terms are governed by the laws of the Republic of Lithuania.
          If you are a consumer resident in another EU country, you also
          benefit from the mandatory consumer protections of your country of
          residence – these terms do not override those.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Disputes that we cannot resolve informally may be brought before the
          courts of Lithuania. EU consumers may also use the European
          Commission's Online Dispute Resolution platform at{" "}
          <a
            className="underline"
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">13. Contact</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Questions about these terms:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
