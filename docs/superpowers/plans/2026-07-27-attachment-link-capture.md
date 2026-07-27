# Exact Attachment Link Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guarantee that exact uploaded Drive file URLs are clickable in the master spreadsheet and safely repair historical call-for-papers links that were written into the wrong column.

**Architecture:** Keep the current `file.getUrl()` upload contract and header-based row writer for future submissions. Add a bounded Apps Script migration that joins Call for Papers to Master Registrations by Registration ID, copies only authoritative attachment URLs, and clears only the identical misplaced URL from Submit to SCOPUS.

**Tech Stack:** Browser JavaScript, Google Apps Script, Google Drive, Google Sheets, Node.js `node:test`.

## Global Constraints

- Store the unmodified HTTPS URL returned by `file.getUrl()`.
- Match historical rows by `Registration ID`, never by row position.
- Never overwrite `Yes`, `No`, non-URL text, or unrelated spreadsheet cells.
- Do not infer a link when the Call for Papers attachment cell is blank.
- Existing files must not be renamed, moved, reshared, or deleted during repair.

---

### Task 1: Regression coverage for exact attachment URLs and historical repair

**Files:**
- Modify: `tests/call-papers-registration.test.js`
- Test: `tests/call-papers-registration.test.js`

**Interfaces:**
- Consumes: Apps Script `repairLegacyCallPaperAttachmentLinks()`.
- Produces: A test fixture proving exact URLs are copied by Registration ID and genuine SCOPUS answers remain unchanged.

- [ ] **Step 1: Export the repair function through the existing VM test harness**

Add `repairLegacyCallPaperAttachmentLinks` to `globalThis.__backend`.

- [ ] **Step 2: Write the failing test**

Create fake Master Registrations and Call for Papers sheets containing:

```js
const exactUrl = "https://drive.google.com/file/d/exact-file-id/view?usp=drivesdk";
const masterRows = [
  ["Registration ID", "Submit to SCOPUS", "Paper Attachment Link"],
  ["REG-OLD-1", exactUrl, ""],
  ["REG-KEEP-YES", "Yes", ""]
];
const callPaperRows = [
  ["Registration ID", "Submit to SCOPUS", "Paper Attachment Link"],
  ["REG-OLD-1", "", exactUrl],
  ["REG-KEEP-YES", "Yes", ""]
];
```

Invoke the real migration and assert:

```js
assert.equal(masterRows[1][2], exactUrl);
assert.equal(masterRows[1][1], "");
assert.equal(masterRows[2][1], "Yes");
assert.deepEqual(result, { repairedCount: 1, clearedMisplacedCount: 1 });
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  --test tests/call-papers-registration.test.js
```

Expected: FAIL because `repairLegacyCallPaperAttachmentLinks` does not exist.

---

### Task 2: Implement the bounded Apps Script repair

**Files:**
- Modify: `apps-script/registration-webapp.gs`
- Test: `tests/call-papers-registration.test.js`

**Interfaces:**
- Consumes: `AISED.spreadsheetId`, Master Registrations, Call for Papers.
- Produces: `repairLegacyCallPaperAttachmentLinks(): {repairedCount: number, clearedMisplacedCount: number}`.

- [ ] **Step 1: Add URL and header lookup helpers**

Implement:

```js
function isHttpsUrl(value) {
  return /^https:\/\//i.test(String(value || '').trim());
}

function headerIndex(headers, name) {
  const index = headers.indexOf(name);
  if (index < 0) throw new Error(`Missing required sheet header: ${name}`);
  return index;
}
```

- [ ] **Step 2: Implement the repair**

The function must:

1. Open the configured spreadsheet.
2. Read both tabs with `getDataRange().getValues()`.
3. Build an attachment URL map keyed by Call for Papers Registration ID.
4. For each master row with a mapped HTTPS URL:
   - write it to Paper Attachment Link only when different;
   - clear Submit to SCOPUS only when it equals the same HTTPS URL.
5. Return exact repair counters.

- [ ] **Step 3: Run the focused test and verify GREEN**

Run the Task 1 command.

Expected: all call-for-papers backend tests PASS.

- [ ] **Step 4: Run the entire test suite**

Run:

```bash
/Users/AdamP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  --test tests/*.test.js
```

Expected: all tests PASS with no warnings.

- [ ] **Step 5: Commit the implementation**

```bash
git add apps-script/registration-webapp.gs tests/call-papers-registration.test.js
git commit -m "Repair exact attachment links in master sheet"
```

---

### Task 3: Deploy, repair, and verify production

**Files:**
- Deploy: `apps-script/registration-webapp.gs`
- Update: Google Apps Script deployment at the existing website endpoint
- Update: Master Registrations attachment cells only

**Interfaces:**
- Consumes: the current Apps Script project and deployment ID used by `config.js`.
- Produces: a new live backend version at the unchanged web-app URL.

- [ ] **Step 1: Replace and save Code.gs**

Replace the Apps Script editor contents with the tested local file and confirm the editor reports no syntax error.

- [ ] **Step 2: Deploy a new version**

Update the active deployment whose URL equals the configured registration endpoint. Keep:

- Execute as: `Me (admin@aisedconference.org)`
- Access: `Anyone`
- Endpoint URL: unchanged

- [ ] **Step 3: Run the historical repair**

Select and run `repairLegacyCallPaperAttachmentLinks`. Authorise only if Google requests the existing spreadsheet and Drive permissions. Confirm the returned execution completes successfully.

- [ ] **Step 4: Verify repaired cells**

Read the Master Registrations Paper Attachment Link cells and confirm:

- each repaired displayed URL exactly equals the Call for Papers source URL;
- hyperlink metadata equals that same URL;
- Submit to SCOPUS contains no attachment URLs;
- genuine `Yes` and `No` values are preserved.

- [ ] **Step 5: Verify a real uploaded file**

Submit one synthetic call-for-papers payload containing a small text attachment. Confirm:

- the backend creates a unique Drive file;
- Master Registrations and Call for Papers contain the identical `file.getUrl()` value;
- both cells expose matching hyperlink metadata.

Remove only the synthetic spreadsheet rows and synthetic Drive file after verification.

- [ ] **Step 6: Push the verified source commit**

```bash
git -C conference_site push
```

Expected: the existing branch is updated without staging unrelated local files.
