"use client";

import Link from "next/link";
import CardMediaCarousel, {
  buildMediaSlides,
} from "../../_components/CardMediaCarousel";
import { localePath } from "../../_lib/i18n";

// Whole card is the link ("more information"); buying happens on the guide
// page where the sticky bar keeps the purchase one tap away.
export default function GuideListCard({ guide, t, lang = "en" }) {
  const photos =
    Array.isArray(guide.cardPhotos) && guide.cardPhotos.length
      ? guide.cardPhotos.slice(0, 5)
      : guide.image
        ? [guide.image]
        : [];
  const slides = buildMediaSlides({ photos, videoUrl: guide.videoUrl });
  const href = localePath(lang, guide.href);

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        {slides.length ? (
          <CardMediaCarousel
            slides={slides}
            alt={guide.title}
            imgClassName="transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{guide.category}</p>
        <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
        <p className="text-sm text-slate-600">
          {guide.duration ? `${guide.duration} • ` : ""}
          {t.pdfGuide}
        </p>
        {guide.purchases ? (
          <p className="text-xs text-slate-500">
            {guide.purchases} {t.purchased}
          </p>
        ) : null}
        <div className="flex items-center justify-between pt-2">
          {guide.price ? (
            <span className="text-sm font-semibold text-slate-900">
              {t.from} {guide.price}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-slate-700">
            {t.viewGuide}
          </span>
        </div>
      </div>
    </Link>
  );
}
