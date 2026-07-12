"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getDict,
  langFromPathname,
  localePath,
  pathWithoutLocale,
} from "../_lib/i18n";

const TABS = [
  {
    slug: "explore",
    labelKey: "explore",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6">
        <circle cx="10.5" cy="10.5" r="6" />
        <line x1="15" y1="15" x2="20" y2="20" />
      </svg>
    ),
  },
  {
    slug: "guides",
    labelKey: "guides",
    href: "/guides",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" />
        <line x1="9" y1="4" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="20" />
      </svg>
    ),
  },
  {
    slug: "inspire",
    labelKey: "inspire",
    href: "/inspire",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3.5 13.8 8.7 19 10.5 13.8 12.3 12 17.5 10.2 12.3 5 10.5 10.2 8.7 12 3.5z" />
        <path d="M18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" />
      </svg>
    ),
  },
  {
    slug: "about",
    labelKey: "about",
    href: "/about",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </svg>
    ),
  },
];

function activeSlug(pathname) {
  if (!pathname || pathname === "/") return "explore";
  const first = pathname.split("/").filter(Boolean)[0];
  if (first === "guides") return "guides";
  if (first === "inspire") return "inspire";
  if (first === "about") return "about";
  // Destinations reads as part of browsing/exploring.
  if (first === "destinations") return "explore";
  return null;
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const barePath = pathWithoutLocale(pathname);
  const active = activeSlug(barePath);
  const lang = langFromPathname(pathname);
  const nav = getDict(lang).nav;

  // Guide detail pages swap the tab bar for the sticky buy bar.
  const parts = barePath.split("/").filter(Boolean);
  if (parts[0] === "guides" && parts.length === 2 && parts[1] !== "thanks") {
    return null;
  }

  return (
    <>
      {/* In-flow spacer so the fixed bar never covers the footer. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-brand-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
        aria-label="Primary mobile"
      >
        <div className="mx-auto flex h-16 max-w-md items-stretch justify-around">
          {TABS.map((tab) => {
            const isActive = active === tab.slug;
            // Guides + Inspire have localized routes; the rest stay English.
            const href =
              tab.slug === "inspire" || tab.slug === "guides"
                ? localePath(lang, tab.href)
                : tab.href;
            return (
              <Link
                key={tab.slug}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${
                  isActive
                    ? "font-semibold text-brand-ink"
                    : "font-normal text-slate-500"
                }`}
              >
                {/* Mint pill echoes the guide PDF's "DAY n" circles. */}
                <span
                  className={`flex items-center justify-center rounded-full px-3 py-0.5 ${
                    isActive ? "bg-brand-mint" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{nav[tab.labelKey]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
