import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the homepage keeps HRD Corp information in the registration fee card only', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /class="hero-visual"/, 'homepage keeps the hero artwork container');
  assert.doesNotMatch(home, /class="hrd-support"/, 'hero artwork has no separate HRD Corp information block');
  assert.match(home, /class="general-hrdc-badges"/, 'the General Admission card groups both accreditation badges');
  assert.match(home, /hrd-corp-registered-training-provider\.jpeg/, 'homepage includes the registered training provider badge');
  assert.match(home, /hrd-corp-claimable\.jpeg/, 'homepage includes the claimable badge');
  assert.match(styles, /\.hero-visual\s*\{[\s\S]*?align-self:\s*start;/, 'hero artwork aligns with the title at desktop sizes');
  assert.doesNotMatch(styles, /\.hrd-support\s*\{/, 'the removed hero support block has no unused styles');
});
