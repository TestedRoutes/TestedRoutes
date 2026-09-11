/**
 * Reader overview: photo-led day cards + the bookings checklist.
 *
 * Gating happens here, not in the layout (layouts see no searchParams and
 * cannot set cookies). A valid ?token= is immediately bounced through
 * /api/access/claim so the credential moves into an httpOnly cookie and out
 * of the URL before any client JS — PostHog must never see tokens. (Because
 * the site layout streams, that bounce renders as a client-side redirect
 * stub; the canonical links we hand out point at the claim route directly.)
 *
 * The bookings checklist gets top billing right after the days on purpose:
 * it is the deadline surface — grouped by urgency band — and burying it in
 * day prose was the deck's one structural weakness the reader can fix.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireGuideAccess } from "../../../../_lib/guideAccess";
import { verifyPurchaseToken } from "../../../../_lib/purchaseToken";
import { loadSku } from "../../../../../db/loadSku";
import ReadGate from "./ReadGate";
import DayChips from "./DayChips";
import { photoUrlFor, pinsForDay } from "./DayView";

export const dynamic = "force-dynamic";

export default async function ReadOverviewPage({ params, searchParams }) {
  const { slug } = await params;
  const { token } = await searchParams;
  if (token && verifyPurchaseToken(token)) {
    redirect(`/api/access/claim?token=${encodeURIComponent(token)}`);
  }

  const access = await requireGuideAccess(slug, token);
  const sku = await loadSku(slug);
  if (!access) {
    return <ReadGate slug={slug} title={sku?.sku.title} />;
  }
  if (!sku) {
    // Entitled but the structured content is not published yet — the PDF
    // remains the product; point them at it rather than a dead end.
    return (
      <div className="py-12 text-center text-brand-taupe">
        <p className="mb-[3pt] mt-0">
          The online reader for this guide isn&apos;t live yet – your PDF download link keeps
          working, and this page will light up without any action from you.
        </p>
      </div>
    );
  }

  const groups = [];
  for (const r of sku.reservationRules) {
    const g = groups.find((x) => x.name === r.group);
    if (g) g.rules.push(r);
    else groups.push({ name: r.group, rules: [r] });
  }

  return (
    <div>
      <DayChips slug={slug} days={sku.days} active="overview" />

      <header className="mb-8">
        <p className="mb-[3pt] mt-0 font-script text-[32px] text-brand-terracotta">Your guide</p>
        <h1 className="font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
          {sku.sku.title}
        </h1>
        {sku.sku.subtitle ? (
          <p className="mb-[3pt] mt-2 max-w-2xl text-brand-taupe">{sku.sku.subtitle}</p>
        ) : null}
      </header>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-taupe">
          The days
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {sku.days.map((d) => {
            const photo = photoUrlFor(slug, d);
            const stops = pinsForDay(sku, d.dayFrom, d.dayTo)
              .filter((p) => p.role === "route")
              .map((p) => p.name);
            return (
              <li key={d.dayFrom}>
                <Link
                  href={`/guides/${slug}/read/day/${d.dayFrom}`}
                  className="group block overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card transition-shadow hover:shadow-card-hover"
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- gated photo route
                    <img
                      src={photo}
                      alt={d.photoCaption || d.title}
                      className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : null}
                  <div className="p-4">
                    <span className="block text-xs font-bold uppercase tracking-wide text-brand-terracotta">
                      {d.badge}
                    </span>
                    <span className="mt-0.5 block font-serif text-lg font-semibold text-brand-ink">
                      {d.title}
                    </span>
                    {d.subtitle ? (
                      <span className="mt-1 block text-sm leading-snug text-brand-taupe">
                        {d.subtitle}
                      </span>
                    ) : null}
                    {stops.length ? (
                      <span className="mt-2 block text-xs leading-snug text-brand-taupe">
                        {stops.slice(0, 4).join(" · ")}
                        {stops.length > 4 ? ` · +${stops.length - 4} more` : ""}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {groups.length ? (
        <section className="mt-12">
          <h2 className="mb-1 font-script text-[32px] text-brand-terracotta">
            Bookings, in the order you need them
          </h2>
          {groups.map((g) => (
            <div key={g.name ?? "other"} className="mb-6">
              {g.name ? (
                <p className="mb-[3pt] mt-3 text-xs font-bold uppercase tracking-wide text-brand-taupe">
                  {g.name}
                </p>
              ) : null}
              <ul className="mt-2 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
                {g.rules.map((r, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-4 p-4">
                    <div>
                      <p className="mb-[3pt] mt-0 font-semibold text-brand-ink">{r.label}</p>
                      {r.note ? (
                        <p className="mb-[3pt] mt-0.5 text-sm text-brand-taupe">{r.note}</p>
                      ) : null}
                    </div>
                    {r.leadTimeLabel ? (
                      <span className="shrink-0 rounded-full bg-brand-terracotta-soft px-3 py-1 text-xs font-semibold text-brand-terracotta">
                        {r.leadTimeLabel}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      <p className="mb-[3pt] mt-10 text-xs text-brand-taupe">
        Prefer the PDF? Your download link from the purchase email always serves the current
        version – this page and that file are the same content.
      </p>
    </div>
  );
}
