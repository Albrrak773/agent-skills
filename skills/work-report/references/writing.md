# Writing the report

The language is what readers notice first and praise most. It should read like a sharp
engineer explaining their week to a smart friend who doesn't write code: plain, specific,
unhurried, a little proud of the work without selling it.

## Each block has one job

| Block | Job | Length |
|---|---|---|
| `h1` thesis | The one sentence that sums up the period. The accent `<span>` is its sharpest half. | ≤ 12 words |
| lede | What the period was mostly about and what users get, naming the new surfaces. | 3–4 sentences |
| `h2` headline | What is **now true**, in user terms. | ≤ 12 words |
| plain paragraph | Before: what happened to a user and why that was bad. Now: what happens. | 3–5 sentences |
| "Why it's better" | Bold one-sentence claim, then the proof (see `evidence.md`). | 2–4 bullets |
| figcaption | Point at the exact thing to look at. | 1–2 sentences |
| Technical detail | The mechanism, invariants, identifiers, what wasn't verified. | as deep as it needs |
| smaller-fix card | Cause in one sentence, fix in one sentence, a number if there is one. | 2–3 sentences |

## Voice

- **Write from the user's side of the screen** in everything above Technical detail. Name things
  by what people see ("the invoice page", "the Pay button"), not how they're built ("the
  `InvoiceView` component", "the webhook handler"). Internal names belong in Technical detail,
  in `<code>`.
- **Headlines state an outcome**, not an activity: "A payment is recorded exactly once, even when
  the webhook arrives twice", not "Refactored webhook handling" or "Improved reliability".
- **Before/now structure** in the plain paragraph. Start with how it used to work and what went
  wrong for someone. End on how it works now. Skip the middle (how you got there).
- **Active voice, concrete nouns, short sentences.** "The server queues the payment the moment it
  arrives," not "Payments are now enqueued upon receipt."
- **Proud, not promotional.** The numbers do the bragging. No "significantly", "dramatically",
  "massively".
- **Honest about limits.** Say what's behind a flag, what's seeded, what wasn't verified, where
  it belongs, once, plainly.

## Kill list

Words and moves that make the page read generated. Rewrite on sight:

- robust, seamless(ly), leverage, streamline, enhance(d), empower, delve, cutting-edge,
  game-changer, holistic, synergy, best-in-class, state-of-the-art
- "It's worth noting", "Importantly,", "In essence", "At its core", "Let's dive in"
- rhetorical questions ("What does this mean for users?")
- triplets for rhythm ("faster, safer, and simpler") when only one is proven
- **em dashes in running copy.** Use a period or a comma. (En dashes in ranges like
  "Sep 25–29" and "08–11" are fine.)
- emoji, exclamation marks, "🚀 Shipped!"

`scripts/check-report.mjs` catches em dashes and the worst of the kill list. It can't catch
the rest, so read the page once out loud in your head before publishing.

## Quoting the UI

When the UI is in a different language from the report, quote the on-screen text and gloss it
once: "رفع" (Upload). After that, the gloss alone is enough.

## Before and after pairs

A caption's job is to make the difference findable in two seconds. Name the location and the
change: "Toolbar has 'Export CSV'; it re-ran the whole report on every click." Then the After:
"Export is gone from the toolbar; it moved into the ⋯ menu and reuses the cached result."
