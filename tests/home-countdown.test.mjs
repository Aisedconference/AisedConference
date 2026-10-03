import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('home venue includes a live countdown to the conference opening', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('home/index.html', root), 'utf8'),
    readFile(new URL('styles.css', root), 'utf8')
  ]);

  assert.match(home, /data-countdown-target="2026-12-02T00:00:00\+08:00"/);
  assert.match(home, /data-countdown-days/);
  assert.match(home, /data-countdown-hours/);
  assert.match(home, /data-countdown-minutes/);
  assert.match(home, /data-countdown-seconds/);
  assert.match(home, /Date\.parse\(countdown\.dataset\.countdownTarget\)/);
  assert.match(styles, /\.conference-countdown\s*\{/);
  assert.match(styles, /\.countdown-units\s*\{/);
});
