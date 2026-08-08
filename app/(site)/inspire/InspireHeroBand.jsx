"use client";

import Image from "next/image";

// Inspire page-title band (founder spec 2026-08-08): a 200px strip directly
// under the header, three stacked layers —
//   photo:  fills the container, object-cover at FULL opacity (never fade
//           the image itself, no blend modes);
//   scrim:  90deg gradient whose first stop is EXACTLY the page background,
//           fully opaque, so the band's left edge melts seamlessly into the
//           canvas. The spec named #F5F3EC, but this page's background is
//           the Parchment token #F4F3EF — the melt only works with the real
//           canvas color, so that is what the gradient uses;
//   text:   title + subtitle in dark #37322B at the page gutter, vertically
//           centered. The search bar rides along as children (founder
//           2026-08-08: search sits inside the picture, left-aligned).
// The photo is the 2:1 full-wagon strip, positioned to keep the riders in
// the 200px slice. InspireBrowse passes its search bar as children; the
// empty-locale page renders the band bare.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="relative h-[200px] w-full overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        placeholder="blur"
        quality={80}
        sizes="100vw"
        className="object-cover object-[50%_35%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#F4F3EF_0%,rgba(244,243,239,0.6)_45%,rgba(244,243,239,0)_78%)]"
      />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="mx-auto w-full max-w-7xl px-6">
          <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-[#37322B] text-2xl md:text-4xl">
            {title}
          </h1>
          <p className="mt-1 max-w-xl font-serif font-supersoft text-sm font-light text-[#37322B] md:text-xl">
            {subtitle}
          </p>
          {children ? <div className="mt-3 w-full max-w-xl">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
