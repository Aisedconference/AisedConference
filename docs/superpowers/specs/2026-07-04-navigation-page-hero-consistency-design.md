# Navigation and Page Hero Consistency Design

## Goal

Improve consistency across the AiSED Conference website by renaming the shared registration navigation label and applying a slightly lighter treatment to every inner-page hero panel.

## Scope

- Change the visible shared navigation label from `Register` to `Registration` on all site pages.
- Keep every registration link pointing to `registration.html`.
- Lighten the existing shared `.page-hero` green gradient while retaining white text, the AiSED watermark, spacing, and responsive behavior.
- Apply the hero change through the shared stylesheet so committee, programme, speakers, registration, submission, partners, and venue pages remain visually consistent.

## Visual Direction

Use a moderately lighter forest-green gradient rather than a pale panel. The result should remain clearly distinct from the cream page background, retain strong white-text contrast, and feel consistent with the existing AiSED green and gold visual language.

The watermark remains subtle and should not compete with the heading or description. No page-specific hero overrides will be introduced.

## Implementation

1. Update the exact navigation link text in each HTML page.
2. Adjust only the shared `.page-hero` gradient declaration in `styles.css`.
3. Preserve the existing pseudo-element watermark and typography rules.
4. Add automated checks for the shared navigation label and hero styling.
5. Verify representative inner pages at desktop and mobile widths in the local browser.

## Acceptance Criteria

- Every site header displays `Registration` and links to `registration.html`.
- No site header still displays `Register`.
- Every inner-page hero uses the same lighter shared green gradient.
- Hero text remains readable and the watermark remains visually subordinate.
- Existing responsive layouts and tests continue to pass.
