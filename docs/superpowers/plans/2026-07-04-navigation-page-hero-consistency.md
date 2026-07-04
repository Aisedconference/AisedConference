# Navigation and Page Hero Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display `Registration` in every site header and retain one original dark-green shared hero panel across every inner page.

**Architecture:** Keep the existing static HTML structure and shared stylesheet. Add one focused Node test that reads all HTML pages and `styles.css`, then make the smallest shared text and gradient changes necessary to satisfy it.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner.

---

### Task 1: Add navigation and hero consistency coverage

**Files:**
- Create: `tests/navigation-hero-consistency.test.js`

- [ ] **Step 1: Write the failing tests**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = [
  "index.html",
  "committee.html",
  "programme.html",
  "speakers.html",
  "registration.html",
  "submission.html",
  "partners.html",
  "venue.html",
];
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("labels every registration navigation link consistently", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.match(html, /<a href="registration\.html">Registration<\/a>/, page);
    assert.doesNotMatch(html, /<a href="registration\.html">Register<\/a>/, page);
  }
});

test("retains the shared original dark-green inner-page hero gradient", () => {
  assert.match(
    css,
    /\.page-hero\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*rgba\(31, 52, 40, 0\.96\),\s*rgba\(36, 88, 58, 0\.94\)\);/s
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test tests/navigation-hero-consistency.test.js`

Expected: the navigation-label test fails because the headers still say `Register`; the hero test passes because the original dark-green gradient is already present.

- [ ] **Step 3: Commit the regression test**

```bash
git add tests/navigation-hero-consistency.test.js
git commit -m "test: cover shared navigation and hero styling"
```

### Task 2: Apply the shared navigation change and retain the hero treatment

**Files:**
- Modify: `index.html`
- Modify: `committee.html`
- Modify: `programme.html`
- Modify: `speakers.html`
- Modify: `registration.html`
- Modify: `submission.html`
- Modify: `partners.html`
- Modify: `venue.html`
- Modify: `styles.css:1917-1922`
- Test: `tests/navigation-hero-consistency.test.js`

- [ ] **Step 1: Change the shared navigation label in every page**

Replace this exact link in each listed HTML file:

```html
<a href="registration.html">Register</a>
```

with:

```html
<a href="registration.html">Registration</a>
```

- [ ] **Step 2: Retain the single shared hero gradient**

Use the following declaration in `.page-hero` while preserving every other rule:

```css
background: linear-gradient(135deg, rgba(31, 52, 40, 0.96), rgba(36, 88, 58, 0.94));
```

- [ ] **Step 3: Run the focused test and verify it passes**

Run: `node --test tests/navigation-hero-consistency.test.js`

Expected: 2 tests pass, 0 fail.

- [ ] **Step 4: Run the complete test suite**

Run: `node --test tests/*.test.js`

Expected: all tests pass, 0 fail.

- [ ] **Step 5: Verify representative pages in the local browser**

Open `committee.html`, `registration.html`, and `programme.html` through the local server. Confirm the header label reads `Registration`, all three heroes use the same original dark-green gradient, white text remains readable, and the watermark remains subordinate at desktop and mobile widths.

- [ ] **Step 6: Commit the implementation**

```bash
git add index.html committee.html programme.html speakers.html registration.html submission.html partners.html venue.html styles.css
git commit -m "style: align registration navigation and page heroes"
```
