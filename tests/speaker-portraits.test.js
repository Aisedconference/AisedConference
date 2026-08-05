const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "speakers.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const portraits = [
  {
    src: "assets/Committee/Duli Yang Teramat Mulia Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah.png",
    alt: "Portrait of Duli Yang Teramat Mulia Tengku Amir Shah",
  },
  {
    src: "assets/steve-cheah-speaker.png",
    alt: "Dato’ Steve Cheah",
  },
  {
    src: "assets/Committee/Dato’ Professor Dr Nik Maheran Nik Muhammad.png",
    alt: "Dato’ Professor Dr Nik Maheran Nik Muhammad",
  },
  {
    src: "assets/Committee/Prof Dato' Dr Ansary Ahmed.png",
    alt: "Prof Dato’ Dr Ansary Ahmed",
  },
  {
    src: "assets/amb-shikata-noriyuki-speaker.png",
    alt: "H.E. SHIKATA Noriyuki",
  },
  {
    src: "assets/amb-karomidin-gadoev-speaker.png",
    alt: "H.E. Dr. KAROMIDIN GADOEV",
  },
  {
    src: "assets/sam-majid-speaker.jpg",
    alt: "Sam Majid",
  },
  {
    src: "assets/Committee/Adj. Prof. Dr. Behrang (Hani) Parhizkar.png",
    alt: "Adj. Prof. Dr Behrang “Hani” Parhizkar",
  },
  {
    src: "assets/Committee/Kamarul Hisham Baginda.png",
    alt: "Kamarul Hisham Baginda FCMI",
  },
  {
    src: "assets/Committee/Dr Janeth Emanuel Kigobe.png",
    alt: "Dr Janeth Emanuel Kigobe",
  },
  {
    src: "assets/ts-zehan-teoh-speaker.png",
    alt: "Ts. Zehan Teoh",
  },
];

for (const portrait of portraits) {
  test(`uses the available speaker portrait for ${portrait.alt}`, () => {
    assert.ok(
      html.includes(`src="${portrait.src}" alt="${portrait.alt}"`),
      `Missing speaker portrait markup for ${portrait.alt}`
    );
    assert.ok(
      fs.existsSync(path.join(root, portrait.src)),
      `Missing speaker portrait file ${portrait.src}`
    );
  });
}

test("arranges visible photo speakers by the available agenda structure", () => {
  const orderedHeadings = [
    "Royal Patron",
    "Keynote Speakers",
    "Forum 1",
    "Forum 2",
    "Forum 3",
    "Forum 4",
  ];

  let previousIndex = -1;
  for (const heading of orderedHeadings) {
    const currentIndex = html.indexOf(heading);
    assert.ok(currentIndex > previousIndex, `Expected ${heading} to appear after the prior section`);
    previousIndex = currentIndex;
  }

  assert.doesNotMatch(html, /Forum 5/);
});

test("matches the Royal Patron wording and layout from the committee page", () => {
  assert.ok(html.includes("Royal Patron of AiSED"));
  assert.ok(html.includes("His Highness The Raja Muda of Selangor Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah Alhaj"));
  assert.ok(html.indexOf("Royal Patron of AiSED") < html.indexOf("Portrait of Duli Yang Teramat Mulia Tengku Amir Shah"));
  assert.ok(html.indexOf("Portrait of Duli Yang Teramat Mulia Tengku Amir Shah") < html.indexOf("His Highness The Raja Muda of Selangor Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah Alhaj"));
  assert.match(css, /\.featured-speaker\s*\{[^}]*grid-template-columns:\s*170px minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.committee-profile-card\.speaker-agenda-card\.featured-speaker\s*\{[^}]*max-width:\s*980px/s);
});

