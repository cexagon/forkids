/* Kota Kancil, Bab 10: Dapur Nenek Gabe. Kenduri kampung: kue di loyang (larik), dibagi rata ke piring tamu. */
import * as THREE from 'three';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const SPEED = QS.has('fast') ? 0.08 : 1;
const wait = (ms) => new Promise(r => setTimeout(r, ms * SPEED));
const BAB = 10, STAGES = 3;
const KK = window.KK;

const W_ID = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas', 'dua puluh'];
const W_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const num = (n) => W_ID[n] || String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Simpanan (hanya suara) ---------- */
const KEY = 'kota-kancil-3d-v1';
let D = { sound: true };
try { D = Object.assign(D, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* abaikan */ }
const save = () => { try { const o = JSON.parse(localStorage.getItem(KEY) || '{}'); o.sound = D.sound; localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* abaikan */ } };

/* ---------- Suara ---------- */
const voices = { id: null, en: null };
const pickVoices = () => { try { const vs = speechSynthesis.getVoices(); voices.id = vs.find(v => /id[-_]ID/i.test(v.lang) && /google/i.test(v.name)) || vs.find(v => /^id/i.test(v.lang)) || null; voices.en = vs.find(v => /en[-_](GB|US)/i.test(v.lang) && /google|samantha|daniel|karen/i.test(v.name)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch (e) { /* abaikan */ } };
if ('speechSynthesis' in window) { pickVoices(); speechSynthesis.onvoiceschanged = pickVoices; }
let seq = 0;
const say = (text, lang = 'id') => {
  if (!D.sound || !('speechSynthesis' in window)) return wait(Math.min(2600, 700 + text.length * 45));
  const my = ++seq;
  return new Promise(resolve => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = lang === 'en' ? 'en-US' : 'id-ID'; if (voices[lang]) u.voice = voices[lang];
      u.rate = lang === 'en' ? 0.85 : 0.93; u.pitch = lang === 'en' ? 1.25 : 1.15;
      u.onend = () => resolve(); u.onerror = () => resolve(); speechSynthesis.speak(u);
      setTimeout(() => { if (my === seq) resolve(); }, 1500 + text.length * 100);
    } catch (e) { resolve(); }
  });
};
const sounds = {};
for (const n of ['placement-a', 'placement-b', 'placement-c', 'toggle', 'rotate']) { const a = new Audio(`../pasar3d/sounds/${n}.ogg`); a.preload = 'auto'; sounds[n] = a; }
const play = (n, rate = 1) => { if (!D.sound) return; try { const a = sounds[n].cloneNode(); a.playbackRate = rate; a.volume = 0.7; a.play().catch(() => { }); } catch (e) { /* abaikan */ } };
let actx = null;
const chime = (freqs) => { if (!D.sound) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); freqs.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.1; o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.26); }); } catch (e) { /* abaikan */ } };

/* ---------- Renderer & adegan ---------- */
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: QS.has('shot') });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(26, 1, 1, 400);
scene.add(new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3));
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-6, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 9, bottom: -9, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.01, dur * SPEED), fn, ease, res }));
const hop = (a, h = 0.3) => { const b = a.userData.body; const y0 = b.userData.hy0 ?? (b.userData.hy0 = b.position.y); return tween(0.45, (t) => { b.position.y = y0 + Math.sin(t * Math.PI) * h; }, (t) => t); };

/* ---------- Tokoh ---------- */
const TOP = 0.8; /* tinggi meja */
const GUESTS = [
  { key: 'ramlan', name: 'Kakek Ramlan', make: () => B.warga({ kind: 'kakek', dress: 0x4f8a5b }), en: 'grandpa' },
  { key: 'dia', name: 'Bu Guru Dia', make: () => B.warga({ dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }) },
  { key: 'murni', name: 'Bu Murni', make: () => B.warga({ dress: 0xe8742a, head: 0x2c8daa }) },
  { key: 'kura', name: 'Kura-kura', make: () => B.kura(), animal: true },
  { key: 'monyet', name: 'Monyet', make: () => B.monyet(), animal: true },
];
const actors = {}; const names = { kancil: 'Kancil', jali: 'Jali', nenek: 'Nenek Gabe' };
let jaliPost = null, table = null, tray = null, bigCake = null;
const plates = []; /* {g, cakes:[], tag} */
let layout = { portrait: false, spacing: 1.7 };

