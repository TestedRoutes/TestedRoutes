/**
 * The trip map: every located point of the guide, tappable, each with a
 * Directions link — the buyer-facing replacement for the companion Google
 * My Maps (which buyers found genuinely hard to use). Gated like the rest
 * of the reader.
 *
 * The map is the headline, but the day-grouped list below it is load-bearing,
 * not decoration: it is the no-Google-key fallback, the screen-reader path,
 * and the "just give me the list" mode My Maps never had. Every entry carries
 * the same Directions link the pin card does.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireGuideAccess } from "../../../../../_lib/guideAccess";
import { verifyPurchaseToken } from "../../../../../_lib/purchaseToken";
import { loadSku } from "../../../../../../db/loadSku";
import ReadGate from "../ReadGate";
import DayChips from "../DayChips";
import GuideTripMap from "../GuideTripMap";

export const dynamic = "force-dynamic";

export default async function ReadMapPage({ params, searchParams }) {
  const { slug } = await params;
  const { token } = await searchParams;
  if (token && verifyPurchaseToken(token)) {
    redirect(`/api/access/claim?token=${encodeURIComponent(token)}`);
  }

  const access = await requireGuideAccess(slug, token);
  const sku = await loadSku(slug);
  if (!access) return <ReadGate slug={slug} title={sku?.sku.title} />;
  if (!sku) return <ReadGate slug={slug} />;

  const placeByPin = new Map(sku.places.map((p) => [p.pinId, p]));
  const order = { route: 0, extra: 1, detour: 2 };
  const pins = sku.skuPlaces
    .filter((j) => j.role in order)
    .sort(
      (a, b) =>
        (a.dayNumber ?? 99) - (b.dayNumber ?? 99) ||
        order[a.role] - order[b.role] ||
        (a.orderInDay ?? 99) - (b.orderInDay ?? 99),
    )
    .map((j) => {
      const p = placeByPin.get(j.pinId);
      if (!p || p.lat == null) return null;
      return {
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        role: j.role,
        day: j.dayNumber,
        description: p.description,
        goSlug: p.goSlug,
        photoUrl: p.photoRef ? `/api/guide-photo/${slug}/${p.photoRef}` : null,
      };
    })
    .filter(Boolean);

  const byDay = [];
  for (const p of pins) {
    const key = p.day ?? "anytime";
    const g = byDay.find((x) => x.key === key);
    if (g) g.pins.push(p);
    else byDay.push({ key, pins: [p] });
  }

  return (
    <div>
      <DayChips slug={slug} days={sku.days} active="map" />
      <header className="mb-5">
        <p className="mb-[3pt] mt-0 font-script text-[32px] text-brand-terracotta">The trip map</p>
        <p className="mb-[3pt] mt-0 max-w-2xl text-sm text-brand-taupe">
          Every point in the guide. Tap a pin for what it is and a Directions link – routes
          start from wherever you are standing.
        </p>
      </header>

      <GuideTripMap pins={pins} />

      <section className="mt-8">
        {byDay.map((g) => (
          <div key={g.key} className="mb-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-taupe">
              {g.key === "anytime" ? "Anywhere on the trip" : `Day ${g.key}`}
            </h2>
            <ul className="divide-y divide-brand-line overflow-hidden rounded-xl border border-brand-line bg-white">
              {g.pins.map((p, i) => (
                <li key={i} className="flex items-center gap-3 p-3">
                  <span
                    className={
                      "flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white " +
                      (p.role === "route" ? "bg-brand-terracotta" : "bg-brand-taupe")
                    }
                  >
                    {p.day ?? "·"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="mb-[3pt] mt-0 truncate text-sm font-semibold text-brand-ink">
                      {p.name}
                    </p>
                    {p.role !== "route" ? (
                      <p className="mb-[3pt] mt-0 text-xs uppercase tracking-wide text-brand-taupe">
                        {p.role}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 text-xs font-bold uppercase tracking-wide text-brand-terracotta underline"
                  >
                    Directions
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <p className="mb-[3pt] mt-6 text-xs text-brand-taupe">
        <Link href={`/guides/${slug}/read`} className="underline">
          ← Back to the days
        </Link>
      </p>
    </div>
  );
}
