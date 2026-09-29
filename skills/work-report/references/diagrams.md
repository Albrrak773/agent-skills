# Diagrams

Architecture changes have no screenshot, so a before/after diagram pair carries them. Mermaid,
written inline as `<pre class="mermaid">`. The Artifact viewer renders these itself; don't load a
library (the offline fallback in `publishing.md` adds one for you).

## Pick the diagram type by the question it answers

| The change is about… | Use | Example |
|---|---|---|
| Who does what, in which order, and where it can break | `flowchart TB` | a request that used to depend on the browser, now on a queue |
| A race, a transaction, retries, two actors at once | `sequenceDiagram` with `par`/`alt` | cancel vs. the worker's claim; BEGIN…COMMIT vs. three separate writes |
| A lifecycle with states | `stateDiagram-v2` | a job: submitted → check → recovered / failed / timed out |
| Who owns which data | `flowchart LR` with `[(table)]` cylinders | two tables each storing a total vs. one derived from the other |
| A list of old → new | not a diagram: a `table.data` | cron line → queue schedule |

Put the simplest pair in the section body. Sequence diagrams, state diagrams and finding tables
go inside Technical detail, where the reader has opted into depth.

## Make the pair comparable

- **Same diagram type, same direction, same vocabulary** on both sides. The eye diffs them.
- **Similar height.** A tall After beside a short Before looks like "more complicated". Flatten a
  subgraph with `direction LR`, or drop nodes that didn't change.
- **Mark the failure path in the Before** with dashed edges and a dashed node:
  `X -.->|tab closed| Y` and `style Y stroke-dasharray: 4 3`.
- **Name nodes in the reader's words** first, the identifier second when it helps:
  `Q[(job queue)]`, `T[(invoices table)]`.
- 4–8 nodes per diagram. If it needs more, it's two diagrams.

## Pitfalls that failed before

- **`<br/>` inside a label is dropped silently** in the Artifact renderer and the words run
  together ("jobper run"). Use a comma. `check-report.mjs` rejects it.
- Quote any label with punctuation: `B["submit job, runs at +10s"]`.
- `/` at both ends of a label makes a parallelogram: `[/submit/]`. Fine on purpose, confusing by
  accident.
- A diagram inside a closed `<details>` renders fine when opened. No need to pre-open it.
- The expand button comes from the template's script, which reads the rendered `<svg>`. Don't
  wrap `<pre class="mermaid">` in anything but the template's `.diagram > .scroll`.