const buildWorld = () => {
  world.add(B.island()); world.add(B.sea());
  const wall = B.kitchenWall(); wall.position.set(0, 0, -4.3); world.add(wall);
  for (const [x, z, s] of [[-6.6, -3.2, 1.1], [6.7, -3.0, 1.2]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  table = B.table(1, 1); world.add(table);
  for (let i = 0; i < 5; i++) {
    const g = GUESTS[i]; const o = g.make(); if (o.userData.basket) o.userData.basket.visible = false;
    const wrap = new THREE.Group(); wrap.add(o); if (g.animal) { const st = B.stool(0.62); wrap.add(st); o.position.y = 0.66; }
    wrap.userData = { body: o, head: o.userData.head, guest: g }; wrap.visible = false; world.add(wrap); actors[g.key] = wrap; names[g.key] = g.name;
    tap(wrap, () => onGuest(g));
  }
  for (let i = 0; i < 5; i++) { const p = B.plate(0.4); p.visible = false; world.add(p); plates.push({ g: p, cakes: [], tag: mkTag('plate') }); }
  tray = new THREE.Group(); world.add(tray); tray.userData.cakes = [];
  bigCake = B.roundCake(); bigCake.visible = false; world.add(bigCake);
  const k = B.kancil(); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const post = new THREE.Group(); post.add(B.cyl(0.07, 0.09, 1.25, B.PAL.woodDark, [0, 0.62, 0], 10)); post.add(B.box(0.75, 0.1, 0.16, B.PAL.wood, [0, 1.25, 0])); world.add(post); jaliPost = post;
  const j = B.jali(); world.add(j); actors.jali = j; tap(j, () => onJali());
  const n = B.warga({ kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }); n.userData.basket.visible = false; world.add(n); actors.nenek = n; tap(n, () => onNenek());
};

/* ---------- Tata letak & kamera ---------- */
const cam = { az: 0, el: 0.6, target: new THREE.Vector3(0, 1, 0), dist: 20 };
let slotN = 4; /* banyak tamu yang tampil */
const slotX = (i, n) => (i - (n - 1) / 2) * Math.min(layout.spacing, (layout.portrait ? 4.4 : 7.2) / Math.max(1, n));
const GZ = -1.85, PZ = -0.85, TZ = 0.72;
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  const portrait = w / h < 0.9; layout.portrait = portrait; layout.spacing = portrait ? 1.12 : 1.7;
  camera.fov = portrait ? 34 : 28; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 2.55 : 6.1, needH = portrait ? 2.9 : 3.0;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = portrait ? 0.82 : 0.6;
  cam.target.set(0, portrait ? 0.2 : 0.7, portrait ? 0.15 : -0.05);
  /* meja */
  const tw = portrait ? 4.8 : 7.6; table.clear(); table.add(B.table(tw, 3.2, TOP)); table.position.set(0, 0, 0);
  const ts = portrait ? 1.28 : 1.3; tray.scale.setScalar(ts); bigCake.scale.setScalar(ts);
  tray.position.set(0, TOP + 0.02, TZ); bigCake.position.set(0, TOP + 0.05, TZ);
  placeSlots(slotN);
  const P = portrait
    ? { kancil: [-1.85, -2.75, 0.5, 0.95], jali: [1.95, -2.9, 0, 0.9], nenek: [0, -3.1, 0, 1.15] }
    : { kancil: [-4.6, 0.7, -0.2, 1.4], jali: [-4.5, -1.3, -0.4, 1.3], nenek: [4.55, 0.1, -0.9, 1.45] };
  const K = actors.kancil; K.position.set(P.kancil[0], 0.03, P.kancil[1]); K.rotation.y = portrait ? -1.4 : 0.15; K.scale.setScalar(P.kancil[3]);
  jaliPost.position.set(P.jali[0], 0.03, P.jali[1]); jaliPost.scale.setScalar(portrait ? 1.2 : 1);
  const J = actors.jali; J.position.set(P.jali[0], 0.03 + 1.3 * (portrait ? 1.2 : 1), P.jali[1]); J.rotation.y = portrait ? -2.0 : -0.9; J.scale.setScalar(P.jali[3]);
  const N = actors.nenek; N.position.set(P.nenek[0], 0.03, P.nenek[1]); N.rotation.y = portrait ? 0 : -0.9; N.scale.setScalar(P.nenek[3]);
  document.body.classList.toggle('portrait', portrait);
};
const placeSlots = (n) => {
  slotN = n;
  for (let i = 0; i < 5; i++) { const p = plates[i]; p.g.position.set(i < n ? slotX(i, n) : 0, TOP + 0.03, PZ); p.g.scale.setScalar(layout.portrait && n <= 4 ? 1.22 : 1); }
  seated.forEach((g, i) => { const a = actors[g.key]; a.position.set(slotX(i, n), 0.03, GZ); a.scale.setScalar(layout.portrait ? (g.animal ? 0.95 : 0.98) : 1.12); });
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Label angka di atas benda ---------- */
const tags = [];
function mkTag(kind) { const el = document.createElement('div'); el.className = 'tag ' + kind; el.hidden = true; document.body.appendChild(el); const t = { el, obj: null, dy: 0.45, dz: 0, n: 0 }; tags.push(t); return t; }
const trayTag = { t: null };
const setTag = (t, obj, n, dy = 0.45) => { t.obj = obj; t.dy = obj && plates.some(p => p.g === obj) ? 0.06 : dy; t.dz = plates.some(p => p.g === obj) ? 0.58 : 0; t.el.textContent = n; t.el.hidden = n == null; };

/* ---------- Gelembung bicara ---------- */
const bubble = $('#bubble');
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = names[who] || who; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};

/* ---------- Kue di loyang & piring ---------- */
const S = 0.3; /* jarak kue di loyang */
let cakeCol = 0;
const newCake = () => B.cake(B.CAKE_COLS[(cakeCol++) % B.CAKE_COLS.length]);
const clearTray = () => { tray.clear(); tray.userData.cakes = []; tray.userData.rows = []; tray.rotation.y = 0; tray.visible = true; };
/* rows: banyak loyang/baris, cols: kue tiap baris; n: jumlah kue (boleh baris terakhir tak penuh) */
const fillTray = async (rows, cols, n = rows * cols, pop = true) => {
  clearTray();
  const bw = cols * S + 0.2, bd = rows * S + 0.2;
  tray.add(B.board(bw, bd));
  for (let r = 0; r < rows; r++) {
    const st = B.strip(cols * S + 0.04, S - 0.03); st.position.set(0, 0.05, (r - (rows - 1) / 2) * S); tray.add(st);
    tray.userData.rows.push({ strip: st, cakes: [] });
  }
  const list = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols; const k = newCake();
    k.position.set((c - (cols - 1) / 2) * S, 0.1, (r - (rows - 1) / 2) * S); k.userData.home = k.position.clone();
    tray.add(k); tray.userData.cakes.push(k); tray.userData.rows[r].cakes.push(k); list.push(k);
    if (pop) k.scale.setScalar(0.001);
  }
  if (pop) { for (let i = 0; i < list.length; i++) { const k = list[i]; tween(0.25, (t) => k.scale.setScalar(Math.max(0.001, t))); if (i % 3 === 2) { play('placement-a', 1.2); await wait(60); } } await wait(300); list.forEach(k => k.scale.setScalar(1)); }
};
const plateSpot = (i) => { const c = i % 3, r = Math.floor(i / 3); return new THREE.Vector3((c - 1) * 0.2, 0.05, r < 2 ? (r - 0.5) * 0.22 : 0.3); };
const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
/* pindahkan kue ke piring p (melengkung) */
const cakeTo = async (k, pi, dur = 0.42) => {
  const p = plates[pi]; world.attach(k); const from = k.position.clone();
  const spot = plateSpot(p.cakes.length); p.cakes.push(k);
  const to = p.g.localToWorld(spot.clone());
  const s0 = k.scale.x;
  play('placement-b', 0.9 + p.cakes.length * 0.06);
  await tween(dur, (t) => { k.position.lerpVectors(from, to, t); k.position.y += Math.sin(t * Math.PI) * 0.7; k.scale.setScalar(s0 + (0.85 - s0) * t); });
  p.g.attach(k); k.position.copy(spot); setTag(p.tag, p.g, p.cakes.length);
};
const cakeBack = async (k) => { /* dari piring ke piring lain dipakai lewat cakeTo; ini untuk menghapus */ world.remove(k); };
const clearPlates = () => { plates.forEach(p => { p.cakes.forEach(k => p.g.remove(k)); p.cakes = []; setTag(p.tag, null, null); }); };
const showPlates = (n) => { plates.forEach((p, i) => { p.g.visible = i < n; }); };
const pulse = (o, amt = 0.25) => { const s0 = o.scale.x; return tween(0.35, (t) => o.scale.setScalar(s0 * (1 + Math.sin(t * Math.PI) * amt)), (t) => t); };
const lift = (o, h = 0.2) => { const y0 = o.position.y; return tween(0.4, (t) => { o.position.y = y0 + Math.sin(t * Math.PI) * h; }, (t) => t); };

