const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.resolve(__dirname, "..", "submission.html"), "utf8");

test("shows the updated submission deadline timeline", () => {
  assert.match(html, /15 July 2026/);
  assert.match(html, /Abstract Submission Deadline/);
  assert.match(html, /15 August 2026/);
  assert.match(html, /Notification of Acceptance/);
  assert.match(html, /15 September 2026/);
  assert.match(html, /Full Paper Submission Deadline/);
});

test("does not show the old submission timeline wording", () => {
  assert.doesNotMatch(html, /Abstract Submission Opens/);
  assert.doesNotMatch(html, /Within 2 weeks after submission/);
  assert.doesNotMatch(html, /30 October 2026/);
});
