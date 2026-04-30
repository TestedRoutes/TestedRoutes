import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · TestedRoutes",
  description:
    "How TestedRoutes handles your data: what we collect, what we don't, and the third parties we work with.",
};

const LAST_UPDATED = "30 April 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We try to collect as little personal data as possible. Today we run
          no marketing trackers, retargeting pixels, or session replay – our
          analytics is configured for in-memory storage only and does not
          set cookies. As we begin running paid marketing campaigns
          (Meta, Google Ads, YouTube, TikTok, Pinterest, Reddit, X), we will
          add the corresponding trackers and ask for your consent before any
          of them fire. The current state, and the planned trackers, are
          listed under &quot;Marketing and advertising&quot; below.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Who is responsible for your data</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The data controller for testedroutes.com is{" "}
          <strong>MB TestedRoutes</strong>, a small private company (mažoji
          bendrija) registered in Lithuania. Full entity details (company
          code, registered address, VAT) are on our{" "}
          <Link className="underline" href="/legal-notice">
            Legal Notice
          </Link>{" "}
          page. Privacy and data-protection contact:{" "}
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
          collects the details needed to take payment, issue an invoice, and
          comply with payment-card and tax-reporting rules. Per{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar&apos;s Privacy Policy
          </a>
          , this typically includes your name, email address, phone number
          (if provided), billing address, payment-card type and last four
          digits, business name and tax number (if you check the
          &quot;purchasing as a business&quot; box at checkout), and the
          IP-address-based coarse geolocation of your device. Polar in turn
          uses <strong>Stripe, Inc.</strong> as their payment processor for
          the actual card-handling step (see{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/payment-processing-partners"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar&apos;s payment-processing partners
          </a>
          ). Polar also engages additional sub-processors (hosting, email,
          error-reporting, support tooling) listed at{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/sub-processors"
            target="_blank"
            rel="noopener noreferrer"
          >
            polar.sh/legal/sub-processors
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          We (TestedRoutes) receive only the information needed to fulfil
          the order: typically the order ID, the product purchased, and your
          email address (so we can deliver the guide and respond to support
          questions). We do not receive your full payment-card data – Polar
          and Stripe handle that. Legal basis: performance of the contract
          for the digital guide (Art. 6(1)(b) GDPR).
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Analytics</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use PostHog to understand how the site is used (e.g. which guides
          are viewed, which buttons are clicked). Our PostHog setup is
          configured for in-memory storage only – no cookies, no localStorage,
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
          We use a small number of strictly necessary cookies. These keep the
          site working and do not require your consent under EU ePrivacy /
          GDPR rules.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs leading-relaxed text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">Name</th>
                <th scope="col" className="px-4 py-2 font-semibold">Purpose</th>
                <th scope="col" className="px-4 py-2 font-semibold">Lifetime</th>
                <th scope="col" className="px-4 py-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-2">
                  <code>tr_currency</code>
                </td>
                <td className="px-4 py-2">
                  Remembers the currency you&apos;ve selected to view prices
                  in (3-letter currency code, e.g. <code>EUR</code>).
                </td>
                <td className="px-4 py-2">365 days</td>
                <td className="px-4 py-2">Strictly necessary</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">
          We do not currently use any analytics, marketing, or advertising
          cookies. If we add any in future, this table will list them and we
          will ask for your consent before they fire – see &quot;Marketing
          and advertising&quot; below.
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Affiliate links</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Some of the links in our guides and on the &quot;Get the links
          free&quot; pages are affiliate links: when you click and complete a
          purchase on the destination site (for example, a hotel booking, a
          tour, or a piece of gear) we earn a commission, at no extra cost
          to you. Affiliate links are how we keep guide prices low and keep
          ourselves independent.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          We use affiliate platforms including, where relevant, Amazon
          Associates, Booking.com, GetYourGuide, Viator (CJ), Tiqets,
          SafetyWing, Skyscanner, Awin, and Impact.com. When you click an
          affiliate link, the destination site may set its own cookies on
          your device per its own privacy policy; we do not control those
          cookies and they are subject to the destination site&apos;s
          disclosures, not ours. Where we add tracking pixels for these
          platforms on testedroutes.com itself (for example, Awin&apos;s
          MasterTag for conversion tracking), they are listed in the cookie
          table above and gated behind your consent.
        </p>

        <h3 className="text-sm font-semibold text-slate-900">Marketing and advertising</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We are building out paid marketing across Meta (Facebook,
          Instagram), Google Ads, YouTube, TikTok, Pinterest, Reddit, and X
          (Twitter). When we activate the corresponding tracking pixel on
          testedroutes.com, that pixel sets cookies on your device and
          shares some browsing data (typically: pages viewed, products
          viewed, purchase events) with the relevant ad platform so that we
          can measure campaign performance and show you relevant ads on
          their platforms.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Status of each tracker (updated as we activate them):
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs leading-relaxed text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">Platform</th>
                <th scope="col" className="px-4 py-2 font-semibold">Status</th>
                <th scope="col" className="px-4 py-2 font-semibold">Provider privacy policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-2">Meta Pixel (Facebook, Instagram)</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">facebook.com/privacy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Google Ads + Google Analytics 4</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">YouTube (via Google Ads)</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">TikTok Pixel</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">tiktok.com/legal/privacy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Pinterest Tag</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://policy.pinterest.com/privacy-policy" target="_blank" rel="noopener noreferrer">policy.pinterest.com/privacy-policy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Reddit Pixel</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://www.reddit.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">reddit.com/policies/privacy-policy</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">X (Twitter) Pixel</td>
                <td className="px-4 py-2">Not yet active</td>
                <td className="px-4 py-2">
                  <a className="underline" href="https://twitter.com/en/privacy" target="_blank" rel="noopener noreferrer">twitter.com/en/privacy</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          When we turn any of these on, we will:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            flip the status above to &quot;Active&quot; and describe exactly
            what data is collected and on which pages;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            add the corresponding cookies to the strictly-necessary table
            above (re-categorised as marketing) with name, lifetime, and
            purpose;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            display a cookie-consent banner that requires{" "}
            <strong>your opt-in</strong> before any of these pixels fire if
            you live in the EU, EEA, UK, or another opt-in jurisdiction; and
            an opt-out control where opt-out is the local norm.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          The lawful basis for processing your data with these trackers, once
          active, will be your consent (Art. 6(1)(a) GDPR for EU/EEA/UK
          buyers) or our legitimate interest in measuring marketing
          effectiveness, as appropriate to your region. You will always be
          able to withdraw consent and disable the trackers via the cookie
          settings on the site.
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
              <strong>Vercel</strong> – hosting and content delivery for
              testedroutes.com.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Sanity</strong> – content management for our guides and
              stories.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Beehiiv</strong> – newsletter delivery.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Polar Software Inc.</strong> – payment processing and
              merchant of record for purchases. Polar in turn engages{" "}
              <strong>Stripe, Inc.</strong> (US / Ireland) as their payment
              processor and additional sub-processors (hosting, invoicing,
              fraud monitoring) listed at{" "}
              <a
                className="underline"
                href="https://polar.sh/legal/sub-processors"
                target="_blank"
                rel="noopener noreferrer"
              >
                polar.sh/legal/sub-processors
              </a>
              .
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>PostHog</strong> – anonymous, cookie-free site analytics.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Sentry</strong> – technical error tracking with no
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
          If we change how we handle data – for example by adding a new
          analytics tool – we'll update this page and bump the "last updated"
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
