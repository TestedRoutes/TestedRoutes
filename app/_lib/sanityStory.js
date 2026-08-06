/**
 * Sanity → legacy-shape converter.
 *
 * Produces objects matching the field layout the existing pages and
 * inspireStoryDisplay helpers expect (metadata.geography.country,
 * metadata.timing.duration_display, etc.), backed by data fetched from
 * Sanity instead of the public/Content/ filesystem.
 */

import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { portableTextToMarkdown } from "./portableTextToMarkdown";
import { tagAffiliateLinksInBlocks } from "./affiliatePrograms";

const STORY_PROJECTION = /* groq */ `
{
  _id,
  title,
  "slug": slug.current,
  storyId,
  status,
  language,
  publishedDate,
  lastUpdated,
  eyebrow,
  subtitle,
  heroImage,
  primaryStats,
  body,
  galleryImages,
  hasVideo,
  videoUrl,
  videoSlot,
  videos[]{ url, slot },
  "destination": destination->{ name, country, countryCode, continent, "slug": slug.current },
  regions,
  nearestCity,
  nearestCityDistanceKm,
  coordinates,
  startingPoint,
  routeStops,
  finishPoint,
  overallLevel, physicalFitnessRequired, technicalSkillRequired,
  elevationGainM, maxAltitudeM, totalDistanceKm,
  difficultyFactors, notSuitableIf,
  familyFriendly, minAgeRecommended, soloFriendly, beginnerFriendly,
  wheelchairAccessible, idealGroupSize, testedWith, idealFor,
  durationDays, durationHours, durationDisplay,
  bestMonths, bestSeasons, avoidMonths, timeOfDay,
  weatherDependent, snowSeasonAccessible,
  transportationRequired, transportationDifficulty,
  carRequired, fourByFourRequired, publicTransportAccessible,
  accommodationType, permitsRequired, permitsInfo,
  bookingsRequired, bookingsAdvanceDays, specialEquipment,
  rentalEquipmentAvailable,
  budgetLevel, estimatedCost, costBreakdown, moneySavingTips,
  uniqueSellingPoints, whatMakesThisSpecial, bestForCrowdType,
  crowdLevel, scenicRating, adrenalineLevel,
  lastReviewedDate, routePoints, trackLine,
  guide {
    hasGuide,
    status,
    format,
    pageSlug,
    polarProductId,
    purchasesCount,
    customPrices,
    "pricingTier": pricingTier->{ name, "slug": slug.current, prices, displayOrder },
    "pdfUrl": pdf.asset->url,
    cover,
    cardImage,
    pages,
    cardLine,
    statusNote,
    dayStrip,
    proofLine,
    proofPhoto,
    carousel[]{ caption, alt, image, "videoUrl": video.asset->url },
    sample{ label, body, image, pdfPath }
  },
  whyThisTrip, whoThisIsFor, whatYouGet, difficultyAtAGlance, notSuitableSales,
  faq[]{ question, answer },
  testimonials[]{ quote, author, location },
  "affiliateLinks": affiliateLinks[]->{
    _id,
    label,
    "slug": slug.current,
    scope,
    category,
    url,
    program,
    regions[]{ region, url, program },
    linkText,
    notes,
  },
  "similarStories": similarStories[]->{
    _id,
    title,
    "slug": slug.current,
    eyebrow,
    durationDisplay,
    heroImage,
    "destination": destination->{ name, country },
    guide{
      hasGuide,
      status,
      "pageSlug": pageSlug,
      "pricingTier": pricingTier->{ prices },
      customPrices
    }
  },
  "primaryCollection": primaryCollection->{ name, "slug": slug.current },
  "allCollections": allCollections[]->{ name, "slug": slug.current },
  "journeyCategory": journeyCategory->{ name, "slug": slug.current },
  "activityCategory": activityCategory->{ name, "slug": slug.current },
  activityTags, journeyStyle, highlights,
  metaTitle, metaDescription, keywords, searchTags,
  searchSynonyms, alternativeNames, appearsInSearches,
  featuredInHomepage, featuredPriority
}
`;

