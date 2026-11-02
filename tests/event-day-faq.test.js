const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  'committee.html', 'exhibitors/index.html', 'home/index.html', 'hotel.html',
  'index.html', 'leadership/index.html', 'partners.html', 'payment.html',
  'programme.html', 'programme/index.html', 'registration.html',
  'registration/index.html', 'speakers.html', 'speakers/index.html',
  'sponsorship.html', 'submission.html', 'submission/index.html', 'venue.html',
];

test('every public footer links to the Event Day FAQ page', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const footer = html.match(/<footer class="footer">([\s\S]*?)<\/footer>/)?.[1];
    assert.ok(footer, `${page} has a footer`);
    const href = footer.match(/<a href="([^"]+)">Event Day FAQ<\/a>/)?.[1];
    assert.ok(href, `${page} links to Event Day FAQ in its footer`);
    assert.equal(path.resolve(root, path.dirname(page), href), path.join(root, 'faq'));
  }
});

test('FAQ page answers all ten source questions and flags invitation-only luncheon', () => {
  const html = fs.readFileSync(path.join(root, 'faq/index.html'), 'utf8');
  assert.equal((html.match(/class="faq-item"/g) || []).length, 10);
  for (const topic of [
    'Where will the conference be held?', 'What are the conference dates?',
    'What time should I be at the venue?', 'Where can I park',
    'Is SITC accessible by public transport?', 'Where do I register upon arrival?',
    'What is the dress code?', 'Will meals and refreshments be provided?',
    'Will I receive a certificate of participation?', 'Whom should I contact for assistance?',
  ]) assert.ok(html.includes(topic), `FAQ includes ${topic}`);
  assert.match(html, /Opening Luncheon[^<]*on Day 1[^<]*separate invitation only/i);
  assert.match(html, /RM2\.50[\s\S]*RM1\.50[\s\S]*RM10\.00/);
});
