"use client";

import { usePathname } from "next/navigation";
// locale.js, not i18n.js: keeps the five UI-string dictionaries out of the
// client bundle — this component only needs the registry and path helpers.
import {
  LOCALES,
  LANG_NAMES,
  DEFAULT_LOCALE,
  langFromPathname,
  pathWithoutLocale,
  localePath,
} from "../_lib/locale";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const current = langFromPathname(pathname);

  function switchTo(next) {
    if (next === current) return;
    // Prefer the page's own hreflang alternate when it exists (localized
    // story pages emit one per translation). Navigate by path so this works
    // in dev too, where metadataBase points at production.
    const alt = document.querySelector(
      `link[rel="alternate"][hreflang="${next}"]`,
    );
    if (alt?.href) {
      try {
        const u = new URL(alt.href);
        window.location.assign(u.pathname + u.search);
        return;
      } catch {
        // fall through to the defaults below
      }
    }
    if (next === DEFAULT_LOCALE) {
      // English covers the whole site — keep the visitor on the same page.
      window.location.assign(pathWithoutLocale(pathname));
      return;
    }
    // Stay where the user is: home, guides and inspire all have localized
    // routes. Detail pages without a translation fall back to their list.
    const bare = pathWithoutLocale(pathname);
    let target = "/";
    if (bare.startsWith("/guides")) target = "/guides";
    else if (bare.startsWith("/inspire")) target = "/inspire";
    window.location.assign(localePath(next, target));
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className="sr-only">Language</span>
      <select
        value={current}
        onChange={(e) => switchTo(e.target.value)}
        className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 transition hover:border-slate-300 focus:border-slate-400 focus:outline-none"
        aria-label="Language"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LANG_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
