/**
 * /reader with no slug: nothing to show. There is no library page yet (a
 * buyer with several guides is a Stage 4 concern), so send the visitor to
 * the site rather than list what exists.
 */
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ReaderIndex() {
  redirect("/guides");
}
