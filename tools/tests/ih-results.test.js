// The ih-results widget must show exactly the numbers the page prints.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const L = require('../../lab/ih-results.js');
// Term boxes (<span class="term">) don't change the text, so drop the tags before matching.
const page = fs.readFileSync(path.join(__dirname, '../../paper/instruction-hierarchy.html'), 'utf8')
  .replace(/<span class="term"[^>]*>([^<]*)<\/span>/g, '$1');

// Table rows look like <tr><td>Label</td><td class="num">59.2</td><td class="num">79.2</td></tr>
function rowNums(label) {
  const i = page.indexOf('<td>' + label + '</td>');
  assert.ok(i > 0, 'row not on page: ' + label);
  const row = page.slice(i, page.indexOf('</tr>', i));
  return [...row.matchAll(/(\d+\.\d)/g)].map((m) => Number(m[1]));
}

test('five attack rows match Figure 2 on the page', () => {
  const labels = ['Prompt injection, hijacking (TensorTrust)', 'Prompt injection, new instructions (held-out red-team)',
    'User conflicting instructions', 'Prompt injection, indirect via browsing', 'System message extraction (TensorTrust)'];
  labels.forEach((lab, i) => assert.deepStrictEqual(rowNums(lab), [L.IH_ATTACKS[i].base, L.IH_ATTACKS[i].ih]));
});

test('benign compliance row matches Figure 4 (83.1 to 60.4)', () => {
  assert.deepStrictEqual(rowNums('Jailbreakchat with allowed prompts'), [L.IH_BENIGN.base, L.IH_BENIGN.ih]);
});

test('largest gain is extraction, the page\'s "up to 63%" (95.9 minus 32.8)', () => {
  const b = L.ihBiggest(L.IH_ATTACKS);
  assert.strictEqual(b.label, 'System message extraction');
  assert.strictEqual(L.ihDelta(b), 63.1);
  assert.ok(page.includes('up to 63%'));
});

test('every attack improves; benign compliance falls', () => {
  L.IH_ATTACKS.forEach((r) => assert.ok(L.ihDelta(r) > 0));
  assert.strictEqual(L.ihDelta(L.IH_BENIGN), -22.7);
});
