const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "programme.html"), "utf8");
const published = fs.readFileSync(path.join(root, "programme", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses three accessible programme tabs", () => {
  assert.equal((published.match(/class="programme-tab-input"/g) || []).length, 3);
  assert.equal((published.match(/class="programme-tab-button"/g) || []).length, 3);
  assert.equal((published.match(/class="programme-tab-panel/g) || []).length, 3);
  for (const label of ["Day 1", "Day 2", "Day 3"]) assert.ok(published.includes(`>${label}</label>`));
});

test("matches the 27 October source-of-truth Day 1 schedule", () => {
  const dayOne = [
    "8.00 a.m.–9.00 a.m.", "9.00 a.m.–9.10 a.m.", "9.10 a.m.–9.30 a.m.", "9.30 a.m.–10.15 a.m.",
    "10.15 a.m.–10.45 a.m.", "10.45 a.m.–12.00 p.m.", "12.00 p.m.–2.00 p.m.", "2.00 p.m.–2.30 p.m.",
    "2.30 p.m.–3.15 p.m.", "3.15 p.m.–3.30 p.m.", "3.30 p.m.–4.45 p.m.", "4.45 p.m.–5.00 p.m.",
  ];
  for (const time of dayOne) assert.ok(published.includes(`<time>${time}</time>`), `Missing Day 1 time ${time}`);
  for (const item of [
    "Keynote Session 1", "Y.B. Tuan Akmal Nasrullah Mohd Nasir", "Tour of Exhibition &amp; Coffee Break",
    "AiSED 2026 – Official Opening Luncheon", "Royal Opening Address", "Strategic Partnership &amp; Appreciation Ceremony",
    "Prayer Break", "Keynote Session 2", "Zhen Rixin", "Forum 2",
  ]) assert.ok(published.includes(item), `Missing Day 1 item ${item}`);
  assert.doesNotMatch(published, /9\.30 a\.m\.–9\.40 a\.m\.|9\.40 a\.m\.–10\.00 a\.m\.|10\.00 a\.m\.–10\.30 a\.m\.|10\.30 a\.m\.–11\.15 a\.m\./);
});

test("matches the 27 October source-of-truth Day 2 and Day 3 schedule", () => {
  for (const item of [
    "From Disruption to Transformation: Building Resilient Innovation Ecosystems in the AI Economy",
    "Entrepreneurship 5.0: Building Future-Ready Ventures in the AI Economy",
    "Future-Ready ASEAN: Developing Human Capital, Entrepreneurship and Innovation for the AI Era",
    "Maki Katsuno-Hayashikawa", "Industry-Academia Roundtable Discussion",
    "Co-Creating the Future: Industry-Academia Partnerships for AI, Innovation and Sustainability",
    "Strategic Networking Session &amp; Memorandum of Understanding (MOU) Signing Ceremonies",
    "Conference Resolutions &amp; Closing",
  ]) assert.ok(published.includes(item), `Missing schedule item ${item}`);
  assert.doesNotMatch(published, /AiSED 2026 Gala &amp; Appreciation Dinner/);
});

test("uses the canonical speaker and leadership title formats", () => {
  const names = [
    "Prof. Dato’ Dr. Nik Maheran Nik Muhammad", "Prof. Dato’ Dr. Ansary Ahmed", "Y.B. Tuan Akmal Nasrullah Mohd Nasir",
    "Prof. Emeritus Datuk Ts. Ir. Dr. Siti Hamisah Tapsir", "Adj. Prof. Dr. Behrang “Hani” Parhizkar",
    "Dr. Pietro Borsano", "Prof. Dato’ Dr. Noor Azizi bin Ismail", "Dato’ Dr. Kamarul A. Muhamed",
    "Dr. Kamarul Hisham Baginda, FCMI", "Prof. Dr. Noor Raihan Ab. Hamid", "Ts. Zehan Teoh",
    "Prof. Ts. Dr. Visweswara Rao Pasupuleti, FAPAS, FMSA, FIAAM", "Dr. Janeth Emanuel Kigobe",
  ];
  for (const name of names) assert.ok(published.includes(name), `Missing or non-standard title: ${name}`);
  assert.doesNotMatch(published, /Professor Dr\.|\bDr [A-Z]|\bProf [A-Z]|\bTs [A-Z]/);
});

test("keeps the direct and directory programme routes in sync", () => {
  for (const item of ["Y.B. Tuan Akmal Nasrullah Mohd Nasir", "Maki Katsuno-Hayashikawa", "AiSED 2026 – Official Opening Luncheon"]) {
    assert.ok(source.includes(item), `Direct programme route is missing ${item}`);
    assert.ok(published.includes(item), `Directory programme route is missing ${item}`);
  }
  assert.doesNotMatch(source, /AiSED 2026 Gala &amp; Appreciation Dinner/);
});

test("preserves agenda anchors and responsive timetable styling", () => {
  for (const id of ["welcome-address-conference-chair", "keynote-session-1", "keynote-session-2", "keynote-session-3", "keynote-session-4"]) assert.ok(published.includes(`id="${id}"`));
  assert.match(css, /\.agenda-row:target\s*\{[^}]*scroll-margin-top:\s*130px/s);
  assert.match(css, /\.agenda-row strong,\s*\.agenda-row span,\s*\.agenda-row em\s*\{[^}]*display:\s*block/s);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.agenda-row,[\s\S]*?\.agenda-row\.no-speakers\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
