const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const redirectPath = path.join(root, "adminconference", "index.html");
const destination =
  "https://script.google.com/a/macros/aisedconference.org/s/AKfycbzeK8F5FtbZA6Bb0z3nml0vvI2lrUzaCl7VFrHUizG6Lsi1SsU3W9H1TzloJbe127Satw/exec?mode=admin#paper-administration";

test("/adminconference redirects to the secured administrator portal", () => {
  assert.ok(fs.existsSync(redirectPath), "Missing adminconference redirect page");

  const html = fs.readFileSync(redirectPath, "utf8");
  assert.match(html, /http-equiv="refresh"/i);
  assert.ok(html.includes(destination), "Redirect destination is incorrect");
  assert.match(html, /location\.replace/);
  assert.match(html, /name="robots" content="noindex, nofollow"/i);
});
