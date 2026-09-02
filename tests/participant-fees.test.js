const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const registrationHtml = fs.readFileSync(path.join(root, "registration.html"), "utf8");
const registrationIndexHtml = fs.readFileSync(path.join(root, "registration", "index.html"), "utf8");

test("academic participant dropdown appears before Title and submits the correct fee", () => {
  assert.match(
    appJs,
    /const academicParticipantFees = \{[\s\S]*"Academician \/ Educator \/ Lecturer":\s*700[\s\S]*"Student \/ Postgraduate Student":\s*350/
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
  assert.match(appJs, /Delegate Note \(If any\)<textarea name="participant_notes" rows="4" placeholder=/);
  assert.doesNotMatch(appJs, /Delegate notes<textarea name="participant_notes" rows="4" required/);
  assert.doesNotMatch(registrationHtml, /Participant academic\/student fee selector/);
  assert.doesNotMatch(registrationHtml, /syncAcademicParticipantForm/);
});

test("country field is included where required and excluded for HRDC and Government Agencies", () => {
  assert.ok(appJs.includes('buildField("country", "Country of Origin", "text", true, `placeholder="e.g, Malaysia"`)'));
  assert.match(appJs, /selectedParticipantType === "HRD Corp Claimable"[\s\S]*commonFields = commonFields\.slice\(0, 3\)/);
  assert.match(appJs, /selectedParticipantType === "Government Agencies"[\s\S]*commonFields = commonFields\.filter\(\(field\) => !field\.includes\('name="country"'\)\)/);
  assert.match(appJs, /registrationState\.category === "partners"[\s\S]*buildField\("country", "Country of Origin", "text", true, `placeholder="e\.g, Malaysia"`\)/);
});

test("registration pages load the RM350 fee logic with a fresh asset version", () => {
  assert.match(registrationHtml, /app\.js\?v=20260902-student350/);
  assert.match(registrationIndexHtml, /\.\.\/app\.js\?v=20260902-student350/);
});
