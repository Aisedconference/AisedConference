# Academic Participant Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a required academic participant category dropdown above `Title` and keep its visible and submitted totals synchronized at RM700 or RM500.

**Architecture:** `app.js` remains the single source of truth for form rendering and participant fee calculation. The academic dropdown is inserted into `commonFields` before the title field, while obsolete inline form manipulation is removed from `registration.html`.

**Tech Stack:** Static HTML, browser JavaScript, Node.js built-in test runner, Playwright browser verification.

## Global Constraints

- Academician / Educator / Lecturer costs RM700.
- Student / Postgraduate Student costs RM500.
- The dropdown appears immediately before `Title`.
- Existing professional participant fees remain unchanged.
- Visible and hidden submitted totals use the same mapping.

---

### Task 1: Define the dropdown contract with a failing regression test

**Files:**
- Modify: `tests/participant-fees.test.js`

**Interfaces:**
- Consumes: the rendered strings and fee mappings in `app.js`
- Produces: regression assertions for exact copy, placement, pricing, and inline-script cleanup

- [x] **Step 1: Update the regression test**

Assert that `academicParticipantFees` maps `Academician / Educator / Lecturer` to `700` and `Student / Postgraduate Student` to `500`. Assert that the academic select markup precedes `buildSelect("title", "Title"` in `commonFields`, and that `registration.html` does not contain `syncAcademicParticipantForm`.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' --test tests/participant-fees.test.js
```

Expected: FAIL because the current student fee is RM350 and the dropdown is rendered after the common fields.

### Task 2: Render and calculate from one source of truth

**Files:**
- Modify: `app.js`
- Modify: `registration.html`

**Interfaces:**
- Consumes: `registrationState.type` and `academic_participant_category`
- Produces: the visible amount, `estimated_payable_amount`, and `estimated_fee_breakdown`

- [x] **Step 1: Update the fee mapping**

Use:

```js
const academicParticipantFees = {
  "Academician / Educator / Lecturer": 700,
  "Student / Postgraduate Student": 500
};
```

- [x] **Step 2: Move the select before Title**

When `selectedParticipantType === "Academics / Students / Postgraduate Students"`, splice this field into `commonFields` at index `3`:

```html
<label>Participant category
  <select id="participant-registration-type" name="academic_participant_category" required>
    <option value="">Please select</option>
    <option value="Academician / Educator / Lecturer">Academician / Educator / Lecturer</option>
    <option value="Student / Postgraduate Student">Student / Postgraduate Student</option>
  </select>
</label>
```

Keep only delegate notes in `participantFields`.

- [x] **Step 3: Remove the obsolete inline form workaround**

Delete the `syncAcademicParticipantForm` inline script from `registration.html`; retain unrelated participant-card copy.

- [x] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' --test tests/participant-fees.test.js
```

Expected: 1 test passing.

### Task 3: Verify the complete interaction

**Files:**
- Verify: `app.js`
- Verify: `registration.html`

**Interfaces:**
- Consumes: the rendered registration form in Chrome
- Produces: evidence that screen and submission values match

- [x] **Step 1: Check syntax and whitespace**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' --check app.js
git diff --check
```

Expected: both commands exit successfully.

- [x] **Step 2: Run the full test suite**

Run:

```bash
'/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' --test tests/*.test.js
```

Expected: the new academic participant test passes; report the existing unrelated SCOPUS-label assertion separately if it remains.

- [ ] **Step 3: Verify in Chrome**

Open `registration.html`, choose Participants, then Academics / Students / Postgraduate Students. Confirm the category dropdown is above Title. Select both options and verify:

- RM700 visible, `700` submitted.
- RM500 visible, `500` submitted.
