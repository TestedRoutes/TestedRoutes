"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const LENGTH_CHIPS = [
  { value: "daytrip", label: "Day trips" },
  { value: "weekend", label: "Weekend trips" },
  { value: "week", label: "5–7 day routes" },
  { value: "2weeks", label: "2-week routes" },
  { value: "multi", label: "Multi-country routes" },
  { value: "expedition", label: "Expeditions" },
];

const DAY_TRIPS = [
  {
    title: "Triftbrücke from Zurich",
    price: "From €12.99",
    purchased: 412,
    href: "/guides/trift-bridge-from-zurich",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "hiking",
  },
  {
    title: "Stoos Ridge from Zurich",
    price: "From €9.99",
    purchased: 358,
    coming_soon: true,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "hiking",
  },
  {
    title: "Appenzell & Ebenalp from Zurich",
    price: "From €12.99",
    purchased: 396,
    coming_soon: true,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "train",
  },
  {
    title: "Mount Rigi from Zurich",
    price: "From €9.99",
    purchased: 441,
    coming_soon: true,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "train",
  },
  {
    title: "Säntis from Zurich",
    price: "From €12.99",
    purchased: 304,
    coming_soon: true,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "mixed",
  },
  {
    title: "Flims & Caumasee from Zurich",
    price: "From €9.99",
    purchased: 287,
    coming_soon: true,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    length: "daytrip",
    start: "zurich",
    style: "mixed",
  },
];

const LENGTH_PLACEHOLDERS = [
  { key: "weekend", title: "Weekend trips", copy: "Weekend routes coming soon." },
  { key: "week", title: "1-week routes", copy: "One-week routes coming soon." },
  { key: "2weeks", title: "2-week routes", copy: "Two-week routes coming soon." },
  { key: "multi", title: "Multi-country routes", copy: "Multi-country routes coming soon." },
];

export default function SwitzerlandPage() {
  const [duration, setDuration] = useState("");
  const [start, setStart] = useState("");
  const [style, setStyle] = useState("");

  const filteredDayTrips = useMemo(() => {
    return DAY_TRIPS.filter((card) => {
      const matchesLength = !duration || card.length === duration;
      const matchesStart = !start || card.start === start;
      const matchesStyle = !style || card.style === style;
      return matchesLength && matchesStart && matchesStyle;
    });
  }, [duration, start, style]);

  const showDayTrips = !duration || duration === "daytrip";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
      <section className="space-y-2">
        <p className="text-3xl font-semibold md:text-4xl">Explore Switzerland</p>
        <p className="text-sm text-slate-600">Self-guided travel routes you can follow independently</p>
      </section>

      <section className="flex flex-wrap gap-3">
        {LENGTH_CHIPS.map((chip) => {
          const isActive = duration === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setDuration(isActive ? "" : chip.value)}
              className={
                "rounded-full border px-4 py-2 text-xs font-semibold transition " +
                (isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
              }
            >
              {chip.label}
            </button>
          );
        })}
      </section>

      <section className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Start city</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          >
            <option value="">Any</option>
            <option value="zurich">Zurich</option>
            <option value="geneva">Geneva</option>
            <option value="lucerne">Lucerne</option>
            <option value="interlaken">Interlaken</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Duration</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Any</option>
            <option value="daytrip">1 day</option>
            <option value="weekend">2 days</option>
            <option value="week">5–7 days</option>
            <option value="2weeks">14 days</option>
            <option value="expedition">Expedition</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Travel style</span>
          <select
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="">Any</option>
            <option value="train">Train itinerary</option>
            <option value="road">Road trip</option>
            <option value="hiking">Hiking-focused</option>
            <option value="mixed">Mixed travel</option>
            <option value="multi">Multi-country</option>
          </select>
        </div>
      </section>

      <section className="space-y-6">
        {showDayTrips && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-slate-900">Day trips from Zurich</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDayTrips.map((card) => (
                <div key={card.title} className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                  <div className="h-44 w-full overflow-hidden rounded-t-3xl">
                    <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">DAY TRIP</p>
                    <p className="text-lg font-semibold text-slate-900">{card.title}</p>
                    <p className="text-sm text-slate-600">1 day • Mobile guide + PDF</p>
                    <p className="text-xs text-slate-500">{card.purchased} purchased</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold text-slate-900">{card.price}</span>
                      {card.coming_soon ? (
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-400">
                          Coming soon
                        </span>
                      ) : (
                        <Link
                          href={card.href}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                        >
                          View Guide
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {LENGTH_PLACEHOLDERS.map((group) => {
          const show = !duration || duration === group.key;
          if (!show) return null;
          return (
            <div key={group.key} className="space-y-4">
              <p className="text-lg font-semibold text-slate-900">{group.title}</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
                  {group.copy}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
