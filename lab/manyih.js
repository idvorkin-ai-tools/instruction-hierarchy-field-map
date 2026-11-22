/* Rules and numbers for the ManyIH widgets on paper/many-tier.html.
   Rules are the page's interface table (#method): ordinal tags, lower number
   wins, ties go to the later instruction; scalar tags, higher value wins (the
   page states no tie rule for scalar, so a scalar tie is reported as a tie).
   Numbers are the page's #tiers and #reasoning paragraphs. Tests:
   tools/tests/manyih.test.js. */
(function (root) {
  // items: [{ v: number }, ...] in prompt order. Returns { win: index or -1, tie: bool }.
  function resolve(items, mode) {
    var vs = items.map(function (x) { return x.v; });
    if (mode === 'ordinal') {
      var lo = Math.min.apply(null, vs);
      return { win: vs.lastIndexOf(lo), tie: false }; // lower wins; equal: the later one
    }
    var hi = Math.max.apply(null, vs);
    var n = vs.filter(function (v) { return v === hi; }).length;
    return n > 1 ? { win: -1, tie: true } : { win: vs.indexOf(hi), tie: false };
  }
  // Add a random whole offset in [-3, 3] to each value, re-drawing until every
  // pairwise comparison is unchanged (the paper's jitter keeps the order identical).
  function jitter(vals, rnd) {
    rnd = rnd || Math.random;
    function cmp(v) { var s = []; for (var i = 0; i < v.length; i++) for (var j = 0; j < v.length; j++) s.push(Math.sign(v[i] - v[j])); return s.join(); }
    var want = cmp(vals);
    for (var t = 0; t < 200; t++) {
      var out = vals.map(function (x) { return x + Math.floor(rnd() * 7) - 3; });
      if (cmp(out) === want) return out;
    }
    return vals.slice();
  }
  var api = {
    resolve: resolve,
    jitter: jitter,
    // #tiers: three coding variants, same task and winning styles.
    MANYIH_TIERS: [
      { tiers: 6, conflicts: 0 },
      { tiers: 8, conflicts: 3.5 },
      { tiers: 12, conflicts: 9.8 }
    ],
    MANYIH_DROP: { min: 6.8, minModel: 'Qwen3.5-9B', max: 24.1, maxModel: 'Sonnet 4.6', fell: 11, of: 12 },
    // #reasoning: GPT-5.4 on coding.
    MANYIH_EFFORT: { none: 15.5, high: 60.9 }
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IHLab = Object.assign(root.IHLab || {}, api);
})(this);
