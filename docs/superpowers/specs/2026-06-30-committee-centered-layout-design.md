# Committee Centered Layout Design

## Goal

Make the conference committee directory visually consistent by centering every section title and every row of profile cards, including incomplete final rows.

## Layout

- Center all `.committee-group-title` headings while retaining their existing full-width divider.
- Use a wrapping card container that displays four equal-width cards per row on desktop.
- Center incomplete rows automatically. A six-card group therefore displays four cards on the first row and two centered cards on the second row.
- Display two cards per row on tablet-sized screens and one centered card per row on mobile screens.
- Keep card dimensions, portrait treatment, typography, names, roles, and photos unchanged.

## Responsive Behaviour

- Desktop: four cards per row.
- Tablet: two cards per row.
- Mobile: one card per row.
- At every width, the cards in each row are centered within the committee directory.

## Implementation Approach

Replace the adaptive CSS Grid rule with a wrapping flex layout. Give cards a calculated desktop width for four columns, a tablet width for two columns, and full width on mobile. `justify-content: center` will center both complete and incomplete rows without roster-specific selectors.

## Verification

- Add an automated style regression test for centered titles, four-column desktop sizing, two-column tablet sizing, one-column mobile sizing, and centered wrapping.
- Run the full committee and speaker portrait test suites.
- Inspect the local committee page in the in-app browser and measure that complete and incomplete card rows share the page centerline.
