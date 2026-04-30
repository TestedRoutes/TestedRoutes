"use client";

import { useEffect } from "react";
import klaroConfig from "../_lib/klaroConfig";

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
export default function CookieConsent() {
  useEffect(() => {
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
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return <div id="klaro" />;
}
