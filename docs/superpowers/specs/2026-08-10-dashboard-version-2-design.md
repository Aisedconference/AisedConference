# Dashboard Version 2 Design

## Goal

Create a separate local Version 2 of the AiSED dashboard with a collapsible side navigation, isolated Conference Registration, Gala Dinner, and Paper Administration areas, and category-specific admin controls. The existing dashboard artifact and live deployment remain unchanged.

## Scope

- Create a new local Version 2 build artifact; do not overwrite the current `dist/AiSED_Registration_Dashboard.html`.
- Replace the horizontal category tabs with a side panel that slides open and closed.
- Keep only one main area visible at a time while preserving the existing URL hashes.
- Exclude Call for Papers rows from Conference Registration.
- Split Conference Registration into independent expandable tables for Participants, Invited Guests, and Partners.
- Include HRD Corp employer and claimable-course fields in the Participants table.
- Provide category-specific local admin controls:
  - Participants: Proceed to Payment, Send Payment Reminder, Mark Payment Received, HRD Corp Submission.
  - Invited Guests: Send Invitation, Send Reminder, Mark Confirmed.
  - Partners: Send Follow-up, Approve Partnership, Request Correction.
- Preserve the existing Paper Administration behavior and expandable panels.
- Keep Gala Dinner isolated with its own view structure and expandable table area, even while its data source remains pending.

## Non-goals

- No Apps Script, Google Sheet, Drive, email, or live deployment changes.
- No changes to the existing Version 1 dashboard artifact.
- No migration of backend data or changes to paper workflow actions.

## Architecture

The existing self-contained build remains the delivery mechanism, but source responsibilities are separated by view. Shared state, safe-record normalization, filtering utilities, and storage remain shared. Conference Registration rendering and actions move behind a dedicated view module; Gala Dinner receives a dedicated view module; Paper Administration continues to use its existing paper modules. Each view exposes a small render and event-binding surface to the main dashboard coordinator.

The Version 2 build script writes a new artifact named `dist/AiSED_Registration_Dashboard_Version2.html`. The current artifact is not used as an output target during this work.

## Interaction design

- The side panel is expanded by default on desktop and collapses to an icon rail with a toggle button.
- On small screens it becomes an off-canvas panel and closes after selecting a view.
- Each category table uses a Paper Administration-style header bar with an accessible expand/minimize button.
- Category-specific action controls update local state and the existing local email-preview surface; they do not send live email.
- Action state is keyed by registration ID and category so one category cannot overwrite another category’s controls.
- The active view and open/closed panel state are reflected in accessible `aria-selected`, `aria-expanded`, and `hidden` attributes.

## Data behavior

- Conference Registration filters out records whose route is `Call for Papers` before calculating cards, tables, and counts.
- Participants expose `HRD Corp Employer Code` and `HRD Corp Claimable Courses (HRD CC)` when present, otherwise `—`.
- Gala Dinner remains a zero-data view with a clear source-pending state until its source is configured.
- Paper Administration receives the same data and backend connection behavior as Version 1.

## Testing and verification

- Add source tests for Version 2 artifact naming, route exclusion, category panels, HRD Corp fields, and category-specific action labels.
- Run the existing dashboard regression suite.
- Run the Version 2 build.
- Verify the Version 1 artifact timestamp/content remains unchanged.
- Inspect the Version 2 HTML for all three view roots and the side navigation.
- Open the Version 2 artifact locally and verify view switching, panel expansion/minimization, and local action changes.
