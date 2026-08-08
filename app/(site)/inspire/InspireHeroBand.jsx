"use client";

import Image from "next/image";

// Inspire hero band (founder 2026-08-08: 400px tall, and the full train
// must be visible — no cover-crop can do that in a wide band, so the photo
// is a pre-cropped 2:1 strip of the whole wagon shown intact with
// object-contain, docked right, its left edge fading into the Parchment
// canvas). Title and search sit left-aligned inside the band on the flat
// side. InspireBrowse renders it with its search bar as children; the
// empty-locale page renders it bare. Below md the band stacks: text first,
// then the full-width strip — the train stays whole at every size.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="w-full overflow-hidden bg-brand-parchment">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:h-[400px] md:flex-row md:items-center md:gap-4">
        <div className="min-w-0 flex-1 px-6 pt-10 md:py-0">
          <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-brand-ink text-3xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl font-serif font-supersoft text-sm font-light text-slate-600 md:text-2xl">
            {subtitle}
          </p>
          {children ? <div className="mt-6 w-full max-w-xl">{children}</div> : null}
        </div>
        <div
          className="relative aspect-[2/1] w-full md:h-full md:w-[55%] md:shrink-0
            [mask-image:linear-gradient(to_right,transparent_0%,black_18%)]
            [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_18%)]"
        >
          <Image
            src={image}
            alt={alt}
            fill
            priority
            placeholder="blur"
            quality={80}
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-contain object-center md:object-right"
          />
        </div>
      </div>
    </section>
  );
}
