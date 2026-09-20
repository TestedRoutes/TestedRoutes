import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "../../../../../_lib/i18n";
import { loadReaderCountry } from "../../../_lib/loadReaderSku";
import { trackReaderView } from "../../../_lib/track";
import StoryCard from "../../../../inspire/StoryCard";

/**
 * Inspire: the site's Inspire section scoped to this country, on the same
 * story cards as /inspire (founder's header mock, 2026-09-20). Stories are
 * public, so nothing here is locked. The Sanity read is lazy and
 * best-effort, as in _lib/commerce.js: the reader must render from the repo
 * YAML with no Sanity at all, and without it this tab shows the empty line
 * and a link to /inspire instead of failing.
 */
async function countryStories(country) {
  try {
    const [{ loadInspireStories }, { buildInspireCard }] = await Promise.all([
      import("../../../../../_lib/loadInspireStories"),
      import("../../../../inspire/inspireIndexPage"),
    ]);
    const stories = await loadInspireStories("en");
    const code = String(country.code || "").toLowerCase();
    const name = String(country.name || "").toLowerCase();
    return stories
      .filter((s) => {
        const g = s.metadata?.geography || {};
        const c = String(g.country_code || "").toLowerCase();
        return c ? c === code : String(g.country || "").toLowerCase() === name;
      })
      .map((s) => buildInspireCard(s, "en"));
  } catch {
    return [];
  }
}

export default async function ReaderInspire({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "inspire");
  const cards = await countryStories(data.country);
  const t = getDict("en").inspireList;
  return (
    <>
      <p className="mb-6 max-w-2xl text-[15px] text-slate-600">Stories from the trips behind this guide.</p>
      {cards.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <StoryCard key={card.id} card={card} t={t} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          No stories for {data.country.name} yet.{" "}
          <Link href="/inspire" className="font-bold text-brand-terracotta">Browse every story</Link>
        </p>
      )}
    </>
  );
}
