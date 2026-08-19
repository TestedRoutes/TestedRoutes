// Card-grid skeleton for the Inspire browser — same rationale and shapes as
// the guides one: matching the loaded layout keeps the handoff jump-free.
function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="aspect-square w-full animate-pulse bg-slate-200 sm:aspect-[3/4]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function InspireLoading() {
  return (
    <main className="min-h-screen w-full bg-brand-parchment pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-72 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
