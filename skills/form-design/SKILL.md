---
name: form-design
description: "Forms have three layers of guidance: helper text below the input explains what to enter, placeholder shows the expected format, and validation confirms correctness. Real-time validation for complex inputs. Submit enables only when the form is valid. Use when designing or reviewing any form, input field, or data entry UI."
license: MIT
---

# Form Design

Forms are where users give the product data. Every unnecessary obstacle between the user and a completed form is a failure. The design goal is to make correct input easy and incorrect input obvious, before the user submits.

---

## The Three Guidance Layers

Each layer serves a distinct purpose. Do not collapse them.

### Layer 1: Helper Text
Explains *what* to enter. Appears below the input, always visible, in small secondary text.

```
Email address
[                              ]
Use the email you signed up with.
```

- Write in plain language from the user's perspective
- Keep it to one sentence. If you need more, the field is too complex or misnamed
- Do not repeat the label ("Enter your email" below a label that says "Email" is redundant)
- Helper text is not a replacement for a label. The label is still required

### Layer 2: Placeholder
Shows the *format* or an example value. Appears inside the input, disappears on typing.

```
[jane@example.com              ]
```

- Use a realistic example, not a description: `+966 55 123 4567` not `Enter phone number`
- Never use placeholder as a label. It disappears and leaves the user without context
- Keep it grey (`--color-text-secondary`) and lighter than actual input text
- Optional. Not every field needs a placeholder

### Layer 3: Validation
Confirms whether the input is correct. The most important layer.

```
Email address
[jane@           ] ← invalid
✗ Enter a valid email address.
```

**Validation timing:**
- **On blur** (leaving the field): default for most fields. Validates once the user has finished
- **Real-time** (on input): use when the format is complex or the error is likely: password strength, IBAN, VAT number, URL, regex-heavy fields
- **On submit**: catches anything missed, scrolls to the first error

Real-time validation must be forgiving at the start. Do not show an error the instant the user starts typing. Show it after a short debounce (300–500ms) or after the first character that makes the input definitively wrong.

---

## Layout & Field Ordering

These apply before you get to individual fields. Get the shape of the form right first.

- **Single column.** Horizontally adjacent fields force a Z-pattern scan and get skipped or misread more often. A single column reads as one straight line down the page. Reserve side-by-side fields for tightly-paired, unambiguous values (e.g. city + postal code) where a native two-up layout is the established convention.
- **Minimize field count and typing effort.** Every field is a cost, so cut any that aren't needed for the immediate task. Where possible, replace free typing with a lower-effort control (select, toggle, autofill, a default value) since typing is slow and error-prone even on a full keyboard.
- **Size the field to the expected input.** A field much longer or shorter than its content makes users second-guess the label (worse for unfamiliar or technical fields like a VAT number or CVV). Set input width to roughly match the expected character count instead of stretching every field to the same width.
- **Order fields and options the way a user thinks, not the way the database is shaped.** Ask questions in the sequence a person would naturally answer them, not alphabetical or schema order. Order option lists intuitively too (Mon–Sun, not alphabetical). For every field, ask why it's needed. If there's no clear answer, cut it.

---

## Submit Button State

The submit button enables when the form is valid. This is one of the clearest affordance signals in form design: the user sees the goal and knows when they have reached it.

```
[Submit]   ← disabled, low contrast, cursor: not-allowed
           (fields incomplete or invalid)

[Submit]   ← enabled, full colour, cursor: pointer
           (all required fields valid)
```

**Implementation:**
```html
<button type="submit" disabled={!isFormValid}>Submit</button>
```

For long or complex forms where real-time validation is not practical, do not disable the submit. Validate on submit and scroll to errors instead. Disabled submit on a long form frustrates users who cannot tell what is missing.

**Loading state on submit:** Replace label with spinner, disable the button. Prevent double-submission.

---

## Field Anatomy

```
[Label]                           [Optional badge if optional]
[Input field                                                  ]
[Helper text: what to enter, format, constraints             ]
[Error message: appears below helper text on validation fail ]
```

```html
<div class="field">
  <label for="vat">VAT number <span class="optional">Optional</span></label>
  <input
    id="vat"
    type="text"
    placeholder="300012345600003"
    aria-describedby="vat-helper vat-error"
    aria-invalid="true"
  >
  <p id="vat-helper" class="helper-text">Saudi VAT numbers are 15 digits, starting and ending with 3.</p>
  <p id="vat-error" class="error-text" role="alert">Enter a valid Saudi VAT number (e.g. 300012345600003).</p>
</div>
```

---

## Required vs Optional

Mark the minority. If most fields are required, mark the optional ones. If most are optional, mark the required ones.

- Do not rely on colour alone, add a text label ("Required" or asterisk with legend)
- Place the required/optional indicator in the label, not only in the placeholder or helper text

```html
<label>Email <abbr title="Required">*</abbr></label>
<!-- or -->
<label>Phone <span class="badge">Optional</span></label>
```

---

## Grouping with Fieldset

Related fields belong in a `<fieldset>` with a `<legend>`. This is semantic HTML and helps screen readers announce the group context.

```html
<fieldset>
  <legend>Billing address</legend>
  <label>Street</label><input type="text">
  <label>City</label><input type="text">
  <label>Postal code</label><input type="text">
</fieldset>
```

Use fieldsets for:
- Address groups
- Payment details
- Radio button groups
- Checkbox groups

---

## Input Types

Use the correct `type`. Browsers provide free validation, appropriate keyboards, and autofill.

| Data | Input type |
|---|---|
| Email | `type="email"` |
| Phone | `type="tel"` |
| URL | `type="url"` |
| Number | `type="number"` |
| Password | `type="password"` |
| Date | `type="date"` |
| Search | `type="search"` |
| Colour | `type="color"` |

On mobile, `type="email"` shows the email keyboard, `type="tel"` shows the numpad. These are free UX improvements.

---

## Autofill Support

Allow browsers to autofill. Do not disable it unless there is a security requirement.

```html
<input type="text"  autocomplete="name">
<input type="email" autocomplete="email">
<input type="tel"   autocomplete="tel">
<input type="text"  autocomplete="street-address">
<input type="text"  autocomplete="postal-code">
<input type="text"  autocomplete="cc-number">    <!-- credit card -->
<input type="password" autocomplete="new-password">
```

Correct `autocomplete` values reduce friction dramatically for returning users and on mobile.

---

## Review Checklist

- [ ] Fields are in a single column (unless a paired convention like city/postal code justifies side-by-side)
- [ ] Every field is necessary. Nothing is asked "just in case"
- [ ] Field width roughly matches the expected input length
- [ ] Fields and option lists are ordered the way a user thinks, not alphabetically or by schema
- [ ] Every field has a visible label (not just placeholder)
- [ ] Helper text is below the input and explains what to enter
- [ ] Placeholder shows format or example, not a description
- [ ] Validation triggers on blur for simple fields, real-time for complex ones
- [ ] Error message is adjacent to the field that failed
- [ ] Error message is associated via `aria-describedby`
- [ ] Required/optional marked on the minority of fields
- [ ] Submit button is disabled when form is invalid (for short forms)
- [ ] Submit button shows a loading state and prevents re-submission
- [ ] Related fields are grouped in `<fieldset>` with `<legend>`
- [ ] Correct `type` attribute on all inputs
- [ ] `autocomplete` attributes set on address, contact, and payment fields
