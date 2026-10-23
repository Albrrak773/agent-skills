---
name: mock
description: "Build throwaway HTML mocks that answer one design question before anything is implemented. Either 2-3 genuinely different versions of a page or component to flip between, or a clickable demo of a flow or state model. Use when the user asks for a mock, a mockup, variants, 'show me options', 'what could this look like', or wants to try a flow before building it."
---

# Mock

A mock is throwaway HTML that answers a question. It is plain HTML and CSS, outside the app, so a
round takes minutes and being wrong costs nothing. The question decides what you build.

Skip the mock when the user already has a reference they want copied, or the decision is made.
Go straight to implementation.

## 1. Write the question down

One sentence, before any HTML. It goes in the manifest and shows at the top of the index page.

- **"What should this look like?"** Layout, hierarchy, density, where the main action sits.
  Build variants. The rest of this file covers it.
- **"Does this flow or state model make sense?"** What happens after a click, which states exist,
  which actions are legal when. Build one clickable demo. Read [LOGIC.md](LOGIC.md).

Some questions are both ("should the editor be a side panel or a full page" changes the layout
and the flow). Build variants, and wire up the interaction the directions disagree about.

If you can't write the question, ask the user for it. One question, not a questionnaire.

## 2. Read the project

Look for a design profile: `.claude/design.md` if the project has one. It says where mocks
live, which language and theme to mock in, which widths to check, and where the tokens are. If
there isn't one, find those in the repo (token file, fonts, locale routes, theme) and ask the user
only for what the repo can't answer. Offer to save the answers as `.claude/design.md` so the next
round starts from them. Outside a repo, mocks go in `./mocks/` and you ask about language,
theme and widths once.

Then separate two things:

- **Tokens are fixed.** Colours, type, radius, spacing come from the product. A mock should look
  like it could ship in this product.
- **Layout is free.** The current page is one answer to the question, not the starting point.
  A variant may move, merge or remove anything, including things outside the page if the better
  answer is a different navigation or a pattern used across the whole product. Say so when a
  variant implies a wider change.

Before dropping something the current page does, find out what it does. List its capabilities
(two ways to upload, mixed file kinds, an undo window). A variant may restyle or relocate a
capability. It removes one only when removing it is the idea, and says so.

## 3. Pick directions

Default to 3. Use 2 when the design space is narrow, up to 5 if the user asks. Build 1 only when
the user has named the direction and wants to see it.

Each direction gets a name and an axis, written before any HTML:

| Axis | Example poles |
|---|---|
| Layout | side panel beside results, single column, split pane |
| Hierarchy | content first, action first, navigation first |
| Density | few large items, many compact rows |
| Interaction model | inline editing, drawer, separate page, wizard |
| Disclosure | everything visible, progressive, behind a menu |

Names describe the direction ("Poster grid", "Wide rows"), never "Option A".

The test: two directions that differ only in colour, spacing or copy are one direction. Replace
one of them. Each variant has to be something you would defend shipping.

Tell the user the list in one or two lines and keep building. Don't wait for approval of a list;
people react to pictures.

## 4. Build

One folder per topic, one file per variant, one index page above them:

```
<mocks>/<topic>/
  index.html       copy of assets/index.html, never edited
  mocknav.js       copy of assets/mocknav.js, never edited
  variants.js      the manifest: question, variants, decisions
  a-poster-grid.html
  b-wide-rows.html
  c-featured-banner.html
  shots/           written by the screenshot script
```

The product's tokens and app frame are shared files that every variant links. The profile says
where they are. If the project has none yet, create them once beside the topic folders, not
inside one.

Copy `assets/variants.js` and fill it in. `index.html` and `mocknav.js` both read it, so a new
variant is one new file and one new manifest entry. Every variant page ends with:

```html
<script src="variants.js"></script>
<script src="mocknav.js"></script>
```

That adds a small bar at the bottom of the page: back to the index, previous, next. The arrow
keys flip between variants. The bar and the index page are tooling, not design. They look the
same in every project, so nobody mistakes them for part of a variant.

Rules for the variant pages:

1. **One variant per page, full size, inside the app's frame.** Give it the real sidebar and
   header, as a shared file if the project has one. A page floating in empty space hides the
   problems you are looking for. Share the frame and the tokens, never the page layout.
2. **Real content.** The product's own images, real titles, realistic names and numbers, in the
   language the profile names. No lorem ipsum.
3. **Nothing the system can't know.** No time estimates, progress percentages, counts or labels
   without data behind them.
4. **The interaction under question works.** Tabs switch, the drawer opens, the hover state
   shows. Controls outside the question can be inert.
5. **Same level of finish for every variant.** A rough variant loses on finish, and then you
   have learned nothing about its direction.
6. **No app code.** Don't touch the repo's components, routes or styles.

## 5. Check before showing

```
node <skill>/scripts/shoot.mjs <mocks>/<topic> --widths 1440,1280,1024 --scheme dark
```

Take the widths and scheme from the profile. The script screenshots every variant at every
width into `shots/` and reports horizontal overflow, broken images and script errors. It needs
Playwright resolvable from the directory you run it in. In a pnpm project where Playwright is
only a transitive dependency, prefix the command with
`NODE_PATH=<project>/node_modules/.pnpm/node_modules`. Without Playwright, open each page in
whatever browser tool you have and resize by hand.

Look at the screenshots yourself. Fix overflow, wrapped labels, broken images and anything that
falls apart at the narrow width. The user should never be the one who finds those.

## 6. Present, then stop

Give the user the path or URL of `index.html`, then a short table:

| Variant | Direction | Good at | Costs |
|---|---|---|---|

Add your pick and the reason in one or two sentences. Then stop. The choice is the user's.

Expect "the header from B with the list from C". Build that as a new variant file and add it to
the manifest. Keep the earlier files, the user may want to go back. For a small correction to
one variant, edit it in place.

## 7. Record what was decided

When the user settles, write it into `decisions` in `variants.js`, dated, in plain sentences:

- which direction won
- what was taken from the others
- what was rejected, and the user's reason in their words
- what is still open

The index page shows the list. That list plus a link to the folder is all a handoff needs.

A mock is not a spec. Whoever implements it follows the decisions and uses the mock as a picture
of the idea. They build with the app's real components, and nobody compares the two pixel by
pixel. Keep the folder afterwards. It is the record of why the page looks the way it does.

## Credits

The divergence rules come from Emil Kowalski's `prototype` skill. The question-first framing and
the logic demo come from Matt Pocock's `prototype` skill.
