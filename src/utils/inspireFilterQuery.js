const DIMS = [
  "continent",
  "country",
  "duration",
  "activity",
  "difficulty",
  "suitableFor",
  "season",
  "budget",
  "guide",
];

export function emptySelection() {
  const o = {};
  for (const dim of DIMS) o[dim] = [];
  return o;
}

export function parseFromSearch(search) {
  const sel = emptySelection();
  let q = "";
  try {
    const params = new URLSearchParams(search || "");
    q = params.get("q") || params.get("search") || "";
    for (const dim of DIMS) {
      const vals = params.getAll(dim);
      if (vals && vals.length) sel[dim] = vals.map((v) => String(v)).filter(Boolean);
    }
  } catch (e) {
    console.warn("[inspireFilterQuery] parse failed", e);
  }
  return { facetSelection: sel, searchInput: q };
}

export function toQueryString(facetSelection, searchInput) {
  const params = new URLSearchParams();
  const s = facetSelection && typeof facetSelection === "object" ? facetSelection : {};
  for (const dim of DIMS) {
    const arr = s[dim];
    if (!Array.isArray(arr) || !arr.length) continue;
    for (const v of arr) {
      if (typeof v === "string" && v.trim()) params.append(dim, v.trim());
    }
  }
  const q = typeof searchInput === "string" ? searchInput.trim() : "";
  if (q) params.set("q", q);
  const str = params.toString();
  return str ? "?" + str : "";
}

export function replaceUrl(facetSelection, searchInput) {
  try {
    const qs = toQueryString(facetSelection, searchInput);
    const path = window.location.pathname || "";
    const next = path + qs + (window.location.hash || "");
    if (next !== window.location.pathname + window.location.search + (window.location.hash || "")) {
      window.history.replaceState(null, "", next);
    }
  } catch (e) {
    console.warn("[inspireFilterQuery] replaceUrl failed", e);
  }
}

export const inspireFilterQuery = { DIMS, emptySelection, parseFromSearch, toQueryString, replaceUrl };
export default inspireFilterQuery;
