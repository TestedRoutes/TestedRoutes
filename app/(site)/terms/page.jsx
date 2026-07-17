import Link from "next/link";

export const metadata = {
  title: "Terms of Service · TestedRoutes",
  description:
    "The terms that apply when you browse testedroutes.com or buy a guide: what 'tested' means, licences, refunds, and dispute resolution.",
};

const LAST_UPDATED = "16 July 2026";

function Section({ title, children }) {
  return (
    <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function H3({ children }) {
  return <h3 className="text-sm font-semibold text-slate-900">{children}</h3>;
}

function P({ children }) {
  return <p className="text-sm leading-relaxed text-slate-600">{children}</p>;
}

function Bullets({ items }) {
  return (
    <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-0.5 shrink-0 text-slate-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

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

      <Section title="1. Who we are">
        <P>
          testedroutes.com is operated by MB &bdquo;Tested routes&ldquo;
          (operating as TestedRoutes), a Lithuanian small partnership (mažoji
          bendrija), company code 308073804, registered office: Kėdainių r.
          sav., Vilainių sen., Vilainių k., Melioratorių g. 10, LT-58103,
          Lithuania. Full entity details are on our{" "}
          <Link className="underline" href="/legal-notice">
            Legal Notice
          </Link>{" "}
          page.
        </P>
        <P>
          Contact:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </P>
      </Section>

      <Section title="2. Eligibility and what you agree to">
        <P>
          By using the site or buying a guide you agree to these terms and to
          our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          . If you don&apos;t agree, please don&apos;t use the site.
        </P>
        <P>
          <strong>Minimum age.</strong> You must be at least 18 years old to
          purchase a guide. By placing an order you confirm that you are 18 or
          over and have the legal capacity to enter into a binding contract.
        </P>
      </Section>

      <Section title="3. Our guides">
        <P>
          TestedRoutes guides are digital travel guides – written by us,
          drawing on routes we have personally travelled. Each guide is
          delivered as a digital document immediately after payment.
        </P>

        <H3>What &ldquo;tested&rdquo; means</H3>
        <P>
          We use the name TestedRoutes because every guide we publish is
          grounded in real, first-hand travel. A guide may be built from
          multiple visits and cross-referenced experiences rather than a
          single back-to-back execution, and kept current without
          re-travelling every kilometre. In every case the route is curated,
          reviewed, and approved by us before publication. It is an honest,
          best-effort label, not a guarantee that every metre of every
          published route was walked, driven, or boated by us at the moment of
          publication.
        </P>
        <P>Specifically, &ldquo;tested&rdquo; means:</P>
        <Bullets
          items={[
            "we have travelled the route, or",
            "we have travelled the route or significant parts of it, and have assembled or updated the remainder from the best available knowledge: operators, transport providers, official sources, and reports from travellers we trust; or",
            "the route has evolved since our last visit (closures, re-routes, permit changes, new openings), and we have updated it through the same desk research and traveller reports, without necessarily revisiting in person.",
          ]}
        />
        <P>
          <strong>What we do not guarantee.</strong> Travel changes faster
          than any guide can. We do not guarantee that prices are accurate to
          the day, that every named restaurant or operator is still trading at
          the time of your trip, that every booking link is still functional,
          or that every timetable matches exactly. The value of a TestedRoutes
          guide is the route, the logistics, and the picks – the structure of
          the trip stands up even if a specific restaurant has changed hands.
        </P>
        <P>
          If you find anything in a guide that is wrong, out of date, or no
          longer matches reality on the ground, please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . We update guides on receipt of credible reports – correcting them
          is part of the product.
        </P>

        <H3>What the &ldquo;Last reviewed&rdquo; date means</H3>
        <P>
          Each guide displays a Last reviewed date on its page. That date is
          the most recent point at which we (or our review process) re-checked
          the route&apos;s key facts and confirmed the guide still reflects
          what someone would find on the ground. It is not a guarantee that
          the route was physically re-walked, re-driven, or re-boated on that
          date.
        </P>
        <P>A review covers, at minimum:</P>
        <Bullets
          items={[
            <>
              <strong>Access &amp; permits</strong> – the route is still
              legally and practically accessible; no new closures, permit
              regimes, or restrictions have been introduced.
            </>,
            <>
              <strong>Transport</strong> – the named transport options still
              exist, and timetables / fares have not changed in ways that
              break the plan.
            </>,
            <>
              <strong>Operators &amp; bookings</strong> – named operators,
              accommodations, huts, ferries, ticket platforms, and similar
              third parties are still in business and still bookable through
              the channels described.
            </>,
            <>
              <strong>Seasonality &amp; conditions</strong> – the season
              windows we recommend still hold; we surface any newly known
              closures, weather constraints, or hazards.
            </>,
            <>
              <strong>Reader reports</strong> – we incorporate any credible
              reports we&apos;ve received since the last review.
            </>,
          ]}
        />
        <P>
          Reviews are performed by a human reviewer, or by an automated review
          process that flags suspected changes for a human to confirm. When a
          review identifies a material change, we update the guide and bump
          the Last reviewed date; minor cosmetic edits alone do not bump the
          date.
        </P>

        <H3>Immediate delivery and your right of withdrawal</H3>
        <P>
          Guides are digital products delivered as a downloadable PDF
          immediately after your payment is confirmed. By placing your order
          you{" "}
          <strong>
            (i) request that delivery begin immediately, before any
            cooling-off period expires; and (ii) acknowledge that, once
            delivery has begun, you lose any statutory right of withdrawal you
            would otherwise have for digital content
          </strong>{" "}
          (including, for EU consumers, the 14-day right of withdrawal under
          Article 16(m) of Directive 2011/83/EU on Consumer Rights).
        </P>
        <P>
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
        </P>
      </Section>

      <Section title="4. Payments and our payment processor">
        <P>
          Payments are processed by Polar Software Inc. (
          <a
            className="underline"
            href="https://polar.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            polar.sh
          </a>
          ), who acts as the Merchant of Record for the sale. Polar appears as
          the seller on your invoice, handles payment processing and customer
          billing, and is responsible for collecting and remitting any
          applicable sales taxes (including EU VAT and US sales tax where
          applicable).
        </P>
        <P>
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
        </P>
      </Section>

      <Section title="5. Your licence to use a guide">
        <P>
          When you buy a guide we grant you a personal, non-transferable,
          worldwide licence to use it for your own travel planning. You may:
        </P>
        <Bullets
          items={[
            "print copies for your own use;",
            "share the file with members of your immediate travel party.",
          ]}
        />
        <P>You may not:</P>
        <Bullets
          items={[
            "redistribute the guide publicly, including on social media or file-sharing platforms;",
            "resell or sublicense it;",
            "use it for commercial trip-planning services without our written permission;",
            "use the guide or any of its content for the scraping, dataset-creation, or AI-training purposes prohibited in section 9.",
          ]}
        />
      </Section>

      <Section title="6. Refunds">
        <P>
          We offer a 30-day, no-questions-asked refund on every guide. See the{" "}
          <Link className="underline" href="/refund-policy">
            Refund Policy
          </Link>{" "}
          for how to request one. This is in addition to any mandatory
          consumer rights you have under the law of your country of residence,
          and is offered separately from – and on top of – the statutory
          waiver described in section 3.
        </P>
        <P>
          Where we detect a pattern of repeated purchase-and-refund across
          multiple guides that indicates the policy is being used to obtain
          guides without payment, we may, at our reasonable discretion,
          decline further refunds. If your bank has already reversed a payment
          through a chargeback, no separate refund is owed for the same
          transaction.
        </P>
      </Section>

      <Section title="7. User content">
        <P>
          You may be able to submit content to us: reviews, ratings,
          testimonials, photos, videos, comments, and reader reports
          (together, &ldquo;user content&rdquo;), through the site or by
          email. If you tag or mention us on social media, we may reshare your
          post using that platform&apos;s native sharing features; before
          using your social content anywhere else, we will ask you first.
        </P>
        <P>
          You keep ownership of your user content. By submitting it through
          the site or by email, or by confirming to us on social media that we
          may use it, you grant us a non-exclusive, worldwide, royalty-free
          licence to use, reproduce, adapt (for example, cropping or trimming
          for format), publish, and display it on testedroutes.com, in our
          guides and newsletters, on our social media channels, and in our
          marketing (including paid ads). Where we attribute, we use your
          first name and last initial, or your social media handle.
        </P>
        <P>
          You confirm that the content is yours, that it does not infringe
          anyone else&apos;s rights, and that it is lawful. We may decline,
          edit for length or clarity (never meaning), or remove any user
          content at our discretion. Reviews we display come from verified
          buyers unless labelled otherwise.
        </P>
        <P>
          You can withdraw your content at any time by emailing{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          ; we will remove it from our own properties within a reasonable time
          (materials already printed or distributed excepted). User content is
          provided without compensation.
        </P>
        <P>
          If you contact us by email, send us a reader report, or share
          feedback about a guide, you agree that we may use the factual
          information you supply to improve the guide for all readers.
          Personally identifiable details from your message (your name, email
          address, etc.) will not be published or shared without your separate
          consent.
        </P>
      </Section>

      <Section title="8. Newsletter">
        <P>
          If you subscribe to our newsletter, you&apos;ll receive a
          confirmation email (double opt-in). You can unsubscribe at any time
          using the link at the bottom of any newsletter email, or by writing
          to{" "}
          <a className="underline" href="mailto:newsletter@testedroutes.com">
            newsletter@testedroutes.com
          </a>
          .
        </P>
      </Section>

      <Section title="9. Intellectual property">
        <P>
          All content on testedroutes.com – guides, photographs, maps, text,
          and design – is owned by MB &bdquo;Tested routes&ldquo; or its
          licensors and is protected by copyright. The licence in section 5 is
          the only right you receive in our content; nothing else on the site
          grants you additional rights.
        </P>
        <P>
          <strong>Quoting our content.</strong> You may quote up to 500
          characters from our free content (Inspire pages and blog posts) with
          attribution to TestedRoutes and a link to the source page. Anything
          beyond that, including any quoting of paid guide content, requires
          our written permission – email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          .
        </P>
        <P>
          <strong>Systematic extraction.</strong> Except for the quoting
          permitted above and the indexing of our free content that our
          robots.txt permits, you may not scrape, crawl, mine, systematically
          copy, or extract content or data from testedroutes.com by manual or
          automated means, or use any of our content to create datasets,
          embeddings, or machine-learning or AI models, or for any other
          automated collection.
        </P>

        <H3>Reporting infringement</H3>
        <P>
          If you believe content on testedroutes.com infringes your copyright,
          trademark, or other intellectual-property right, please email{" "}
          <a className="underline" href="mailto:legal@testedroutes.com">
            legal@testedroutes.com
          </a>{" "}
          with:
        </P>
        <Bullets
          items={[
            "identification of the work or right you say is infringed;",
            "the URL(s) or location of the allegedly infringing material on our site;",
            "your contact information (name, email, postal address, telephone);",
            "a good-faith statement that the use is not authorised by you, your agent, or the law;",
            "a statement, under penalty of perjury, that the information in the notice is accurate and that you are authorised to act on the right-holder's behalf;",
            "your physical or electronic signature.",
          ]}
        />
        <P>
          We will review notices promptly and, where appropriate, remove or
          disable access to the material in line with the Digital Millennium
          Copyright Act (DMCA) safe-harbour procedure and the EU Digital
          Services Act (DSA) Article 16 notice-and-action mechanism. Repeat
          infringers may have access to the site terminated.
        </P>
        <P>
          If your content was removed following a notice and you believe the
          removal was mistaken, you may send a counter-notice to{" "}
          <a className="underline" href="mailto:legal@testedroutes.com">
            legal@testedroutes.com
          </a>{" "}
          with your contact details and an explanation; we will review it and
          may restore the material where justified.
        </P>
      </Section>

      <Section title="10. Disclaimers">
        <P>
          The guides describe routes tested as described in section 3, but
          conditions change and your experience may differ. We provide the
          site and the guides &ldquo;as is&rdquo; and do not warrant that any
          specific outcome will follow from using them. Travel can involve
          risk; you are responsible for assessing whether a route is suitable
          for you and for taking reasonable safety precautions.
        </P>
        <P>
          <strong>Not professional advice.</strong> Our guides and site
          content are informational only. They are not legal, medical,
          financial, immigration, visa, or safety advice. Health decisions
          (including vaccinations, malaria prevention, altitude, diving,
          pregnancy, food allergies, and infectious-disease precautions)
          should always be made with an appropriately qualified professional.
        </P>
        <P>
          <strong>Entry requirements.</strong> Visa rules, passport-validity
          requirements, permits, customs rules, and other entry requirements
          change frequently and vary by nationality. Always verify current
          requirements with official government sources before you travel. We
          strongly recommend appropriate travel insurance for every trip.
        </P>
        <P>
          <strong>Third-party services.</strong> We are not a party to, and
          are not responsible for, services provided by airlines, hotels, tour
          operators, transport providers, booking platforms, or any other
          third party – including those we recommend or link to in a guide.
        </P>
      </Section>

      <Section title="11. Limitation of liability">
        <P>
          To the maximum extent permitted by law, our total liability arising
          from your use of the site or any guide is limited to the amount you
          paid us for the guide in question. We are not liable for indirect or
          consequential losses (for example, missed connections, lost
          bookings, or trip cancellations).
        </P>
        <P>
          Nothing in these terms excludes or limits liability that cannot be
          excluded or limited by law, including liability for fraud or for
          death or personal injury caused by negligence.
        </P>
      </Section>

      <Section title="12. Indemnification">
        <P>
          You agree to indemnify and hold MB &bdquo;Tested routes&ldquo; (and
          its directors, employees, contractors, and agents) harmless from any
          third-party claim, loss, or expense (including reasonable legal
          fees) arising from your breach of these terms, your misuse of a
          guide outside the licence in section 5, or your violation of any
          applicable law in your use of the site or any guide. This obligation
          does not apply to the extent the claim arises from our own breach of
          these terms or our negligence.
        </P>
      </Section>

      <Section title="13. Dispute resolution and governing law">
        <P>
          We sell guides globally. The rules below set out where any dispute
          will be heard and what law will apply.
        </P>
        <H3>Try us first</H3>
        <P>
          Before starting any formal dispute, please email{" "}
          <a className="underline" href="mailto:legal@testedroutes.com">
            legal@testedroutes.com
          </a>{" "}
          and give us 30 days to try to resolve the issue informally. Most
          problems can be sorted out with a single email.
        </P>
        <P>
          Consumers may also refer a dispute to the State Consumer Rights
          Protection Authority of Lithuania (Valstybinė vartotojų teisių
          apsaugos tarnyba,{" "}
          <a
            className="underline"
            href="https://www.vvtat.lt"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.vvtat.lt
          </a>
          ) for out-of-court resolution, or to the equivalent consumer body in
          their country of residence.
        </P>
        <H3>Governing law</H3>
        <P>
          These terms, and any non-contractual obligations arising out of or
          in connection with them, are governed by the laws of the Republic of
          Lithuania, without regard to its conflict-of-laws rules.
        </P>
        <H3>Consumers in the EU and UK</H3>
        <P>
          If you are a consumer resident in the European Union, the European
          Economic Area, or the United Kingdom, you also benefit from the
          mandatory consumer protections of your country of residence – these
          terms do not override those, and disputes you bring as a consumer
          may be heard in your local courts as your local law allows.
        </P>
        <H3>Buyers outside the EU, EEA, and UK – binding arbitration</H3>
        <P>
          If you reside outside the EU, the EEA, and the UK, any dispute
          arising out of or relating to these terms or your purchase that is
          not resolved informally{" "}
          <strong>
            shall be finally settled by binding arbitration administered by
            the Vilnius Court of Commercial Arbitration (VCCA)
          </strong>{" "}
          in accordance with its Rules of Arbitration in force at the time of
          filing. The seat of arbitration shall be Vilnius, Lithuania. The
          language of the arbitration shall be English. The arbitral award is
          final and binding on the parties.
        </P>
        <P>
          <strong>Class-action and jury-trial waiver.</strong> To the maximum
          extent permitted by applicable law, you and we each waive any right
          to: (i) bring or participate in a class action, collective action,
          or representative proceeding against the other; and (ii) trial by
          jury. Disputes will be resolved on an individual basis only.
        </P>
        <P>
          <strong>Small-claims carve-out.</strong> Either party may bring a
          claim in a competent small-claims court of the defendant&apos;s
          jurisdiction instead of arbitration, provided the claim qualifies
          under that court&apos;s rules and remains in that forum.
        </P>
      </Section>

      <Section title="14. Force majeure">
        <P>
          We are not in breach of these terms or otherwise liable for any
          failure or delay in our performance caused by events beyond our
          reasonable control, including natural disasters, war, civil unrest,
          terrorism, acts of government, labour disputes, network or hosting
          outages, or third-party-supplier failures. We will, however, take
          reasonable steps to mitigate the impact of any such event on you.
        </P>
      </Section>

      <Section title="15. General provisions">
        <H3>Severability</H3>
        <P>
          If any provision of these terms is found to be invalid or
          unenforceable by a court of competent jurisdiction, the remaining
          provisions will continue in full force and effect, and the invalid
          provision will be interpreted (or, if necessary, replaced) so as to
          come as close as possible to the original intent while being
          enforceable.
        </P>
        <H3>Assignment</H3>
        <P>
          You may not assign or transfer your rights or obligations under
          these terms without our prior written consent. We may assign our
          rights and obligations to an affiliate or to a successor in
          connection with a merger, acquisition, or sale of assets, on notice
          to you.
        </P>
        <H3>Entire agreement</H3>
        <P>
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
        </P>
        <H3>No waiver</H3>
        <P>
          Our failure to enforce any provision of these terms is not a waiver
          of that provision and does not prevent us from enforcing it later.
        </P>
        <H3>Language</H3>
        <P>
          These terms are written in English. Any translation is for
          convenience only; in the event of any inconsistency between the
          English version and a translated version, the English version
          prevails.
        </P>
      </Section>

      <Section title="16. Changes to these terms">
        <P>
          We may update these terms from time to time. The &ldquo;last
          updated&rdquo; date at the top reflects the most recent revision.
          Material changes will be announced on the site or, where
          appropriate, by email. Continued use of the site after a change
          means you accept the updated terms. Changes will not apply
          retroactively to disputes arising before the change took effect.
        </P>
      </Section>

      <Section title="17. Contact">
        <P>
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
        </P>
      </Section>
    </main>
  );
}
