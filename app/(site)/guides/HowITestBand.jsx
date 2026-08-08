"use client";

import Image from "next/image";

// "How I test" band — slotted between the first two rows of guide cards and
// the rest of the grid, running edge-to-edge on Taupe Grey #5F524D like the
// home "Choose your adventure" band (founder 2026-08-08). The section sits
// inside the page's max-w-7xl container, so it breaks out with the
// left-1/2 / -translate-x-1/2 / w-screen trick; the content re-constrains
// itself inside. Fonts and sizes are untouched — only the text color flips
// light so the Mynerve title and serif body survive the dark background.
//
// A client component on purpose: guidesIndexPage passes plain data instead
// of a prebuilt element tree, because JSX that crosses the server→client
// prop boundary loses the compiler's static-children marker and React then
// key-warns on every static sibling list inside it.
export default function HowITestBand({ title, body, items = [] }) {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-taupe py-10 md:py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:px-10">
      <div className="space-y-3 text-center">
        <h2 className="font-script text-[32px] font-normal leading-tight text-white/90">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl font-serif font-supersoft text-base font-light leading-relaxed text-white/80">
          {body}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(({ label, image }) => {
          // "Activity | Place": the place gets the DM Sans bold Brandy
          // highlight; labels without a pipe render whole.
          const [activity, place] = label.split(/ \| (.+)/);
          return (
            <div
              key={label}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <Image
                src={image}
                alt={label}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-[4/3] w-full object-cover object-center"
              />
              <p className="p-3 text-center text-sm font-medium leading-snug text-slate-700">
                {place ? (
                  <>
                    {activity} |{" "}
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
      </div>
    </section>
  );
}
