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

const headerDestinations = [
  ["Home", "index.html#conference-overview"],
  ["Paper Submission", "submission.html#submission-guidelines"],
  ["Conference Schedule", "programme.html#conference-agenda"],
  ["Speakers", "speakers.html#featured-speakers"],
  ["Conference Leadership", "committee.html#conference-leadership"],
  ["Registration", "registration.html#registration-options"],
];

test("links every main header destination to its first content section", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    const nav = html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1] || "";

    for (const [label, href] of headerDestinations) {
      const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.match(nav, new RegExp(`<a href="${escapedHref}">${label}<\\/a>`), `${page}: ${label}`);
    }

    assert.match(
      nav,
      /<button class="nav-parent" type="button" aria-haspopup="true">Programme<\/button>/,
      page
    );
  }
});

test("defines every main header fragment target exactly once", () => {
  for (const [, href] of headerDestinations) {
    const [filename, fragment] = href.split("#");
    const html = fs.readFileSync(path.join(root, filename), "utf8");
    const matches = html.match(new RegExp(`\\bid="${fragment}"`, "g")) || [];
    assert.equal(matches.length, 1, href);
  }
});

test("registration anchor identifies the join options", () => {
  assert.match(
    registrationHtml,
    /<div class="wizard-panel" id="registration-options" data-step="category">\s*<h3>How would you like to join\?<\/h3>/
  );
});

test("retains the shared original dark-green inner-page hero gradient", () => {
  assert.match(
    css,
    /\.page-hero\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*rgba\(31, 52, 40, 0\.96\),\s*rgba\(36, 88, 58, 0\.94\)\);/s
  );
});

test("uses the updated participant and invited guest registration wording", () => {
  assert.match(registrationHtml, /data-participant-type="General Admission"><strong>General Admission<\/strong>/);
  assert.match(registrationHtml, /data-participant-type="General Admission"[\s\S]*data-participant-type="Academics \/ Students \/ Postgraduate Students"[\s\S]*data-participant-type="Government Agencies"[\s\S]*data-participant-type="HRD Corp Claimable"/);
  assert.match(registrationHtml, /data-participant-type="Academics \/ Students \/ Postgraduate Students"><strong>Academics \/ Students \/ Postgraduate Students<\/strong>/);
  assert.match(registrationHtml, /HRD Corp Claimable, General Admission, Government Agencies and academic delegates/);
  assert.doesNotMatch(registrationHtml, /Non-HRD Corp Claimable/);
  assert.match(registrationHtml, /embassy guests, guests of honour and protocol guests/);
  assert.match(registrationHtml, /partner universities, agencies, NGOs or institutions/);
  assert.match(appJs, /selectedParticipantType = registrationState\.type \|\| "General Admission"/);
});
