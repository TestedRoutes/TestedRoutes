// Responsive-srcset helper for Sanity CDN renditions. The app bakes one
// width into each image URL at shaping time (hero 1600px, cards 1080px),
// which forces every screen to download that one cut. The CDN resizes via
// the `w` query param, so a srcset is the same URL at several widths and
// the browser picks. Plain module (no "use client") so server components
// and client components share one implementation.
//
// Non-Sanity URLs, or ones without a `w` param, return undefined and the
// <img> behaves exactly as before.
export const CARD_SRCSET_WIDTHS = [480, 720, 1080];

export function sanitySrcSet(src, widths = CARD_SRCSET_WIDTHS) {
  if (!/^https:\/\/cdn\.sanity\.io\//.test(src || "") || !/[?&]w=\d+/.test(src)) return undefined;
  return widths
    .map((w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(", ");
}
