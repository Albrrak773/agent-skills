---
name: notion-page-design
description: "Create or restructure Notion pages through Notion MCP using native blocks, readable summaries, and collapsible detail. Use for Notion requirements, project hubs, plans, progress logs, research, and page formatting. Includes the user's blue page-icon convention for DragPath."
license: MIT
---

# Notion page design

Make Notion pages easy to navigate at a glance. A succession of headings, bullets, and paragraphs still reads as a wall of text. Use native blocks to give summaries, comparisons, diagrams, and secondary details distinct shapes.

## User's formatting requirements

- **No redundant parent backlinks.** Notion already shows the hierarchy. Do not add a "back to hub" mention at the top of child pages. Keep useful references to related decisions, tasks, and PRs.
- **Use emojis in section headings.** Pick an emoji that explains the section, such as 🧭 overview, ✅ acceptance, 🏗️ architecture, or ❓ open questions. Keep titles readable.
- **Give pages icons.** For pages belonging to DragPath, use native Notion icons in **blue**, consistent with neighboring pages. Preserve suitable existing blue icons. Inspect sibling pages or supported icon metadata for valid identifiers; do not invent identifiers. Other projects follow their existing convention.
- **Use native date mentions.** Actual dates in page content should be Notion date handles, not raw date strings. Include the user's timezone when a time is meaningful. Keep literal dates unchanged inside code, URLs, IDs, quoted source material, or database date properties.
- **Use Mermaid for relationships.** Architecture, request flows, dependencies, sequences, and state transitions should use a suitable Mermaid diagram when it makes the relationships clearer. Label proposed architecture as proposed. Do not invent relationships just to add a diagram.
- **Use icon or emoji callouts.** Put the page's purpose, current status, next action, or a critical distinction in a short native callout. Use blue backgrounds for DragPath summaries where appropriate.
- **Use tables, dividers, and code blocks deliberately.** Tables suit comparable facts, decisions, status, dependencies, and ownership. Dividers separate major reading areas. Fenced code is for real code, commands, schemas, or Mermaid, not prose disguised as code.
- **Collapse secondary detail.** Put long work-package descriptions, historical notes, source excerpts, templates, and detailed evidence in toggles. Keep current blockers, next actions, and decision-critical information visible outside them.

## Layout decisions

Start with a short purpose or status callout, then the information the reader needs now. Use a compact table or diagram where it communicates more clearly than prose. Follow with labeled toggles for details. A hub should make its actual child pages easy to find; avoid repeating their contents in the hub.

Do not require every block type on every page. A short update can remain short. Choose blocks for meaning, not decoration, and keep status text alongside emojis so meaning never relies on color or symbols alone.

## MCP editing workflow

1. Fetch the target and relevant neighboring pages. Inspect native icons, existing hierarchy, child-page blocks, content completeness, and the user's source requirements.
2. Read the connected Notion MCP's enhanced Markdown specification before writing. Use its supported syntax and deployed tool schemas. The examples in [references/native-blocks.md](references/native-blocks.md) explain intent; the live specification is authoritative.
3. Preserve requirements, acceptance criteria, evidence, unresolved questions, links, and meaningful source text. Move detail into toggles rather than silently deleting it. Separate proposals, documentation research, live verification, merged work, and released functionality.
4. Prefer targeted edits for small changes. A full redesign can replace content only after fetching it and preserving every child-page, database, folder, and other native structural reference. A page mention is not a replacement for a child-page block.
5. Make writes only within the user's authorized scope. Do not add unrelated tasks, notify people, or publish elsewhere merely because this skill is active.
6. Fetch after structural edits. Confirm icons are blue for DragPath, dates are native mentions, toggles contain their intended children, Mermaid remains a diagram block, backlinks are gone, and all child pages and material content remain. If a visual preview is available, inspect it; otherwise report structural verification without claiming visual QA.

## Final check

- Can the reader find the status, next action, and open questions without opening every toggle?
- Does the page have a clear visual rhythm beyond headings and bullets?
- Are long lists and historical material collapsed, while their summary remains visible?
- Are dates, callouts, tables, diagrams, and icons native Notion constructs?
- Are source requirements preserved and claims of progress supported by evidence?
- Is hierarchy doing navigation work without redundant parent links?
