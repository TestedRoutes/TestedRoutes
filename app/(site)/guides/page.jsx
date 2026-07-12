import GuidesIndexPage, { buildGuidesIndexMetadata } from "./guidesIndexPage";

export async function generateMetadata() {
  return buildGuidesIndexMetadata("en");
}

export default function GuidesPage() {
  return <GuidesIndexPage lang="en" />;
}
