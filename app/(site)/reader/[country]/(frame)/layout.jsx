import { notFound } from "next/navigation";
import { hasReaderAccess } from "../../_lib/access";
import { loadReaderCountry } from "../../_lib/loadReaderSku";
import CountryFrame from "../../_components/CountryFrame";

/** Every tab page sits inside the country frame; the map page does not. */
export default async function FrameLayout({ children, params }) {
  const { country } = await params;
  const data = await loadReaderCountry(country);
  if (!data) notFound();
  const owned = await hasReaderAccess();
  return (
    <CountryFrame data={data} owned={owned}>
      {children}
    </CountryFrame>
  );
}
