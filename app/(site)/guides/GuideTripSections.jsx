import LocationMap from "../../_components/LocationMapClient";
import { DATE_LOCALES } from "../../_lib/i18n";

/**
 * Trip-detail sections shared by both guide layouts (classic guidePage and
 * the sales layout). Extracted so the sales page can show the stats table,
 * the route map and the timeline without importing guidePage (which imports
 * the sales page — that would be circular).
 */

export function formatReviewDate(iso, lang) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(DATE_LOCALES[lang] || "en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function PrimaryStats({ stats, lastReviewedDate, lang, t }) {
  const reviewLabel = formatReviewDate(lastReviewedDate, lang);
  if ((!Array.isArray(stats) || stats.length === 0) && !reviewLabel) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {(stats || []).map((stat) => (
          <div
            key={stat.label}
            className="grid grid-cols-[104px_1fr] gap-4 px-5 py-3 md:grid-cols-[200px_1fr]"
          >
            <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {stat.label}
            </p>
            <p className="text-[14px] text-slate-900">{stat.value}</p>
          </div>
        ))}
        {reviewLabel ? (
          <div className="grid grid-cols-[104px_1fr] gap-4 px-5 py-3 md:grid-cols-[200px_1fr]">
            <p className="self-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t.lastReviewed}
            </p>
            <p className="text-[14px] text-slate-900">{reviewLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TimelineBadge({ label, color }) {
  // Round badge matching the start / finish markers on the LocationMap.
  return (
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
      style={{ backgroundColor: color, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
    >
      {label}
    </span>
  );
}

function TimelineDrop({ color }) {
  // Teardrop with the TR emblem, matching the destination marker on the
  // LocationMap. The stop number lives in the eyebrow text beside it.
  return (
    <svg width="26" height="34" viewBox="0 0 36 48" aria-hidden className="shrink-0">
      <path
        d="M18 0C8.06 0 0 8.06 0 18c0 12.5 18 30 18 30s18-17.5 18-30C36 8.06 27.94 0 18 0z"
        fill={color}
      />
      <image href="/brand/tr-emblem-white.svg" x="8" y="8" width="20" height="20" />
    </svg>
  );
}

export function LocationSection({ start, destinations, finish, points, t }) {
  const dests = Array.isArray(destinations) ? destinations : [];
  if (!start && dests.length === 0) return null;
  const startColor = "#943d21";
  const destColor = "#1f0d07";
  const lastDestIndex = dests.length - 1;
  const multi = dests.length > 1;
  return (
    <section>
      <p className="mb-4 font-serif text-xl font-normal text-brand-ink">{t.location}</p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <ol className="relative space-y-5 pl-1">
          {start ? (
            <li className="flex gap-3">
              <span className="relative mt-0.5">
                <TimelineBadge label="S" color={startColor} />
                {dests.length > 0 || finish ? (
                  <span className="absolute left-[13px] top-7 h-8 w-px bg-slate-300" />
                ) : null}
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.startingPoint}
                </span>
                <span className="text-sm font-medium text-slate-900">{start.name}</span>
              </span>
            </li>
          ) : null}
          {dests.map((d, i) => {
            const showConnector = i < lastDestIndex || !!finish;
            const eyebrow = multi ? `${t.stop} ${i + 1}` : t.destination;
            return (
              <li key={`dest-${i}`} className="flex gap-3">
                <span className="relative mt-0.5">
                  <TimelineDrop color={destColor} />
                  {showConnector ? (
                    <span className="absolute left-[13px] top-9 h-7 w-px bg-slate-300" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {eyebrow}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{d.name}</span>
                </span>
              </li>
            );
          })}
          {finish ? (
            <li className="flex gap-3">
              <span className="mt-0.5">
                <TimelineBadge label="F" color={startColor} />
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t.finish}
                </span>
                <span className="text-sm font-medium text-slate-900">{finish.name}</span>
              </span>
            </li>
          ) : null}
        </ol>
        {/* isolate caps Leaflet's internal z-indexes (up to 1000) inside this
            box so the sticky buy bar and header always stay on top. */}
        <div className="relative z-0 isolate h-[320px] overflow-hidden rounded-xl ring-1 ring-slate-200">
          <LocationMap start={start} destinations={dests} finish={finish} points={points} />
        </div>
      </div>
    </section>
  );
}

export function buildLocation(guide) {
  const start =
    guide.startingPoint?.name && guide.startingPoint?.coordinates
      ? {
          name: guide.startingPoint.name,
          lat: guide.startingPoint.coordinates.lat,
          lng: guide.startingPoint.coordinates.lng,
        }
      : null;

  // Prefer the new routeStops array. Fall back to a single legacy
  // destination derived from story.title + story.coordinates so guides
  // authored before the multi-stop schema keep rendering unchanged.
  let destinations = [];
  if (Array.isArray(guide.routeStops) && guide.routeStops.length > 0) {
    destinations = guide.routeStops
      .filter((s) => s?.name && s?.coordinates?.lat && s?.coordinates?.lng)
      .map((s) => ({
        name: s.name,
        type: s.type || null,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
      }));
  } else if (guide.coordinates?.lat && guide.coordinates?.lng && guide.title) {
    destinations = [
      {
        name: guide.title,
        lat: guide.coordinates.lat,
        lng: guide.coordinates.lng,
        legacy: true,
      },
    ];
  }

  // Finish: prefer explicit finishPoint; fall back to start (round-trip).
  const finish =
    guide.finishPoint?.name && guide.finishPoint?.coordinates
      ? {
          name: guide.finishPoint.name,
          lat: guide.finishPoint.coordinates.lat,
          lng: guide.finishPoint.coordinates.lng,
        }
      : start
        ? { ...start }
        : null;

  // Route line: prefer the simplified GPX track (the actual trail); fall
  // back to connecting the coarse routePoints for guides without one.
  let points = null;
  if (typeof guide.trackLine === "string" && guide.trackLine.length > 0) {
    try {
      const parsed = JSON.parse(guide.trackLine);
      if (Array.isArray(parsed)) {
        points = parsed
          .filter((p) => Array.isArray(p) && p.length >= 2)
          .map(([lat, lng]) => ({ lat, lng }));
      }
    } catch {
      points = null;
    }
  }
  if (!points || points.length < 2) {
    points = Array.isArray(guide.routePoints)
      ? guide.routePoints
          .map((p) => p?.coordinates && { lat: p.coordinates.lat, lng: p.coordinates.lng })
          .filter(Boolean)
      : null;
  }
  return { start, destinations, finish, points };
}
