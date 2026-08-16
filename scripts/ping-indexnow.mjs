#!/usr/bin/env node
/**
 * Tell IndexNow that URLs have changed.
 *
 * IndexNow is a ping protocol: instead of waiting to be discovered, you submit
 * the URL and participating engines fetch it. **Bing and Yandex participate.
 * Google does not.** So this speeds up the Bing side - which is also what
 * ChatGPT search runs on, and therefore worth having - and does nothing at all
 * for Google. Google's queue is worked by requesting indexing in Search Console
 * and by earning links, neither of which a script can do.
 *
 *   npm run ping:indexnow -- --all                 every URL in the sitemap
 *   npm run ping:indexnow -- --slug kuwait-2-days  one guide
 *   npm run ping:indexnow -- --url https://...     arbitrary URLs
 *   npm run ping:indexnow -- --all --dry-run       show the payload, send nothing
 *
 * publish-guide.mjs calls this automatically after a real publish, so a new
 * guide is submitted the moment it goes live. Pass --no-ping there to skip it.
 *
 * The key below is NOT a secret. IndexNow's ownership check is precisely that
 * the key is publicly readable at the keyLocation URL, so it is committed on
 * purpose. Rotating it means changing both this constant and the filename of
 * the matching file in public/ - checkKeyIsLive() below fails loudly if those
 * two ever drift apart, which is the only way this breaks.
 */
const KEY = "bd79d68f017346823ab56d377aa65745";

const SITE = "https://testedroutes.com";
const HOST = "testedroutes.com";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function parseArgs(argv) {
  const args = { all: false, dryRun: false, slugs: [], urls: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--all") args.all = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--slug") args.slugs.push(argv[++i]);
    else if (a === "--url") args.urls.push(argv[++i]);
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

/**
 * Confirm the key file is actually reachable before submitting anything.
 *
 * Without this the failure is silent and delayed: IndexNow answers 202
 * ("accepted, key validation pending"), everything looks fine, and the
 * submission is quietly dropped later when the fetch of keyLocation fails.
 */
async function checkKeyIsLive() {
  try {
    const res = await fetch(KEY_LOCATION, { headers: { "user-agent": "TestedRoutes-IndexNow" } });
    if (!res.ok) return `${KEY_LOCATION} returned ${res.status}`;
    const body = (await res.text()).trim();
    if (body !== KEY) return `${KEY_LOCATION} contains "${body.slice(0, 40)}", expected the key`;
    return null;
  } catch (err) {
    return `could not fetch ${KEY_LOCATION}: ${err.message}`;
  }
}

async function urlsFromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/**
 * Exits set process.exitCode and return rather than calling process.exit().
 * fetch() keeps a libuv handle open, and tearing the process down underneath it
 * on Windows trips an assertion and reports 127 instead of the code you meant -
 * which would quietly break any caller checking the exit status.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));

  let urls = [...args.urls, ...args.slugs.map((s) => `${SITE}/guides/${s}`)];
  if (args.all) urls = [...urls, ...(await urlsFromSitemap())];
  urls = [...new Set(urls)];

  if (!urls.length) {
    console.error("Nothing to submit. Use --all, --slug <slug> or --url <url>.");
    process.exitCode = 1;
    return;
  }

  // Submitting a URL on another host is rejected wholesale (422), so catch it
  // here where the message can name the offender.
  const foreign = urls.filter((u) => !u.startsWith(`${SITE}/`) && u !== SITE);
  if (foreign.length) {
    console.error(`These are not on ${HOST}, so the whole batch would be rejected:`);
    for (const u of foreign) console.error(`  ${u}`);
    process.exitCode = 1;
    return;
  }

  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };

  if (args.dryRun) {
    console.log(`DRY RUN - would submit ${urls.length} URLs to ${ENDPOINT}`);
    for (const u of urls.slice(0, 10)) console.log(`  ${u}`);
    if (urls.length > 10) console.log(`  ... and ${urls.length - 10} more`);
    return;
  }

  const keyProblem = await checkKeyIsLive();
  if (keyProblem) {
    console.error(`IndexNow key is not verifiable: ${keyProblem}`);
    console.error(
      `Expected public/${KEY}.txt to be deployed and to contain exactly the key. ` +
        `Submitting now would be accepted and then silently discarded.`,
    );
    process.exitCode = 1;
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // IndexNow uses the status code as the whole answer; the body is usually empty.
  const meaning = {
    200: "accepted",
    202: "accepted, key validation pending",
    400: "bad request - malformed payload",
    403: "key not valid - the key file did not match",
    422: "URLs do not belong to the host, or the key does not match the schema",
    429: "too many requests - slow down",
  };
  const note = meaning[res.status] || "unexpected status";

  if (res.status === 200 || res.status === 202) {
    console.log(`submitted ${urls.length} URLs - ${res.status} ${note}`);
  } else {
    console.error(`IndexNow rejected the submission: ${res.status} ${note}`);
    const body = await res.text().catch(() => "");
    if (body.trim()) console.error(body.trim().slice(0, 400));
    process.exitCode = 1;
    return;
  }
}

await main();
