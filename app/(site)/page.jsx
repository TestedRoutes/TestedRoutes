import Link from "next/link";
import HomeBrowse from "../_components/HomeBrowse";
import HomeGuideCard from "../_components/HomeGuideCard";
import HomeGuideRequest from "../_components/HomeGuideRequest";
import { HOME_GUIDES } from "../_lib/homeGuides";
import { loadGuides } from "../_lib/loadGuides";
import { getCategoryItems } from "../_lib/categoryPills";

export default async function HomePage() {
  const allGuides = await loadGuides();
  const searchableGuides = allGuides.map((g) => ({
    title: g.title,
    slug: g.slug,
    category: g.category,
    href: g.href,
  }));

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-16 pt-12 md:pt-16">
      <section className="space-y-10">
        <div className="space-y-2 text-center">
          <h1 className="font-['Georgia',serif] text-3xl font-semibold leading-[1.1] text-brand-blue md:text-4xl lg:text-5xl">
            Travel guides built from real trips
          </h1>
          <p className="text-lg text-slate-600 md:text-xl">
            Skip the research. Take the trip
          </p>
        </div>
        <HomeBrowse guides={searchableGuides} categoryItems={getCategoryItems()} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Browse guides</h2>
          <Link href="/guides" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {HOME_GUIDES.map((guide) => (
            <HomeGuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[260px_1fr] md:gap-8">
        <img
          src="/About%20me/About%20me2.jpg"
          alt="Paulius on the road"
          className="h-44 w-full rounded-2xl object-cover object-center md:h-full md:max-h-[320px]"
          loading="lazy"
        />
        <div className="mt-6 space-y-5 md:mt-0">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About me</p>
            <h2 className="font-['Georgia',serif] text-2xl font-semibold leading-tight text-brand-blue md:text-3xl">
              Fifteen years on the road.
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
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
              <span className="font-semibold text-slate-900">2 Africa Rally</span> expeditions
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
