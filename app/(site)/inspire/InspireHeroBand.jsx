"use client";

import Image from "next/image";

// Inspire page-title band (founder 2026-08-08, v3): 600px tall, and the
// picture starts and finishes at the page content gutters (aligned with
// the header logo and switchers) rather than full-bleed. Content width ×
// 600px is ~2.1:1 — nearly the full-wagon strip's native 2:1 — so the
// whole train shows with only a sliver of vertical crop. Layers inside the
// picture stay per the earlier spec: full-opacity cover photo; a 90deg
// scrim whose first stop is EXACTLY the page background (#F4F3EF
// Parchment) so the left edge melts into the canvas; title + subtitle in
// #37322B vertically centered; the search bar rides along as children.
// Below md the band drops to 400px so the overlay stays comfortable.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="relative h-[400px] w-full overflow-hidden md:h-[600px]">
          <Image
            src={image}
            alt={alt}
            fill
            priority
            placeholder="blur"
            quality={80}
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="object-cover object-[50%_35%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#F4F3EF_0%,rgba(244,243,239,0.6)_45%,rgba(244,243,239,0)_78%)]"
          />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 md:px-8">
            <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-[#37322B] text-3xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-2 max-w-xl font-serif font-supersoft text-sm font-light text-[#37322B] md:text-xl">
              {subtitle}
            </p>
            {children ? <div className="mt-5 w-full max-w-xl">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
