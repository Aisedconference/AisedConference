const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const venueHtml = fs.readFileSync(path.join(root, "venue.html"), "utf8");
const hotelHtml = fs.readFileSync(path.join(root, "hotel.html"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("official hotel page includes Mardhiyyah accommodation details and location", () => {
  assert.match(hotelHtml, /id="official-hotel"/);
  assert.match(hotelHtml, /Official Hotel Partner/);
  assert.match(hotelHtml, /Book directly with Mardhiyyah Hotel &amp; Suites to enjoy AiSED International Conference 2026 delegate room rates/);
  assert.match(hotelHtml, /MARDHIYYAH HOTEL &amp; SUITES/);
  assert.match(hotelHtml, /A special rate for AiSED International Conference 2026 delegates/);
  assert.match(hotelHtml, /RM270\.00 nett/);
  assert.match(hotelHtml, /Room with one \(1\) breakfast/);
  assert.match(hotelHtml, /RM310\.00 nett/);
  assert.match(hotelHtml, /Room with two \(2\) breakfasts/);
  assert.match(hotelHtml, /Lot P5\.5, Persiaran Perbandaran, Seksyen 14/);
  assert.match(hotelHtml, /sm4@mardhiyyahhotel\.com/);
  assert.match(hotelHtml, /\+603-5511 8899/);
  assert.match(hotelHtml, /ext\. 2805/);
  assert.match(hotelHtml, /View map/);
  assert.doesNotMatch(hotelHtml, /View Conference Venue/);
  assert.match(hotelHtml, /Mardhiyyah\+Hotel\+and\+Suites\+Shah\+Alam/);
  assert.doesNotMatch(venueHtml, /id="hotel-partner"/);
});

test("hotel logo links to the Mardhiyyah website and QR asset is available", () => {
  assert.match(
    hotelHtml,
    /<a class="hotel-logo-card" href="https:\/\/mardhiyyahhotel\.com\/" target="_blank" rel="noopener"/
  );
  assert.match(hotelHtml, /src="assets\/mardhiyyah-hotel-logo\.png" alt="Mardhiyyah Hotel &amp; Suites logo"/);
  assert.match(hotelHtml, /src="assets\/mardhiyyah-whatsapp-reservation\.png" alt="Reservation Mardhiyyah WhatsApp business account QR code"/);
  assert.match(indexHtml, /<a class="logo-card hotel-logo-home" href="hotel\.html"[^>]*>[\s\S]*?src="assets\/mardhiyyah-hotel-logo\.png"[\s\S]*?<\/a>[\s\S]*?href="hotel\.html">Reservation<\/a>/);
  assert.ok(fs.existsSync(path.join(root, "assets/mardhiyyah-hotel-logo.png")));
  assert.ok(fs.existsSync(path.join(root, "assets/mardhiyyah-whatsapp-reservation.png")));
});

test("hotel partner layout has responsive card styling", () => {
  assert.match(css, /\.hotel-card-main\s*\{[^}]*grid-template-columns:\s*minmax\(160px,\s*0\.24fr\) minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.hotel-info-panel\s*\{[^}]*grid-template-columns:\s*minmax\(210px,\s*0\.8fr\) minmax\(280px,\s*1fr\) minmax\(110px,\s*0\.28fr\)/s);
  assert.match(css, /\.hotel-logo-card\s*\{[^}]*background:\s*#ffffff/s);
  assert.match(css, /\.hotel-logo-card img\s*\{[^}]*background:\s*#ffffff/s);
  assert.match(css, /@media \(max-width:\s*980px\)[\s\S]*?\.hotel-partner-card,[\s\S]*?\.hotel-rate-grid,[\s\S]*?\.hotel-contact-list,[\s\S]*?\{[\s\S]*?grid-template-columns:\s*1fr/s);
});
