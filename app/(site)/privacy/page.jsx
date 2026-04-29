import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · TestedRoutes",
  description:
    "How TestedRoutes handles your data: what we collect, what we don't, and the third parties we work with.",
};

const LAST_UPDATED = "29 April 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We try to collect as little personal data as possible. We do not run
          marketing trackers, retargeting pixels, or session replay. We do not
          store cookies or persistent identifiers on your device for analytics.
          This page explains exactly what we do collect and why.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Who is responsible for your data</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The data controller for testedroutes.com is{" "}
          <strong>MB TestedRoutes</strong>, a small private company (mažoji
          bendrija) registered in Lithuania.
        </p>
        <p className="text-xs text-slate-500">
          Legal entity details:{" "}
          <strong>
            [Company code · Registered address · VAT number — to be completed on
            registration]
          </strong>
          . Contact:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. What we collect, and why</h2>

        <h3 className="text-sm font-semibold text-slate-900">Newsletter signup</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          When you subscribe to our newsletter we collect your email address and,
          optionally, your preferred language and the part of the site you
          subscribed from (e.g. footer, top banner). We use this to send you the
          newsletter and to confirm your subscription via double opt-in. Legal
          basis: your consent (Art. 6(1)(a) GDPR), withdrawable at any time.
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Purchases</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          When you buy a guide, the transaction is processed by{" "}
          <strong>Polar Software Inc.</strong> as our Merchant of Record. Polar
          collects the details needed to take payment and issue an invoice
          (typically your email, billing country and payment method) under{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar's Privacy Policy
          </a>
          . We receive only the information needed to fulfil the order
          (typically the order ID, product purchased, and the buyer's email so we
          can deliver the guide and respond to support questions). Legal basis:
          performance of the contract for the digital guide (Art. 6(1)(b) GDPR).
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Analytics</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use PostHog to understand how the site is used (e.g. which guides
          are viewed, which buttons are clicked). Our PostHog setup is
          configured for in-memory storage only — no cookies, no localStorage,
          no persistent device identifiers. Each page view is effectively
          anonymous and is not linked across sessions. We also do not capture
          your IP address. Legal basis: legitimate interest in measuring site
          usage (Art. 6(1)(f) GDPR), balanced against the minimal nature of the
          data.
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Error tracking</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use Sentry to capture technical errors so we can fix bugs. Sentry
          is configured to not capture personal information, IP addresses, or
          cookies. Legal basis: legitimate interest in keeping the site secure
          and functional (Art. 6(1)(f) GDPR).
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Strictly necessary cookies</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use one cookie, <code>tr_currency</code>, to remember the currency
          you've selected to view prices in. It contains a 3-letter currency
          code (e.g. <code>EUR</code>) — nothing else. This is a strictly
          necessary cookie for the site's functionality and does not require
          consent.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. Who we share your data with</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We only share data with service providers who help us run the site.
          They process data on our behalf, under contracts that meet GDPR
          requirements:
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Vercel</strong> — hosting and content delivery for
              testedroutes.com.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Sanity</strong> — content management for our guides and
              stories.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Beehiiv</strong> — newsletter delivery.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Polar Software Inc.</strong> — payment processing and
              merchant of record for purchases.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>PostHog</strong> — anonymous, cookie-free site analytics.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Sentry</strong> — technical error tracking with no
              personal data.
            </span>
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          Some of these providers are based in or transfer data to countries
          outside the European Economic Area (notably the United States). Where
          that's the case, transfers rely on the European Commission's Standard
          Contractual Clauses or the EU–US Data Privacy Framework adequacy
          decision, as applicable.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. How long we keep your data</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Newsletter subscribers:</strong> until you unsubscribe.
              You can unsubscribe at any time using the link in any newsletter
              email.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Order records:</strong> kept for as long as required for
              accounting and tax purposes under Lithuanian law (typically 10
              years).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Analytics:</strong> anonymous and not linked to you, so
              no personal retention applies.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Error logs:</strong> 90 days, our Sentry retention default.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Your rights</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Under the GDPR you have the right to: access the personal data we
          hold about you, ask us to correct it if it's wrong, ask us to delete
          it, restrict or object to certain processing, and ask for a portable
          copy. To exercise any of these rights, email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . We aim to respond within one month.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          You also have the right to lodge a complaint with a supervisory
          authority. In Lithuania this is the State Data Protection
          Inspectorate (Valstybinė duomenų apsaugos inspekcija) at{" "}
          <a
            className="underline"
            href="https://vdai.lrv.lt"
            target="_blank"
            rel="noopener noreferrer"
          >
            vdai.lrv.lt
          </a>
          . If you live in another EU country you can also complain to your
          local data protection authority.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">6. Children</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The site is not directed at children under 16, and we do not knowingly
          collect data from them.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">7. Changes to this policy</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If we change how we handle data — for example by adding a new
          analytics tool — we'll update this page and bump the "last updated"
          date. Material changes will be announced on the site or, where
          appropriate, by email.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">8. Contact</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Privacy questions:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . See also our{" "}
          <Link className="underline" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/refund-policy">
            Refund Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