function imageUrl(image, width = 1600) {
  if (!image?.asset) return null;
  try {
    // auto("format") negotiates webp/avif; explicit quality lifts the CDN
    // default (~75), which read as visibly soft on retina phones.
    return urlFor(image).width(width).fit("max").auto("format").quality(85).url();
  } catch {
    return null;
  }
}

// Fixed 4:5 rendition for browse cards. Asking the CDN for both width and
// height makes it crop around the hotspot, so every card ships the exact
// same frame regardless of what shape was uploaded — the shape is decided
// here, not by the asset.
function cardImageUrl(image, width = 1080) {
  if (!image?.asset) return null;
  try {
    return urlFor(image)
      .width(width)
      .height(Math.round((width * 5) / 4))
      .fit("crop")
      .auto("format")
      .quality(85)
      .url();
  } catch {
    return null;
  }
}

function buildLegacyMetadata(doc) {
  const heroUrl = imageUrl(doc.heroImage, 1600);
  const galleryUrls = (doc.galleryImages || [])
    .map((i) => imageUrl(i, 1600))
    .filter(Boolean);

  return {
    title: doc.title,
    slug: doc.slug,
    story_id: doc.storyId,
    status: doc.status,
    language: doc.language,
    created_date: doc.publishedDate,
    last_updated: doc.lastUpdated,

    hero: {
      eyebrow: doc.eyebrow,
      subtitle: doc.subtitle,
      primary_stats: Array.isArray(doc.primaryStats)
        ? doc.primaryStats.map((s) => ({ label: s.label, value: s.value }))
        : [],
    },

    classification: {
      journey_category: doc.journeyCategory?.slug,
      activity_category: doc.activityCategory?.slug,
      primary_collection: doc.primaryCollection?.name,
      all_collections: (doc.allCollections || []).map((c) => c.name),
      activity_tags: doc.activityTags,
      journey_style: doc.journeyStyle,
      highlights: doc.highlights,
    },

    geography: {
      country: doc.destination?.country || doc.destination?.name,
      destination_slug: doc.destination?.slug,
      country_code: doc.destination?.countryCode,
      continent: doc.destination?.continent,
      regions: doc.regions,
      nearest_major_city: doc.nearestCity,
      nearest_major_city_distance_km: doc.nearestCityDistanceKm,
      coordinates: doc.coordinates
        ? { lat: doc.coordinates.lat, lng: doc.coordinates.lng }
        : undefined,
      starting_point: doc.startingPoint?.name
        ? {
            name: doc.startingPoint.name,
            type: doc.startingPoint.type,
            coordinates: doc.startingPoint.coordinates
              ? {
                  lat: doc.startingPoint.coordinates.lat,
                  lng: doc.startingPoint.coordinates.lng,
                }
              : undefined,
          }
        : undefined,
    },

    difficulty: {
      overall_level: doc.overallLevel,
      physical_fitness_required: doc.physicalFitnessRequired,
      technical_skill_required: doc.technicalSkillRequired,
      elevation_gain_m: doc.elevationGainM,
      max_altitude_m: doc.maxAltitudeM,
      total_distance_km: doc.totalDistanceKm,
      difficulty_factors: doc.difficultyFactors,
      not_suitable_if: doc.notSuitableIf,
    },

    suitability: {
      family_friendly: doc.familyFriendly,
      min_age_recommended: doc.minAgeRecommended,
      solo_friendly: doc.soloFriendly,
      beginner_friendly: doc.beginnerFriendly,
      wheelchair_accessible: doc.wheelchairAccessible,
      ideal_group_size: doc.idealGroupSize,
      tested_with: doc.testedWith,
      ideal_for: doc.idealFor,
    },

    timing: {
      duration_days: doc.durationDays,
      duration_hours: doc.durationHours,
      duration_display: doc.durationDisplay,
      best_months: doc.bestMonths,
      best_seasons: doc.bestSeasons,
      avoid_months: doc.avoidMonths,
      time_of_day: doc.timeOfDay,
      weather_dependent: doc.weatherDependent,
      snow_season_accessible: doc.snowSeasonAccessible,
    },

    logistics: {
      transportation_required: doc.transportationRequired,
      transportation_difficulty: doc.transportationDifficulty,
      car_required: doc.carRequired,
      "4x4_required": doc.fourByFourRequired,
      public_transport_accessible: doc.publicTransportAccessible,
      accommodation_type: doc.accommodationType,
      permits_required: doc.permitsRequired,
      permits_info: doc.permitsInfo,
      bookings_required: doc.bookingsRequired,
      bookings_advance_days: doc.bookingsAdvanceDays,
      special_equipment: doc.specialEquipment,
      rental_equipment_available: doc.rentalEquipmentAvailable,
    },

    budget: {
      level: doc.budgetLevel,
      estimated_cost_usd: doc.estimatedCost,
      cost_breakdown: doc.costBreakdown
        ? {
            transport: doc.costBreakdown.transport,
            food: doc.costBreakdown.food,
            equipment_rental: doc.costBreakdown.equipmentRental,
            accommodation: doc.costBreakdown.accommodation,
            activities: doc.costBreakdown.activities,
          }
        : undefined,
      money_saving_tips: doc.moneySavingTips,
    },

    differentiation: {
      unique_selling_points: doc.uniqueSellingPoints,
      what_makes_this_special: doc.whatMakesThisSpecial,
      best_for_crowd_type: doc.bestForCrowdType,
      crowd_level: doc.crowdLevel,
      scenic_rating: doc.scenicRating,
      adrenaline_level: doc.adrenalineLevel,
    },

    maintenance: {
      last_reviewed_date: doc.lastReviewedDate,
      route_points: doc.routePoints,
    },

    sales: {
      why_this_trip: doc.whyThisTrip,
      who_this_is_for: doc.whoThisIsFor,
      what_you_get: doc.whatYouGet,
      difficulty_at_a_glance: doc.difficultyAtAGlance,
      not_suitable: doc.notSuitableSales,
      faq: Array.isArray(doc.faq) ? doc.faq : [],
      testimonials: Array.isArray(doc.testimonials) ? doc.testimonials : [],
    },

    guide: doc.guide
      ? {
          has_guide: !!doc.guide.hasGuide,
          guide_status: doc.guide.status,
          guide_format: doc.guide.format,
          guide_page: doc.guide.pageSlug
            ? `guides/${doc.guide.pageSlug}.html`
            : undefined,
          guide_pdf_url: doc.guide.pdfUrl,
          guide_url: doc.guide.pageSlug ? `guides/${doc.guide.pageSlug}.html` : undefined,
        }
      : undefined,

    seo: {
      meta_title: doc.metaTitle,
      meta_description: doc.metaDescription,
      keywords: doc.keywords,
      search_tags: doc.searchTags,
    },

    discovery: {
      search_synonyms: doc.searchSynonyms,
      alternative_names: doc.alternativeNames,
      appears_in_searches: doc.appearsInSearches,
    },

    content: {
      media: {
        hero_image: heroUrl,
        hero_alt: doc.heroImage?.alt,
        gallery_images: galleryUrls,
        has_video: doc.hasVideo,
        video_url: doc.videoUrl,
      },
      featured_in_homepage: doc.featuredInHomepage,
      featured_priority: doc.featuredPriority,
    },
  };
}

