/**
 * The day-14 rating email (Tracker #62) — the ONLY email TestedRoutes
 * sends a buyer. The purchase moment belongs to Polar's receipt (founder
 * decision 2026-08-19: one purchase, one email); two weeks later, when
 * the trip is plausibly taken, this asks for a rating and delivers the
 * permanent always-current link the purchase email used to carry.
 *
 * Why proactive: solicited ratings give a balanced sample — waiting for
 * buyers to find a form collects mostly complaints (tracker #62 note).
 *
 * Star mechanics: each star links to /rate?token=…&stars=N. The landing
 * page records the rating with a client-side call, NOT on the GET —
 * email scanners prefetch every link in a message, and a naive
 * click-records design would log phantom ratings from bots (typically
 * 5 stars, whichever link the scanner hit last). Scanners don't run the
 * page's JavaScript, so they record nothing.
 *
 * Same visual conventions as the retired purchase-email shell: table
 * layout, inline styles, Parchment #f4f3ef / Coffee Bean #1f0d07 /
 * Taupe #5f524d / Brandy #943d21 (button + stars, founder pick), Bone
 * #dcdacd hairlines, text wordmark, no images, entity footer. Serif
 * falls back to Georgia — webfonts don't load in mail clients.
 */
const SITE = "https://testedroutes.com";

export function buildRatingEmail({ guideTitle, token }) {
  const starUrl = (n) =>
    `${SITE}/rate?token=${encodeURIComponent(token)}&stars=${n}`;
  const downloadUrl = `${SITE}/api/guide-download?token=${encodeURIComponent(token)}`;

  const subject = `How was your ${guideTitle} trip?`;

  const text =
    `Two weeks ago you bought ${guideTitle} – by now the trip has either ` +
    `happened or is taking shape. How did the guide hold up?\n\n` +
    `Rate it in one tap (1 = missed badly, 5 = worked like a plan should):\n\n` +
    [1, 2, 3, 4, 5].map((n) => `  ${n} star${n > 1 ? "s" : ""}: ${starUrl(n)}`).join("\n") +
    `\n\n` +
    `Something specific didn't match – a closed trail, a changed fare, a ` +
    `better option? Reply to this email. It reaches a person, and it fixes ` +
    `the guide for the next traveller.\n\n` +
    `One more thing worth keeping: your guide updates over time, and this ` +
    `link always serves the newest version – no repurchase, ever:\n` +
    `${downloadUrl}\n\n` +
    `Paulius\nTestedRoutes – Skip the research. Take the trip.`;

  const starsHtml = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<td style="padding:0 5px;"><a href="${starUrl(n)}" ` +
        `aria-label="${n} star${n > 1 ? "s" : ""}" ` +
        `style="display:inline-block;font-size:34px;line-height:1;color:#943d21;text-decoration:none;">&#9733;</a></td>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#f4f3ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3ef;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding:0 8px 18px;text-align:center;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:3px;color:#1f0d07;">TESTEDROUTES</span>
        </td></tr>
        <tr><td style="background-color:#ffffff;border:1px solid #dcdacd;border-radius:16px;padding:36px 36px 30px;">
          <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5f524d;">Two weeks in</p>
          <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:#1f0d07;">How was your ${guideTitle} trip?</h1>
          <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f0d07;">
            By now the trip has either happened or is taking shape. How did the
            guide hold up? One tap answers it:
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px auto 6px;"><tr>${starsHtml}</tr></table>
          <p style="margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;font-size:12px;text-align:center;color:#5f524d;">
            1 = missed badly &middot; 5 = worked like a plan should
          </p>
          <hr style="border:none;border-top:1px solid #dcdacd;margin:22px 0;">
          <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1f0d07;">
            Something specific didn't match – a closed trail, a changed fare, a
            better option? <strong>Reply to this email.</strong> It reaches a person,
            and it fixes the guide for the next traveller.
          </p>
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5f524d;">
            Worth keeping: your guide updates over time, and
            <a href="${downloadUrl}" style="color:#943d21;">this link</a> always serves
            the newest version – no repurchase, ever.
          </p>
          <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1f0d07;">
            Paulius<br>
            <span style="font-size:13px;color:#5f524d;">TestedRoutes – Skip the research. Take the trip.</span>
          </p>
        </td></tr>
        <tr><td style="padding:20px 16px 0;text-align:center;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.7;color:#5f524d;">
            You're receiving this one-time email because you bought a guide at testedroutes.com.<br>
            MB &bdquo;Tested routes&ldquo; &middot; Company code 308073804 &middot;
            Melioratorių g. 10, Vilainių k., LT-58103 Kėdainių r., Lithuania<br>
            <a href="${SITE}/refund-policy" style="color:#5f524d;">Refunds</a> &middot;
            <a href="${SITE}/privacy" style="color:#5f524d;">Privacy</a> &middot;
            <a href="${SITE}/contact" style="color:#5f524d;">Contact</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
