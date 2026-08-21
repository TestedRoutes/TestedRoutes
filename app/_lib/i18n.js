// Locale registry + UI-string dictionaries — aggregator.
//
// The helpers live in ./locale.js and the five dictionaries in ./dicts/*.js.
// This module re-exports all of it so server code keeps one import path.
// The split exists for the client bundle: importing any helper from here
// used to drag all five dictionaries (~48 KB) into every page via
// SiteHeader/MobileTabBar. Client components now import helpers from
// ./locale.js and receive their resolved strings as props (or import a
// single locale from ./dicts/ as a fallback) — nothing under "use client"
// should import this module. Translators: edit ./dicts/<lang>.js.
//
// Content model: translations are separate Sanity story documents sharing a
// storyId, distinguished by the `language` field. English lives at the URL
// root; other locales are path-prefixed (/de/inspire/...). Only Inspire is
// localized so far — guides, destinations and utility pages stay English
// until their content is translated.

export {
  ALL_LOCALES,
  LOCALES,
  DEFAULT_LOCALE,
  ALT_LOCALES,
  PAUSED_LOCALES,
  LANG_NAMES,
  DATE_LOCALES,
  isLocale,
  langFromPathname,
  pathWithoutLocale,
  localePath,
} from "./locale";

import en from "./dicts/en";
import de from "./dicts/de";
import es from "./dicts/es";
import fr from "./dicts/fr";
import lt from "./dicts/lt";

const DICTS = { en, de, es, fr, lt };

export function getDict(lang) {
  return DICTS[lang] || DICTS.en;
}
