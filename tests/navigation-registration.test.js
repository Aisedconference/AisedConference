const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = [
  "home/index.html", "programme/index.html", "speakers/index.html", "leadership/index.html",
  "registration/index.html", "submission/index.html", "partnership/index.html",
  "exhibitors/index.html", "faq/index.html", "index.html", "programme.html",
  "speakers.html", "committee.html", "registration.html", "submission.html",
  "partners.html", "sponsorship.html", "sponsorship-alt.html",
  "partners-executive.html", "payment.html", "hotel.html", "venue.html",
];

test("every page puts Registration after Speakers in the menu bar", () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, `${page}: navigation is missing`);
    assert.match(nav, /Conference Schedule<\/a>[\s\S]*?<a [^>]*>Speakers<\/a>[\s\S]*?<a class="nav-register-cta"[^>]*>Registration<\/a>[\s\S]*?<div class="nav-group">/, `${page}: top-level order`);
    assert.match(nav, /<div class="nav-dropdown"[^>]*>[\s\S]*?<a [^>]*>Leadership<\/a>[\s\S]*?<\/div>/, `${page}: Leadership submenu`);
    assert.doesNotMatch(nav.split('<div class="nav-group"')[0], />Leadership<\/a>/, `${page}: duplicate top-level Leadership`);
    assert.doesNotMatch(html, /class="mobile-registration-cta"/, `${page}: no standalone mobile registration button`);
    assert.match(html, /<button class="mobile-menu-toggle"[^>]*aria-controls="main-navigation"[^>]*>Menu<\/button>/, `${page}: mobile menu button`);
    assert.match(html, /<nav id="main-navigation"/, `${page}: menu contains navigation`);
    assert.match(html, /<script src="(?:\.\.\/)?navigation\.js" defer><\/script>/, `${page}: shared mobile menu behavior`);
  }
});

test("schedule pages include a prominent registration action near the title", () => {
  for (const page of ["programme/index.html", "programme.html"]) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.match(html, /<h1>Conference schedule\.<\/h1>[\s\S]*?<a class="primary-button programme-register-cta"[^>]*>Register Now<\/a>/, page);
  }
});
