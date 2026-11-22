/* Numbers for the ih-results widget on paper/instruction-hierarchy.html#results.
   Copied from the page's Figure 2 and Figure 4 tables (Wallace et al. 2024,
   GPT-3.5 Turbo, baseline vs. trained with the hierarchy data); the test in
   tools/tests/ih-results.test.js checks every value against the page. */
(function (root) {
  var api = {
    IH_ATTACKS: [
      { label: 'Hijacking (TensorTrust)', base: 59.2, ih: 79.2 },
      { label: 'New instructions (held-out red-team)', base: 89.6, ih: 93.7 },
      { label: 'User conflicting instructions', base: 62.2, ih: 92.6 },
      { label: 'Indirect, via browsing', base: 77.5, ih: 85.0 },
      { label: 'System message extraction', base: 32.8, ih: 95.9 }
    ],
    // Figure 4: compliance (higher is better) on jailbreak-shaped but allowed prompts.
    IH_BENIGN: { label: 'Benign, jailbreak-shaped prompts: compliance', base: 83.1, ih: 60.4 },
    // Change in points, rounded to one decimal as the page prints numbers.
    ihDelta: function (row) { return Math.round((row.ih - row.base) * 10) / 10; },
    // The row with the largest gain (the page's "up to 63%").
    ihBiggest: function (rows) {
      return rows.reduce(function (a, r) { return api.ihDelta(r) > api.ihDelta(a) ? r : a; });
    }
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IHLab = Object.assign(root.IHLab || {}, api);
})(this);
