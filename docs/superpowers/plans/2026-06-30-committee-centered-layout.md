# Committee Centered Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center every committee section title and display consistent card rows with four cards on desktop, two on tablet, one on mobile, and centered incomplete rows.

**Architecture:** Keep the existing HTML and card components unchanged. Replace the adaptive card grid with a wrapping flex container whose card widths change at two responsive breakpoints; `justify-content: center` centers every complete or incomplete row without roster-specific rules.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner

---

### Task 1: Add layout regression coverage

**Files:**
- Modify: `tests/committee-option-b.test.js:66-77`
- Test: `tests/committee-option-b.test.js`

- [ ] **Step 1: Write the failing title and card-layout tests**

Replace the existing adaptive-column test with assertions that require centered titles, a wrapping flex container, four-card desktop widths, two-card tablet widths, and one-card mobile widths:

```js
test("centers committee titles and consistent card rows", () => {
  assert.match(
    css,
    /\.committee-group-title\s*\{[^}]*text-align:\s*center/s
  );
  assert.match(
    css,
    /\.committee-profile-grid\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center/s
  );
  assert.match(
    css,
    /\.committee-profile-card\s*\{[^}]*flex:\s*0 1 calc\(\(100% - 54px\) \/ 4\);[^}]*max-width:\s*260px/s
  );
  assert.match(
    css,
    /@media \(max-width:\s*1100px\)[\s\S]*?\.committee-profile-card\s*\{[^}]*flex-basis:\s*calc\(\(100% - 18px\) \/ 2\)/
  );
  assert.match(
    css,
    /@media \(max-width:\s*640px\)[\s\S]*?\.committee-profile-card\s*\{[^}]*flex-basis:\s*100%/
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/committee-option-b.test.js`

Expected: FAIL because the current stylesheet uses CSS Grid and does not center `.committee-group-title`.

### Task 2: Implement centered responsive rows

**Files:**
- Modify: `styles.css:952-980`
- Modify: `styles.css:2082-2098`
- Test: `tests/committee-option-b.test.js`

- [ ] **Step 1: Center section titles and replace the grid with wrapping flexbox**

Add `text-align: center` to `.committee-group-title`, replace `.committee-profile-grid` with:

```css
.committee-profile-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: stretch;
  justify-content: center;
}
```

Add these declarations to `.committee-profile-card`:

```css
flex: 0 1 calc((100% - 54px) / 4);
max-width: 260px;
```

- [ ] **Step 2: Add tablet and mobile card widths**

Add the tablet rule before the existing mobile rule:

```css
@media (max-width: 1100px) {
  .committee-profile-card {
    flex-basis: calc((100% - 18px) / 2);
  }
}
```

In the existing `@media (max-width: 640px)` block, remove the obsolete grid-column declaration and add `flex-basis: 100%` to `.committee-profile-card`.

- [ ] **Step 3: Run the regression suites**

Run: `node --test tests/committee-option-b.test.js tests/speaker-portraits.test.js`

Expected: 12 tests pass and 0 fail.

- [ ] **Step 4: Check the patch for formatting errors**

Run: `git diff --check`

Expected: no output and exit status 0.

### Task 3: Verify the rendered page

**Files:**
- Verify: `committee.html`
- Verify: `styles.css`

- [ ] **Step 1: Open the local committee page at desktop width**

Open `http://127.0.0.1:8765/committee.html` and confirm each section title is centered.

- [ ] **Step 2: Measure card rows**

Confirm Conference Leadership renders four cards on its first row and two cards on its second row, with both rows sharing the same horizontal centerline. Confirm one-card and three-card groups are also centered.

- [ ] **Step 3: Check browser diagnostics**

Inspect browser warnings and errors.

Expected: no new warnings or errors from the layout change.

- [ ] **Step 4: Commit the implementation**

```bash
git add styles.css tests/committee-option-b.test.js docs/superpowers/plans/2026-06-30-committee-centered-layout.md
git commit -m "Center committee card rows"
```

