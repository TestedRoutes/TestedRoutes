"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import klaroConfig from "../_lib/klaroConfig";
import "./klaroOverrides.css";

/**
 * Mounts the Klaro cookie-consent banner once on the client.
 *
 * Klaro is loaded dynamically (not statically imported) so it doesn't
 * ship in the SSR bundle and doesn't run before the client hydrates.
 * The CSS is also imported here so it tree-shakes out of pages that
 * don't render this component (we only mount it in the root layout).
 *
 * To open the modal manually (e.g. from a "Cookie settings" footer link):
 *   window.klaro?.show()
 */

/**
 * Can this document touch sessionStorage at all?
 *
 * Klaro's ConsentManager constructor always builds a sessionStorage-backed
 * auxiliary store - `new SessionStorageStore(this)`, hard-coded, ignoring our
 * `storageMethod: "cookie"`. Chrome throws on the bare `sessionStorage` lookup
 * whenever site data is blocked outright (privacy-hardened profiles, headless
 * crawlers) or the document has an opaque origin, so `klaro.setup()` died
 * before the banner mounted and the rejection reached Sentry unhandled
 * (SecurityError: "Failed to read the 'sessionStorage' property from
 * 'Window': Access is denied for this document.", /inspire/:slug, 2026-09-07).
 *
 * Probing first costs one property read and skips the Klaro chunk (70 KB over
 * the wire) for those visitors. Nothing is lost: a browser that refuses all
 * site data can't store a consent choice, and no service here can set a
 * cookie without one.
 */
function storageAvailable() {
  try {
    return Boolean(window.sessionStorage);
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  useEffect(() => {
    if (!storageAvailable()) return;
    let mounted = true;
    (async () => {
      const klaro = await import("klaro/dist/klaro");
      await import("klaro/dist/klaro.min.css");
      if (!mounted) return;
      // Make the manager globally accessible so the footer button can
      // call `window.klaro.show()` without re-importing the package.
      if (typeof window !== "undefined") {
        window.klaro = klaro;
      }
      klaro.setup(klaroConfig);
    })().catch((err) => {
      // A consent banner that fails to mount must not surface as an unhandled
      // rejection: Sentry files those with no frames of ours and no way to act
      // on them. Whatever still lands here is genuinely unexpected - a config
      // the next Klaro version rejects, a chunk that never arrived - so report
      // it as handled instead of swallowing it.
      Sentry.captureException(err, { tags: { area: "cookie-consent" } });
    });
    return () => {
      mounted = false;
    };
  }, []);

  return <div id="klaro" />;
}
