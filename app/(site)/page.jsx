import Link from "next/link";
import HomeBrowse from "../_components/HomeBrowse";
import HomeGuideCard from "../_components/HomeGuideCard";
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
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
      <section className="space-y-3">
        <div className="text-center">
          <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
            Travel guides built from real trips
          </h1>
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

      <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Need help refining your route?</p>
          <p className="text-xs text-slate-500">Add personal support after purchasing any guide.</p>
        </div>
        <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span>Personal Trip Session</span>
            <span className="font-semibold text-slate-900">€99</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span>Trip Setup Assistance</span>
            <span className="font-semibold text-slate-900">€249</span>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid md:grid-cols-[220px_1fr] md:gap-8">
        <div className="h-44 w-full rounded-2xl bg-slate-100" />
        <div className="mt-6 space-y-4 md:mt-0">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">About Me</p>
          <div className="grid gap-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">140 countries visited</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">
                15 years planning trips independently for myself, family, and friends
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="font-semibold text-slate-900">
                Mission: help people travel more and waste less time planning
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
