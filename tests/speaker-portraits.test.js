const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const direct = fs.readFileSync(path.join(root, "speakers.html"), "utf8");
const published = fs.readFileSync(path.join(root, "speakers", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("adds the two agenda-listed keynote speakers with supplied local portraits", () => {
  const keynotes = [
    {
      asset: "assets/yb-tuan-akmal-nasrullah-mohd-nasir.png",
      name: "Y.B. Tuan Akmal Nasrullah Mohd Nasir",
      date: "2 Dec 26 (Wed) · 9.30 a.m.–10.15 a.m.",
      session: "Keynote Session 1",
      anchor: "keynote-session-1",
      title: "AI for Humanity: Shaping Sustainable and Inclusive Futures in the Age of Intelligent Transformation",
      role: "Minister of Economy, Malaysia",
    },
    {
      asset: "assets/maki-katsuno-hayashikawa.jpeg",
      name: "Maki Katsuno-Hayashikawa",
      date: "4 Dec 26 (Fri) · 9.00 a.m.–9.45 a.m.",
      session: "Keynote Session 4",
      anchor: "keynote-session-4",
      title: "Future-Ready ASEAN: Developing Human Capital, Entrepreneurship and Innovation for the AI Era",
      role: "Director of UNESCO Multisectoral Regional Office in Jakarta / UNESCO Representative to Indonesia, Brunei, Malaysia, The Philippines and Timor Leste",
    },
  ];

  for (const keynote of keynotes) {
    assert.ok(fs.existsSync(path.join(root, keynote.asset)), `Missing portrait asset ${keynote.asset}`);
    for (const page of [direct, published]) {
      assert.match(page, new RegExp(`src=\"(?:\.\.\/)?${keynote.asset}\" alt=\"${keynote.name}\"`));
      assert.ok(page.includes(`<strong>${keynote.name}</strong>`), `Missing profile for ${keynote.name}`);
      assert.ok(page.includes(`href="${page === direct ? "programme/" : "../programme/"}#${keynote.anchor}"`), `Missing programme link for ${keynote.name}`);
      assert.ok(page.includes(`<span class="speaker-session-date">${keynote.date}</span>`), `Missing schedule timing for ${keynote.name}`);
      assert.ok(page.includes(`<p class="speaker-session-title">${keynote.title}</p>`), `Missing session title for ${keynote.name}`);
      assert.ok(page.includes(`<p>${keynote.role}</p>`), `Missing role for ${keynote.name}`);
      assert.ok(page.includes(`>${keynote.session}</a>`), `Missing session label for ${keynote.name}`);
    }
  }
});

test("removes speaker profiles absent from the 27 October schedule", () => {
  for (const page of [direct, published]) {
    assert.doesNotMatch(page, /Tan Sri Abd\. Rahman Mamat/);
    assert.doesNotMatch(page, /Dato’ Dr\. Ahmad Faisal Muhammad/);
  }
});

test("aligns forum directory timings and names with the current agenda", () => {
  for (const page of [direct, published]) {
    assert.match(page, /Forum 1 - 2nd Dec 26 \(Wed\)<\/span><span>Time: 10\.45 a\.m\.–12\.00 p\.m\./);
    assert.match(page, /Forum 2 - 2nd Dec 26 \(Wed\)<\/span><span>Time: 3\.30 p\.m\.–4\.45 p\.m\./);
    assert.match(page, /<strong>H\.E\. SHIKATA Noriyuki<\/strong>/);
    assert.match(page, /<strong>H\.E\. Dr\. KAROMIDIN GADOEV<\/strong>/);
    assert.match(page, /<strong>H\.E\. Jodi Robinson<\/strong>/);
    assert.match(page, /<strong>Ambassador Dato’ Aminahtun Karim<\/strong>/);
    assert.match(page, /<strong>Suwanchai Lohawatanakul<\/strong>/);
  }
});

test("uses the standardised title punctuation across agenda-linked speaker names", () => {
  for (const name of [
    "Prof. Dato’ Dr. Nik Maheran Nik Muhammad",
    "Prof. Dato’ Dr. Ansary Ahmed",
    "Prof. Emeritus Datuk Ts. Ir. Dr. Siti Hamisah Tapsir",
    "Adj. Prof. Dr. Behrang “Hani” Parhizkar",
    "Dr. Pietro Borsano",
    "Prof. Dato’ Dr. Noor Azizi bin Ismail",
    "Dato’ Dr. Kamarul A. Muhamed",
    "Dr. Kamarul Hisham Baginda, FCMI",
    "Prof. Dr. Noor Raihan Ab. Hamid",
    "Prof. Ts. Dr. Visweswara Rao Pasupuleti, FAPAS, FMSA, FIAAM",
    "Dr. Janeth Emanuel Kigobe",
  ]) assert.ok(published.includes(`<strong>${name}</strong>`), `Missing standardised title for ${name}`);
  const displayedNames = [...published.matchAll(/<strong>([^<]+)<\/strong>/g)].map((match) => match[1]).join("\n");
  assert.doesNotMatch(displayedNames, /Professor Dr\.|\bDr [A-Z]|\bProf [A-Z]|\bTs [A-Z]/);
});

test("keeps the responsive speaker-directory layout", () => {
  assert.match(css, /\.keynote-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(320px,\s*1fr\)\)/s);
  assert.match(css, /\.forum-speaker-row\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.speaker-session-link\s*\{/);
  assert.match(css, /\.speaker-session-date\s*\{/);
});
