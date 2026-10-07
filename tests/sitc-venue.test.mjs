import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('public venue copy uses SITC and the homepage includes it as the Venue Partner', async () => {
  const [home, landing, venue, sponsorship] = await Promise.all([
    readFile(new URL('home/index.html', root), 'utf8'),
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('venue.html', root), 'utf8'),
    readFile(new URL('sponsorship-alt.html', root), 'utf8')
  ]);

  for (const page of [home, landing, venue, sponsorship]) {
    assert.doesNotMatch(page, /Shah Alam Convention Centre/i);
    assert.match(page, /Selangor International Trade Centre/i);
  }

  assert.match(home, /data-partner-role="Venue Partner"/);
  assert.match(home, /data-partner-name="Selangor International Trade Centre \(SITC\)"/);
  assert.match(home, /sitc-venue-partner-logo\.png/);
  assert.match(home, /aised-hero-sitc\.png/);
});
