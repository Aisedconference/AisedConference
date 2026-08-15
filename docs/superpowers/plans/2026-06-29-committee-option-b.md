# Committee Option B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the committee page to the approved Option B uniform directory and display Tengku Amir Shah's supplied portrait.

**Architecture:** Restructure only the committee page content into labelled groups of reusable profile cards. Add page-specific CSS for a four/two/one-column responsive directory and use a dependency-free Node test to lock down the required HTML and CSS contracts.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner

---

### Task 1: Add the failing committee directory contract

**Files:**
- Create: `tests/committee-option-b.test.js`

- [x] **Step 1: Write tests for the approved design**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "committee.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses Tengku Amir Shah's supplied portrait", () => {
  assert.match(html, /<img[^>]+src="assets\/tengku-amir-shah-profile\.jpg"[^>]+alt="Portrait of Duli Yang Teramat Mulia Tengku Amir Shah"/);
});

test("uses the Option B uniform directory structure", () => {
  assert.match(html, /class="committee-directory"/);
  assert.equal((html.match(/class="committee-profile-card"/g) || []).length, 19);
  assert.equal((html.match(/class="committee-profile-grid"/g) || []).length, 6);
});

test("preserves the current committee roster", () => {
  for (const name of ["Dato’ Steve Cheah", "Pn Sharliza Dato' Shamsuddin", "Assoc Prof Dr Hartini Ahmad"]) {
    assert.ok(html.includes(name), `Missing ${name}`);
  }
});

test("defines desktop and responsive directory columns", () => {
  assert.match(css, /\.committee-profile-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*?\.committee-profile-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.committee-profile-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
});
```

- [x] **Step 2: Run the test and verify it fails for the missing directory**

Run: `node --test tests/committee-option-b.test.js`

Expected: FAIL because `committee-directory`, the portrait markup, and directory CSS do not exist yet.

### Task 2: Implement the uniform directory

**Files:**
- Modify: `committee.html`
- Modify: `styles.css`

- [x] **Step 1: Replace the current hierarchy-specific committee markup**

Create six labelled directory groups. Use `committee-profile-card` for all 19 entries, the supplied image for Tengku Amir Shah, and `committee-initials` placeholders for the remaining entries.

- [x] **Step 2: Add Option B styling**

Define a four-column `.committee-profile-grid`, consistent portrait and card dimensions, restrained initials placeholders, and two-column/one-column responsive rules at 900px and 640px.

- [x] **Step 3: Run the focused tests**

Run: `node --test tests/committee-option-b.test.js`

Expected: 4 tests pass, 0 fail.

### Task 3: Verify the rendered page

**Files:**
- Verify: `committee.html`
- Verify: `styles.css`

- [x] **Step 1: Start the local site**

Run: `npm start`

Expected: local site starts without an error.

- [x] **Step 2: Inspect desktop and mobile layouts**

Open `http://127.0.0.1:3000/committee.html`, verify the portrait loads, the directory uses four columns at desktop width, and verify the responsive layout at 390px.

- [x] **Step 3: Check runtime errors and rerun tests**

Run: `node --test tests/committee-option-b.test.js`

Expected: 4 tests pass, 0 fail, with no missing image or browser console errors.
