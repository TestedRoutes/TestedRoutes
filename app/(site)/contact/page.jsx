import Link from "next/link";
import ContactForm from "../../_components/ContactForm";

export const metadata = {
  title: "Contact · TestedRoutes",
  description:
    "Send us a message about a guide, a refund, a privacy request, a partnership, or a security issue.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-16 pt-8">
      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Contact</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We&apos;re a small team and we read everything that comes in. Most
          messages get a real human reply within two business days.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Quick question? Try our{" "}
          <Link className="underline hover:text-slate-700" href="/faq">
            FAQ
          </Link>{" "}
          first – it covers delivery, refunds, formats, devices, and our
          update policy.
        </p>
      </section>

      <section className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <ContactForm />
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Prefer email?</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          You can also reach the right inbox directly:
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
          <li className="flex flex-wrap gap-x-2">
            <strong className="text-slate-900">General &amp; press:</strong>
            <a
              className="underline hover:text-slate-700"
              href="mailto:hello@testedroutes.com"
            >
              hello@testedroutes.com
            </a>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <strong className="text-slate-900">Refund requests:</strong>
            <a
              className="underline hover:text-slate-700"
              href="mailto:refunds@testedroutes.com"
            >
              refunds@testedroutes.com
            </a>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <strong className="text-slate-900">Privacy / data requests:</strong>
            <a
              className="underline hover:text-slate-700"
              href="mailto:hello@testedroutes.com"
            >
              hello@testedroutes.com
            </a>
            <span className="text-xs text-slate-500">
              (subject: &quot;GDPR data request&quot;)
            </span>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <strong className="text-slate-900">Partnerships:</strong>
            <a
              className="underline hover:text-slate-700"
              href="mailto:partners@testedroutes.com"
            >
              partners@testedroutes.com
            </a>
          </li>
          <li className="flex flex-wrap gap-x-2">
            <strong className="text-slate-900">Security issues:</strong>
            <a
              className="underline hover:text-slate-700"
              href="mailto:security@testedroutes.com"
            >
              security@testedroutes.com
            </a>
            <span className="text-xs text-slate-500">
              (see our{" "}
              <Link className="underline" href="/security">
                disclosure policy
              </Link>
              )
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Privacy &amp; data requests
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          If you&apos;re using this form to exercise your GDPR rights (access,
          rectification, erasure, portability, objection, restriction), please
          select <em>Privacy / data request</em> as the topic and describe the
          right you&apos;re exercising. We&apos;ll respond within one month, as
          the GDPR requires – usually much sooner. See our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>{" "}
          for the full list of rights and our supervisory authority details.
        </p>
      </section>
    </main>
  );
}
