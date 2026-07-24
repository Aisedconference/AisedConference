const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = [
  "index.html",
  "committee.html",
  "programme.html",
  "speakers.html",
  "registration.html",
  "submission.html",
  "partners.html",
  "venue.html",
];
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const registrationHtml = fs.readFileSync(path.join(root, "registration.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("labels every registration navigation link consistently", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.match(html, /<a href="registration\.html">Registration<\/a>/, page);
    assert.doesNotMatch(html, /<a href="registration\.html">Register<\/a>/, page);
  }
});

test("retains the shared original dark-green inner-page hero gradient", () => {
  assert.match(
    css,
    /\.page-hero\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*rgba\(31, 52, 40, 0\.96\),\s*rgba\(36, 88, 58, 0\.94\)\);/s
  );
});

test("uses the updated participant and invited guest registration wording", () => {
  assert.match(registrationHtml, /data-participant-type="General Admission"><strong>General Admission<\/strong>/);
  assert.match(registrationHtml, /data-participant-type="Academics \/ Students \/ Postgraduate Students"><strong>Academics \/ Students \/ Postgraduate Students<\/strong>/);
  assert.match(registrationHtml, /HRD Corp Claimable, General Admission, Government Agencies and academic delegates/);
  assert.doesNotMatch(registrationHtml, /Non-HRD Corp Claimable/);
  assert.match(registrationHtml, /embassy guests, guests of honour and protocol guests/);
  assert.match(registrationHtml, /partner universities, agencies, NGOs or institutions/);
  assert.match(appJs, /selectedParticipantType = registrationState\.type \|\| "General Admission"/);
});
