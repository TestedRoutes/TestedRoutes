import Link from "next/link";
import { loadGuides } from "../../_lib/loadGuides";
import { loadInspireStories } from "../../_lib/loadInspireStories";

export const dynamic = "force-static";

export const metadata = {
  title: "Sitemap · TestedRoutes",
  description: "Every page on TestedRoutes, organised by section.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SitemapPage() {
  const [guides, stories] = await Promise.all([
    loadGuides(),
    loadInspireStories(),
  ]);

  const sortedGuides = [...guides].sort((a, b) =>
    (a.title || a.slug).localeCompare(b.title || b.slug),
  );

  const sortedStories = [...stories].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Sitemap
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Every page on TestedRoutes, grouped by section. Looking for the
          machine-readable version? See{" "}
          <a className="underline hover:text-slate-700" href="/sitemap.xml">
            /sitemap.xml
          </a>
          .
        </p>
      </section>

      <SitemapSection heading="Main">
        <SitemapItem href="/" label="Home" />
        <SitemapItem href="/about" label="About" />
        <SitemapItem href="/faq" label="FAQ" />
        <SitemapItem href="/contact" label="Contact" />
      </SitemapSection>

      <SitemapSection heading="Destinations">
        <SitemapItem href="/destinations" label="All destinations" />
        <SitemapItem href="/destinations/switzerland" label="Switzerland" />
      </SitemapSection>

      <SitemapSection heading={`Guides (${sortedGuides.length})`}>
        <SitemapItem href="/guides" label="All guides" />
        {sortedGuides.map((g) => (
          <SitemapItem
            key={g.slug}
            href={`/guides/${g.slug}`}
            label={g.title || g.slug}
          />
        ))}
      </SitemapSection>

      <SitemapSection heading={`Inspire (${sortedStories.length})`}>
        <SitemapItem href="/inspire" label="All stories" />
        {sortedStories.map((s) => (
          <SitemapItem
            key={s.slug}
            href={`/inspire/${s.slug}`}
            label={s.title || s.slug}
          />
        ))}
      </SitemapSection>

      <SitemapSection heading="Newsletter">
        <SitemapItem href="/subscribe" label="Subscribe" />
      </SitemapSection>

      <SitemapSection heading="Legal & policies">
        <SitemapItem href="/legal-notice" label="Legal notice" />
        <SitemapItem href="/terms" label="Terms of service" />
        <SitemapItem href="/privacy" label="Privacy policy" />
        <SitemapItem href="/refund-policy" label="Refund policy" />
        <SitemapItem href="/accessibility" label="Accessibility statement" />
        <SitemapItem href="/security" label="Security" />
        <SitemapItem href="/affiliate-disclosure" label="Affiliate disclosure" />
      </SitemapSection>
    </main>
  );
}

function SitemapSection({ heading, children }) {
  return (
    <section className="space-y-4 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-['Georgia',serif] text-xl font-semibold text-slate-900">
        {heading}
      </h2>
      <ul className="grid gap-1.5 text-sm">{children}</ul>
    </section>
  );
}

function SitemapItem({ href, label }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-3">
      <Link
        href={href}
        className="text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline"
      >
        {label}
      </Link>
      <span className="font-mono text-xs text-slate-400">{href}</span>
    </li>
  );
}
