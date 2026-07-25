"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import HomeSearchBar from "./HomeSearchBar";
import heroImage from "../../content/about/Why-original.jpg";

// Full-bleed photo hero: headline sits bottom-left over a scrim, with the
// guide search under it. The observer is what tells SiteHeader when the
// hero search has scrolled away, so the compact header search can take over.
export default function HomeHero({ guides = [] }) {
  const searchRef = useRef(null);

  useEffect(() => {
    const el = searchRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("home-hero-search-visible", { detail: entry.isIntersecting })
        );
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.dispatchEvent(new CustomEvent("home-hero-search-visible", { detail: true }));
    };
  }, []);

  return (
    // The negative top margin pulls the photo up behind the sticky header
    // (h-16 / md:h-20), which goes transparent while the hero is in view.
    // The band wants the photo's 4:3 ratio but is capped at 78vh, so a wide
    // window trims the frame top and bottom rather than running past the
    // fold. Below md a floor height applies instead, because the headline
    // and search need the room.
    <section className="relative isolate -mt-16 overflow-hidden md:-mt-20 md:aspect-[4/3] md:max-h-[78vh]">
      <Image
        src={heroImage}
        alt="Sitting in a woven poncho above the Quilotoa crater lagoon, Ecuador"
        fill
        priority
        placeholder="blur"
        quality={90}
        sizes="100vw"
        className="-z-10 object-cover object-[50%_62%] md:object-center"
      />
      {/* Scrim: the photo's sky is bright, so the copy needs its own floor. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink/80 via-brand-ink/25 to-transparent" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-6 pb-12 pt-28 md:h-full md:min-h-0 md:pb-16">
        {/* 18pt = 24px. */}
        <p className="font-sans text-[24px] uppercase leading-tight tracking-[0.2em] text-white/85">
          Skip the research. Take the trip
        </p>
        {/* 72pt = 96px at full size. */}
        <h1 className="mt-4 max-w-5xl font-serif font-light leading-[1.05] text-white text-4xl md:text-6xl lg:text-[96px]">
          <span className="md:hidden">Guides built from real trips</span>
          <span className="hidden md:inline">Travel guides built from real trips</span>
        </h1>

        <div ref={searchRef} className="mt-8 w-full max-w-[640px] md:mt-10">
          <HomeSearchBar guides={guides} variant="hero" />
        </div>
      </div>
    </section>
  );
}
