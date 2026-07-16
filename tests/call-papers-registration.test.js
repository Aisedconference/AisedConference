const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const submissionHtml = fs.readFileSync(path.join(root, "submission.html"), "utf8");
const registrationHtml = fs.readFileSync(path.join(root, "registration.html"), "utf8");
const presenterRedirectHtml = fs.readFileSync(
  path.join(root, "registration", "presenter", "index.html"),
  "utf8"
);
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const registrationWebapp = fs.readFileSync(
  path.join(root, "apps-script", "registration-webapp.gs"),
  "utf8"
);

test("paper submission button opens the call for papers registration route", () => {
  assert.match(
    submissionHtml,
    /href="https:\/\/aisedconference\.org\/registration\/presenter">Submit Now<\/a>/
  );
  assert.match(appJs, /params\.get\("category"\) === "call-papers"/);
  assert.match(appJs, /showStep\("type"\)/);
});

test("supports a direct academic presenter registration link", () => {
  assert.match(
    presenterRedirectHtml,
    /registration\.html\?category=call-papers&subsection=Academics%20%2F%20Others&type=Presenter/
  );
  assert.match(appJs, /params\.get\("subsection"\)/);
  assert.match(appJs, /params\.get\("type"\)/);
  assert.match(appJs, /renderRegistrationFields\(\);\s*showStep\("form"\);\s*return;/);
  assert.match(appJs, /data-subsection="\$\{CSS\.escape\(requestedSubsection\)\}"/);
  assert.match(appJs, /data-registration-type="\$\{CSS\.escape\(requestedType\)\}"/);
});

test("call for papers route uses the requested audience buttons and milestone copy", () => {
  assert.match(registrationHtml, /data-registration-type="Presenter"><strong>Presenter<\/strong>/);
  assert.match(registrationHtml, /data-registration-type="Non-Presenter"><strong>Non-Presenter<\/strong>/);
  assert.match(registrationHtml, /data-subsection="Academics \/ Others"><strong>Academics \/ Others<\/strong>/);
  assert.match(registrationHtml, /data-subsection="Postgraduate Students"><strong>Postgraduate Students<\/strong>/);
  assert.match(appJs, /registrationState\.category === "call-papers"[\s\S]*showStep\("subsection"\)/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>01<\/span><strong>15th August 2026<\/strong><\/div><p><b>Submit Abstract<\/b>/);
  assert.match(registrationHtml, /Papers Council Reviewer/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>03<\/span><strong>29th August 2026<\/strong><\/div>/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>04<\/span><strong>31st October 2026<\/strong><\/div><p><b>Full paper submission<\/b>/);
  assert.match(css, /\.call-paper-flow \.flow-step-head\s*\{/);
});

test("presenter forms collect SCOPUS preference and abstract or full paper upload", () => {
  assert.match(appJs, /buildRadioGroup\("submit_to_scopus", "Submit to SCOPUS", \["Yes", "No"\]\)/);
  assert.match(appJs, /Abstract \/ Full paper submission<input name="paper_attachment"/);
  assert.doesNotMatch(appJs, />Paper attachment<input name="paper_attachment"/);
  assert.match(css, /\.radio-group\s*\{/);
});

test("call for papers backend stores SCOPUS choice and sends papers auto reply", () => {
  assert.match(registrationWebapp, /papersEmailFrom:\s*'papers@aisedconference\.org'/);
  assert.match(registrationWebapp, /submitToScopus:\s*payload\.submit_to_scopus/);
  assert.match(registrationWebapp, /record\.submitToScopus/);
  assert.match(registrationWebapp, /function appendCallForPapers[\s\S]*record\.submitToScopus[\s\S]*attachmentUrlByField\(record, 'paper_attachment'\)/);
  assert.match(registrationWebapp, /route === 'Call for Papers'[\s\S]*AISED\.papersEmailFrom/);
  assert.match(registrationWebapp, /Submit to SCOPUS:\s*\$\{record\.submitToScopus \|\| '-'\}/);
  assert.match(registrationWebapp, /reviewed by the committee, and we will inform you by 29th August 2026/);
});
