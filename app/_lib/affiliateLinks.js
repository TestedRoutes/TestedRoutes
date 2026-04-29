/**
 * Walks a Sanity Portable Text body and pulls out every link annotation.
 * Used by the guide page to populate the BuyBox tickbox (essential
 * bookings open in new tabs at checkout) and the /guides/<slug>/links
 * page (full list, grouped).
 */

function flattenSpans(block) {
  if (!Array.isArray(block?.children)) return "";
  return block.children
    .filter((c) => c && c._type === "span")
    .map((c) => c.text || "")
    .join("");
}

/**
 * @returns {Array<{href: string, text: string, isAffiliate: boolean, category: string|null, blockKey: string|null}>}
 */
export function extractLinks(blocks) {
  if (!Array.isArray(blocks)) return [];
  const out = [];
  for (const block of blocks) {
    if (block?._type !== "block" || !Array.isArray(block.children)) continue;
    const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
    const linkMarks = new Map(
      markDefs
        .filter((m) => m && m._type === "link")
        .map((m) => [m._key, m]),
    );
    if (linkMarks.size === 0) continue;
    for (const span of block.children) {
      if (!span || span._type !== "span") continue;
      const marks = Array.isArray(span.marks) ? span.marks : [];
      for (const markKey of marks) {
        const link = linkMarks.get(markKey);
        if (!link?.href) continue;
        out.push({
          href: link.href,
          text: span.text || link.href,
          isAffiliate: !!link.isAffiliate,
          category: link.affiliateCategory || null,
          blockKey: block._key || null,
        });
      }
    }
  }
  return out;
}

export function getEssentialBookings(blocks) {
  return extractLinks(blocks).filter(
    (l) => l.isAffiliate && l.category === "essential_booking",
  );
}

export function getAffiliateLinks(blocks) {
  return extractLinks(blocks).filter((l) => l.isAffiliate);
}

/**
 * Group affiliate links by category, in display order. Categories with
 * no links are omitted.
 */
export function groupAffiliateLinks(blocks) {
  const links = getAffiliateLinks(blocks);
  const order = [
    { value: "essential_booking", label: "Essential bookings" },
    { value: "tour", label: "Tours & activities" },
    { value: "gear", label: "Gear" },
    { value: "general", label: "Other" },
  ];
  const groups = order
    .map(({ value, label }) => ({
      label,
      value,
      links: links.filter((l) => (l.category || "general") === value),
    }))
    .filter((g) => g.links.length > 0);
  // Any link with an unrecognised category falls into "Other"
  const known = new Set(order.map((o) => o.value));
  const orphans = links.filter((l) => !known.has(l.category || "general"));
  if (orphans.length) {
    const otherGroup = groups.find((g) => g.value === "general");
    if (otherGroup) {
      otherGroup.links = [...otherGroup.links, ...orphans];
    } else {
      groups.push({ label: "Other", value: "general", links: orphans });
    }
  }
  return groups;
}
