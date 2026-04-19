const GUIDES_BASE = "/Content/Guides/";
const MANIFEST_URL = "/Content/Guides/guides-manifest.json";

function encodeFolder(name) {
  return name.split("/").map(encodeURIComponent).join("/");
}

export async function loadGuides() {
  const manifest = await fetch(MANIFEST_URL, { credentials: "same-origin" }).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  });

  const raw = Array.isArray(manifest) ? manifest : (manifest.guides ?? []);

  return raw
    .filter((g) => g && typeof g.folder === "string" && g.folder.trim() && typeof g.title === "string" && g.title.trim())
    .map((g) => {
      const folderPath = `${GUIDES_BASE}${encodeFolder(g.folder.trim())}/`;
      const pdfHref = g.pdfFile ? `${folderPath}${encodeURIComponent(g.pdfFile)}` : null;
      const href = g.guidePageHref || pdfHref || null;
      return {
        slug: g.slug || g.folder,
        title: g.title,
        category: g.category || "Guide",
        duration: g.duration || "",
        price: g.price || "",
        image: g.image || null,
        href,
        pdfHref,
        meta: g.pdfFile && g.pptxFile ? "PDF + slides" : g.pdfFile ? "PDF guide" : "Guide",
      };
    });
}
