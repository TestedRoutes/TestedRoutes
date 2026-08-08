import Link from "next/link";
import { loadGuides, toGuideCard } from "../../_lib/loadGuides";
import { fetchGuideCount } from "../../_lib/sanityStory";
import { getRequestCurrency } from "../../_lib/currency";
import { LOCALES, getDict, localePath } from "../../_lib/i18n";
import Image from "next/image";
import { ABOUT_IMAGES } from "../../_lib/aboutImages";
import GuidesBrowse from "./GuidesBrowse";

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

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-16 pt-12 md:pt-16">
      <section className="space-y-10">
        <div className="space-y-2 text-center">
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
          />
        )}
      </section>

      <section className="space-y-8">
        {/* Same treatment as the home "AI has not been there. I have" line:
            Mynerve regular, centered (founder 2026-08-08); the body matches
            the home "Real trips. Real routes." serif style. */}
        <div className="space-y-3 text-center">
          <h2 className="font-script text-[24px] font-normal leading-tight text-slate-500 md:text-[32px]">
            {ti.howITestTitle}
          </h2>
          <p className="mx-auto max-w-2xl font-serif font-supersoft text-base font-light leading-relaxed text-slate-600">
            {ti.howITestBody}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ti.extremeLabels.map((label, i) => {
            // "Activity – Place": the place gets the DM Sans bold Brandy
            // highlight; labels without an en-dash render whole.
            const [activity, place] = label.split(/ – (.+)/);
            return (
              <div
                key={label}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <Image
                  src={ABOUT_IMAGES[EXTREME_FILES[i]]}
                  alt={label}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="aspect-[4/3] w-full object-cover object-center"
                />
                <p className="p-3 text-center text-sm font-medium leading-snug text-slate-700">
                  {place ? (
                    <>
                      {activity} –{" "}
                      <span className="font-bold text-brand-terracotta">{place}</span>
                    </>
                  ) : (
                    label
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
