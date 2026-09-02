---
name: arabic-copy
description: Write Arabic UI copy in business-casual Saudi Najdi, not MSA and not AI-translationese. Use when adding, editing, or reviewing any Arabic user-facing string - labels, hints, buttons, errors, empty states, emails, landing copy. Also use when Arabic copy reads stiff, translated, curt, or "AI-sounding".
license: MIT
---

# Arabic Copy: Business-Casual Najdi

Target reader: a Saudi professional. The copy should read like a competent colleague
from Riyadh wrote it, not like a translation and not like a press release.

Arabic only. One rule below (§8, em dashes) is language-agnostic and applies to English too.

---

## 1. The core rule: labels neutral, sentences Najdi

Short nouns and labels stay plain and neutral. Anything that's a **sentence** (hints,
subtitles, errors, empty states, confirmations, buttons carrying a verb) gets the
Najdi voice.

| Slot | Register | Example |
|---|---|---|
| Field label | neutral | `المستلم` · `الموضوع` · `الرصيد` |
| Button with a verb | Najdi | `ارسل الرسالة` · `احذف الملف` |
| Hint / subtitle | Najdi | `صمم رسالتك وارسلها لأي عنوان تبيه.` |
| Error | Najdi or MSA, softened (§6, §7) | `ما قدرنا نرسل الرسالة. حاول مرة ثانية.` |

Dialect on a one-word label reads jokey on a dense screen. Dialect in a sentence reads human.

## 2. One register per sentence: never mix MSA and dialect

A single string picks a lane and stays in it. Half-and-half is the most common way this copy
goes wrong, and it reads worse than either pure register would.

| ❌ Mixed | ✅ All dialect | ✅ All MSA |
|---|---|---|
| `يرجى المحاولة مرة ثانية` | `حاول مرة ثانية` | `يرجى المحاولة مرة أخرى` |

`يرجى` is MSA, `مرة ثانية` is dialect. One clause, two registers, clunky. Note the pairs:
`مرة ثانية` goes with dialect, `مرة أخرى` goes with MSA.

**Which lane?** §1 sets the default by slot, but validation and error strings lean MSA. They're
the moment to sound composed, not chatty. Everything conversational (hints, subtitles, empty
states, marketing) leans Najdi.

## 3. Najdi is NOT "maximally far from MSA"

The second most common mistake: reaching for an unusual-sounding word to *prove* the copy is
dialect. Najdi speech shares most of its verbs with MSA. The dialect lives in **function
words** (`تبي`, `الحين`, `عشان`, `لازم`, `ما` + verb, `زي`, `كذا`), not in swapping out
verbs that are already natural in speech.

If a plain verb is what a Riyadi would actually say out loud, use the plain verb:

- `ارسل` ✅ , not `رسّل` ❌ (clunky, over-reaching)
- `اكتب` `احذف` `جرب` `اختر` ✅ , all already natural, leave them alone

## 4. Najdi, not Hejazi / Egyptian / Levantine

Mixing in another dialect is worse than plain MSA. Common leaks:

| Never | Use |
|---|---|
| `ابعث` / `ابعت` (Hejazi/Egyptian) | `ارسل` |
| `عايز` / `عاوز` (Egyptian) | `تبي` |
| `دلوقتي` (Egyptian) | `الحين` |
| `كمان` (Egyptian/Levantine) | `بعد` |
| `شو` / `بدك` / `هلق` (Levantine) | `وش` / `تبي` / `الحين` |
| `بـ` present prefix: `بتظهر` `بيروح` (Egyptian/Levantine) | bare verb: `تظهر` `يروح` |

## 5. Restraint: business-casual, not majlis

Najdi that's fine in speech but too casual for product UI:
`وش` · `زين` · `ماهوب` · `ابغى` · `ودي` · `ذولا` · `تكفى`

If a sentence needs one of these, rewrite the sentence instead.

## 6. Never blame the user, never bark at them

**This is the rule casual dialect most often breaks.** Najdi makes copy human; it must not
make it curt. A dropped politeness marker turns a hint into an accusation or an order.

