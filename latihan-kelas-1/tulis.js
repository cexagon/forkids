/* tulis.js — handwriting answer pad + recognition for Latihan (kids 7 y.o.).
 * Plain browser JS, no build step. Exposes window.Tulis.
 *
 *   const pad = Tulis.create(containerEl, { height?, onchange? });
 *   pad.clear(); pad.undo(); pad.isEmpty(); pad.strokes; pad.toPNG();
 *   pad.lock(); pad.unlock(); pad.onchange = fn;
 *   Tulis.recognize(pad, { lang: 'id', words? }) -> Promise<{candidates, engine}>
 *   Tulis.normalize(s); Tulis.match(candidates, accepted) -> {ok, matched?, candidate?}
 */
(function (root) {
  'use strict';

  var INK = '#2b1d12';
  var LINE_W = 5;
  var GOOGLE_URL = 'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';
  var GOOGLE_TIMEOUT = 6000;
  var NATIVE_TIMEOUT = 6000;

  // Palm-rejection-lite: once a pen has been seen anywhere, touch input is ignored.
  var penSeen = false;

  /* ---------------- styles (injected once) ---------------- */
  var CSS = [
    '.tulis{position:relative;width:100%;box-sizing:border-box;user-select:none;-webkit-user-select:none;transition:opacity .15s}',
    '.tulis-area{position:relative;width:100%;background:#fff;border:2px solid #e6d9bf;border-radius:14px;overflow:hidden;box-sizing:border-box}',
    '.tulis canvas{display:block;width:100%;touch-action:none;cursor:crosshair}',
    '.tulis-bar{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}',
    '.tulis-btn{font:inherit;font-weight:700;font-size:15px;min-height:40px;min-width:72px;padding:6px 14px;border-radius:10px;border:2px solid #e6d9bf;background:#fffaf0;color:#5a4330;cursor:pointer;touch-action:manipulation}',
    '.tulis-btn:active{transform:translateY(1px)}',
    '.tulis-btn:disabled{opacity:.45;cursor:default}',
    '.tulis-btn:focus-visible{outline:3px solid #f2a93b;outline-offset:2px}',
    '.tulis-locked{opacity:.72}',
    '.tulis-locked canvas{cursor:default}',
    '.tulis-locked .tulis-bar{visibility:hidden}'
  ].join('\n');

  function injectCSS() {
    if (document.getElementById('tulis-css')) return;
    var s = document.createElement('style');
    s.id = 'tulis-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function defaultHeight() {
    var small = root.matchMedia ? root.matchMedia('(max-width: 600px)').matches : false;
    return small ? 140 : 180;
  }

  /* ---------------- drawing helpers ---------------- */
  function setInk(ctx) {
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    ctx.lineWidth = LINE_W;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // Quadratic smoothing through midpoints.
  function drawStroke(ctx, pts) {
    if (!pts.length) return;
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, LINE_W / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i].x + pts[i + 1].x) / 2;
      var my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    var last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  // Incremental segment for the live stroke: from midpoint(n-3,n-2) to midpoint(n-2,n-1).
  function drawTail(ctx, pts) {
    var n = pts.length;
    if (n < 2) return;
    var a = pts[n - 3] || pts[n - 2], b = pts[n - 2], c = pts[n - 1];
    var sx = n >= 3 ? (a.x + b.x) / 2 : b.x;
    var sy = n >= 3 ? (a.y + b.y) / 2 : b.y;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
    ctx.stroke();
  }

  function drawGuide(ctx, w, h) {
    // School-book line: faint top line, dashed midline, stronger baseline.
    var base = Math.round(h * 0.74) + 0.5;
    var top = Math.round(h * 0.22) + 0.5;
    var mid = Math.round((base + top) / 2) + 0.5;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(120,150,200,.22)';
    ctx.beginPath(); ctx.moveTo(0, top); ctx.lineTo(w, top); ctx.stroke();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(120,150,200,.18)';
    ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(214,110,110,.35)';
    ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(w, base); ctx.stroke();
    ctx.restore();
  }

  function bbox(strokes) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    strokes.forEach(function (s) {
      s.forEach(function (p) {
        if (p.x < x0) x0 = p.x; if (p.y < y0) y0 = p.y;
        if (p.x > x1) x1 = p.x; if (p.y > y1) y1 = p.y;
      });
    });
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
  }

  function now() { return (root.performance && performance.now) ? performance.now() : Date.now(); }

  /* ---------------- pad ---------------- */
  function create(container, opts) {
    opts = opts || {};
    injectCSS();

    var wrap = document.createElement('div');
    wrap.className = 'tulis';
    var area = document.createElement('div');
    area.className = 'tulis-area';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Tempat menulis jawaban');
    canvas.setAttribute('role', 'img');
    area.appendChild(canvas);
    var bar = document.createElement('div');
    bar.className = 'tulis-bar';
    var bUndo = document.createElement('button');
    bUndo.type = 'button'; bUndo.className = 'tulis-btn tulis-undo'; bUndo.textContent = 'Ulang';
    bUndo.setAttribute('aria-label', 'Hapus coretan terakhir');
    var bClear = document.createElement('button');
    bClear.type = 'button'; bClear.className = 'tulis-btn tulis-clear'; bClear.textContent = 'Hapus';
    bClear.setAttribute('aria-label', 'Hapus semua tulisan');
    bar.appendChild(bUndo); bar.appendChild(bClear);
    wrap.appendChild(area); wrap.appendChild(bar);
    container.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1;
    var active = null;       // { id, pts }
    var locked = false;

    var pad = {
      el: wrap,
      canvas: canvas,
      strokes: [],
      onchange: opts.onchange || null,
      get width() { return W; },
      get height() { return H; },
      clear: function () {
        active = null;
        pad.strokes.length = 0;
        redraw(); changed();
      },
      undo: function () {
        if (!pad.strokes.length) return;
        pad.strokes.pop();
        redraw(); changed();
      },
      isEmpty: function () { return pad.strokes.length === 0; },
      toPNG: toPNG,
      lock: function () {
        locked = true;
        if (active) endStroke();
        wrap.classList.add('tulis-locked');
        bUndo.disabled = bClear.disabled = true;
      },
      unlock: function () {
        locked = false;
        wrap.classList.remove('tulis-locked');
        updateButtons();
      },
      isLocked: function () { return locked; },
      resize: resize,
      destroy: function () {
        if (ro) ro.disconnect(); else root.removeEventListener('resize', resize);
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }
    };

    function changed() {
      updateButtons();
      if (typeof pad.onchange === 'function') {
        try { pad.onchange(pad); } catch (e) { setTimeout(function () { throw e; }); }
      }
    }
    function updateButtons() {
      if (locked) return;
      var empty = pad.strokes.length === 0;
      bUndo.disabled = bClear.disabled = empty;
    }

    function resize() {
      var w = Math.max(1, Math.round(area.clientWidth || container.clientWidth || 300));
      var h = opts.height || defaultHeight();
      var d = root.devicePixelRatio || 1;
      if (w === W && h === H && d === dpr) return;
      W = w; H = h; dpr = d;
      canvas.style.height = H + 'px';
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      redraw();
    }

    function redraw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      drawGuide(ctx, W, H);
      setInk(ctx);
      pad.strokes.forEach(function (s) { drawStroke(ctx, s); });
    }

    function pointFrom(e) {
      var r = canvas.getBoundingClientRect();
      return { x: Math.round((e.clientX - r.left) * 10) / 10, y: Math.round((e.clientY - r.top) * 10) / 10, t: Math.round(now()) };
    }

    function accept(e) {
      if (locked) return false;
      if (e.pointerType === 'pen') penSeen = true;
      if (e.pointerType === 'touch' && penSeen) return false;
      return true;
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (!accept(e)) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (active) return; // one finger at a time
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      var p = pointFrom(e);
      active = { id: e.pointerId, pts: [p] };
      pad.strokes.push(active.pts);
      setInk(ctx);
      ctx.beginPath();
      ctx.arc(p.x, p.y, LINE_W / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!active || e.pointerId !== active.id) return;
      e.preventDefault();
      var evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
      if (!evs.length) evs = [e];
      setInk(ctx);
      for (var i = 0; i < evs.length; i++) {
        var p = pointFrom(evs[i]);
        var pts = active.pts, last = pts[pts.length - 1];
        var dx = p.x - last.x, dy = p.y - last.y;
        if (dx * dx + dy * dy < 1) continue; // skip sub-pixel jitter
        pts.push(p);
        drawTail(ctx, pts);
      }
    });

    function endStroke() {
      if (!active) return;
      active = null;
      redraw(); // replace live segments with the clean smoothed stroke
      changed();
    }
    function onUp(e) {
      if (!active || e.pointerId !== active.id) return;
      var p = pointFrom(e), pts = active.pts, last = pts[pts.length - 1];
      if (e.type === 'pointerup' && (p.x !== last.x || p.y !== last.y)) pts.push(p);
      endStroke();
    }
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('lostpointercapture', onUp);
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    bUndo.addEventListener('click', function () { if (!locked) pad.undo(); });
    bClear.addEventListener('click', function () { if (!locked) pad.clear(); });

    function toPNG() {
      var PADDING = 16;
      var c = document.createElement('canvas');
      var g = c.getContext('2d');
      if (pad.isEmpty()) {
        c.width = c.height = 64;
        g.fillStyle = '#fff'; g.fillRect(0, 0, 64, 64);
        return c.toDataURL('image/png');
      }
      var b = bbox(pad.strokes);
      var m = PADDING + LINE_W / 2;
      var w = Math.ceil(b.x1 - b.x0 + m * 2), h = Math.ceil(b.y1 - b.y0 + m * 2);
      var s = Math.min(2, root.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(w * s));
      c.height = Math.max(1, Math.round(h * s));
      g.setTransform(s, 0, 0, s, 0, 0);
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
      g.translate(m - b.x0, m - b.y0);
      setInk(g);
      pad.strokes.forEach(function (st) { drawStroke(g, st); });
      return c.toDataURL('image/png');
    }

    var ro = null;
    if (root.ResizeObserver) { ro = new ResizeObserver(function () { resize(); }); ro.observe(area); }
    else root.addEventListener('resize', resize);
    resize();
    updateButtons();
    return pad;
  }

  /* ---------------- recognition ---------------- */
  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function cleanList(list) {
    var out = [], seen = {};
    (list || []).forEach(function (s) {
      if (typeof s !== 'string') return;
      var v = s.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!v || seen[v]) return;
      seen[v] = 1; out.push(v);
    });
    return out;
  }

  function strokesOf(pad) {
    return (pad && pad.strokes ? pad.strokes : []).filter(function (s) { return s && s.length; });
  }

  function tryNative(strokes, lang) {
    var nav = root.navigator;
    if (!nav || typeof nav.createHandwritingRecognizer !== 'function' || typeof root.HandwritingStroke !== 'function') {
      return Promise.resolve(null);
    }
    var langs = [lang || 'id'];
    if (langs[0] !== 'en') langs.push('en');
    var t0 = strokes[0][0].t;

    function attempt(i) {
      if (i >= langs.length) return Promise.resolve(null);
      var recognizer = null;
      return withTimeout(nav.createHandwritingRecognizer({ languages: [langs[i]] }), NATIVE_TIMEOUT)
        .then(function (r) {
          recognizer = r;
          if (!r) return null;
          var drawing = r.startDrawing({ recognitionType: 'text', inputType: 'touch', alternatives: 10 });
          strokes.forEach(function (s) {
            var hs = new root.HandwritingStroke();
            s.forEach(function (p) { hs.addPoint({ x: p.x, y: p.y, t: Math.max(0, p.t - t0) }); });
            drawing.addStroke(hs);
          });
          return withTimeout(drawing.getPrediction(), NATIVE_TIMEOUT);
        })
        .then(function (preds) {
          if (recognizer && recognizer.finish) { try { recognizer.finish(); } catch (_) {} }
          var c = cleanList((preds || []).map(function (p) { return p && p.text; }));
          if (c.length) return { candidates: c, engine: 'native-' + langs[i] };
          return attempt(i + 1);
        }, function () {
          if (recognizer && recognizer.finish) { try { recognizer.finish(); } catch (_) {} }
          return attempt(i + 1); // language unsupported / error -> next language
        });
    }
    return attempt(0).catch(function () { return null; });
  }

  function tryGoogle(strokes, lang, w, h) {
    if (typeof root.fetch !== 'function') return Promise.resolve(null);
    var t0 = strokes[0][0].t;
    var ink = strokes.map(function (s) {
      return [
        s.map(function (p) { return Math.round(p.x); }),
        s.map(function (p) { return Math.round(p.y); }),
        s.map(function (p) { return Math.max(0, Math.round(p.t - t0)); })
      ];
    });
    var body = {
      options: 'enable_pre_space',
      requests: [{
        writing_guide: { writing_area_width: Math.round(w), writing_area_height: Math.round(h) },
        ink: ink,
        language: lang || 'id',
        max_num_results: 10,
        max_completions: 0
      }]
    };
    var ctrl = root.AbortController ? new AbortController() : null;
    var timer = null;
    var req = root.fetch(GOOGLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl ? ctrl.signal : undefined,
      credentials: 'omit'
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || j[0] !== 'SUCCESS' || !j[1] || !j[1][0]) return null;
      var c = cleanList(j[1][0][1]);
      return c.length ? { candidates: c, engine: 'google' } : null;
    });
    var timeout = new Promise(function (resolve) {
      timer = setTimeout(function () { if (ctrl) ctrl.abort(); resolve(null); }, GOOGLE_TIMEOUT);
    });
    return Promise.race([req, timeout])
      .then(function (v) { clearTimeout(timer); return v; }, function () { clearTimeout(timer); return null; });
  }

  // opts.words: optional list of expected words; recognised candidates that appear in it
  // are moved to the front (order otherwise preserved). Never filters anything out.
  function preferWords(res, words) {
    if (!res || !words || !words.length) return res;
    var set = {};
    words.forEach(function (w) { set[normalize(w)] = 1; });
    var hit = [], rest = [];
    res.candidates.forEach(function (c) { (set[normalize(c)] ? hit : rest).push(c); });
    res.candidates = hit.concat(rest);
    return res;
  }

  function recognize(pad, opts) {
    opts = opts || {};
    var lang = opts.lang || 'id';
    var none = { candidates: [], engine: 'none' };
    var strokes;
    try { strokes = strokesOf(pad); } catch (_) { return Promise.resolve(none); }
    if (!strokes.length) return Promise.resolve(none);
    var w = (pad && pad.width) || 300, h = (pad && pad.height) || 180;

    return Promise.resolve()
      .then(function () { return tryNative(strokes, lang); })
      .then(function (r) { return r || tryGoogle(strokes, lang, w, h); })
      .then(function (r) { return r ? preferWords(r, opts.words) : none; })
      .catch(function () { return none; });
  }

  /* ---------------- matching ---------------- */
  function normalize(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^[\s.,!?;:'"`()\-]+|[\s.,!?;:'"`()\-]+$/g, '')
      .trim();
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1), cur = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[b.length];
  }

  function match(candidates, accepted) {
    var cands = (Array.isArray(candidates) ? candidates : [candidates]).map(normalize).filter(Boolean);
    var acc = (Array.isArray(accepted) ? accepted : [accepted]).filter(function (a) { return a != null; });
    var i, j, a, c, nospace;
    // 1) exact (also ignoring spaces, e.g. "1 2" vs "12")
    for (j = 0; j < acc.length; j++) {
      a = normalize(acc[j]);
      if (!a) continue;
      nospace = a.replace(/ /g, '');
      for (i = 0; i < cands.length; i++) {
        c = cands[i];
        if (c === a || c.replace(/ /g, '') === nospace) return { ok: true, matched: String(acc[j]), candidate: c };
      }
    }
    // 2) spelling tolerance: words (letters, no digits) of >= 4 chars, distance <= 1
    for (j = 0; j < acc.length; j++) {
      a = normalize(acc[j]);
      if (a.length < 4 || /[0-9]/.test(a) || !/[a-z]/.test(a)) continue;
      for (i = 0; i < cands.length; i++) {
        if (levenshtein(cands[i], a) <= 1) return { ok: true, matched: String(acc[j]), candidate: cands[i] };
      }
    }
    return { ok: false };
  }

  var Tulis = {
    create: create,
    recognize: recognize,
    normalize: normalize,
    match: match,
    levenshtein: levenshtein,
    _engines: { native: tryNative, google: tryGoogle }
  };

  root.Tulis = Tulis;
  if (typeof module !== 'undefined' && module.exports) module.exports = Tulis;
})(typeof window !== 'undefined' ? window : globalThis);