/* ---------- Tamu ---------- */
let seated = [];
const seatGuests = async (n) => {
  const want = shuffle(GUESTS).slice(0, n);
  GUESTS.forEach(g => { if (!want.includes(g)) actors[g.key].visible = false; });
  seated = want; placeSlots(n); showPlates(0);
  for (const g of want) { const a = actors[g.key]; if (!a.visible) { a.visible = true; const s = a.scale.x; a.scale.setScalar(0.001); tween(0.3, (t) => a.scale.setScalar(Math.max(0.001, s * t))); } }
  await wait(320); placeSlots(n);
};
const guestNames = () => seated.map(g => g.name);

/* ---------- Gambar pilihan ---------- */
const pie = (frac) => { const c = document.createElement('canvas'); c.width = c.height = 120; const x = c.getContext('2d'); x.lineWidth = 5; x.strokeStyle = '#c9a07a'; x.setLineDash([8, 6]); x.beginPath(); x.arc(60, 60, 50, 0, 7); x.stroke(); x.setLineDash([]); x.fillStyle = '#f28fb0'; x.strokeStyle = '#3b2614'; x.beginPath(); x.moveTo(60, 60); x.arc(60, 60, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); x.closePath(); x.fill(); x.stroke(); return c.toDataURL(); };
let PIE = null;

/* ---------- Jawab (pembungkus KK, supaya bisa dites) ---------- */
let pending = null;
const ask = async (o) => { pending = { type: 'ask', correct: o.correct, n: o.options.length }; const r = await KK.ask(o); pending = null; return r; };
const line = async (o, ans) => { pending = { type: 'line', ans }; const v = await KK.line(o); pending = null; return v; };
const opts3 = (ans, extra, lo = 0) => { const s = new Set([ans]); for (const e of extra) if (e >= lo && e !== ans && s.size < 3) s.add(e); let d = 1; while (s.size < 3) { if (ans + d >= lo) s.add(ans + d); if (s.size < 3 && ans - d >= lo) s.add(ans - d); d++; } const o = shuffle([...s]); return { options: o.map(String), correct: o.indexOf(ans) }; };