export function shapeStory(doc) {
  const heroUrl = imageUrl(doc.heroImage, 1600);
  const galleryUrls = (doc.galleryImages || [])
    .map((i) => imageUrl(i, 1600))
    .filter(Boolean);
  // Card-width variants — the Sanity CDN derives them on the fly, so cards
  // never download the full 1600px detail-page renditions. 1080px covers
  // a ~500px card at 2x device pixel ratio.
  const cardPhotos = [
    imageUrl(doc.heroImage, 1080),
    ...(doc.galleryImages || []).map((i) => imageUrl(i, 1080)),
  ].filter(Boolean);
  const metadata = buildLegacyMetadata(doc);
  // Inject affiliate tracking IDs into link markDefs once, here, so every
  // downstream consumer (markdown renderer, GuideBody PortableText,
  // affiliateLinks extractor) sees tagged URLs without re-implementing the
  // env-var lookup.
  const taggedBody = tagAffiliateLinksInBlocks(doc.body);
  const storyContent = portableTextToMarkdown(taggedBody);

  return {
    id: doc._id,
    slug: doc.slug,
    folderName: doc.slug,
    title: doc.title,
    date: doc.publishedDate,
    metadata,
    storyContent,
    heroPhoto: heroUrl,
    photos: [heroUrl, ...galleryUrls].filter(Boolean),
    cardPhotos,
    galleryPhotos: galleryUrls,
    videoUrl: doc.hasVideo ? doc.videoUrl || null : null,
    videoSlot: doc.videoSlot || null,
    videos: shapeVideos(doc),
    heroName: doc.heroImage?.alt || null,
    folderUrl: "",
  };
}

