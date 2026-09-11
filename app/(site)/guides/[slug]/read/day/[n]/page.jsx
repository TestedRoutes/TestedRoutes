/**
 * One gated day of the guide. URL is /read/day/<n> for any calendar day the
 * trip covers; a day that shares a deck page (e.g. Days 4-5) renders that
 * page, so /day/4 and /day/5 show the same content at their own URLs —
 * matching how a buyer thinks ("what's day 5?") rather than how the deck
 * paginates.
 */
import { redirect, notFound } from "next/navigation";
import { requireGuideAccess } from "../../../../../../_lib/guideAccess";
import { verifyPurchaseToken } from "../../../../../../_lib/purchaseToken";
import { loadSku } from "../../../../../../../db/loadSku";
import ReadGate from "../../ReadGate";
import DayChips from "../../DayChips";
import DayView, { pinsForDay, photoUrlFor } from "../../DayView";

export const dynamic = "force-dynamic";

export default async function ReadDayPage({ params, searchParams }) {
  const { slug, n } = await params;
  const { token } = await searchParams;
  if (token && verifyPurchaseToken(token)) {
    redirect(`/api/access/claim?token=${encodeURIComponent(token)}`);
  }

  const dayNumber = Number.parseInt(n, 10);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 60) notFound();

  const access = await requireGuideAccess(slug, token);
  const sku = await loadSku(slug);
  if (!access) return <ReadGate slug={slug} title={sku?.sku.title} />;
  if (!sku) notFound();

  const idx = sku.days.findIndex((d) => d.dayFrom <= dayNumber && dayNumber <= d.dayTo);
  if (idx === -1) notFound();
  const day = sku.days[idx];

  return (
    <div>
      <DayChips slug={slug} days={sku.days} active={day.dayFrom} />
      <DayView
        day={day}
        pins={pinsForDay(sku, day.dayFrom, day.dayTo)}
        photoUrl={photoUrlFor(slug, day)}
      />
    </div>
  );
}