/* ---------- Mesin soal ---------- */
const countRows = async (rows, cols, tag) => {
  /* hitung loncat per baris: lima, sepuluh, lima belas */
  let total = 0;
  for (const r of tray.userData.rows) {
    total += r.cakes.length; r.cakes.forEach(k => lift(k, 0.22)); play('placement-c', 0.8 + total * 0.02);
    setTag(trayTag.t, tray, total, 0.9); await say(num(total));
    await wait(250);
  }
  return total;
};
/* Tebak dulu lalu cek: perkalian sebagai loyang */
const pMult = async (bs, aMax) => {
  const b = pick(bs), a = rand(2, b === 10 ? 4 : aMax), n = a * b;
  await seatGuests(rand(3, 4));
  await speak('nenek', `Nenek menata kue. Ada ${num(a)} loyang, tiap loyang ${num(b)} kue.`);
  await fillTray(a, b);
  await speak('kancil', `Berapa kue semuanya? Tebak dulu, ya!`);
  const g = await line({ min: 0, max: Math.max(20, Math.ceil((n + b) / 10) * 10), step: 1, start: b }, n);
  await speak('kancil', `Tebakanmu ${num(g)}. Ayo kita cek! Hitung tiap loyang.`);
  await countRows(a, b);
  await speak('nenek', `${cap(num(a))} loyang, tiap loyang ${num(b)}. ${cap(num(a))} kali ${num(b)} sama dengan ${num(n)}.`);
  await speak('kancil', g === n ? 'Tebakanmu tepat! Kamu juga mengecek. Hebat!' : `Ternyata ${num(n)}. Bagus, kamu mau mengecek!`);
  if (rand(0, 1)) await speak('jali', `${n} cakes! Yummy cake!`); else await speak('jali', `${cap(W_EN[b])} cakes in each row!`);
  await speak('kancil', 'Jadi, berapa kue semuanya?');
  const q = opts3(n, [a + b, n + b, n - b], 1);
  const r = await ask({ ...q, onWrong: async () => { await speak('nenek', `Lihat angkanya di loyang. Kita sudah menghitung: ${num(n)}.`); } });
  setTag(trayTag.t, null, null);
  return r.firstTry;
};
/* Dua cara: memutar loyang (sifat tukar tempat) */
const pRotate = async () => {
  const b = pick([2, 5]), a = b === 5 ? rand(2, 4) : pick([3, 4, 5]), n = a * b;
  await seatGuests(4);
  await speak('nenek', `Ini ${num(a)} baris, tiap baris ${num(b)} kue.`);
  await fillTray(a, b);
  await countRows(a, b);
  await speak('kancil', `${cap(num(a))} kali ${num(b)}, ${num(n)} kue. Sekarang Nenek memutar loyangnya!`);
  setTag(trayTag.t, null, null); play('rotate');
  await tween(1.0, (t) => { tray.rotation.y = t * Math.PI / 2; });
  await speak('nenek', `Sekarang jadi ${num(b)} baris, tiap baris ${num(a)} kue. Berapa kuenya sekarang?`);
  const q = opts3(n, [a + b, n + a, n - a], 1);
  const r = await ask({ ...q, onWrong: async () => { await speak('nenek', `Nenek tidak menambah dan tidak mengambil kue. Loyangnya hanya diputar. Kuenya tetap sama.`); await tween(0.5, (t) => { tray.rotation.y = Math.PI / 2 * (1 - t); }); await wait(300); await tween(0.5, (t) => { tray.rotation.y = Math.PI / 2 * t; }); } });
  /* hitung ulang cara kedua: per kolom */
  await speak('kancil', `Kita hitung cara lain: tiap baris ${num(a)}.`);
  let tot = 0;
  for (let c = 0; c < b; c++) { const col = tray.userData.cakes.filter((k, i) => i % b === c); tot += col.length; col.forEach(k => lift(k, 0.22)); play('placement-c', 0.8 + tot * 0.02); setTag(trayTag.t, tray, tot, 0.9); await say(num(tot)); await wait(200); }
  await speak('nenek', `${cap(num(a))} kali ${num(b)} sama dengan ${num(b)} kali ${num(a)}. Sama-sama ${num(n)}!`);
  await speak('kancil', 'Kenapa jumlahnya sama? Kuenya hanya diputar, atau ada kue baru?');
  PIE = PIE || {};
  const r2 = await ask({ options: [{ label: '↻', small: 'hanya diputar' }, { label: '+', small: 'ada kue baru' }], correct: 0, onWrong: async () => { await speak('nenek', 'Tidak ada kue baru. Nenek hanya memutar loyangnya.'); } });
  setTag(trayTag.t, null, null);
  return r.firstTry && r2.firstTry;
};
/* Betulkan Kancil: kelompok tidak sama banyak */
const pFixGroups = async () => {
  const g = rand(3, 4), b = pick([2, 5, 2, 5, 10].filter(x => x <= 5)), n = g * b;
  await seatGuests(g); showPlates(g); tray.visible = false;
  await speak('nenek', `Kancil, tolong taruh ${num(b)} kue di tiap piring, ya.`);
  const bad = rand(0, g - 1), more = b === 1 ? true : rand(0, 1) === 1;
  for (let i = 0; i < g; i++) { const c = i === bad ? (more ? b + 1 : b - 1) : b; for (let j = 0; j < c; j++) { const k = newCake(); k.position.set(0, TOP + 0.5, TZ); world.add(k); k.scale.setScalar(0.85); await cakeTo(k, i, 0.25); } }
  await speak('kancil', `Sudah! ${cap(num(g))} piring, tiap piring ${num(b)}. Benar, kan?`);
  await speak('kancil', 'Eh... piring mana yang tidak pas? Lihat angkanya.');
  const opt = plates.slice(0, g).map((p, i) => ({ label: String(p.cakes.length), small: seated[i].name }));
  const r = await ask({ options: opt, correct: bad, cols: g === 4 && layout.portrait ? 2 : g, onWrong: async (i) => { pulse(plates[i].g, 0.15); await speak('nenek', `Piring ${seated[i].name} sudah ${num(b)}, pas. Cari piring yang isinya bukan ${num(b)}.`); } });
  const p = plates[bad];
  if (more) { await speak('nenek', `Piring ${seated[bad].name} kelebihan satu. Nenek ambil satu.`); const k = p.cakes.pop(); await tween(0.3, (t) => k.scale.setScalar(0.85 * (1 - t) + 0.001)); p.g.remove(k); setTag(p.tag, p.g, p.cakes.length); }
  else { await speak('nenek', `Piring ${seated[bad].name} kurang satu. Nenek tambah satu.`); const k = newCake(); k.position.set(0, TOP + 0.5, TZ); world.add(k); k.scale.setScalar(0.85); await cakeTo(k, bad); }
  await speak('kancil', `Sekarang tiap piring ${num(b)}. ${cap(num(g))} kali ${num(b)} sama dengan ${num(n)}. Terima kasih sudah membetulkan aku!`);
  await speak('jali', `${cap(W_EN[b])} on each plate!`);
  return r.firstTry;
};

