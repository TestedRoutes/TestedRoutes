/**
 * Place photos for the reader, by country and file name.
 *
 * The founder's curated destination set is committed under
 * content/countries/<country>/destination/generated/web/ and imported
 * statically here so Next can size and optimise it. A `photo_ref` in
 * places.yaml or `hero_photo` in country.yaml names one of these files;
 * anything not listed renders as a category pin, never as a broken image.
 *
 * Static imports must be literal paths, so this file grows one line per
 * photo. When the per-place photo pass moves imagery to private Blob storage
 * (architecture doc, Stage 1), photoFor() resolves keys there instead and
 * the pages do not change.
 */
import activitiesBoard from "../../../../content/countries/fiji/destination/generated/web/activities-board.jpg";
import beachBonfireSunset from "../../../../content/countries/fiji/destination/generated/web/beach-bonfire-sunset.jpg";
import blueLagoonBeach from "../../../../content/countries/fiji/destination/generated/web/blue-lagoon-beach.jpg";
import bulaBed from "../../../../content/countries/fiji/destination/generated/web/bula-bed.jpg";
import islandBayResortBeach from "../../../../content/countries/fiji/destination/generated/web/island-bay-resort-beach.jpg";
import islandBeachPavilion from "../../../../content/countries/fiji/destination/generated/web/island-beach-pavilion.jpg";
import loungingUnderThatch from "../../../../content/countries/fiji/destination/generated/web/lounging-under-thatch.jpg";
import nadiTempleCeiling from "../../../../content/countries/fiji/destination/generated/web/nadi-temple-ceiling.jpg";
import portDenarauMarina from "../../../../content/countries/fiji/destination/generated/web/port-denarau-marina.jpg";
import rainbowReefCorals from "../../../../content/countries/fiji/destination/generated/web/rainbow-reef-corals.jpg";
import resortTransferBoat from "../../../../content/countries/fiji/destination/generated/web/resort-transfer-boat.jpg";
import sawaILauCavePool from "../../../../content/countries/fiji/destination/generated/web/sawa-i-lau-cave-pool.jpg";
import sawaILauLimestone from "../../../../content/countries/fiji/destination/generated/web/sawa-i-lau-limestone.jpg";
import sharkDiveKuata from "../../../../content/countries/fiji/destination/generated/web/shark-dive-kuata.jpg";
import sunsetBeachWalk from "../../../../content/countries/fiji/destination/generated/web/sunset-beach-walk.jpg";
import taveuniRainforest from "../../../../content/countries/fiji/destination/generated/web/taveuni-rainforest.jpg";
import tavoroFalls from "../../../../content/countries/fiji/destination/generated/web/tavoro-falls.jpg";
import yasawaBeachWalk from "../../../../content/countries/fiji/destination/generated/web/yasawa-beach-walk.jpg";
import yasawaRidgeReef from "../../../../content/countries/fiji/destination/generated/web/yasawa-ridge-reef.jpg";

const PHOTOS = {
  fiji: {
    "activities-board.jpg": activitiesBoard,
    "beach-bonfire-sunset.jpg": beachBonfireSunset,
    "blue-lagoon-beach.jpg": blueLagoonBeach,
    "bula-bed.jpg": bulaBed,
    "island-bay-resort-beach.jpg": islandBayResortBeach,
    "island-beach-pavilion.jpg": islandBeachPavilion,
    "lounging-under-thatch.jpg": loungingUnderThatch,
    "nadi-temple-ceiling.jpg": nadiTempleCeiling,
    "port-denarau-marina.jpg": portDenarauMarina,
    "rainbow-reef-corals.jpg": rainbowReefCorals,
    "resort-transfer-boat.jpg": resortTransferBoat,
    "sawa-i-lau-cave-pool.jpg": sawaILauCavePool,
    "sawa-i-lau-limestone.jpg": sawaILauLimestone,
    "shark-dive-kuata.jpg": sharkDiveKuata,
    "sunset-beach-walk.jpg": sunsetBeachWalk,
    "taveuni-rainforest.jpg": taveuniRainforest,
    "tavoro-falls.jpg": tavoroFalls,
    "yasawa-beach-walk.jpg": yasawaBeachWalk,
    "yasawa-ridge-reef.jpg": yasawaRidgeReef,
  },
};

/** The static-import object ({ src, width, height }) for a ref, or null. */
export function photoFor(country, ref) {
  if (!country || !ref) return null;
  return PHOTOS[country]?.[ref] ?? null;
}
