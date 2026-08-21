"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import logoVertical from "../../content/brand/TR-logo-vertical.svg";
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

function primaryNavLinkClass(active, slug) {
  // Pill-on-hover: links carry their own padding so the highlight has a
  // shape; 5% Coffee Bean reads as a soft warm gray on Parchment.
  const base = "rounded-full px-3 py-1.5 font-bold tracking-[0.05em] transition-colors";
  if (active === slug) {
    return `${base} text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]`;
  }
  return `${base} text-slate-600 hover:bg-brand-ink/5 hover:text-slate-900`;
}

function emitHeaderSearchHover(hovering) {
  window.dispatchEvent(
    new CustomEvent("header-search-hover", { detail: hovering }),
  );
}

function logoLinkClassName(active) {
  const base = "flex shrink-0 items-center border-b-2 border-transparent";
  if (active === "home") {
    return `${base} border-slate-900/35`;
  }
  return base;
}

export default function SiteHeader({ currency = "EUR", guides = [], navDicts = {} }) {
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
  // null until a page reports on its own search bar — the home hero and the
  // Inspire filter card both do. The header search is the stand-in for
  // whichever one has scrolled away, so a page that reports gets the exact
  // handover point instead of the scroll guess below.
  const [pageSearchVisible, setPageSearchVisible] = useState(null);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    setPageSearchVisible(null);
    setScrolledPast(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => setPageSearchVisible(Boolean(e.detail));
    window.addEventListener("page-search-visible", handler);
    return () => window.removeEventListener("page-search-visible", handler);
  }, []);

  const barePath = pathWithoutLocale(pathname);
  const isSection =
    barePath.startsWith("/destinations") ||
    barePath.startsWith("/guides") ||
    barePath.startsWith("/inspire");

  // Fallback for section pages that report nothing (/guides, /destinations):
  // reveal the header search after a short scroll. A page whose own search
  // bar reports its visibility overrides this — 120px is a guess at "past the
  // header copy", and on /inspire that lands well above the cards.
  useEffect(() => {
    if (!isSection) return;
    const handler = () => setScrolledPast(window.scrollY > 120);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isSection]);

  // Home stays hidden until its hero reports, which it does on mount.
  const showHeaderSearch =
    pageSearchVisible !== null ? !pageSearchVisible : isSection && scrolledPast;

  return (
    // Always the solid Bone bar (founder 2026-08-08: the hero photo no
    // longer runs behind it, so the transparent-over-photo state is gone).
    // Bone #F4F3EF, the styleguide's main background. NB: the brand-bone
    // token is #DCDACD - tailwind.config.js has the bone/parchment names
    // swapped relative to styleguide V3.
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-brand-parchment">
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
            className="h-[21px] w-auto md:h-[34px]"
          />
        </Link>

        {showHeaderSearch ? (
          // Hovering here can open a page-owned panel — /inspire hangs its
          // full filter box off this search. The hover is announced on the
          // window rather than wired through props so the header stays
          // ignorant of what any given page wants to drop, the same loose
          // coupling the hero search uses to report its own visibility.
          <div
            className="hidden flex-1 justify-center px-6 md:flex"
            onMouseEnter={() => emitHeaderSearchHover(true)}
            onMouseLeave={() => emitHeaderSearchHover(false)}
          >
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
