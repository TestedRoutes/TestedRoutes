"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
    persistence: "memory",
    person_profiles: "identified_only",
  });
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    const qs = searchParams?.toString();
    posthog.capture("$pageview", {
      $current_url:
        window.location.origin + pathname + (qs ? `?${qs}` : ""),
    });
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
