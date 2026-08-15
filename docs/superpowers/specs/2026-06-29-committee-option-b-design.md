# Committee Option B Design

## Goal

Display Tengku Amir Shah's supplied portrait on the committee page using the approved Option B uniform committee directory.

## Design

- Use one consistent profile-card component for every committee entry.
- Use group headings as the only visual hierarchy: Royal Patron, Conference Leadership, Organising Chairperson, Deputy Chairpersons, Committee Members, and Academic & Scientific Working Committee.
- Show the supplied portraits for Tengku Amir Shah and Adam Phung GK. Show calm initial placeholders for members whose portraits have not been supplied, avoiding invented imagery.
- Keep every card's portrait area, content spacing, border, and typography consistent.
- Preserve every name and position currently present in `committee.html`.

## Responsive behaviour

- Four columns on wide screens.
- Two columns on tablet-sized screens.
- One column on narrow mobile screens.
- Portraits use `object-fit: cover`; Tengku Amir Shah's portrait uses a slightly raised focal point so the face remains prominent.

## Accessibility and verification

- The real portrait has meaningful alt text.
- Initial placeholders are decorative and hidden from assistive technology.
- Each directory group is labelled by its heading.
- Automated checks confirm the supplied asset reference, card structure, preserved names, and responsive styles.
- Browser verification covers desktop and mobile layouts and checks for missing images or console errors.
