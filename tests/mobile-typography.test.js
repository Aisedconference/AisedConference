const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('mobile typography uses readable compact font sizes', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  const mobileRules = css.slice(css.lastIndexOf('@media (max-width: 680px)'));

  assert.match(mobileRules, /\.hero h1\s*\{[^}]*font-size:\s*2rem/);
  assert.match(mobileRules, /\.page-hero h1\s*\{[^}]*font-size:\s*1\.9rem/);
  assert.match(mobileRules, /\.section-head h2\s*\{[^}]*font-size:\s*1\.5rem/);
  assert.match(mobileRules, /\.highlight-card\s*\{[^}]*padding:\s*18px/);
  assert.match(mobileRules, /\.highlight-card strong\s*\{[^}]*font-size:\s*1rem/);
  assert.match(mobileRules, /\.speaker-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.speaker-card\s*\{[^}]*padding:\s*16px/);
  assert.match(mobileRules, /\.partner-groups\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.partner-group:first-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
  assert.match(mobileRules, /\.partner-groups \.logo-card\s*\{[^}]*min-height:\s*74px/);
  assert.match(mobileRules, /\.hero-actions\s*\{[^}]*display:\s*none/);
  assert.match(mobileRules, /\.footer-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.footer-grid > :first-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
  assert.match(mobileRules, /\.hero p,\s*\.page-hero p\s*\{[^}]*font-size:\s*1rem/);
  assert.match(mobileRules, /\.hero-art\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(mobileRules, /\.hero-meta\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(mobileRules, /\.audience-photo-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileRules, /\.audience-photo-grid article\s*\{[^}]*grid-template-rows:\s*140px\s+minmax\(58px,\s*auto\)/);
});
