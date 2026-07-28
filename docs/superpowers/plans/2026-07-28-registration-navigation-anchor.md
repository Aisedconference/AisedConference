# Registration Navigation Anchor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Registration page’s top navigation link move directly to the “How would you like to join?” category panel.

**Architecture:** Use native HTML fragment navigation. The top navigation link will reference a stable ID on the existing category wizard panel, so no JavaScript or new dependencies are needed.

**Tech Stack:** Static HTML, Node.js built-in test runner, existing repository test conventions.

## Global Constraints

- Change only the top navigation Registration link in `registration.html`.
- Use the exact anchor ID `registration-options`.
- Place the ID on the category wizard panel containing “How would you like to join?”
- Do not change footer links or Registration links on other pages.
- Do not add JavaScript scrolling behavior.

---

### Task 1: Registration anchor navigation

**Files:**
- Modify: `registration.html`
- Test: `tests/navigation-hero-consistency.test.js`

**Interfaces:**
- Consumes: the existing category panel selected by `data-step="category"`.
- Produces: an in-page navigation target named `registration-options`.

- [ ] **Step 1: Write the failing test**

Add this test to `tests/navigation-hero-consistency.test.js`:

```js
test("registration page navigation jumps to the join options", () => {
  assert.match(
    registrationHtml,
    /<nav[^>]*>[\s\S]*?<a href="#registration-options">Registration<\/a>[\s\S]*?<\/nav>/
  );
  assert.match(
    registrationHtml,
    /<div class="wizard-panel" id="registration-options" data-step="category">\s*<h3>How would you like to join\?<\/h3>/
  );
});
```

This test catches either half of the behavior being removed: the link target or
the matching panel ID.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' \
  --test --test-name-pattern="registration page navigation jumps" \
  tests/navigation-hero-consistency.test.js
```

Expected: FAIL because the top link still points to `registration.html` and the
category panel has no `registration-options` ID.

- [ ] **Step 3: Implement the native anchor**

In `registration.html`, change the top navigation link:

```html
<a href="#registration-options">Registration</a>
```

Change the category panel opening tag:

```html
<div class="wizard-panel" id="registration-options" data-step="category">
```

- [ ] **Step 4: Run the focused and complete test suites**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' \
  --test --test-name-pattern="registration page navigation jumps" \
  tests/navigation-hero-consistency.test.js

'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' \
  --test tests/*.test.js

git diff --check
```

Expected: the focused test passes, all repository tests pass, and
`git diff --check` exits successfully.

- [ ] **Step 5: Verify the local browser behavior**

Reload `registration.html`, return to the top of the page, click the top
**Registration** link, and confirm the `registration-options` panel containing
**How would you like to join?** is in view.

- [ ] **Step 6: Commit and publish**

Stage only the plan, test, and Registration page:

```bash
git add docs/superpowers/plans/2026-07-28-registration-navigation-anchor.md \
  tests/navigation-hero-consistency.test.js registration.html
git commit -m "Improve registration navigation"
git push
```
