export const metadata = {
  title: "Security & Vulnerability Disclosure · TestedRoutes",
  description:
    "How to report a security issue with testedroutes.com. We treat reports promptly and won't take legal action against good-faith research.",
};

const LAST_UPDATED = "30 April 2026";

export default function SecurityPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Security &amp; Vulnerability Disclosure
        </h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          The security of our customers&apos; data is important to us. If you
          believe you&apos;ve found a vulnerability or security issue with
          testedroutes.com, please tell us so we can fix it.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. How to report</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Email{" "}
          <a className="underline" href="mailto:security@testedroutes.com">
            security@testedroutes.com
          </a>{" "}
          with a description of the issue and step-by-step reproduction
          instructions. Where possible, include affected URLs, screenshots, and
          any relevant payload or request data. We will acknowledge your report
          within two business days.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. Responsible disclosure</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          While we work on a fix, we ask that you:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            do not publicly disclose the issue until we have had a reasonable
            opportunity to address it (typically 90 days);
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            do not exploit the vulnerability beyond what is necessary to prove
            its existence;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            do not access, modify, or destroy data belonging to other users;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            do not perform automated, destructive, or denial-of-service testing
            against our infrastructure.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. Safe harbour</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Where research is conducted in line with this policy, we consider it
          authorised. We will not pursue legal action against you for accessing
          our systems in good faith for the purpose of identifying and reporting
          a security issue.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. Rewards</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We do not run a paid bug-bounty programme by default. For genuinely
          serious findings (e.g. authentication bypass, data exposure, payment
          manipulation) we may, at our discretion, offer a reward or recognition
          for responsible disclosure. We will discuss any reward on a
          case-by-case basis.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Out of scope</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The following are generally <em>not</em> considered security
          vulnerabilities for the purposes of this policy:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            issues in third-party services we use (Vercel, Sanity, Polar,
            Beehiiv, PostHog, Sentry) – please report those directly to the
            provider;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            missing security headers without a demonstrated impact;
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            email-spoofing reports based solely on missing or partial DMARC /
            SPF records (we are tightening these on an ongoing basis);
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>
            theoretical issues without a working proof of concept.
          </li>
        </ul>
      </section>
    </main>
  );
}
