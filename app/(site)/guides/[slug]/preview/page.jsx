/**
 * The free sample day — the only structured-content surface that is public.
 *
 * It reads from the private store but serves exactly one day: the one flagged
 * as guide_sku.sample_day in sku.yaml (never a signature-move day, same rule
 * as the PDF sample in guide.js). It renders through the same DayView as the
 * gated reader, so the sample honestly shows what buyers get and the two
 * can't drift apart. Indexable on purpose — this page is marketing — but not
 * added to the sitemap in Stage 1 (revisit with an SEO pass).
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadSampleDay, loadSku } from "../../../../../db/loadSku";
import DayView, { pinsForDay, photoUrlFor } from "../read/DayView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sample = await loadSampleDay(slug).catch(() => null);
  if (!sample) return {};
  return {
    title: `${sample.sku.title} – free sample day`,
    description: `One full day from the guide, exactly as buyers see it: ${sample.day.title}.`,
  };
}

export default async function PreviewPage({ params }) {
  const { slug } = await params;
  const sample = await loadSampleDay(slug).catch(() => null);
  if (!sample) notFound();
  const full = await loadSku(slug);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-[3pt] mt-0 text-sm text-slate-700">
          This is one complete day from <strong>{sample.sku.title}</strong>, exactly as buyers
          read it. The full guide covers all {sample.sku.durationDays} days, with hotels by
          budget, every booking deadline, costs and the pack list.
        </p>
        <Link
          href={`/guides/${slug}`}
          className="mt-3 inline-block rounded-full bg-[#fe6730] px-5 py-2 text-sm font-semibold text-white"
        >
          Get the full guide
        </Link>
      </div>

      <DayView
        day={sample.day}
        pins={full ? pinsForDay(full, sample.day.dayFrom, sample.day.dayTo) : []}
        photoUrl={photoUrlFor(slug, sample.day)}
      />

      <div className="mt-12 rounded-lg border border-slate-200 bg-white p-4 text-center">
        <p className="mb-[3pt] mt-0 text-sm text-slate-700">
          {sample.sku.durationDays - (sample.day.dayTo - sample.day.dayFrom + 1)} more days like
          this one, already worked out.
        </p>
        <Link href={`/guides/${slug}`} className="text-sm font-semibold text-[#943d21] underline">
          See what&apos;s in the guide →
        </Link>
      </div>
    </div>
  );
}
