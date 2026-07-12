import InspireIndexPage, { buildInspireIndexMetadata } from "./inspireIndexPage";

export async function generateMetadata() {
  return buildInspireIndexMetadata("en");
}

export default function InspirePage() {
  return <InspireIndexPage lang="en" />;
}
