const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const registrationHtml = fs.readFileSync(path.join(root, "registration.html"), "utf8");

test("academic participant dropdown appears before Title and submits the correct fee", () => {
  assert.match(
    appJs,
    /const academicParticipantFees = \{[\s\S]*"Academician \/ Educator \/ Lecturer":\s*700[\s\S]*"Student \/ Postgraduate Student":\s*500/
  );
  assert.match(appJs, /<label>Participant category\s*<select id="participant-registration-type" name="academic_participant_category" required>/);
  assert.match(appJs, /<option value="Academician \/ Educator \/ Lecturer">Academician \/ Educator \/ Lecturer<\/option>/);
  assert.match(appJs, /<option value="Student \/ Postgraduate Student">Student \/ Postgraduate Student<\/option>/);
  assert.doesNotMatch(appJs, /<option[^>]*>[^<]*RM(?:700|500)<\/option>/);
  assert.match(appJs, /commonFields\.splice\(3, 0, academicParticipantCategoryField\)/);
  assert.match(
    appJs,
    /const selectedAcademicCategory = form\.querySelector\("\[name='academic_participant_category'\]"\)\?\.value \|\| ""/
  );
  assert.match(
    appJs,
    /const total = isAcademicParticipant\s*\? academicParticipantFees\[selectedAcademicCategory\] \|\| 0\s*:\s*participantFees\[type\] \|\| 0/
  );
  assert.doesNotMatch(registrationHtml, /Participant academic\/student fee selector/);
  assert.doesNotMatch(registrationHtml, /syncAcademicParticipantForm/);
});
