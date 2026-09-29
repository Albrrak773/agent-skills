# Publishing

## With an Artifact tool (Claude Code, claude.ai)

Publish the report as a private Artifact: the page's `index.html` plus its `img/` files.

```
Artifact publish
  file_path   = <report>/index.html
  root        = <report>
  files       = { "img/a-before.webp": "img/a-before.webp", … }   # one entry per image
  icon        = "report"
  description = "What shipped in <Project> PRs #N–#M: …"   # one sentence
```

- **Title** is `<Project> Work Report, <Mon D–D>` (set by the template's `<title>`). Keep it the
  same across republishes.
- **Look once** at the live page: one diagram rendered, one expand button opens and fits, the
  sticky nav works. Fix what that shows, republish once.
- **It's private.** Tell the user the link and that others can't open it until they share it from
  the page's Share menu.
- Add the report to the profile's **Report log** (period, PR range, count, link).

### Updating later, or after losing the local files

Scratch directories can be wiped between turns. The published artifact is the durable copy:
- `Artifact read <url>` returns the full source. Strip the platform wrapper (the outer
  `<!doctype>…<body>`) and the injected `claude-mermaid-runtime` block before editing.
- Republish to the same `url`. **Leaving `files` out keeps the published images.** Only pass the
  images you add or replace.

## Without an Artifact tool

Produce one self-contained file:

```bash
node scripts/inline-images.mjs <report>/index.html <report>/<project>-work-report-<date>.html
```

Images become `data:` URIs, and a pinned Mermaid build is added (diagrams then need network
access; everything else works offline). Hand the user the file path. Don't commit reports with
inlined images to the project repo: they bloat history, and a report often contains details the
repo's audience shouldn't see.

## Before either

```bash
node scripts/check-report.mjs <report>/index.html
```

Zero errors before publishing. Read each warning and either fix it or know why it's fine.
