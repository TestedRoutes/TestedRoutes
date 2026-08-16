/**
 * Shared helpers for guide data modules.
 *
 * Deliberately its own file rather than an export from publish-guide.mjs: that
 * script runs work at the top level, so a data module importing from it would
 * re-execute the publisher on import.
 */

/**
 * One Portable Text paragraph.
 *
 * Data modules author body copy as plain strings and call this, so no guide has
 * to know what a Portable Text span looks like. The key is passed in rather than
 * generated, because a random key would rewrite every block's identity on each
 * publish and make the Studio's revision history unreadable.
 */
export function paragraph(key, text) {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    children: [{ _key: `${key}s`, _type: "span", text }],
  };
}
