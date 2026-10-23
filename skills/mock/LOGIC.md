# Logic mock

One HTML file that lets the user click through a flow or a state model and watch what happens.
Use it when the question is about behaviour: what a click leads to, which states exist, which
actions are allowed when, what the data has to hold. These things look fine in a description
and feel wrong once you push real cases through them.

If the question is what the page should look like, this is the wrong file. Go back to
[SKILL.md](SKILL.md).

## 1. State the question on the page

Put the question and the model under test in a short visible intro at the top, in the user's
words. "Can an order be cancelled after it ships, and what does the customer see if it
can't?" A demo that answers a different question is wasted.

## 2. Keep the logic separate from the page

Write the rules in one `<script>` block as plain functions with no DOM access. Pick the shape
that fits the question:

- a reducer, `(state, action) => state`, when actions are discrete events
- a state machine with named states and transitions, when "what is legal right now" is the
  question
- a few pure functions over a plain object, when there is no current state, only transformations

The page calls these functions and renders the result. Nothing in them touches `document`.
Once the question is answered, that block is the part worth reading during implementation.

## 3. Build the page

Plain HTML, CSS and JS in one file that opens by double-click. Use the product's tokens so it
doesn't look foreign, and stop there. No animation. Top to bottom:

1. **Title and the question.**
2. **Current state**, as labelled fields in product language, not a JSON dump. Re-render after
   every click and mark what changed.
3. **Free play.** One button per action, always visible. Buttons for actions that are illegal
   in the current state stay visible and disabled, with the reason beside them.
4. **Scenarios.** One tab each: a sentence on the situation and what to watch for, then the
   ordered buttons to press. Starting a scenario resets to a known state.

Choose scenarios for the awkward cases: the normal path, one edge case that is hard to reason
about, one attempt at something that should be refused.

Label everything in the language of the product, not the code. The user should never read an
action name like `CANCEL_REQUESTED`.

## 4. Hand it over and record the answer

Give the user the file path. The useful reactions are "that shouldn't be possible" and "I
assumed it would do X". Those are faults in the idea, which is what the demo is for. Add
actions or scenarios when they ask.

Put the file in the topic folder and list it in `variants.js` like any other entry, so the index
page links to it. When the question is answered, record the answer in `decisions` there, the
same way as step 7 of [SKILL.md](SKILL.md).

## Don't

- Connect it to the real database or API. State lives in memory.
- Add cases for "what if we later want". One question per demo.
- Mix rules into click handlers. If the logic block reads the DOM, split it out again.
- Use a framework, a bundler or a server.
