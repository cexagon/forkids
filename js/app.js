/* Kebun Hitung: logika permainan */
(() => {
  const A = window.ART, C = window.CONTENT;
  const { words, ikat } = C;
  const MISSIONS = 6;
  const $ = (s, el = document) => el.querySelector(s);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* ---------- Penyimpanan ---------- */
  const KEY = 'kebun-hitung-v2';
  const today = () => new Date().toISOString().slice(0, 10);
  const defaults = () => ({ name: '', unlocked: 1, stars: {}, plants: [], met: [], days: 0, lastDay: '', sessionsToday: 0, sound: true });
  let D = defaults();
  try { D = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* tanpa penyimpanan */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* abaikan */ } };
  if (D.lastDay !== today()) { D.sessionsToday = 0; }

  /* ---------- Suara ---------- */
  let voice = null, actx = null, speakSeq = 0, lastLines = [];
  const pickVoice = () => {
    try {
      const vs = speechSynthesis.getVoices();
      voice = vs.find(v => /id[-_]ID/i.test(v.lang) && /google/i.test(v.name))
        || vs.find(v => /id[-_]ID/i.test(v.lang)) || vs.find(v => /^id/i.test(v.lang)) || null;
    } catch (e) { voice = null; }
  };
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  /* Bicara seperti guru: kalimat pendek, satu per satu, dengan jeda kecil. */
  const say = (lines, opts = {}) => {
    const arr = (Array.isArray(lines) ? lines : [lines]).filter(Boolean);
    if (!opts.keep) lastLines = arr;
    if (!D.sound || !('speechSynthesis' in window)) return Promise.resolve();
    const seq = ++speakSeq;
    return new Promise(resolve => {
      try {
        speechSynthesis.cancel();
        const parts = [];
        arr.forEach(l => l.split(/(?<=[.!?])\s+/).forEach(p => { if (p.trim()) parts.push(p.trim()); }));
        let i = 0;
        const next = () => {
          if (seq !== speakSeq) return resolve();
          if (i >= parts.length) return resolve();
          const u = new SpeechSynthesisUtterance(parts[i++]);
          u.lang = 'id-ID'; if (voice) u.voice = voice;
          u.rate = opts.rate || 0.92; u.pitch = opts.pitch || 1.18; u.volume = 1;
          u.onend = () => setTimeout(next, 160);
          u.onerror = () => resolve();
          speechSynthesis.speak(u);
        };
        next();
        /* jaga-jaga bila onend tidak pernah dipanggil */
        setTimeout(() => { if (seq === speakSeq) resolve(); }, 1200 + parts.join(' ').length * 95);
      } catch (e) { resolve(); }
    });
  };
  const hush = () => { speakSeq++; try { speechSynthesis.cancel(); } catch (e) { /* abaikan */ } };

  const tone = (freqs, step = 0.09, type = 'triangle') => {
    if (!D.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        const t = actx.currentTime + i * step;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + step + 0.14);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + step + 0.16);
      });
    } catch (e) { /* tanpa suara */ }
  };
  const sfx = {
    take: () => tone([660]), back: () => tone([440]), ten: () => tone([520, 780], 0.07),
    tie: () => tone([523, 659, 784]), yes: () => tone([523, 659, 784, 1047]),
    no: () => tone([330, 262], 0.14, 'sine'), tick: () => tone([880], 0.05),
    fanfare: () => tone([523, 659, 784, 1047, 784, 1047, 1319], 0.11), pop: () => tone([990, 1320], 0.05, 'sine'),
  };

  /* ---------- Status sesi ---------- */
  const S = {};
  const resetSession = (chapter) => Object.assign(S, {
    chapter, round: 0, level: 0, streak: 0, results: [], busy: false,
    mode: 'ambil', target: 0, a: 0, b: 0, tens: 0, ones: 0, tries: 0, step: 0, options: [],
    customer: null, showDigits: false, tieHinted: false, startedAt: Date.now(),
  });

  const name = () => D.name || 'teman';
  const fill = (t) => t.replace('{n}', S.target).replace('{kata}', words(S.target)).replace(/\{nama\}/g, name());

  /* ---------- Kerangka ---------- */
  const app = $('#app');
  const render = (html, cls = '') => { hush(); app.className = cls; app.innerHTML = html; window.scrollTo(0, 0); };

  const bar = (opts = {}) => `
    <header class="bar">
      <button class="icon-btn" id="homeBtn" aria-label="Ke peta">${A.HOME}</button>
      ${opts.title ? `<div class="bar-title">${opts.title}</div>` : ''}
      <div class="progress" id="progress" aria-label="Kemajuan sesi">${opts.progress ? progressHtml() : ''}</div>
      <button class="icon-btn" id="soundBtn" aria-pressed="${D.sound}" aria-label="Suara">${A.SPEAKER}</button>
    </header>`;
  const progressHtml = () => {
    let h = '';
    for (let i = 0; i < MISSIONS; i++) {
      const r = S.results[i];
      if (r) h += `<div class="slot done">${r.firstTry ? A.FLOWER : A.SPROUT}</div>`;
      else h += `<div class="slot${i === S.round ? ' now' : ''}"></div>`;
    }
    return h;
  };
  const wireBar = () => {
    $('#homeBtn')?.addEventListener('click', () => { if (S.round !== undefined && app.dataset.screen === 'play') confirmLeave(); else mapScreen(); });
    $('#soundBtn')?.addEventListener('click', (e) => {
      D.sound = !D.sound; save();
      e.currentTarget.setAttribute('aria-pressed', String(D.sound));
      if (!D.sound) hush();
    });
  };
  const confirmLeave = () => {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="sheet"><h3>Berhenti dulu?</h3><p>Pembeli masih menunggu. Mau kembali ke peta?</p><div class="row"><button class="btn secondary" id="stay">Lanjut main</button><button class="btn primary" id="leave">Ke peta</button></div></div>`;
    app.appendChild(ov);
    $('#stay', ov).addEventListener('click', () => ov.remove());
    $('#leave', ov).addEventListener('click', () => mapScreen());
  };

  /* ---------- Layar awal ---------- */
  const startScreen = () => {
    render(`
      <div class="center hero">
        ${A.SCENE_BG}
        <div class="hero-body">
          ${A.KANCIL('hero-k', 'happy')}
          <h1>Kebun <span>Hitung</span></h1>
          <p class="lead">Bantu Kancil melayani pembeli di Warung Tebu. Hitung, ikat, dan kirim!</p>
          ${D.name ? '' : `<label class="field"><span>Siapa namamu? (boleh dibantu Ayah/Bunda)</span><input id="nameIn" maxlength="14" autocomplete="off" placeholder="nama panggilan"></label>`}
          <button class="btn primary big-btn" id="startBtn">${D.name ? `Halo, ${D.name}! Ayo main` : 'Ayo mulai'}</button>
          <p class="note">Nyalakan suara, ya. Satu sesi sekitar 10 menit.</p>
        </div>
      </div>`, 'start');
    app.dataset.screen = 'start';
    $('#startBtn').addEventListener('click', () => {
      const inp = $('#nameIn');
      if (inp && inp.value.trim()) { D.name = inp.value.trim().slice(0, 14); save(); }
      try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ }
      say(`Halo, ${name()}! Aku Kancil. Senang sekali kamu datang.`);
      mapScreen();
    });
  };

  /* ---------- Peta bab ---------- */
  const mapScreen = () => {
    const chapters = C.CHAPTERS.map(ch => {
      const open = ch.id <= D.unlocked, stars = D.stars[ch.id] || 0;
      const cust = A.CUSTOMERS[ch.customers[0]];
      return `
        <button class="chapter ${open ? '' : 'locked'}" data-id="${ch.id}" ${open ? '' : 'disabled'}>
          <div class="ch-art">${cust.svg}</div>
          <div class="ch-body">
            <div class="ch-num">Bab ${ch.id}</div>
            <div class="ch-title">${ch.title}</div>
            <div class="ch-topic">${ch.topic}</div>
            <div class="stars">${[1, 2, 3].map(i => A.STAR(i <= stars)).join('')}</div>
          </div>
          ${open ? '' : `<div class="ch-lock">${A.LOCK}</div>`}
        </button>`;
    }).join('');
    const plants = D.plants.slice(-24).map(p => p === 't' ? A.TREE : p === 'f' ? A.FLOWER : A.SPROUT).join('');
    render(`
      ${bar({ title: `Halo, ${name()}!` })}
      <main class="map">
        <section class="garden-card">
          <div class="garden-head"><b>Kebunmu</b><span>${D.plants.length} tanaman · ${D.days} hari bermain</span></div>
          <div class="garden">${plants || '<span class="empty">Selesaikan misi, kebunmu akan tumbuh.</span>'}</div>
        </section>
        <section class="chapters">${chapters}</section>
        <section class="row map-foot">
          <button class="btn ghost" id="installBtn" hidden>Pasang di HP</button>
          <button class="btn ghost" id="parentBtn">Untuk orang tua</button>
        </section>
      </main>`, 'map');
    app.dataset.screen = 'map';
    wireBar();
    document.querySelectorAll('.chapter:not(.locked)').forEach(b => b.addEventListener('click', () => beginChapter(Number(b.dataset.id))));
    $('#parentBtn').addEventListener('click', parentGate);
    setupInstall();
  };

  /* ---------- Cerita pembuka ---------- */
  const beginChapter = (id) => {
    if (D.sessionsToday >= 2) return restGate(id);
    const ch = C.CHAPTERS.find(c => c.id === id);
    resetSession(ch);
    storyScreen(ch.intro, 0, () => { nextRound(); });
  };

  const storyScreen = (lines, i, done) => {
    const l = lines[i];
    const isK = l.who === 'kancil';
    const art = isK ? A.KANCIL('story-k', 'happy') : `<div class="story-c">${A.CUSTOMERS[l.who].svg}</div>`;
    const who = isK ? 'Kancil' : A.CUSTOMERS[l.who].name;
    render(`
      ${bar({ title: `Bab ${S.chapter.id}: ${S.chapter.title}` })}
      <main class="story">
        ${A.SCENE_BG}
        <div class="story-stage">
          <div class="story-art ${isK ? 'right' : 'left'}">${art}</div>
          <div class="bubble story-bubble ${isK ? 'from-right' : 'from-left'}">
            <div class="who">${who}</div>
            <div class="msg">${fill(l.text)}</div>
          </div>
        </div>
        <div class="row story-foot">
          <button class="icon-btn" id="repeatBtn" aria-label="Dengar lagi">${A.SPEAKER}</button>
          <button class="btn primary" id="nextBtn">${i < lines.length - 1 ? 'Lanjut' : 'Ayo mulai!'}</button>
        </div>
      </main>`, 'story');
    app.dataset.screen = 'story';
    wireBar();
    say(fill(l.text), { pitch: isK ? 1.18 : 1.05 });
    $('#repeatBtn').addEventListener('click', () => say(lastLines, { keep: true }));
    $('#nextBtn').addEventListener('click', () => { sfx.pop(); if (i < lines.length - 1) storyScreen(lines, i + 1, done); else done(); });
  };

  /* ---------- Misi ---------- */
  const makeMission = () => {
    const ch = S.chapter, lv = ch.levels[Math.min(S.level, ch.levels.length - 1)];
    S.mode = ch.modes[S.round % ch.modes.length];
    S.tries = 0; S.step = 0; S.busy = false; S.showDigits = false; S.tieHinted = false; S.tens = 0; S.ones = 0;
    S.customer = ch.customers[S.round % ch.customers.length];
    if (S.mode === 'tambah') {
      S.a = rand(2, Math.max(2, lv.sumMax - 2)); S.b = rand(1, Math.max(1, lv.sumMax - S.a)); S.target = S.a + S.b;
    } else if (S.mode === 'kurang') {
      S.a = rand(4, lv.max); S.b = rand(1, Math.min(S.a - 1, 9)); S.target = S.a - S.b;
    } else {
      S.target = rand(lv.min, lv.max);
      if (S.mode === 'hitung' && S.target > 10 && S.target % 10 === 0 && lv.min !== lv.max) S.target += 1;
    }
    if (S.mode === 'hitung' || S.mode === 'tambah' || S.mode === 'kurang') S.options = makeOptions(S.target);
  };
  const makeOptions = (n) => {
    const t = Math.floor(n / 10), o = n % 10;
    const pool = shuffle([n + 1, n - 1, n + 10, n - 10, o * 10 + t, n + 2, n - 2]).filter(x => x >= 0 && x <= 99 && x !== n);
    const opts = [n];
    for (const x of pool) if (opts.length < 3 && !opts.includes(x)) opts.push(x);
    return shuffle(opts);
  };

  const nextRound = async () => {
    if (S.round >= MISSIONS) return endScreen();
    makeMission();
    renderPlay();
    const cust = A.CUSTOMERS[S.customer], L = C.LINES[S.customer];
    const hi = fill(pick(L.hi));
    /* pembeli datang */
    await speakAs('customer', hi, '');
    if (S.mode === 'ambil') {
      await speakAs('customer', fill(pick(L.order)), S.target);
      const tip = S.chapter.id === 2 && S.target === 10 ? 'Sepuluh batang itu banyak. Kumpulkan, lalu tekan Ikat!'
        : S.chapter.id >= 5 ? `${S.target} itu ${ikat(Math.floor(S.target / 10))} dan ${words(S.target % 10)} batang. Ambil ikatnya dulu, ya.`
          : `Ayo ambil ${words(S.target)} batang, lalu kirim ke ${cust.name}.`;
      speakAs('kancil', tip, S.target, true);
    } else if (S.mode === 'hitung') {
      S.tens = Math.floor(S.target / 10); S.ones = S.target % 10; renderCart();
      await speakAs('customer', `Aku sudah ambil sendiri. Tapi aku lupa, ini berapa batang ya?`, '?');
      speakAs('kancil', S.target > 10 ? 'Hitung ikatnya dulu: sepuluh, dua puluh. Lalu batangnya. Pilih angkanya!' : 'Yuk hitung satu-satu, lalu pilih angkanya.', '?', true);
    } else if (S.mode === 'tambah') {
      S.ones = Math.min(S.a, 19); renderCart();
      await speakAs('customer', `Aku mau ${words(S.a)} batang.`, S.a);
      await speakAs('kancil', `Sudah ada ${words(S.a)} di gerobak.`, S.a, true);
      await speakAs('customer', `Eh, tambah ${words(S.b)} lagi, dong!`, `${S.a} + ${S.b}`);
      speakAs('kancil', `Ambil ${words(S.b)} batang lagi. Kita hitung lanjut dari ${words(S.a)}.`, `${S.a} + ${S.b}`, true);
    } else if (S.mode === 'kurang') {
      S.ones = S.a; renderCart();
      await speakAs('customer', `Aku ambil ${words(S.a)} batang.`, S.a);
      await speakAs('customer', `Aduh, kebanyakan. Aku kembalikan ${words(S.b)}, ya.`, `${S.a} − ${S.b}`);
      speakAs('kancil', `Ketuk ${words(S.b)} batang di gerobak untuk mengembalikannya.`, `${S.a} − ${S.b}`, true);
    }
  };

  /* Menampilkan siapa yang bicara dan membacakannya. */
  const speakAs = (who, text, big, kancilPitch) => {
    const pane = $('#dialog');
    if (!pane) return Promise.resolve();
    pane.dataset.who = who;
    $('#who').textContent = who === 'kancil' ? 'Kancil' : A.CUSTOMERS[S.customer].name;
    $('#msg').textContent = text;
    $('#big').textContent = big;
    $('#big').style.display = big === '' ? 'none' : '';
    $('#big').classList.toggle('long', String(big).length > 3);
    const k = $('.play .kancil'); const c = $('.customer');
    k?.classList.toggle('talking', who === 'kancil'); c?.classList.toggle('talking', who === 'customer');
    return say(text, { pitch: who === 'kancil' ? 1.18 : 1.02 });
  };
  const kancilMood = (m) => { const k = $('.play .kancil'); if (!k) return; k.classList.remove('mood-happy', 'mood-think', 'mood-cheer', 'cheer'); k.classList.add('mood-' + m); if (m === 'cheer') { void k.getBoundingClientRect(); k.classList.add('cheer'); } };

  const renderPlay = () => {
    const ch = S.chapter, cust = A.CUSTOMERS[S.customer];
    const build = S.mode === 'ambil' || S.mode === 'tambah';
    const isSub = S.mode === 'kurang';
    render(`
      ${bar({ progress: true })}
      <main class="play">
        <section class="scene">
          ${A.SCENE_BG_STALL}
          <div class="customer" aria-hidden="true">${cust.svg}</div>
          ${A.KANCIL('', 'happy')}
          <div class="dialog" id="dialog" data-who="customer" aria-live="polite">
            <div class="who" id="who"></div>
            <div class="dialog-row">
              <div class="big" id="big"></div>
              <div class="msg" id="msg"></div>
              <button class="icon-btn" id="repeatBtn" aria-label="Dengar lagi">${A.SPEAKER}</button>
            </div>
          </div>
        </section>
        <section class="cart-wrap">
          <div class="cart" id="cart">
            <div class="col ${[1, 3, 4].includes(ch.id) ? 'hide' : ''}">
              <div class="col-head"><span class="col-label"><b>Ikat</b> puluhan</span><span class="digit" id="dTens"></span></div>
              <div class="items" id="tens"></div>
            </div>
            <div class="col">
              <div class="col-head"><span class="col-label"><b>Batang</b> satuan</span><span class="digit" id="dOnes"></span></div>
              <div class="items" id="ones"></div>
            </div>
          </div>
        </section>
        <section class="controls" id="controls">
          ${build ? `
          <div class="piles">
            <button class="pile" id="takeOne">${A.PILE_ONE}<span>Ambil 1 batang</span></button>
            <button class="pile" id="takeTen" ${ch.id >= 5 ? '' : 'hidden'}>${A.BUNDLE}<span>Ambil 1 ikat</span></button>
          </div>
          <div class="actions">
            <button class="btn secondary" id="tieBtn" ${ch.id >= 2 && ch.id !== 3 ? '' : 'hidden'}>Ikat 10 batang</button>
            <button class="btn primary" id="sendBtn">Kirim ke ${cust.name.split(' ')[0]}</button>
          </div>` : isSub ? `
          <div class="actions one"><button class="btn primary" id="sendBtn" disabled>Kembalikan ${S.b} batang</button></div>` : `
          <div class="choices">${S.options.map(o => `<button class="choice" data-v="${o}">${o}</button>`).join('')}</div>`}
        </section>
      </main>`, 'play');
    app.dataset.screen = 'play';
    wireBar();
    renderCart();
    $('#repeatBtn').addEventListener('click', () => say(lastLines, { keep: true }));
    if (build) {
      $('#takeOne').addEventListener('click', takeOne);
      $('#takeTen').addEventListener('click', takeTen);
      $('#tieBtn').addEventListener('click', tie);
      $('#sendBtn').addEventListener('click', send);
    }
    if (isSub) $('#sendBtn').addEventListener('click', sendSub);
    $('#cart').addEventListener('click', (e) => {
      const it = e.target.closest('.item');
      if (!it || S.busy) return;
      if (S.mode === 'hitung' || S.step === 1) return;
      if (S.mode === 'tambah' && S.ones <= S.a) return;
      if (S.mode === 'kurang') {
        if (S.ones <= S.a - S.b) { say(`Sudah ${words(S.b)} yang dikembalikan. Sekarang tekan tombolnya.`, { keep: true }); return; }
        S.ones--; sfx.back(); renderCart();
        say(`Kembalikan ${words(S.a - S.ones)}`, { keep: true });
        if (S.ones === S.a - S.b) { $('#sendBtn').disabled = false; $('#sendBtn').classList.add('glow'); }
        return;
      }
      if (it.dataset.kind === 'ten' && S.tens > 0) S.tens--;
      if (it.dataset.kind === 'one' && S.ones > 0) S.ones--;
      sfx.back(); renderCart();
    });
    stage.choices();
  };
  const stage = { choices: () => document.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => choose(Number(b.dataset.v), b))) };

  const renderCart = (popKind) => {
    const tensEl = $('#tens'), onesEl = $('#ones');
    if (!tensEl) return;
    const tappable = S.mode === 'ambil' || S.mode === 'kurang' || (S.mode === 'tambah');
    let t = '', o = '';
    for (let i = 0; i < S.tens; i++) {
      const pop = popKind === 'ten' && i === S.tens - 1 ? ' pop' : '';
      t += `<button class="item ten${pop}" data-kind="ten" aria-label="1 ikat">${A.BUNDLE}</button>`;
    }
    for (let i = 0; i < S.ones; i++) {
      const pop = popKind === 'one' && i === S.ones - 1 ? ' pop' : '';
      const base = S.mode === 'tambah' && i < S.a ? ' base' : '';
      o += `<button class="item one${pop}${base}" data-kind="one" aria-label="1 batang">${A.STICK}</button>`;
    }
    tensEl.innerHTML = t || '<span class="empty">kosong</span>';
    onesEl.innerHTML = o || '<span class="empty">kosong</span>';
    tensEl.classList.toggle('locked', !tappable); onesEl.classList.toggle('locked', !tappable);
    $('#dTens').textContent = S.tens; $('#dOnes').textContent = S.ones;
    $('#dTens').classList.toggle('show', S.showDigits); $('#dOnes').classList.toggle('show', S.showDigits);
    const tieBtn = $('#tieBtn');
    if (tieBtn && !tieBtn.hidden) {
      const can = S.ones >= 10;
      tieBtn.disabled = !can; tieBtn.classList.toggle('glow', can);
      if (can && !S.tieHinted && !S.busy) { S.tieHinted = true; speakAs('kancil', 'Sudah sepuluh batang! Tekan Ikat supaya rapi.', $('#big').textContent, true); }
    }
  };

  const takeOne = () => {
    if (S.busy) return;
    if (S.ones >= 19) { kancilMood('think'); speakAs('kancil', 'Gerobak penuh! Ikat dulu sepuluh batang jadi satu ikat.', $('#big').textContent, true); return; }
    S.ones++; sfx.take(); renderCart('one');
    const n = S.mode === 'tambah' ? S.ones : S.ones; say(words(n), { keep: true, rate: 1 });
  };
  const takeTen = () => {
    if (S.busy) return;
    if (S.tens >= 9) { kancilMood('think'); speakAs('kancil', 'Ikatannya sudah sembilan. Itu sudah sembilan puluh batang!', $('#big').textContent, true); return; }
    S.tens++; sfx.ten(); renderCart('ten'); say(ikat(S.tens), { keep: true, rate: 1 });
  };
  const tie = () => {
    if (S.busy || S.ones < 10) return;
    S.ones -= 10; S.tens++; sfx.tie(); renderCart('ten'); kancilMood('cheer');
    speakAs('kancil', 'Sepuluh batang jadi satu ikat. Satu ikat sama dengan sepuluh!', $('#big').textContent, true);
  };

  /* Menghitung bersama: setiap benda disorot sambil disebut. */
  const countAlong = (done, from = 0) => {
    S.busy = true;
    const items = [...document.querySelectorAll('#tens .item'), ...document.querySelectorAll('#ones .item')];
    let total = from, i = 0;
    const todo = items.slice(from);
    kancilMood('think');
    speakAs('kancil', 'Ayo kita hitung bersama.', from || 0, true);
    const step = () => {
      items.forEach(x => x.classList.remove('counted'));
      if (i >= todo.length) { S.busy = false; done(total); return; }
      const it = todo[i++]; it.classList.add('counted');
      total += it.dataset.kind === 'ten' ? 10 : 1;
      $('#big').textContent = total; sfx.tick(); say(words(total), { keep: true, rate: 1 });
      setTimeout(step, it.dataset.kind === 'ten' ? 820 : 640);
    };
    if (!todo.length) { S.busy = false; done(total); return; }
    setTimeout(step, 900);
  };

  const send = () => {
    if (S.busy) return;
    const value = S.tens * 10 + S.ones;
    if (S.mode === 'tambah') {
      if (value === S.target) return askTotal();
      S.tries++; sfx.no(); kancilMood('think');
      const added = S.ones - S.a;
      const msg = added < S.b ? `Baru tambah ${words(added)}. Kita perlu tambah ${words(S.b)}. Ambil lagi, ya.` : `Kebanyakan. Tambahnya cukup ${words(S.b)}. Kembalikan sedikit.`;
      speakAs('kancil', msg, `${S.a} + ${S.b}`, true);
      return;
    }
    if (value === 0) { kancilMood('think'); speakAs('kancil', 'Gerobaknya masih kosong. Ambil tebunya dulu, ya.', S.target, true); return; }
    if (value === S.target) return success();
    wrongBuild(value);
  };
  const wrongBuild = (value) => {
    S.tries++; sfx.no(); kancilMood('think');
    if (S.tries === 1) {
      countAlong((total) => {
        const more = S.target > total;
        const line = more ? `Masih kurang ${words(S.target - total)}. Tambah lagi, ya!` : `Kelebihan ${words(total - S.target)}. Ketuk tebu untuk mengembalikannya.`;
        speakAs('kancil', `Gerobakmu berisi ${words(total)}. Pembeli minta ${words(S.target)}. ${line}`, S.target, true);
      });
    } else {
      const t = Math.floor(S.target / 10), o = S.target % 10;
      S.showDigits = true; renderCart();
      const txt = t === 0 ? `${words(S.target)} itu ${words(o)} batang saja. Coba lagi, pelan-pelan.`
        : o === 0 ? `${words(S.target)} itu pas ${ikat(t)}. Coba lagi!`
          : `${words(S.target)} itu ${ikat(t)} dan ${words(o)} batang. Lihat angkanya di gerobak.`;
      speakAs('kancil', pick(C.ENCOURAGE) + ' ' + txt, S.target, true);
    }
  };

  /* Langkah kedua penjumlahan / pengurangan: pilih jumlahnya */
  const askTotal = () => {
    S.step = 1; S.busy = false;
    $('#controls').innerHTML = `<div class="choices">${S.options.map(o => `<button class="choice" data-v="${o}">${o}</button>`).join('')}</div>`;
    stage.choices();
    renderCart();
    kancilMood('happy');
    speakAs('kancil', S.mode === 'tambah' ? `Bagus! Sekarang semuanya ada berapa? ${words(S.a)} tambah ${words(S.b)}. Pilih angkanya.` : `Bagus! Sekarang sisanya berapa? Pilih angkanya.`, S.mode === 'tambah' ? `${S.a} + ${S.b} = ?` : `${S.a} − ${S.b} = ?`, true);
  };
  const sendSub = () => { if (S.busy) return; if (S.ones === S.a - S.b) askTotal(); };

  const choose = (v, btn) => {
    if (S.busy) return;
    if (v === S.target) return success();
    S.tries++; sfx.no(); btn.disabled = true; kancilMood('think');
    const big = $('#big').textContent;
    if (S.tries === 1) {
      if (S.mode === 'tambah') {
        countAlong(() => speakAs('kancil', `Jadi semuanya ${words(S.target)}. Sekarang pilih angkanya.`, big, true), 0);
      } else {
        countAlong(() => speakAs('kancil', S.mode === 'kurang' ? `Sisanya ${words(S.target)}. Pilih angkanya!` : 'Nah, itu jumlahnya. Pilih angka yang tadi kita sebut.', big, true));
      }
    } else {
      document.querySelectorAll('.choice').forEach(b => { if (Number(b.dataset.v) === S.target) b.classList.add('hint'); });
      S.showDigits = true; renderCart();
      speakAs('kancil', `Jawabannya ${words(S.target)}. Tekan angka ${words(S.target)} yang bersinar.`, big, true);
    }
  };

  const adapt = (firstTry) => {
    if (firstTry) { S.streak++; if (S.streak >= 2 && S.level < S.chapter.levels.length - 1) { S.level++; S.streak = 0; } }
    else { S.streak = 0; if (S.tries >= 2 && S.level > 0) S.level--; }
  };

  const success = async () => {
    S.busy = true;
    const firstTry = S.tries === 0;
    S.results.push({ n: S.target, mode: S.mode, tries: S.tries, firstTry });
    sfx.yes(); kancilMood('cheer'); confetti();
    const L = C.LINES[S.customer];
    const t = S.tens, o = S.ones;
    if (S.mode === 'ambil' && S.chapter.id === 2 && S.target === 10 && S.tens === 0) {
      await speakAs('kancil', 'Hebat, sepuluh batang! Lihat, aku ikat jadi satu.', 10, true);
      S.ones = 0; S.tens = 1; sfx.tie(); renderCart('ten');
      await speakAs('kancil', 'Satu ikat sama dengan sepuluh batang!', 10, true);
    } else if (S.mode === 'ambil' && S.ones >= 10) {
      S.ones -= 10; S.tens++; sfx.tie(); renderCart('ten');
      await speakAs('kancil', 'Sepuluh batang bisa diikat jadi satu ikat!', S.target, true);
    } else {
      const detail = S.mode === 'tambah' ? `${words(S.a)} tambah ${words(S.b)} sama dengan ${words(S.target)}.`
        : S.mode === 'kurang' ? `${words(S.a)} dikurangi ${words(S.b)} sisa ${words(S.target)}.`
          : t > 0 ? `${ikat(t)} dan ${words(o)} batang, jadi ${words(S.target)}.` : `${words(S.target)} batang, pas!`;
      await speakAs('kancil', `${pick(C.PRAISE)} ${detail}`, S.target, true);
    }
    $('#progress').innerHTML = progressHtml();
    if (!D.met.includes(S.customer)) { D.met.push(S.customer); save(); }
    await speakAs('customer', fill(pick(L.thanks)), '');
    $('#cart')?.classList.add('sent');
    adapt(firstTry);
    await wait(700);
    S.round++;
    nextRound();
  };

  const confetti = () => {
    const box = document.createElement('div'); box.className = 'confetti';
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('i');
      p.style.left = rand(5, 95) + '%'; p.style.animationDelay = (Math.random() * .4) + 's';
      p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']);
      box.appendChild(p);
    }
    app.appendChild(box); setTimeout(() => box.remove(), 1800);
  };

  /* ---------- Akhir sesi ---------- */
  const endScreen = () => {
    const first = S.results.filter(r => r.firstTry).length;
    const stars = first >= 5 ? 3 : first >= 3 ? 2 : 1;
    const earned = S.results.map(r => r.firstTry ? 'f' : 's');
    if (first === MISSIONS) earned[earned.length - 1] = 't';
    D.plants.push(...earned);
    D.stars[S.chapter.id] = Math.max(D.stars[S.chapter.id] || 0, stars);
    if (first >= 4 && S.chapter.id === D.unlocked && D.unlocked < C.CHAPTERS.length) D.unlocked++;
    if (D.lastDay !== today()) { D.days++; D.lastDay = today(); D.sessionsToday = 0; }
    D.sessionsToday++;
    save();
    const unlockedNow = first >= 4 && D.unlocked === S.chapter.id + 1 && !(D.stars[S.chapter.id + 1]);
    const refl = C.REFLECT.find(r => r.chapter === S.chapter.id) || C.REFLECT[3];
    const hard = S.results.filter(r => !r.firstTry);
    const mins = Math.max(1, Math.round((Date.now() - S.startedAt) / 60000));
    render(`
      ${bar({ title: `Bab ${S.chapter.id} selesai` })}
      <main class="end center">
        ${A.KANCIL('end-k', 'cheer')}
        <h2>${first === MISSIONS ? 'Sempurna!' : first >= 4 ? 'Hebat sekali!' : 'Kerja bagus!'}</h2>
        <div class="stars big-stars">${[1, 2, 3].map(i => A.STAR(i <= stars)).join('')}</div>
        <p class="lead">${S.chapter.outro}</p>
        <div class="garden-card"><div class="garden">${earned.map(p => p === 't' ? A.TREE : p === 'f' ? A.FLOWER : A.SPROUT).join('')}</div><div class="note">${earned.length} tanaman baru untuk kebunmu</div></div>
        ${unlockedNow ? `<div class="unlock">Bab ${S.chapter.id + 1} terbuka: <b>${C.CHAPTERS[S.chapter.id].title}</b></div>` : ''}
        <div class="reflect">
          <p class="lead" id="rq">Pertanyaan Kancil: ${refl.q}</p>
          <div class="choices">${refl.opts.map(v => `<button class="choice ${typeof v === 'string' ? 'text' : ''}" data-v="${v}">${v}</button>`).join('')}</div>
        </div>
        <details class="parent">
          <summary>Ringkasan untuk orang tua</summary>
          <dl>
            <dt>Benar di percobaan pertama</dt><dd>${first} dari ${MISSIONS} misi, sekitar ${mins} menit</dd>
            <dt>Materi</dt><dd>${S.chapter.cp} (Matematika Fase A)</dd>
            <dt>Perlu latihan lagi</dt><dd>${hard.length ? hard.map(r => r.mode === 'tambah' ? `${r.n} (penjumlahan)` : r.mode === 'kurang' ? `${r.n} (pengurangan)` : r.n).join(', ') : 'Tidak ada, semua lancar'}</dd>
          </dl>
        </details>
        <div class="row"><button class="btn primary" id="mapBtn">Kembali ke peta</button></div>
      </main>`, 'end');
    app.dataset.screen = 'end';
    wireBar(); sfx.fanfare();
    say([`${first === MISSIONS ? 'Sempurna' : 'Hebat'}, ${name()}! ${S.chapter.outro}`, unlockedNow ? `Bab ${S.chapter.id + 1} sudah terbuka!` : '', `Satu pertanyaan lagi. ${refl.q}`]);
    document.querySelectorAll('.reflect .choice').forEach(b => b.addEventListener('click', () => {
      const v = isNaN(Number(b.dataset.v)) ? b.dataset.v : Number(b.dataset.v);
      if (v === refl.ans) {
        sfx.yes(); b.classList.add('hint');
        document.querySelectorAll('.reflect .choice').forEach(x => x.disabled = x !== b);
        $('#rq').textContent = 'Betul! Kamu ingat. Sampai jumpa lagi!';
        say('Betul! Kamu ingat. Sampai jumpa lagi!');
      } else {
        sfx.no(); b.disabled = true;
        $('#rq').textContent = 'Hmm, coba ingat lagi waktu kamu membantu Kancil tadi.';
        say('Hmm, coba ingat lagi waktu kamu membantu Kancil tadi.');
      }
    }));
    $('#mapBtn').addEventListener('click', mapScreen);
  };

  /* ---------- Gerbang orang tua & istirahat ---------- */
  const gate = (title, onPass) => {
    const a = rand(3, 9), b = rand(4, 9);
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="sheet"><h3>${title}</h3><p>Untuk orang tua: berapa ${a} × ${b}?</p><input id="gateIn" inputmode="numeric" class="gate-in" autocomplete="off"><div class="row"><button class="btn secondary" id="gateNo">Batal</button><button class="btn primary" id="gateOk">Lanjut</button></div></div>`;
    app.appendChild(ov);
    $('#gateIn', ov).focus();
    $('#gateNo', ov).addEventListener('click', () => ov.remove());
    $('#gateOk', ov).addEventListener('click', () => { if (Number($('#gateIn', ov).value) === a * b) { ov.remove(); onPass(); } else { $('#gateIn', ov).value = ''; $('#gateIn', ov).placeholder = 'coba lagi'; } });
  };
  const restGate = (chapterId) => {
    const ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = `<div class="sheet center">${A.KANCIL('rest-k', 'happy')}<h3>Kancil istirahat dulu</h3><p>Hari ini sudah dua sesi. Sampai jumpa besok, ya!</p><div class="row"><button class="btn secondary" id="ok">Oke</button><button class="btn ghost" id="more">Orang tua: izinkan satu sesi lagi</button></div></div>`;
    app.appendChild(ov);
    say('Hari ini sudah dua sesi. Kancil istirahat dulu. Sampai jumpa besok, ya!');
    $('#ok', ov).addEventListener('click', () => ov.remove());
    $('#more', ov).addEventListener('click', () => { ov.remove(); gate('Izinkan satu sesi lagi', () => { D.sessionsToday = 1; save(); beginChapter(chapterId); }); });
  };
  const parentGate = () => gate('Untuk orang tua', parentScreen);
  const parentScreen = () => {
    const rows = C.CHAPTERS.map(ch => `<tr><td>Bab ${ch.id}</td><td>${ch.topic}</td><td>${ch.id <= D.unlocked ? [1, 2, 3].map(i => A.STAR(i <= (D.stars[ch.id] || 0))).join('') : 'terkunci'}</td></tr>`).join('');
    render(`
      ${bar({ title: 'Untuk orang tua' })}
      <main class="parent-page">
        <section class="card">
          <h3>Kemajuan ${name()}</h3>
          <table class="tbl"><thead><tr><th>Bab</th><th>Materi (Matematika Fase A)</th><th>Bintang</th></tr></thead><tbody>${rows}</tbody></table>
          <p class="note">${D.plants.length} tanaman di kebun, ${D.days} hari bermain, ${D.met.length} dari 6 pembeli sudah dikenal.</p>
        </section>
        <section class="card">
          <h3>Cara memakai</h3>
          <ul class="plain">
            <li>Satu sesi berisi 6 misi, sekitar 10 menit. Batas bawaan 2 sesi per hari; sesi tambahan lewat gerbang orang tua.</li>
            <li>Bab berikutnya terbuka bila 4 dari 6 misi benar di percobaan pertama.</li>
            <li>Urutan bab mengikuti buku Matematika kelas 1 Kurikulum Merdeka: bilangan sampai 10, sampai 20, penjumlahan, pengurangan, lalu puluhan dan satuan.</li>
            <li>Bila salah, Kancil mengajak menghitung ulang bersama, lalu menunjukkan jawabannya. Tidak ada tanda silang.</li>
            <li>Dampingi saat bermain dan ajak mengulang hitungannya dengan benda nyata di rumah (sendok, kelereng, lidi).</li>
          </ul>
        </section>
        <section class="card">
          <h3>Pengaturan</h3>
          <label class="field"><span>Nama panggilan anak</span><input id="nameEdit" maxlength="14" value="${D.name}"></label>
          <div class="row left"><button class="btn secondary" id="saveName">Simpan nama</button><button class="btn ghost" id="unlockAll">Buka semua bab</button><button class="btn ghost danger" id="resetAll">Mulai dari awal</button></div>
        </section>
      </main>`, 'parent');
    app.dataset.screen = 'parent';
    wireBar();
    $('#saveName').addEventListener('click', () => { D.name = $('#nameEdit').value.trim().slice(0, 14); save(); mapScreen(); });
    $('#unlockAll').addEventListener('click', () => { D.unlocked = C.CHAPTERS.length; save(); mapScreen(); });
    $('#resetAll').addEventListener('click', () => { if (confirmReset()) { D = defaults(); save(); startScreen(); } });
  };
  const confirmReset = () => { const v = prompt('Ketik HAPUS untuk menghapus semua kemajuan'); return v === 'HAPUS'; };

  /* ---------- Pasang di HP ---------- */
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; const b = $('#installBtn'); if (b) b.hidden = false; });
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const setupInstall = () => {
    const b = $('#installBtn'); if (!b || isStandalone()) return;
    if (installEvt || isIOS()) b.hidden = false;
    b.addEventListener('click', async () => {
      if (installEvt) { installEvt.prompt(); try { await installEvt.userChoice; } catch (e) { /* abaikan */ } installEvt = null; b.hidden = true; return; }
      const ov = document.createElement('div'); ov.className = 'overlay';
      ov.innerHTML = `<div class="sheet"><h3>Pasang di iPhone / iPad</h3><ol class="steps"><li>Buka halaman ini di <b>Safari</b>.</li><li>Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas).</li><li>Pilih <b>Tambahkan ke Layar Utama</b>, lalu <b>Tambah</b>.</li></ol><p class="note">Di Android: buka di Chrome, ketuk menu ⋮, lalu <b>Pasang aplikasi</b> atau <b>Tambahkan ke layar utama</b>.</p><div class="row"><button class="btn primary" id="closeI">Oke</button></div></div>`;
      app.appendChild(ov); $('#closeI', ov).addEventListener('click', () => ov.remove());
    });
  };
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* tidak didukung di sini */ }); });
  }

  startScreen();
})();
