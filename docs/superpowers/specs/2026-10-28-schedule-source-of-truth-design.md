# Schedule Source-of-Truth Design

## Intent

Make the public conference programme and the agenda-linked Speaker Directory match the AiSED 2026 Conference Schedule updated 27 October 2026. Visitors should see accurate event timing, speaker assignments, and titles, while the programme remains clearly subject to change.

## Goals

- Treat the attached 27 October schedule as the authoritative source for all agenda titles, timings, named speakers, and listed events.
- Update the programme page for all three days, including the revised Day 1 sequence and removal of the unlisted gala dinner.
- Update agenda-linked details on the Speakers page and add the two keynote profiles supplied by the user:
  - Y.B. Tuan Akmal Nasrullah Mohd Nasir — Minister of Economy, Malaysia (Day 1, Keynote Session 1).
  - Maki Katsuno-Hayashikawa — Director of UNESCO Multisectoral Regional Office in Jakarta / UNESCO Representative to Indonesia, Brunei, Malaysia, The Philippines and Timor Leste (Day 3, Keynote Session 4).
- Remove the profiles for Tan Sri Abd. Rahman Mamat and Dato’ Dr. Ahmad Faisal Muhammad because neither is named in the authoritative schedule.
- Preserve title punctuation and spelling from the current standardised site convention: `Prof.`, `Dr.`, `Dato’`, `Y.B.`, `H.E.`, and `Ts.`.
- Align homepage schedule highlights with the updated programme without inventing detail not present in the PDF.

## Non-goals

- Do not alter committee membership or registration/payment content.
- Do not retain the gala dinner as a public scheduled event, because it is absent from the source schedule.
- Do not add a profile for Datuk Sikh Shamsul Ibrahim Sikh Abdul Majid, who remains marked TBC in the schedule and has no user-supplied profile image or request.

## Approach

Two approaches were considered:

1. Retain earlier programme items and mark differences as provisional. This would leave conflicting public information.
2. Replace the public programme with the 27 October source schedule and remove unlisted speaker profiles. This is the selected approach because the user explicitly requested the attached schedule as the latest benchmark.

## Implementation boundaries

- `programme/index.html` is the canonical three-day public agenda.
- `speakers/index.html` mirrors agenda-linked keynote and forum speakers, using local portraits in `assets/`.
- `home/index.html` contains compact schedule highlights only and must not contradict the canonical agenda.
- Existing test files will be updated or extended to assert the revised timing, added keynote names, removed profiles, and absence of the gala dinner.

## Acceptance criteria

- Day 1 shows: registration; welcome and opening addresses; Keynote 1 at 9.30–10.15; exhibition tour and coffee at 10.15–10.45; Forum 1 at 10.45–12.00; official opening luncheon at 12.00–2.00; prayer break at 2.00–2.30; Keynote 2 at 2.30–3.15; coffee at 3.15–3.30; Forum 2 at 3.30–4.45; and Day 1 summary at 4.45–5.00.
- Day 2 and Day 3 timings and named speakers match the document exactly, using standardised title punctuation.
- The public programme does not show an AiSED 2026 Gala & Appreciation Dinner.
- The speaker list includes Y.B. Tuan Akmal Nasrullah Mohd Nasir and Maki Katsuno-Hayashikawa, and does not include Tan Sri Abd. Rahman Mamat or Dato’ Dr. Ahmad Faisal Muhammad.
- Automated schedule and speaker checks pass, and the published site serves the revised content.
