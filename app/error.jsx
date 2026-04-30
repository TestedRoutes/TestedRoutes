"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

/**
 * Segment-level error boundary. Catches runtime errors thrown by any
 * route under app/. Reports them to Sentry, then shows a friendly
 * fallback so the buyer can recover instead of seeing a generic
 * "Application error" wall.
 *
 * For root-level errors (when the layout itself throws), Next renders
 * app/global-error.jsx instead.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        Something broke
      </p>
      <h1 className="font-['Georgia',serif] text-3xl font-semibold text-slate-900 md:text-4xl">
        Sorry – we hit an error
      </h1>
      <p className="max-w-md text-base text-slate-600">
        Something on our end didn&apos;t work the way it should. We&apos;ve
        logged the issue and a human will look at it. In the meantime, try
        again or head back to the homepage.
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="cursor-pointer rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        If this keeps happening, please tell us at {" "}
        <Link className="underline hover:text-slate-700" href="/contact">
          /contact
        </Link>{" "}
        with what you were doing – we&apos;ll fix it.
      </p>
    </main>
  );
}
