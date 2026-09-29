# From PRs to things shipped

A report counts **outcomes**, not pull requests. "Payments survive a provider outage" is one
thing even when it took eight PRs. The numbered headings are how the reader learns how much shipped, so the
grouping decides whether the report is honest.

## Read before grouping

Read every PR body in full, not the titles. Titles hide the shape: "Prepare invoice totals for one query
(shape only)" is half of something, and its body usually names the other half.
Look for:

- **Stacks.** "Stacked on #210", "slice 2 of 5", "step 3 of ADR-0004". A stack is one thing.
- **Follow-ups.** "Follow-up to #206", docs-only PRs that correct an earlier one.
- **Closed PRs** whose work landed in another PR ("folded into", "superseded by").
- **Findings.** "Found on the way", "Bugs this had to fix". Sometimes these are their own thing.
  Usually they're the best evidence for the thing they were found in.

## Grouping rules

1. **Shape-only PRs fold into the behaviour PR they prepared.** Refactors that exist so a later
   PR could change behaviour aren't shipped to anyone on their own.
2. **A stack for one decision is one thing.** Split it only when the steps deliver different
   outcomes a reader would care about separately. "Webhooks moved to a queue" and "nightly
   reminders moved to the queue" are two things even though one ADR drives both.
3. **Docs-only PRs fold into what they document.** Their content often becomes a Technical
   detail bullet ("the old cron line had a stray quote and never ran; fixed on the server").
4. **Closed-and-folded PRs appear in the chip row struck through**, never as their own thing and
   never silently dropped. The user wants all of their work visible, including attempts.
5. **A PR can serve two things.** Put its chip under both only when each section really depends
   on it. Otherwise pick the one it mattered most to.
6. **Small and standalone goes under Smaller fixes**, still numbered: a copy cleanup, a CI fix, a
   dev-tooling repair, a one-screen bug. Small is not the same as invisible.
7. **Open PRs are out.** A report covers what merged. Mention an open PR only when a merged thing
   is incomplete without it, and say it's open.

## Order

Biggest impact on users or the business first, then enabling work, then new surfaces, then
smaller fixes. When one thing makes a later one possible (a queue, then the admin page that
monitors it), keep them in that order so each section can say "Once webhooks went through the
queue…".

## Name each thing twice

- **Heading:** what is now true, in user terms. "A payment is recorded even when the provider's
  webhook arrives twice." Not "Webhook refactor".
- **Nav chip:** two or three words. "Webhooks queued".

## Check with the user before capturing

Send the numbered list with, for each thing: its PRs, the planned medium (screenshots /
diagrams / table / text) and what the before and after would show. Screenshots are the slow,
expensive part. Agree on them before building a before checkout.
