const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "programme.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses three chronological day schedules instead of the coarse matrix", () => {
  assert.equal((html.match(/class="programme-day"/g) || []).length, 3);
  assert.equal((html.match(/class="day-schedule"/g) || []).length, 3);
  assert.doesNotMatch(html, /<table class="programme-matrix"/);
  assert.doesNotMatch(html, /<ul>|<li>/);

  for (const date of [
    "2 Dec 2026 (Wed)",
    "3 Dec 2026 (Thurs)",
    "4 Dec 2026 (Fri)",
  ]) {
    assert.ok(html.includes(date), `Missing programme date: ${date}`);
  }
});

test("preserves every supplied programme time", () => {
  const times = [
    "08.00 a.m. – 09.00 a.m.",
    "09.00 a.m. – 09.10 a.m.",
    "09.10 a.m. – 09.30 a.m.",
    "09.30 a.m. – 09.40 a.m.",
    "09.40 a.m. – 10.00 a.m.",
    "10.00 a.m. – 10.30 a.m.",
    "10.30 a.m. – 11.15 a.m.",
    "11.15 a.m. – 12.00 p.m.",
    "12.00 p.m. – 14.00 p.m.",
    "14.00 p.m. – 15.15 p.m.",
    "15.15 p.m. – 15.45 p.m.",
    "15.45 p.m. – 17.00 p.m.",
    "17.00 p.m. – 17.30 p.m.",
    "08.30 a.m. – 09.00 a.m.",
    "09. 00 a.m. – 09.45 a.m.",
    "09.45 a.m. – 11.00 a.m.",
    "11.00 a.m. – 11.15 a.m.",
    "11.15 a.m. – 12.45 p.m.",
    "12.45 p.m. – 14.00 p.m.",
    "14.00 p.m. – 15.30 p.m.",
    "15.30 p.m. – 15.45 p.m.",
    "15.45 p.m. – 17.15 p.m.",
    "17.15 p.m. – 17.30 p.m.",
    "08:30 a.m. – 09.00 a.m.",
    "09:00 a.m. – 10:15 a.m.",
    "10:15 a.m. – 10:45 a.m.",
    "10:45 a.m. – 12:00 p.m.",
    "12:00 p.m. – 12:45 p.m.",
    "12:45 p.m. – 14:00 p.m.",
    "14:00 p.m. – 16:00 p.m.",
    "16:00 p.m. – 17:00 p.m.",
    "19:00 p.m. – 22:00 p.m.",
  ];

  for (const time of times) {
    assert.ok(html.includes(`<time>${time}</time>`), `Missing schedule time: ${time}`);
  }
});

test("renders keynote and forum labels without bullets", () => {
  const sessions = {
    "Keynote Session 1": "AI for Humanity: Shaping Sustainable and Inclusive Futures in the Age of Intelligent Transformation",
    "Keynote Session 2": "The New Global Leadership Imperative: Entrepreneurship, Diplomacy and Collaboration in an AI-Driven Era",
    "Keynote Session 3": "From Disruption to Transformation: Building Resilient Innovation Ecosystems in the AI Economy",
    "Forum 1": "The New Global Order: AI, Geopolitical Competition and Economic Stability",
    "Forum 2": "Beyond Automation: AI as a Catalyst for Sustainable Development and Human Advancement",
    "Forum 3": "Entrepreneurship 5.0: Building Future-Ready Ventures in the AI Economy",
    "Forum 4": "Sustainable Entrepreneurship for a Resilient Future: Innovating Solutions to Global Challenges",
  };

  for (const [label, title] of Object.entries(sessions)) {
    assert.ok(html.includes(`<strong>${label}:</strong>`), `Missing ${label}`);
    assert.ok(html.includes(`<span>${title}</span>`), `Missing title for ${label}`);
  }
});

test("styles the new schedule for desktop and mobile", () => {
  assert.match(css, /\.programme-days\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.schedule-row\s*\{[^}]*grid-template-columns:\s*minmax\(190px,\s*250px\) minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.schedule-item strong,[\s\S]*?\.schedule-item span\s*\{[^}]*display:\s*block/s);
  assert.match(css, /@media \(max-width:\s*640px\)[\s\S]*?\.schedule-row\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