// [{ url, slot }] in authored order; empty when the story has no video.
// Falls back to the legacy single videoUrl/videoSlot pair for docs
// published before videos[] existed.
function shapeVideos(doc) {
  if (!doc.hasVideo) return [];
  const list = Array.isArray(doc.videos)
    ? doc.videos.filter((v) => v?.url).map((v) => ({ url: v.url, slot: v.slot || null }))
    : [];
  if (list.length) return list;
  return doc.videoUrl ? [{ url: doc.videoUrl, slot: doc.videoSlot || null }] : [];
}

export function resolveGuidePrices(guide) {
  if (!guide) return [];
  if (Array.isArray(guide.customPrices) && guide.customPrices.length) {
    return guide.customPrices;
  }
  if (Array.isArray(guide.pricingTier?.prices) && guide.pricingTier.prices.length) {
    return guide.pricingTier.prices;
  }
  return [];
}

function shapeRelatedGuide(ref, currency = "EUR") {
  if (!ref || !ref.guide?.hasGuide) return null;
  const slug = ref.guide?.pageSlug || ref.slug;
  if (!slug) return null;
  const prices = resolveGuidePrices(ref.guide);
  const chosen =
    prices.find((p) => p?.currency === currency) ||
    prices.find((p) => p?.currency === "EUR") ||
    null;
  return {
    title: ref.title,
    slug,
    href: `/guides/${slug}`,
    image: imageUrl(ref.heroImage, 800),
    eyebrow: ref.eyebrow || ref.destination?.country || ref.destination?.name || null,
    duration: ref.durationDisplay || "",
    price: chosen ? formatPrice(chosen.amount, chosen.currency) : "",
  };
}

