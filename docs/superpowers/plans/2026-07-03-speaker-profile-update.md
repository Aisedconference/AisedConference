# Speaker Profile Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the local speaker profile to four consistently formatted cards and shorten three committee organisation labels to plain `AeU-SPEED`.

**Architecture:** Reuse the current static HTML card structure and responsive CSS. Extend the existing Node tests to validate exact content and local image availability before modifying the HTML.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner.

---

### Task 1: Add failing speaker-profile coverage

**Files:**
- Modify: `tests/speaker-portraits.test.js`

- [ ] **Step 1: Add exact assertions**

Add expected records for Steve Cheah, Nik Maheran, Ansary Ahmed, and Ts. Zehan Teoh with their badge, name, role, image path, alt text, and asset existence.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/speaker-portraits.test.js`
Expected: FAIL because Ansary Ahmed, Ts. Zehan Teoh, and the role lines are absent.

### Task 2: Implement the four-card speaker grid

**Files:**
- Modify: `speakers.html`
- Create: `assets/ts-zehan-teoh-speaker.png`

- [ ] **Step 1: Copy the supplied portrait**

Copy `/Users/AdamP/Desktop/Ts.Zehan Teoh.png` to `assets/ts-zehan-teoh-speaker.png` without altering the source file.

- [ ] **Step 2: Update the HTML**

Retain the current two cards, add their requested role paragraphs, and add matching cards for Ansary Ahmed and Ts. Zehan Teoh. Reuse `assets/Committee/Prof Dato' Dr Ansary Ahmed.png` for Ansary Ahmed.

- [ ] **Step 3: Run the focused test and confirm success**

Run: `node --test tests/speaker-portraits.test.js`
Expected: all speaker portrait tests PASS.

### Task 3: Shorten selected AeU-SPEED labels

**Files:**
- Modify: `committee.html`
- Modify: `tests/committee-option-b.test.js`

- [ ] **Step 1: Update the test expectations**

Require the exact strings `Marketing and Outreach, AeU-SPEED`, `Business Operations and Programme Management, AeU-SPEED`, and `Partnerships and Client Engagement, AeU-SPEED`.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `node --test tests/committee-option-b.test.js`
Expected: FAIL against the current expanded organisation text.

- [ ] **Step 3: Update only the three selected role lines**

Preserve the three job titles and replace only their organisation suffix with plain `AeU-SPEED`.

- [ ] **Step 4: Run the focused test and confirm success**

Run: `node --test tests/committee-option-b.test.js`
Expected: all committee tests PASS.

### Task 4: Verify locally

**Files:**
- Verify: `speakers.html`
- Verify: `committee.html`
- Verify: `programme.html`

- [ ] **Step 1: Run the complete test suite**

Run: `node --test tests/*.test.js`
Expected: all tests PASS with zero failures.

- [ ] **Step 2: Check the patch**

Run: `git diff --check`
Expected: no whitespace errors.

- [ ] **Step 3: Inspect the rendered pages**

Open the local pages in the in-app browser, confirm all four speaker images load, verify the speaker and committee text, inspect responsive card alignment, and confirm no browser console errors.

- [ ] **Step 4: Commit locally without publishing**

Stage only the intended committee, programme, speaker, test, image, and current plan files. Commit as `Update committee, programme, and speaker profiles`. Do not push.
