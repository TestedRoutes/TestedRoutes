import { notFound } from "next/navigation";
import { loadReaderCountry } from "../_lib/loadReaderSku";
import { trackReaderView } from "../_lib/track";
import CountryPage from "../_components/CountryPage";

/** The gated Overview: the country page with everything open and no buy box. */
export default async function ReaderOverview({ params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  trackReaderView(country, "overview");
  return <CountryPage data={data} owned />;
}
