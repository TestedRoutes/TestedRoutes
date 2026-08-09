/**
 * Guide page H1.
 *
 * Guide titles are "<Route>: <what the guide is>" — "Alp Flix to
 * Ausserferrera: A 2-Day Alpine Passes Trail Hike". Left to natural
 * wrapping the break lands wherever the column happens to run out, which
 * splits the descriptor mid-phrase ("… A 2-Day / Alpine Passes Trail
 * Hike"). Founder decision 2026-08-08: on guide pages the route always
 * gets line one and the descriptor line two.
 *
 * The tail is a block, not a <br>, so it can still wrap on its own on
 * narrow screens instead of forcing a horizontal overflow. Titles with no
 * colon render unchanged.
 */
export default function GuideTitle({ title, className }) {
  const raw = typeof title === "string" ? title : "";
  const at = raw.indexOf(":");
  const head = at > 0 ? raw.slice(0, at + 1) : raw;
  const tail = at > 0 ? raw.slice(at + 1).trim() : "";

  return (
    <h1 className={className}>
      <span className="block">{head}</span>
      {tail ? <span className="block">{tail}</span> : null}
    </h1>
  );
}
