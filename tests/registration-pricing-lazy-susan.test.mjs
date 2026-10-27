import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const homeHtml = readFileSync(new URL('../home/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const section = html.match(/<section class="section registration-section">([\s\S]*?)<\/section>/)?.[1] ?? '';
const homeSection = homeHtml.match(/<section class="section registration-section">([\s\S]*?)<\/section>/)?.[1] ?? '';

test('the /home route includes the complete interactive pricing carousel', () => {
  assert.equal([...homeSection.matchAll(/<article class="registration-fee-card(?: featured)?"/g)].length, 4);
  assert.match(homeSection, /class="susan-arrow susan-arrow-prev"/);
  assert.match(homeSection, /class="susan-arrow susan-arrow-next"/);
  assert.match(homeHtml, /classList\.add\('lazy-susan'\)/);
  assert.match(homeHtml, /previousButton\.addEventListener\('click'/);
  assert.match(homeHtml, /nextButton\.addEventListener\('click'/);
});

test('the /home route separates the HRD Claimable and General Admission passes', () => {
  assert.equal([...homeSection.matchAll(/<article class="registration-fee-card(?: featured)?"/g)].length, 4);
  assert.match(homeSection, /HRD Claimable<\/span>[\s\S]*?<strong>RM1,800<\/strong>[\s\S]*?<\/div>\s*<ul/);
  assert.match(homeSection, /General Admission Pass<\/span>[\s\S]*?<strong>RM1,800<\/strong>/);
  assert.match(homeSection, /<span>Academic Conference Pass<\/span>[\s\S]*?<strong>RM700<\/strong>[\s\S]*?<\/div>\s*<\/article>/);
  assert.match(homeSection, /Paper Presentation &amp; Publication Pass<\/span>[\s\S]*?RM1,000[\s\S]*?RM850[\s\S]*?Academics \/ Postgraduate Students/);
  assert.match(homeHtml, /hrdc:\s*\[\s*'Flexible Attendance Arrangement',\s*'Day 1 – 2 December 2026: Mandatory attendance\.',\s*'Day 2 or Day 3 – 3 or 4 December 2026: Participants may choose either day to attend\.',\s*'Participants are encouraged to attend on 3 December 2026 to facilitate planning and coordination\.'\s*\]/);
  assert.match(homeHtml, /Opening ceremony and full access to all parallel sessions/);
  assert.match(homeHtml, /Inclusive Lunch/);
});

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

test('the homepage does not present a separate student pricing card', () => {
  assert.doesNotMatch(homeSection, /Student \/ Postgraduate Student Conference Pass/);
  assert.match(homeSection, /<span>HRD Claimable<\/span>/);
});

test('paper presentation and publication pricing is labelled for academics and postgraduate students on the /home route', () => {
  assert.match(homeSection, /Paper Presentation &amp; Publication Pass<\/span>[\s\S]*?<small>Academics \/ Postgraduate Students<\/small>/);
  assert.match(homeHtml, /paper: \[\s*'Paper Publication',\s*'MyCITE Publication',\s*'Physical Presentation or Online Presentation Mode'\s*\]/);
  assert.match(css, /data-benefit-key="paper"\]\.susan-pos-0[\s\S]*?grid-template-columns:\s*minmax\(220px,\s*0\.95fr\)\s*minmax\(0,\s*1\.05fr\)[\s\S]*?gap:\s*18px/);
  assert.match(css, /data-benefit-key="paper"\]\.susan-pos-0 \.registration-benefit-list[\s\S]*?font-size:\s*0\.74rem/);
});

test('academic conference-pass eligibility is presented as a benefit without publication entitlement', () => {
  assert.match(homeHtml, /academic: \[\s*'For academics, educators, lecturers and postgraduate students',\s*'3 Days Conference Access'\s*\]/);
});

test('general admission displays the HRD Corp accreditation badges without crowding the benefits', () => {
  assert.match(homeSection, /class="general-hrdc-badges"[\s\S]*?hrd-corp-registered-training-provider\.jpeg[\s\S]*?hrd-corp-claimable\.jpeg/);
  assert.match(css, /\.general-hrdc-badges\s*\{/);
  assert.match(css, /three-pricing-cards[\s\S]*?minmax\(290px,\s*1\.1fr\) minmax\(180px,\s*0\.9fr\)/);
});

test('Mardhiyyah is grouped with strategic and event partners instead of appearing in a separate hotel card', () => {
  const partners = homeHtml.match(/<div class="partner-groups"[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? '';

  assert.match(partners, /<h3>Strategic &amp; Event Partners<\/h3>/);
  assert.match(partners, /class="partner-row strategic"[\s\S]*?mardhiyyah-hotel-logo\.png/);
  assert.match(partners, /data-partner-role="Official Hotel Partner"[\s\S]*?data-partner-link="\.\.\/hotel\.html"/);
  assert.doesNotMatch(partners, /class="partner-group hotel-partner-home"/);
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
