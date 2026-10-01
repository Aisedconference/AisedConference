import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the homepage shows compact HRD Corp support below the hero artwork', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /class="hero-visual"/, 'homepage groups the hero artwork and support details');
  assert.match(home, /assets\/hrd-corp-registered-training-provider\.jpeg/, 'homepage references the registered training provider badge');
  assert.match(home, /assets\/hrd-corp-claimable\.jpeg/, 'homepage references the HRD Corp Claimable badge');
  assert.match(home, /class="hrdc-fee-badges"/, 'the HRD fee card groups both accreditation badges');
  assert.match(home, /class="registration-fee-card hrdc-fee-card"/, 'the HRD fee card has a dedicated responsive layout hook');
  assert.match(home, /Training Programme No: 10001758112/, 'homepage includes the training programme number');
  assert.match(home, /Training Provider:\s*<strong>AEU SPEED SDN BHD<\/strong>/, 'homepage includes the training provider');
  assert.match(styles, /\.hero-visual\s*\{[\s\S]*?align-self:\s*start;/, 'hero artwork aligns with the title at desktop sizes');
  assert.match(styles, /\.hrd-support\s*\{[^}]*justify-items:\s*center;/, 'HRD support details are centred below the artwork');
});
