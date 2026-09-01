import InspireIndexPage, { buildInspireIndexMetadata } from "./inspireIndexPage";

export async function generateMetadata() {
  return buildInspireIndexMetadata("en");
}

export default async function InspirePage({ searchParams }) {
  // ?q= pre-fills the story search — the header search bar lands here when
  // a query matches no story title directly.
  const { continent = "", q = "" } = (await searchParams) || {};
  return <InspireIndexPage lang="en" continent={continent} q={q} />;
}
