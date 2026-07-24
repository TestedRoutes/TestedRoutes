"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logoVertical from "../../content/brand/TR-logo-vertical.svg";
import CurrencySwitcher from "./CurrencySwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import HomeSearchBar from "./HomeSearchBar";
import {
  getDict,
  langFromPathname,
  localePath,
  pathWithoutLocale,
} from "../_lib/i18n";

function getActiveSlug(pathname) {
  const bare = pathWithoutLocale(pathname);
  if (!bare || bare === "/") return "home";
  const parts = bare.split("/").filter(Boolean);
  const first = parts[0];
  if (first === "destinations") return "destinations";
  if (first === "guides") return "guides";
  if (first === "inspire") return "inspire";
  if (first === "about") return "about";
  return null;
}

function primaryNavLinkClass(active, slug) {
  // Pill-on-hover: links carry their own padding so the highlight has a
  // shape; 5% Coffee Bean reads as a soft warm gray on Parchment.
  const base = "rounded-full px-3 py-1.5 tracking-[0.05em] transition-colors";
  if (active === slug) {
    return `${base} font-semibold text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]`;
  }
  return `${base} font-normal text-slate-600 hover:bg-brand-ink/5 hover:text-slate-900`;
}

function logoLinkClassName(active) {
  const base = "flex shrink-0 items-center border-b-2 border-transparent";
  if (active === "home") {
    return `${base} border-slate-900/35`;
  }
  return base;
}

export default function SiteHeader({ currency = "EUR", guides = [] }) {
  const pathname = usePathname();
  const active = getActiveSlug(pathname);
  const lang = langFromPathname(pathname);
  const nav = getDict(lang).nav;
  // Guides + Inspire have localized routes; other sections stay English.
  const navLinks = [
    { slug: "destinations", label: nav.destinations, href: "/destinations" },
    { slug: "guides", label: nav.guides, href: localePath(lang, "/guides") },
    { slug: "inspire", label: nav.inspire, href: localePath(lang, "/inspire") },
    { slug: "about", label: nav.aboutMe, href: "/about" },
  ];
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    setHeroSearchVisible(true);
    setScrolledPast(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => setHeroSearchVisible(Boolean(e.detail));
    window.addEventListener("home-hero-search-visible", handler);
    return () => window.removeEventListener("home-hero-search-visible", handler);
  }, []);

  const barePath = pathWithoutLocale(pathname);
  const isHome = barePath === "/";
  const isSection =
    barePath.startsWith("/destinations") ||
    barePath.startsWith("/guides") ||
    barePath.startsWith("/inspire");

  // On section pages (no hero search to observe), reveal the header search
  // after a short scroll — same UX as home, just threshold-based.
  useEffect(() => {
    if (!isSection) return;
    const handler = () => setScrolledPast(window.scrollY > 120);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isSection]);

  const showHeaderSearch =
    (isHome && !heroSearchVisible) || (isSection && scrolledPast);

  return (
    // Glassy over the sky-to-sand gradient: a solid cream bar clashed with
    // the blue zone at the top of the wash.
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-brand-parchment/95 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between gap-3 px-4 text-sm text-slate-900 md:gap-6 md:px-6"
        aria-label="Primary"
      >
        <Link
          className={logoLinkClassName(active)}
          href="/"
          aria-current={active === "home" ? "page" : undefined}
        >
          {/* SVG logo needs no next/image optimization; plain img keeps it crisp. */}
          <img
            src={logoVertical.src}
            alt="TestedRoutes"
            className="h-[19px] w-auto md:h-[38px]"
          />
        </Link>

        {showHeaderSearch ? (
          <div className="hidden flex-1 justify-center px-6 md:flex">
            <div className="w-full max-w-xl">
              <HomeSearchBar guides={guides} variant="compact" />
            </div>
          </div>
        ) : null}

        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              className={primaryNavLinkClass(active, link.slug)}
              href={link.href}
              aria-current={active === link.slug ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <CurrencySwitcher current={currency} />
        </div>

        {/* The bottom tab bar covers primary nav on mobile, so the header
            only carries the language + currency switchers here. */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <CurrencySwitcher current={currency} />
        </div>
      </nav>
    </header>
  );
}
