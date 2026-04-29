"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";

/**
 * Renders the Sanity body field on the public guide page as a "preview":
 * shows everything up to (but not including) the third H2 block, then a
 * gate prompting purchase. If the body has fewer than 3 H2s, the whole
 * thing renders without truncation but the prompt still shows so buyers
 * know there is more in the PDF.
 */
function truncateAtThirdH2(blocks) {
  if (!Array.isArray(blocks)) return { preview: [], truncated: false };
  const preview = [];
  let h2Count = 0;
  let truncated = false;
  for (const block of blocks) {
    if (block?._type === "block" && block.style === "h2") {
      h2Count += 1;
      if (h2Count > 2) {
        truncated = true;
        break;
      }
    }
    preview.push(block);
  }
  return { preview, truncated };
}

const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-2 mt-6 font-['Georgia',serif] text-lg font-semibold text-[#1a1816]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 font-semibold text-[#1a1816]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-slate-200 pl-4 text-slate-600">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-3 text-sm leading-relaxed text-slate-700">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-3 list-disc space-y-1 pl-6 text-sm text-slate-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-3 list-decimal space-y-1 pl-6 text-sm text-slate-700">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;
      const isAffiliate = !!value?.isAffiliate;
      const className = isAffiliate
        ? "text-slate-900 underline decoration-[#0f6e56] decoration-2 underline-offset-2 hover:decoration-[#1a1816]"
        : "text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500";
      const target = value?.blank === false ? undefined : "_blank";
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;
      return (
        <a href={href} target={target} rel={rel} className={className}>
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-[#1a1816]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default function GuideBody({ blocks, checkoutHref, pdfHref, price }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;
  const { preview, truncated } = truncateAtThirdH2(blocks);
  const ctaHref = checkoutHref || pdfHref || null;
  const buttonLabel = price ? `Get the full guide – ${price}` : "Get the full guide";

  return (
    <section>
      <p className="mb-4 font-['Georgia',serif] text-xl font-semibold text-[#1a1816]">
        From the guide
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PortableText value={preview} components={components} />
        <div className="relative mt-6 -mx-6 -mb-6">
          {truncated ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-gradient-to-t from-white to-transparent"
            />
          ) : null}
          <div className="rounded-b-2xl bg-[#f1faf6] px-6 py-5">
            <p className="font-['Georgia',serif] text-base font-semibold text-[#1a1816]">
              {truncated
                ? "Continues in the full guide"
                : "Want the full plan?"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              The PDF includes the day-by-day plan, transport timings, booking
              links, weather rules, and route variants. Instant download after
              purchase.
            </p>
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                {buttonLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
