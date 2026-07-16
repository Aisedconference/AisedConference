const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const pages = ["registration.html", "partners.html"];

for (const page of pages) {
  test(`${page} requires agreement to the expandable PDPA notice`, () => {
    const html = fs.readFileSync(path.join(root, page), "utf8");

    assert.match(
      html,
      /<label class="consent-check"[\s\S]*?<input[^>]*type="checkbox"[^>]*name="pdpaConsent"[^>]*value="agreed"[^>]*required[\s\S]*?Personal Data Protection Notice below\.[\s\S]*?<\/label>\s*<details class="consent-policy" id="pdpa-policy-[^"]+">[\s\S]*?<summary>Terms &amp; Conditions and Personal Data Protection Notice \(PDPA\)<\/summary>[\s\S]*?<\/details>/
    );
    assert.match(html, /Personal Data Protection Act 2010 \(PDPA\)/);
    assert.match(html, /info@aisedconference\.org/);
  });
}

test("styles the expandable policy and mandatory consent control", () => {
  assert.match(css, /\.consent-policy\s*\{/);
  assert.match(css, /\.consent-policy summary\s*\{[^}]*font-size:\s*0\.94rem/s);
  assert.match(css, /\.consent-check\s*\{[^}]*font-size:\s*0\.94rem/s);
  assert.match(css, /\.consent-check input\[type="checkbox"\]\s*\{/);
  assert.match(css, /\.consent-policy-body\s*\{/);
});
