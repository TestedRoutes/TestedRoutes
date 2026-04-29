import Link from "next/link";

export const metadata = {
  title: "Refund Policy · TestedRoutes",
  description:
    "30-day no-questions-asked refunds on every TestedRoutes guide. How to request a refund and how long it takes.",
};

const LAST_UPDATED = "29 April 2026";

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Refund Policy</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We want you to feel confident buying a guide. Every TestedRoutes guide
          comes with a 30-day, no-questions-asked refund.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">1. The 30-day window</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You can request a full refund within 30 days of your purchase, for any
          reason. You don't need to justify the request. The 30 days run from the
          date of the order confirmation email sent by our payment processor.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">2. How to request a refund</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Email{" "}
          <a className="underline" href="mailto:refunds@testedroutes.com">
            refunds@testedroutes.com
          </a>{" "}
          with:
        </p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>the email address you used at checkout, and
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-slate-400">•</span>the order ID from your order confirmation email (or the guide name if you can't find the order ID).
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-slate-600">
          We aim to respond within two business days.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">3. How the refund is processed</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Refunds are issued by our payment processor,{" "}
          <a
            className="underline"
            href="https://polar.sh"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar Software Inc.
          </a>
          , back to the original payment method. Once we initiate the refund, it
          typically reaches your account within 5–10 business days, depending on
          your bank or card issuer.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">4. After a refund</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Once a refund is issued we ask that you stop using the guide and delete
          any copies you've saved. We may revoke any active access link associated
          with the order.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">5. Beyond 30 days</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          We can't promise refunds outside the 30-day window, but if you have a
          genuine issue with a guide — something inaccurate, broken, or
          unusable — please get in touch anyway. We'd rather make it right than
          leave it.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">6. Your statutory rights</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If you are a consumer in the European Union, you have a statutory right
          to withdraw from a purchase within 14 days under the EU Consumer Rights
          Directive. Our 30-day refund policy is in addition to that right and
          does not limit it. Nothing in this policy affects mandatory consumer
          protections you have under the law of your country of residence.
        </p>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">7. Contact</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Refund requests:{" "}
          <a className="underline" href="mailto:refunds@testedroutes.com">
            refunds@testedroutes.com
          </a>
          . General questions:{" "}
          <a className="underline" href="mailto:hello@testedroutes.com">
            hello@testedroutes.com
          </a>
          . Full terms in our{" "}
          <Link className="underline" href="/terms">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
