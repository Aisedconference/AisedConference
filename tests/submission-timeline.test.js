const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "submission.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("shows the updated submission deadline timeline", () => {
  assert.match(html, /15 August 2026/);
  assert.match(html, /Abstract Submission Deadline/);
  assert.match(html, /29 August 2026/);
  assert.match(html, /Notification of Acceptance/);
  assert.match(html, /30 October 2026/);
  assert.match(html, /Full Paper Submission Deadline/);
  assert.match(html, /Committee Reviewer notification before 29 August 2026\./);
});

test("does not show the old submission timeline wording", () => {
  assert.doesNotMatch(html, /Abstract Submission Opens/);
  assert.doesNotMatch(html, /Within 2 weeks after submission/);
  assert.doesNotMatch(html, /15 September 2026/);
  assert.doesNotMatch(html, /Authors will be notified within two weeks after abstract submission/);
});

test("shows the submission guidelines as a timeline chart", () => {
  assert.match(html, /<div class="highlight-grid submission-timeline">/);
  assert.match(html, /<span class="timeline-date">15 August 2026<\/span><strong>Abstract submission deadline<\/strong>/);
  assert.match(html, /<span class="timeline-date">29 August 2026<\/span><strong>Acceptance notification<\/strong>/);
  assert.match(html, /<span class="timeline-date">30 October 2026<\/span><strong>Full paper deadline<\/strong>/);
  assert.match(css, /\.submission-timeline::before\s*\{/);
  assert.match(css, /\.timeline-date\s*\{/);
});

test("shows publication logos and refined publication card wording", () => {
  assert.match(html, /<span class="publication-logo"><img src="assets\/publications\/mycite\.png" alt="MyCITE Malaysian Citation Index logo"><\/span>/);
  assert.match(html, /<strong>MyCITE-indexed publication<\/strong>/);
  assert.match(html, /<span class="publication-logo"><img src="assets\/publications\/scopus\.png" alt="Scopus logo"><\/span>/);
  assert.match(html, /<strong>SCOPUS publication<\/strong>/);
  assert.match(html, /Selected papers may be considered for SCOPUS publication opportunities\./);
  assert.ok(fs.existsSync(path.join(root, "assets", "publications", "mycite.png")));
  assert.ok(fs.existsSync(path.join(root, "assets", "publications", "scopus.png")));
  assert.match(css, /\.publication-logo img\s*\{[^}]*max-width:\s*150px;[^}]*max-height:\s*46px/s);
  assert.match(css, /\.publication-panel strong,[\s\S]*?font-size:\s*1\.12rem/s);
  assert.match(css, /\.publication-panel p\s*\{[^}]*font-size:\s*0\.96rem/s);
});
