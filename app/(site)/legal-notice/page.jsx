import Link from "next/link";

export const metadata = {
  title: "Legal Notice · TestedRoutes",
  description:
    "Legal entity details, registration, and dispute-resolution information for testedroutes.com.",
};

const LAST_UPDATED = "30 April 2026";

export default function LegalNoticePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Legal Notice</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Information about the operator of testedroutes.com, as required by EU
          and Lithuanian law and provided as a courtesy to all visitors.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. Operator</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm leading-relaxed text-slate-600 sm:grid-cols-[160px_1fr]">
          <dt className="font-semibold text-slate-900">Legal entity</dt>
          <dd>
            <strong>MB TestedRoutes</strong> – mažoji bendrija (small private
            company) registered in the Republic of Lithuania.
          </dd>

          <dt className="font-semibold text-slate-900">Registered address</dt>
          <dd>
            [Registered address – to be completed on registration]
          </dd>

          <dt className="font-semibold text-slate-900">Company code</dt>
          <dd>[Company code – to be completed on registration]</dd>

          <dt className="font-semibold text-slate-900">VAT number</dt>
          <dd>[VAT number – to be completed on registration]</dd>

          <dt className="font-semibold text-slate-900">Management</dt>
          <dd>Paulius Pikelis, founder and director</dd>

          <dt className="font-semibold text-slate-900">Contact email</dt>
          <dd>
            <a className="underline" href="mailto:hello@testedroutes.com">
              hello@testedroutes.com
            </a>
          </dd>
        </dl>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. Payment processor</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Payments on testedroutes.com are processed by{" "}
          <strong>Polar Software Inc.</strong> as our Merchant of Record. Polar
          appears as the seller on your invoice, handles payment processing and
          customer billing, and is responsible for collecting and remitting any
          applicable sales taxes (including EU VAT). See our{" "}
          <Link className="underline" href="/terms">
            Terms of Service
          </Link>{" "}
          for the full payment terms.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. Online dispute resolution</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          The European Commission provides an Online Dispute Resolution (ODR)
          platform for consumer disputes:{" "}
          <a
            className="underline"
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          We are not currently obliged, nor have we agreed, to participate in
          dispute resolution proceedings before a consumer arbitration board.
          We will, however, always try to resolve any dispute informally first –
          please email{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>{" "}
          and give us a chance to make it right.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. Editorial responsibility</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Responsible for the editorial content of testedroutes.com (per § 18
          (2) MStV / Article 14 of the Lithuanian Law on Provision of
          Information to the Public, where applicable):
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Paulius Pikelis, c/o MB TestedRoutes, [Registered address].
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Accessibility, security, privacy</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          See also our{" "}
          <Link className="underline" href="/accessibility">
            Accessibility Statement
          </Link>
          ,{" "}
          <Link className="underline" href="/security">
            Security &amp; Vulnerability Disclosure Policy
          </Link>
          , and{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
