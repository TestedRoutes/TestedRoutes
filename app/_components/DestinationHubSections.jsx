import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";

/*
 * Shared building blocks for destination hub pages.
 *
 * Every hub before Switzerland (Seychelles, Iceland, Kuwait, Tuvalu, the
 * Canary set, South Korea) carried its own private copy of these sections,
 * cloned from the newest sibling. That was fine while each hub was one file;
 * a multi-page destination (playbook §1a) is several files that must look
 * identical, and Switzerland is planned as a country page plus up to eight
 * regional sub-hubs. Nine private copies of the same table markup is how the
 * per-guide publish scripts rotted, so the markup lives here once.
 *
 * The markup and class lists are lifted VERBATIM from
 * app/(site)/destinations/tenerife/page.jsx (the guide-card block from
 * south-korea/page.jsx, which is the hub that has one) so an existing page
 * can adopt a piece with no visual change. Do not restyle a piece here to
 * suit one hub: change the hub's data, or add a prop, and keep the default
 * rendering what Tenerife renders.
 *
 * No prose lives in this file. The section headings, the rows, the tips and
 * the FAQ text are the page's business (playbook §5, §7) - this file only
 * knows how to lay them out.
 */

export function SectionHeading({ children }) {
  return (
    <h2 className="font-serif text-2xl font-normal text-brand-ink md:text-3xl">{children}</h2>
  );
}

/**
 * The label/value box used for "When to go" and "How long to stay".
 * `rows` is an array of [label, text] pairs, in display order; the label
 * column is a fixed 200px on desktop so the rows read as a table without
 * being one.
 */
