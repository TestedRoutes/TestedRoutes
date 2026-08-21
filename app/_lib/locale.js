// Locale registry + UI-string dictionaries.
//
// Content model: translations are separate Sanity story documents sharing a
// storyId, distinguished by the `language` field. English lives at the URL
// root; other locales are path-prefixed (/de/inspire/...). Only Inspire is
// localized so far — guides, destinations and utility pages stay English
// until their content is translated.

// The full registry — translated Inspire stories exist in Sanity for these,
// the dictionaries in ./dicts/ cover them, and the /[lang] routes know them.
export const ALL_LOCALES = ["en", "de", "es", "fr", "lt"];

// Localization is PAUSED (founder 2026-08-21: no time to build out the other
// languages yet). Serving locales are gated here and everything downstream —
// the language switcher, /[lang] routes, sitemap entries, hreflang
// alternates, per-language count queries — collapses on its own. To
// re-enable, set this back to ALL_LOCALES; nothing was deleted. While
// paused, /[lang] URLs 307-redirect to their English path (see the /[lang]
// pages) so old links and anything indexed keep working.
export const LOCALES = ["en"];
export const DEFAULT_LOCALE = "en";
export const ALT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
// The paused prefixes — what the /[lang] routes must still recognize in
// order to redirect rather than 404.
export const PAUSED_LOCALES = ALL_LOCALES.filter((l) => !LOCALES.includes(l));

export const LANG_NAMES = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  lt: "Lietuvių",
};

// For Date#toLocaleDateString on server-rendered dates.
export const DATE_LOCALES = {
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  lt: "lt-LT",
};

export function isLocale(value) {
  return LOCALES.includes(value);
}

export function langFromPathname(pathname) {
  const first = (pathname || "").split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

// Strip a leading locale prefix: "/de/inspire/x" → "/inspire/x".
export function pathWithoutLocale(pathname) {
  const lang = langFromPathname(pathname);
  if (lang === DEFAULT_LOCALE) return pathname || "/";
  const stripped = (pathname || "").replace(new RegExp(`^/${lang}(?=/|$)`), "");
  return stripped || "/";
}

export function localePath(lang, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!lang || lang === DEFAULT_LOCALE) return p;
  return `/${lang}${p === "/" ? "" : p}`;
}
