# Work-report profile: <Project>

Read by the `work-report` skill before every report. Keep it true: when a step here stops
working, fix it in the same session.

## Project

- Name as it appears in the report title: <Project>
- Repo: <owner/name> · base branch: <main>
- Report language: <English>
- Who reads it: <e.g. co-founder (non-technical) and the dev team> → layered: plain paragraph
  on top, engineering depth inside "Technical detail"
- Brand accent (optional; overrides `--accent` in the template): light <#4C72CA>, dark <#7FA6FF>
- Evidence sources beyond PR bodies: <docs/adr/, MEMORY.md, docs/runbooks/>

## Screenshots

- Locale(s) to capture: <en> · theme: <dark> · viewport: 1440x900 at scale 2
- Before checkout: `git worktree add --detach ../report-before-<short-sha> <before-sha>`
- Install in a checkout: `<pnpm install --frozen-lockfile>`
- Run the app, after checkout (pin the port): `<pnpm run dev --port 3531>`
- Run the app, before checkout: `<pnpm --dir ../report-before-<short-sha> run dev --port 3885>`
- Secrets for local runs: <injected by `infisical run --env=dev --` inside the dev script / .env.local / none>
- Sign in: <shoot.mjs --login /api/dev-auth | --storage-state <file> | none needed>
- Local user's plan/role, and how to change it for a shot: <Free plan; admin; SQL below>

### Local data

- Each checkout gets its own database? <yes: dev script clones one per worktree / no: shared>
- Open SQL on a checkout's own database: `<command>`
- Seeding is allowed in: <that clone only>. Never anywhere else.
- Recipes that worked before (append new ones):
  - <Turn a feature flag on: UPDATE feature_flags SET enabled = true WHERE key = '<flag>';>
  - <Dismiss the onboarding tour: …>

### Traps

- <Overlays to dismiss and how>
- <Pages that poll forever (shoot.mjs already uses "load")>
- <Objects that exist in production only (public CDN images): proxy with shoot.mjs --proxy>

## Never do while capturing

- <Press Generate/Pay: calls <provider> with real money.>
- <Run the background worker: it would submit queued jobs to <provider>.>
- <Write to the storage bucket: the dev bucket may be production's.>

## Cleanup

- Stop both dev servers.
- `git worktree remove ../report-before-<short-sha>`
- Drop only the before checkout's database: `<command>`. <Not `<gc command>`: it deletes every orphaned clone, not just this one.>
- Reset the after checkout's database if it was seeded: `<command>`
- Revert anything the dev server rewrote: `<git checkout next-env.d.ts>`

## Report log

Newest first. The next report starts after the last PR here unless told otherwise.

| Period | PRs | Things shipped | Link |
|---|---|---|---|
| <Sep 25–29, 2026> | <#101–#123> | <11> | <https://claude.ai/artifact/…> |
