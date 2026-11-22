/* manyih-scale: the two difficulty dials on paper/many-tier.html. Slide the tier
   count across the three coding variants (#tiers) and switch GPT-5.4's reasoning
   effort (#reasoning). Numbers: lab/manyih.js, as printed on the page. */
(function () {
  var H = window.AIToolsWidgets, L = window.IHLab;
  if (!H || !L || !L.MANYIH_TIERS) return;
  H.register('manyih-scale', function (el) {
    var p = 'ms' + H.uid(), T = L.MANYIH_TIERS, D = L.MANYIH_DROP, E = L.MANYIH_EFFORT;
    var bx = [40, 150, 260], BW = 70, BASE = 120, SC = 9; // 9.8 conflicts -> about 88px
    var svg = '<line class="grid" x1="20" x2="350" y1="' + BASE + '" y2="' + BASE + '"/>';
    T.forEach(function (r, i) {
      svg += '<rect class="box" id="' + p + '-k' + i + '" x="' + bx[i] + '" y="' + (BASE - Math.max(2, r.conflicts * SC)) + '" width="' + BW + '" height="' + Math.max(2, r.conflicts * SC) + '" rx="3"/>';
      svg += H.t(bx[i] + BW / 2, BASE - Math.max(2, r.conflicts * SC) - 6, String(r.conflicts), 't-ink', 'text-anchor="middle" font-size="12"');
      svg += H.t(bx[i] + BW / 2, BASE + 16, r.tiers + ' tiers', 't-dim', 'id="' + p + '-l' + i + '" text-anchor="middle" font-size="11"');
    });
    svg += H.t(20, 14, 'conflicts per sample (same task, same 6 winning styles)', 't-dim', 'font-size="10"');
    el.innerHTML =
      '<div class="lab-ctl">' + H.slider(p + '-t', 'Privilege tiers in the coding variant', 0, 2, 1, 0) + '</div>' +
      '<svg class="dg" viewBox="0 0 360 145" aria-hidden="true">' + svg + '</svg>' +
      '<div class="statgrid">' + H.stat('Conflicts per sample', p + '-c', true) + H.stat('Accuracy vs. 6 tiers', p + '-a', true) + '</div>' +
      '<div class="lab-pre" role="group" aria-label="GPT-5.4 reasoning effort">' +
      '<button type="button" data-e="none" aria-pressed="true">GPT-5.4, no reasoning</button>' +
      '<button type="button" data-e="high" aria-pressed="false">GPT-5.4, high effort</button></div>' +
      '<svg class="dg" viewBox="0 0 360 40" aria-hidden="true"><rect class="box" x="4" y="8" width="280" height="16" rx="3"/>' +
      '<rect class="bar box-ok" id="' + p + '-eb" x="4" y="8" width="0" height="16" rx="3"/>' +
      H.t(292, 21, '', 't-ink', 'id="' + p + '-ev" font-size="12"') + '</svg>' +
      H.sum(p + '-sum');
    var sl = H.$(el, p + '-t'), eff = 'none';
    function draw() {
      var i = Number(sl.value), r = T[i];
      H.$(el, p + '-t-o').textContent = r.tiers;
      sl.setAttribute('aria-valuetext', r.tiers + ' tiers, about ' + r.conflicts + ' conflicts per sample');
      T.forEach(function (x, j) {
        H.$(el, p + '-k' + j).setAttribute('class', j === i ? 'box-def' : 'box');
        H.$(el, p + '-l' + j).setAttribute('class', j === i ? 't-def' : 't-dim');
      });
      H.$(el, p + '-c').textContent = r.conflicts === 0 ? 'none' : 'about ' + r.conflicts;
      H.$(el, p + '-c-n').textContent = 'average, ' + r.tiers + '-tier variant';
      H.$(el, p + '-a').textContent = i === 0 ? 'baseline' : i === 2 ? '−' + D.min + ' to −' + D.max : 'lower';
      H.$(el, p + '-a-n').textContent = i === 0 ? 'the easiest setting'
        : i === 2 ? 'points, from ' + D.minModel + ' to ' + D.maxModel : 'fell at ' + D.fell + ' of ' + D.of + ' steps up';
      el.querySelectorAll('[data-e]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-e') === eff)); });
      H.$(el, p + '-eb').setAttribute('width', (280 * E[eff] / 100).toFixed(1));
      H.$(el, p + '-ev').textContent = E[eff] + '%';
      H.$(el, p + '-sum').textContent = r.tiers + ' tiers: ' + (r.conflicts === 0 ? 'no conflicts to resolve. ' : 'about ' + r.conflicts + ' conflicts per sample, and accuracy ' + (i === 2 ? 'is ' + D.min + ' to ' + D.max + ' points below the 6-tier setting. ' : 'falls as tiers grow. ')) +
        'GPT-5.4 on coding with ' + (eff === 'none' ? 'no reasoning scores ' : 'high reasoning effort scores ') + E[eff] + '%; more effort helps, then saturates.';
    }
    sl.addEventListener('input', draw);
    el.querySelectorAll('[data-e]').forEach(function (b) { b.addEventListener('click', function () { eff = b.getAttribute('data-e'); draw(); }); });
    draw();
  });
})();
