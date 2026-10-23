// The manifest for one mock topic. index.html and mocknav.js both read it.
// Adding a variant = one new .html file + one entry here.
window.MOCK = {
  topic: "Apps catalogue",
  question: "How should the catalogue look when it has only three apps?",
  variants: [
    {
      file: "a-poster-grid.html",
      name: "Poster grid",
      axis: "Layout: three tall posters, picture first",
      good: "Shows off the cover art",
      cost: "Looks empty with fewer than three apps",
    },
    {
      file: "b-wide-rows.html",
      name: "Wide rows",
      axis: "Layout: one app per row, text beside the picture",
      good: "Room for a real description",
      cost: "Long scroll once there are many apps",
    },
  ],
  // Filled in as the user decides. Dated, plain sentences.
  decisions: [
    // "2026-10-08: Poster grid won. Take the description length from Wide rows. No category filter until there are more apps (owner: 'nothing to filter').",
  ],
};