/* bagikan kue dari loyang satu-satu bergilir; berhenti bila sisa < g */
const dealOneByOne = async (g) => {
  const cakes = tray.userData.cakes.slice().reverse(); let round = 0;
  while (cakes.length >= g) {
    round++;
    for (let i = 0; i < g; i++) { const k = cakes.shift(); tray.userData.cakes.splice(tray.userData.cakes.indexOf(k), 1); await cakeTo(k, i, 0.32); }
    await say(`${num(round)}`);
  }
  if (!tray.userData.cakes.length) tray.visible = false;
  return { each: round, left: cakes.length };
};
/* Tebak lalu cek: bagi rata */
const pShare = async () => {
  const g = rand(2, 4), k = rand(2, g === 4 ? 4 : 5), n = g * k;
  await seatGuests(g); showPlates(g);
  await fillTray(Math.ceil(n / 5), Math.min(5, n), n);
  await speak('nenek', `Ada ${num(n)} kue untuk ${num(g)} tamu. Harus sama banyak. Tiap tamu dapat berapa?`);
  await speak('kancil', 'Tebak dulu, ya!');
  const guess = await line({ min: 0, max: 10, step: 1, start: 1 }, k);
  await speak('kancil', `Tebakanmu ${num(guess)}. Kita cek: bagi satu-satu, bergiliran!`);
  await dealOneByOne(g);
  await speak('nenek', `Kuenya habis. Tiap tamu dapat ${num(k)}. ${cap(num(n))} dibagi ${num(g)} sama dengan ${num(k)}.`);
  await speak('kancil', guess === k ? 'Tebakanmu tepat! Hebat!' : `Ternyata ${num(k)}. Bagus, kamu mau mengecek!`);
  await speak('jali', `Share! ${cap(W_EN[k])} each.`);
  await speak('kancil', 'Jadi, tiap tamu dapat berapa?');
  const q = opts3(k, [k + 1, k - 1, g], 1);
  const r = await ask({ ...q, onWrong: async () => { await speak('nenek', `Hitung kue di satu piring saja. Semuanya sama: ${num(k)}.`); plates.slice(0, g).forEach(p => pulse(p.g, 0.12)); } });
  return r.firstTry;
};
/* Dua cara: berapa piring yang perlu */
const pGroups = async () => {
  const k = rand(2, 5), g = rand(2, k === 5 ? 4 : 4), n = g * k;
  await seatGuests(4); showPlates(0);
  await fillTray(Math.ceil(n / 5), Math.min(5, n), n);
  await speak('nenek', `Ada ${num(n)} kue. Tiap piring diisi ${num(k)} kue. Perlu berapa piring?`);
  const q = opts3(g, [k, g + 1, g - 1], 1);
  const r = await ask({ ...q, onWrong: async (i) => { await speak('nenek', `Coba pikir: satu piring ${num(k)}, dua piring ${num(k * 2)}. Terus sampai ${num(n)}.`); } });
  await speak('kancil', `Cara Kancil: isi satu piring ${num(k)} kue, lalu piring berikutnya.`);
  for (let i = 0; i < g; i++) { plates[i].g.visible = true; for (let j = 0; j < k; j++) { const c = tray.userData.cakes.pop(); await cakeTo(c, i, 0.24); } await say(`${num(i + 1)} piring`); }
  tray.visible = false;
  await speak('nenek', `Cara Nenek: pakai perkalian. ${cap(num(g))} kali ${num(k)} sama dengan ${num(n)}. Jadi ${num(g)} piring.`);
  await speak('jali', `${cap(W_EN[g])} plates!`);
  await speak('kancil', 'Kamu suka cara yang mana? Satu-satu seperti Kancil, atau perkalian seperti Nenek?');
  const r2 = await ask({ options: [{ label: '1·1·1', small: 'satu-satu' }, { label: `${g}×${k}`, small: 'perkalian' }], correct: null });
  await speak(r2.index === 0 ? 'kancil' : 'nenek', r2.index === 0 ? 'Satu-satu itu pasti benar, walau lama.' : 'Perkalian itu cepat, kalau kita sudah hafal.');
  await speak('kancil', 'Dua cara, jawabannya sama!');
  return r.firstTry;
};
/* Betulkan Kancil: membagi tidak adil */
const pFixShare = async () => {
  const g = rand(3, 4), k = rand(2, 4), n = g * k;
  await seatGuests(g); showPlates(g);
  await fillTray(Math.ceil(n / 5), Math.min(5, n), n);
  await speak('nenek', `Kancil, bagi ${num(n)} kue ini rata untuk ${num(g)} tamu, ya.`);
  const big = rand(0, g - 1); let small = rand(0, g - 2); if (small >= big) small++;
  const counts = Array.from({ length: g }, (_, i) => i === big ? k + 1 : i === small ? k - 1 : k);
  for (let i = 0; i < g; i++) for (let j = 0; j < counts[i]; j++) { const c = tray.userData.cakes.pop(); await cakeTo(c, i, 0.22); }
  tray.visible = false; await speak('kancil', 'Selesai! Adil, kan? Hehe.');
  await speak('nenek', 'Hmm... piring siapa yang dapat lebih banyak?');
  const opt = plates.slice(0, g).map((p, i) => ({ label: String(p.cakes.length), small: seated[i].name }));
  const r = await ask({ options: opt, correct: big, cols: g === 4 && layout.portrait ? 2 : g, onWrong: async (i) => { pulse(plates[i].g, 0.15); await speak('nenek', `Piring ${seated[i].name} isinya ${num(plates[i].cakes.length)}. Ada piring lain yang lebih banyak. Bandingkan angkanya.`); } });
  await speak('nenek', `Betul! ${seated[big].name} dapat ${num(k + 1)}, tapi ${seated[small].name} cuma ${num(k - 1)}. Itu tidak adil.`);
  const c = plates[big].cakes.pop(); setTag(plates[big].tag, plates[big].g, plates[big].cakes.length); await cakeTo(c, small);
  await speak('kancil', `Aku pindahkan satu. Sekarang semua ${num(k)}. ${cap(num(n))} dibagi ${num(g)} sama dengan ${num(k)}. Maaf, ya!`);
  await speak('jali', `Fair share! ${cap(W_EN[k])} each.`);
  return r.firstTry;
};
/* Sisa */
const pRemainder = async () => {
  const g = rand(3, 4), k = rand(2, 3), rr = rand(1, g - 1), n = g * k + rr;
  await seatGuests(g); showPlates(g);
  await fillTray(Math.ceil(n / 5), Math.min(5, n), n);
  await speak('nenek', `Ada ${num(n)} kue untuk ${num(g)} tamu, sama banyak. Nanti ada sisa, tidak?`);
  await speak('kancil', 'Tebak dulu, tiap tamu dapat berapa?');
  const guess = await line({ min: 0, max: 8, step: 1, start: 1 }, k);
  await speak('kancil', `Tebakanmu ${num(guess)}. Kita bagi satu-satu, bergiliran.`);
  const res = await dealOneByOne(g);
  setTag(trayTag.t, tray, res.left, 0.6);
  await speak('nenek', `Tiap tamu dapat ${num(k)}. Tinggal ${num(res.left)} kue. Tidak cukup untuk semua tamu. Itu namanya sisa.`);
  await speak('kancil', guess === k ? 'Tebakanmu tepat!' : `Ternyata ${num(k)}. Bagus, sudah dicek!`);
  await speak('kancil', 'Berapa kue yang sisa?');
  const q = opts3(rr, [rr + 1, g, 0], 0);
  const r = await ask({ ...q, onWrong: async () => { tray.userData.cakes.forEach(c => lift(c, 0.25)); await speak('nenek', `Lihat kue yang masih di loyang. Hitung, ya.`); } });
  await speak('nenek', 'Sisanya Nenek simpan untuk tamu yang datang terlambat.');
  setTag(trayTag.t, null, null);
  return r.firstTry;
};
/* Setengah dan seperempat */
const resetCake = () => { bigCake.visible = true; bigCake.position.set(0, TOP + 0.05, TZ); bigCake.userData.pieces.forEach(p => { bigCake.add(p); p.position.set(0, 0, 0); p.scale.setScalar(1); p.rotation.set(0, 0, 0); }); };
const pHalf = async () => {
  tray.visible = false; clearTray(); tray.visible = false; resetCake();
  const pcs = bigCake.userData.pieces;
  if (rand(0, 1)) {
    /* Betulkan Kancil: seperempat dikira lebih besar */
    await seatGuests(4); showPlates(0);
    await speak('nenek', 'Ini kue bulat besar. Nenek potong!'); play('rotate');
    /* kiri: setengah (potong 1+2), kanan: seperempat (potong 0 dan 3 terpisah) */
    await tween(0.7, (t) => { pcs[1].position.set(-0.55 * t, 0, 0); pcs[2].position.set(-0.55 * t, 0, 0); pcs[0].position.set(0.35 * t, 0, -0.35 * t); pcs[3].position.set(0.75 * t, 0, 0.3 * t); });
    await speak('nenek', 'Yang kiri setengah kue. Yang kanan depan seperempat kue.');
    await speak('kancil', 'Aku mau seperempat saja! Empat lebih besar dari dua, jadi seperempat pasti lebih besar!');
    await speak('nenek', 'Benarkah? Mana yang lebih besar, setengah atau seperempat?');
    const r = await ask({ options: [{ img: PIE.half, label: '½', small: 'setengah' }, { img: PIE.quarter, label: '¼', small: 'seperempat' }], correct: 0, onWrong: async () => { await speak('nenek', 'Lihat kuenya. Makin banyak potongan, makin kecil tiap potong. Seperempat itu lebih kecil.'); lift(pcs[1], 0.25); lift(pcs[2], 0.25); await wait(500); lift(pcs[3], 0.25); } });
    await speak('nenek', 'Betul! Setengah lebih besar. Kue dipotong empat, potongannya kecil-kecil.');
    await tween(0.6, (t) => { pcs[2].position.set(-0.55 - 0.3 * t, 0, 0.3 * t); });
    await speak('nenek', 'Lihat, setengah sama dengan dua seperempat.');
    await speak('kancil', 'Oh, angka empat itu banyaknya potongan, bukan besarnya! Terima kasih!');
    await speak('jali', 'Half is bigger than a quarter!');
    return r.firstTry;
  }
  /* bagi kue bulat untuk 2 atau 4 tamu */
  const g = pick([2, 4]); await seatGuests(g); showPlates(g);
  await speak('nenek', `Kue bulat ini dibagi rata untuk ${num(g)} tamu. Tiap tamu dapat berapa?`);
  const r = await ask({ options: [{ img: PIE.half, label: '½', small: 'setengah' }, { img: PIE.quarter, label: '¼', small: 'seperempat' }], correct: g === 2 ? 0 : 1, onWrong: async () => { await speak('nenek', g === 2 ? 'Untuk dua tamu, kuenya dipotong jadi dua. Satu dari dua potong itu setengah.' : 'Untuk empat tamu, kuenya dipotong jadi empat. Satu dari empat potong itu seperempat.'); } });
  play('rotate');
  await tween(0.5, (t) => { pcs.forEach(p => { const d = g === 2 ? (p === pcs[1] || p === pcs[2] ? -1 : 1) : 0; if (g === 2) p.position.set(d * 0.3 * t, 0, 0); else p.position.copy(p.userData.dir).multiplyScalar(0.3 * t); }); });
  const groups = g === 2 ? [[pcs[1], pcs[2]], [pcs[0], pcs[3]]] : pcs.map(p => [p]);
  for (let i = 0; i < g; i++) {
    const pl = plates[i].g; const to = pl.localToWorld(new THREE.Vector3(0, 0.04, 0));
    for (const p of groups[i]) { world.attach(p); const from = p.position.clone(); const s0 = p.scale.x; const tgt = to.clone(); play('placement-b'); await tween(0.4, (t) => { p.position.lerpVectors(from, tgt, t); p.position.y += Math.sin(t * Math.PI) * 0.6; p.scale.setScalar(s0 + (0.55 - s0) * t); }); }
  }
  await speak('nenek', g === 2 ? 'Tiap tamu dapat setengah kue.' : 'Tiap tamu dapat seperempat kue.');
  await speak('jali', g === 2 ? 'Half! A half each.' : 'A quarter each!');
  return r.firstTry;
};
/* Soal dua langkah ringan */
const pTwoStep = async () => {
  let a, b, g; do { a = rand(2, 4); b = pick([2, 3, 4, 5]); g = pick([2, 3, 4]); } while ((a * b) % g || a * b / g > 6 || a * b / g < 2);
  const n = a * b, k = n / g;
  await seatGuests(g); showPlates(g);
  await speak('nenek', `Ada ${num(a)} loyang, tiap loyang ${num(b)} kue. Semuanya untuk ${num(g)} tamu.`);
  await fillTray(a, b);
  await speak('kancil', 'Langkah pertama: berapa kue semuanya?');
  const q = opts3(n, [a + b, n + b, n - b], 1);
  const r1 = await ask({ ...q, onWrong: async () => { await speak('nenek', `${cap(num(a))} loyang, tiap loyang ${num(b)}. Hitung loncat ${num(b)}-${num(b)}.`); await countRows(a, b); setTag(trayTag.t, null, null); } });
  await speak('kancil', `${cap(num(n))} kue. Langkah kedua: dibagi ${num(g)} tamu, tiap tamu berapa? Tebak dulu!`);
  const guess = await line({ min: 0, max: 10, step: 1, start: 1 }, k);
  await speak('kancil', `Tebakanmu ${num(guess)}. Kita bagi satu-satu.`);
  /* susun ulang kue loyang agar bisa dibagi dari belakang */
  await dealOneByOne(g);
  await speak('nenek', `Tiap tamu dapat ${num(k)}. ${cap(num(a))} kali ${num(b)}, ${num(n)}. Dibagi ${num(g)}, jadi ${num(k)}.`);
  await speak('jali', `${cap(W_EN[k])} cakes each!`);
  await speak('kancil', 'Jadi, tiap tamu dapat berapa?');
  const q2 = opts3(k, [k + 1, k - 1, g], 1);
  const r2 = await ask({ ...q2, onWrong: async () => { plates.slice(0, g).forEach(p => pulse(p.g, 0.12)); await speak('nenek', `Lihat satu piring saja. Isinya ${num(k)}.`); } });
  return r1.firstTry && r2.firstTry;
};

