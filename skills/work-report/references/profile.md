# The project profile

Everything in a report that depends on the project lives in one file inside that project:
**`.claude/work-report.md`**. The skill itself stays generic. Copy
`assets/profile-template.md` there on the first run and fill it in.

A profile is written once and reused. Every later report reads it first and appends to its
report log, so the next run knows where the last one stopped.

## Building it on the first run

Most answers are already in the repo. Look before asking:

| Profile field | Where to look first |
|---|---|
| Project name, repo, base branch | `gh repo view --json name,nameWithOwner,defaultBranchRef` |
| How to run the app | `package.json` scripts, `Makefile`, `Procfile`, `docker-compose*.yml`, `.claude/launch.json`, README "Getting started", `CLAUDE.md`/`AGENTS.md` |
| Secrets for local runs | `.env.example`, a secrets CLI in scripts (infisical, doppler, 1password `op run`), README |
| One database per checkout, or shared? | dev scripts that clone or name a DB per worktree; `docker-compose` volumes |
| Sign-in for a local session | a dev-only auth route, seed users in seed/fixture files, a test-account note in docs |
| Locales and theme | route prefixes (`/[lang]/`), i18n config, a theme toggle; which one the team works in |
| Brand accent | design-token file (`globals.css`, `tokens.json`, `tailwind.config`) |
| Things that cost money or touch prod | AI/payment provider clients, background workers, storage buckets, webhooks |
| Evidence sources | `docs/adr/`, a decision log (`MEMORY.md`, `DECISIONS.md`), runbooks, PR template's verification section |

Then ask the user **only** for what the repo can't answer, and ask all of it in one message.
Typical gaps: which locale to screenshot in, who reads the report, and whether a local run
can reach anything paid.

## What must be in it

The template has every section. The ones that prevent real damage are not optional:

- **Never do while capturing.** The actions that spend money or reach production: pressing a
  generate/pay button, running a background worker that submits queued jobs, writing to a
  storage bucket, sending email. Say *why* for each, so a future agent can judge a case the
  list doesn't name.
- **Where seeding is allowed.** Name the disposable database and the exact command that opens a
  SQL session on it. If there is no disposable database, the profile says "no seeding" and the
  report uses whatever data is already local.
- **Cleanup.** Exactly what to stop, remove and reset afterwards, and anything that looks like
  cleanup but isn't safe (a garbage-collect command that deletes other people's databases).

## Keeping it true

Treat the profile like code. When a capture trick stops working, or a new overlay appears,
fix the profile in the same session. Commit it so the next person gets the fix. Record every
published report in its log with the PR range and link.
