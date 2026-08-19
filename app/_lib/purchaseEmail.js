/**
 * The post-purchase relationship email (Tracker #55), extracted from the
 * webhook so the template can be previewed and iterated without touching
 * delivery plumbing. Returns { subject, text, html } for Resend.
 *
 * Design constraints, learned from the first live send reading as spam:
 * - Table layout with inline styles - email clients ignore stylesheets.
 * - No external images: there is no stable logo URL (the site's logo ships
 *   content-hashed), and image-light transactional mail scores better with
 *   spam filters anyway. The wordmark is styled text.
 * - The long token URL never appears raw in the HTML body - it hides
 *   behind the button and a short fallback link. The text part keeps the
 *   raw URL because plain text has nothing to hide it behind.
 * - Legal footer with the registered entity, because commercial mail
 *   without an imprint is a spam heuristic and an EU expectation. Entity
 *   facts verbatim from the register (legal-notice page).
 * - Brand palette from tailwind.config.js: Parchment #f4f3ef canvas,
 *   Coffee Bean #1f0d07 ink, Taupe #5f524d secondary, Brandy #943d21 for
 *   the button (founder pick 2026-08-19 - Tiger Flame stays a web-CTA
 *   color), Bone #dcdacd hairlines. Serif falls back to Georgia -
 *   webfonts don't load reliably in mail clients.
 */
// Exactly one link, by founder decision (2026-08-19): Polar's receipt is
// the delivery email and already carries a download button, so a second
// email with its own pile of links read as noise. Ours carries the one
// thing Polar's cannot - the permanent token link that always serves the
// NEWEST version of the guide - and the reply-to-fix-the-guide ask.
export function buildPurchaseEmail({ guideTitle, downloadUrl }) {
  const subject = `Your ${guideTitle} guide – a link that never goes stale`;

  const text =
    `Thanks for buying ${guideTitle}.\n\n` +
    `Polar's receipt delivers today's file. This email is the one to keep: ` +
    `the link below always serves the newest version of your guide, so when we ` +
    `update timings, prices or routes, you just download it again – no ` +
    `repurchase, ever.\n\n` +
    `Your always-current copy:\n${downloadUrl}\n\n` +
    `Spotted something on the trip that doesn't match the guide – a closed ` +
    `trail, a changed fare, a better option? Reply to this email. It reaches a ` +
    `person, and it fixes the guide for the next traveller.\n\n` +
    `Paulius\nTestedRoutes – Skip the research. Take the trip.`;

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
          <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5f524d;">Your guide is ready</p>
          <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:#1f0d07;">${guideTitle}</h1>
          <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f0d07;">
            Thanks for the purchase. Polar's receipt delivers today's file –
            <strong>this is the email to keep.</strong> The button below always serves the
            newest version of your guide: when we update timings, prices or routes,
            you download it again. No repurchase, ever.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
            <tr><td style="border-radius:999px;background-color:#943d21;">
              <a href="${downloadUrl}" style="display:inline-block;padding:13px 34px;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#ffffff;text-decoration:none;border-radius:999px;">Your always-current copy</a>
            </td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #dcdacd;margin:22px 0;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1f0d07;">
            Spotted something on the trip that doesn't match the guide – a closed trail,
            a changed fare, a better option? <strong>Reply to this email.</strong> It reaches
            a person, and it fixes the guide for the next traveller.
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
            <a href="https://testedroutes.com/refund-policy" style="color:#5f524d;">Refunds</a> &middot;
            <a href="https://testedroutes.com/privacy" style="color:#5f524d;">Privacy</a> &middot;
            <a href="https://testedroutes.com/contact" style="color:#5f524d;">Contact</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
