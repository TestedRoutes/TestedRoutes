// Locale registry + UI-string dictionaries.
//
// Content model: translations are separate Sanity story documents sharing a
// storyId, distinguished by the `language` field. English lives at the URL
// root; other locales are path-prefixed (/de/inspire/...). Only Inspire is
// localized so far — guides, destinations and utility pages stay English
// until their content is translated.

export const LOCALES = ["en", "de", "es", "fr", "lt"];
export const DEFAULT_LOCALE = "en";
export const ALT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

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
