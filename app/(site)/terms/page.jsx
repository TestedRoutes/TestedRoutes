import Link from "next/link";

export const metadata = {
  title: "Terms of Service · TestedRoutes",
  description:
    "Terms governing the use of testedroutes.com and the purchase of TestedRoutes guides.",
};

const LAST_UPDATED = "30 April 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          These terms apply when you visit testedroutes.com and when you
          purchase a guide from us, regardless of where in the world you live.
          Plain English where possible; legal language where it has to be.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Who we are</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          testedroutes.com is operated by <strong>MB TestedRoutes</strong>, a
          small private company (mažoji bendrija) registered in Lithuania. Full
          entity details are on our{" "}
          <Link className="underline" href="/legal-notice">
            Legal Notice
          </Link>{" "}
          page.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Contact:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. Eligibility and what you agree to</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          By using the site or buying a guide you agree to these terms and to
          our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          . If you don&apos;t agree, please don&apos;t use the site.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>Minimum age.</strong> You must be at least 18 years old to
          purchase a guide. By placing an order you confirm that you are 18 or
          over and have the legal capacity to enter into a binding contract.
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

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          What the &quot;Last reviewed&quot; date means
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Each guide displays a <em>Last reviewed</em> date on its page. That
          date is the most recent point at which we (or our review process)
          re-checked the route&apos;s key facts and confirmed the guide still
          reflects what someone would find on the ground. It is{" "}
          <strong>not</strong> a guarantee that the route was physically
          re-walked, re-driven, or re-boated on that date.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          A review covers, at minimum:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Access &amp; permits</strong> – the route is still
              legally and practically accessible; no new closures, permit
              regimes, or restrictions have been introduced.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Transport</strong> – the named transport options still
              exist, and timetables / fares have not changed in ways that
              break the plan.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Operators &amp; bookings</strong> – named operators,
              accommodations, huts, ferries, ticket platforms, and similar
              third parties are still in business and still bookable through
              the channels described.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Seasonality &amp; conditions</strong> – the season
              windows we recommend still hold; we surface any newly known
              closures, weather constraints, or hazards.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Reader reports</strong> – we incorporate any credible
              reports we&apos;ve received since the last review.
            </span>
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          Reviews are performed by a human reviewer, or by an automated
          review process that flags suspected changes for a human to confirm.
          When a review identifies a material change, we update the guide and
          bump the <em>Last reviewed</em> date; minor cosmetic edits alone do
          not bump the date.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Immediate delivery and your right of withdrawal
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Guides are digital products delivered as a downloadable PDF
          immediately after your payment is confirmed. By placing your order
          you{" "}
          <strong>
            (i) request that delivery begin immediately, before any
            cooling-off period expires; and (ii) acknowledge that, once
            delivery has begun, you lose any statutory right of withdrawal
            you would otherwise have for digital content
          </strong>{" "}
          (including, for EU consumers, the 14-day right of withdrawal under
          Article 16(m) of Directive 2011/83/EU on Consumer Rights).
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          This statutory waiver is separate from – and does not limit – our
          voluntary 30-day no-questions-asked refund described in section 6
          and in our{" "}
          <Link className="underline" href="/refund-policy">
            Refund Policy
          </Link>
          . If you don&apos;t want delivery to begin immediately, please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>{" "}
          before completing checkout.
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
          and remitting any applicable sales taxes (including EU VAT and US
          sales tax where applicable).
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          By completing a purchase you also accept{" "}
          <a
            className="underline"
            href="https://polar.sh/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar&apos;s Terms of Service
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
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>use it for commercial trip-planning services without our written permission;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>use the guide or any of its content to train machine-learning or AI models.
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
          for how to request one. This is in addition to any mandatory
          consumer rights you have under the law of your country of residence,
          and is offered separately from – and on top of – the statutory
          waiver described in section 3.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">7. User content</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          testedroutes.com does not currently invite or host user-submitted
          public content (reviews, comments, ratings, photos, etc.). If we add
          such features in future, this section will set out the rules for
          posting and the licence you grant us to display that content. Until
          then, this section is reserved.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          If you contact us by email, send us a reader report, or share
          feedback about a guide, you give us permission to use any factual
          information you supply to improve the guide for all readers.
          Personally identifiable details from your message (your name, email
          address, etc.) will not be published or shared without your separate
          consent.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">8. Newsletter</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If you subscribe to our newsletter, you&apos;ll receive a confirmation
          email (double opt-in). You can unsubscribe at any time using the link
          at the bottom of any newsletter email, or by writing to{" "}
          <a className="underline" href="mailto:newsletter@testedroutes.com">
            newsletter@testedroutes.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">9. Intellectual property</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          All content on testedroutes.com – guides, photographs, maps, text,
          and design – is owned by MB TestedRoutes or its licensors and is
          protected by copyright. The licence in section 5 is the only right
          you receive in our content; nothing else on the site grants you
          additional rights.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Reporting infringement
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          If you believe content on testedroutes.com infringes your copyright,
          trademark, or other intellectual-property right, please email{" "}
          <a className="underline" href="mailto:legal@testedroutes.com">
            legal@testedroutes.com
          </a>{" "}
          with:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            identification of the work or right you say is infringed;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            the URL(s) or location of the allegedly infringing material on our
            site;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            your contact information (name, email, postal address, telephone);
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            a good-faith statement that the use is not authorised by you, your
            agent, or the law;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            a statement, under penalty of perjury, that the information in the
            notice is accurate and that you are authorised to act on the
            right-holder&apos;s behalf;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            your physical or electronic signature.
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          We will review notices promptly and, where appropriate, remove or
          disable access to the material in line with the Digital Millennium
          Copyright Act (DMCA) safe-harbour procedure and the EU Digital
          Services Act (DSA) Article 16 notice-and-action mechanism. Repeat
          infringers may have access to the site terminated.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">10. Disclaimers</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The guides describe routes we have personally tested, but conditions
          change and your experience may differ. We provide the site and the
          guides &quot;as is&quot; and do not warrant that any specific outcome
          will follow from using them. Travel can involve risk; you are
          responsible for assessing whether a route is suitable for you and
          for taking reasonable safety precautions.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">11. Limitation of liability</h2>
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
        <h2 className="text-lg font-semibold text-slate-900">12. Indemnification</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You agree to indemnify and hold MB TestedRoutes (and its directors,
          employees, contractors, and agents) harmless from any third-party
          claim, loss, or expense (including reasonable legal fees) arising
          from your breach of these terms, your misuse of a guide outside the
          licence in section 5, or your violation of any applicable law in
          your use of the site or any guide. This obligation does not apply to
          the extent the claim arises from our own breach of these terms or
          our negligence.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          13. Dispute resolution and governing law
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We sell guides globally. The rules below set out where any dispute
          will be heard and what law will apply.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Try us first
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Before starting any formal dispute, please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>{" "}
          and give us 30 days to try to resolve the issue informally. Most
          problems can be sorted out with a single email.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Governing law
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          These terms, and any non-contractual obligations arising out of or in
          connection with them, are governed by the laws of the Republic of
          Lithuania, without regard to its conflict-of-laws rules.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Consumers in the EU and UK
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          If you are a consumer resident in the European Union, the European
          Economic Area, or the United Kingdom, you also benefit from the
          mandatory consumer protections of your country of residence – these
          terms do not override those, and disputes you bring as a consumer
          may be heard in your local courts as your local law allows. EU
          consumers may use the European Commission&apos;s Online Dispute
          Resolution platform at{" "}
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

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Buyers outside the EU, EEA, and UK – binding arbitration
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          If you reside outside the EU, the EEA, and the UK, any dispute
          arising out of or relating to these terms or your purchase that is
          not resolved informally{" "}
          <strong>
            shall be finally settled by binding arbitration administered by the
            Vilnius Court of Commercial Arbitration (VCCA)
          </strong>{" "}
          in accordance with its Rules of Arbitration in force at the time of
          filing. The seat of arbitration shall be Vilnius, Lithuania. The
          language of the arbitration shall be English. The arbitral award is
          final and binding on the parties.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>Class-action and jury-trial waiver.</strong> To the maximum
          extent permitted by applicable law, you and we each waive any right
          to: (i) bring or participate in a class action, collective action,
          or representative proceeding against the other; and (ii) trial by
          jury. Disputes will be resolved on an individual basis only.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>Small-claims carve-out.</strong> Either party may bring a
          claim in a competent small-claims court of the defendant&apos;s
          jurisdiction instead of arbitration, provided the claim qualifies
          under that court&apos;s rules and remains in that forum.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">14. Force majeure</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We are not in breach of these terms or otherwise liable for any
          failure or delay in our performance caused by events beyond our
          reasonable control, including natural disasters, war, civil unrest,
          terrorism, acts of government, labour disputes, network or hosting
          outages, or third-party-supplier failures. We will, however, take
          reasonable steps to mitigate the impact of any such event on you.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">15. General provisions</h2>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Severability
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          If any provision of these terms is found to be invalid or
          unenforceable by a court of competent jurisdiction, the remaining
          provisions will continue in full force and effect, and the invalid
          provision will be interpreted (or, if necessary, replaced) so as to
          come as close as possible to the original intent while being
          enforceable.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Assignment
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          You may not assign or transfer your rights or obligations under
          these terms without our prior written consent. We may assign our
          rights and obligations to an affiliate or to a successor in
          connection with a merger, acquisition, or sale of assets, on notice
          to you.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Entire agreement
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          These terms, together with our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/refund-policy">
            Refund Policy
          </Link>
          , constitute the entire agreement between you and us regarding the
          site and any guide you purchase, and supersede any prior or
          contemporaneous communications on the same subject matter.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          No waiver
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          Our failure to enforce any provision of these terms is not a waiver
          of that provision and does not prevent us from enforcing it later.
        </p>

        <h3 className="pt-2 text-sm font-semibold text-slate-900">
          Language
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">
          These terms have been drafted in English. Any translation is for
          convenience only; in the event of any inconsistency between the
          English version and a translated version, the English version
          prevails.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">16. Changes to these terms</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We may update these terms from time to time. The &quot;last
          updated&quot; date at the top reflects the most recent revision.
          Material changes will be announced on the site or, where
          appropriate, by email. Continued use of the site after a change
          means you accept the updated terms. Changes will not apply
          retroactively to disputes arising before the change took effect.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">17. Contact</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Questions about these terms:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . Intellectual-property notices:{" "}
          <a className="underline" href="mailto:legal@testedroutes.com">
            legal@testedroutes.com
          </a>
          . See also our{" "}
          <Link className="underline" href="/legal-notice">
            Legal Notice
          </Link>{" "}
          and{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
