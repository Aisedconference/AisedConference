# Dashboard Version 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or **superpowers:executing-plans** to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a separate local Version 2 dashboard HTML artifact with a collapsible side navigation and isolated Conference Registration, Gala Dinner, and Paper Administration modules, while preserving Version 1 unchanged.

**Architecture:** Keep the existing self-contained build pipeline and backend bridge. Add a Version 2 presentation shell and module-specific view renderers as separate source files, then build Version 2 from the same data/configuration inputs into `dist/AiSED_Registration_Dashboard_Version2.html`. The existing output filenames remain the Version 1/hosted artifacts.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules flattened by the existing Node build script, Node test runner.

## Global Constraints

- Do not overwrite `dist/AiSED_Registration_Dashboard.html`.
- Do not change Apps Script deployment or live Google Sheets data.
- Preserve existing paper workflow behavior and existing dirty files outside the dashboard implementation.
- Conference Registration must exclude Paper Submission rows.
- Gala Dinner must remain independent and may show its existing source-pending state.

---

## Task 1: Lock the Version 2 artifact contract with failing tests

**Files:** `registration_dashboard/tests/build.test.js`, `registration_dashboard/scripts/build.mjs`

- [ ] Add a test for `dist/AiSED_Registration_Dashboard_Version2.html` existence.
- [ ] Assert Version 2 contains the side navigation, three independent view roots, collapsible registration bars, HRDC fields, and the Version 2 marker/title.
- [ ] Assert Version 1 still exists and retains the existing top-tab marker.
- [ ] Run the targeted build tests and confirm the new assertions fail before implementation.

## Task 2: Add the independent Version 2 shell and navigation

**Files:** `registration_dashboard/src/template-version2.html`, `registration_dashboard/src/styles-version2.css`, `registration_dashboard/src/dashboard-version2.js`

- [ ] Create a Version 2 template that keeps the existing build markers for data, core helpers, registration logic, and paper logic.
- [ ] Add a fixed/collapsible left rail with buttons for Conference Registration, Gala Dinner, and Paper Administration.
- [ ] Use hash routes `#conference-registration`, `#gala-dinner`, and `#paper-administration` and ensure only the active module is visible.
- [ ] Keep each module in a separate root container and use module-specific toolbars/actions.
- [ ] Add responsive behavior so the rail becomes a compact slide-over on narrow screens.

## Task 3: Split Conference Registration into independent expandable bars

**Files:** `registration_dashboard/src/conference-registration-view.js`, `registration_dashboard/src/template-version2.html`, `registration_dashboard/src/styles-version2.css`

- [ ] Render only non-paper registrations in the Conference Registration module.
- [ ] Group records into separate expandable sections for Participants, Invited Guests, and Partners.
- [ ] Keep the existing safe registration table fields and payment/follow-up state per group.
- [ ] Add the requested admin action sets by group, including HRDC Corp Employer Code and HRD Corp Claimable Courses for participant rows.
- [ ] Reuse the existing registration email draft/confirmation behavior without sharing mutable state with Gala Dinner or Paper Administration.

## Task 4: Add the independent Gala Dinner module

**Files:** `registration_dashboard/src/gala-dinner-view.js`, `registration_dashboard/src/template-version2.html`, `registration_dashboard/src/styles-version2.css`

- [ ] Render separate expandable bars for Gala Dinner operational categories using the current source-pending data state.
- [ ] Add independent action controls for invitations, reminders, and confirmations.
- [ ] Keep Gala Dinner handlers and DOM selectors namespaced so they cannot mutate Conference Registration or Paper Administration.

## Task 5: Reuse Paper Administration as an isolated Version 2 module

**Files:** `registration_dashboard/src/paper-administration-view.js`, `registration_dashboard/src/template-version2.html`, `registration_dashboard/src/styles-version2.css`

- [ ] Mount the existing Paper Administration markup and `paper-app.js` behavior under the Version 2 Paper Administration root.
- [ ] Preserve its existing expandable/minimize sections, backend bridge, actions, and shared master workbook configuration.
- [ ] Ensure Paper Administration is not rendered as Conference Registration data and does not alter the other modules’ state.

## Task 6: Build Version 2 without changing Version 1

**Files:** `registration_dashboard/scripts/build.mjs`

- [ ] Extend the build script to load the Version 2 template/styles/modules and emit only the new Version 2 filename in addition to existing outputs.
- [ ] Verify the existing Version 1 output is not rewritten by the Version 2 path; if the normal build currently rewrites it, write a separate Version 2 build function that leaves the existing artifact untouched during the Version 2 build command.
- [ ] Add a clearly visible Version 2 title/marker and local-only notice.

## Task 7: Verify and open the new local artifact

**Files:** `registration_dashboard/dist/AiSED_Registration_Dashboard_Version2.html`

- [ ] Run `npm test` and the build command.
- [ ] Confirm both Version 1 and Version 2 files exist, and inspect Version 2 for unresolved markers/external script dependencies.
- [ ] Serve `registration_dashboard/dist` locally and open Version 2 in the in-app browser at the Conference Registration route.
- [ ] Check the three side-rail routes and at least one collapsed/expanded registration section before handoff.
