/**
 * Minimal Portable Text → markdown converter.
 *
 * Supports the block types produced by scripts/import-to-sanity.mjs:
 * - paragraphs, h1-h3, blockquote
 * - bullet / numbered lists (single-level)
 *
 * Inline formatting (strong/em/links) from future Studio edits is flattened
 * to plain text; add mark handling here if richer prose becomes important.
 */

function spanText(block) {
  if (!Array.isArray(block?.children)) return "";
  return block.children
    .filter((c) => c && c._type === "span")
    .map((c) => c.text || "")
    .join("");
}

export function portableTextToMarkdown(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";
  const lines = [];
  for (const block of blocks) {
    if (!block || block._type !== "block") continue;
    const text = spanText(block);
    const style = block.style || "normal";
    const listItem = block.listItem;

    if (listItem === "bullet") {
      lines.push(`- ${text}`);
    } else if (listItem === "number") {
      lines.push(`1. ${text}`);
    } else if (style === "h1") {
      lines.push(`# ${text}`);
    } else if (style === "h2") {
      lines.push(`## ${text}`);
    } else if (style === "h3") {
      lines.push(`### ${text}`);
    } else if (style === "blockquote") {
      lines.push(`> ${text}`);
    } else {
      lines.push(text);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}
