import Link from "next/link";
import Image from "next/image";
import HomeBrowse from "../_components/HomeBrowse";
import HomeGuideRequest from "../_components/HomeGuideRequest";
import { loadGuides, toGuideCard } from "../_lib/loadGuides";
import { getRequestCurrency } from "../_lib/currency";
import { getCategoryItems } from "../_lib/categoryPills";
import { PORTRAIT } from "../_lib/aboutImages";
import { getDict } from "../_lib/i18n";

export default async function HomePage() {
  const currency = await getRequestCurrency();
  const allGuides = await loadGuides(currency);
  const searchableGuides = allGuides.map((g) => ({
    title: g.title,
    slug: g.slug,
    category: g.category,
    href: g.href,
  }));
  const guideCards = allGuides.map(toGuideCard);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-16 pt-12 md:pt-16">
      <section className="space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="font-serif font-normal leading-[1.1] text-brand-ink text-2xl md:text-[26px] lg:text-5xl">
            <span className="md:hidden">Guides built from real trips</span>
            <span className="hidden md:inline">Travel guides built from real trips</span>
          </h1>
          <p className="font-serif text-sm font-light text-slate-600 md:text-[32px]">
            Skip the research. Take the trip
          </p>
        </div>
        <HomeBrowse
          guides={searchableGuides}
          categoryItems={getCategoryItems()}
          cards={guideCards}
          t={getDict("en").guideList}
        />
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[260px_1fr] md:gap-8">
        <Image
          src={PORTRAIT}
          alt="Paulius on the road"
          sizes="(min-width: 768px) 260px, 100vw"
          className="h-44 w-full rounded-2xl object-cover object-center md:h-full md:max-h-[320px]"
        />
        <div className="mt-6 space-y-5 md:mt-0">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About me</p>
            <h2 className="font-serif text-xl font-light leading-tight text-brand-ink md:text-[32px]">
              Fifteen years on the road.
            </h2>
            <p className="font-serif font-supersoft text-base font-light leading-relaxed text-slate-600">
              Real trips. Real routes. Not desk research, not aggregated reviews.
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="font-semibold text-slate-900">140 countries</span> travelled
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="font-semibold text-slate-900">500+ trips</span> documented over 15 years
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="font-semibold text-slate-900">5 of 7 Summits</span> climbed
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="font-semibold text-slate-900">4 Africa Rally</span> expeditions
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 sm:col-span-2">
              <span className="font-semibold text-slate-900">100+ bucket-list experiences</span> completed
            </li>
          </ul>
          <Link
            className="inline-flex text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 hover:decoration-slate-500"
            href="/about"
          >
            Read the full story →
          </Link>
        </div>
      </section>

      <HomeGuideRequest />
    </main>
  );
}
