# Speaker Profile and AeU-SPEED Display Update

## Scope

Update the local AiSED conference website without publishing it. The work covers the Speaker Profile section in `speakers.html` and three organisation labels in the organising committee section of `committee.html`.

## Speaker Profile

Keep the existing responsive speaker-card design and extend the grid from two to four cards:

1. Dato' Steve Cheah
   - Category: `KEYNOTE SPEAKER`
   - Organisation/title: `Chairman of AiSED`
   - Retain the current speaker photo.
2. Dato' Prof. Dr. Nik Maheran binti Nik Muhammad
   - Category: `KEYNOTE SPEAKER`
   - Organisation/title: `Executive Co-Chair, AiSED`
   - Retain the current speaker photo.
3. Prof Dato' Dr Ansary Ahmed
   - Category: `KEYNOTE SPEAKER`
   - Organisation/title: `Founder President, Asia e University`
   - Reuse the matching committee photo at `assets/Committee/Prof Dato' Dr Ansary Ahmed.png`.
4. Ts. Zehan Teoh
   - Category: `SPEAKER`
   - Organisation/title: `Seating Experts, AiSED`
   - Copy the supplied local photo from `/Users/AdamP/Desktop/Ts.Zehan Teoh.png` into the website assets and reference that copied asset.

Each card uses the same image sizing, badge, name, and organisation/title typography. The existing two-column desktop grid remains in place and naturally forms a two-by-two arrangement; existing responsive rules continue to stack the cards on smaller screens.

## Committee Organisation Labels

Only the three selected organising committee cards change. Preserve the existing job-title wording and shorten the organisation reference to plain `AeU-SPEED` without brackets:

- `Marketing and Outreach, AeU-SPEED`
- `Business Operations and Programme Management, AeU-SPEED`
- `Partnerships and Client Engagement, AeU-SPEED`

No committee headings, names, photos, or other roles change.

## Verification

- Add automated checks for all four speaker cards, their exact badges and organisation/title lines, and both new image references.
- Confirm the three AeU-SPEED labels exactly match the approved wording.
- Confirm every referenced image exists and loads.
- Run the complete local test suite.
- Inspect `speakers.html`, `committee.html`, and the already-updated `programme.html` in the local browser at desktop and narrow widths.
- Do not push or deploy as part of this update.
