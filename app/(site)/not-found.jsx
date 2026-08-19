// Without this file, a notFound() thrown inside the (site) group — a
// mistyped /guides/<slug> or /inspire/<slug> — falls through to
// app/not-found.jsx, which sits above the site layout and therefore renders
// without header, footer or tab bar. Re-exporting the root page keeps one
// source for the copy while this boundary lands inside the site layout, so a
// dead guide link gets the full chrome and its recovery navigation.
export { metadata } from "../not-found";
export { default } from "../not-found";
