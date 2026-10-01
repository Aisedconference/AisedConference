import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the MyCEB supported-by group comes before the partner logos', async () => {
  const [home, styles] = await Promise.all([
    readFile(new URL('../home/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);

  const supportedByPosition = home.indexOf('partner-group supported-by');
  const organisersPosition = home.indexOf('partner-group organisers');

  assert.ok(supportedByPosition >= 0, 'homepage defines a Supported By partner group');
  assert.ok(organisersPosition >= 0, 'homepage identifies the Organisers partner group');
  assert.ok(supportedByPosition < organisersPosition, 'Supported By precedes Organisers');
  assert.match(home, /assets\/myceb-logo\.png/, 'homepage references the MyCEB logo asset');
  assert.match(styles, /\.partner-group\.supported-by/, 'styles lay out the Supported By group');
  assert.match(styles, /\.partner-group\.organisers/, 'styles preserve the Organisers layout');
  assert.match(styles, /\.partner-group\.supported-by\s*\{\s*grid-column:\s*1\s*\/\s*span\s*2;/, 'Supported By occupies the first row beside Organisers');
  assert.match(styles, /\.partner-group\.organisers\s*\{\s*grid-column:\s*3\s*\/\s*-1;/, 'Organisers shares the first row with Supported By');
});
