// ManyIH widgets: the tag rules and the numbers must match paper/many-tier.html.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const L = require('../../lab/manyih.js');
const page = fs.readFileSync(path.join(__dirname, '../../paper/many-tier.html'), 'utf8');
const v = (...xs) => xs.map((x) => ({ v: x }));

test('Figure 1: config 2, user 3, skill 4, tool 5 -> the config (4-space) wins', () => {
  assert.deepStrictEqual(L.resolve(v(2, 3, 4, 5), 'ordinal'), { win: 0, tie: false });
  assert.ok(page.includes('config 2, user 3, skill 4, tool 5'));
  assert.ok(page.includes('the answer is clear: 4-space indentation'));
});

test('ordinal: lower number wins, ties go to the later instruction', () => {
  assert.strictEqual(L.resolve(v(12, 1, 2), 'ordinal').win, 1);
  assert.strictEqual(L.resolve(v(3, 5, 3), 'ordinal').win, 2);
  assert.ok(page.includes('Lower number wins; Privilege 1 overrides Privilege 2. Ties go to the later instruction.'));
});

test('scalar: higher value wins (z=82 beats z=61); equal top values are a tie', () => {
  assert.strictEqual(L.resolve(v(61, 82), 'scalar').win, 1);
  assert.deepStrictEqual(L.resolve(v(50, 50, 10), 'scalar'), { win: -1, tie: true });
  assert.ok(page.includes('Higher value wins.'));
  assert.ok(page.includes('z=82 beats z=61'));
});

test('jitter keeps the order, so the rule picks the same winner', () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let t = 0; t < 50; t++) {
    const base = [55, 61, 82, 70];
    const j = L.jitter(base, rnd);
    j.forEach((x, i) => assert.ok(Math.abs(x - base[i]) <= 3));
    assert.strictEqual(L.resolve(v(...j), 'scalar').win, L.resolve(v(...base), 'scalar').win);
  }
  assert.ok(page.includes('Adding a random &plusmn;3 to each z-value while keeping the order identical'));
});

test('tier and effort numbers match the page', () => {
  assert.ok(page.includes('6 tiers with no conflicts, 8 tiers with about 3.5 conflicts, 12 tiers with about 9.8'));
  assert.deepStrictEqual(L.MANYIH_TIERS.map((r) => [r.tiers, r.conflicts]), [[6, 0], [8, 3.5], [12, 9.8]]);
  assert.ok(page.includes('In 11 of 12 model-to-model transitions accuracy strictly falls'));
  assert.ok(page.includes('from 6.8 points (Qwen3.5-9B) to 24.1 points (Sonnet 4.6)'));
  assert.ok(page.includes('GPT-5.4 rises from 15.5% with no reasoning to 60.9% at high effort'));
  assert.deepStrictEqual([L.MANYIH_EFFORT.none, L.MANYIH_EFFORT.high], [15.5, 60.9]);
});
