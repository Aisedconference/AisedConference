const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("submission pages show MyCITE without a SCOPUS publication card", () => {
  for (const file of ["submission.html", "submission/index.html"]) {
    const html = read(file);
    assert.match(html, /MyCITE-indexed publication/);
    assert.doesNotMatch(html, /SCOPUS/i);
  }
});

test("paper registration keeps presentation mode but has no SCOPUS choice", () => {
  const script = read("app.js");
  assert.match(script, /<label>Presentation Mode/);
  assert.match(script, /Online presentation discount \(30%\)/);
  assert.doesNotMatch(script, /SCOPUS Publication|Opt in for SCOPUS|buildRadioGroup\("submit_to_scopus"/i);
});
