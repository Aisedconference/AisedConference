# Committee and Programme Local Update Design

## Scope

Update `committee.html` and `programme.html` locally. Preserve the existing site navigation, page heroes, footer, committee group headings, committee card styling, and existing member names unless explicitly listed below.

## Organisation Chart

- Replace organisation-only uses of `AeU` with `Asia e University`.
- Retain the recognised unit acronym only after the expanded institution and school name: `School of Professional and Executive Education Development, Asia e University (AeU-SPEED)`.
- Update Philip Lim's role to: `Head, School of Professional and Executive Education Development, Asia e University (AeU-SPEED).`
- Preserve the existing role-title wording for current Committee Members; only expand their AeU-SPEED organisation reference.
- Update Assoc Prof Dr Hartini Ahmad's organisation reference from `AeU` to `Asia e University`.
- Add these cards to Academic & Scientific Working Committee:
  - Assoc Prof Dr Swa Lee Lee — Director, School of Graduate Studies, Asia e University.
  - Dr Sanura Jaya — Visiting Assoc. Professor, Asia e University.
- Use the supplied transparent portraits from Downloads and copy them into `assets/Committee/` with matching filenames.
- Keep the established centred, uniform committee-card layout and non-cropping portrait treatment.

## Conference Schedule

- Replace the current coarse three-column timetable matrix with three chronological day-by-day tables.
- Each table has two columns: exact time and programme item.
- Use the exact Day 1, Day 2, and Day 3 dates, times, wording, and order supplied by the user.
- Display `Keynote Session 1`, `Keynote Session 2`, `Keynote Session 3`, and `Forum 1` through `Forum 4` as bold session labels followed by their titles on a separate line.
- Do not use unordered lists or bullet markers for Keynote or Forum labels/titles.
- Keep the schedule responsive: time remains clearly separated on desktop and stacks cleanly on narrow screens.
- Retain the `Agenda subject to change.` notice.

## Verification

- Automated tests will verify the complete committee roster, exact new roles, expanded Asia e University wording, supplied portrait references, all schedule dates/times/content, and absence of programme bullets.
- Rendered local checks will confirm both new portraits load, cards remain centred and consistent, schedule rows are readable, and Keynote/Forum titles have no bullets.
- No GitHub push or live deployment is included in this local-only update.
