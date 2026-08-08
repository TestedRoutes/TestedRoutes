"use client";

import Image from "next/image";

// Inspire hero band (founder 2026-08-08): the full-train strip (a 2:1 crop
// of the whole wagon, riders to rails) runs across the page width, so the
// band's height comes from the image aspect — capping it would crop the
// train again. From md up the title and search overlay the picture's left
// side, which fades into Parchment for contrast ("slightly fade to left");
// below md the text stacks above the strip instead, because a phone-width
// strip is too short to hold copy. One DOM node repositioned with classes —
// the search input's id must not render twice. InspireBrowse passes its
// search bar as children; the empty-locale page renders the band bare.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="relative w-full overflow-hidden bg-brand-parchment">
      <div className="relative z-10 px-6 pt-10 md:absolute md:inset-0 md:px-0 md:pt-0">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col md:justify-center md:px-6">
          <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-brand-ink text-3xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl font-serif font-supersoft text-sm font-light text-slate-600 md:text-2xl">
            {subtitle}
          </p>
          {children ? <div className="mt-6 w-full max-w-xl">{children}</div> : null}
        </div>
      </div>
      <div className="relative mt-6 aspect-[4000/2020] w-full md:mt-0">
        <Image
          src={image}
          alt={alt}
          fill
          priority
          placeholder="blur"
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        {/* The left fade, desktop only — mobile shows the strip clean. */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-brand-parchment/95 from-[0%] via-brand-parchment/60 via-[30%] to-transparent to-[55%] md:block" />
      </div>
    </section>
  );
}
