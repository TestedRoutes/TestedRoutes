"use client";

import { useEffect, useRef } from "react";

/**
 * Fires one anonymous guide_view to /api/e when a guide page mounts.
 *
 * Pairs with the server-side checkout_started capture — see the comment in
 * app/api/e/route.js for why the view side cannot be left to consent-gated
 * PostHog without making every conversion rate on the dashboard wrong.
 *
 * Renders nothing and never blocks paint.
 */
export default function ViewBeacon({ slug }) {
  // React StrictMode runs effects twice in development. Without this guard
  // local browsing would double every view, and the ratio it exists to
  // protect would be quietly halved in dev.
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !slug) return;
    sent.current = true;

    const params = new URLSearchParams(window.location.search);
    let referrerHost = null;
    if (document.referrer) {
      try {
        const host = new URL(document.referrer).host;
        // Internal navigation isn't an acquisition source; only record a
        // referrer when the visitor actually came from somewhere else.
        if (host && host !== window.location.host) referrerHost = host;
      } catch {
        // Opaque or malformed referrer — nothing worth recording.
      }
    }

    fetch("/api/e", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // keepalive so the request survives the visitor navigating straight
      // back out — bounces are exactly the views most worth counting.
      keepalive: true,
      body: JSON.stringify({
        event: "guide_view",
        slug,
        referrer_host: referrerHost,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
      }),
    }).catch(() => {
      // A failed beacon must never surface to the reader.
    });
  }, [slug]);

  return null;
}