export function shapeGuide(doc, currency = "EUR") {
  const heroUrl = imageUrl(doc.heroImage, 1600);
  const galleryUrls = (doc.galleryImages || [])
    .map((i) => imageUrl(i, 1600))
    .filter(Boolean);
  const cardPhotos = [
    imageUrl(doc.heroImage, 1080),
    ...(doc.galleryImages || []).map((i) => imageUrl(i, 1080)),
  ].filter(Boolean);
  const metadata = buildLegacyMetadata(doc);
  // Tag once, here, so bodyBlocks + storyContent + every consumer of
  // them (GuideBody, BuyBox essentialBookings, /links page) all see the
  // same env-var-injected tracking IDs.
  const taggedBody = tagAffiliateLinksInBlocks(doc.body);
  const storyContent = portableTextToMarkdown(taggedBody);

  const pageSlug = doc.guide?.pageSlug || doc.slug;
  const category =
    (doc.journeyCategory?.name || doc.journeyCategory?.slug || "Guide").replace(/_/g, " ");
  const prices = resolveGuidePrices(doc.guide);
  const chosen =
    prices.find((p) => p?.currency === currency) ||
    prices.find((p) => p?.currency === "EUR") ||
    null;
  const price = chosen ? formatPrice(chosen.amount, chosen.currency) : "";

  const relatedGuides = Array.isArray(doc.similarStories)
    ? doc.similarStories
        .map((r) => shapeRelatedGuide(r, currency))
        .filter(Boolean)
        .slice(0, 4)
    : [];

  // Sales-page block data (guide-page-build-spec). Present only when the
  // guide doc carries the new per-SKU fields; the page falls back to the
  // classic layout otherwise.
  const g = doc.guide || {};
  const sales = {
    coverUrl: imageUrl(g.cover, 1600),
    coverAlt: g.cover?.alt || null,
    pages: g.pages || null,
    cardLine: g.cardLine || null,
    statusNote: g.statusNote || null,
    dayStrip: g.dayStrip || null,
    proofLine: g.proofLine || null,
    proofPhotoUrl: imageUrl(g.proofPhoto, 320),
    proofPhotoAlt: g.proofPhoto?.alt || null,
    carousel: Array.isArray(g.carousel)
      ? g.carousel
          .map((s) => ({
            imageUrl: imageUrl(s.image, 1200),
            videoUrl: s.videoUrl || null,
            caption: s.caption || "",
            alt: s.alt || s.caption || "",
          }))
          .filter((s) => s.imageUrl || s.videoUrl)
      : [],
    sample: g.sample
      ? {
          label: g.sample.label || null,
          body: g.sample.body || null,
          imageUrl: imageUrl(g.sample.image, 1600),
          pdfPath: g.sample.pdfPath || null,
        }
      : null,
  };
  // Card media. With a dedicated cardImage (the card spec), the branded 4:5
  // crop leads full-bleed and the page exports stay on the sales page, where
  // reading them is the point; the rest of the trip media follows in
  // authored order, with each clip's slot recomputed against that shorter
  // sequence. Without one — guides published before the field existed — the
  // card falls back to the full authored carousel, page exports shown whole.
  // The caption is the authoring signal for "this is a page from inside the
  // guide" — set-guide-carousel.mjs gives one to the page exports and leaves
  // the trip media uncaptioned, on the grounds that the photos speak for
  // themselves. Caption a photo and it will letterbox on cards.
  const authoredPhotos = [];
  const authoredPagePhotos = [];
  const authoredVideos = [];
  const brandedPhotos = [];
  const brandedVideos = [];
  for (const [i, s] of (Array.isArray(g.carousel) ? g.carousel : []).entries()) {
    if (s?.videoUrl) {
      authoredVideos.push({ url: s.videoUrl, slot: i + 1 });
      // 1-based position after the lead card image and everything kept so far.
      brandedVideos.push({
        url: s.videoUrl,
        slot: brandedPhotos.length + brandedVideos.length + 2,
      });
    } else {
      const url = imageUrl(s?.image, 1080);
      if (url) {
        authoredPhotos.push(url);
        if (s?.caption) authoredPagePhotos.push(url);
        else brandedPhotos.push(url);
      }
    }
  }
  const cardImage = cardImageUrl(g.cardImage);
  const hasAuthoredCarousel = authoredPhotos.length > 0 || authoredVideos.length > 0;
  const fallbackVideos = shapeVideos(doc);
  let finalCardPhotos, finalCardPagePhotos, finalCardVideos;
  if (cardImage) {
    finalCardPhotos = [cardImage, ...(hasAuthoredCarousel ? brandedPhotos : cardPhotos)];
    finalCardPagePhotos = [];
    finalCardVideos = hasAuthoredCarousel
      ? brandedVideos
      : // Hero/gallery fallback slots shift down one to make room for the lead.
        fallbackVideos.map((v) => ({ ...v, slot: (Number(v.slot) || 1) + 1 }));
  } else {
    finalCardPhotos = authoredPhotos.length ? authoredPhotos : cardPhotos;
    finalCardPagePhotos = authoredPagePhotos;
    finalCardVideos = authoredVideos.length ? authoredVideos : fallbackVideos;
  }

  const relatedStories = Array.isArray(doc.similarStories)
    ? doc.similarStories
        .filter((r) => r && !r.guide?.hasGuide && r.slug)
        .map((r) => ({
          title: r.title,
          slug: r.slug,
          href: `/inspire/${r.slug}`,
          image: imageUrl(r.heroImage, 800),
        }))
    : [];

  return {
    slug: pageSlug,
    folder: doc._id,
    metadataSlug: doc.slug,
    title: doc.title,
    category,
    duration: doc.durationDisplay || "",
    price,
    prices,
    image: heroUrl,
    href: `/guides/${pageSlug}`,
    purchases: doc.guide?.purchasesCount || 0,
    metadata,
    storyContent,
    bodyBlocks: Array.isArray(taggedBody) ? taggedBody : [],
    coordinates: doc.coordinates || null,
    startingPoint: doc.startingPoint || null,
    routeStops: Array.isArray(doc.routeStops) ? doc.routeStops : null,
    finishPoint: doc.finishPoint || null,
    routePoints: doc.routePoints || null,
    trackLine: doc.trackLine || null,
    photos: [heroUrl, ...galleryUrls].filter(Boolean),
    cardImage,
    cardImageAlt: g.cardImage?.alt || null,
    cardPhotos: finalCardPhotos,
    cardPagePhotos: finalCardPagePhotos,
    galleryPhotos: galleryUrls,
    videoUrl: doc.hasVideo ? doc.videoUrl || null : null,
    videoSlot: doc.videoSlot || null,
    videos: finalCardVideos,
    relatedGuides,
    relatedStories,
    salesPage: sales,
    folderUrl: "",
    heroName: doc.heroImage?.alt || null,
    guidePdfUrl: doc.guide?.pdfUrl || null,
    polarProductId: doc.guide?.polarProductId || null,
    affiliateLinks: Array.isArray(doc.affiliateLinks) ? doc.affiliateLinks : [],
  };
}

