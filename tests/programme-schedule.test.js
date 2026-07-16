const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "programme.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses three agenda buttons for Day 1, Day 2 and Day 3", () => {
  assert.equal((html.match(/class="programme-tab-input"/g) || []).length, 3);
  assert.equal((html.match(/class="programme-tab-button"/g) || []).length, 3);
  assert.equal((html.match(/class="programme-tab-panel/g) || []).length, 3);
  assert.doesNotMatch(html, /class="programme-days"/);
  assert.doesNotMatch(html, /class="day-schedule"/);

  for (const label of ["Day 1", "Day 2", "Day 3"]) {
    assert.ok(html.includes(`>${label}</label>`), `Missing agenda button: ${label}`);
  }
  assert.doesNotMatch(html, />Gala Dinner<\/label>/);
  assert.doesNotMatch(html, /programme-gala-tab/);
});

test("renders the supplied day headings", () => {
  for (const heading of [
    "Day 1 — Wednesday, 2 December 2026",
    "Opening Ceremony, Keynote Addresses and High-Level Forums",
    "Day 2 — Thursday, 3 December 2026",
    "Entrepreneurship Forum and Academic Parallel Sessions",
    "Day 3 — Friday, 4 December 2026",
    "Sustainable Entrepreneurship, Strategic Collaboration and Conference Closing",
  ]) {
    assert.ok(html.includes(heading), `Missing heading/detail: ${heading}`);
  }
  assert.doesNotMatch(html, /Charity Gala Dinner and Awards Presentation Ceremony/);
  assert.doesNotMatch(html, /Dress Code: Black Tie \/ Formal/);
});

test("preserves the updated agenda times", () => {
  const times = [
    "8.00 a.m.–9.00 a.m.",
    "9.00 a.m.–9.10 a.m.",
    "9.10 a.m.–9.30 a.m.",
    "9.30 a.m.–9.40 a.m.",
    "9.40 a.m.–10.00 a.m.",
    "10.00 a.m.–10.30 a.m.",
    "10.30 a.m.–11.15 a.m.",
    "11.15 a.m.–12.30 p.m.",
    "12.30 p.m.–2.00 p.m.",
    "2.00 p.m.–3.15 p.m.",
    "3.15 p.m.–3.45 p.m.",
    "3.45 p.m.–5.00 p.m.",
    "5.00 p.m.–5.30 p.m.",
    "8.30 a.m.–9.00 a.m.",
    "9.00 a.m.–9.45 a.m.",
    "9.45 a.m.–11.00 a.m.",
    "11.00 a.m.–11.15 a.m.",
    "11.15 a.m.–12.45 p.m.",
    "12.45 p.m.–2.00 p.m.",
    "2.00 p.m.–3.30 p.m.",
    "3.30 p.m.–3.45 p.m.",
    "3.45 p.m.–5.15 p.m.",
    "5.15 p.m.–5.30 p.m.",
    "2.00 p.m.–4.00 p.m.",
    "4.00 p.m.–5.00 p.m.",
  ];

  for (const time of times) {
    assert.ok(html.includes(`<time>${time}</time>`), `Missing schedule time: ${time}`);
  }
});

test("includes the supplied forum, keynote and moderator content", () => {
  const content = [
    "Keynote Session 1",
    "Officiated by the Royal Patron of AiSED, His Highness The Raja Muda of Selangor Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah Alhaj.",
    "AI for Humanity: Shaping Sustainable and Inclusive Futures in the Age of Intelligent Transformation",
    "Forum 1: Diplomacy and Global Affairs",
    "Keynote Session 2",
    "Forum 2: Artificial Intelligence",
    "Keynote Session 3",
    "Forum 3: Entrepreneurship",
    "Keynote Session 4",
    "Forum 4: Sustainable Entrepreneurship",
  ];

  for (const item of content) {
    assert.ok(html.includes(item), `Missing programme content: ${item}`);
  }
});

test("removes speaker columns and person lists from the programme timetable", () => {
  assert.doesNotMatch(html, /<span>Speakers<\/span>/);
  assert.doesNotMatch(html, /class="agenda-row has-speakers"/);
  assert.doesNotMatch(html, /class="agenda-speakers/);
  assert.doesNotMatch(html, /<strong>Keynote Speaker:/);
  assert.doesNotMatch(html, /<strong>Panellists:/);
  assert.doesNotMatch(html, /<strong>Moderator:/);
  assert.doesNotMatch(html, /Sam Majid, Former CEO, National AI Office/);
  assert.doesNotMatch(html, /Kamarul Hisham Baginda FCMI/);
  assert.doesNotMatch(html, /Dr Janeth Emanuel Kigobe/);
  assert.doesNotMatch(html, />Speakers \/ Remarks</);
  assert.doesNotMatch(html, />Remarks</);
  assert.doesNotMatch(html, /Proposed/);
  assert.doesNotMatch(html, /\bPICs?:/);
  assert.doesNotMatch(html, /Proposed Award and Recognition Categories/);
  assert.doesNotMatch(html, /Best Paper Award/);
  assert.doesNotMatch(html, /Summary and Closing Remarks for Day/);
  assert.ok(html.includes("<strong>Summary and Closing Remarks</strong>"));
  assert.doesNotMatch(html, />Speakers \/ Panellists \/ Moderator</);
});

test("removes Gala Dinner from the visible schedule", () => {
  assert.doesNotMatch(html, /gala-panel/);
  assert.doesNotMatch(html, /AiSED Charity Gala Dinner 2026/);
  assert.doesNotMatch(html, /Guest Registration and Welcome Reception/);
  assert.doesNotMatch(html, /AiSED Charity Impact Presentation and Fundraising Video/);
});

test("styles the tabbed agenda layout for desktop and mobile", () => {
  assert.match(css, /\.programme-tab-buttons\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.programme-tab-button\s*\{[^}]*border-radius:\s*999px/s);
  assert.match(css, /#programme-day-1-tab:checked ~ \.programme-tab-buttons label\[for="programme-day-1-tab"\]/s);
  assert.match(css, /\.programme-tab-panel\s*\{[^}]*display:\s*none/s);
  assert.match(css, /#programme-day-1-tab:checked ~ \.day-1-panel,[\s\S]*?#programme-day-3-tab:checked ~ \.day-3-panel\s*\{[^}]*display:\s*block/s);
  assert.doesNotMatch(css, /programme-gala-tab/);
  assert.match(css, /\.agenda-row\s*\{[^}]*grid-template-columns:\s*minmax\(150px,\s*230px\) minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.agenda-row\.no-speakers\s*\{[^}]*grid-template-columns:\s*minmax\(150px,\s*210px\) minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.agenda-row > :nth-child\(2\)\s*\{[^}]*border-left:/s);
  assert.doesNotMatch(css, /\.agenda-row > \* \+ \*/);
  assert.match(css, /\.agenda-speakers \.person::before\s*\{[^}]*content:\s*"•"/s);
  assert.match(css, /\.agenda-row:not\(\.agenda-head\):nth-child\(odd\)\s*\{[^}]*background:\s*rgba\(255,\s*250,\s*241,\s*0\.72\)/s);
  assert.doesNotMatch(css, /\.agenda-row time\s*\{[^}]*background:/s);
  assert.doesNotMatch(css, /\.agenda-speakers\s*\{[^}]*background:/s);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.agenda-row,[\s\S]*?\.agenda-head,[\s\S]*?\.agenda-row\.has-speakers,[\s\S]*?\.agenda-row\.no-speakers\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
