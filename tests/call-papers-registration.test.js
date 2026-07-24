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
const callForPapersRedirectHtml = fs.readFileSync(
  path.join(root, "registration", "call-for-papers", "index.html"),
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
  assert.match(appJs, /showStep\("subsection"\)/);
});

test("supports a direct academic presenter registration link", () => {
  assert.match(
    presenterRedirectHtml,
    /registration\.html\?category=call-papers&subsection=Academics%20%2F%20Entrepreneurs%20%2F%20Others&type=Presenter/
  );
  assert.match(appJs, /params\.get\("subsection"\)/);
  assert.match(appJs, /renderRegistrationFields\(\);\s*showStep\("form"\);\s*return;/);
  assert.match(appJs, /registrationState\.type = "Presenter"/);
});

test("supports a simple call for papers registration link", () => {
  assert.match(
    callForPapersRedirectHtml,
    /registration\.html\?category=call-papers/
  );
});

test("call for papers route uses one submit button and an audience dropdown", () => {
  assert.doesNotMatch(registrationHtml, /data-step="type"/);
  assert.doesNotMatch(registrationHtml, />Who is registering\?<\/h3>/);
  assert.match(registrationHtml, /data-open-call-paper-form><strong>Submit Paper Now<\/strong>/);
  assert.match(appJs, /id="call-paper-audience"/);
  assert.match(appJs, /name="registration_subsection"/);
  assert.match(appJs, /<option value="Academics \/ Entrepreneurs \/ Others"/);
  assert.match(appJs, /<option value="Postgraduate Students"/);
  assert.match(appJs, /<input type="hidden" name="registration_type" value="Presenter">/);
  assert.doesNotMatch(appJs, /id="call-paper-registration-type"/);
  assert.doesNotMatch(appJs, /<option value="Non-Presenter"/);
  assert.match(appJs, /event\.target\.name === "registration_subsection"/);
  assert.match(appJs, /registrationState\.type = "Presenter"/);
  assert.match(appJs, /registrationState\.category === "call-papers"[\s\S]*showStep\("subsection"\)/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>01<\/span><strong>15th August 2026<\/strong><\/div><p><b>Submit Abstract<\/b>/);
  assert.match(registrationHtml, /Papers Council Reviewer/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>03<\/span><strong>29th August 2026<\/strong><\/div>/);
  assert.match(registrationHtml, /<div class="flow-step-head"><span>04<\/span><strong>31st October 2026<\/strong><\/div><p><b>Full paper submission<\/b>/);
  assert.match(css, /\.call-paper-flow \.flow-step-head\s*\{/);
});

test("call for papers forms register every author as a presenter and collect SCOPUS preference", () => {
  assert.match(appJs, /if \(registrationState\.category === "call-papers"\) \{\s*routeFields =/);
  assert.doesNotMatch(appJs, /attendance_interest/);
  assert.match(appJs, /buildRadioGroup\("submit_to_scopus", "Submit to SCOPUS", \["Yes", "No"\]\)/);
  assert.match(appJs, /name="scopus_presentation_mode"/);
  assert.match(appJs, /<label>Presentation Mode/);
  assert.match(appJs, /Publication Fees ranging USD 599 - USD 1500, final amount will be advised\./);
  assert.match(appJs, /Physical Presentation">\s*Physical Presentation/);
  assert.match(appJs, /Online Presentation">\s*Online Presentation/);
  assert.doesNotMatch(appJs, /Physical Presentation \(\+ RM200\)/);
  assert.doesNotMatch(appJs, /Online Presentation \(\+ RM150\)/);
  assert.match(registrationHtml, /name="estimated_payable_amount"/);
  assert.match(registrationHtml, /name="estimated_fee_breakdown"/);
  assert.match(registrationHtml, /class="registration-submit-row"/);
  assert.match(registrationHtml, /data-payable-estimate hidden/);
  assert.match(registrationHtml, /Payment to be made after Final Paper draft is accepted\./);
  assert.match(registrationHtml, /SCOPUS Additional surcharge will be advised \(~ USD 599 - USD 1500\)/);
  assert.match(registrationHtml, /<button class="primary-button registration-submit-button" type="submit">Submit<\/button>/);
  assert.match(appJs, /const callPaperFees = \{/);
  assert.match(appJs, /"Academics \/ Entrepreneurs \/ Others":\s*1000/);
  assert.match(appJs, /"Postgraduate Students":\s*850/);
  assert.doesNotMatch(appJs, /const scopusPublicationFees/);
  assert.match(appJs, /const total = baseFee;/);
  assert.match(appJs, /const participantFees = \{[\s\S]*"HRD Corp Claimable":\s*1800[\s\S]*"General Admission":\s*1800[\s\S]*"Government Agencies":\s*1800/);
  assert.match(appJs, /const academicParticipantFees = \{[\s\S]*"Academician \/ Educator \/ Lecturer":\s*700[\s\S]*"Student \/ Postgraduate Student":\s*500/);
  assert.match(appJs, /name="academic_participant_category"/);
  assert.match(appJs, /selectedParticipantType === "Academics \/ Students \/ Postgraduate Students"/);
  assert.match(appJs, /const payableEstimateCategories = \["call-papers", "participants"\]/);
  assert.match(appJs, /const hiddenEstimateCategories = \["invited-guests", "partners"\]/);
  assert.match(appJs, /function updateCallPaperEstimate\(form\)/);
  assert.match(appJs, /registrationState\.category === "participants"[\s\S]*updateParticipantEstimate/);
  assert.match(appJs, /scopusModeSelect\.required = needsScopusMode/);
  assert.match(appJs, /submitToScopus === "Yes" && !scopusMode/);
  assert.match(appJs, /Abstract \/ Full paper submission<input name="paper_attachment"/);
  assert.doesNotMatch(appJs, />Paper attachment<input name="paper_attachment"/);
  assert.match(css, /\.radio-group\s*\{/);
  assert.match(css, /\.payable-estimate\s*\{/);
  assert.match(css, /\.payable-estimate\[hidden\]\s*\{\s*display:\s*none;/);
  assert.match(css, /\.registration-submit-row\s*\{/);
  assert.match(css, /\.action-form \.registration-submit-button\s*\{/);
});

test("call for papers backend stores SCOPUS choice and sends papers auto reply", () => {
  assert.match(registrationWebapp, /papersEmailFrom:\s*'papers@aisedconference\.org'/);
  assert.match(registrationWebapp, /spreadsheetId:\s*'1Nnu1zFcpzDcnWTtUGtDWQhxIxZlbxhsuBHpLuHVL1Ro'/);
  assert.match(registrationWebapp, /const REGISTRATION_SHEET_HEADERS = \{/);
  assert.match(registrationWebapp, /'SCOPUS Presentation Mode'/);
  assert.match(registrationWebapp, /'Estimated Payable Amount'/);
  assert.match(registrationWebapp, /'Estimated Fee Breakdown'/);
  assert.match(registrationWebapp, /function ensureSheetHeaders\(sheet, headers\)/);
  assert.match(registrationWebapp, /function setupRegistrationSheetHeaders\(\)/);
  assert.match(registrationWebapp, /submitToScopus:\s*payload\.submit_to_scopus/);
  assert.match(registrationWebapp, /scopusPresentationMode:\s*payload\.scopus_presentation_mode/);
  assert.match(registrationWebapp, /estimatedPayableAmount:\s*capturesPayableAmount \? \(payload\.estimated_payable_amount \|\| ''\) : ''/);
  assert.match(registrationWebapp, /estimatedFeeBreakdown:\s*capturesPayableAmount \? \(payload\.estimated_fee_breakdown \|\| ''\) : ''/);
  assert.match(registrationWebapp, /record\.submitToScopus/);
  assert.match(registrationWebapp, /function appendCallForPapers[\s\S]*record\.submitToScopus[\s\S]*attachmentUrlByField\(record, 'paper_attachment'\)[\s\S]*folderUrl\(getFolderId\(record\)\)[\s\S]*record\.scopusPresentationMode[\s\S]*record\.estimatedPayableAmount[\s\S]*record\.estimatedFeeBreakdown/);
  assert.match(registrationWebapp, /route === 'Call for Papers'[\s\S]*AISED\.papersEmailFrom/);
  assert.match(registrationWebapp, /Submit to SCOPUS:\s*\$\{record\.submitToScopus \|\| '-'\}/);
  assert.match(registrationWebapp, /SCOPUS presentation mode:\s*\$\{record\.scopusPresentationMode \|\| '-'\}/);
  assert.match(registrationWebapp, /Estimated payable amount:\s*\$\{record\.estimatedPayableAmount \? `RM\$\{record\.estimatedPayableAmount\}` : '-'\}/);
  assert.match(registrationWebapp, /reviewed by the committee, and we will inform you by 29th August 2026/);
});

test("backend captures payable amounts only for call for papers and participants", () => {
  assert.match(registrationWebapp, /const capturesPayableAmount = category === 'call-papers' \|\| category === 'participants'/);
  assert.match(registrationWebapp, /estimatedPayableAmount:\s*capturesPayableAmount \? \(payload\.estimated_payable_amount \|\| ''\) : ''/);
  assert.match(registrationWebapp, /estimatedFeeBreakdown:\s*capturesPayableAmount \? \(payload\.estimated_fee_breakdown \|\| ''\) : ''/);
  assert.match(registrationWebapp, /participants:\s*\[[\s\S]*'Estimated Payable Amount'[\s\S]*'Estimated Fee Breakdown'/);
  assert.match(registrationWebapp, /function appendParticipants[\s\S]*record\.estimatedPayableAmount[\s\S]*record\.estimatedFeeBreakdown/);
});

test("backend attaches a letterhead PDF copy for every registration route", () => {
  assert.match(registrationWebapp, /const pdf = shouldAttachPdf\(record\) \? createConfirmationPdf\(record\) : null/);
  assert.match(registrationWebapp, /function shouldAttachPdf\(record\) \{\s*return Boolean\(record\.email\);\s*\}/);
  assert.match(registrationWebapp, /AISED_LETTERHEAD_BACKGROUND/);
  assert.match(registrationWebapp, /AiSED International Conference 2026 letterhead/);
  assert.match(registrationWebapp, /conference-letterhead PDF acknowledgement containing a copy of the information submitted through the registration form/);
  assert.match(registrationWebapp, /if \(record\.route === 'Participants'\)[\s\S]*pdfNotice/);
  assert.match(registrationWebapp, /if \(record\.route === 'Invited Guests'\)[\s\S]*pdfNotice/);
  assert.match(registrationWebapp, /if \(record\.route === 'Partners'\)[\s\S]*pdfNotice/);
  assert.match(registrationWebapp, /replyTo:\s*sender\.replyTo/);
});

test("backend PDF acknowledgement includes submitted route-specific information", () => {
  assert.match(registrationWebapp, /function buildConfirmationRows\(record, recipientName\)/);
  assert.match(registrationWebapp, /\['Paper title', record\.paperTitle \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Abstract', record\.abstract \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Paper attachment link', attachmentUrlByField\(record, 'paper_attachment'\) \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Participant sector', record\.participantSector \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Company address', record\.companyAddress \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Participant notes', record\.participantNotes \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Invited guest role', record\.guestType \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Invitation notes', record\.invitationNote \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Speaker portrait link', attachmentUrlByField\(record, 'speaker_photo'\) \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Partner type', record\.partnerType \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Partnership interest', record\.partnershipInterest \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Partner acceptance letter link', attachmentUrlByField\(record, 'partner_acceptance_letter'\) \|\| '-'\]/);
  assert.match(registrationWebapp, /\['Attachment folder link', folderUrl\(getFolderId\(record\)\)\]/);
});
