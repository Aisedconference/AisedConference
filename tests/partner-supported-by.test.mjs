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
});
