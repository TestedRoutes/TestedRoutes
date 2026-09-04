"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logoVertical from "../../content/brand/TR-logo-vertical.svg";
import logoVerticalWhite from "../../content/brand/TR-logo-vertical-white.svg";
import CurrencySwitcher from "./CurrencySwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import HomeSearchBar from "./HomeSearchBar";
// Helpers come from locale.js, never i18n.js: this component is in the
// client bundle of every page, and the i18n module carries all five
// dictionaries (~48 KB). The per-locale nav labels arrive as a prop from
// the server layout instead.
import {
  langFromPathname,
  localePath,
  pathWithoutLocale,
} from "../_lib/locale";

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

function primaryNavLinkClass(active, slug, dark) {
  // Pill-on-hover: links carry their own padding so the highlight has a
  // shape; 5% Coffee Bean reads as a soft warm gray on Parchment. On the
  // dark bar the same shapes in Bone over Coffee Bean.
  const base = "rounded-full px-3 py-1.5 font-bold tracking-[0.05em] transition-colors";
  if (dark) {
    if (active === slug) {
      return `${base} text-brand-cream underline decoration-brand-cream/40 decoration-1 underline-offset-[6px]`;
    }
    return `${base} text-brand-cream/70 hover:bg-white/10 hover:text-brand-cream`;
  }
  if (active === slug) {
    return `${base} text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]`;
  }
  return `${base} text-slate-600 hover:bg-brand-ink/5 hover:text-slate-900`;
}

function logoLinkClassName(active) {
  const base = "flex shrink-0 items-center border-b-2 border-transparent";
  if (active === "home") {
    return `${base} border-slate-900/35`;
  }
  return base;
}

export default function SiteHeader({
  currency = "EUR",
  guides = [],
  stories = [],
  navDicts = {},
}) {
  const pathname = usePathname();
  const active = getActiveSlug(pathname);
  const lang = langFromPathname(pathname);
  const nav = navDicts[lang] || navDicts.en || {};
  // Guides + Inspire have localized routes; other sections stay English.
  const navLinks = [
    { slug: "guides", label: nav.guides, href: localePath(lang, "/guides") },
    { slug: "destinations", label: nav.destinations, href: "/destinations" },
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

  // The Inspire index opens on a Coffee Bean band (founder mockup
  // 2026-09-04), and the bar goes dark with it so the top reads as one
  // block. Story pages stay on the light bar.
  const dark = barePath === "/inspire";
  // Currency only matters where prices show: home, /guides and story pages
  // (which sell the guides behind them). The Inspire index, Destinations
  // and About carry no prices, so no switcher (founder 2026-09-04).
  const showCurrency = !(
    barePath === "/inspire" ||
    barePath.startsWith("/destinations") ||
    barePath.startsWith("/about")
  );

  return (
    // Always the solid Bone bar (founder 2026-08-08: the hero photo no
    // longer runs behind it, so the transparent-over-photo state is gone).
    // Bone #F4F3EF, the styleguide's main background. NB: the brand-bone
    // token is #DCDACD - tailwind.config.js has the bone/parchment names
    // swapped relative to styleguide V3.
    <header
      className={`sticky top-0 z-50 border-b ${
        dark ? "border-white/10 bg-brand-ink" : "border-slate-200/40 bg-brand-parchment"
      }`}
    >
      <nav
        className={`mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between gap-3 px-4 text-sm md:gap-6 md:px-6 ${
          dark ? "text-brand-cream" : "text-slate-900"
        }`}
        aria-label="Primary"
      >
        <Link
          className={logoLinkClassName(active)}
          href="/"
          aria-current={active === "home" ? "page" : undefined}
        >
          {/* SVG logo needs no next/image optimization; plain img keeps it crisp. */}
          <img
            src={dark ? logoVerticalWhite.src : logoVertical.src}
            alt="TestedRoutes"
            className="h-[21px] w-auto md:h-[34px]"
          />
        </Link>

        {showHeaderSearch ? (
          <div className="hidden flex-1 justify-center px-6 md:flex">
            <div className="w-full max-w-xl">
              {/* In the Inspire section the header search suggests and lands
                  on stories; everywhere else it searches guides. */}
              <HomeSearchBar
                guides={active === "inspire" ? stories : guides}
                scope={active === "inspire" ? "inspire" : "guides"}
                variant="compact"
              />
            </div>
          </div>
        ) : null}

        {/* The language and currency selects are shared components with
            their own light styling; on the dark bar they are restyled from
            here as outlined pills in Bone. */}
        <div
          className={`hidden items-center gap-3 md:flex ${
            dark ? "[&_label]:text-brand-cream/70 [&_select]:border-white/30 [&_select]:bg-transparent [&_select]:text-brand-cream" : ""
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.slug}
              className={primaryNavLinkClass(active, link.slug, dark)}
              href={link.href}
              aria-current={active === link.slug ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          {/* Hidden, not removed: the nav must not shift between pages, so
              the switcher keeps its slot (visibility: hidden) where it is off. */}
          {showCurrency ? (
            <CurrencySwitcher current={currency} />
          ) : (
            <span className="invisible" aria-hidden="true">
              <CurrencySwitcher current={currency} />
            </span>
          )}
        </div>

        {/* The bottom tab bar covers primary nav on mobile, so the header
            only carries the language + currency switchers here. */}
        <div
          className={`flex items-center gap-2 md:hidden ${
            dark ? "[&_label]:text-brand-cream/70 [&_select]:border-white/30 [&_select]:bg-transparent [&_select]:text-brand-cream" : ""
          }`}
        >
          <LanguageSwitcher />
          {/* Hidden, not removed: the nav must not shift between pages, so
              the switcher keeps its slot (visibility: hidden) where it is off. */}
          {showCurrency ? (
            <CurrencySwitcher current={currency} />
          ) : (
            <span className="invisible" aria-hidden="true">
              <CurrencySwitcher current={currency} />
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
