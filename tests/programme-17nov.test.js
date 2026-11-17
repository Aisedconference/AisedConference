const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['programme.html', 'programme/index.html'].map((name) =>
  fs.readFileSync(path.join(root, name), 'utf8'));

function day(page, number) {
  return page.match(new RegExp(`<section class="programme-tab-panel day-${number}-panel"[\\s\\S]*?<\\/section>`))?.[0] || '';
}

test('17 November timetable updates Day 1 opening, luncheon and Forum 2 moderator', () => {
  for (const page of pages) {
    const agenda = day(page, 1);
    const opening = agenda.match(/<strong>Opening Address<\/strong>[\s\S]*?<\/div><\/div>/)?.[0] || '';
    const luncheon = agenda.match(/<strong>Royal Opening Ceremony and Official Luncheon<\/strong>[\s\S]*?<\/div><\/div>/)?.[0] || '';
    const forumTwo = agenda.match(/<strong>Forum 2<\/strong>[\s\S]*?<\/div><\/div>/)?.[0] || '';
    assert.match(opening, /Dato’ Steve Cheah/);
    assert.doesNotMatch(opening, /Ansary Ahmed/);
    assert.match(luncheon, /Prof\. Dato’ Dr\. Ansary Ahmed/);
    assert.match(luncheon, /Strategic Partnership &amp; Appreciation Ceremony/);
    assert.match(luncheon, /Royal Opening Address/);
    assert.match(forumTwo, /Dato’ Satinah Syed Saleh/);
    assert.doesNotMatch(forumTwo, /Suwanchai Lohawatanakul/);
  }
});

test('17 November timetable leaves unconfirmed Day 2 workshop details unpublished', () => {
  for (const page of pages) {
    const agenda = day(page, 2);
    assert.match(agenda, /Andrew Khoo \(Chairman &amp; CEO, The MUI Group\)/);
    assert.doesNotMatch(agenda, /Harnessing AI for Business Transformation|Future-Ready Talent and Workforce Transformation/);
    assert.match(agenda, /Academic Parallel Session 2[\s\S]*?Industry Workshop 2/);
    assert.match(agenda, /Academic Parallel Session 3[\s\S]*?Industry Workshop 3/);
  }
});

test('17 November timetable replaces Day 3 keynote and updates roundtable and afternoon times', () => {
  for (const page of pages) {
    const agenda = day(page, 3);
    assert.match(agenda, /<time>9\.00 a\.m\.–9\.45 a\.m\.<\/time><div><strong>Entrepreneurship Education in Action: UNESCO EE-NET Initiatives, Regional Experiences and Sustainable Impact<\/strong>/);
    assert.doesNotMatch(agenda, /Keynote Session 4|keynote-session-4/);
    assert.match(agenda, /Dato’ Mohd Zamri Bin Zainul Abidin \(Senior Director, Malaysia Anti-Corruption Academy, Malaysian Anti-Corruption Commission\)/);
    assert.match(agenda, /Dato’ Lau Wai Cheng/);
    assert.match(agenda, /<time>12\.30 p\.m\.–2\.30 p\.m\.<\/time><div><strong>Lunch<\/strong>/);
    assert.match(agenda, /<time>2\.30 p\.m\.–3\.30 p\.m\.<\/time><div><strong>Strategic Networking &amp; Partnership Ceremony<\/strong>[\s\S]*?MoU Signing Ceremonies[\s\S]*?Appointment Ceremony of the Professor of Practice/);
    assert.match(agenda, /<time>3\.30 p\.m\.–5\.00 p\.m\.<\/time><div><strong>Conference Resolutions &amp; Closing<\/strong>/);
  }
});