function formatPrice(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const symbol =
    currency === "USD" ? "$" : currency === "GBP" ? "£" : currency === "CHF" ? "CHF " : "€";
  const rounded = n % 1 === 0 ? n.toString() : n.toFixed(2);
  return `${symbol}${rounded}`;
}

// Docs created before the language field existed have it unset — treat
// those as English so they never vanish from the EN site.
const LANG_FILTER = `(language == $lang || (!defined(language) && $lang == "en"))`;

export async function fetchAllStories(lang = "en") {
  // Guide-bearing docs live in the Guides section only; Inspire lists
  // dedicated story docs (a destination can have both without duplication).
  return client.fetch(
    `*[_type == "story" && status == "published" && guide.hasGuide != true && ${LANG_FILTER}] | order(publishedDate desc) ${STORY_PROJECTION}`,
    { lang },
  );
}

// Guides are English-only for now; the language filter keeps future
// translated story docs from leaking duplicates into the guide list.
export async function fetchAllGuideStories(lang = "en") {
  return client.fetch(
    `*[_type == "story" && status == "published" && guide.hasGuide == true && ${LANG_FILTER}] | order(publishedDate desc) ${STORY_PROJECTION}`,
    { lang },
  );
}

export async function fetchStoryCount(lang = "en") {
  return client.fetch(
    `count(*[_type == "story" && status == "published" && guide.hasGuide != true && ${LANG_FILTER}])`,
    { lang },
  );
}

export async function fetchGuideCount(lang = "en") {
  return client.fetch(
    `count(*[_type == "story" && status == "published" && guide.hasGuide == true && ${LANG_FILTER}])`,
    { lang },
  );
}

// All published language versions of one story (linked via storyId).
// Used to build hreflang alternates and the language switcher targets.
export async function fetchStoryTranslations(storyId) {
  if (!storyId) return [];
  const docs = await client.fetch(
    `*[_type == "story" && status == "published" && storyId == $storyId]{ "slug": slug.current, language, "hasGuide": guide.hasGuide, "guideSlug": guide.pageSlug }`,
    { storyId },
  );
  return (docs || []).map((d) => ({
    slug: d.slug,
    language: d.language || "en",
    hasGuide: !!d.hasGuide,
    guideSlug: d.guideSlug || d.slug,
  }));
}
