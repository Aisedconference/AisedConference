# Registration Navigation Anchor Design

## Goal

When a visitor clicks the top navigation’s **Registration** link while on
`registration.html`, the page must move directly to the panel headed
**How would you like to join?**

## Design

- Add the stable anchor ID `registration-options` to the category wizard panel
  that contains the **How would you like to join?** heading.
- Change only the top navigation Registration link in `registration.html` from
  `registration.html` to `#registration-options`.
- Use native fragment navigation. No JavaScript scrolling behavior is needed.
- Keep the page footer and Registration links on other pages unchanged.

## Accessibility and Browser Behavior

The anchor is placed on the containing wizard panel so the heading and its
registration choices enter the viewport together. Native fragment navigation
also works with keyboard activation and does not depend on scripting.

## Verification

- Add an automated regression test proving the top navigation link targets
  `#registration-options`.
- Verify the target ID is attached to the category panel containing the required
  heading.
- Run the complete test suite.
- Open the local page and click the top Registration link to confirm the target
  panel is brought into view.
