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
