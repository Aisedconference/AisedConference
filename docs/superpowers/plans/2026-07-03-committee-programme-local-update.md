# Committee and Programme Local Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the local committee roster and organisation wording, then replace the conference programme matrix with exact day-by-day schedules.

**Architecture:** Keep the existing static HTML/CSS structure and reusable committee card classes. Add two local portrait assets, extend the existing committee test, create a focused programme content test, and introduce day-schedule CSS that remains readable on desktop and mobile.

**Tech Stack:** Static HTML5, CSS, Node.js built-in test runner.

---

### Task 1: Lock the committee requirements in tests

**Files:**
- Modify: `tests/committee-option-b.test.js`

- [ ] **Step 1: Write failing committee assertions**

Update the roster count from 19 to 21, add `Assoc Prof Dr Swa Lee Lee` and `Dr Sanura Jaya`, require their exact roles and image paths, require Philip Lim's expanded role, require full `Asia e University` wording for existing AeU organisation references, and preserve the six existing Committee Members names.

```js
assert.equal((html.match(/class="committee-profile-card"/g) || []).length, 21);
assert.match(html, /<strong>Assoc Prof Dr Swa Lee Lee<\/strong><p>Director, School of Graduate Studies, Asia e University<\/p>/);
assert.match(html, /<strong>Dr Sanura Jaya<\/strong><p>Visiting Assoc\. Professor, Asia e University<\/p>/);
assert.match(html, /<strong>Philip Lim<\/strong><p>Head, School of Professional and Executive Education Development, Asia e University \(AeU-SPEED\)\.<\/p>/);
assert.doesNotMatch(html, /(?:Founder President|Vice Chancellor|Management Unit), AeU<\/p>/);
```

- [ ] **Step 2: Run the committee test and verify RED**

Run:

```bash
/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/committee-option-b.test.js
```

Expected: FAIL because the two members, expanded role text, and new assets are absent.

### Task 2: Implement the committee roster and organisation wording

**Files:**
- Modify: `committee.html`
- Create: `assets/Committee/Assoc Prof Dr Swa Lee Lee.png`
- Create: `assets/Committee/Dr Sanura Jaya.png`
- Test: `tests/committee-option-b.test.js`

- [ ] **Step 1: Copy the supplied portraits**

Copy:

```text
/Users/AdamP/Downloads/Assoc Prof Dr Swa Lee Lee.png
  -> assets/Committee/Assoc Prof Dr Swa Lee Lee.png
/Users/AdamP/Downloads/Dr Sanura Jaya.png
  -> assets/Committee/Dr Sanura Jaya.png
```

- [ ] **Step 2: Update organisation wording without changing existing member names or committee headings**

Use these exact role strings:

```text
Founder President, Asia e University
Vice Chancellor, Asia e University
Head, School of Professional and Executive Education Development, Asia e University (AeU-SPEED).
Marketing and Outreach, School of Professional and Executive Education Development, Asia e University (AeU-SPEED)
Business Operations and Programme Management, School of Professional and Executive Education Development, Asia e University (AeU-SPEED)
Partnerships and Client Engagement, School of Professional and Executive Education Development, Asia e University (AeU-SPEED)
Head of Research Innovation Management Unit, Asia e University
```

- [ ] **Step 3: Add the two Academic & Scientific Working Committee cards**

```html
<article class="committee-profile-card"><div class="committee-portrait"><img src="assets/Committee/Assoc Prof Dr Swa Lee Lee.png" alt="Portrait of Assoc Prof Dr Swa Lee Lee"></div><div class="committee-profile-copy"><strong>Assoc Prof Dr Swa Lee Lee</strong><p>Director, School of Graduate Studies, Asia e University</p></div></article>
<article class="committee-profile-card"><div class="committee-portrait"><img src="assets/Committee/Dr Sanura Jaya.png" alt="Portrait of Dr Sanura Jaya"></div><div class="committee-profile-copy"><strong>Dr Sanura Jaya</strong><p>Visiting Assoc. Professor, Asia e University</p></div></article>
```

- [ ] **Step 4: Run the committee test and verify GREEN**

Run the Task 1 command. Expected: PASS.

### Task 3: Lock the exact programme in tests

**Files:**
- Create: `tests/programme-schedule.test.js`

- [ ] **Step 1: Write the schedule test**

The test must assert:

```js
assert.match(html, /class="day-schedule"/);
assert.equal((html.match(/class="programme-day"/g) || []).length, 3);
assert.doesNotMatch(html, /<table class="programme-matrix"/);
assert.doesNotMatch(html, /<ul>|<li>/);
for (const label of ["Keynote Session 1", "Keynote Session 2", "Keynote Session 3", "Forum 1", "Forum 2", "Forum 3", "Forum 4"]) {
  assert.ok(html.includes(`<strong>${label}:</strong>`));
}
```