| ❌ Accusing / commanding | ✅ |
|---|---|
| `حط بريد صحيح` | `الرجاء إدخال بريد صحيح` |
| `البريد اللي حطيته غلط` | `البريد الإلكتروني غير صحيح` |
| `ما راح نستخدم الإطار` | `إطار النهاية ما يشتغل إلا مع إطار البداية` |
| `الرمز غير صالح` | `الرمز لازم يكون 6 أرقام` |

Two mechanics doing the work there:

- **Fault goes to the field, never to the person.** `البريد غير صحيح` (impersonal) is kinder
  than `البريد الذي أدخلته خاطئ` (points at them). Use the active voice for things the *user*
  accomplished (`أضفت الملف`), impersonal for things that went wrong.
- **Say what's needed, not what they got wrong.** A rule (`لازم يكون 6 أرقام`) is actionable;
  a verdict (`غير صالح`) is just a scolding.

## 7. Tone shifts with the emotional context

Politeness markers are **not** banned. They're context-dependent. Getting this backwards is
what makes copy read either robotic or rude.

| Context | Rule | Example |
|---|---|---|
| **Neutral** (instructions, hints) | Direct imperative. Drop `يرجى`/`الرجاء`, padding here. | ✅ `أدخل بريدك للمتابعة`<br>❌ `يرجى إدخال البريد أولاً` |
| **Negative** (errors, failures) | Soften, but **one** softener only. | ✅ `تعذر إرسال طلبك. يرجى المحاولة مرة أخرى.`<br>❌ `فشل الإرسال.` (bare verdict)<br>❌ `عذراً، تعذر إرسال طلبك.` (`عذراً` + `تعذر` = two apologies) |
| **Positive** (success, welcome) | Talk about the *user*, not the operation. | ✅ `تم إرسال طلبك!`<br>❌ `تم الإرسال بنجاح.` |
| **Empty state** | Plain statement of fact. Add a next step only if there's a real action. | ✅ `لا توجد ملفات`<br>❌ forced cheer (`ملفاتك بتظهر هنا`) |

`بنجاح` and `تعذّر` are fine words. The failure in `تم الإرسال بنجاح.` is that it describes the
*system's* action tersely instead of the user's outcome, not the word `بنجاح` itself.

## 8. Kill list: the real tells

| Kill | Why | Instead |
|---|---|---|
| `—` em dash | **Banned outright, every language, all copy.** | period, or comma |
| `قم بإدخال` / `قم بالضغط` | `قم بـ` is pure translationese | `أدخل` / `اضغط` |
| `الرصيد الخاص بك` | calqued "your" | `رصيدك` |
| `عنوانًا` `نصًا` | tanween diacritics, nobody types these in UI | `عنوان` `نص` |
| `…` (ellipsis char) | | `...` |
| `بالإضافة إلى ذلك` `علاوة على ذلك` `كما أنه` | stacked essay connectors | split into two sentences |
| sentences past ~15 words | | break them |

## 9. Carve-out: legal text stays MSA

Terms of service, privacy policy, billing/tax language, and refund terms stay formal MSA.
Do not dialect-ify legal copy. The formality is load-bearing there.

## 10. Register ladder by surface

Same voice, different warmth:

1. **Landing / marketing**: warmest. Direct address, short punchy sentences.
2. **Product UI** (the app itself): business-casual. The default; §1 governs.
3. **Transactional email to customers**: one notch more composed. Najdi function words are
   fine; skip the most casual phrasings.
4. **Admin internal**: most relaxed. It's your own team reading it.
5. **Legal**: formal MSA (see §9).

## 11. Before you ship a string

- Read it out loud. Would a Riyadi colleague actually say it? If it only works written, rewrite.
- Is it one register end to end, or does it straddle MSA and dialect? (§2)
- Does it accuse, command, or scold? (§6) This is the most common failure.
- Is the politeness right for the context, and only one softener? (§7)
- Scan for §8, especially `—`.
- Check no other dialect leaked in (§4), and that you didn't over-reach on a verb (§3).
