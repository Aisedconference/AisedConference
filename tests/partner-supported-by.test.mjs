import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('one shared partner panel keeps Organisers, Strategic and Event Partners, and Supported By in separate rows', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  const organisersPosition = home.indexOf('partner-row organisers');

  assert.ok(organisersPosition >= 0, 'homepage identifies the Organisers row');
  const supportedByPosition = home.indexOf('partner-row supported-by');
  const strategicPosition = home.indexOf('partner-row strategic');

  assert.ok(organisersPosition < strategicPosition, 'Organisers appears above Strategic and Event Partners');
  assert.ok(strategicPosition < supportedByPosition, 'Strategic and Event Partners appears above Supported By');
  assert.match(home, /class="partner-panel"[\s\S]*?partner-row organisers[\s\S]*?partner-row strategic[\s\S]*?partner-row supported-by/, 'all three rows share one partner panel');
  assert.equal((home.match(/partner-row strategic/g) ?? []).length, 1, 'all strategic partners share one row');
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
  assert.match(home, /class="partner-row strategic"[\s\S]*?mardhiyyah-hotel-logo\.png/, 'Mardhiyyah appears with strategic and event partners');
  assert.doesNotMatch(home, /partner-group hotel-partner-home/, 'there is no separate hotel-partner card');
  assert.match(home, /id="partner-modal"/, 'homepage defines the shared partner modal');
  assert.match(home, /data-partner-link="\.\.\/hotel\.html"/, 'the hotel reservation link is held for the modal only');
  assert.match(home, /partner-modal-action/, 'the shared modal supports the reservation action');
  assert.match(styles, /\.partner-modal\s*\{/, 'styles define the partner modal overlay');
  assert.match(styles, /\.partner-panel\s*\{/, 'styles define the shared outer partner panel');
  assert.match(styles, /\.partner-row\s+\.logo-wall\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/, 'every partner row uses three desktop logo positions');
});
