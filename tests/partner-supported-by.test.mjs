import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the partner groups combine Mardhiyyah with strategic and event partners', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  const supportedByPosition = home.indexOf('partner-group supported-by');
  const organisersPosition = home.indexOf('partner-group organisers');

  assert.ok(supportedByPosition >= 0, 'homepage defines a Supported By partner group');
  assert.ok(organisersPosition >= 0, 'homepage identifies the Organisers partner group');
  assert.ok(organisersPosition < supportedByPosition, 'Organisers appears before Supported By');
  assert.equal((home.match(/partner-group strategic/g) ?? []).length, 1, 'all strategic partners share one group');
  assert.match(home, /<h3>Strategic &amp; Event Partners<\/h3>/, 'the partner group is named for both strategic and event partners');
  assert.match(home, /assets\/myceb-logo\.png/, 'homepage references the MyCEB logo asset');
  assert.match(home, /assets\/meet-in-malaysia-logo\.png/, 'homepage references the Meet in Malaysia logo');
  assert.match(home, /assets\/visit-malaysia-2026-logo\.png/, 'homepage references the Visit Malaysia 2026 logo');
  assert.match(home, /assets\/eon-mobility-partner\.jpg/, 'homepage references the EON mobility partner logo');
  assert.match(home, /data-partner-role="Mobility Partner"/, 'homepage identifies EON as the mobility partner');
  assert.match(home, /data-partner-role="Strategic Media &amp; MSME Outreach Partner"/, 'homepage identifies Malaysia SME’s outreach role');
  assert.match(home, /assets\/sitc-venue-partner-logo\.png/, 'homepage references the SITC venue partner logo');
  assert.match(home, /data-partner-role="Venue Partner"/, 'homepage identifies SITC as the venue partner');
  assert.equal((home.match(/class="logo-card partner-modal-trigger"/g) ?? []).length, 11, 'every partner logo opens a modal');
  assert.match(home, /class="partner-group strategic"[\s\S]*?mardhiyyah-hotel-logo\.png/, 'Mardhiyyah appears with strategic and event partners');
  assert.doesNotMatch(home, /partner-group hotel-partner-home/, 'there is no separate hotel-partner card');
  assert.match(home, /id="partner-modal"/, 'homepage defines the shared partner modal');
  assert.match(home, /data-partner-link="\.\.\/hotel\.html"/, 'the hotel reservation link is held for the modal only');
  assert.match(home, /partner-modal-action/, 'the shared modal supports the reservation action');
  assert.match(styles, /\.partner-modal\s*\{/, 'styles define the partner modal overlay');
  assert.match(styles, /\.partner-group\.supported-by/, 'styles lay out the Supported By group');
  assert.match(styles, /\.partner-group\.organisers/, 'styles preserve the Organisers layout');
  assert.match(styles, /\.partner-group\.supported-by\s*\{\s*grid-column:\s*1\s*\/\s*span\s*3;/, 'Supported By sits below Organisers in the left-hand second row');
  assert.match(styles, /\.partner-group\.organisers\s*\{\s*grid-column:\s*1\s*\/\s*span\s*3;/, 'Organisers leads the primary partner row');
});
