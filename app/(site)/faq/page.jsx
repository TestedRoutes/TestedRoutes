import Link from "next/link";

export const metadata = {
  title: "FAQ · TestedRoutes",
  description:
    "How TestedRoutes guides are delivered, our refund policy, supported devices and formats, and how we keep guides up to date.",
};

const SECTIONS = [
  {
    heading: "Buying & delivery",
    items: [
      {
        q: "How do I receive a guide after I buy it?",
        a: "Right after payment, our checkout partner Polar emails you a personal download link. You can download the PDF immediately, and you can re-download it anytime from that same link – keep the email. The whole flow takes under a minute.",
      },
      {
        q: "What format is the guide in?",
        a: "PDF. One file, formatted for both screen reading and printing. Each guide is roughly 20–40 pages depending on length.",
      },
      {
        q: "What devices can I read the guide on?",
        a: "Anything that opens a PDF: phone, tablet, laptop, desktop, e-reader. Once you've downloaded the file, you can read it offline – useful when you're standing at a trailhead with no signal.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. Checkout is guest-only – you give your email, we send you the guide. No password, no profile to maintain.",
      },
      {
        q: "Can I share the guide with my travel companions?",
        a: "Yes – your purchase includes a personal licence for you and your immediate travel party. You can print copies for your own use too. What you can't do is redistribute it publicly (social media, file sharing, resale). Full terms are in our Terms of Service §5.",
      },
    ],
  },
  {
    heading: "Refunds",
    items: [
      {
        q: "What's your refund policy?",
        a: "30 days, no questions asked. Email refunds@testedroutes.com with the email you used at checkout and the order ID, and we'll refund you to the original payment method. We aim to reply within two business days.",
      },
      {
        q: "Can I get a refund if I've already downloaded the guide?",
        a: "Yes. The 30-day refund applies whether you've downloaded the guide or not. We trust you.",
      },
      {
        q: "Beyond 30 days, can I still get a refund if something is wrong with the guide?",
        a: "We can't promise refunds outside the 30-day window, but if there's a genuine problem – something inaccurate, broken, or unusable – please email refunds@testedroutes.com anyway. We'd rather fix it than leave it.",
      },
    ],
  },
  {
    heading: "Currency & taxes",
    items: [
      {
        q: "What currency are prices in?",
        a: "We display prices in EUR by default. The site auto-converts to USD, GBP, and CHF based on where you're browsing from – use the selector at the top of any guide to switch. Polar (our payment processor) charges in your selected currency at the displayed price.",
      },
      {
        q: "Are taxes included in the price?",
        a: "Yes. The displayed price is the total you pay. Polar acts as our Merchant of Record, which means they collect and remit any applicable VAT or sales tax automatically – nothing surprise-added at checkout.",
      },
    ],
  },
  {
    heading: "Updates & accuracy",
    items: [
      {
        q: "How often are guides updated?",
        a: "Each guide carries a \"Last reviewed\" date. We re-check key facts (access, transport, operators, season windows) on a rolling basis – the date moves when something material changes. Cosmetic edits don't bump the date. See Terms §3 for the exact review checklist.",
      },
      {
        q: "What does \"tested\" mean exactly?",
        a: "Best-effort, not a perfect guarantee. Specifically: route tested, major logistics verified, recommendations curated from firsthand experience. We've travelled the route (or significant parts of it, with the remainder assembled from the best available local sources), and we update the guide when something on the ground changes.\n\nWhat we don't guarantee: prices accurate to the day, every restaurant still trading, every booking link functional, every timetable matching exactly. Travel changes faster than guides can. The route, the logistics, and the picks are what we stand behind. Full definition in Terms §3.",
      },
      {
        q: "What if I find something out of date in a guide?",
        a: "Please tell us. Email hello@testedroutes.com or use our contact form – we update guides on receipt of credible reports. Correcting them is part of the product.",
      },
    ],
  },
  {
    heading: "Affiliate links & gear recommendations",
    items: [
      {
        q: "Do guides contain affiliate links?",
        a: "Some do, yes. When you click an affiliate link and complete a purchase on the destination site (a hotel, a tour, a piece of gear), we may earn a small commission – at no extra cost to you. The price you pay is exactly the same as if you went there directly. Affiliate income is how we keep guide prices low and stay independent of any single tour operator.",
      },
      {
        q: "Are gear recommendations sponsored?",
        a: "No. We only recommend gear we'd carry ourselves. Affiliate links sit on top of an honest recommendation – never the other way around. If we don't recommend something for a route, you won't see it, regardless of whether the brand offered to pay.",
      },
    ],
  },
  {
    heading: "Languages & accessibility",
    items: [
      {
        q: "What languages are guides available in?",
        a: "English currently. We're a small team and writing in English first lets us focus on quality. Translations may follow once we have meaningful demand from a specific language community.",
      },
      {
        q: "Are the site and guides accessible?",
        a: "We aim for WCAG 2.1 AA on the website. Our PDFs are designed for clear reading but don't yet meet PDF/UA standards – tagged-PDF support is on the 2026 roadmap. See our Accessibility Statement for the full status and how to send feedback.",
      },
    ],
  },
  {
    heading: "Privacy & contact",
    items: [
      {
        q: "Do I have to give my email to buy a guide?",
        a: "Yes – we need an email to deliver the PDF and an order ID for refunds and support. Polar (our payment processor) collects standard checkout details under their Privacy Policy. We don't run marketing trackers or retargeting cookies on testedroutes.com.",
      },
      {
        q: "How do I contact support?",
        a: "Use our contact form at /contact (it routes by topic) or email hello@testedroutes.com directly. Refund requests go to refunds@. Most replies arrive within two business days.",
      },
      {
        q: "How do I exercise my GDPR data-protection rights?",
        a: "Use the contact form at /contact and select \"Privacy / data request\" as the topic, or email hello@testedroutes.com. We respond within one month, usually much sooner. Full rights list in our Privacy Policy §5.",
      },
    ],
  },
];

function FaqGroup({ heading, items }) {
  return (
    <section className="space-y-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-['Georgia',serif] text-xl font-semibold text-slate-900">
        {heading}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {items.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
              <span>{q}</span>
              <span
                aria-hidden
                className="text-slate-400 transition group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="whitespace-pre-line px-5 pb-4 text-sm leading-relaxed text-slate-600">
              {a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SECTIONS.flatMap((s) => s.items).map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          The questions buyers ask most often, in one place. Can&apos;t find
          what you&apos;re looking for? Email{" "}
          <a className="underline hover:text-slate-700" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>{" "}
          or{" "}
          <Link className="underline hover:text-slate-700" href="/contact">
            send us a message
          </Link>
          .
        </p>
      </section>

      {SECTIONS.map((section) => (
        <FaqGroup key={section.heading} heading={section.heading} items={section.items} />
      ))}

      <section className="rounded-[28px] border border-slate-200 bg-[#f1faf6] p-8">
        <h2 className="font-['Georgia',serif] text-lg font-semibold text-slate-900">
          Still have a question?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We read every message. The fastest route is the{" "}
          <Link className="underline hover:text-slate-700" href="/contact">
            contact form
          </Link>{" "}
          – it routes your message to the right inbox by topic. For refunds
          specifically, email{" "}
          <a className="underline hover:text-slate-700" href="mailto:refunds@testedroutes.com">
            refunds@testedroutes.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
