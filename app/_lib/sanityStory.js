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
  "destination": destination->{ name, country, countryCode, continent },
  regions,
  nearestCity,
  nearestCityDistanceKm,
  coordinates,
  startingPoint,
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
  guide {
    hasGuide,
    status,
    format,
    pageSlug,
    polarProductId,
    purchasesCount,
    customPrices,
    "pricingTier": pricingTier->{ name, "slug": slug.current, prices, displayOrder },
    "pdfUrl": pdf.asset->url
  },
  whyThisTrip, whoThisIsFor, whatYouGet, difficultyAtAGlance, notSuitableSales,
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
    return urlFor(image).width(width).fit("max").auto("format").url();
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

    sales: {
      why_this_trip: doc.whyThisTrip,
      who_this_is_for: doc.whoThisIsFor,
      what_you_get: doc.whatYouGet,
      difficulty_at_a_glance: doc.difficultyAtAGlance,
      not_suitable: doc.notSuitableSales,
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
  const metadata = buildLegacyMetadata(doc);
  const storyContent = portableTextToMarkdown(doc.body);

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
    galleryPhotos: galleryUrls,
    heroName: doc.heroImage?.alt || null,
    folderUrl: "",
  };
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

export function shapeGuide(doc) {
  const heroUrl = imageUrl(doc.heroImage, 1600);
  const galleryUrls = (doc.galleryImages || [])
    .map((i) => imageUrl(i, 1600))
    .filter(Boolean);
  const metadata = buildLegacyMetadata(doc);

  const pageSlug = doc.guide?.pageSlug || doc.slug;
  const category =
    (doc.journeyCategory?.name || doc.journeyCategory?.slug || "Guide").replace(/_/g, " ");
  const prices = resolveGuidePrices(doc.guide);
  const eur = prices.find((p) => p?.currency === "EUR");
  const price = eur ? formatPrice(eur.amount, "EUR") : "";

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
    photos: [heroUrl, ...galleryUrls].filter(Boolean),
    galleryPhotos: galleryUrls,
    folderUrl: "",
    heroName: doc.heroImage?.alt || null,
    guidePdfUrl: doc.guide?.pdfUrl || null,
    polarProductId: doc.guide?.polarProductId || null,
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

export async function fetchAllStories() {
  return client.fetch(`*[_type == "story" && status == "published"] | order(publishedDate desc) ${STORY_PROJECTION}`);
}

export async function fetchAllGuideStories() {
  return client.fetch(
    `*[_type == "story" && status == "published" && guide.hasGuide == true] | order(publishedDate desc) ${STORY_PROJECTION}`,
  );
}
