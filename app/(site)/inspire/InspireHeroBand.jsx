"use client";

import Image from "next/image";

// Inspire hero band (founder 2026-08-08): the full-train strip (a 2:1 crop
// of the whole wagon, riders to rails) runs across the page width, and the
// band's height comes from the image aspect — capping it would crop the
// train again. Title and search sit inside the picture at every size, over
// the left side, which fades into Parchment for contrast ("slightly fade
// to left"). On a phone the strip is only ~190px tall, so the type steps
// down hard below sm to keep all three rows inside the frame. InspireBrowse
// passes its search bar as children; the empty-locale page renders the band
// bare.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="relative w-full overflow-hidden bg-brand-parchment">
      <div className="relative aspect-[4000/2020] w-full">
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
        <div className="absolute inset-0 bg-gradient-to-r from-brand-parchment/95 from-[0%] via-brand-parchment/60 via-[30%] to-transparent to-[55%]" />
      </div>
      <div className="absolute inset-0 z-10">
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 md:px-6">
          <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-brand-ink text-xl sm:text-3xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-1 max-w-xl font-serif font-supersoft text-xs font-light text-slate-600 sm:mt-2 sm:text-sm md:text-2xl">
            {subtitle}
          </p>
          {children ? <div className="mt-2.5 w-full max-w-xl sm:mt-4 md:mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
