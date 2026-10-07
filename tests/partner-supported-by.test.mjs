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
  assert.match(home, /data-partner-role="Mobility Partner"/, 'homepage identifies EON as the mobility partner');
  assert.match(home, /data-partner-role="Strategic Media &amp; MSME Outreach Partner"/, 'homepage identifies Malaysia SME’s outreach role');
  assert.match(home, /assets\/sitc-venue-partner-logo\.png/, 'homepage references the SITC venue partner logo');
  assert.match(home, /data-partner-role="Venue Partner"/, 'homepage identifies SITC as the venue partner');
  assert.equal((home.match(/class="logo-card partner-modal-trigger"/g) ?? []).length, 10, 'every non-hotel partner logo opens a modal');
  assert.match(home, /class="hotel-partner-home-card partner-modal-trigger"/, 'the hotel opens a modal instead of expanding in place');
  assert.match(home, /id="partner-modal"/, 'homepage defines the shared partner modal');
  assert.match(home, /data-partner-link="\.\.\/hotel\.html"/, 'the hotel reservation link is held for the modal only');
  assert.match(home, /partner-modal-action/, 'the shared modal supports the reservation action');
  assert.match(styles, /\.partner-modal\s*\{/, 'styles define the partner modal overlay');
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
