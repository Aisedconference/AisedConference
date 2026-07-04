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

test("labels every registration navigation link consistently", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.match(html, /<a href="registration\.html">Registration<\/a>/, page);
    assert.doesNotMatch(html, /<a href="registration\.html">Register<\/a>/, page);
  }
});

test("uses the shared lighter green inner-page hero gradient", () => {
  assert.match(
    css,
    /\.page-hero\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*rgba\(49, 91, 70, 0\.96\),\s*rgba\(58, 118, 82, 0\.94\)\);/s
  );
});
