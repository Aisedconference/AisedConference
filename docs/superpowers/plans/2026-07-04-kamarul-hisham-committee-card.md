# Kamarul Hisham Baginda Committee Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Kamarul Hisham Baginda as the third Committee Members profile card with the supplied portrait and role.

**Architecture:** Extend the existing static committee-card markup without changing its component styling. Copy the supplied portrait into the existing Committee asset folder and protect the new card order and content with the Node test suite.

**Tech Stack:** Static HTML, local image asset, Node.js built-in test runner.

---

### Task 1: Add failing card-order coverage

**Files:**
- Modify: `tests/committee-option-b.test.js`

- [ ] **Step 1: Add a focused test**

```js
test("places Kamarul Hisham Baginda in the third Committee Members card", () => {
  const group = html.match(/<section class="committee-group" aria-labelledby="committee-members-heading">([\s\S]*?)<\/section>/)?.[1] || "";
  const cards = [...group.matchAll(/<article class="committee-profile-card">([\s\S]*?)<\/article>/g)].map((match) => match[1]);

  assert.equal(cards.length, 7);
  assert.match(cards[2], /assets\/Committee\/Kamarul Hisham Baginda\.jpg/);
  assert.match(cards[2], /<strong>Kamarul Hisham Baginda<\/strong>/);
  assert.match(cards[2], /<p>Adjunct\. Professor of Asia e University &amp; Senior Postdoctoral Fellow, Chartered Management Institute<\/p>/);
  assert.ok(fs.existsSync(path.join(root, "assets", "Committee", "Kamarul Hisham Baginda.jpg")));
});
```

Update the existing directory-card count from `21` to `22`.

- [ ] **Step 2: Verify the focused test fails**

Run: `node --test tests/committee-option-b.test.js`

Expected: FAIL because the new third card and asset do not yet exist.

### Task 2: Add the portrait and third card

**Files:**
- Create: `assets/Committee/Kamarul Hisham Baginda.jpg`
- Modify: `committee.html:83-93`
- Test: `tests/committee-option-b.test.js`

- [ ] **Step 1: Copy the supplied portrait**

Copy `/Users/AdamP/Downloads/⁠Kamarul Hisham Baginda.jpg` to `assets/Committee/Kamarul Hisham Baginda.jpg` without image transformation.

- [ ] **Step 2: Insert the new third card**

```html
<article class="committee-profile-card"><div class="committee-portrait"><img src="assets/Committee/Kamarul Hisham Baginda.jpg" alt="Portrait of Kamarul Hisham Baginda"></div><div class="committee-profile-copy"><strong>Kamarul Hisham Baginda</strong><p>Adjunct. Professor of Asia e University &amp; Senior Postdoctoral Fellow, Chartered Management Institute</p></div></article>
```

Insert it after Juliana Shaharudin and before Mohd Fadzil Khairuddin.

- [ ] **Step 3: Run focused and full tests**

Run: `node --test tests/committee-option-b.test.js`

Expected: all committee tests pass.

Run: `node --test tests/*.test.js`

Expected: all site tests pass with zero failures.

- [ ] **Step 4: Commit the change**

```bash
git add committee.html tests/committee-option-b.test.js "assets/Committee/Kamarul Hisham Baginda.jpg"
git commit -m "feat: add Kamarul Hisham committee profile"
```
