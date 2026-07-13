import { getDict } from "../_lib/i18n";

// Founder byline under guide and story titles: the visible counterpart of
// the author JSON-LD. One person, one promise — "AI hasn't been there."
export default function Byline({ lang = "en" }) {
  const t = getDict(lang).guideList;
  return (
    <div className="mt-3 flex items-center gap-2.5">
      <img
        src="/About%20me/About%20me2.jpg"
        alt="Paulius Pikelis"
        className="h-8 w-8 rounded-full object-cover object-[50%_25%] ring-1 ring-slate-200"
      />
      <p className="text-xs text-slate-500">
        {t.testedBy}{" "}
        <span className="font-semibold text-slate-800">Paulius Pikelis</span>
        {" · "}
        {t.credentials}
      </p>
    </div>
  );
}
