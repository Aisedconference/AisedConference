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
