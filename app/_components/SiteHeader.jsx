"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CurrencySwitcher from "./CurrencySwitcher";

const NAV_LINKS = [
  { slug: "destinations", label: "Destinations", href: "/destinations" },
  { slug: "guides", label: "Guides", href: "/guides" },
  { slug: "inspire", label: "Inspire", href: "/inspire" },
  { slug: "about", label: "About Me", href: "/about" },
];

function getActiveSlug(pathname) {
  if (!pathname || pathname === "/") return "home";
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  if (first === "destinations") return "destinations";
  if (first === "guides") return "guides";
  if (first === "inspire") return "inspire";
  if (first === "about") return "about";
  return null;
}

function primaryNavLinkClass(active, slug) {
  if (active === slug) {
    return "font-semibold text-slate-900 underline decoration-slate-800/35 decoration-1 underline-offset-[6px]";
  }
  return "font-normal text-slate-600 hover:text-slate-900";
}

function logoLinkClassName(active) {
  const base = "flex shrink-0 items-center border-b-2 border-transparent";
  if (active === "home") {
    return `${base} border-slate-900/35`;
  }
  return base;
}

export default function SiteHeader({ currency = "EUR" }) {
  const pathname = usePathname();
  const active = getActiveSlug(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-[#f7f4ef]/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6 text-sm text-slate-900"
        aria-label="Primary"
      >
        <Link
          className={logoLinkClassName(active)}
          href="/"
          aria-current={active === "home" ? "page" : undefined}
        >
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold uppercase tracking-[0.3em] text-slate-900">
              TESTEDROUTES
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.4em] text-slate-500">
              by Paulius Pikelis
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.slug}
              className={primaryNavLinkClass(active, link.slug)}
              href={link.href}
              aria-current={active === link.slug ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <CurrencySwitcher current={currency} />
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="16" />
              <line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200/60 bg-[#f7f4ef] px-6 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={link.href}
              aria-current={active === link.slug ? "page" : undefined}
              className={
                "block py-3 text-sm border-b border-slate-100 last:border-0 " +
                (active === link.slug
                  ? "font-semibold text-slate-900"
                  : "font-normal text-slate-600")
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <CurrencySwitcher current={currency} />
          </div>
        </div>
      )}
    </header>
  );
}
