import InspireIndexPage, { buildInspireIndexMetadata } from "./inspireIndexPage";

export async function generateMetadata() {
  return buildInspireIndexMetadata("en");
}

export default async function InspirePage({ searchParams }) {
  const { continent = "" } = (await searchParams) || {};
  return <InspireIndexPage lang="en" continent={continent} />;
}
