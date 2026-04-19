export async function onRequest(context) {
  const key = context.env.GOOGLE_MAPS_KEY || "";
  return new Response(
    `window.SITE_CONFIG = { googleMapsKey: "${key}" };`,
    { headers: { "Content-Type": "application/javascript; charset=utf-8" } }
  );
}
