import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const section = html.match(/<section class="section registration-section">([\s\S]*?)<\/section>/)?.[1] ?? '';

test('lazy Susan keeps all five pricing cards in one accessible carousel', () => {
  assert.equal([...section.matchAll(/<article class="registration-fee-card(?: featured)?"/g)].length, 5);
  assert.match(html, /classList\.add\('lazy-susan'\)/);
  assert.match(html, /aria-current/);
  assert.match(html, /ArrowLeft/);
  assert.match(html, /ArrowRight/);
});

test('lazy Susan supports click, drag, and swipe rotation', () => {
  assert.match(html, /pointerdown/);
  assert.match(html, /pointerup/);
  assert.match(html, /DRAG_THRESHOLD/);
  assert.match(html, /rotateTo\(index\)/);
  assert.match(html, /setPointerCapture/);
});

test('a simple side-card press stays a click until dragging begins', () => {
  const pointerDown = html.match(/carousel\.addEventListener\('pointerdown',[\s\S]*?\n\s*\}\);/)?.[0] ?? '';
  const pointerMove = html.match(/carousel\.addEventListener\('pointermove',[\s\S]*?\n\s*\}\);/)?.[0] ?? '';

  assert.doesNotMatch(pointerDown, /setPointerCapture/);
  assert.match(pointerMove, /if \(!dragged && Math\.abs\(distance\) > 6\)/);
  assert.match(pointerMove, /setPointerCapture/);
});

test('lazy Susan uses five depth positions with a prominent front card', () => {
  assert.match(css, /\.lazy-susan \.registration-fee-card\.susan-pos-0/);
  assert.match(css, /\.lazy-susan \.registration-fee-card\.susan-pos-1/);
  assert.match(css, /\.lazy-susan \.registration-fee-card\.susan-pos-2/);
  assert.match(css, /\.lazy-susan \.registration-fee-card\.susan-pos-3/);
  assert.match(css, /\.lazy-susan \.registration-fee-card\.susan-pos-4/);
  assert.match(css, /susan-pos-0[\s\S]*scale\(1\.08\)/);
  assert.match(css, /susan-pos-2[\s\S]*opacity:\s*0\.28/);
});

test('registration action follows the front pricing card', () => {
  assert.match(html, /data-registration-cta/);
  assert.match(html, /category=call-papers/);
  assert.match(html, /encodeURIComponent\(type\)/);
});

test('the prominent card contains one shared conference-benefits checklist', () => {
  assert.equal([...section.matchAll(/class="registration-benefit-list"/g)].length, 1);
  assert.match(section, /Three days of conference access/);
  assert.match(section, /Keynotes from global leaders and industry experts/);
  assert.match(section, /Professional networking and partnership opportunities/);
  assert.match(html, /cards\[activeIndex\]\.append\(benefits\)/);
  assert.match(css, /susan-pos-0[\s\S]*grid-template-columns:\s*minmax\(150px,\s*0\.8fr\) minmax\(220px,\s*1\.2fr\)/);
});

test('each pricing category supplies its own benefit set', () => {
  for (const key of ['general', 'academic', 'student', 'hrdc', 'paper']) {
    assert.match(section, new RegExp(`data-benefit-key="${key}"`));
    assert.match(html, new RegExp(`${key}: \\[`));
  }

  assert.match(html, /Conference presentation opportunity/);
  assert.match(html, /Journal publication consideration/);
  assert.match(html, /HRD Corp claimable participation fee/);
  assert.match(html, /Student-rate three-day access/);
  assert.match(html, /benefitsByType\[benefitKey\]/);
});

test('HRD Corp benefits explain the assisted claim process professionally', () => {
  assert.match(html, /Enjoy a seamless HRD Corp claim process\./);
  assert.match(html, /Our team will assist with the submission/);
  assert.match(html, /provide the required particulars/);
});

test('visitors can rotate pricing cards with accessible arrow controls', () => {
  assert.match(section, /class="susan-arrow susan-arrow-prev"/);
  assert.match(section, /aria-label="Show previous pricing option"/);
  assert.match(section, /class="susan-arrow susan-arrow-next"/);
  assert.match(section, /aria-label="Show next pricing option"/);
  assert.match(html, /previousButton\.addEventListener\('click', \(\) => rotateBy\(-1\)\)/);
  assert.match(html, /nextButton\.addEventListener\('click', \(\) => rotateBy\(1\)\)/);
  assert.match(css, /\.susan-arrow\s*\{/);
});
