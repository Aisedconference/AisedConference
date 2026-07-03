const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "speakers.html"), "utf8");

const portraits = [
  {
    src: "assets/tengku-amir-shah-profile.jpg",
    alt: "Duli Yang Teramat Mulia Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah",
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
      role: "AiSED",
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

test("uses four consistently formatted speaker profile cards", () => {
  assert.equal((html.match(/class="speaker-card profile-speaker-card"/g) || []).length, 4);
  assert.equal((html.match(/class="speaker-avatar royal-avatar speaker-profile-photo"/g) || []).length, 4);
});
