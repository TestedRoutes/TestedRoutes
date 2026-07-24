import Link from "next/link";

export const metadata = {
  title: "Legal Notice · TestedRoutes",
  description:
    "Legal entity details, registration, and payment-processor information for testedroutes.com.",
};

const LAST_UPDATED = "16 July 2026";

export default function LegalNoticePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="font-bold md:font-light text-slate-900 text-2xl md:text-4xl lg:text-5xl">Legal Notice</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Information about the operator of testedroutes.com, as required by EU
          and Lithuanian law and provided as a courtesy to all visitors.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">1. Operator</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm leading-relaxed text-slate-600 sm:grid-cols-[160px_1fr]">
          <dt className="font-semibold text-slate-900">Company</dt>
          <dd>
            <strong>MB &bdquo;Tested routes&ldquo;</strong>, operating as
            TestedRoutes
          </dd>

          <dt className="font-semibold text-slate-900">Legal form</dt>
          <dd>Small partnership (mažoji bendrija), Republic of Lithuania</dd>

          <dt className="font-semibold text-slate-900">Company code</dt>
          <dd>308073804</dd>

          <dt className="font-semibold text-slate-900">Registered office</dt>
          <dd>
            Kėdainių r. sav., Vilainių sen., Vilainių k., Melioratorių g. 10,
            LT-58103, Lithuania
          </dd>

          <dt className="font-semibold text-slate-900">Register</dt>
          <dd>
            Register of Legal Entities of the Republic of Lithuania (VĮ
            Registrų centras)
          </dd>

          <dt className="font-semibold text-slate-900">Director</dt>
          <dd>Šarūnas Pikelis</dd>

          <dt className="font-semibold text-slate-900">VAT</dt>
          <dd>
            Registered Lithuanian VAT payer with effect from 1 August 2026;
            the VAT identification number will be published here once issued.
          </dd>

          <dt className="font-semibold text-slate-900">Contact</dt>
          <dd>
            <a className="underline" href="mailto:hello@testedroutes.com">
              hello@testedroutes.com
            </a>{" "}
            | legal notices:{" "}
            <a className="underline" href="mailto:legal@testedroutes.com">
              legal@testedroutes.com
            </a>
          </dd>
        </dl>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">2. Payment processor</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Payments on testedroutes.com are processed by Polar Software Inc. as
          our Merchant of Record: Polar appears as the seller on your invoice
          and handles billing and applicable sales taxes (including EU VAT).
          Full payment terms:{" "}
          <Link className="underline" href="/terms">
            Terms of Service
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-normal text-slate-900">3. Editorial responsibility</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Responsible for the editorial content of testedroutes.com:
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Paulius Pikelis, c/o MB &bdquo;Tested routes&ldquo;, Kėdainių r.
          sav., Vilainių sen., Vilainių k., Melioratorių g. 10, LT-58103,
          Lithuania.
        </p>
      </section>
    </main>
  );
}
