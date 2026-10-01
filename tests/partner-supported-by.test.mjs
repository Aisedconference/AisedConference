import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the partner groups use the requested two-row sequence', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  const supportedByPosition = home.indexOf('partner-group supported-by');
  const organisersPosition = home.indexOf('partner-group organisers');
  const hotelPosition = home.indexOf('partner-group hotel-partner-home');

  assert.ok(supportedByPosition >= 0, 'homepage defines a Supported By partner group');
  assert.ok(organisersPosition >= 0, 'homepage identifies the Organisers partner group');
  assert.ok(organisersPosition < supportedByPosition, 'Organisers appears before Supported By');
  assert.ok(supportedByPosition < hotelPosition, 'Supported By is placed before the Official Hotel Partner in the second row');
  assert.equal((home.match(/partner-group strategic/g) ?? []).length, 1, 'all strategic partners share one group');
  assert.match(home, /assets\/myceb-logo\.png/, 'homepage references the MyCEB logo asset');
  assert.match(home, /assets\/meet-in-malaysia-logo\.png/, 'homepage references the Meet in Malaysia logo');
  assert.match(home, /assets\/visit-malaysia-2026-logo\.png/, 'homepage references the Visit Malaysia 2026 logo');
  assert.match(home, /assets\/eon-mobility-partner\.jpg/, 'homepage references the EON mobility partner logo');
  assert.match(home, /EON is the Mobility Partner/, 'homepage identifies EON as the mobility partner');
  assert.match(home, /Malaysia SME is the Strategic Media &amp; MSME Outreach Partner/, 'homepage identifies Malaysia SME’s outreach role');
  assert.equal((home.match(/<details class="logo-card expandable-partner">/g) ?? []).length, 9, 'every non-hotel partner logo can expand for a description');
  assert.match(home, /<details class="hotel-partner-home-card expandable-partner"/, 'the hotel has an expandable information card');
  assert.match(home, /Mardhiyyah Hotel &amp; Suites is a Muslim-friendly Shah Alam hotel/, 'the hotel description is available when expanded');
  assert.match(home, /<a class="text-link" href="\.\.\/hotel\.html">Reservation<\/a>/, 'the hotel reservation action remains in its expandable card');
  assert.match(home, /Training Programme No: 10001758112/, 'the HRD Corp fee card shows the training programme number');
  assert.match(home, /Training Provider: <b>AEU SPEED SDN BHD<\/b>/, 'the HRD Corp fee card shows the training provider');
  assert.match(home, /Attending at least 2 Days/, 'the HRD Corp fee card has the revised attendance text');
  assert.match(styles, /\.partner-group\.supported-by/, 'styles lay out the Supported By group');
  assert.match(styles, /\.partner-group\.organisers/, 'styles preserve the Organisers layout');
  assert.match(styles, /\.partner-group\.supported-by\s*\{\s*grid-column:\s*1\s*\/\s*span\s*4;/, 'Supported By occupies the left side of the second row');
  assert.match(styles, /\.partner-group\.organisers\s*\{\s*grid-column:\s*1\s*\/\s*span\s*3;/, 'Organisers leads the primary partner row');
  assert.match(styles, /\.partner-group\.hotel-partner-home\s*\{\s*grid-column:\s*5\s*\/\s*span\s*2;/, 'Official Hotel Partner occupies the right side of the second row');
  assert.match(styles, /\.partner-group\.hotel-partner-home\s+\.text-link\s*\{[^}]*min-width:\s*0;/, 'hotel reservation button fits inside its card');
});
