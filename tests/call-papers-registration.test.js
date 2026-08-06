const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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

function loadRegistrationBackend() {
  const context = {
    console,
    SpreadsheetApp: {},
    DriveApp: {
      getFolderById(id) {
        return { getUrl: () => `https://drive.google.com/drive/folders/${id}` };
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(
    `${registrationWebapp}
globalThis.__backend = {
  REGISTRATION_SHEET_HEADERS,
  normaliseRecord,
  appendRegistrationRows,
  repairLegacyCallPaperAttachmentLinks:
    typeof repairLegacyCallPaperAttachmentLinks === "function"
      ? repairLegacyCallPaperAttachmentLinks
      : undefined
};`,
    context
  );
  return context;
}

function createSheet(existingHeaders) {
  const headers = [...existingHeaders];
  const appendedRows = [];

  return {
    headers,
    appendedRows,
    getLastColumn() {
      return headers.length;
    },
    getRange(row, column, rowCount, columnCount) {
      assert.equal(row, 1);
      assert.equal(rowCount, 1);
      return {
        getValues() {
          return [[...headers, ...Array(Math.max(0, columnCount - headers.length)).fill("")].slice(0, columnCount)];
        },
        setValues(rows) {
          rows[0].forEach((value, index) => {
            headers[column - 1 + index] = value;
          });
        }
      };
    },
    getFrozenRows() {
      return 1;
    },
    setFrozenRows() {},
    appendRow(values) {
      appendedRows.push(values);
    }
  };
}

function createDataSheet(rows) {
  return {
    getDataRange() {
      return {
        getValues() {
          return rows.map((row) => [...row]);
        }
      };
    },
    getRange(row, column) {
      return {
        setValue(value) {
          rows[row - 1][column - 1] = value;
        }
      };
    }
  };
}

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
  assert.match(appJs, /<label>Abstract<textarea name="abstract"[\s\S]*?<div class="scopus-presentation-choice" hidden>[\s\S]*?buildRadioGroup\("submit_to_scopus", "Submit to SCOPUS \/ MYCITE", \["Yes", "No"\]\)/);
  assert.match(appJs, /name="scopus_presentation_mode"/);
  assert.match(appJs, /<label>Presentation Mode/);
  assert.match(appJs, /Publication Fees ranging USD 599 - USD 1500, final amount will be advised\./);
  assert.match(appJs, /Physical Presentation">\s*Physical Presentation/);
  assert.match(appJs, /Online Presentation">\s*Online Presentation/);
  assert.match(appJs, /Without Presentation">\s*Without Presentation/);
  assert.doesNotMatch(appJs, /Physical Presentation \(\+ RM200\)/);
  assert.doesNotMatch(appJs, /Online Presentation \(\+ RM150\)/);
  assert.match(registrationHtml, /name="estimated_payable_amount"/);
  assert.match(registrationHtml, /name="estimated_fee_breakdown"/);
  assert.match(registrationHtml, /class="registration-submit-row"/);
  assert.match(registrationHtml, /data-payable-estimate hidden/);
  assert.match(registrationHtml, /<strong data-payment-note>Payment to be made after Final Paper draft is accepted\.<\/strong>/);
  assert.match(registrationHtml, /SCOPUS Additional surcharge will be advised \(~ USD 599 - USD 1500\)/);
  assert.match(registrationHtml, /<button class="primary-button registration-submit-button" type="submit">Proceed to Submit Application<\/button>/);
  assert.match(appJs, /const callPaperFees = \{/);
  assert.match(appJs, /data-payment-note/);
  assert.match(appJs, /registrationState\.category === "call-papers"[\s\S]*?Payment to be made after Final Paper draft is accepted\.[\s\S]*?TOTAL/);
  assert.match(appJs, /: "TOTAL"/);
  assert.match(appJs, /type === "HRD Corp Claimable"[\s\S]*?RM \$\{total\.toLocaleString\("en-MY"\)\} \(Claimable\)/);
  assert.match(registrationHtml, /Proceed to Submit Application/);
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
  assert.match(css, /\.discount-code-field\s*\{/);
  assert.match(css, /\.discount-code-field\[hidden\]\s*\{\s*display:\s*none;/);
  assert.match(css, /\.registration-submit-row\s*\{/);
  assert.match(css, /\.action-form \.registration-submit-button\s*\{/);
});

test("call for papers backend stores SCOPUS choice and sends papers auto reply", () => {
  assert.match(registrationWebapp, /emailFrom:\s*'registration@aisedconference\.org'/);
  assert.match(registrationWebapp, /papersCc:\s*'papers@aisedconference\.org'/);
  assert.match(registrationWebapp, /paymentMethodUrl:\s*'https:\/\/aisedconference\.org\/payment\.html'/);
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
  assert.match(registrationWebapp, /route === 'Call for Papers'[\s\S]*from:\s*AISED\.emailFrom[\s\S]*cc:\s*AISED\.papersCc/);
  assert.match(registrationWebapp, /Submit to SCOPUS:\s*\$\{record\.submitToScopus \|\| '-'\}/);
  assert.match(registrationWebapp, /SCOPUS presentation mode:\s*\$\{record\.scopusPresentationMode \|\| '-'\}/);
  assert.match(registrationWebapp, /Estimated payable amount:\s*\$\{record\.estimatedPayableAmount \? `RM\$\{record\.estimatedPayableAmount\}` : '-'\}/);
  assert.match(registrationWebapp, /reviewed by the committee, and we will inform you by 29th August 2026/);
});

test("participant auto reply includes the payment method link", () => {
  const emailBody = registrationWebapp.slice(registrationWebapp.indexOf("function getEmailBody(record)"));
  const callPapersBranch = emailBody.slice(
    emailBody.indexOf("if (record.route === 'Call for Papers')"),
    emailBody.indexOf("if (record.route === 'Participants')")
  );
  const participantsBranch = emailBody.slice(
    emailBody.indexOf("if (record.route === 'Participants')"),
    emailBody.indexOf("if (record.route === 'Invited Guests')")
  );

  assert.match(participantsBranch, /Payment method:\s*\$\{AISED\.paymentMethodUrl\}/);
  assert.doesNotMatch(callPapersBranch, /Payment method:\s*\$\{AISED\.paymentMethodUrl\}/);
});

test("auto reply sends a branded HTML email for every registration route", () => {
  assert.match(registrationWebapp, /const htmlBody = getEmailHtmlBody\(record\)/);
  assert.match(registrationWebapp, /htmlBody/);
  assert.match(registrationWebapp, /AiSED International Conference 2026/);
  assert.match(registrationWebapp, /Paper Registration Received/);
  assert.match(registrationWebapp, /Participant Registration Received/);
  assert.match(registrationWebapp, /Invited Guest Registration Received/);
  assert.match(registrationWebapp, /Partnership Registration Received/);
  assert.match(registrationWebapp, /function getEmailSummaryRows\(record\)/);
  assert.match(registrationWebapp, /function renderEmailSummaryCard\(rows\)/);
  assert.match(registrationWebapp, /View Payment Method/);
  assert.match(registrationWebapp, /Send the receipt to registration@aisedconference\.org with your Registration ID and Name, Payment Date and Amount Paid/);
});

test("backend captures payable amounts only for call for papers and participants", () => {
  assert.match(registrationWebapp, /const capturesPayableAmount = category === 'call-papers' \|\| category === 'participants'/);
  assert.match(registrationWebapp, /estimatedPayableAmount:\s*capturesPayableAmount \? \(payload\.estimated_payable_amount \|\| ''\) : ''/);
  assert.match(registrationWebapp, /estimatedFeeBreakdown:\s*capturesPayableAmount \? \(payload\.estimated_fee_breakdown \|\| ''\) : ''/);
  assert.match(registrationWebapp, /participants:\s*\[[\s\S]*'Estimated Payable Amount'[\s\S]*'Estimated Fee Breakdown'/);
  assert.match(registrationWebapp, /function appendParticipants[\s\S]*record\.estimatedPayableAmount[\s\S]*record\.estimatedFeeBreakdown/);
});

test("backend aligns every answer to the live sheet header, including legacy columns", () => {
  const context = loadRegistrationBackend();
  const backend = context.__backend;
  const masterHeaders = [
    ...backend.REGISTRATION_SHEET_HEADERS.master.filter((header) => (
      !["SCOPUS Presentation Mode", "Estimated Payable Amount", "Estimated Fee Breakdown"].includes(header)
    )),
    "Remark"
  ];
  const callPaperHeaders = backend.REGISTRATION_SHEET_HEADERS.callPapers.slice(0, 16);
  const master = createSheet(masterHeaders);
  const callPapers = createSheet(callPaperHeaders);
  const sheets = {
    "Master Registrations": master,
    "Call for Papers": callPapers
  };

  context.SpreadsheetApp.openById = () => ({
    getSheetByName(name) {
      return sheets[name];
    }
  });

  const record = backend.normaliseRecord({
    registration_category: "call-papers",
    registration_subsection: "Postgraduate Students",
    registration_type: "Presenter",
    reference: "REG-TEST-SCOPUS",
    submittedAt: "2026-07-27T00:00:00.000Z",
    name: "Test Author",
    email: "author@example.com",
    submit_to_scopus: "Yes",
    scopus_presentation_mode: "Online Presentation",
    estimated_payable_amount: "850",
    estimated_fee_breakdown: "Postgraduate Students: RM850"
  });

  backend.appendRegistrationRows(record);

  const masterRow = Object.fromEntries(master.headers.map((header, index) => [header, master.appendedRows[0][index] ?? ""]));
  const callPaperRow = Object.fromEntries(callPapers.headers.map((header, index) => [header, callPapers.appendedRows[0][index] ?? ""]));

  for (const row of [masterRow, callPaperRow]) {
    assert.equal(row["Submit to SCOPUS"], "Yes");
    assert.equal(row["SCOPUS Presentation Mode"], "Online Presentation");
    assert.equal(row["Estimated Payable Amount"], "850");
    assert.equal(row["Estimated Fee Breakdown"], "Postgraduate Students: RM850");
  }
  assert.equal(masterRow.Remark, "");
});

test("backend captures the selected academic participant category", () => {
  const context = loadRegistrationBackend();
  const backend = context.__backend;
  const master = createSheet(backend.REGISTRATION_SHEET_HEADERS.master);
  const participants = createSheet(backend.REGISTRATION_SHEET_HEADERS.participants);
  const sheets = {
    "Master Registrations": master,
    Participants: participants
  };
  context.SpreadsheetApp.openById = () => ({
    getSheetByName(name) {
      return sheets[name];
    }
  });
  const record = backend.normaliseRecord({
    registration_category: "participants",
    reference: "REG-TEST-PARTICIPANT",
    submittedAt: "2026-07-27T00:00:00.000Z",
    participant_sector: "Academics / Students / Postgraduate Students",
    academic_participant_category: "Student / Postgraduate Student",
    country: "Malaysia"
  });

  backend.appendRegistrationRows(record);

  assert.equal(record.academicParticipantCategory, "Student / Postgraduate Student");
  assert.equal(record.country, "Malaysia");
  const masterRow = Object.fromEntries(master.headers.map((header, index) => [header, master.appendedRows[0][index] ?? ""]));
  const participantRow = Object.fromEntries(participants.headers.map((header, index) => [header, participants.appendedRows[0][index] ?? ""]));
  assert.equal(masterRow["Academic Participant Category"], "Student / Postgraduate Student");
  assert.equal(masterRow["Country of Origin"], "Malaysia");
  assert.equal(participantRow["Academic Participant Category"], "Student / Postgraduate Student");
  assert.equal(participantRow["Country of Origin"], "Malaysia");
});

test("backend repairs the exact paper file URL without overwriting genuine SCOPUS answers", () => {
  const context = loadRegistrationBackend();
  const exactUrl = "https://drive.google.com/file/d/exact-file-id/view?usp=drivesdk";
  const legacyUrl = "https://drive.google.com/file/d/exact-file-id/view?usp=drive_link";
  const masterRows = [
    ["Registration ID", "Registration Route", "Submit to SCOPUS", "Paper Attachment Link"],
    ["REG-OLD-1", "Call for Papers", legacyUrl, ""],
    ["REG-MASTER-ONLY", "Call for Papers", legacyUrl, ""],
    ["REG-KEEP-YES", "Call for Papers", "Yes", ""]
  ];
  const callPaperRows = [
    ["Registration ID", "Submit to SCOPUS", "Paper Attachment Link"],
    ["REG-OLD-1", "", exactUrl],
    ["REG-KEEP-YES", "Yes", ""]
  ];
  const sheets = {
    "Master Registrations": createDataSheet(masterRows),
    "Call for Papers": createDataSheet(callPaperRows)
  };
  context.SpreadsheetApp.openById = () => ({
    getSheetByName(name) {
      return sheets[name];
    }
  });

  const result = context.__backend.repairLegacyCallPaperAttachmentLinks();

  assert.equal(masterRows[1][3], exactUrl);
  assert.equal(masterRows[1][2], "");
  assert.equal(masterRows[2][3], legacyUrl);
  assert.equal(masterRows[2][2], "");
  assert.equal(masterRows[3][2], "Yes");
  assert.deepEqual(
    { ...result },
    { repairedCount: 2, clearedMisplacedCount: 2 }
  );
});

test("backend attaches a letterhead PDF copy for every registration route", () => {
  assert.match(registrationWebapp, /const pdf = shouldAttachPdf\(record\) \? createConfirmationPdf\(record\) : null/);
  assert.match(registrationWebapp, /function shouldAttachPdf\(record\) \{\s*return Boolean\(record\.email\);\s*\}/);
  assert.match(registrationWebapp, /AISED_LETTERHEAD_BACKGROUND/);
  assert.match(registrationWebapp, /AiSED International Conference 2026 letterhead/);
  assert.doesNotMatch(registrationWebapp, /conference-letterhead PDF acknowledgement containing a copy of the information submitted through the registration form/);
  assert.doesNotMatch(registrationWebapp, /pdfNotice/);
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
