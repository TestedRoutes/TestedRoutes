"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import HomeSearchBar from "./HomeSearchBar";
// Filename casing matters: Vercel builds on a case-sensitive filesystem.
import heroImage from "../../content/about/New_Hero.jpg";

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
    // The photo starts below the sticky header (founder 2026-08-08: the bar
    // stays solid, nothing runs behind it). Height is header-complement
    // (100vh minus h-16 / md:h-20) so header + hero exactly fill the first
    // screen; an explicit height rather than aspect-ratio + max-height,
    // because Safari resolves that pair by shrinking the box's *width* to
    // keep the ratio, collapsing the hero to half the viewport. Below md a
    // floor height applies instead, because the headline and search need
    // the room.
    <section className="relative isolate overflow-hidden md:h-[calc(100vh-5rem)]">
      <Image
        src={heroImage}
        alt="Sitting in a woven poncho above the Quilotoa crater lagoon, Ecuador"
        fill
        priority
        placeholder="blur"
        quality={80}
        sizes="100vw"
        className="-z-10 object-cover object-[50%_62%] md:object-center"
      />
      {/* Scrim: the photo's sky is bright, so the copy needs its own floor. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink/80 via-brand-ink/25 to-transparent" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-6 pb-12 pt-16 md:h-full md:min-h-0 md:pb-16">
        {/* 18pt = 24px. */}
        <p className="font-sans text-[24px] uppercase leading-tight tracking-[0.2em] text-white/85">
          Skip the research. Take the trip
        </p>
        {/* 72px at full size (founder 2026-08-08, down from 96px) — same cap
            as the "Discover the latest guides" section heading. The line
            break is explicit rather than left to natural wrapping: the
            headline reads as a claim on line one ("Travel guides") answered
            on line two ("built from real trips"), and where the box edge
            happens to fall varies with viewport. */}
        <h1 className="mt-4 max-w-5xl font-serif font-light leading-[1.05] text-white text-4xl md:text-6xl lg:text-[72px]">
          <span className="md:hidden">
            Guides
            <br />
            built from real trips
          </span>
          <span className="hidden md:inline">
            Travel guides
            <br />
            built from real trips
          </span>
        </h1>

        <div ref={searchRef} className="mt-8 w-full max-w-[640px] md:mt-10">
          <HomeSearchBar guides={guides} variant="hero" />
        </div>
      </div>
    </section>
  );
}