const PROBLEMS = [
  [() => pMult([2, 5, 10], 5), pRotate, pFixGroups],
  [pShare, pFixShare, pGroups, pRemainder],
  [() => pMult([3, 4], 5), pHalf, pTwoStep],
];
const qi = [0, 0, 0]; if (QS.get('q')) { const [a, b] = QS.get('q').split(':').map(Number); qi[a] = b || 0; } let qCount = 0, breakDone = false, finaleDone = false;

const resetTable = async () => {
  clearPlates(); clearTray(); tray.visible = true; bigCake.visible = false;
  bigCake.userData.pieces.forEach(p => { if (p.parent !== bigCake) { p.parent && p.parent.remove(p); } });
  resetCake(); bigCake.visible = false;
  setTag(trayTag.t, null, null); KK.clear();
};

/* ---------- HUD ---------- */
const drawHud = () => { const s = KK.load(BAB); $('#stage').innerHTML = `Tahap ${s.stage + 1} <b>${[0, 1, 2].map(i => i < s.streak ? '●' : '○').join('')}</b>`; };

/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  await speak('nenek', 'Istirahat dulu! Balon kenduri lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; const portrait = layout.portrait; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.8 : 4.4;
      b.position.set((Math.random() * 2 - 1) * w, 0.9, (portrait ? 0.8 : 1.4) + Math.random() * 0.8); b.scale.setScalar(portrait ? 1.0 : 1.25);
      b.userData = { v: (0.8 + Math.random() * 0.4) / SPEED, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100 * SPEED);
  });
  await speak('kancil', 'Seru! Yuk, lanjut membagi kue.');
};

