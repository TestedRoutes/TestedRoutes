import GuidesIndexPage, { buildGuidesIndexMetadata } from "./guidesIndexPage";

export async function generateMetadata() {
  return buildGuidesIndexMetadata("en");
}

export default async function GuidesPage({ searchParams }) {
  // ?q= pre-fills the guide search — the home continent cards link here
  // with a country or continent name.
  const { q = "" } = (await searchParams) || {};
  return <GuidesIndexPage lang="en" q={q} />;
}
