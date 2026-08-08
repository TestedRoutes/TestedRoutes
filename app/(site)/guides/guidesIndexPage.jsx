import Link from "next/link";
import { loadGuides, toGuideCard } from "../../_lib/loadGuides";
import { fetchGuideCount } from "../../_lib/sanityStory";
import { getRequestCurrency } from "../../_lib/currency";
import { LOCALES, getDict, localePath } from "../../_lib/i18n";
import Image from "next/image";
import { ABOUT_IMAGES } from "../../_lib/aboutImages";
import GuidesBrowse from "./GuidesBrowse";
import HowITestBand from "./HowITestBand";

const EXTREME_FILES = [
  "Running with bulls Pamplona 2019.jpg",
  "Sharks Fiji 2025.jpg",
  "Nicaragua boarding 2019.jpg",
  "Paragliding.jpg",
  "Ice climbing Italy 2019.jpg",
  "Iron Ore train Mauritania 2023.jpg",
  "Summits Alaska 2019 v2.jpg",
  "Makoko Nigeria 2025.jpg",
];

// hreflang alternates only for locales that actually have guides.
async function guideLanguageAlternates() {
  const counts = await Promise.all(
    LOCALES.map(async (l) => [l, await fetchGuideCount(l)]),
  );
  const withContent = counts.filter(([, c]) => c > 0).map(([l]) => l);
  const languages = {};
  for (const l of withContent) languages[l] = localePath(l, "/guides");
  if (withContent.includes("en")) languages["x-default"] = "/guides";
  return { withContent, languages };
}

export async function buildGuidesIndexMetadata(lang) {
  const t = getDict(lang);
  const { withContent, languages } = await guideLanguageAlternates();
  const isEmpty = lang !== "en" && !withContent.includes(lang);
  return {
    title: `${t.guideList.title} · TestedRoutes`,
    description: t.guideList.metaDescription,
    alternates: {
      canonical: localePath(lang, "/guides"),
      languages,
    },
    ...(isEmpty ? { robots: { index: false } } : {}),
  };
}

export default async function GuidesIndexPage({ lang = "en", q = "" }) {
  const t = getDict(lang);
  const tl = t.guideList;
  const ti = t.inspireList;
  const currency = await getRequestCurrency();
  const guides = await loadGuides(currency, lang);

  // The band renders via HowITestBand (a client component) from plain
  // data — see the note in that file for why no element tree crosses the
  // server→client boundary here. The explicit key matters: server-created
  // elements arrive frozen on the client, so React's reconciler key-checks
  // them wherever they sit among siblings.
  const howITest = (
    <HowITestBand
      key="how-i-test"
      title={ti.howITestTitle}
      body={ti.howITestBody}
      items={ti.extremeLabels.map((label, i) => ({
        label,
        image: ABOUT_IMAGES[EXTREME_FILES[i]],
      }))}
    />
  );

  return (
    // overflow-x-clip: the How-I-test band breaks out to w-screen, which
    // includes the scrollbar gutter — clipping stops a phantom horizontal
    // scroll without affecting anything visible.
    <main className="mx-auto flex max-w-7xl flex-col gap-10 overflow-x-clip px-6 pb-16 pt-12 md:pt-16">
      <section className="space-y-10">
        {/* Left-aligned header + search (founder 2026-08-08). */}
        <div className="space-y-2">
          <h1 className="font-serif font-normal leading-[1.1] text-brand-ink text-2xl md:text-[26px] lg:text-5xl">
            {tl.heading}
          </h1>
          <p className="font-serif text-sm font-light text-slate-600 md:text-2xl">{tl.tagline}</p>
        </div>
        {guides.length === 0 ? (
          lang !== "en" ? (
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-dashed border-slate-300/70 bg-white px-6 py-10 text-center shadow-sm ring-1 ring-slate-200/60">
              <p className="text-base font-semibold text-slate-900">{ti.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                {ti.emptyBody}
              </p>
              <Link
                href="/guides"
                className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                {ti.emptyLink}
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No guides found.</p>
          )
        ) : (
          <GuidesBrowse
            guides={guides.map(toGuideCard)}
            t={t}
            tl={tl}
            lang={lang}
            initialSearch={q}
            interlude={howITest}
          />
        )}
        {/* Locales with no guides skip GuidesBrowse, so the band renders
            here instead of vanishing with the grid. */}
        {guides.length === 0 ? howITest : null}
      </section>

    </main>
  );
}
