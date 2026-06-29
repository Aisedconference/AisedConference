const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "committee.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("uses Tengku Amir Shah's supplied portrait", () => {
  assert.match(
    html,
    /<img[^>]+src="assets\/Committee\/Duli Yang Teramat Mulia Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah\.png"[^>]+alt="Portrait of Duli Yang Teramat Mulia Tengku Amir Shah"/
  );
  assert.ok(
    fs.existsSync(
      path.join(
        root,
        "assets",
        "Committee",
        "Duli Yang Teramat Mulia Tengku Amir Shah ibni Sultan Sharafuddin Idris Shah.png"
      )
    ),
    "Missing the updated Royal Patron portrait asset"
  );
});

test("uses Adam Phung GK's supplied portrait", () => {
  assert.match(
    html,
    /<img[^>]+src="assets\/Committee\/adam-phung-gk-profile\.png"[^>]+alt="Portrait of Adam Phung GK"/
  );
  assert.ok(
    fs.existsSync(path.join(root, "assets", "Committee", "adam-phung-gk-profile.png")),
    "Missing Adam Phung GK portrait asset"
  );
});

test("uses Dato’ Steve Cheah's transparent portrait", () => {
  assert.match(
    html,
    /<img[^>]+src="assets\/Committee\/steve-cheah-profile-transparent\.png"[^>]+alt="Portrait of Dato’ Steve Cheah"/
  );
  assert.ok(
    fs.existsSync(path.join(root, "assets", "Committee", "steve-cheah-profile-transparent.png")),
    "Missing Dato’ Steve Cheah transparent portrait asset"
  );
});

test("uses the Option B uniform directory structure", () => {
  assert.match(html, /class="committee-directory"/);
  assert.equal((html.match(/class="committee-profile-card"/g) || []).length, 19);
  assert.equal((html.match(/class="committee-profile-grid"/g) || []).length, 6);
});

test("preserves the current committee roster", () => {
  for (const name of [
    "Dato’ Steve Cheah",
    "Pn Sharliza Dato' Shamsuddin",
    "Assoc Prof Dr Hartini Ahmad",
  ]) {
    assert.ok(html.includes(name), `Missing ${name}`);
  }
});

test("centers committee titles and consistent card rows", () => {
  assert.match(
    css,
    /\.committee-group-title\s*\{[^}]*text-align:\s*center/s
  );
  assert.match(
    css,
    /\.committee-profile-grid\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;[^}]*justify-content:\s*center/s
  );
  assert.match(
    css,
    /\.committee-profile-card\s*\{[^}]*flex:\s*0 1 calc\(\(100% - 54px\) \/ 4\);[^}]*max-width:\s*260px/s
  );
  assert.match(
    css,
    /@media \(max-width:\s*1100px\)[\s\S]*?\.committee-profile-card\s*\{[^}]*flex-basis:\s*calc\(\(100% - 18px\) \/ 2\)/
  );
  assert.match(
    css,
    /@media \(max-width:\s*640px\)[\s\S]*?\.committee-profile-card\s*\{[^}]*flex-basis:\s*100%/
  );
});

test("uses the annotated portrait background and centered profile text", () => {
  assert.match(
    css,
    /\.committee-portrait\s*\{[^}]*background:\s*#f5f5f5/s
  );
  assert.match(
    css,
    /\.committee-portrait img\s*\{[^}]*background:\s*#f5f5f5/s
  );
  assert.match(
    css,
    /\.committee-profile-copy\s*\{[^}]*text-align:\s*center/s
  );
});

test("fills every filename-matched committee portrait and leaves only Noorshella blank", () => {
  const expectedCommitteeAssets = [
    "Dato’ Professor Dr Nik Maheran Nik Muhammad.png",
    "Prof Dato' Dr Ansary Ahmed.png",
    "Prof Dr Noor Raihan Ab Hamid.png",
    "Datin Rahmah Kassim.png",
    "Pn Sharliza Dato' Shamsuddin .png",
    "Philip Lim_AeU-SPEED.png",
    "Pn Zuraida Jusoh .png",
    "Priscilla Selvaraju.png",
    "⁠Juliana Shaharudin .png",
    "Mohd Fadzil Khairuddin.png",
    "Nor Shahirah Mohd Noordin.png",
    "Nur Zuriayati Binti Mohd Zainun.png",
    "Nurin Shahira Mohd Yunus.png",
    "Assoc Prof Dr Hartini Ahmad .png",
  ];

  for (const filename of expectedCommitteeAssets) {
    assert.ok(
      html.includes(`src="assets/Committee/${filename}"`),
      `Missing committee portrait reference for ${filename}`
    );
    assert.ok(
      fs.existsSync(path.join(root, "assets", "Committee", filename)),
      `Missing committee portrait file for ${filename}`
    );
  }

  assert.equal(
    (html.match(/class="committee-portrait committee-initials"/g) || []).length,
    1
  );
  assert.match(
    html,
    /<div class="committee-portrait committee-initials" aria-hidden="true">CN<\/div><div class="committee-profile-copy"><strong>Assoc Prof Dr Noorshella Che Nawi<\/strong>/
  );
});

test("uses consistent image fitting for every committee portrait", () => {
  assert.match(
    css,
    /\.committee-portrait img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*contain;[^}]*object-position:\s*center/s
  );
});
