export const metadata = {
  title: "Accessibility Statement · TestedRoutes",
  description:
    "TestedRoutes is committed to keeping the site usable for everyone. This statement explains our accessibility goals, current status, and how to send us feedback.",
};

const LAST_UPDATED = "30 April 2026";

export default function AccessibilityPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Accessibility Statement</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We believe travel guides should be usable by everyone. This statement
          covers testedroutes.com and the PDF guides delivered through it. It is
          published in line with the European Accessibility Act (EAA, Directive
          (EU) 2019/882) and is intended to be helpful to all visitors,
          regardless of region.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Our standard</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We aim for testedroutes.com to conform to the{" "}
          <a
            className="underline"
            href="https://www.w3.org/TR/WCAG21/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Content Accessibility Guidelines (WCAG) 2.1
          </a>
          , Level AA. WCAG 2.1 AA is the international reference for digital
          accessibility and the level used by both the EAA and the US
          Americans with Disabilities Act (ADA).
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. What we focus on</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Perceivable.</strong> Text content is sized and contrasted
              for legibility; images carry alt text; videos (when added) will
              carry captions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Operable.</strong> The site is navigable by keyboard;
              interactive elements have visible focus; we avoid time-limited
              actions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Understandable.</strong> We use plain language wherever
              possible and keep page structure consistent across guides.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            <span>
              <strong>Robust.</strong> Pages are built with semantic HTML and
              tested in current versions of major browsers and assistive
              technologies.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. Current status</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          testedroutes.com is{" "}
          <strong>partially conformant</strong> with WCAG 2.1 AA. We are aware
          that some areas still need work, and we are addressing them on a
          rolling basis. Known limitations:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            interactive maps embedded on guide pages have limited keyboard
            navigation; the same information is also presented in text form
            beside the map.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            our PDF guides are designed for reading, but do not yet meet PDF/UA
            standards. We aim to ship a tagged-PDF pipeline in 2026.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. How we test</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Accessibility checks are part of our development workflow. We run
          automated audits (Lighthouse, axe-core) on key pages and complement
          them with manual keyboard and screen-reader walk-throughs at least
          quarterly.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Feedback</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If you encounter an accessibility barrier, or have suggestions for
          improvement, please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . We aim to respond within five business days and will let you know
          our plan to address the issue.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          If you live in the EU and are not satisfied with our response, you may
          also contact the relevant national enforcement authority for the
          European Accessibility Act in your country.
        </p>
      </section>
    </main>
  );
}
