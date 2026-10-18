const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "programme.html"), "utf8");
const published = fs.readFileSync(path.join(root, "programme", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses three accessible programme tabs", () => {
  assert.equal((source.match(/class="programme-tab-input"/g) || []).length, 3);
  assert.equal((source.match(/class="programme-tab-button"/g) || []).length, 3);
  assert.equal((source.match(/class="programme-tab-panel/g) || []).length, 3);
  for (const label of ["Day 1", "Day 2", "Day 3"]) assert.ok(source.includes(`>${label}</label>`));
});

test("matches the complete 17 October schedule timing", () => {
  const times = [
    "8.00 a.m.–9.00 a.m.", "9.00 a.m.–9.10 a.m.", "9.10 a.m.–9.30 a.m.", "9.30 a.m.–9.40 a.m.", "9.40 a.m.–10.00 a.m.", "10.00 a.m.–10.30 a.m.", "10.30 a.m.–11.15 a.m.", "11.15 a.m.–12.30 p.m.", "12.30 p.m.–2.00 p.m.", "2.00 p.m.–2.45 p.m.", "2.45 p.m.–3.00 p.m.", "3.00 p.m.–4.15 p.m.", "4.15 p.m.–5.00 p.m.",
    "9.00 a.m.–9.45 a.m.", "9.45 a.m.–11.00 a.m.", "11.00 a.m.–11.15 a.m.", "11.15 a.m.–12.30 p.m.", "2.00 p.m.–3.15 p.m.", "3.15 p.m.–3.30 p.m.", "3.30 p.m.–4.45 p.m.", "4.45 p.m.–5.00 p.m.", "2.00 p.m.–3.30 p.m.", "3.30 p.m.–5.00 p.m.", "7.00 p.m.–10.30 p.m.",
  ];
  for (const time of times) assert.ok(source.includes(`<time>${time}</time>`), `Missing ${time}`);
});

test("includes every new schedule feature and session", () => {
  const items = [
    "Opening, Keynotes and Forums", "Entrepreneurship Forum, Academic Sessions and Workshops", "Sustainable Entrepreneurship, Collaboration and Closing", "Signing of Memorandum of Agreement (MOA)", "YB Tuan Akmal Nasrullah Mohd Nasir (TBC)", "Zhen Rixin", "Driving Customer Experience and Digital Transformation in the AI Era", "Afiq Rashid", "Harnessing AI for Business Transformation, Innovation and Sustainable Growth", "Future-Ready Talent and Workforce Transformation in the Age of AI", "Future-Ready ASEAN: Developing Human Capital, Entrepreneurship and Innovation for the AI Era", "Maki Katsuno-Hayashikawa (TBC)", "Industry-Academia Roundtable Discussion", "Co-Creating the Future: Industry-Academia Partnerships for AI, Innovation and Sustainability", "Strategic Networking Session &amp; Memorandum of Understanding (MOU) Signing Ceremonies", "Conference Resolutions &amp; Closing", "AiSED 2026 Gala &amp; Appreciation Dinner",
  ];
  for (const item of items) assert.ok(source.includes(item), `Missing ${item}`);
});

test("uses the canonical speaker and leadership title formats", () => {
  const names = [
    "Prof. Dato’ Dr. Nik Maheran Nik Muhammad", "Prof. Dato’ Dr. Ansary Ahmed", "Prof. Emeritus Datuk Ts. Ir. Dr. Siti Hamisah Tapsir", "Adj. Prof. Dr. Behrang “Hani” Parhizkar", "Dr. Pietro Borsano", "Prof. Dato’ Dr. Noor Azizi bin Ismail", "Dato’ Dr. Kamarul A. Muhamed", "Dr. Kamarul Hisham Baginda, FCMI", "Prof. Dr. Noor Raihan Ab. Hamid", "Ts. Zehan Teoh", "Prof. Ts. Dr. Visweswara Rao Pasupuleti, FAPAS, FMSA, FIAAM", "Dr. Janeth Emanuel Kigobe",
  ];
  for (const name of names) assert.ok(source.includes(name), `Missing or non-standard title: ${name}`);
  assert.doesNotMatch(source, /Professor Dr\.|\bDr [A-Z]|\bProf [A-Z]|\bTs [A-Z]/);
});

test("keeps the published programme page in sync with its source", () => {
  for (const item of ["AiSED 2026 Gala &amp; Appreciation Dinner", "Maki Katsuno-Hayashikawa (TBC)", "Dr. Kamarul Hisham Baginda, FCMI"]) assert.ok(published.includes(item), `Published programme is missing ${item}`);
});

test("preserves keynote anchors and responsive timetable styling", () => {
  for (const id of ["welcome-address-conference-chair", "keynote-session-1", "keynote-session-2", "keynote-session-3"]) assert.ok(source.includes(`id="${id}"`));
  assert.match(css, /\.agenda-row:target\s*\{[^}]*scroll-margin-top:\s*130px/s);
  assert.match(css, /\.agenda-row strong,\s*\.agenda-row span,\s*\.agenda-row em\s*\{[^}]*display:\s*block/s);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.agenda-row,[\s\S]*?\.agenda-row\.no-speakers\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
