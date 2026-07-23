import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · TestedRoutes",
  description:
    "What data testedroutes.com collects, why, who it is shared with, and your GDPR rights. Analytics and marketing run only after you opt in.",
};

const LAST_UPDATED = "16 July 2026";

const MARKETING_PLATFORMS = [
  {
    name: "Meta Pixel (Facebook, Instagram)",
    href: "https://www.facebook.com/privacy/policy",
    label: "facebook.com/privacy",
  },
  {
    name: "Google Ads + Google Analytics 4",
    href: "https://policies.google.com/privacy",
    label: "policies.google.com/privacy",
  },
  {
    name: "YouTube (via Google Ads)",
    href: "https://policies.google.com/privacy",
    label: "policies.google.com/privacy",
  },
  {
    name: "TikTok Pixel",
    href: "https://www.tiktok.com/legal/privacy-policy",
    label: "tiktok.com/legal/privacy",
  },
  {
    name: "Pinterest Tag",
    href: "https://policy.pinterest.com/privacy-policy",
    label: "policy.pinterest.com/privacy-policy",
  },
  {
    name: "Reddit Pixel",
    href: "https://www.reddit.com/policies/privacy-policy",
    label: "reddit.com/policies/privacy-policy",
  },
  {
    name: "X (Twitter) Pixel",
    href: "https://twitter.com/en/privacy",
    label: "twitter.com/en/privacy",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="font-light text-slate-900 text-xl md:text-4xl lg:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We collect as little personal data as we can while still running the
          site well. A cookie-consent banner controls everything
          non-essential: strictly necessary cookies work without consent, and
          every analytics or marketing tool listed below fires only after you
          opt in. You can change or withdraw your choices at any time via the
          cookie settings on the site.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">
          1. Who is responsible for your data
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The data controller for testedroutes.com is MB &bdquo;Tested
          routes&ldquo; (operating as TestedRoutes), a Lithuanian small
          partnership (mažoji bendrija), company code 308073804. Full entity
          details (company code, registered address, VAT) are on our{" "}
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

      <section className="space-y-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">
          2. What we collect, and why
        </h2>

        <h3 className="text-sm font-medium text-slate-900">Newsletter signup</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          When you subscribe to our newsletter we collect your email address
          and, optionally, your preferred language and the part of the site
          you subscribed from (e.g. footer, top banner). We use this to send
          you the newsletter and to confirm your subscription via double
          opt-in. Legal basis: your consent (Art. 6(1)(a) GDPR), withdrawable
          at any time.
        </p>

        <h3 className="text-sm font-medium text-slate-900">Purchases</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          When you buy a guide, the transaction is processed by Polar Software
          Inc. as our Merchant of Record. At checkout Polar collects your
          email address, your payment details (card number, expiry, security
          code, cardholder name, or your Google Pay credentials), and your
          billing country. If you buy as a business, Polar additionally asks
          for your full billing address, business name, and (optionally) tax
          ID. Polar uses Stripe, Inc. as its payment processor for the
          card-handling step, and engages further sub-processors (hosting,
          email, invoicing, fraud monitoring) listed at{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/sub-processors"
            target="_blank"
            rel="noopener noreferrer"
          >
            polar.sh/legal/sub-processors
          </a>
          . Details of Polar&apos;s processing are in{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar&apos;s Privacy Policy
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          We (TestedRoutes) receive only the information needed to fulfil the
          order: typically the order ID, the product purchased, and your email
          address (so we can deliver the guide and respond to support
          questions). We do not receive your full payment-card data – Polar
          and Stripe handle that. Legal basis: performance of the contract for
          the digital guide (Art. 6(1)(b) GDPR).
        </p>

        <h3 className="text-sm font-medium text-slate-900">Analytics</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use PostHog for product analytics and session replay: which pages
          and guides are viewed, which buttons are clicked, and anonymised
          recordings of how visitors move through the site (keystrokes and
          form inputs are masked by default and are not recorded). PostHog
          sets analytics cookies only after you opt in via the consent banner;
          without consent it does not run. Legal basis: your consent (Art.
          6(1)(a) GDPR), withdrawable at any time via the cookie settings.
          Payment details are entered on our payment processor&apos;s own
          checkout pages and are never captured in analytics or session
          recordings.
        </p>

        <h3 className="text-sm font-medium text-slate-900">Error tracking</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We use Sentry to capture technical errors so we can fix bugs. Sentry
          is configured to not capture personal information, IP addresses, or
          cookies. Legal basis: legitimate interest in keeping the site secure
          and functional (Art. 6(1)(f) GDPR).
        </p>

        <h3 className="text-sm font-medium text-slate-900">
          Strictly necessary cookies
        </h3>
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
                  Remembers the currency you&apos;ve selected to view prices in
                  (3-letter currency code, e.g. EUR).
                </td>
                <td className="px-4 py-2">365 days</td>
                <td className="px-4 py-2">Strictly necessary</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          Once you opt in via the consent banner, additional cookies are set
          by the analytics and marketing tools listed below: PostHog analytics
          cookies (ph_*, up to 12 months), and marketing-pixel cookies such as
          Meta _fbp, Google _ga / _gcl_au, TikTok _ttp, Pinterest _pin_unauth,
          Reddit _rdt_uuid, and X muc_ads. The exact cookies per provider,
          with lifetimes, are listed in the consent banner settings.
        </p>

        <h3 className="text-sm font-medium text-slate-900">Affiliate links</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Some of the links in our guides and on the &ldquo;Get the links
          free&rdquo; pages are affiliate links: when you click and complete a
          purchase on the destination site (for example, a hotel booking, a
          tour, or a piece of gear) we earn a commission, at no extra cost to
          you. Affiliate links are how we keep guide prices low and keep
          ourselves independent.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          We use affiliate platforms including, where relevant, Amazon
          Associates, Booking.com, GetYourGuide, Viator (CJ), Tiqets,
          SafetyWing, Skyscanner, Awin, and Impact.com. When you click an
          affiliate link, the destination site may set its own cookies on your
          device per its own privacy policy; we do not control those cookies
          and they are subject to the destination site&apos;s disclosures, not
          ours. Where we add tracking pixels for these platforms on
          testedroutes.com itself (for example, Awin&apos;s MasterTag for
          conversion tracking), they are listed in the cookie table above and
          gated behind your consent.
        </p>

        <h3 className="text-sm font-medium text-slate-900">
          Marketing and advertising
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          We run paid marketing across Meta (Facebook, Instagram), Google Ads,
          YouTube, TikTok, Pinterest, Reddit, and X (Twitter). The
          corresponding tracking pixels on testedroutes.com set cookies on
          your device and share some browsing data (typically: pages viewed,
          products viewed, purchase events) with the relevant ad platform so
          we can measure campaign performance and show relevant ads on their
          platforms. None of these pixels fires before you opt in via the
          consent banner.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          The platforms we use (each fires only after your consent):
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs leading-relaxed text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">Platform</th>
                <th scope="col" className="px-4 py-2 font-semibold">Status</th>
                <th scope="col" className="px-4 py-2 font-semibold">
                  Provider privacy policy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MARKETING_PLATFORMS.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">Consent-gated</td>
                  <td className="px-4 py-2">
                    <a
                      className="underline"
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.label}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          You can withdraw consent and disable any of these at any time via
          the cookie settings on the site; withdrawing stops the pixels
          immediately for future browsing.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          The lawful basis for processing your data with these trackers is
          your consent (Art. 6(1)(a) GDPR for EU/EEA/UK visitors), given and
          withdrawable via the cookie settings.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">
          3. Who we share your data with
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We only share data with service providers who help us run the site.
          They process data on our behalf, under contracts that meet GDPR
          requirements:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
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
              merchant of record for purchases. Polar in turn engages Stripe,
              Inc. (US / Ireland) as their payment processor and additional
              sub-processors (hosting, invoicing, fraud monitoring) listed at{" "}
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
              <strong>PostHog</strong> – product analytics and session replay
              (consent-gated).
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
          outside the European Economic Area (notably the United States).
          Where that&apos;s the case, transfers rely on the European
          Commission&apos;s Standard Contractual Clauses or the EU–US Data
          Privacy Framework adequacy decision, as applicable.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">
          4. How long we keep your data
        </h2>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
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
              <strong>Analytics and session recordings:</strong> session
              recordings are retained for up to 90 days; analytics event data
              is retained for product-analytics purposes and deleted on
              request.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Error logs:</strong> 90 days, our Sentry retention
              default.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">5. Your rights</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Under the GDPR you have the right to: access the personal data we
          hold about you, ask us to correct it if it&apos;s wrong, ask us to
          delete it, restrict or object to certain processing, and ask for a
          portable copy. To exercise any of these rights, use our{" "}
          <Link className="underline" href="/contact">
            contact form
          </Link>{" "}
          (select Privacy / data request as the topic) or email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . We aim to respond within one month. Before acting on a deletion or
          access request, we may ask you to verify your identity (for example,
          by writing from the email address used at purchase) so that we do
          not delete or disclose data at the wrong person&apos;s request.
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
        <h2 className="text-lg font-normal text-slate-900">6. Children</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The site is not directed at children under 16, and we do not
          knowingly collect data from them.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">
          7. Changes to this policy
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If we change how we handle data – for example by adding a new
          analytics tool – we&apos;ll update this page and bump the &ldquo;last
          updated&rdquo; date. Material changes will be announced on the site
          or, where appropriate, by email.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">8. Contact</h2>
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