It must also assert all three dates and every supplied start/end time, including `08.00 a.m. – 09.00 a.m.`, `09. 00 a.m. – 09.45 a.m.`, and `19:00 p.m. – 22:00 p.m.`.

- [ ] **Step 2: Run the programme test and verify RED**

Run:

```bash
/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/programme-schedule.test.js
```

Expected: FAIL because the current page still uses the coarse matrix and bullet lists.

### Task 4: Build the exact day-by-day programme

**Files:**
- Modify: `programme.html`
- Modify: `styles.css`
- Test: `tests/programme-schedule.test.js`

- [ ] **Step 1: Replace the programme matrix with three day sections**

Each section uses:

```html
<section class="programme-day" aria-labelledby="day-N-heading">
  <header class="programme-day-heading">
    <p>Day N</p>
    <h2 id="day-N-heading">DATE</h2>
  </header>
  <div class="day-schedule">...</div>
</section>
```

Each row uses `<div class="schedule-row"><time>TIME</time><div class="schedule-item">ITEM</div></div>`. Keynotes and forums use `<strong>Session label:</strong><span>Title</span>` with no list markup.

Day 1 rows: 08.00–09.00 Registration & Networking Breakfast / Arrival of VIPs and Guests; 09.00–09.10 Welcome Address; 09.10–09.30 Opening Address; 09.30–09.40 Opening Ceremony; 09.40–10.00 Group Photograph; 10.00–10.30 Coffee Break; 10.30–11.15 Keynote 1; 11.15–12.00 Keynote 2; 12.00–14.00 Lunch; 14.00–15.15 Forum 1; 15.15–15.45 Coffee Break; 15.45–17.00 Forum 2; 17.00–17.30 Closing Remarks.

Day 2 rows: 08.30–09.00 Registration; 09.00–09.45 Keynote 3; 09.45–11.00 Forum 3; 11.00–11.15 Coffee Break; 11.15–12.45 Parallel 1; 12.45–14.00 Lunch; 14.00–15.30 Parallel 2; 15.30–15.45 Coffee Break; 15.45–17.15 Parallel 3; 17.15–17.30 Closing Remarks.

Day 3 rows: 08:30–09.00 Registration; 09:00–10:15 Forum 4; 10:15–10:45 Coffee Break; 10:45–12:00 Roundtable; 12:00–12:45 MoU; 12:45–14:00 Lunch; 14:00–16:00 Networking; 16:00–17:00 Closing; 19:00–22:00 Gala Dinner.

- [ ] **Step 2: Add responsive schedule styling**

```css
.programme-days { display: grid; gap: 34px; }
.programme-day { overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: var(--panel); box-shadow: var(--shadow); }
.programme-day-heading { padding: 22px 24px; color: #fff; background: var(--blue-dark); }
.day-schedule { display: grid; }
.schedule-row { display: grid; grid-template-columns: minmax(190px, 250px) minmax(0, 1fr); border-top: 1px solid var(--line); }
.schedule-row time, .schedule-item { padding: 17px 20px; }
.schedule-item strong, .schedule-item span { display: block; }
@media (max-width: 640px) { .schedule-row { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Run the programme test and verify GREEN**

Run the Task 3 command. Expected: PASS.

### Task 5: Full verification

**Files:**
- Verify: `committee.html`
- Verify: `programme.html`
- Verify: `styles.css`

- [ ] **Step 1: Run the complete test suite**

```bash
/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.js
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Check the diff**

```bash
git diff --check
git status --short
```

Expected: only the approved committee, programme, style, test, portrait, spec, and plan files are changed; unrelated untracked files remain untouched.

- [ ] **Step 3: Verify both rendered local pages**

Open `http://127.0.0.1:8765/committee.html` and `http://127.0.0.1:8765/programme.html`. Confirm portrait loading, centred four-card wrapping, exact role text, chronological schedule order, no bullets, responsive stacking, and no browser console warnings.

- [ ] **Step 4: Commit locally without pushing**

```bash
git add committee.html programme.html styles.css tests/committee-option-b.test.js tests/programme-schedule.test.js "assets/Committee/Assoc Prof Dr Swa Lee Lee.png" "assets/Committee/Dr Sanura Jaya.png" docs/superpowers/plans/2026-07-03-committee-programme-local-update.md
git commit -m "Update committee roster and conference schedule"
```

Expected: local commit created; no GitHub push.
