# Main Navigation Content Anchors Design

## Goal

Make every destination link in the main header navigation open the first useful content section on its destination page, while leaving the Programme parent button as a dropdown trigger.

## Scope

Update the main header navigation in:

- `index.html`
- `submission.html`
- `programme.html`
- `speakers.html`
- `committee.html`
- `registration.html`
- `partners.html`
- `venue.html`

Footer links, homepage calls to action, content cards, the logo link, and the floating “Back to Main Page” link are outside this change.

## Navigation Map

Every main header uses the same destination URLs:

| Header item | Destination |
| --- | --- |
| Home | `index.html#conference-overview` |
| Paper Submission | `submission.html#submission-guidelines` |
| Programme | No destination change; remains the dropdown trigger |
| Conference Schedule | `programme.html#conference-agenda` |
| Speakers | `speakers.html#featured-speakers` |
| Conference Leadership | `committee.html#conference-leadership` |
| Registration | `registration.html#registration-options` |

## Destination Sections

- Add `id="conference-overview"` to the first main conference introduction section on the homepage.
- Keep the existing `id="submission-guidelines"` on the submission guidelines section.
- Add `id="conference-agenda"` to the first programme agenda section.
- Add `id="featured-speakers"` to the first speakers content section.
- Add `id="conference-leadership"` to the first committee content section.
- Keep the existing `id="registration-options"` on the “How would you like to join?” panel.

The browser’s native fragment navigation will perform the movement. No JavaScript scrolling code or animation will be added.

## Behaviour

- Selecting a normal header link loads the destination page and positions it at the mapped content section.
- Selecting Registration while already on the registration page still positions the page at “How would you like to join?”
- Selecting any Programme submenu item loads its mapped content section.
- Selecting the Programme parent button only opens or closes its submenu, as it does today.
- Direct links without fragments continue to open pages normally.

## Testing

Extend the navigation regression tests to verify:

- Every page’s main header contains the full set of mapped fragment links.
- The Programme parent remains a button rather than a destination link.
- Each fragment target exists exactly once on its destination page.
- The existing registration anchor behaviour remains covered.
- The full existing test suite passes.

