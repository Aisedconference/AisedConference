const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "speakers.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const portraits = [
  {
    src: "assets/tengku-amir-shah-profile.jpg",
    alt: "His Highness The Raja Muda of Selangor Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah Alhaj",
  },
  {
    src: "assets/steve-cheah-speaker.png",
    alt: "Dato' Steve Cheah",
  },
  {
    src: "assets/Committee/Dato’ Professor Dr Nik Maheran Nik Muhammad.png",
    alt: "Dato' Prof. Dr. Nik Maheran binti Nik Muhammad",
  },
  {
    src: "assets/Committee/Prof Dato' Dr Ansary Ahmed.png",
    alt: "Prof Dato' Dr Ansary Ahmed",
  },
  {
    src: "assets/ts-zehan-teoh-speaker.png",
    alt: "Ts. Zehan Teoh",
  },
  {
    src: "assets/Committee/Kamarul Hisham Baginda.png",
    alt: "Kamarul Hisham Baginda FCMI",
  },
  {
    src: "assets/sam-majid-speaker.jpg",
    alt: "Sam Majid",
  },
  {
    src: "assets/Committee/Dr Janeth Emanuel Kigobe.png",
    alt: "Dr. Janeth Emanuel Kigobe",
  },
];

for (const portrait of portraits) {
  test(`uses the approved portrait for ${portrait.alt}`, () => {
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

test("shows the approved speaker categories and organisation titles", () => {
  const profiles = [
    {
      badge: "Keynote Speaker",
      name: "Dato' Steve Cheah",
      role: "Chairman of AiSED",
    },
    {
      badge: "Keynote Speaker",
      name: "Dato' Prof. Dr. Nik Maheran binti Nik Muhammad",
      role: "Executive Co-Chair, AiSED",
    },
    {
      badge: "Keynote Speaker",
      name: "Prof Dato' Dr Ansary Ahmed",
      role: "Founder President, Asia e University",
    },
    {
      badge: "Speaker",
      name: "Ts. Zehan Teoh",
      role: " Chief Transformation Officer, The MUI Group and Seating Expert of AiSED",
    },
    {
      badge: "Moderator",
      name: "Kamarul Hisham Baginda FCMI",
      role: "Adjunct. Professor of Asia e University &amp; Fellow of Chartered Management Institute, UK",
    },
    {
      badge: "Speaker",
      name: "Sam Majid",
      role: "Former CEO of National AI Office",
    },
    {
      badge: "Speaker",
      name: "Adj. Prof. Dr. Behrang (Hani) Parhizkar",
      role: "CEO of ChamRun Academy",
    },
    {
      badge: "Moderator",
      name: "Dr. Janeth Emanuel Kigobe",
      role: "Dean of Faculty of Education &amp; Co-Chair, UNESCO Chair on Teacher &amp; Curriculum, Open University Tanzania",
    },
  ];

  for (const profile of profiles) {
    assert.ok(
      html.includes(
        `<span>${profile.badge}</span>\n            <h3>${profile.name}</h3>\n            <p>${profile.role}</p>`
      ),
      `Missing approved profile content for ${profile.name}`
    );
  }
});

test("uses eight consistently formatted speaker profile cards", () => {
  assert.equal((html.match(/class="speaker-card profile-speaker-card"/g) || []).length, 8);
  assert.equal((html.match(/class="speaker-avatar royal-avatar speaker-profile-photo"/g) || []).length, 8);
});

test("shows the added forum assignments for moderators and speaker", () => {
  for (const session of [
    "Opening Ceremony and High-Level Forums",
    "Conference Chair and Keynote Addresses",
    "Entrepreneurship Forum and Academic Parallel Sessions",
    "Forum 2: Artificial Intelligence",
    "Forum 3: Entrepreneurship",
    "Forum 4: Sustainable Entrepreneurship",
  ]) {
    assert.ok(html.includes(session), `Missing speaker session label: ${session}`);
  }
});

test("lays out speaker profiles as a left-aligned three-column grid", () => {
  assert.match(
    css,
    /\.profile-grid\s*\{[^}]*max-width:\s*none;[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);[^}]*justify-items:\s*stretch/s
  );
  assert.match(
    css,
    /\.profile-speaker-card\s*\{[^}]*grid-template-columns:\s*112px minmax\(0,\s*1fr\);[^}]*align-items:\s*start/s
  );
  assert.match(
    css,
    /\.profile-copy\s*\{[^}]*justify-items:\s*start;[^}]*text-align:\s*left/s
  );
});