export function RowTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
      <div className="divide-y divide-slate-100">
        {rows.map(([label, text]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-[200px_1fr] md:gap-4"
          >
            <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p className="text-[14px] text-slate-900">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The Lean / Core / Splurge table (playbook §8: levels described, never
 * priced). `rows` is [style, whatThatLooksLike] pairs.
 */
export function CostTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
      <table className="w-full min-w-[480px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-5 py-3 font-semibold">Style</th>
            <th className="px-5 py-3 font-semibold">What that looks like</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-900">
          {rows.map(([style, looks]) => (
            <tr key={style}>
              <td className="px-5 py-3 font-medium align-top">{style}</td>
              <td className="px-5 py-3 text-slate-700">{looks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Tested tips: `tips` is [title, body] pairs. */
export function TipsList({ tips }) {
  return (
    <div className="space-y-4">
      {tips.map(([title, body]) => (
        <div key={title} className="rounded-2xl border border-brand-line bg-white p-5">
          <p className="text-[14px] font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-slate-700">{body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * FAQ as native details/summary - no client JS, and the same [q, a] pairs
 * feed buildHubJsonLd so the schema and the visible page cannot disagree.
 */
export function FaqList({ faq }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white divide-y divide-slate-100">
      {faq.map(([question, answer]) => (
        <details key={question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50">
            <span>{question}</span>
            <span aria-hidden className="text-slate-400 transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{answer}</div>
        </details>
      ))}
    </div>
  );
}

/**
 * Sanity hero image → CDN URL for the guide and story cards. Returns null
 * when the story has no asset or the builder throws, so callers can render
 * the grey placeholder instead of a broken <img>.
 */
export function storyImage(story, width = 800) {
  const heroImage = story?.heroImage ?? story;
  if (!heroImage?.asset) return null;
  try {
    return urlFor(heroImage).width(width).fit("max").auto("format").quality(80).url();
  } catch {
    return null;
  }
}

/**
 * Guide cards for a hub. `guides` is the destination-scoped Sanity fetch
 * (title, slug, subtitle, durationDisplay, heroImage, prices); `blurbs` maps
 * guide slug → card blurb. The blurb is where the page sells what it
 * deliberately withheld (playbook §5 item 12) - a guide with no blurb falls
 * back to its own subtitle rather than being dropped, so a new SKU appears
 * with no code change. `heading` is optional: a page that groups guides by
 * region renders several GuideCards under its own region headings and
 * passes none.
 */
export function GuideCards({ guides, blurbs = {}, heading }) {
  if (!guides?.length) return null;
  return (
    <section className="space-y-4">
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      {guides.map((g) => {
        const price = Array.isArray(g.prices)
          ? g.prices.find((p) => p?.currency === "EUR")
          : null;
        return (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover sm:flex-row"
          >
            {storyImage(g.heroImage) ? (
              <img
                src={storyImage(g.heroImage)}
                alt={g.title}
                className="aspect-[4/3] w-full object-cover sm:w-64"
                loading="lazy"
              />
            ) : null}
            <div className="flex flex-1 flex-col gap-2 p-6">
              <p className="font-serif text-xl leading-snug text-brand-ink group-hover:text-slate-700">
                {g.title}
              </p>
              <p className="text-[14px] leading-relaxed text-slate-700">
                {blurbs[g.slug] ?? g.subtitle}
              </p>
              <p className="mt-auto pt-2 text-sm font-semibold text-slate-900">
                {g.durationDisplay}
                {price ? ` · €${price.amount}` : ""}
              </p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

/** "Stories from <place>" grid. Renders nothing when there are no stories. */
export function StoryGrid({ stories, heading }) {
  if (!stories?.length) return null;
  return (
    <section className="space-y-4">
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/inspire/${story.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {storyImage(story.heroImage) ? (
              <img
                src={storyImage(story.heroImage)}
                alt={story.title}
                className="aspect-[4/3] w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full bg-slate-100" />
            )}
            <div className="flex flex-1 flex-col gap-1 p-4">
              <p className="font-serif text-base font-medium leading-snug text-slate-900 group-hover:text-slate-700">
                {story.title}
              </p>
              {story.subtitle ? (
                <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">
                  {story.subtitle}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Breadcrumb. `trail` is [{href, label}, …, {label}] - every entry with an
 * href links, the last (current page) is plain text. A sub-hub passes the
 * country page as the middle crumb, the way Tenerife points at Canary
 * Islands.
 */
export function HubBreadcrumb({ trail }) {
  return (
    <nav
      className="mb-5 flex items-center gap-1.5 text-[12px] text-slate-400"
      aria-label="Breadcrumb"
    >
      {trail.map((crumb, i) => (
        <span key={crumb.href ?? crumb.label} className="contents">
          {i > 0 ? <span>›</span> : null}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-slate-600">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-600">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Region cards. Each region is {name, blurb, image, alt, href?}. `image` is
 * a static import (next/image needs the intrinsic size) and may be null
 * while the founder's cull is pending - the card then renders text-only
 * rather than blocking the page on photographs (playbook §11: a region
 * with no founder photograph gets no image, never a stock one). With an
 * `href` the whole card is a link to that region's own hub page; without
 * one it is a plain article, which is how a region reads before its page
 * exists.
 */
export function RegionCards({ regions }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {regions.map((region) => {
        const className =
          "overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card" +
          (region.href ? " group transition hover:-translate-y-0.5 hover:shadow-card-hover" : "");
        const inner = (
          <>
            {region.image ? (
              <Image
                src={region.image}
                alt={region.alt}
                className="aspect-[4/3] w-full object-cover"
                sizes="(max-width: 640px) 100vw, 380px"
              />
            ) : null}
            <div className="space-y-2 p-5">
              <h3 className="font-serif text-xl text-brand-ink">{region.name}</h3>
              <p className="text-[14px] leading-relaxed text-slate-700">{region.blurb}</p>
            </div>
          </>
        );
        return region.href ? (
          <Link key={region.name} href={region.href} className={className}>
            {inner}
          </Link>
        ) : (
          <article key={region.name} className={className}>
            {inner}
          </article>
        );
      })}
    </div>
  );
}

/**
 * Article + FAQPage JSON-LD graph (playbook §6). `about` is passed through
 * untouched because it is a statement, not a style: {"@type": "Country"}
 * on a country page, {"@type": "Place"} on a sub-hub or on a disputed
 * territory, where "Country" would take a side. `faq` is the same [q, a]
 * array FaqList renders, so the schema exposes exactly the visible text.
 * `url` is the absolute canonical (https://testedroutes.com/destinations/…).
 */
export function buildHubJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  about,
  faq,
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description,
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: {
          "@type": "Person",
          name: "Paulius Pikelis",
          jobTitle: "Founder, TestedRoutes",
          url: "https://testedroutes.com/about",
        },
        about,
        publisher: { "@type": "Organization", name: "TestedRoutes" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}
