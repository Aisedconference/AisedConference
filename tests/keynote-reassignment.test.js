const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('speaker and programme routes show Maki in keynote 2 and Andrew in keynote 3 without Zhen', () => {
  for (const [speakerRoute, programmeRoute] of [
    ['speakers.html', 'programme.html'],
    ['speakers/index.html', 'programme/index.html'],
  ]) {
    const speakers = fs.readFileSync(path.join(root, speakerRoute), 'utf8');
    const programme = fs.readFileSync(path.join(root, programmeRoute), 'utf8');
    assert.doesNotMatch(speakers + programme, /Zhen Rixin/);
    assert.equal((speakers.match(/<strong>Maki Katsuno-Hayashikawa<\/strong>/g) || []).length, 1);
    assert.match(speakers, /Maki Katsuno-Hayashikawa<\/strong>[\s\S]*?Keynote Session 2[\s\S]*?2 Dec 26 \(Wed\) · 2\.30 p\.m\.–3\.15 p\.m\.[\s\S]*?Future-Ready ASEAN/);
    assert.match(speakers, /Andrew Khoo<\/strong>[\s\S]*?Keynote Session 3[\s\S]*?3 Dec 26 \(Thu\) · 9\.00 a\.m\.–9\.45 a\.m\./);
    assert.match(programme, /id="keynote-session-2"[^>]*>[\s\S]*?Maki Katsuno-Hayashikawa/);
    assert.match(programme, /id="keynote-session-3"[^>]*>[\s\S]*?Andrew Khoo/);
    const keynoteFour = programme.match(/id="keynote-session-4"[^>]*>[^\n]*/)?.[0] || '';
    assert.doesNotMatch(keynoteFour, /Maki Katsuno-Hayashikawa/);
  }
  assert.ok(fs.existsSync(path.join(root, 'assets/andrew-khoo-speaker.jpg')));
});
