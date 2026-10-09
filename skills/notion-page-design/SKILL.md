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
- **Give pages distinct, meaningful icons.** For pages belonging to DragPath, use native Notion icons in **blue**, consistent with neighboring pages. The color is shared; the symbol should identify each page's purpose. Do not assign the same symbol to every sibling. Examples: document for requirements, map for a plan, list for a register, book for research, and flag for a phase. Preserve suitable existing icons. Verify identifiers against workspace metadata or Notion's icon assets rather than assuming they exist. Other projects follow their existing convention.
- **Use native date mentions.** Actual dates in page content should be Notion date handles, not raw date strings. Include the user's timezone when a time is meaningful. Keep literal dates unchanged inside code, URLs, IDs, quoted source material, or database date properties.
- **Use Mermaid for relationships.** Architecture, request flows, dependencies, sequences, and state transitions should use a suitable Mermaid diagram when it makes the relationships clearer. Label proposed architecture as proposed. Do not invent relationships just to add a diagram.
- **Use icon or emoji callouts.** Put the page's purpose, current status, next action, or a critical distinction in a short native callout. Use blue backgrounds for DragPath summaries where appropriate.
- **Use tables, dividers, and code blocks deliberately.** Tables suit comparable facts, decisions, status, dependencies, and ownership. Dividers separate major reading areas. Fenced code is for real code, commands, schemas, or Mermaid, not prose disguised as code.
- **Use ordinary headings by default.** Purpose, current requirements, acceptance criteria, scope questions, progress, and handoffs should normally be visible sections. Use toggles selectively for genuinely optional material, such as preserved original notes, archives, lengthy evidence, or reusable templates. Do not turn every section into a toggle to shorten the page. If most of the page is collapsed, reconsider the layout.

## Layout decisions

Start with a short purpose or status callout, then the information the reader needs now. Use a compact table or diagram where it communicates more clearly than prose. Keep primary content under visible headings and use labeled toggles only when readers can safely skip their contents. A hub should make its actual child pages easy to find; avoid repeating their contents in the hub.

Keep related blocks directly under their heading in the requested order. Do not interleave child-page blocks with a table or description section. After writing, inspect the fetched block order, not just the presence of each block; preserved native child blocks can end up misplaced during a rewrite.

## Codebase explanations and audits

For technical reports, show short excerpts of the actual inspected queries and code in fenced blocks. Prefer the implementation over invented examples. Preserve real identifiers, predicates, parameters, execution order, and relevant error handling. Trim unrelated lines by replacing them with language-appropriate comments explaining what was omitted. Label trimmed excerpts as excerpts; do not present them as complete runnable programs.

Put a source link beside each excerpt, pinned to the reviewed revision when available. Explain in plain language what the code does and why it matters. Keep the excerpt close to the concept it explains, and inline-link a useful learning resource when introducing an unfamiliar concept. Never include secrets.

When an audit is requested, make the findings visible and prioritize them. Tie each finding to inspected code, a concrete failure scenario, its impact, and a suggested remedy. Distinguish confirmed implementation gaps, design tradeoffs, and production behavior that has not been verified. Keep longer evidence in optional toggles without hiding the findings themselves.

## Phase registers

When the user asks for progress to be organized by phases, make the progress page a register of phase subpages. Keep only the phase overview, status, navigation, and register conventions on that page. Put a phase's scope, completed work, remaining work, decisions, PRs, blockers, and handoffs in its own child page, using visible headings.

For Super Agent, the current phase is Phase 0, planning and discovery. Later phases, their count, and their responsibilities are not defined yet. Do not invent future phases or treat proposed SA work packages as agreed phases. Add phase pages as their purposes are decided.

Do not require every block type on every page. A short update can remain short. Choose blocks for meaning, not decoration, and keep status text alongside emojis so meaning never relies on color or symbols alone.

## MCP editing workflow

1. Fetch the target and relevant neighboring pages. Inspect native icons, existing hierarchy, child-page blocks, content completeness, and the user's source requirements.
2. Read the connected Notion MCP's enhanced Markdown specification before writing. Use its supported syntax and deployed tool schemas. The examples in [references/native-blocks.md](references/native-blocks.md) explain intent; the live specification is authoritative.
3. Preserve requirements, acceptance criteria, evidence, unresolved questions, links, and meaningful source text. Move optional detail into an appropriate toggle or subpage rather than silently deleting it; keep current requirements visible. Separate proposals, documentation research, live verification, merged work, and released functionality.
4. Prefer targeted edits for small changes. A full redesign can replace content only after fetching it and preserving every child-page, database, folder, and other native structural reference. A page mention is not a replacement for a child-page block.
5. Make writes only within the user's authorized scope. Do not add unrelated tasks, notify people, or publish elsewhere merely because this skill is active.
6. Fetch after structural edits. Confirm icons are distinct and blue for DragPath, dates are native mentions, core sections are visible, optional toggles contain their intended children, Mermaid remains a diagram block, backlinks are gone, and all child pages and material content remain. Check exact heading, table, description, and child-page order. If a visual preview is available, inspect it; otherwise report structural verification without claiming visual QA.

## Final check

- Can the reader find the status, next action, and open questions without opening every toggle?
- Does the page have a clear visual rhythm beyond headings and bullets?
- Are core sections visible, with toggles reserved for material readers can safely skip?
- Do sibling icons identify their page purposes, and are related blocks directly under the right heading?
- Are dates, callouts, tables, diagrams, and icons native Notion constructs?
- Are source requirements preserved and claims of progress supported by evidence?
- Is hierarchy doing navigation work without redundant parent links?
