# Screenshots: a real before/after pair

The before shot comes from the code **before the range**, the after from the code **after it**,
both running locally at the same time with the same data. Never mock a screenshot, never
reconstruct a "before" by hand. The project profile (`.claude/work-report.md`) holds the
project-specific commands; this file is the method and the traps.

## 1. Two checkouts

`gather.sh` wrote `before-sha.txt` (the base branch just before the earliest merged PR) and
`after-sha.txt`. Make the before checkout a sibling git worktree so it shares history but not
files, and install dependencies in both:

```bash
git worktree add --detach ../report-before-<short-sha> "$(cat <gather>/before-sha.txt)"
```

If the current checkout isn't at `after-sha`, capture the after shots from a second worktree too.
Don't reset the user's checkout.

## 2. Two servers on pinned ports

Run both dev servers at once, each on a fixed port. Things that broke when ports floated:
- A browser tool that only allows the port it launched rejects a server that picked its own.
- A dev script that chooses its own port ignores the tool's port unless `--port` is passed.
- `pnpm run dev -- --port N` passes the `--` through literally on some setups, and the framework
  reads `--port` as a project directory. Use `pnpm run dev --port N`.

Sign-in cookies aren't port-scoped. If both servers use the same cookie name, signing in to one
signs the other out. Sign in right before each capture batch (`shoot.mjs --login` does this).

## 3. Data: seed the disposable copy only

Screenshots of empty lists prove nothing. Only seed if the profile names a disposable database
for the checkout. Then:

- **Read the schema first** (`\d <table>`). Column names are never what you'd guess.
- **Build from real local rows.** Insert synthetic rows that reference records that already exist
  locally (users, assets), so the page renders real content.
- **Switch on flag-gated features** in the after checkout's copy only. Say in the section that
  the flag is off in production.
- **Dismiss onboarding tours and banners** in **both** copies, or the before and after differ by
  an overlay.
- **Objects that only exist in production** (public CDN images): don't upload anything to make
  them exist. Point `shoot.mjs --proxy` at local files, which answers those URLs during capture
  only.

Never trigger anything the profile lists under "Never do": no generate/pay buttons, no background
workers, no storage writes, no email.

## 4. Capture

`scripts/shoot.mjs` (header documents every flag). Install Playwright in a scratch dir, not in the
project. A typical batch:

```bash
NODE_PATH=<scratch>/node_modules node scripts/shoot.mjs \
  --base http://localhost:3885 --prefix before --login /api/dev-auth --locale ar --theme dark \
  '/ar/invoices@invoices@table' '/ar/invoices/new@editor@@click:Line items@wait:2000'
```

What it already handles, because each one failed once:
- **`load`, not `networkidle`.** Pages that poll never go idle.
- **Lazy images that never start in headless.** It re-assigns `src` until every visible image has
  pixels, and warns when one never loads.
- **Slow first image-optimizer hits** on a fresh dev server. The same retry loop covers them.

**Open every PNG before using it.** Blank image frames, a tour overlay, a toast, a half-loaded
table mean reshoot, not ship.

## 5. Crop and compress

```bash
scripts/optimize.sh shots/before-editor.png <report>/img/editor-before.webp 650x380+1750+1230
```

- Captures are 2× (2880×1800 for a 1440×900 viewport). Crop coordinates are in those pixels.
- **Crop to the change when it's small** (a picker, a toolbar, a badge) and crop the before and
  after identically. A thin strip goes in `<div class="compare stack">` (full width, stacked).
- Full-page shots stay full when the point is "a whole new page".
- Use the printed dimensions as the `<img width height>`.

## 6. Clean up

Follow the profile's Cleanup section. The usual set: stop both servers, remove the before
worktree, drop **only** that worktree's database, reset the after database if it was seeded, and
revert files the dev server rewrote. Remove any temporary launcher entries you added.
