(function () {
  'use strict';
  var DATA = window.SOAL || [];
  var app = document.getElementById('app');
  var KEY = 'latihan-k2-s1-skor';
  var MODE_KEY = 'latihan-k2-s1-mode';
  var L = ['a', 'b', 'c', 'd'];
  // S = { sub, ans: [], pads: [], audio: {}, graded: null }
  // ans[i]: pg {pick:index} | bs {pick:true|false} | isian {png, cands, engine, text, busy}
  var S = null;
  function getMode() { try { var m = localStorage.getItem(MODE_KEY); return m === 'tulis' ? 'tulis' : 'ketik'; } catch (e) { return 'ketik'; } }
  function setModePref(m) { try { localStorage.setItem(MODE_KEY, m); } catch (e) {} }

  /* ---------- util ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(id, n) { try { var d = load(); d[id] = n; localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function T() { return window.Tulis || null; }
  function ic(name, cls) {
    var p = {
      speaker: '<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/>',
      read: '<path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5"/>',
      back: '<path d="M14 6l-6 6 6 6"/><path d="M8 12h12"/>',
      star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
      check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      x: '<path d="M7 7l10 10"/><path d="M17 7L7 17"/>',
      send: '<path d="M4 12l16-8-6 16-3-6.5z"/><path d="M11 13.5L20 4"/>',
      redo: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4.5h4.5"/>',
      grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
      pen: '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>',
      clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 11l2 2 4-4"/><path d="M8.5 17h7"/>',
      type: '<rect x="3.5" y="6.5" width="17" height="11" rx="2.5"/><path d="M7 10.5h.01M10.5 10.5h.01M14 10.5h.01M17 10.5h.01M8 14h8"/>',
      book: '<path d="M12 6.5C10.3 5.2 8 4.7 4.5 5v12.5c3.5-.3 5.8.2 7.5 1.5 1.7-1.3 4-1.8 7.5-1.5V5C16 4.7 13.7 5.2 12 6.5z"/><path d="M12 6.5V19"/>',
      fwd: '<path d="M10 6l6 6-6 6"/><path d="M16 12H4"/>',
      info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 7.6v.4"/>'
    }[name];
    return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------- bacakan soal (speechSynthesis) dan klip suara ---------- */
  var voice = null;
  function pickVoice() {
    try {
      var v = speechSynthesis.getVoices();
      voice = v.filter(function (x) { return /^id[-_]/i.test(x.lang) || /indonesia/i.test(x.name); })[0] || null;
    } catch (e) {}
  }
  try { pickVoice(); speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {}
  function say(text, btn) {
    try {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'id-ID'; if (voice) u.voice = voice; u.rate = 0.85;
      if (btn) { btn.classList.add('on'); u.onend = u.onerror = function () { btn.classList.remove('on'); }; }
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopAudio() {
    if (!S || !S.audio) return;
    Object.keys(S.audio).forEach(function (k) { try { S.audio[k].pause(); } catch (e) {} });
    app.querySelectorAll('.listen.on').forEach(function (b) { b.classList.remove('on'); });
  }
  function hush() {
    try { speechSynthesis.cancel(); } catch (e) {}
    try { mHush(); } catch (e) {}
    app.querySelectorAll('.speak.on').forEach(function (b) { b.classList.remove('on'); });
    stopAudio();
  }
  function play(i, btn) {
    var q = S.sub.soal[i];
    hush();
    var a = S.audio[i];
    if (!a) {
      a = S.audio[i] = new Audio(q.suara);
      a.preload = 'auto';
      a.onended = a.onpause = function () { btn.classList.remove('on'); };
      a.onerror = function () { btn.classList.remove('on'); var m = $('lmsg-' + i); if (m) m.textContent = 'Suaranya belum bisa diputar. Coba ketuk lagi.'; };
    }
    try { a.currentTime = 0; } catch (e) {}
    var m = $('lmsg-' + i); if (m) m.textContent = '';
    btn.classList.add('on');
    var p = a.play();
    if (p && p.catch) p.catch(function () { btn.classList.remove('on'); });
  }

  /* ---------- helpers soal ---------- */
  /* tanda hubung tak-putus: "An-Nas", "lari-lari" tidak patah di ujung baris */
  function br(s) { return esc(s).replace(/([A-Za-z\u00C0-\u024F])-(?=[A-Za-z\u00C0-\u024F])/g, '$1\u2011').replace(/ (\.{3,}|…)/g, '\u00a0$1').replace(/\n/g, '<br>'); }
  function jenis(q) { return q.jenis || 'pg'; }
  function isWrite(q) { var j = jenis(q); return j === 'isian' || j === 'uraian'; }
  function optLabel(p) { return typeof p === 'string' ? p : (p.label || ''); }
  function optPlain(p, i) { return optLabel(p) || ('gambar ' + L[i]); }
  function pic(src, alt, n) {
    var h = '';
    for (var k = 0; k < (n || 1); k++) h += '<img src="' + esc(src) + '" alt="' + (n ? '' : esc(alt || '')) + '" draggable="false">';
    return h;
  }
  function part(p) {
    if (p.teks != null) {
      var ar = /[؀-ۿ]/.test(p.teks), ayat = ar && /\s/.test(p.teks.trim());
      return '<span class="op' + (ar ? ' huruf' + (ayat ? ' ayat' : '') + '" lang="ar" dir="rtl' : '') + '" aria-hidden="true">' + esc(p.teks) + '</span>';
    }
    if (p.svg) return '<figure class="part"><div class="sv">' + p.svg + '</div></figure>';
    var n = p.n > 1 ? p.n : 0, cols = n ? Math.min(n, 5) : 1;
    return '<figure class="part"><div class="copies' + (n ? ' multi' : '') + '" style="--c:' + cols + '"' + (n ? ' role="img" aria-label="' + n + ' ' + esc(p.label || 'gambar') + '"' : '') + '>' + pic(p.img, p.label, n) + '</div>' +
      (p.label ? '<figcaption>' + esc(p.label) + '</figcaption>' : '') + '</figure>';
  }
  function optInner(p) {
    if (typeof p === 'string') return '<span class="t" dir="ltr">' + esc(p) + '</span>';
    var m = p.svg ? '<span class="sv">' + p.svg + '</span>' : '<img src="' + esc(p.img) + '" alt="" draggable="false">';
    return '<span class="t pic">' + m + (p.label ? '<span class="cap" dir="ltr">' + esc(p.label) + '</span>' : '') + '</span>';
  }
  function optHtml(q, i) {
    var p = q.pilihan[i];
    return '<span class="oa">' + L[i] + '. ' + (optLabel(p) ? '<span dir="ltr" class="iso">' + esc(optLabel(p)) + '</span>' : '<span class="mini">' + (p.svg ? p.svg : '<img src="' + esc(p.img) + '" alt="">') + '</span>') + '</span>';
  }
  function correctText(q) {
    var j = jenis(q);
    if (j === 'isian') return '<span dir="ltr" class="iso">' + esc((q.terima || [''])[0]) + '</span>';
    if (j === 'bs') return q.benar ? 'Benar' : 'Salah';
    return optHtml(q, q.jawab);
  }
  function answered(i) {
    var a = S.ans[i];
    if (!a) return false;
    if (!isWrite(S.sub.soal[i])) return true;
    return a.mode === 'ketik' ? !!a.text : !!a.png;
  }
  function countAnswered() {
    var n = 0;
    for (var i = 0; i < S.sub.soal.length; i++) if (answered(i)) n++;
    return n;
  }
  function readText(q) {
    var j = jenis(q), t = q.tanya.replace(/\n/g, '. ');
    (q.gambar || []).forEach(function (p) { if (p.label) t += '. ' + (p.n ? p.n + ' ' : '') + p.label; });
    if (j === 'pg') t += '. ' + q.pilihan.map(function (p, i) { return L[i] + (optLabel(p) ? '. ' + optLabel(p) : ''); }).join('. ');
    else if (j === 'bs') t += '. Benar atau salah?';
    else t += '. Ketik atau tulis jawabanmu.';
    return t;
  }

  /* ---------- dialog konfirmasi ---------- */
  function ask(title, body, noLabel, yesLabel, onYes) {
    var d = document.createElement('dialog');
    d.className = 'dlg';
    d.setAttribute('aria-labelledby', 'dlg-t');
    d.innerHTML = '<h2 id="dlg-t">' + esc(title) + '</h2>' + (body ? '<p>' + esc(body) + '</p>' : '') +
      '<div class="dlg-actions"><button class="btn secondary" value="no">' + ic('back') + esc(noLabel) + '</button>' +
      '<button class="btn primary" value="yes">' + esc(yesLabel) + '</button></div>';
    document.body.appendChild(d);
    var opener = document.activeElement;
    function close(ok) {
      try { d.close(); } catch (e) {}
      d.remove();
      if (ok) onYes(); else if (opener && opener.focus) opener.focus({ preventScroll: true });
    }
    d.querySelectorAll('button').forEach(function (b) { b.onclick = function () { close(b.value === 'yes'); }; });
    d.addEventListener('cancel', function (e) { e.preventDefault(); close(false); });
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    d.querySelector('button[value="no"]').focus();
  }

  /* ---------- beranda ---------- */
  function home() {
    hush(); S = null;
    var sk = load();
    var h = '<div class="wrap"><header class="home-head"><h1>Latihan Ujian <span>Kelas 2</span></h1>' +
      '<p class="parent">' + ic('info') + '<span>Untuk orang tua: anak memilih, mengetik, atau menulis jawaban, lalu menekan Kumpul. Tombol 😵‍💫 di tiap soal membuka penjelasan untuk orang tua. Setelah Kumpul, tekan Nilai untuk melihat hasilnya.</span></p></header>' +
      '<h2 class="hide">Pilih pelajaran</h2><div class="subjects">';
    DATA.forEach(function (s) {
      var pk = s.paket || [{ nama: 'Latihan 1', soal: s.soal }];
      h += '<section class="subject"><span class="s-name">' + esc(s.nama) + '</span><span class="s-materi">' + esc(s.materi) + '</span>' +
        (s.tambahan ? '<span class="s-foot"><span class="tag extra">Tambahan</span></span>' : '') +
        belajarHtml(s) + '<div class="pakets" role="group" aria-label="Pilih latihan ' + esc(s.nama) + '">';
      pk.forEach(function (p, k) {
        var sc = sk[s.id + '-' + (k + 1)];
        h += '<button class="paket" data-id="' + esc(s.id) + '" data-k="' + k + '" aria-label="' + esc(s.nama + ', ' + p.nama) + (typeof sc === 'number' ? ', nilai terakhir ' + sc : ', belum dicoba') + '">' +
          '<span class="p-name">' + esc(p.nama) + '</span>' +
          (typeof sc === 'number' ? '<span class="p-score">' + ic('star') + sc + '</span>' : '<span class="p-score none">Belum</span>') + '</button>';
      });
      h += '</div></section>';
    });
    app.innerHTML = h + '</div></div>';
    window.scrollTo(0, 0);
    app.querySelectorAll('.paket').forEach(function (b) { b.onclick = function () { start(b.dataset.id, +b.dataset.k); }; });
    app.querySelectorAll('.belajar').forEach(function (b) { b.onclick = function () { openMateri(b.dataset.id, 'home'); }; });
  }

  function start(id, k) {
    hush();
    var base = DATA.filter(function (s) { return s.id === id; })[0];
    var pk = base.paket || [{ nama: 'Latihan 1', soal: base.soal }];
    k = k || 0;
    var sub = { id: base.id + '-' + (k + 1), mapel: base.id, paketIdx: k, nama: base.nama + ' \u00b7 ' + pk[k].nama, soal: pk[k].soal, materi: base.materi };
    S = { sub: sub, ans: [], pads: [], modes: [], audio: {}, graded: null, over: {} };
    exam();
  }

  function leave() {
    if (S && !S.graded && countAnswered() > 0) ask('Keluar dari ujian?', 'Jawaban yang sudah kamu isi akan hilang.', 'Kembali', 'Keluar', home);
    else home();
  }

  /* ---------- lembar ujian ---------- */
  function topbar(right) {
    return '<header class="bar"><button class="btn ghost" id="home">' + ic('back') + '<span>Beranda</span></button>' +
      '<div class="bar-title">' + esc(S.sub.nama) + '</div>' + right + '</header>';
  }
  function progressHtml() {
    var n = countAnswered(), tot = S.sub.soal.length;
    return '<span class="lbl">Terjawab</span> <b>' + n + '/' + tot + '</b>';
  }
  function updateProgress() {
    var p = $('prog'); if (!p) return;
    var n = countAnswered(), tot = S.sub.soal.length;
    p.innerHTML = progressHtml();
    p.setAttribute('aria-label', 'Terjawab ' + n + ' dari ' + tot);
    $('progfill').style.width = (n * 100 / tot) + '%';
    for (var i = 0; i < tot; i++) { var c = $('q-' + i); if (c && answered(i)) c.classList.remove('empty'); }
  }

  function parentBtn(pid) {
    return '<button class="pk" data-t="' + pid + '" aria-label="Penjelasan untuk orang tua" aria-expanded="false" aria-controls="' + pid + '"><span aria-hidden="true">😵‍💫</span></button>';
  }
  function parentPanel(q, pid, i) {
    return '<div class="kx" id="' + pid + '" role="region" aria-label="Untuk orang tua, soal ' + (i + 1) + '" hidden><h3>Untuk orang tua</h3><p>' +
      (q.konteks ? br(q.konteks) : 'Belum ada penjelasan untuk soal ini.') + '</p></div>';
  }
  function writeHtml(q, i) {
    var u = jenis(q) === 'uraian';
    return '<div class="write ' + (u ? 'long' : 'short') + '" id="w-' + i + '">' +
      '<div class="w-top"><label class="w-lbl" id="wl-' + i + '" for="in-' + i + '"></label>' +
      '<div class="seg" role="radiogroup" aria-label="Cara menjawab soal ' + (i + 1) + '">' +
      '<button type="button" role="radio" class="seg-b" data-i="' + i + '" data-m="ketik" aria-checked="false">' + ic('type') + 'Ketik</button>' +
      '<button type="button" role="radio" class="seg-b" data-i="' + i + '" data-m="tulis" aria-checked="false">' + ic('pen') + 'Tulis</button></div></div>' +
      '<div class="typebox" id="type-' + i + '">' + (u
        ? '<textarea class="typed" id="in-' + i + '" rows="4" autocomplete="off" autocapitalize="sentences" spellcheck="false"></textarea>'
        : '<input class="typed" id="in-' + i + '" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done">') + '</div>' +
      '<div class="padbox" id="pad-' + i + '" hidden></div>' +
      '<div class="w-foot"><button class="btn primary" id="jawab-' + i + '" data-i="' + i + '">' + ic('check') + 'Jawab</button>' +
      '<button class="btn secondary hide" id="ulang-' + i + '" data-i="' + i + '"></button>' +
      '<div class="read" id="read-' + i + '" aria-live="polite"></div></div></div>';
  }
  function cardHtml(q, i) {
    var j = jenis(q), h = '';
    h += '<article class="qc" id="q-' + i + '" aria-labelledby="qt-' + i + '">';
    h += '<div class="qhead"><span class="qno" aria-hidden="true">' + (i + 1) + '</span>' +
      '<div class="qtext" id="qt-' + i + '" dir="ltr"><span class="sr">Soal ' + (i + 1) + '. </span>' + br(q.tanya) + '</div>' +
      '<div class="qtools"><button class="speak" data-i="' + i + '" aria-label="Bacakan soal ' + (i + 1) + '">' + ic('read') + '</button></div></div>';
    var hasPic = q.gambar && q.gambar.length;
    if (hasPic || q.suara) {
      h += '<div class="picbox' + (q.suara ? ' has-audio' : '') + '" role="group" aria-label="Gambar soal">';
      if (q.suara) h += '<div class="listen-wrap"><button class="listen" data-i="' + i + '" aria-describedby="lmsg-' + i + '">' + ic('speaker') + '<span>Dengarkan</span></button><span class="lmsg" id="lmsg-' + i + '" aria-live="polite"></span></div>';
      if (hasPic) h += q.gambar.map(part).join('');
      h += '</div>';
    }
    h += '<div class="answer">';
    if (j === 'pg') {
      var picOpts = q.pilihan.some(function (p) { return typeof p !== 'string'; });
      h += '<div class="opts' + (picOpts ? ' picopts' : '') + (q.pilihan.length > 3 ? ' n4' : '') + '" role="group" aria-label="Pilihan jawaban soal ' + (i + 1) + '">';
      q.pilihan.forEach(function (p, k) {
        h += '<button class="opt' + (picOpts ? ' pico' : '') + '" data-i="' + i + '" data-v="' + k + '" aria-pressed="false" aria-label="' + L[k] + ', ' + esc(optPlain(p, k)) + '"><span class="k" aria-hidden="true">' + L[k] + '</span>' + optInner(p) + '</button>';
      });
      h += '</div>';
    } else if (j === 'bs') {
      h += '<div class="opts bs" role="group" aria-label="Benar atau salah, soal ' + (i + 1) + '">' +
        '<button class="opt" data-i="' + i + '" data-v="1" aria-pressed="false"><span class="t center">Benar</span></button>' +
        '<button class="opt" data-i="' + i + '" data-v="0" aria-pressed="false"><span class="t center">Salah</span></button></div>';
    } else {
      h += writeHtml(q, i);
    }
    /* bantuan orang tua di "lantai bawah" kartu: tidak memisahkan soal dari gambar dan pilihannya */
    h += '</div><div class="kfoot">' + parentBtn('kx-' + i) + '</div>' + parentPanel(q, 'kx-' + i, i) + '</article>';
    return h;
  }

  function exam() {
    hush();
    var s = S.sub;
    var h = topbar('<div class="prog-wrap"><div class="prog" id="prog" role="status">' + progressHtml() + '</div><div class="progbar" aria-hidden="true"><i id="progfill"></i></div></div>');
    h += '<main class="wrap paper"><div class="paper-head"><h1>' + esc(s.nama) + '</h1><p>' + s.soal.length + ' soal. Pilih, ketik, atau tulis jawabanmu. Jawaban bisa diganti sebelum dikumpulkan.</p>' + lihatHtml(s.mapel) + '</div>';
    s.soal.forEach(function (q, i) { h += cardHtml(q, i); });
    h += '<div class="submit"><p class="submit-note" id="submit-note"></p><button class="btn primary kumpul" id="kumpul">' + ic('send') + 'Kumpul</button></div></main>';
    app.innerHTML = h;
    window.scrollTo(0, 0);
    $('home').onclick = leave;
    if ($('lihat')) $('lihat').onclick = function () { openMateri(s.mapel, 'exam'); };
    app.querySelectorAll('.speak').forEach(function (b) { b.onclick = function () { hush(); say(readText(s.soal[+b.dataset.i]), b); }; });
    app.querySelectorAll('.listen').forEach(function (b) { b.onclick = function () { play(+b.dataset.i, b); }; });
    app.querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { mark(+b.dataset.i, +b.dataset.v); }; });
    s.soal.forEach(function (q, i) { if (isWrite(q)) initWrite(i); });
    $('kumpul').onclick = kumpul;
    updateProgress();
  }

  function mark(i, v) {
    var q = S.sub.soal[i], j = jenis(q);
    S.ans[i] = { pick: j === 'bs' ? v === 1 : v };
    $('q-' + i).querySelectorAll('.opt').forEach(function (b) {
      var on = +b.dataset.v === v;
      b.classList.toggle('sel', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('q-' + i).classList.add('done');
    updateProgress();
  }

  /* ---------- isian dan uraian: ketik atau tulis ---------- */
  function initWrite(i) {
    S.modes[i] = getMode();
    setMode(i, S.modes[i], false);
    app.querySelectorAll('#w-' + i + ' .seg-b').forEach(function (b) { b.onclick = function () { setMode(i, b.dataset.m, true); }; });
    $('jawab-' + i).onclick = function () { jawab(i); };
    $('ulang-' + i).onclick = function () { ulang(i); };
    $('in-' + i).addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); jawab(i); } });
    $('in-' + i).addEventListener('input', function () { var r = $('read-' + i); if (r && !S.ans[i]) r.innerHTML = ''; });
  }
  function setMode(i, m, persist) {
    var q = S.sub.soal[i], w = $('w-' + i);
    if (S.ans[i]) return;
    S.modes[i] = m;
    w.dataset.mode = m;
    w.querySelectorAll('.seg-b').forEach(function (b) { b.setAttribute('aria-checked', b.dataset.m === m ? 'true' : 'false'); });
    var lbl = $('wl-' + i), u = jenis(q) === 'uraian';
    if (m === 'ketik') {
      lbl.innerHTML = ic('type') + 'Ketik jawabanmu di sini';
      lbl.setAttribute('for', 'in-' + i);
      $('type-' + i).hidden = false; $('pad-' + i).hidden = true;
    } else {
      lbl.innerHTML = ic('pen') + (u ? 'Tulis jawabanmu di kotak bergaris ini' : 'Tulis jawabanmu di kotak ini');
      lbl.removeAttribute('for');
      $('type-' + i).hidden = true; $('pad-' + i).hidden = false;
      ensurePad(i);
    }
    if (persist) setModePref(m);
    var r = $('read-' + i); if (r) r.innerHTML = '';
  }
  function ensurePad(i) {
    if (S.pads[i]) { try { S.pads[i].resize(); } catch (e) {} return S.pads[i]; }
    var box = $('pad-' + i), Tu = T(), u = jenis(S.sub.soal[i]) === 'uraian', wide = window.innerWidth >= 700;
    var o = u ? { height: wide ? 300 : 240, lines: wide ? 4 : 3 } : (wide ? { height: 220 } : {});
    try {
      if (!Tu || !Tu.create) throw new Error('no tulis');
      var pad = Tu.create(box, o);
      S.pads[i] = pad;
      pad.onchange = function () { var r = $('read-' + i); if (r && !S.ans[i]) r.innerHTML = ''; };
      return pad;
    } catch (e) {
      box.innerHTML = '<p class="padfail">Papan tulis belum siap. Muat ulang halaman ini, atau pilih Ketik.</p>';
      return null;
    }
  }
  function readHtml(a) {
    if (a.busy) return '<span class="reading">Sedang membaca tulisan…</span>';
    if (a.mode === 'ketik') return '<span class="rl">Jawabanmu:</span> <b dir="ltr" class="iso pre">' + esc(a.text) + '</b>';
    if (a.text) return '<span class="rl">Terbaca:</span> <b dir="ltr" class="iso pre">' + esc(a.text) + '</b>';
    return '<span class="rl">Terbaca:</span> <span class="unread">tulisan belum terbaca mesin. Orang tua memeriksa saat penilaian.</span>';
  }
  function lockUi(i, a) {
    $('w-' + i).classList.add('locked');
    $('q-' + i).classList.add('done');
    $('jawab-' + i).classList.add('hide');
    var u = $('ulang-' + i);
    u.innerHTML = ic('redo') + (a.mode === 'ketik' ? 'Ubah' : 'Tulis ulang');
    u.classList.remove('hide');
    $('read-' + i).innerHTML = readHtml(a);
    updateProgress();
  }
  function jawab(i) {
    var m = S.modes[i], r = $('read-' + i), a;
    if (m === 'ketik') {
      var inp = $('in-' + i), txt = inp.value.replace(/\s+/g, ' ').replace(/^ | $/g, '');
      if (!txt) { r.innerHTML = '<span class="warn">Ketik jawabanmu dulu ya.</span>'; inp.focus({ preventScroll: true }); return; }
      a = S.ans[i] = { mode: 'ketik', text: txt, cands: [txt], engine: 'ketik', busy: false };
      inp.readOnly = true;
      lockUi(i, a);
      return;
    }
    var pad = S.pads[i];
    if (!pad) return;
    if (pad.isEmpty()) { r.innerHTML = '<span class="warn">Tulis jawabanmu dulu ya.</span>'; return; }
    var png = '';
    try { png = pad.toPNG(); } catch (e) {}
    try { pad.lock(); } catch (e) {}
    a = S.ans[i] = { mode: 'tulis', png: png || 'x', cands: [], engine: 'none', text: '', busy: true, token: {} };
    var tok = a.token;
    lockUi(i, a);
    var p;
    try { p = T().recognize(pad, { lang: 'id' }); } catch (e) { p = null; }
    Promise.resolve(p).then(function (res) {
      if (!S || S.ans[i] !== a || a.token !== tok) return;
      res = res || {};
      a.cands = Array.isArray(res.candidates) ? res.candidates.filter(function (c) { return c != null && String(c).trim(); }).map(String) : [];
      a.engine = res.engine || 'none';
      a.text = a.cands[0] || '';
      a.busy = false;
      var el = $('read-' + i); if (el) el.innerHTML = readHtml(a);
    }, function () {
      if (!S || S.ans[i] !== a) return;
      a.busy = false; var el = $('read-' + i); if (el) el.innerHTML = readHtml(a);
    });
  }
  function ulang(i) {
    var prev = S.ans[i];
    S.ans[i] = null;
    $('w-' + i).classList.remove('locked');
    $('q-' + i).classList.remove('done');
    $('ulang-' + i).classList.add('hide');
    var jb = $('jawab-' + i); jb.classList.remove('hide');
    $('read-' + i).innerHTML = '';
    if (prev && prev.mode === 'ketik') {
      var inp = $('in-' + i); inp.readOnly = false; inp.focus({ preventScroll: true });
    } else {
      var pad = S.pads[i];
      try { pad.unlock(); pad.clear(); } catch (e) {}
      jb.focus({ preventScroll: true });
    }
    updateProgress();
  }

  /* ---------- kumpul ---------- */
  function kumpul() {
    var tot = S.sub.soal.length, n = countAnswered(), empty = tot - n;
    // Tulisan yang belum ditekan Jawab ikut dihitung kosong; beri tahu anak.
    var busy = S.ans.some(function (a) { return a && a.busy; });
    if (empty > 0) ask('Masih ada ' + empty + ' soal kosong. Tetap kumpulkan?', 'Soal yang kosong ditandai di lembar ujian.', 'Kembali', 'Kumpulkan', function () { finish(); });
    else if (busy) { $('submit-note').textContent = 'Tunggu sebentar, tulisanmu sedang dibaca.'; setTimeout(kumpul, 400); }
    else finish();
    markEmpty();
  }
  function markEmpty() {
    S.sub.soal.forEach(function (q, i) { var c = $('q-' + i); if (c) c.classList.toggle('empty', !answered(i)); });
  }
  function finish() {
    hush();
    S.done = true;
    // Tulisan yang belum dikunci (belum tekan Jawab) dianggap kosong.
    grading();
  }

  /* ---------- penilaian ---------- */
  function judge(i) {
    var q = S.sub.soal[i], j = jenis(q), a = answered(i) ? S.ans[i] : null;
    if (!a) return { st: 'kosong', ok: false };
    if (j === 'pg') return { st: a.pick === q.jawab ? 'benar' : 'salah', ok: a.pick === q.jawab };
    if (j === 'bs') return { st: a.pick === !!q.benar ? 'benar' : 'salah', ok: a.pick === !!q.benar };
    if (j === 'uraian') return judgeUraian(q, a);
    if (a.mode !== 'ketik' && (a.engine === 'none' || !a.cands.length)) return { st: 'periksa', ok: false };
    var m = { ok: false };
    try { m = T().match(a.cands, q.terima || []) || m; } catch (e) {}
    return { st: m.ok ? 'benar' : 'salah', ok: !!m.ok, matched: m.matched, cand: m.ok ? m.candidate : '' };
  }
  /* uraian: normalisasi, hitung gagasan yang cocok */
  function normTxt(s) {
    var t = String(s == null ? '' : s).toLowerCase();
    try { t = t.replace(/[^\p{L}\p{N}\s]+/gu, ' '); } catch (e) { t = t.replace(/[^a-z0-9\s]+/g, ' '); }
    return t.replace(/\s+/g, ' ').trim();
  }
  /* bentuk dasar kasar: buang imbuhan umum (mengantre -> antre, membuang -> buang, bersihkan -> bersih) */
  function stems(w) {
    var out = [w], base = [w];
    var pre = ['memper', 'meng', 'meny', 'mem', 'men', 'me', 'ber', 'be', 'di', 'ter', 'ke', 'se', 'pe'];
    for (var p = 0; p < pre.length; p++) if (w.indexOf(pre[p]) === 0 && w.length - pre[p].length >= 3) base.push(w.slice(pre[p].length));
    var suf = ['kannya', 'nya', 'kan', 'lah', 'an', 'i'];
    base.forEach(function (b) {
      out.push(b);
      for (var s = 0; s < suf.length; s++) { var x = suf[s]; if (b.length - x.length >= 3 && b.slice(-x.length) === x) out.push(b.slice(0, -x.length)); }
    });
    return out;
  }
  /* kata yang membalik makna: "tidak bagus" bukan pujian, kecuali kata kuncinya sendiri memuat ingkaran ("tidak menyontek") */
  var NEG = ['tidak', 'tak', 'bukan', 'jangan', 'belum', 'gak', 'nggak', 'ga', 'enggak', 'kurang'];
  function negated(words, i) {
    return (i > 0 && NEG.indexOf(words[i - 1]) >= 0) || (i > 1 && NEG.indexOf(words[i - 2]) >= 0 && words[i - 1] === 'terlalu');
  }
  function ideaHit(words, padded, syns) {
    for (var k = 0; k < syns.length; k++) {
      var n = normTxt(syns[k]);
      if (!n) continue;
      var toks = n.split(' '), m = toks.length, selfNeg = NEG.indexOf(toks[0]) >= 0;
      for (var i = 0; i + m <= words.length; i++) {
        if (selfNeg ? false : negated(words, i)) continue;
        if (words.slice(i, i + m).join(' ') === n) return syns[k];
        if (m > 1) continue;
        var wd = words[i];
        if (n.length >= 4 && (stems(wd).indexOf(n) >= 0 || (wd.length >= 4 && stems(n).indexOf(wd) >= 0))) return syns[k];
        if (n.length >= 5 && Math.abs(wd.length - n.length) <= 1 && T().levenshtein(wd, n) <= 1) return syns[k];
      }
    }
    return null;
  }
  function uraianHits(q, texts) {
    var best = null;
    texts.forEach(function (t) {
      var nt = normTxt(t), words = nt ? nt.split(' ') : [], padded = ' ' + nt + ' ', found = [];
      (q.kunci || []).forEach(function (syns, k) {
        var h = ideaHit(words, padded, Array.isArray(syns) ? syns : [syns]);
        if (h) found.push({ k: k, syn: h });
      });
      if (!best || found.length > best.found.length) best = { found: found, text: t };
    });
    return best || { found: [], text: '' };
  }
  function judgeUraian(q, a) {
    var min = q.minimal || 1;
    if (a.mode !== 'ketik' && (a.engine === 'none' || !a.cands.length)) return { st: 'periksa', ok: false, found: [], min: min };
    var r = uraianHits(q, a.cands), ok = r.found.length >= min;
    return { st: ok ? 'benar' : 'periksa', ok: ok, found: r.found, min: min, cand: r.text };
  }
  function pendingU(i) {
    var g = S.graded[i], o = S.over[i];
    /* isian atau uraian berstatus Periksa yang belum diputuskan orang tua: belum dihitung, tidak dianggap salah */
    return g.st === 'periksa' && o !== true && o !== false;
  }
  function finalOk(i) {
    var o = S.over[i];
    return o === true || o === false ? o : S.graded[i].ok;
  }
  function score() {
    var tot = S.sub.soal.length, n = 0, pend = 0;
    for (var i = 0; i < tot; i++) { if (pendingU(i)) pend++; else if (finalOk(i)) n++; }
    var den = tot - pend;
    return { benar: n, tot: tot, den: den, pend: pend, nilai: den ? Math.round(n * 100 / den) : 0 };
  }

  function grading() {
    var s = S.sub, tot = s.soal.length, n = countAnswered();
    var h = topbar('<div class="prog-wrap"><div class="prog"><span class="lbl">Penilaian</span></div></div>');
    h += '<main class="wrap"><section class="grade" id="grade" aria-live="polite">' +
      '<div class="g-icon">' + ic('clip') + '</div>' +
      '<h1>Ujian sudah dikumpulkan</h1>' +
      '<p class="g-sub">Terjawab ' + n + ' dari ' + tot + ' soal.</p>' +
      '<button class="btn primary nilai-btn" id="nilai">' + ic('star') + 'Nilai</button>' +
      '<p class="g-note">Untuk orang tua: tekan Nilai untuk memeriksa semua jawaban sekaligus.</p></section></main>';
    app.innerHTML = h;
    window.scrollTo(0, 0);
    $('home').onclick = home;
    $('nilai').onclick = nilai;
    $('nilai').focus({ preventScroll: true });
  }

  function nilai() {
    var s = S.sub;
    S.graded = s.soal.map(function (q, i) { return judge(i); });
    S.over = {};
    var rows = '';
    s.soal.forEach(function (q, i) { rows += rowHtml(q, i); });
    var hasIsian = s.soal.some(function (q, i) { return isWrite(q) && answered(i); });
    var main = app.querySelector('main');
    main.innerHTML = '<section class="result" id="result"></section>' +
      '<section class="review"><h2>Periksa jawaban</h2>' +
      (hasIsian ? '<p class="parent small">' + ic('info') + '<span>Untuk orang tua: jawaban tulisan dibaca mesin dan bisa salah terbaca. Jawaban yang ditandai Periksa belum dihitung. Tekan Benar atau Salah di soal itu, nilai langsung berubah.</span></p>' : '') +
      '<ol class="rlist">' + rows + '</ol></section>' +
      '<div class="res-actions"><button class="btn primary" id="again">' + ic('redo') + 'Ulangi ujian</button><button class="btn secondary" id="other">' + ic('grid') + 'Pilih pelajaran lain</button></div>';
    main.querySelectorAll('.ov').forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.i, v = b.dataset.v === '1';
        S.over[i] = v;
        refreshRow(i);
        renderScore();
      };
    });
    $('again').onclick = function () { start(s.mapel, s.paketIdx); };
    $('other').onclick = home;
    renderScore();
    window.scrollTo(0, 0);
    var r = $('result'); r.setAttribute('tabindex', '-1'); r.focus({ preventScroll: true });
  }

  function chip(i) {
    var g = S.graded[i], o = S.over[i];
    if (o === true || o === false) return o ? '<span class="chip ok">' + ic('check') + 'Benar</span>' : '<span class="chip no">' + ic('x') + 'Salah</span>';
    if (g.st === 'benar') return '<span class="chip ok">' + ic('check') + 'Benar</span>';
    if (g.st === 'periksa') return '<span class="chip chk">' + ic('info') + 'Periksa</span>';
    if (g.st === 'kosong') return '<span class="chip no">' + ic('x') + 'Kosong</span>';
    return '<span class="chip no">' + ic('x') + 'Salah</span>';
  }
  function childAnswer(q, i) {
    var j = jenis(q), a = answered(i) ? S.ans[i] : null;
    if (!a) return '<span class="empty-a">Tidak dijawab</span>';
    if (j === 'pg') return optHtml(q, a.pick);
    if (j === 'bs') return a.pick ? 'Benar' : 'Salah';
    if (a.mode === 'ketik') return '<b dir="ltr" class="iso pre">' + esc(a.text) + '</b>';
    return '<span class="hw">' + (a.png && a.png !== 'x' ? '<img src="' + esc(a.png) + '" alt="Tulisan anak">' : '') + '</span>' +
      '<span class="hw-t">Terbaca: ' + (S.graded[i].cand && S.graded[i].cand !== Tulis.normalize(a.text) && j === 'isian' ? '<b dir="ltr" class="iso">' + esc(a.text) + '</b> atau <b dir="ltr" class="iso">' + esc(S.graded[i].cand) + '</b>' : a.text ? '<b dir="ltr" class="iso pre">' + esc(a.text) + '</b>' : '<i>belum terbaca</i>') + '</span>';
  }
  function ideasHtml(q, i) {
    var g = S.graded[i], f = g.found || [], h = '<span class="id-l">Gagasan ditemukan: ' + f.length + ' dari ' + (q.kunci || []).length + ' (minimal ' + g.min + ')</span>';
    if (f.length) h += '<ul>' + f.map(function (x) { return '<li>' + ic('check') + '<span dir="ltr" class="iso">' + esc(x.syn) + '</span></li>'; }).join('') + '</ul>';
    else h += '<span class="id-none">Belum ada gagasan yang cocok.</span>';
    return h;
  }
  function rowHtml(q, i) {
    var j = jenis(q), canOv = isWrite(q) && answered(i);
    var h = '<li class="row" id="r-' + i + '"><div class="r-top"><span class="qno sm" aria-hidden="true">' + (i + 1) + '</span>' +
      '<div class="r-q" dir="ltr"><span class="sr">Soal ' + (i + 1) + '. </span>' + br(q.tanya) + '</div><div class="r-tools"><span class="r-chip" id="chip-' + i + '">' + chip(i) + '</span>' + parentBtn('rkx-' + i) + '</div></div>' +
      parentPanel(q, 'rkx-' + i, i) +
      '<dl class="r-ans"><div><dt>Jawaban anak</dt><dd>' + childAnswer(q, i) + '</dd></div>' +
      (j === 'uraian' ? '<div><dt>Contoh jawaban</dt><dd class="good pre">' + br(q.contoh || '') + '</dd></div>' : '<div><dt>Jawaban benar</dt><dd class="good">' + correctText(q) + '</dd></div>') + '</dl>' +
      (j === 'uraian' && answered(i) ? '<div class="ideas" id="ideas-' + i + '">' + ideasHtml(q, i) + '</div>' : '') +
      (q.bahas ? '<p class="why">' + esc(q.bahas) + '</p>' : '');
    if (canOv) h += '<div class="ovrow" role="group" aria-label="Koreksi orang tua untuk soal ' + (i + 1) + '"><span class="ov-l">Koreksi orang tua</span>' +
      '<button class="ov" data-i="' + i + '" data-v="1" aria-pressed="false">' + ic('check') + 'Benar</button>' +
      '<button class="ov" data-i="' + i + '" data-v="0" aria-pressed="false">' + ic('x') + 'Salah</button></div>';
    return h + '</li>';
  }
  function refreshRow(i) {
    $('chip-' + i).innerHTML = chip(i);
    var o = S.over[i];
    $('r-' + i).querySelectorAll('.ov').forEach(function (b) {
      var on = (b.dataset.v === '1') === o && (o === true || o === false);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function renderScore() {
    var sc = score(), s = S.sub;
    save(s.id, sc.nilai);
    var stars = sc.nilai >= 80 ? 3 : sc.nilai >= 50 ? 2 : 1;
    var msg = sc.nilai === 100 ? 'Luar biasa! Semua jawabanmu benar.' : sc.nilai >= 80 ? 'Hebat sekali! Kamu sudah paham banyak.' : sc.nilai >= 50 ? 'Bagus! Sedikit lagi. Yuk bahas yang salah bersama.' : 'Terima kasih sudah berusaha. Yuk belajar bersama, lalu coba lagi.';
    var periksa = S.graded.filter(function (g, i) { return g.st === 'periksa' && S.over[i] !== true && S.over[i] !== false; }).length;
    var pend = sc.pend;
    var sr = '';
    for (var k = 1; k <= 3; k++) sr += '<svg class="' + (k <= stars ? 'on' : '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/></svg>';
    $('result').innerHTML = '<p class="sub">' + sc.benar + ' dari ' + sc.den + ' benar' + (pend ? ', ' + pend + ' belum dihitung' : '') + '</p>' +
      '<h1 class="nilai">' + (pend ? 'Nilai sementara' : 'Nilaimu') + ' <b id="skor">' + sc.nilai + '</b></h1><div class="starrow" role="img" aria-label="' + stars + ' bintang dari 3">' + sr + '</div>' +
      '<p class="cheer">' + msg + '</p>' +
      (pend ? '<p class="pending">' + ic('info') + pend + ' jawaban menunggu diperiksa orang tua.</p>' : '');
  }

  app.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.pk') : null;
    if (!b) return;
    var pn = $(b.dataset.t); if (!pn) return;
    var open = pn.hidden;
    pn.hidden = !open;
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.classList.toggle('on', open);
  });


  /* ---------- Belajar dulu (materi) ---------- */
  var MAT = window.MATERI || {};
  var MKEY = 'latihan-k2-s1-materi';
  var EMOJI_PARENT = true;
  var M = null; // { id, nama, from, idx, audio, y, n }
  function hasMat(id) { return !!MAT && Array.isArray(MAT[id]) && MAT[id].length > 0; }
  function matDone() { try { return JSON.parse(localStorage.getItem(MKEY)) || {}; } catch (e) { return {}; } }
  function matMark(id) { try { var d = matDone(); d[id] = 1; localStorage.setItem(MKEY, JSON.stringify(d)); } catch (e) {} }
  function mapelOf(id) { return DATA.filter(function (s) { return s.id === id; })[0]; }
  function belajarHtml(s) {
    if (!hasMat(s.id)) return '';
    var done = !!matDone()[s.id];
    return '<button class="btn primary belajar" data-id="' + esc(s.id) + '" aria-label="Belajar dulu: ' + esc(s.nama) + (done ? ', sudah dibaca' : '') + '">' + ic('book') + '<span class="b-txt"><span>Belajar dulu</span>' +
      (done ? '<span class="done-badge">' + ic('check') + 'Sudah dibaca</span>' : '') + '</span></button>';
  }
  function lihatHtml(id) {
    return hasMat(id) ? '<button class="btn ghost lihat" id="lihat" type="button">' + ic('book') + '<span>Lihat materi</span></button>' : '';
  }
  function mHush() {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (M && M.audio) { try { M.audio.pause(); } catch (e) {} }
    var h = $('materi'); if (h) h.querySelectorAll('.mk-act.on').forEach(function (b) { b.classList.remove('on'); });
  }
  function mHost() {
    var el = $('materi');
    if (el) return el;
    el = document.createElement('div'); el.id = 'materi'; el.hidden = true;
    document.body.appendChild(el);
    var sx = 0, sy = 0, tr = false;
    el.addEventListener('touchstart', function (e) { tr = e.touches.length === 1; if (tr) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (!tr || !M || !e.changedTouches.length) return;
      tr = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) matGo(M.idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    el.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.pk, .pkl') : null;
      if (!b) return;
      var pn = $(b.dataset.t); if (!pn) return;
      var open = pn.hidden;
      pn.hidden = !open;
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.classList.toggle('on', open);
    });
    document.addEventListener('keydown', function (e) {
      if (!M || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target && e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || document.querySelector('dialog[open]')) return;
      if (e.key === 'ArrowRight') matGo(M.idx + 1); else if (e.key === 'ArrowLeft') matGo(M.idx - 1);
    });
    return el;
  }
  function openMateri(id, from) {
    var base = mapelOf(id); if (!base || !hasMat(id)) return;
    hush();
    var host = mHost();
    M = { id: id, nama: base.nama, from: from, idx: 0, audio: null, y: window.scrollY || 0, n: MAT[id].length };
    host.innerHTML = '<header class="bar"><button class="btn ghost" id="mk-back" type="button">' + ic('back') + '<span>' + (from === 'exam' ? 'Ke soal' : 'Beranda') + '</span></button>' +
      '<div class="bar-title"><span class="mk-pre">Belajar · </span>' + esc(base.nama) + '</div>' +
      '<div class="prog-wrap" aria-hidden="true"><div class="progbar"><i id="mk-fill"></i></div></div></header>' +
      '<main class="wrap mk-wrap"><div id="mk-card"></div><p class="sr" id="mk-live" aria-live="polite"></p></main>' +
      '<nav class="mk-nav" aria-label="Pindah kartu"><div class="mk-nav-in"><button class="btn secondary" id="mk-prev" type="button">' + ic('back') + '<span>Sebelumnya</span></button>' +
      '<button class="btn primary" id="mk-next" type="button"><span>Berikutnya</span>' + ic('fwd') + '</button></div></nav>';
    app.hidden = true; host.hidden = false;
    $('mk-back').onclick = closeMateri;
    $('mk-prev').onclick = function () { matGo(M.idx - 1); };
    $('mk-next').onclick = function () { matGo(M.idx + 1); };
    matShow(false, 1);
  }
  function closeMateri() {
    if (!M) return;
    var m = M; mHush(); M = null;
    var host = $('materi'); host.hidden = true; host.innerHTML = '';
    app.hidden = false;
    if (m.from === 'exam') { window.scrollTo(0, m.y); var l = $('lihat'); if (l) l.focus({ preventScroll: true }); }
    else { home(); }
  }
  function matGo(n) {
    if (!M || n < 0 || n > M.n || n === M.idx) return;
    var dir = n > M.idx ? 1 : -1;
    mHush(); M.idx = n;
    matShow(true, dir);
  }
  function endS(t) { t = String(t).trim(); return /[.!?…:]$/.test(t) ? t : t + '.'; }
  function matRead(c) {
    var t = [endS(String(c.judul).replace(/\n/g, ' '))];
    (c.isi || []).forEach(function (s) { t.push(endS(String(s).replace(/\n/g, ' '))); });
    if (c.ingat) t.push('Ingat. ' + endS(String(c.ingat).replace(/\n/g, ' ')));
    return t.join(' ');
  }
  function isiHtml(arr) {
    var h = '<div class="mk-isi">';
    arr.forEach(function (s) {
      var m = /^(\d+)\.\s+([\s\S]*)$/.exec(String(s));
      if (m) h += '<p class="step"><span class="qno sm" aria-hidden="true">' + m[1] + '</span><span class="st" dir="ltr"><span class="sr">Langkah ' + m[1] + '. </span>' + br(m[2]) + '</span></p>';
      else h += '<p dir="ltr">' + br(s) + '</p>';
    });
    return h + '</div>';
  }
  function ortuHtml(c, i) {
    if (!c.ortu) return '';
    var pid = 'mk-kx-' + i;
    var btn = EMOJI_PARENT
      ? '<button class="pk" type="button" data-t="' + pid + '" aria-label="Penjelasan untuk orang tua" aria-expanded="false" aria-controls="' + pid + '"><span aria-hidden="true">😵‍💫</span></button>'
      : '<button class="pkl" type="button" data-t="' + pid + '" aria-expanded="false" aria-controls="' + pid + '">' + ic('info') + '<span>Untuk orang tua</span></button>';
    return '<div class="kfoot">' + btn + '</div><div class="kx" id="' + pid + '" role="region" aria-label="Untuk orang tua, kartu ' + (i + 1) + '" hidden><h3>Untuk orang tua</h3><p>' + br(c.ortu) + '</p></div>';
  }
  function cardHtml2(c, i, N, anim) {
    var h = '<article class="mc' + (anim ? ' in' : '') + '" aria-labelledby="mk-t">';
    h += '<div class="mk-meta"><span class="mk-count">Kartu ' + (i + 1) + ' dari ' + N + '</span>' + (c.kisi ? '<span class="tag">' + esc(c.kisi) + '</span>' : '') + '</div>';
    h += '<h1 class="mk-title" id="mk-t" tabindex="-1" dir="ltr">' + br(c.judul) + '</h1>';
    h += '<div class="mk-acts"><button class="mk-act" id="mk-read" type="button">' + ic('read') + '<span>Bacakan</span></button>' +
      (c.suara ? '<button class="mk-act audio" id="mk-play" type="button" aria-describedby="mk-msg">' + ic('speaker') + '<span>Dengarkan</span></button><span class="lmsg" id="mk-msg" aria-live="polite"></span>' : '') + '</div>';
    if (c.gambar && c.gambar.length) h += '<div class="picbox" role="group" aria-label="Gambar">' + c.gambar.map(part).join('') + '</div>';
    if (c.isi && c.isi.length) h += isiHtml(c.isi);
    if (c.contoh && c.contoh.length) {
      h += '<section class="mk-contoh" aria-labelledby="mk-ct"><h2 id="mk-ct">Contoh</h2>';
      c.contoh.forEach(function (x) {
        if (typeof x === 'string') x = { teks: x };
        h += '<div class="ct">' + (x.teks ? '<p dir="ltr">' + br(x.teks) + '</p>' : '') +
          (x.gambar && x.gambar.length ? '<div class="picbox" role="group" aria-label="Gambar contoh">' + x.gambar.map(part).join('') + '</div>' : '') + '</div>';
      });
      h += '</section>';
    }
    if (c.ingat) h += '<div class="mk-ingat" role="note"><h2>' + ic('star') + 'Ingat!</h2><p dir="ltr">' + br(c.ingat) + '</p></div>';
    return h + ortuHtml(c, i) + '</article>';
  }
  function ctaHtml(anim) {
    var base = mapelOf(M.id), pk = base.paket || [{ nama: 'Latihan 1', soal: base.soal }], sk = load(), ex = M.from === 'exam' && S && S.sub.mapel === M.id;
    var h = '<article class="mc cta' + (anim ? ' in' : '') + '" aria-labelledby="mk-t"><div class="g-icon">' + ic('check') + '</div>' +
      '<h1 class="mk-title" id="mk-t" tabindex="-1">Siap latihan?</h1>' +
      '<p class="g-sub">Kamu sudah membaca semua kartu ' + esc(base.nama) + '. Pilih satu latihan soal untuk mulai.</p>' +
      '<div class="pakets" role="group" aria-label="Pilih latihan ' + esc(base.nama) + '">';
    pk.forEach(function (p, k) {
      var sc = sk[base.id + '-' + (k + 1)], cur = ex && S.sub.paketIdx === k;
      h += '<button class="paket" type="button" data-k="' + k + '"' + (cur ? ' aria-current="true"' : '') + ' aria-label="' + esc(base.nama + ', ' + p.nama) + (cur ? ', kembali ke soal ini' : typeof sc === 'number' ? ', nilai terakhir ' + sc : ', belum dicoba') + '">' +
        '<span class="p-name">' + esc(p.nama) + '</span>' +
        (cur ? '<span class="p-score">Lanjutkan</span>' : typeof sc === 'number' ? '<span class="p-score">' + ic('star') + sc + '</span>' : '<span class="p-score none">Belum</span>') + '</button>';
    });
    return h + '</div></article>';
  }
  function matShow(anim, dir) {
    var c = MAT[M.id][M.idx], N = M.n, last = M.idx === N, card = $('mk-card');
    card.innerHTML = last ? ctaHtml(anim) : cardHtml2(c, M.idx, N, anim);
    card.style.setProperty('--dx', (dir > 0 ? 18 : -18) + 'px');
    $('mk-fill').style.width = (Math.min(M.idx + 1, N) * 100 / N) + '%';
    $('mk-prev').disabled = M.idx === 0;
    $('mk-next').classList.toggle('hide', last);
    $('mk-live').textContent = last ? 'Siap latihan? Pilih latihan soal.' : 'Kartu ' + (M.idx + 1) + ' dari ' + N + '. ' + c.judul;
    window.scrollTo(0, 0);
    if (last) matMark(M.id);
    var rd = $('mk-read');
    if (rd) rd.onclick = function () { mHush(); say(matRead(c), rd); };
    var pl = $('mk-play');
    if (pl) pl.onclick = function () { matPlay(c, pl); };
    card.querySelectorAll('.paket').forEach(function (b) { b.onclick = function () { matStart(+b.dataset.k); }; });
    var a = document.activeElement;
    if (anim && (!a || a === document.body || a.disabled || a.offsetParent === null || a.classList.contains('hide'))) { var t = $('mk-t'); if (t) t.focus({ preventScroll: true }); }
    else if (anim && a && a.id === 'mk-next') { /* fokus tetap di tombol */ }
  }
  function matPlay(c, btn) {
    mHush();
    var m = $('mk-msg'); if (m) m.textContent = '';
    if (!M.audio || M.audioSrc !== c.suara) {
      var a = M.audio = new Audio(c.suara); M.audioSrc = c.suara; a.preload = 'auto';
      a.onended = a.onpause = function () { btn.classList.remove('on'); };
      a.onerror = function () { btn.classList.remove('on'); var mm = $('mk-msg'); if (mm) mm.textContent = 'Suaranya belum bisa diputar. Coba ketuk lagi.'; };
    }
    try { M.audio.currentTime = 0; } catch (e) {}
    btn.classList.add('on');
    var p = M.audio.play();
    if (p && p.catch) p.catch(function () { btn.classList.remove('on'); });
  }
  function matStart(k) {
    var id = M.id, m = M;
    function go() { var from = m.from; M = null; mHush(); var host = $('materi'); host.hidden = true; host.innerHTML = ''; app.hidden = false; start(id, k); }
    if (m.from === 'exam' && S && S.sub.mapel === id) {
      if (S.sub.paketIdx === k) { closeMateri(); return; }
      if (!S.graded && countAnswered() > 0) { ask('Pindah latihan?', 'Jawaban yang sudah kamu isi akan hilang.', 'Kembali', 'Pindah', go); return; }
    }
    go();
  }

  home();
})();
