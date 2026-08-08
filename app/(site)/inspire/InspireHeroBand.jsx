"use client";

import Image from "next/image";

// Full-width Inspire hero band (founder 2026-08-08: 400px tall, not
// full-screen; title and search sit inside the picture, left-aligned, and
// the picture fades out to the left into the Parchment canvas so the text
// reads in ink on flat background). InspireBrowse renders it with its
// search bar as children; the empty-locale page renders it bare. The crop
// favors the right side so the iron-ore-train riders stay visible where
// the photo is opaque.
export default function InspireHeroBand({ image, alt, title, subtitle, children }) {
  return (
    <section className="relative h-[400px] w-full overflow-hidden bg-brand-parchment">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        placeholder="blur"
        quality={75}
        sizes="100vw"
        className="object-cover object-[70%_32%]"
      />
      {/* The left fade: photo dissolves into Parchment where the text sits. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-parchment from-[28%] via-brand-parchment/70 via-[45%] to-transparent to-[70%]" />
      <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6">
        <h1 className="max-w-xl font-serif font-normal leading-[1.1] text-brand-ink text-3xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl font-serif font-supersoft text-sm font-light text-slate-600 md:text-2xl">
          {subtitle}
        </p>
        {children ? <div className="mt-6 w-full max-w-xl">{children}</div> : null}
      </div>
    </section>
  );
}
