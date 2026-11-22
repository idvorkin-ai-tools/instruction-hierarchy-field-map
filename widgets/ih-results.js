/* ih-results: toggle GPT-3.5 Turbo between the baseline and the hierarchy-trained
   model and watch five attack-robustness bars rise while benign compliance falls.
   Numbers: lab/ih-results.js (Figures 2 and 4 on paper/instruction-hierarchy.html). */
(function () {
  var H = window.AIToolsWidgets, L = window.IHLab;
  if (!H || !L || !L.IH_ATTACKS) return;
  H.register('ih-results', function (el) {
    var p = 'ihr' + H.uid();
    var rows = L.IH_ATTACKS.concat([L.IH_BENIGN]);
    var X = 4, W = 240, RH = 36, TOP = 14;
    function y(i) { return TOP + i * RH + (i === rows.length - 1 ? 30 : 0); }
    var svg = '';
    rows.forEach(function (r, i) {
      var benign = i === rows.length - 1;
      svg += H.t(X, y(i), r.label, benign ? 't-off' : 't-ink', 'font-size="11"');
      svg += '<rect class="box" x="' + X + '" y="' + (y(i) + 6) + '" width="' + W + '" height="13" rx="3"/>';
      svg += '<rect class="bar ' + (benign ? 'box-off' : 'box-def') + '" id="' + p + '-b' + i + '" x="' + X + '" y="' + (y(i) + 6) + '" width="0" height="13" rx="3"/>';
      svg += '<line class="ln ghost" id="' + p + '-g' + i + '" x1="0" x2="0" y1="' + (y(i) + 3) + '" y2="' + (y(i) + 22) + '"/>';
      svg += H.t(X + W + 6, y(i) + 17, '', 't-ink', 'id="' + p + '-v' + i + '" font-size="11"');
    });
    var sep = y(rows.length - 1) - 24;
    svg += '<line class="grid" x1="0" x2="360" y1="' + sep + '" y2="' + sep + '"/>';
    svg += H.t(X, sep + 13, 'the cost: compliance on harmless prompts (higher = better)', 't-dim', 'font-size="10"');
    el.innerHTML =
      '<div class="lab-pre" role="group" aria-label="Which model">' +
      '<button type="button" data-m="base" aria-pressed="true">Baseline</button>' +
      '<button type="button" data-m="ih" aria-pressed="false">+ Hierarchy training</button></div>' +
      '<svg class="dg" viewBox="0 0 360 ' + (y(rows.length - 1) + 30) + '" aria-hidden="true">' + svg + '</svg>' +
      '<div class="statgrid">' + H.stat('Biggest gain', p + '-gain', true) + H.stat('Benign compliance', p + '-ben', true) + '</div>' +
      H.sum(p + '-sum');
    var btns = el.querySelectorAll('[data-m]');
    function draw(m) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === m)); });
      rows.forEach(function (r, i) {
        var v = r[m], bar = H.$(el, p + '-b' + i), g = H.$(el, p + '-g' + i), d = L.ihDelta(r);
        bar.setAttribute('width', (W * v / 100).toFixed(1));
        var gx = (X + W * r.base / 100).toFixed(1);
        g.setAttribute('x1', gx); g.setAttribute('x2', gx);
        g.style.visibility = m === 'ih' ? 'visible' : 'hidden';
        H.$(el, p + '-v' + i).textContent = v.toFixed(1) + (m === 'ih' ? ' (' + (d > 0 ? '+' : '') + d.toFixed(1) + ')' : '');
      });
      var big = L.ihBiggest(L.IH_ATTACKS), b = L.IH_BENIGN;
      H.$(el, p + '-gain').textContent = m === 'ih' ? '+' + L.ihDelta(big).toFixed(1) : '—';
      H.$(el, p + '-gain-n').textContent = m === 'ih' ? big.label + ', ' + big.base + ' → ' + big.ih : 'switch to the trained model';
      H.$(el, p + '-ben').textContent = b[m].toFixed(1) + '%';
      H.$(el, p + '-ben-n').textContent = m === 'ih' ? 'down ' + Math.abs(L.ihDelta(b)).toFixed(1) + ' points' : 'jailbreak-shaped but allowed prompts';
      H.$(el, p + '-sum').textContent = m === 'ih'
        ? 'Trained with the hierarchy, every attack row rises, most for system message extraction (32.8 to 95.9, the paper\'s "up to 63%"), while compliance on harmless prompts dressed as jailbreaks falls from 83.1% to 60.4%: the over-refusal cost.'
        : 'Baseline GPT-3.5 Turbo: robustness runs from 32.8% (system message extraction) to 89.6%, and it complies with 83.1% of harmless prompts dressed as jailbreaks.';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { draw(b.getAttribute('data-m')); }); });
    el.labPreset = function (m) { draw(m === 'ih' ? 'ih' : 'base'); };
    draw('base');
  });
})();
