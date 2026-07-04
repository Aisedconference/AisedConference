const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses centered head-to-chest audience portrait crops", () => {
  assert.match(
    css,
    /\.audience-photo-grid img\s*\{[^}]*object-fit:\s*cover;[^}]*object-position:\s*center 25%/s
  );
});

test("loads the refreshed local audience portraits", () => {
  const portraitVersions = {
    "audience-academics.png": "20260630-3",
    "audience-policy.png": "20260630-3",
    "audience-business.png": "20260630-3",
    "audience-industry.png": "20260630-3",
    "audience-students.png": "20260630-3",
  };

  for (const [filename, version] of Object.entries(portraitVersions)) {
    assert.ok(
      html.includes(`src="assets/${filename}?v=${version}"`),
      `Missing refreshed portrait reference for ${filename}`
    );
  }
});

test("removes the redundant conference badge", () => {
  const heroMeta = html.match(/<div class="hero-meta"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "";
  assert.doesNotMatch(heroMeta, />International Conference<\/span>/);
});

test("adds a committee members hero action", () => {
  assert.match(
    html,
    /<div class="hero-actions">[\s\S]*?<a class="secondary-button" href="committee\.html">Committee Members<\/a>[\s\S]*?<\/div>/
  );
});

test("uses the concise registration hero action label", () => {
  assert.match(html, /<a class="primary-button" href="registration\.html">Registration<\/a>/);
  assert.doesNotMatch(html, />Registration Portal<\/a>/);
});

test("removes excess full-viewport hero height", () => {
  assert.match(
    css,
    /\.hero\s*\{[^}]*min-height:\s*auto;/s
  );
  assert.doesNotMatch(
    css,
    /\.hero\s*\{[^}]*min-height:\s*calc\(100vh - 76px\)/s
  );
});

test("uses balanced organiser and strategic partner panels", () => {
  assert.match(
    css,
    /\.partner-groups\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*3fr\) minmax\(240px,\s*1fr\);[^}]*align-items:\s*stretch/s
  );
  assert.match(
    css,
    /\.partner-group\s*\{[^}]*padding:\s*22px;[^}]*border:\s*1px solid var\(--line\);[^}]*border-radius:\s*12px/s
  );
  assert.match(
    css,
    /\.partner-groups \.logo-wall\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(120px,\s*1fr\)\)/s
  );
  assert.match(
    css,
    /\.partner-group\.strategic \.logo-wall\s*\{[^}]*grid-template-columns:\s*1fr/s
  );
  assert.match(
    css,
    /@media \(max-width:\s*980px\)[\s\S]*?\.partner-groups\s*\{[^}]*grid-template-columns:\s*1fr/s
  );
});

test("places the partner action below the description on the left", () => {
  assert.match(
    html,
    /<p class="section-intro">AiSED International Conference 2026[\s\S]*?<div class="section-actions compact-actions partner-action">\s*<a class="text-link" href="registration\.html#partners">Join as Partner<\/a>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="partner-groups"/
  );
  assert.match(
    css,
    /\.partner-action\s*\{[^}]*margin-top:\s*16px/s
  );
});
