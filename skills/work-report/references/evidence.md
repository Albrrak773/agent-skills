# Evidence: proving each thing is better

Every "Why it's better" bullet is **a bold one-sentence claim, then the proof.** The proof is a
number whenever one exists, and every number must trace back to a source a teammate could open.

## Where numbers come from

In order of preference:

1. **The PR's own verification.** Test results, timings, row counts, before/after tables. Well-run
   PRs are full of these: "the same webhook delivered 5 times produced 1 payment row", "p95 invoice
   page load 2.4 s → 380 ms on the staging copy".
2. **Production findings recorded in a PR or decision log.** "41 of 3,200 invoices showed a total
   that disagreed with their line items", "the reminder cron fired 212 times and never sent one".
3. **git itself.** File size before/after:
   `git show <before-sha>:<path> | wc -l` vs `wc -l <path>`. Count of routes, jobs, tables,
   dependencies: list them at both SHAs and diff.
4. **Build or CI measurements a PR recorded.** Peak heap, build time, bundle size.

## Never

- Estimate, extrapolate or round up a number the source doesn't state. "~1,890 MB" stays
  "~1,890 MB"; don't make it "nearly 2 GB".
- Present seeded local data as a production figure. If a screenshot shows seeded rows, the
  figure's caption can say so. A stat never comes from seeded data.
- Claim something was verified that the PR says was not. Unverified parts go in Technical detail,
  stated plainly: "Not yet verified: the provider's live webhook (it can't reach localhost)."

## When there's no number

Say concretely what can no longer happen, or what now happens instead:
- "An invoice total can't disagree with its line items anymore: there's no stored copy to go stale."
- "Editing a draft can't change an invoice that was already sent: sending freezes a snapshot."

Not: "More reliable run handling." A claim the reader can't picture proves nothing.

## The stats strip

Three or four tiles, each a real total:
- merged PR count, noting closed ones;
- lines changed as GitHub-style `+` green / `−` red, merged PRs only;
- one or two **"X → Y"** tiles when the period has a genuine before→after count ("cron jobs the app
  depends on 4 → 0", "database writes to record a payment 3 → 1"). These land hardest: the
  reader sees the improvement before reading a word.

**No "things shipped" tile.** The numbered headings already say it.

## Flags and new surfaces

- A feature behind a flag that's off gets `<span class="tag flag">behind flag: <key> (off)</span>`.
  Don't imply users have it.
- A brand-new surface often has nothing to be "better" than. Use a **"Why it's safe to ship"** box
  instead: what gates it, what can't leak, what can't drift.
