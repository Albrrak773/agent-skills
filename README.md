# agent-skills

[Agent Skills](https://agentskills.io/specification) for Claude Code.

| Skill | What it does |
| --- | --- |
| [`arabic-copy`](skills/arabic-copy) | Write Arabic UI copy in business-casual Saudi Najdi. Kills the stiff, translated, "AI-sounding" register that MSA-by-default produces, without swinging to copy that's curt or accusing. |
| [`form-design`](skills/form-design) | Design and review forms. The three guidance layers (helper text, placeholder, validation), when to validate on blur vs in real time, field ordering and width, and an accessibility-aware field anatomy. |

## Install

As a plugin marketplace (installs every skill in the repo):

```
/plugin marketplace add Albrrak773/agent-skills
```

Or drop a single skill in by hand:

```
git clone https://github.com/Albrrak773/agent-skills
cp -r agent-skills/skills/arabic-copy ~/.claude/skills/
```

`~/.claude/skills/` makes it available everywhere; a project's own `.claude/skills/` scopes it to that repo.

## About `arabic-copy`

Most Arabic written by an LLM lands in a formal MSA register that reads translated, and the usual correction overshoots into copy that barks at the user. The skill separates those two problems:

- **Register** - business-casual Najdi, with the rule that dialect lives in function words (`تبي`, `الحين`, `عشان`) rather than in swapping out verbs that are already natural. One register per string, never MSA and dialect in the same sentence.
- **Tone** - never blame or command the user. Politeness markers aren't banned; they're context-dependent, and the skill maps which contexts take them.

Plus the dialect-leak table (Egyptian/Levantine/Hejazi words that sneak in), a kill list of genuine translationese, and a carve-out keeping legal text in MSA.

## About `form-design`

Forms fail in predictable ways: the label lives in the placeholder and vanishes on the first keystroke, errors fire before the user has finished typing, and every field is stretched to the same width regardless of what goes in it. The skill separates the three guidance layers that usually get collapsed into one, and pins down validation timing (blur for simple fields, debounced real-time for complex formats, submit as the backstop).

Also covers single-column layout, ordering fields the way a person thinks rather than the way the table is shaped, `<fieldset>` grouping, correct input `type` and `autocomplete` values, and a review checklist.

## License

MIT