test("shows the three keynote speakers with photos", () => {
  const keynotes = [
    {
      name: "Dato’ Steve Cheah",
      session: "Keynote Session 1",
      date: "2 Dec 26 (Wed) · 10.30 a.m.–11.15 a.m.",
      title: "AI for Humanity: Shaping Sustainable and Inclusive Futures",
      href: "programme.html#keynote-session-1",
    },
    {
      name: "Dato’ Professor Dr Nik Maheran Nik Muhammad",
      session: "Welcome Address",
      date: "2 Dec 26 (Wed) · 9.00 a.m.–9.10 a.m.",
      title: "Welcome Address by the Conference Chair",
      href: "programme.html#welcome-address-conference-chair",
    },
    {
      name: "Prof Dato’ Dr Ansary Ahmed",
      session: "Keynote Session 3",
      date: "3 Dec 26 (Thu) · 9.00 a.m.–9.45 a.m.",
      title: "Building Resilient Innovation Ecosystems in the AI Economy",
      href: "programme.html#keynote-session-3",
    },
  ];

  for (const keynote of keynotes) {
    assert.ok(html.includes(`<strong>${keynote.name}</strong>`), `Missing keynote profile for ${keynote.name}`);
    assert.ok(html.includes(`href="${keynote.href}"`), `Missing timetable link for ${keynote.name}`);
    assert.ok(html.includes(`>${keynote.session}</a>`), `Missing keynote session for ${keynote.name}`);
    assert.ok(html.includes(`<span class="speaker-session-date">${keynote.date}</span>`), `Missing compact keynote date for ${keynote.name}`);
    assert.ok(html.includes(`<p class="speaker-session-title">${keynote.title}</p>`), `Missing compact keynote title for ${keynote.name}`);
  }
  assert.doesNotMatch(html, /<dt>Keynote Session:<\/dt>/);
  assert.match(css, /\.speaker-session-link\s*\{/);
  assert.match(css, /\.speaker-session-date\s*\{/);
  assert.match(css, /\.speaker-session-title\s*\{/);
  assert.match(css, /\.keynote-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(320px,\s*1fr\)\)/s);
});

test("temporarily hides proposed speaker profiles without photos", () => {
  for (const hiddenName of [
    "Tengku Datuk Seri Utama Zafrul Tengku Abdul Aziz",
    "Tan Sri Tony Fernandes",
    "Tan Sri Abd. Rahman Mamat",
    "Datuk Wira Dr Asyraf Wajdi Dusuki",
    "Datuk Jojie Samuel",
    "Badzlan Bakar",
    "Dr Pietro Borsano",
    "Jonathan Chong",
  ]) {
    assert.ok(!html.includes(hiddenName), `Expected ${hiddenName} to be hidden until a photo is available`);
  }
  assert.doesNotMatch(html, /speaker-initials/);
});

test("groups each visible forum moderator and panellist in the same speaker row", () => {
  const forumGroups = html.match(/<section class="speaker-forum-group"[\s\S]*?<\/section>/g) || [];
  assert.equal(forumGroups.length, 4);

  const expected = [
    {
      title: "Diplomacy and Global Affairs",
      date: "Forum 1 - 2nd Dec 26 (Wed)",
      time: "Time: 11.15 a.m.–12.30 p.m.",
      panellists: ["H.E. SHIKATA Noriyuki", "H.E. Dr. KAROMIDIN GADOEV"],
    },
    {
      title: "Artificial Intelligence",
      date: "Forum 2 - 2nd Dec 26 (Wed)",
      time: "Time: 3.45 p.m.–5.00 p.m.",
      panellists: ["Sam Majid", "Adj. Prof. Dr Behrang “Hani” Parhizkar"],
    },
    {
      title: "Entrepreneurship",
      date: "Forum 3 - 3rd Dec 26 (Thu)",
      time: "Time: 9.45 a.m.–11.00 a.m.",
      moderator: "Kamarul Hisham Baginda FCMI",
      panellists: [],
    },
    {
      title: "Sustainable Entrepreneurship",
      date: "Forum 4 - 4th Dec 26 (Fri)",
      time: "Time: 9.45 a.m.–11.00 a.m.",
      moderator: "Dr Janeth Emanuel Kigobe",
      panellists: ["Ts. Zehan Teoh"],
    },
  ];

  expected.forEach((forum, index) => {
    const group = forumGroups[index];
    assert.ok(group.includes(forum.title), `Missing forum title ${forum.title}`);
    assert.ok(group.includes(forum.date), `Missing forum date ${forum.date}`);
    assert.ok(group.includes(forum.time), `Missing forum timing ${forum.time}`);
    assert.ok(group.includes("forum-speaker-row"), `Forum ${index + 1} does not use one speaker row`);
    if (forum.moderator) {
      assert.ok(group.includes(">Moderator<"), `Forum ${index + 1} missing moderator label`);
      assert.ok(group.includes(`<strong>${forum.moderator}</strong>`), `Forum ${index + 1} missing moderator ${forum.moderator}`);
    }

    for (const panellist of forum.panellists) {
      assert.ok(group.includes(">Panellist<"), `Forum ${index + 1} missing panellist label`);
      assert.ok(group.includes(`<strong>${panellist}</strong>`), `Forum ${index + 1} missing panellist ${panellist}`);
    }
  });

  assert.doesNotMatch(html, /Proposed Panellist|Proposed Moderator/);
});

test("uses a simple committee-style photo directory layout", () => {
  assert.equal((html.match(/class="committee-profile-card speaker-agenda-card/g) || []).length, 11);
  assert.equal((html.match(/class="committee-portrait"/g) || []).length, 11);
  assert.match(css, /\.speaker-agenda-card\s*\{[^}]*grid-template-columns:\s*112px minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.committee-profile-card\.speaker-agenda-card\s*\{[^}]*max-width:\s*none/s);
  assert.match(css, /\.committee-profile-card\.speaker-agenda-card \.committee-portrait\s*\{[^}]*width:\s*112px/s);
  assert.match(css, /\.forum-speaker-row\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(320px,\s*1fr\)\)/s);
  assert.match(css, /\.moderator-card\s*\{/);
  assert.match(css, /\.speaker-forum-group\s*\{[^}]*border:\s*1px solid var\(--line\)/s);
  assert.match(css, /\.featured-speaker \.committee-portrait/s);
});
