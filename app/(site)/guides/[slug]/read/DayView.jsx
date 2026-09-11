/**
 * One itinerary day in the reader's split layout: the executable timeline on
 * the left, the day's route on a full-height map on the right (desktop) or
 * below (mobile) — the itinerary-product layout buyers know, with one
 * deliberate difference: TestedRoutes days are TIMED. The hour rail is the
 * product's differentiator and must never flatten into a bare stop list.
 *
 * Shared by the gated day pages and the public sample day so the two can't
 * drift apart visually. Server component; only the map client-hydrates.
 */
import ReadDayMap from "./ReadDayMap";

const CALLOUT_STYLES = {
  info: "border-brand-bone bg-white",
  warning: "border-brand-flame bg-brand-terracotta-soft",
  booking: "border-brand-terracotta bg-brand-terracotta-soft",
};

export default function DayView({ day, pins, photoUrl }) {
  const spansDays = day.dayTo > day.dayFrom;
  const routeCount = pins?.filter((p) => p.role === "route").length ?? 0;
  const dirUrl = googleDirectionsUrl(pins?.slice(0, routeCount) ?? []);

  return (
    <div className="gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,42%)]">
      <article className="min-w-0">
        <header className="mb-7">
          <p className="mb-[3pt] mt-0 text-xs font-bold uppercase tracking-[0.2em] text-brand-terracotta">
            {day.badge}
          </p>
          <h1 className="font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
            {day.title}
          </h1>
          {day.subtitle ? (
            <p className="mb-[3pt] mt-2 text-brand-taupe">{day.subtitle}</p>
          ) : null}
          {photoUrl ? (
            <figure className="mt-5 overflow-hidden rounded-2xl shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element -- served by
                  the gated photo route; next/image's optimizer would need the
                  entitlement cookie forwarded and caches derivatives publicly */}
              <img
                src={photoUrl}
                alt={day.photoCaption || day.title}
                className="aspect-[16/9] w-full object-cover"
              />
              {day.photoCaption ? (
                <figcaption className="bg-white px-4 py-2 font-script text-sm text-brand-taupe">
                  {day.photoCaption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </header>

        <ol className="relative ml-3 border-l-2 border-brand-bone pl-7">
          {day.slots.map((slot, i) => (
            <li key={i} className="relative mb-7 last:mb-0">
              <span className="absolute -left-[41px] top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-brand-parchment bg-brand-terracotta px-1 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <p className="mb-[3pt] mt-0 text-xs font-semibold uppercase tracking-wide text-brand-taupe">
                {spansDays && slot.dayNumber ? `Day ${slot.dayNumber} · ` : ""}
                {slot.timeLabel ?? ""}
              </p>
              <p className="mb-[3pt] mt-0.5 font-serif text-lg font-semibold text-brand-ink">
                {slot.title}
              </p>
              {slot.body ? (
                <p className="mb-[3pt] mt-1 text-sm leading-relaxed text-brand-taupe">
                  {slot.body}
                </p>
              ) : null}
            </li>
          ))}
        </ol>

        {day.callouts?.length ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {day.callouts.map((c, i) => (
              <aside
                key={i}
                className={`rounded-xl border-l-4 p-4 shadow-card ${CALLOUT_STYLES[c.kind] ?? CALLOUT_STYLES.info}`}
              >
                <p className="mb-[3pt] mt-0 text-xs font-bold uppercase tracking-wide text-brand-ink">
                  {c.kind === "warning" ? "⚠ " : ""}
                  {c.title}
                </p>
                {c.body.map((line, j) => (
                  <p key={j} className="mb-[3pt] mt-1 text-sm leading-relaxed text-brand-taupe">
                    {line}
                  </p>
                ))}
              </aside>
            ))}
          </div>
        ) : null}

        {/* Mobile: the map card sits after the plan */}
        {pins?.length ? (
          <section className="mt-8 lg:hidden">
            <h2 className="mb-3 font-script text-[32px] text-brand-terracotta">On the map</h2>
            <ReadDayMap pins={pins} routeCount={routeCount} />
            <RouteLegs pins={pins} routeCount={routeCount} dirUrl={dirUrl} />
          </section>
        ) : null}
      </article>

      {/* Desktop: full-height sticky map beside the plan, with the day's
          route legs beneath it */}
      {pins?.length ? (
        <aside className="hidden lg:block">
          <div className="sticky top-14 flex h-[calc(100vh-4.5rem)] flex-col overflow-hidden rounded-2xl border border-brand-line shadow-card">
            <div className="min-h-0 flex-1">
              <ReadDayMap pins={pins} routeCount={routeCount} fill />
            </div>
            <div className="max-h-[38%] overflow-y-auto border-t border-brand-line bg-white px-4 py-3">
              <RouteLegs pins={pins} routeCount={routeCount} dirUrl={dirUrl} />
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

/**
 * The day's route as a leg list: numbered stops with a Google Maps
 * "Directions" link for each hop. Links only — leg drive times/distances
 * need the Directions API and belong to the publish step once a key exists,
 * not to page views.
 */
function RouteLegs({ pins, routeCount, dirUrl }) {
  const route = pins.slice(0, routeCount);
  if (route.length < 2) return dirUrl ? <DirectionsLink href={dirUrl} /> : null;
  return (
    <div>
      <ol className="m-0 list-none p-0">
        {route.map((p, i) => (
          <li key={i}>
            <div className="flex items-center gap-2 py-1">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <span className="truncate text-sm font-medium text-brand-ink">{p.name}</span>
            </div>
            {i < route.length - 1 ? (
              <div className="ml-[9px] border-l-2 border-dotted border-brand-bone py-0.5 pl-4">
                <a
                  href={legUrl(p, route[i + 1])}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-taupe underline hover:text-brand-terracotta"
                >
                  Directions
                </a>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {dirUrl ? (
        <p className="mb-0 mt-2">
          <DirectionsLink href={dirUrl} />
        </p>
      ) : null}
    </div>
  );
}

function legUrl(from, to) {
  return (
    "https://www.google.com/maps/dir/?" +
    new URLSearchParams({
      api: "1",
      origin: `${from.lat},${from.lng}`,
      destination: `${to.lat},${to.lng}`,
    }).toString()
  );
}

function DirectionsLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold text-brand-terracotta underline"
    >
      Open the day&apos;s route in Google Maps →
    </a>
  );
}

/**
 * One navigable link for the whole day: origin → waypoints → destination.
 * Google Maps accepts at most 9 waypoints; days here have ≤7 route pins.
 */
function googleDirectionsUrl(routePins) {
  if (routePins.length < 2) return null;
  const fmt = (p) => `${p.lat},${p.lng}`;
  const origin = routePins[0];
  const destination = routePins[routePins.length - 1];
  const waypoints = routePins.slice(1, -1).slice(0, 9);
  const params = new URLSearchParams({
    api: "1",
    origin: fmt(origin),
    destination: fmt(destination),
  });
  if (waypoints.length) params.set("waypoints", waypoints.map(fmt).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * The day's pins in itinerary order, each carrying its role. Route pins lead
 * (they draw the line and the directions link); extras and detours follow so
 * the map shows options after the plan, never instead of it.
 */
export function pinsForDay(canonical, dayFrom, dayTo) {
  const placeByPin = new Map(canonical.places.map((p) => [p.pinId, p]));
  const order = { route: 0, extra: 1, detour: 2 };
  return canonical.skuPlaces
    .filter(
      (j) =>
        j.role in order &&
        j.dayNumber != null &&
        j.dayNumber >= dayFrom &&
        j.dayNumber <= dayTo,
    )
    .sort(
      (a, b) =>
        order[a.role] - order[b.role] ||
        a.dayNumber - b.dayNumber ||
        (a.orderInDay ?? 99) - (b.orderInDay ?? 99),
    )
    .map((j) => {
      const p = placeByPin.get(j.pinId);
      return p && p.lat != null
        ? { lat: p.lat, lng: p.lng, name: p.name, role: j.role }
        : null;
    })
    .filter(Boolean);
}

export function photoUrlFor(slug, day) {
  return day.photoRef ? `/api/guide-photo/${slug}/${day.photoRef}` : null;
}
