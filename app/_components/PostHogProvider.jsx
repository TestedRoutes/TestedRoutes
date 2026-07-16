"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// GDPR: PostHog is deliberately NOT initialised here. posthog.init() runs
// inside the Klaro "posthog" service callback (app/_lib/klaroConfig.js),
// which fires when the visitor accepts analytics — and again on every
// load with stored consent. Until then the SDK makes zero network
// requests (no config fetch, no autocapture, no replay). Relying on
// opt_out_capturing_by_default instead is not enough: PostHog persists
// its own opt-in flag in localStorage, which can outlive Klaro consent
// (expiry/re-prompt) and capture before the banner is re-answered.

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    const qs = searchParams?.toString();
    const url = window.location.origin + pathname + (qs ? `?${qs}` : "");
    if (posthog.__loaded && posthog.has_opted_in_capturing()) {
      posthog.capture("$pageview", { $current_url: url });
    } else {
      // Consent is applied async after hydration; stash the URL so the
      // Klaro opt-in callback can send the landing pageview it would
      // otherwise miss.
      window.__trPendingPageview = url;
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return children;
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
