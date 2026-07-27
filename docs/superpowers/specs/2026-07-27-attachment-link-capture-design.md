# Exact Attachment Link Capture and Repair

## Goal

Every uploaded registration file must be represented in the master spreadsheet by the exact Google Drive file URL so an authorised sheet user can click the cell and open that submitted file.

## Current behaviour and root cause

The website sends the uploaded file contents and the backend creates a distinct Drive file. The current deployed backend obtains that file's URL with `file.getUrl()` and maps it by spreadsheet header name.

Some older Master Registrations rows were written by an earlier positional schema. In those rows, the paper attachment URL was placed in `Submit to SCOPUS` instead of `Paper Attachment Link`. The route-specific Call for Papers tab still contains the correct attachment URL and can be used as the repair source.

## Design

### Future submissions

- Preserve the current upload flow: browser payload → Apps Script → new Drive file.
- Store the unmodified `file.getUrl()` value in `Paper Attachment Link`.
- Use the header-based row writer so the URL remains aligned even if sheet columns are reordered or extended.
- Keep the URL as a plain HTTPS value; Google Sheets automatically renders it as a clickable hyperlink.

### Historical repair

- Match Master Registrations and Call for Papers rows using the unique `Registration ID`.
- Read the exact `Paper Attachment Link` from Call for Papers.
- Write that URL into the matching Master Registrations `Paper Attachment Link` cell.
- Clear Master Registrations `Submit to SCOPUS` only when it contains the same HTTPS attachment URL.
- Do not overwrite `Yes`, `No`, blank SCOPUS answers, non-URL text, or any unrelated cell.
- Do not infer or invent links when the route-specific source cell is blank.

## Validation

- Confirm repaired master cells expose hyperlink metadata matching their displayed URL.
- Submit one synthetic call-for-papers record containing a small attachment.
- Verify that both Master Registrations and Call for Papers contain the same exact file URL under their attachment columns.
- Remove only the synthetic rows and synthetic Drive file after verification.
- Run the complete local automated test suite before deployment or source publication.

## Safety

- Existing attachment files are not renamed, moved, shared, or deleted during historical repair.
- Existing registration rows are matched by Registration ID rather than row number.
- Only the two targeted master columns may change during repair.
