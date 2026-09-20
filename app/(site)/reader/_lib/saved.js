"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Bookmarked places, device-local. One localStorage key per country holding
 * a list of pin ids. No accounts, nothing leaves the browser — this is the
 * "make it mine" that costs no infrastructure (architecture doc: selection,
 * not construction). Every access is wrapped: storage can be absent or
 * throw in private windows and previews, and a bookmark is never worth an
 * error.
 *
 * useSaved(country) → { saved: Set<pinId>, toggle(pinId), has(pinId), ready }
 * `ready` is false until the first read after hydration so server and
 * client render the same empty state and the ticks fill in afterwards.
 */
const key = (country) => `tr_reader_saved_${country}`;

function read(country) {
  try {
    const raw = window.localStorage.getItem(key(country));
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function write(country, set) {
  try {
    window.localStorage.setItem(key(country), JSON.stringify([...set]));
  } catch {
    // Storage unavailable: the tick still shows for this page view.
  }
}

const EVENT = "tr-reader-saved";

export function useSaved(country) {
  const [saved, setSaved] = useState(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(read(country));
    setReady(true);
    // Keep every SaveButton on the page in step: a toggle anywhere
    // dispatches one event, and the grid, strip and place page all re-read.
    const sync = () => setSaved(read(country));
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [country]);

  const toggle = useCallback(
    (pinId) => {
      const next = read(country);
      if (next.has(pinId)) next.delete(pinId);
      else next.add(pinId);
      write(country, next);
      setSaved(next);
      window.dispatchEvent(new Event(EVENT));
    },
    [country],
  );

  const has = useCallback((pinId) => saved.has(pinId), [saved]);
  return { saved, toggle, has, ready };
}
