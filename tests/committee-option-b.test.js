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
  assert.equal((html.match(/class="committee-profile-card"/g) || []).length, 21);
  assert.equal((html.match(/class="committee-profile-grid"/g) || []).length, 6);
});

test("preserves the current committee roster", () => {
  for (const name of [
    "Dato’ Steve Cheah",
    "Pn Sharliza Dato' Shamsuddin",
    "Assoc Prof Dr Hartini Ahmad",
    "Priscilla Selvaraju",
    "Juliana Shaharudin",
    "Mohd Fadzil Khairuddin",
    "Nor Shahirah Mohd Noordin",
    "Nur Zuriayati Mohd Zainun",
    "Nurin Shahira Mohd Yunus",
  ]) {
    assert.ok(html.includes(name), `Missing ${name}`);
  }
});

test("uses full Asia e University wording without changing existing role titles", () => {
  assert.match(html, /<strong>Prof Dato' Dr Ansary Ahmed<\/strong><p>Founder President, Asia e University<\/p>/);
  assert.match(html, /<strong>Prof Dr Noor Raihan Ab Hamid<\/strong><p>Vice Chancellor, Asia e University<\/p>/);
  assert.match(
    html,
    /<strong>Philip Lim<\/strong><p>Head, School of Professional and Executive Education Development, Asia e University \(AeU-SPEED\)\.<\/p>/
  );
  assert.match(
    html,
    /<strong>Nor Shahirah Mohd Noordin<\/strong><p>Marketing and Outreach, \(AeU-SPEED\)<\/p>/
  );
  assert.match(
    html,
    /<strong>Nur Zuriayati Mohd Zainun<\/strong><p>Business Operations and Programme Management, \(AeU-SPEED\)<\/p>/
  );
  assert.match(
    html,
    /<strong>Nurin Shahira Mohd Yunus<\/strong><p>Partnerships and Client Engagement, \(AeU-SPEED\)<\/p>/
  );
  assert.match(
    html,
    /<strong>Assoc Prof Dr Hartini Ahmad<\/strong><p>Head of Research Innovation Management Unit, Asia e University<\/p>/
  );
  assert.doesNotMatch(html, /, AeU(?:-SPEED)?<\/p>/);
});

test("adds Swa Lee Lee and Sanura Jaya to the academic committee", () => {
  const expectedMembers = [
    {
      name: "Assoc Prof Dr Swa Lee Lee",
      role: "Director, School of Graduate Studies, Asia e University",
      filename: "Assoc Prof Dr Swa Lee Lee.png",
    },
    {
      name: "Dr Sanura Jaya",
      role: "Visiting Assoc. Professor, Asia e University",
      filename: "Dr Sanura Jaya.png",
    },
  ];

  for (const member of expectedMembers) {
    assert.ok(html.includes(`<strong>${member.name}</strong><p>${member.role}</p>`));
    assert.match(
      html,
      new RegExp(`<img[^>]+src="assets/Committee/${member.filename.replace(".", "\\.")}"[^>]+alt="Portrait of ${member.name}"`)
    );
    assert.ok(
      fs.existsSync(path.join(root, "assets", "Committee", member.filename)),
      `Missing portrait file for ${member.name}`
    );
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

test("fills every filename-matched committee portrait", () => {
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
    "Assoc Prof Dr Noorshella Che Nawi.png",
    "Assoc Prof Dr Swa Lee Lee.png",
    "Dr Sanura Jaya.png",
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
    0
  );
  assert.match(
    html,
    /<img[^>]+src="assets\/Committee\/Assoc Prof Dr Noorshella Che Nawi\.png"[^>]+alt="Portrait of Assoc Prof Dr Noorshella Che Nawi"/
  );
});

test("uses consistent image fitting for every committee portrait", () => {
  assert.match(
    css,
    /\.committee-portrait img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*contain;[^}]*object-position:\s*center/s
  );
});
