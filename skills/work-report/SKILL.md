---
name: work-report
description: "Turn a range of merged pull requests into a visual work report: one page that numbers every thing shipped, shows real before/after screenshots for UI changes and before/after diagrams for architecture changes, and proves each one is better with numbers taken from the PRs themselves. Use when the user asks for a work report, a progress or status report, 'what did I ship', a changelog with visuals, a sprint or week recap, or a report covering PR #X to #Y."
license: MIT
compatibility: "Needs git, gh (authenticated), jq and Node 18+. Screenshots need a locally runnable web app, Playwright (installed on demand in a scratch dir) and ImageMagick. Publishes as an Artifact where the agent has that tool (Claude Code, claude.ai), otherwise as one self-contained HTML file."
metadata:
  author: Albrrak773
  version: "1.0.0"
---

# Work report

A work report shows someone what shipped in a range of pull requests, in a form they'll read.
Every thing shipped gets a number and a section. UI changes are shown as real screenshots from
the code before and after the range. Architecture changes are shown as before/after diagrams.
Every section proves its claim with numbers taken from the PRs.

`assets/example/index.html` is a complete report for a fictional product: open it to see the
target voice, structure and density before writing anything.

## What the reader gets

- A header: one-sentence thesis, a short lede, and a stats strip. The strip holds merged PRs,
  lines changed as GitHub-style green `+` / red `−`, and one or two "X → Y" tiles when a real
  before→after count exists.
- A sticky nav of numbered chips, one per section.
- Per thing shipped, **numbered 01, 02…**:
  - a headline stating what is now true, in user terms;
  - a "Shipped in" row of clickable PR chips;
  - a plain paragraph a non-engineer understands: how it was, how it is now;
  - the before/after: screenshot pair, diagram pair, or table;
  - a green "Why it's better" box: a bold claim, then the proof;
  - a collapsed "Technical detail" that goes as deep as an engineer wants.
- **Smaller fixes**, each still numbered, because all of the work counts.
- Every screenshot and diagram expands full-screen, with an actual-size toggle.

Don't add a "how this report was made" footer or a "things shipped" stat tile. The first is
noise, and the numbered headings already give the second. Both were tried and removed.

## Workflow

Keep working files in a scratch dir (`<scratch>`). Paths below are relative to this skill.

### 0. Load the project profile

Read `.claude/work-report.md` in the project. If it doesn't exist, build it before anything
else: read `references/profile.md`, copy `assets/profile-template.md`, and fill it from the repo,
asking the user only what the repo can't answer. The profile holds how to run the app, sign in,
seed data safely, what must never be clicked, and the log of past reports.

If the user gave no PR range, start after the last PR in the profile's report log and confirm.

### 1. Gather

```bash
scripts/gather.sh <first-pr> [last-pr] <scratch>/gather
```

This writes every PR body, the totals, and the before/after commits. Then **read every PR body in
full**; the evidence lives in their verification sections. Also read the evidence sources the
profile lists (ADRs, decision logs).

### 2. Cluster into things shipped, and confirm

Group PRs into outcomes, order by impact, and name each twice: a headline and a 2–3 word nav
label. Rules and edge cases (stacks, shape-only PRs, closed-and-folded PRs, docs follow-ups):
`references/clustering.md`.

**Send the user the numbered list before capturing anything**, with the planned medium and
before/after for each. Screenshots are the expensive part.

### 3. Pick a medium per thing

| The change is… | Show |
|---|---|
| Visible in the UI | Real screenshot pair from the before and after checkouts |
| A new surface | "New" labels; plus a "before" if a sensible one exists (the nav without the entry) |
| Flow, jobs, races, data ownership | Mermaid pair: see `references/diagrams.md` |
| A list of old → new | A table |
| None of the above | A text card under Smaller fixes |

### 4. Collect the evidence

Every "Why it's better" bullet needs a source a teammate could open. Where numbers may come from,
what's never allowed, and what to write when there's no number: `references/evidence.md`.

### 5. Screenshots

Two checkouts, two dev servers on pinned ports, seed only the disposable data the profile names,
capture with `scripts/shoot.mjs`, crop and compress with `scripts/optimize.sh`, open every image
before using it. The method and every trap that has bitten before: `references/screenshots.md`.

### 6. Write the page

```bash
scripts/new-report.sh <scratch>/gather <scratch>/report "<Project>"
```

This copies `assets/template.html` with the header numbers filled in. Replace every remaining
`{{placeholder}}`, delete example blocks you don't use, and add sections by copying the
template's. Leave the CSS and the lightbox script alone, apart from the marked BRAND block when
the profile sets an accent. Voice, per-block length and the kill list: `references/writing.md`.

### 7. Check

```bash
node scripts/check-report.mjs <scratch>/report/index.html
```

It catches placeholders, missing images, numbering gaps, broken nav anchors, `<br>` in Mermaid,
em dashes and stock phrases. Zero errors before publishing. It can't judge the writing; reread
every plain paragraph as the reader would.

### 8. Publish, log, clean up

Publish as a private Artifact (or a single inlined HTML file without one), look at it once, and
give the user the link: `references/publishing.md`. Add the report to the profile's report log.
Then run the profile's Cleanup section: servers stopped, before checkout removed, only its own
database dropped, seeded data reset.

## Rules that protect the user

- **Never spend money or touch production to get a screenshot.** No generate/pay buttons, no
  background workers, no storage uploads, no email. The profile lists the project's specific ones.
- **Seed only the disposable database the profile names**, and say in the section when a feature
  shown is behind a flag or the data is seeded.
- **Every number traces to a source.** No estimates, no rounding up, nothing from seeded data.
- **Clean up only what this report created.** A garbage-collect command that deletes other
  checkouts' databases is not cleanup.
