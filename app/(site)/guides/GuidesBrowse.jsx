"use client";

import GuideListCard from "./GuideListCard";
import GuideFilterBlock from "../../_components/GuideFilterBlock";

// Line icons for the trust trio, drawn light on the Taupe band:
// mountain / PDF document ("Made for the road") / pin.
const TRUST_ICONS = [
  <path key="mountain" d="M3 20 L10 6 L14 13 L17 9 L21 20 Z M8.5 9 L10 11 L11.5 9" />,
  <path key="document" d="M6 2 H14 L19 7 V22 H6 Z M14 2 V7 H19 M9.5 12.5 H15.5 M9.5 16.5 H13.5" />,
  <path key="pin" d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" />,
];

// The guide browser: the shared filter block (GuideFilterBlock, which the
// home grid renders too) over the card grid and its two full-width bands.
// Everything about the filtering - tabs, pills, panels, counts, chips -
// lives in the block; this file owns only what the results look like.
export default function GuidesBrowse({
  guides,
  t,
  tl,
  lang = "en",
  initialSearch = "",
  interlude = null,
}) {
  const ti = t.inspireList;

  const cardGrid = (cards) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((g) => (
        <GuideListCard key={g.slug} guide={g} t={tl} lang={lang} />
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      <GuideFilterBlock guides={guides} t={t} tl={tl} initialSearch={initialSearch}>
        {(filtered) => {
          // Two rows of cards between each band (founder 2026-08-17) — the
          // grid is four-up from `lg`, so a block is eight guides. Narrower
          // viewports show the same eight over more rows; the bands stay
          // where they are.
          const firstBlock = filtered.slice(0, 8);
          const secondBlock = filtered.slice(8, 16);
          const rest = filtered.slice(16);

          return (
            <section className="space-y-10">
              {cardGrid(firstBlock)}

              {/* Trust trio (founder 2026-08-08): after the first two rows of
                  guides, full page width on Taupe Grey #5F524D — same breakout
                  as the How-I-test band further down. */}
              <div className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-taupe py-10 md:py-12">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3">
                  {(tl.trust || []).map((item, i) => (
                    <div key={item.title} className="space-y-2 text-center">
                      <h3 className="flex items-center justify-center gap-2.5 font-serif text-xl font-normal text-white">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-brand-cream/90"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {TRUST_ICONS[i]}
                        </svg>
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed text-white/75">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {secondBlock.length ? cardGrid(secondBlock) : null}
              {interlude}
              {rest.length ? cardGrid(rest) : null}

              {filtered.length === 0 ? (
                <p className="text-center text-sm text-slate-500">{ti.noMatchTitle}</p>
              ) : null}
            </section>
          );
        }}
      </GuideFilterBlock>
    </div>
  );
}
