const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('NAPEI appears as a strategic partner with its logo and supplied profile', () => {
  const home = fs.readFileSync(path.join(root, 'home/index.html'), 'utf8');
  const strategic = home.split('class="partner-row strategic"')[1]?.split('class="partner-row exhibitors"')[0];
  assert.ok(strategic, 'strategic partner section exists');
  const card = strategic.match(/<article[^>]*data-partner-name="NAPEI"[^>]*>.*?<\/article>/s)?.[0];
  assert.ok(card, 'NAPEI card appears among strategic partners');
  assert.match(card, /data-partner-role="Strategic Partner"/);
  assert.match(card, /assets\/napei-partner-logo\.jpg/);
  for (const detail of ['National Association of Private Educational Institutions', '15 September 1987', 'Subang Jaya', 'early childhood centres', 'MOE', 'MOHE', 'MOTAC', 'EduPlus', 'Private Education Excellence Awards']) {
    assert.ok(card.includes(detail), `NAPEI profile includes ${detail}`);
  }
  assert.ok(fs.existsSync(path.join(root, 'assets/napei-partner-logo.jpg')), 'NAPEI logo file exists');
});

test('strategic partner logos follow the requested sequence', () => {
  const home = fs.readFileSync(path.join(root, 'home/index.html'), 'utf8');
  const strategic = home.split('class="partner-row strategic"')[1]?.split('class="partner-row exhibitors"')[0];
  assert.ok(strategic, 'strategic partner section exists');
  const names = [...strategic.matchAll(/data-partner-name="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(names, [
    'UNESCO EE-Net Southeast Asia',
    'EON Berhad',
    'Malaysia SME',
    'NAPEI',
    'Selangor International Trade Centre (SITC) (Previously known as SACC)',
    'Mardhiyyah Hotel &amp; Suites',
  ]);
});

test('homepage exhibitor logos include the confirmed organisations in the requested order', () => {
  const home = fs.readFileSync(path.join(root, 'home/index.html'), 'utf8');
  const exhibitors = home.split('class="partner-row exhibitors"')[1]?.split('class="partner-row supported-by"')[0];
  assert.ok(exhibitors, 'exhibitor section exists');
  const cards = [...exhibitors.matchAll(/<article[^>]*data-partner-name="([^"]+)"[^>]*><img src="([^"]+)"[^>]*><\/article>/g)];
  assert.deepEqual(cards.map((match) => match[1]), [
    'AiSED',
    'Asia e University',
    'GAINE Academy',
    'EON Berhad',
    'SAS',
    'Tec D Distribution (M) Sdn. Bhd.',
    'Pesona Kraft by Dania',
  ]);
  for (const [, , image] of cards) {
    assert.ok(fs.existsSync(path.join(root, 'home', image.split('?')[0])), `${image} is available`);
  }
});
