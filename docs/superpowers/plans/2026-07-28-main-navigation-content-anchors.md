# Main Navigation Content Anchors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every main header destination link land on the first useful content section, except the Programme parent button, which remains a dropdown trigger.

**Architecture:** Use native URL fragments and semantic section IDs in the existing static HTML. Apply one shared link map to every page header and extend the existing Node regression test to verify both the links and their targets.

**Tech Stack:** Static HTML, Node.js built-in test runner, CommonJS

## Global Constraints

- The Programme parent remains a `<button>` and receives no destination URL.
- Footer links, content calls to action, the logo, and “Back to Main Page” links remain unchanged.
- No JavaScript scrolling behavior is added.
- Preserve unrelated local modifications.

---

### Task 1: Add navigation contract regression coverage

**Files:**
- Modify: `tests/navigation-hero-consistency.test.js`

**Interfaces:**
- Consumes: The eight HTML filenames already listed in the `pages` array.
- Produces: A regression contract for the shared header URLs, Programme button, and destination IDs.

- [ ] **Step 1: Write the failing tests**

Replace the old registration-only navigation checks with:

```js
const headerDestinations = [
  ["Home", "index.html#conference-overview"],
  ["Paper Submission", "submission.html#submission-guidelines"],
  ["Conference Schedule", "programme.html#conference-agenda"],
  ["Speakers", "speakers.html#featured-speakers"],
  ["Conference Leadership", "committee.html#conference-leadership"],
  ["Registration", "registration.html#registration-options"],
];

test("links every main header destination to its first content section", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    const nav = html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1] || "";

    for (const [label, href] of headerDestinations) {
      assert.match(nav, new RegExp(`<a href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">${label}<\\/a>`), `${page}: ${label}`);
    }

    assert.match(nav, /<button class="nav-parent" type="button" aria-haspopup="true">Programme<\/button>/, page);
  }
});

test("defines every main header fragment target exactly once", () => {
  for (const [, href] of headerDestinations) {
    const [filename, fragment] = href.split("#");
    const html = fs.readFileSync(path.join(root, filename), "utf8");
    const matches = html.match(new RegExp(`\\bid="${fragment}"`, "g")) || [];
    assert.equal(matches.length, 1, href);
  }
});
```

Keep the assertion that `registration-options` labels the “How would you like to join?” panel.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/navigation-hero-consistency.test.js`

Expected: FAIL because the shared fragment links and four new destination IDs are missing.

### Task 2: Add content anchors and update every main header

**Files:**
- Modify: `index.html`
- Modify: `submission.html`
- Modify: `programme.html`
- Modify: `speakers.html`
- Modify: `committee.html`
- Modify: `registration.html`
- Modify: `partners.html`
- Modify: `venue.html`

**Interfaces:**
- Consumes: The exact destination map asserted by Task 1.
- Produces: Native browser fragment navigation to each first useful content section.

- [ ] **Step 1: Add the four missing section IDs**

Apply:

```html
<section class="section alt" id="conference-overview">
<section class="section alt programme-tab-section" id="conference-agenda">
<section class="section alt" id="featured-speakers">
<section class="section committee-section" id="conference-leadership">
```

Keep the existing `submission-guidelines` and `registration-options` IDs.

- [ ] **Step 2: Update the header links on all eight pages**

Use this exact header destination map:

```html
<a href="index.html#conference-overview">Home</a>
<a href="submission.html#submission-guidelines">Paper Submission</a>
<button class="nav-parent" type="button" aria-haspopup="true">Programme</button>
<a href="programme.html#conference-agenda">Conference Schedule</a>
<a href="speakers.html#featured-speakers">Speakers</a>
<a href="committee.html#conference-leadership">Conference Leadership</a>
<a href="registration.html#registration-options">Registration</a>
```

- [ ] **Step 3: Run the focused test to verify it passes**

Run: `node --test tests/navigation-hero-consistency.test.js`

Expected: PASS.

- [ ] **Step 4: Run the complete test suite**

Run: `node --test tests/*.test.js`

Expected: All tests pass with zero failures.

- [ ] **Step 5: Check formatting and scope**

Run:

```bash
git diff --check
git diff -- index.html submission.html programme.html speakers.html committee.html registration.html partners.html venue.html tests/navigation-hero-consistency.test.js
```

Expected: No whitespace errors; the diff contains only the navigation contract, header URLs, and destination IDs.

- [ ] **Step 6: Commit**

```bash
git add index.html submission.html programme.html speakers.html committee.html registration.html partners.html venue.html tests/navigation-hero-consistency.test.js docs/superpowers/plans/2026-07-28-main-navigation-content-anchors.md
git commit -m "Improve main navigation anchors"
```