const confetti = (n = 28) => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.style.left = rand(2, 98) + '%'; p.style.animationDelay = Math.random() * 0.6 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B', '#C6A0F0']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 2400); };

/* ---------- Penutup cerita ---------- */
const everyone = () => ['kancil', 'jali', 'nenek', ...seated.map(g => g.key)].map(k => actors[k]);
const finale = async () => {
  await resetTable();
  await speak('nenek', 'Semua tamu sudah datang! Ayo, kita bagi kue untuk semuanya.');
  await seatGuests(5); showPlates(5);
  await fillTray(2, 5);
  await speak('kancil', 'Sepuluh kue untuk lima tamu. Aku bagi satu-satu, bergiliran. Sekarang aku bisa!');
  await dealOneByOne(5);
  await speak('kancil', 'Tiap tamu dapat dua. Sama banyak! Adil!');
  resetCake(); bigCake.position.set(0, TOP + 0.05, TZ);
  await speak('nenek', 'Dan kue bulat besar untuk dinikmati bersama. Terima kasih, Cucu. Kamu sudah mengajari Kancil!');
  chime([523, 659, 784, 1047, 1319]);
  for (let i = 0; i < 4; i++) { confetti(36); everyone().forEach((a, j) => setTimeout(() => hop(a, 0.4), j * 70)); await wait(650); }
  await speak('jali', 'Cake for everyone! Share and enjoy! Hooray!');
  await speak('kancil', 'Pesta kenduri dimulai! Terima kasih sudah membantu aku dari awal cerita sampai sekarang!');
  confetti(40); everyone().forEach(a => hop(a, 0.5));
  bubble.hidden = true; finaleDone = true;
  KK.done(BAB, 'Semua tamu mendapat kue sama banyak. Pesta kenduri Kota Kancil dimulai! Terima kasih sudah menemani Kancil sampai akhir cerita.');
};

