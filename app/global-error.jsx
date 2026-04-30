"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Catastrophic error boundary — only renders when the root layout
 * itself throws. Must include its own <html> + <body> because the
 * layout failed. CSS from globals.css is unavailable here, so we
 * inline minimal styles to keep the page on-brand.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#f7f4ef",
          color: "#0f172a",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#64748b",
              margin: "0 0 1rem 0",
            }}
          >
            Something broke badly
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 32,
              fontWeight: 600,
              margin: "0 0 1rem 0",
            }}
          >
            We hit a serious error
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "#475569",
              margin: "0 0 1.5rem 0",
            }}
          >
            Sorry – the site itself failed to load. The team has been notified
            automatically. Please try again in a few minutes, or email{" "}
            <a href="mailto:hello@testedroutes.com" style={{ color: "#0f6e56" }}>
              hello@testedroutes.com
            </a>{" "}
            if it persists.
          </p>
          <button
            type="button"
            onClick={() => reset && reset()}
            style={{
              cursor: "pointer",
              borderRadius: 9999,
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
