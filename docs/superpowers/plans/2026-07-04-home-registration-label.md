# Home Registration Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the homepage primary action label from `Registration Portal` to `Registration` and publish it.

**Architecture:** Update only the static homepage link text. Protect the requested wording with the existing homepage Node test suite, then push the verified main branch and confirm the deployed page.

**Tech Stack:** Static HTML, Node.js built-in test runner, GitHub Pages.

---

### Task 1: Change and publish the homepage label

**Files:**
- Modify: `tests/homepage-layout.test.js`
- Modify: `index.html:40`

- [ ] **Step 1: Add the failing test**

```js
test("uses the concise registration hero action label", () => {
  assert.match(html, /<a class="primary-button" href="registration\.html">Registration<\/a>/);
  assert.doesNotMatch(html, />Registration Portal<\/a>/);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/homepage-layout.test.js`

Expected: FAIL because the current label is `Registration Portal`.

- [ ] **Step 3: Update the homepage**

```html
<a class="primary-button" href="registration.html">Registration</a>
```

- [ ] **Step 4: Verify focused and full tests**

Run: `node --test tests/homepage-layout.test.js`

Expected: all homepage tests pass.

Run: `node --test tests/*.test.js`

Expected: all site tests pass with zero failures.

- [ ] **Step 5: Commit, push, and verify deployment**

```bash
git add index.html tests/homepage-layout.test.js
git commit -m "fix: simplify homepage registration label"
git push origin main
```

Confirm the deployed homepage contains the new `Registration` primary action label.
