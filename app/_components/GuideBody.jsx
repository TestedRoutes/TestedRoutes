"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getDict } from "../_lib/i18n";
import CollapsibleSection from "./CollapsibleSection";

/**
 * Renders the Sanity body field on the public guide page as a "preview":
 * a short excerpt (up to the third H2, capped at 6 blocks either way),
 * then a gate prompting purchase. Keeping the on-page excerpt short means
 * the guide page and its Inspire story stay distinct documents for search
 * engines — the full narrative lives on the story page, linked below.
 */
function truncateForPreview(blocks) {
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
    if (preview.length >= 6) {
      truncated = true;
      break;
    }
    preview.push(block);
  }
  return { preview, truncated };
}

const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-2 mt-6 font-serif text-lg font-normal text-brand-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-5 font-medium text-brand-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-slate-200 pl-4 text-slate-600">
        {children}
      </blockquote>
    ),
    // 3pt AFTER each paragraph, nothing before — founder's paragraph-spacing
    // spec (2026-07). Applies to guide bodies and story bodies alike.
    normal: ({ children }) => (
      <p className="mb-[3pt] mt-0 text-sm leading-relaxed text-slate-700">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-[3pt] mt-0 list-disc space-y-[3pt] pl-6 text-sm text-slate-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-[3pt] mt-0 list-decimal space-y-[3pt] pl-6 text-sm text-slate-700">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;
      const isAffiliate = !!value?.isAffiliate;
      const className = isAffiliate
        ? "text-slate-900 underline decoration-brand-terracotta decoration-2 underline-offset-2 hover:decoration-brand-ink"
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
      <strong className="font-semibold text-brand-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// Deliberately no link out to the Inspire story here: the guide page is the
// purchase surface, and the story→guide funnel only runs one way.
export default function GuideBody({ blocks, checkoutHref, pdfHref, price, t: tProp, bare }) {
  const t = tProp || getDict("en").guide;
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  // `bare`: the sales layout supplies its own heading and CTAs, and its body
  // is written short on purpose — render the prose alone, untruncated.
  if (bare) return <PortableText value={blocks} components={components} />;

  const { preview, truncated } = truncateForPreview(blocks);
  const ctaHref = checkoutHref || pdfHref || null;
  const buttonLabel = price ? `${t.getFullGuide} – ${price}` : t.getFullGuide;

  return (
    <CollapsibleSection title={t.myExperience}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PortableText value={preview} components={components} />
        <div className="relative mt-6 -mx-6 -mb-6">
          {truncated ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-full h-16 bg-gradient-to-t from-white to-transparent"
            />
          ) : null}
          <div className="rounded-b-2xl bg-brand-bone px-6 py-5">
            <p className="font-serif text-base font-medium text-brand-ink">
              {truncated ? t.continuesInFull : t.wantFullPlan}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {t.pdfIncludes}
            </p>
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="mt-3 inline-flex rounded-full bg-brand-terracotta px-4 py-2 text-xs font-normal tracking-[0.05em] text-white transition hover:bg-brand-terracotta/90"
              >
                {buttonLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