/* ---------- Putaran permainan ---------- */
let running = false, nowProblem = '';
const run = async () => {
  if (running) return; running = true;
  await seatGuests(4);
  await speak('nenek', 'Halo, Cucu! Hari ini ada kenduri kampung. Nenek Gabe membuat banyak kue untuk para tamu.');
  await speak('kancil', 'Aku yang membagi kuenya! Tapi aku sering keliru. Kamu bantu aku, ya!');
  await speak('jali', 'Cake! Plate! Yummy!');
  while (true) {
    const st = KK.load(BAB).stage; const list = PROBLEMS[st]; const fn = list[qi[st] % list.length]; qi[st]++;
    nowProblem = `${st}:${qi[st] - 1}`;
    let ok = false; try { ok = await fn(); } catch (e) { console.error(e); }
    qCount++;
    const r = KK.record(BAB, ok, STAGES); drawHud();
    if (r.finished) { await finale(); while (document.querySelector('.kk-done')) await new Promise(ok => setTimeout(ok, 400)); }
    else if (r.advanced) {
      chime([659, 784, 988]); confetti();
      await speak('nenek', r.stage === 1 ? 'Pintar sekali! Sekarang kita bagi kue ke piring tamu.' : 'Hebat! Sekarang perkalian tiga dan empat, dan kue bulat besar.');
    }
    if (!breakDone && !finaleDone && (r.advanced || qCount >= 4)) { breakDone = true; await resetTable(); await balloonBreak(); }
    await wait(600); await resetTable();
  }
};

/* ---------- Ketuk tokoh ---------- */
let chat = false;
const quick = async (fn) => { if (chat) return; chat = true; try { await fn(); } finally { chat = false; } };
const onKancil = () => quick(async () => { play('toggle'); hop(actors.kancil); });
const onJali = () => quick(async () => { play('toggle'); hop(actors.jali, 0.3); });
const onNenek = () => quick(async () => { play('toggle'); hop(actors.nenek, 0.15); });
const onGuest = (g) => quick(async () => { play('toggle'); hop(actors[g.key], 0.2); });

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 18) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent && o.visible), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
$('#startBtn').addEventListener('click', () => { $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } run(); });

/* ---------- Putaran gambar ---------- */
const clock = new THREE.Clock(); const v = new THREE.Vector3();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  placeCam();
  const K = actors.kancil, J = actors.jali;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  for (const key of ['nenek', ...GUESTS.map(g => g.key)]) { const a = actors[key]; if (!a || !a.visible) continue; const h = a.userData.head || (a.userData.body && a.userData.body.userData.head); if (h) { h.rotation.z = Math.sin(t * 1.1 + key.length) * 0.04; h.rotation.x = a.userData.talk ? Math.sin(t * 13) * 0.05 : 0; } }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > (layout.portrait ? 9 : 6.5)) b.userData.end(); }
  renderer.render(scene, camera);
  for (const tg of tags) { if (tg.el.hidden || !tg.obj) continue; tg.obj.getWorldPosition(v); v.y += tg.dy; v.z += tg.dz; v.project(camera); tg.el.style.transform = `translate(calc(${(v.x * 0.5 + 0.5) * innerWidth}px - 50%), calc(${(-v.y * 0.5 + 0.5) * innerHeight}px - 50%))`; }
  requestAnimationFrame(frame);
};

(async () => {
  try { buildWorld(); } catch (e) { $('#loading').textContent = 'Dapur gagal dimuat: ' + (e && e.message || e); throw e; }
  trayTag.t = mkTag('tray');
  fit(); placeCam();
  PIE = { half: pie(0.5), quarter: pie(0.25) };
  drawHud();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ ...KK.load(BAB), pending: pending && { ...pending }, problem: nowProblem, qCount, finaleDone, balloons: balloons.length, done: !!document.querySelector('.kk-done') }),
    answerCorrect: () => {
      if (!pending) return false; const s = document.querySelector('.kk-sheet'); if (!s) return false;
      if (pending.type === 'ask') { const b = s.querySelectorAll('.kk-opt')[pending.correct ?? 0]; b.click(); return true; }
      const r = s.querySelector('input[type=range]'); r.value = pending.ans; r.dispatchEvent(new Event('input')); s.querySelector('.kk-ok').click(); return true;
    },
    answerWrong: () => { if (!pending || pending.type !== 'ask' || pending.correct == null) return false; const bs = [...document.querySelectorAll('.kk-sheet .kk-opt')]; const i = bs.findIndex((b, j) => j !== pending.correct); bs[i].click(); return true; },
    popBalloons: () => { balloons.slice().forEach(b => b.userData.tap && b.userData.tap()); return balloons.length; },
    balloonBreak, actors, cam, fit,
  };
  if (QS.has('play')) { $('#intro').classList.add('gone'); run(); }
  frame();
})();
