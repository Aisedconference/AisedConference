import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('homepage uses the supplied AiSED promotional video', async () => {
  const home = await readFile(new URL('home/index.html', root), 'utf8');

  assert.match(home, /<video class="venue-video" autoplay muted loop playsinline controls preload="metadata" aria-label="AiSED International Conference 2026 video">/);
  assert.match(home, /<source src="\.\.\/assets\/aised-promo-video\.mp4" type="video\/mp4">/);
  assert.equal(existsSync(new URL('../assets/aised-promo-video.mp4', import.meta.url)), true);
});
