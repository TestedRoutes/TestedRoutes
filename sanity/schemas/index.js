import author from "./documents/author";
import category from "./documents/category";
import collection from "./documents/collection";
import destination from "./documents/destination";
import pricingTier from "./documents/pricingTier";
import story from "./documents/story";

import guide from "./objects/guide";
import primaryStat from "./objects/primaryStat";
import startingPoint from "./objects/startingPoint";
import estimatedCost from "./objects/estimatedCost";
import costBreakdown from "./objects/costBreakdown";
import routePoint from "./objects/routePoint";
import socialLink from "./objects/socialLink";
import priceEntry from "./objects/priceEntry";

import galleryGrid from "./blocks/galleryGrid";
import mapEmbed from "./blocks/mapEmbed";
import statBlock from "./blocks/statBlock";
import callout from "./blocks/callout";
import pullQuote from "./blocks/quote";

export const schemaTypes = [
  // documents
  story,
  destination,
  author,
  collection,
  category,
  pricingTier,

  // objects
  guide,
  primaryStat,
  startingPoint,
  estimatedCost,
  costBreakdown,
  routePoint,
  socialLink,
  priceEntry,

  // portable text blocks
  galleryGrid,
  mapEmbed,
  statBlock,
  callout,
  pullQuote,
];
