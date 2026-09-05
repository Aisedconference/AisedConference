const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("payment method page publishes the AeU guideline details", () => {
  const html = read("payment.html");

  assert.match(html, /<title>Payment Method \| AiSED International Conference 2026<\/title>/);
  assert.match(html, /Online Payment via Credit Card \/ Debit Card/);
  assert.match(html, /href="https:\/\/myaeu\.aeu\.edu\.my\/payment-master-card\/pay"/);
  assert.doesNotMatch(html, /Open MyAeU Portal/);
  assert.doesNotMatch(html, /<p class="eyebrow">Asia e University \(AeU\)<\/p>/);
  assert.doesNotMatch(html, /<ol class="payment-steps">/);
  assert.match(html, /Step 1/);
  assert.match(html, /Choose your payment method/);
  assert.match(html, /href="registration\.html#registration-options" data-back-link>Back to Previous Page<\/a>/);
  assert.match(html, /new URLSearchParams\(window\.location\.search\)\.get\("return"\)/);
  assert.match(html, /backLink\.href = returnUrl/);
  assert.match(html, /window\.history\.back\(\)/);
  assert.match(html, /document\.getElementById\("payment-methods"\)/);
  assert.match(html, /paymentMethods && !window\.location\.hash/);
  assert.match(html, /paymentMethods\.scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(html, /data-payment-choice="method-1"/);
  assert.match(html, /data-payment-choice="method-2"/);
  assert.match(html, /data-payment-panel="method-1" hidden/);
  assert.match(html, /data-payment-panel="method-2" hidden/);
  assert.match(html, /data-payment-confirmation hidden/);
  assert.match(html, /data-payment-step-two-title hidden/);
  assert.match(html, /Step 2/);
  assert.match(html, /Step 2: Email your receipt/);
  assert.match(html, /Send receipt to <a href="mailto:registration@aisedconference\.org">registration@aisedconference\.org<\/a>\./);
  assert.match(html, /Please include the information below:/);
  assert.doesNotMatch(html, /data-selected-payment-method/);
  assert.doesNotMatch(html, /METHOD 01 ONLINE PAYMENT/);
  assert.match(html, /Registration ID and Name/);
  assert.match(html, /REG-XXXXXX-XXXXX/);
  assert.match(html, /class="payment-reference-grid"/);
  assert.match(html, /class="payment-method-number">01<\/span>/);
  assert.match(html, /class="payment-method-number">02<\/span>/);
  assert.doesNotMatch(html, /<div class="payment-method-head">\s*<span class="payment-method-number">/);
  assert.doesNotMatch(html, /class="payment-method-label">Method 01<\/span>/);
  assert.doesNotMatch(html, /class="payment-method-label">Method 02<\/span>/);
  assert.match(html, /<img src="assets\/visa-and-mastercard\.png" alt="VISA and Mastercard">/);
  assert.doesNotMatch(html, /class="card-brand visa">VISA<\/span>/);
  assert.doesNotMatch(html, /class="card-brand mastercard">Mastercard<\/span>/);
  assert.match(html, /payment-method-card[\s\S]*payment-method-card/);
  assert.doesNotMatch(html, /class="primary-button payment-direct-button" href="mailto:registration@aisedconference\.org"/);
  assert.match(html, /Bank Transfer \/ Telegraphic Transfer \(TT\)/);
  assert.match(html, /Asia e Learning Sdn Bhd/);
  assert.match(html, /8000-28-3319/);
  assert.match(html, /CIMB Bank Berhad/);
  assert.match(html, /CIBBMYKL/);
  assert.match(html, /registration@aisedconference\.org/);
});

test("clean payment route forwards to the existing payment page", () => {
  const routeHtml = read("payment/index.html");

  assert.match(routeHtml, /<title>Payment Method \| AiSED International Conference 2026<\/title>/);
  assert.match(routeHtml, /window\.location\.replace\("\.\.\/payment\.html" \+ window\.location\.search \+ window\.location\.hash\)/);
  assert.match(routeHtml, /href="\.\.\/payment\.html">Continue to Payment Method<\/a>/);
});

test("registration page links participants to the payment method page", () => {
  const registrationHtml = read("registration.html");
  const appJs = read("app.js");

  assert.match(
    registrationHtml,
    /<label class="discount-code-field" data-discount-code-field hidden>Discount Code \(If applicable\)\s*<input name="discount_code" type="text" placeholder="Enter discount code">/
  );
  assert.match(registrationHtml, /<div class="wizard-options registration-route-options">/);
  assert.match(registrationHtml, /<strong>Participate<\/strong>[\s\S]*<a href="payment\.html">Payment Method<\/a>/);
  assert.match(appJs, /const paymentRedirectParticipantTypes = \[[\s\S]*"General Admission"[\s\S]*"Academics \/ Students \/ Postgraduate Students"[\s\S]*"Government Agencies"[\s\S]*\]/);
  assert.match(appJs, /registrationState\.category === "participants" &&\s*paymentRedirectParticipantTypes\.includes\(registrationState\.type\)/);
  assert.match(appJs, /function getPaymentReturnUrl\(\)/);
  assert.match(appJs, /return `registration\.html\?\$\{params\.toString\(\)\}#registration-options`/);
  assert.match(appJs, /function getPaymentPageUrl\(\)/);
  assert.match(appJs, /return `payment\.html\?\$\{params\.toString\(\)\}`/);
  assert.match(appJs, /params\.get\("category"\) === "participants"/);
  assert.match(appJs, /"Submit & Pay"/);
  assert.match(appJs, /function updateDiscountCodeFields\(\)/);
  assert.match(appJs, /document\.querySelectorAll\("\[data-discount-code-field\]"\)/);
  assert.match(appJs, /window\.location\.assign\(getPaymentPageUrl\(\)\)/);
});

test("site footers include payment method under participate", () => {
  const pages = [
    "index.html",
    "committee.html",
    "programme.html",
    "speakers.html",
    "registration.html",
    "submission.html",
    "partners.html",
    "venue.html",
    "payment.html",
  ];

  for (const page of pages) {
    assert.match(
      read(page),
      /<strong>Participate<\/strong>[\s\S]*<a href="payment\.html">Payment Method<\/a>/,
      page
    );
  }
});
