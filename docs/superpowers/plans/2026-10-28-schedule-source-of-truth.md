# Schedule Source-of-Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the published conference programme, agenda-linked speaker profiles, and homepage highlights with the schedule updated 27 October 2026.

**Architecture:** Keep `programme/index.html` as the canonical agenda and mirror its speaker assignments and anchors in `speakers/index.html`. Use compact, non-conflicting content on the homepage. Preserve the existing static HTML and Node test approach, adding only the supplied portrait assets.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-28-schedule-source-of-truth-design.md`

## Global Constraints

- The 27 October 2026 schedule PDF is the authoritative programme source.
- Use standardised title punctuation (`Prof.`, `Dr.`, `Dato’`, `Y.B.`, `H.E.`, `Ts.`).
- Do not modify unrelated user changes in `submission/index.html` or `nav-deploy.8dK4SP/`.
- Publish the completed static-site update to the existing `gh-pages` branch.

## Review Focus

- Day 1 timeline must have no remaining entries from the superseded schedule.
- Speaker cards must link to existing programme anchors and display the same timing as the agenda.
- Unlisted profiles and the gala dinner must not remain in the published routes.
- Supplied portrait files must be locally served and have descriptive alt text.
- Homepage highlights must not contradict the canonical programme.

---

### Task 1: Update and test the canonical programme

**Files:**
- Modify: `programme/index.html:54-110`
- Modify: `tests/programme-schedule.test.js:18-58`

**Interfaces:**
- Consumes: Schedule time, title, and speaker data from the approved design.
- Produces: Stable agenda anchors for `speakers/index.html` and canonical wording for homepage highlights.

- [ ] **Step 1: Write failing assertions for the 27 October Day 1–3 timing and removal requirements**

  Assert the revised Day 1 times, official opening luncheon, prayer break, named keynote speakers, and absence of the gala dinner.

- [ ] **Step 2: Run the programme test to verify it fails**

  Run: `node --test tests/programme-schedule.test.js`
  Expected: FAIL because the superseded Day 1 timetable and gala dinner are still present.

- [ ] **Step 3: Replace the public timetable content in `programme/index.html`**

  Preserve tab and anchor structure while matching the updated schedule exactly and applying title punctuation standards.

- [ ] **Step 4: Run the programme test to verify it passes**

  Run: `node --test tests/programme-schedule.test.js`
  Expected: PASS.

### Task 2: Align Speaker Directory profiles and portrait assets

**Files:**
- Create: `assets/yb-tuan-akmal-nasrullah-mohd-nasir.png`
- Create: `assets/maki-katsuno-hayashikawa.jpeg`
- Modify: `speakers/index.html:92-330`
- Modify: `tests/speaker-portraits.test.js:9-220`

**Interfaces:**
- Consumes: Canonical programme anchors and schedule speaker assignments from Task 1.
- Produces: Agenda-linked keynote and forum profile cards with local portrait assets.

- [ ] **Step 1: Write failing speaker directory assertions**

  Assert both new keynote names, portraits, linked session dates, removal of Tan Sri Abd. Rahman Mamat and Dato’ Dr. Ahmad Faisal Muhammad, and updated Forum 1 and 2 timings.

- [ ] **Step 2: Run the speaker test to verify it fails**

  Run: `node --test tests/speaker-portraits.test.js`
  Expected: FAIL because the new keynote cards and local assets do not yet exist and removed names remain.

- [ ] **Step 3: Add supplied portraits and update `speakers/index.html`**

  Copy both supplied files as local assets. Replace the removed keynote card with Y.B. Tuan Akmal Nasrullah Mohd Nasir and add Maki Katsuno-Hayashikawa as Keynote Session 4. Remove Dato’ Dr. Ahmad Faisal Muhammad from Forum 1 and align agenda-linked timings.

- [ ] **Step 4: Run the speaker test to verify it passes**

  Run: `node --test tests/speaker-portraits.test.js`
  Expected: PASS.

### Task 3: Align homepage highlights and verify the published source set

**Files:**
- Modify: `home/index.html:80-98`
- Modify: `tests/homepage-layout.test.js`
- Test: `tests/programme-schedule.test.js`, `tests/speaker-portraits.test.js`, `tests/homepage-layout.test.js`

**Interfaces:**
- Consumes: Canonical programme wording from Task 1.
- Produces: Homepage highlights that summarise but do not contradict the schedule.

- [ ] **Step 1: Write a failing homepage assertion for the revised Day 1 and Day 3 highlight wording**

  Assert no gala dinner reference and that Day 1 reflects keynote, forum, and official opening luncheon while Day 3 ends with closing and resolutions.

- [ ] **Step 2: Run the homepage layout test to verify it fails**

  Run: `node --test tests/homepage-layout.test.js`
  Expected: FAIL because the highlights use superseded opening wording.

- [ ] **Step 3: Update the compact homepage highlight copy**

  Keep the current layout; change only content necessary to match the agenda.

- [ ] **Step 4: Run focused checks and a full test sweep**

  Run: `node --test tests/programme-schedule.test.js tests/speaker-portraits.test.js tests/homepage-layout.test.js && node --test tests/*.{js,mjs}`
  Expected: Focused checks pass; any pre-existing unrelated full-suite failures are recorded explicitly.

- [ ] **Step 5: Commit and publish**

  Commit only the programme, speaker, homepage, test, documentation, and added portrait files; then push `gh-pages`.
