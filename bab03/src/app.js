/* Kota Kancil 3D, Bab 03: Kebun Ketimun Kakek Ramlan.
   Kancil membantu panen dan dibayar ketimun. Anak menjadi guru Kancil: soal dengan bagian yang tidak diketahui (perubahan, awal, bagian), sampai 20. */
import * as THREE from 'three';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const FAST = QS.has('fast'); const SP = FAST ? 0.12 : 1;
const wait = (ms) => new Promise(r => setTimeout(r, ms * SP));
const BAB = 3, STAGES = 3;

/* ---------- Simpanan (hanya suara dari simpanan lama) ---------- */
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
  if (FAST) return wait(250);
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
/* hitungan cepat: angka pendek, tidak menunggu lama */
const countSay = (n) => FAST ? wait(120) : (!D.sound || !('speechSynthesis' in window)) ? wait(650) : say(String(n));
const sounds = {};
for (const n of ['placement-a', 'placement-b', 'placement-c', 'toggle', 'rotate']) { const a = new Audio(`../pasar3d/sounds/${n}.ogg`); a.preload = 'auto'; sounds[n] = a; }
const play = (n, rate = 1) => { if (!D.sound || FAST) return; try { const a = sounds[n].cloneNode(); a.playbackRate = rate; a.volume = 0.7; a.play().catch(() => { }); } catch (e) { /* abaikan */ } };
let actx = null;
const chime = (freqs) => { if (!D.sound || FAST) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); freqs.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.1; o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.26); }); } catch (e) { /* abaikan */ } };

/* ---------- Renderer & adegan ---------- */
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: QS.has('shot') });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(26, 1, 1, 400);
scene.add(new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.35));
const sun = new THREE.DirectionalLight(0xffdfae, 2.5); sun.position.set(-6, 13, 8); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: dur * SP, fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);
const bounce = (o, amt = 0.12) => { const y0 = o.userData.y0 ?? (o.userData.y0 = o.position.y); return tween(0.3, (t) => { o.position.y = y0 + Math.sin(t * Math.PI) * amt; }, (t) => t); };

/* ---------- Dunia ---------- */
const actors = {}; const T = { a: null, b: null }; let beds = [], hutG = null, crow = null, warungSign = null;
const mkTray = () => { const g = B.tray(); world.add(g); const c = B.cloth(); c.visible = false; g.add(c); return { g, items: [], cloth: c }; };
const buildWorld = async () => {
  world.add(B.field());
  beds = [B.bed(4.6), B.bed(4.6)]; beds.forEach(b => world.add(b));
  hutG = B.hut(); world.add(hutG);
  crow = B.scarecrow(); world.add(crow);
  for (const [x, z, s] of [[-7.2, -4, 1.2], [7.3, -3.8, 1.0], [-7.6, -1.4, 0.85]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  T.a = mkTray(); T.b = mkTray();
  warungSign = B.sign('BU MURNI'); warungSign.visible = false; world.add(warungSign);
  const k = B.kancil(); k.scale.setScalar(1.35); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const j = B.jali(); j.scale.setScalar(1.2); world.add(j); actors.jali = j; tap(j, () => onJali());
  const kk = B.warga({ kind: 'kakek', dress: 0x4f8a5b }); kk.scale.setScalar(1.45); world.add(kk); actors.kakek = kk; tap(kk, () => onKakek());
  world.add(B.sea());
};

/* ---------- Kamera & tata letak ---------- */
const cam = { az: 0, el: 0.8, target: new THREE.Vector3(), dist: 20 };
let portrait = false;
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9; camera.fov = portrait ? 32 : 26; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 1.85 : 5.7, needH = portrait ? 3.6 : 2.9;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = portrait ? 0.92 : 0.78; document.body.classList.toggle('portrait', portrait);
  if (portrait) cam.target.set(0, 0, 0.35); else cam.target.set(0, 0, -0.1);
  if (!T.a) return;
  const L = portrait ? {
    a: [0, 0, -0.05], b: [0, 0, 1.6], kakek: [-1.05, -1.45, 0.25], kancil: [1.05, -1.45, -2.0], jali: [1.22, 0.8, 0.16, 0.62], crow: [0.6, -3.9], hut: [-2.2, -4.6], beds: [[-0.2, -2.55], [-0.2, -3.25]], sign: [1.35, 1.1], s: 0.9,
  } : {
    a: [-1.45, 0, 0.35], b: [1.45, 0, 0.35], kakek: [-3.55, 0.0, 0.55], kancil: [3.55, 0.05, -2.45], jali: [5.3, -2.1, 1.36, 1.15], crow: [4.75, -2.1], hut: [-5.2, -3.4], beds: [[0, -1.35], [0, -2.2]], sign: [2.9, -0.55], s: 1,
  };
  T.a.g.position.set(...L.a); T.b.g.position.set(...L.b);
  actors.kakek.position.set(L.kakek[0], 0.03, L.kakek[1]); actors.kakek.rotation.y = L.kakek[2];
  actors.kancil.position.set(L.kancil[0], 0.03, L.kancil[1]); actors.kancil.rotation.y = L.kancil[2];
  crow.position.set(L.crow[0], 0, L.crow[1]); actors.jali.position.set(L.jali[0], L.jali[2], L.jali[1]); actors.jali.scale.setScalar(L.jali[3]); actors.jali.rotation.y = -Math.PI / 2 + (portrait ? 0.6 : 0.3); crow.visible = !portrait;
  hutG.position.set(L.hut[0], 0, L.hut[1]); hutG.rotation.y = 0.3;
  beds.forEach((b, i) => { b.position.set(L.beds[i][0], 0, L.beds[i][1]); b.scale.x = portrait ? 0.62 : 1; b.children.forEach(c => { if (c.isGroup) c.scale.x = portrait ? 1 / 0.62 * 0.9 : 0.9; }); });
  warungSign.position.set(L.sign[0], 0, L.sign[1]);
  for (const k of ['kakek', 'kancil']) actors[k].scale.setScalar((k === 'kakek' ? 1.45 : 1.35) * L.s);
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung & papan soal ---------- */
const bubble = $('#bubble');
const NAMES = { kancil: 'Kancil', jali: 'Jali', kakek: 'Kakek Ramlan' };
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};
const eqEl = $('#eq');
const CUKE = '<svg viewBox="0 0 40 20" aria-hidden="true"><rect x="2" y="4" width="34" height="12" rx="6" fill="#3f8f3a"/><circle cx="34" cy="10" r="3" fill="#8cc96a"/><rect x="0" y="9" width="4" height="2" fill="#7a5a2a"/></svg>';
/* parts: angka, '+', '−', '=', '?', atau {n, cls}. who: 'kancil' untuk hitungan Kancil (belum tentu benar) */
const eq = (parts, who) => {
  if (!parts) { eqEl.hidden = true; return; }
  eqEl.hidden = false; eqEl.dataset.who = who || '';
  eqEl.innerHTML = (who === 'kancil' ? '<i>Kancil:</i>' : CUKE) + parts.map(p => p === '?' ? '<b class="q">?</b>' : /^[+−=]$/.test(p) ? `<em>${p}</em>` : `<b>${p}</b>`).join('');
};
const eqFill = (v, ok) => { const q = eqEl.querySelector('.q'); if (q) { q.textContent = v; q.classList.toggle('ok', !!ok); } };
const chip = $('#stage');
const drawStage = () => { const s = KK.load(BAB); chip.innerHTML = `Tahap ${s.stage + 1}/3 ` + [0, 1, 2].map(i => `<u class="${i < s.streak ? 'on' : ''}"></u>`).join(''); };

/* ---------- Keranjang: isi, terbang, kain, tanda ---------- */
const wp = (t, i) => t.g.localToWorld(B.slotPos(i).clone());
const putCuke = (t, opts = {}) => { const c = B.cucumber(!!opts.ghost); const i = t.items.length; c.position.copy(B.slotPos(i)); c.rotation.y = (Math.random() - 0.5) * 0.12; const s = opts.big ? 1.45 : opts.small ? 1.0 : 1.22; c.scale.setScalar(s); c.userData = { big: !!opts.big, ghost: !!opts.ghost, s }; t.g.add(c); t.items.push(c); return c; };
const clearTray = (t) => { t.items.forEach(c => t.g.remove(c)); t.items = []; };
const fill = (t, n, opts) => { for (let i = 0; i < n; i++) putCuke(t, opts); };
const target = (t, n) => t.g.userData.marks.forEach((m, i) => { m.visible = i < n; });
const bedPos = () => { const b = pick(beds); return b.localToWorld(new THREE.Vector3(rand(-18, 18) / 10, 0.4, 0.3)); };
const flyIn = async (t, from, opts = {}) => {
  const c = putCuke(t, opts); const to = c.position.clone(); const fromL = t.g.worldToLocal(from.clone());
  await tween(0.45, (k) => { c.position.lerpVectors(fromL, to, k); c.position.y += Math.sin(k * Math.PI) * 1.0; c.rotation.x = k * 6.28; });
  c.rotation.x = 0; play('placement-b', 1 + Math.random() * 0.2); return c;
};
const flyOut = async (t, toWorld) => {
  const c = t.items.pop(); if (!c) return; const from = c.position.clone(); const to = t.g.worldToLocal(toWorld.clone());
  await tween(0.45, (k) => { c.position.lerpVectors(from, to, k); c.position.y += Math.sin(k * Math.PI) * 1.0; c.rotation.x = k * 6.28; });
  t.g.remove(c); play('placement-a', 1.2);
};
const cover = (t) => { const c = t.cloth; c.visible = true; c.position.set(0, 0.05, 0); c.userData.mat.opacity = 1; c.scale.setScalar(1); };
const uncover = async (t) => { const c = t.cloth; if (!c.visible) return; play('rotate'); await tween(0.7, (k) => { c.position.y = 0.05 + k * 1.3; c.position.x = k * 0.8; c.rotation.z = -k * 0.5; c.userData.mat.opacity = 1 - k; }); c.visible = false; c.rotation.z = 0; };
/* hitung isi keranjang satu per satu (melompat + angka di papan) */
const countItems = async (t, from = 0, to = t.items.length, label = (i) => i + 1, fillEq = true) => { for (let i = from; i < to; i++) { const c = t.items[i]; bounce(c, 0.14); const n = label(i); if (fillEq) eqFill(n); await countSay(n); } };
const reset = () => { for (const t of [T.a, T.b]) { clearTray(t); t.cloth.visible = false; target(t, 0); } warungSign.visible = false; eq(null); };

/* ---------- Tanya jawab (dengan kait tes) ---------- */
let cur = null;
const askNum = async (min, max, answer) => { cur = { kind: 'line', answer }; const v = await KK.line({ min, max, start: Math.round((min + max) / 2) }); cur = null; return v; };
const askOpt = async (o) => { cur = { kind: 'ask', answer: o.correct }; const r = await KK.ask(o); cur = null; return r; };
const opts3 = (ans, wrong) => { const s = new Set([ans, wrong]); let d = ans + (Math.random() < 0.5 ? 1 : -1); if (d < 0 || s.has(d)) d = ans + 2; if (s.has(d)) d = ans + 3; s.add(d); const arr = shuffle([...s]); return { arr, correct: arr.indexOf(ans) }; };
const praiseGuess = async (g, ans) => {
  if (g === ans) { chime([523, 659, 784]); hop(actors.kancil, 0.4); await speak('kakek', pick([`Tebakanmu ${g}, tepat sekali!`, `Betul, ${ans}! Kamu sudah mengecek bersama Kancil.`])); }
  else await speak('kakek', `Tebakanmu ${g}, ternyata ${ans}. Bagus, kita sudah mengeceknya!`);
};

/* ---------- Soal ---------- */
/* Tahap 1: perubahan dicari */
const genJoin = () => { const a = rand(2, 9), d = rand(2, 9); return { a, c: a + d, ans: d }; };
const genSep = () => { const e = rand(2, 9), a = rand(2, 9); return { c: a + e, a, ans: e }; };
const setupJoin = async (p) => { fill(T.a, p.a); target(T.a, p.c); eq([p.a, '+', '?', '=', p.c]); await speak('kakek', `Di keranjang ada ${p.a} ketimun. Kakek mau ${p.c}. Lihat tanda kuning: itu tempat ${p.c} ketimun.`); };
const checkJoin = async (p) => { await speak('kancil', `Ayo cek! Kita petik satu-satu sampai ${p.c}.`); for (let i = 0; i < p.ans; i++) { await flyIn(T.a, bedPos()); eqFill(i + 1); await countSay(i + 1); } eqFill(p.ans, true); };
const roundJoinGuess = async () => {
  const p = genJoin(); await setupJoin(p);
  hop(actors.jali, 0.2); await speak('jali', 'More cucumbers! How many more?', 'en'); await speak('kancil', `Perlu berapa lagi? Tebak dulu, ya!`);
  const g = await askNum(0, 20, p.ans); await checkJoin(p); await praiseGuess(g, p.ans);
  await speak('kancil', `${p.a} tambah ${p.ans} jadi ${p.c}. Perlu ${p.ans} lagi!`); return g === p.ans ? true : null;
};
const roundSepGuess = async () => {
  const p = genSep(); fill(T.a, p.a); target(T.a, p.c); eq([p.c, '−', '?', '=', p.a]);
  await speak('kakek', `Tadi ada ${p.c} ketimun. Kancil makan beberapa sebagai upah. Sekarang tinggal ${p.a}.`);
  await speak('kancil', 'Hehe, enak! Berapa yang sudah kumakan? Tebak dulu!');
  const g = await askNum(0, 20, p.ans);
  await speak('kakek', `Kita cek. Dari ${p.a}, hitung maju sampai ${p.c}. Tempat yang kosong itu yang dimakan Kancil.`);
  for (let i = 0; i < p.ans; i++) { const c = putCuke(T.a, { ghost: true }); c.scale.setScalar(0.01); tween(0.25, (k) => c.scale.setScalar(Math.max(0.01, k))); eqFill(i + 1); await countSay(p.a + i + 1); }
  eqFill(p.ans, true); await praiseGuess(g, p.ans);
  await speak('kancil', `${p.c} kurang ${p.ans} tinggal ${p.a}. Aku makan ${p.ans} ketimun!`); return g === p.ans ? true : null;
};
/* Betulkan Kancil: memilih operasi dari kata ("lagi" berarti tambah) */
const twoWaysJoin = async (p) => {
  await speak('kakek', `Kakek menghitung maju dari ${p.a} sampai ${p.c}.`);
  await speak('kancil', `Kalau aku, ${p.c} mundur ${p.a}. Siapa yang benar?`);
  const r = await askOpt({ options: ['Kakek', 'Kancil', 'Dua-duanya'], correct: 2, onWrong: async () => { await speak('kakek', `Coba dengar: maju dari ${p.a} sampai ${p.c} dapat ${p.ans}. ${p.c} mundur ${p.a} juga dapat ${p.ans}. Jadi?`); } });
  await speak('kakek', `Dua-duanya benar! Maju dari ${p.a}: ${Array.from({ length: p.ans }, (_, i) => p.a + i + 1).join(', ')}. Itu ${p.ans} langkah.`);
  await countItems(T.a, p.a, p.c, (i) => i - p.a + 1);
  await speak('kancil', `Dan ${p.c} kurang ${p.a} juga ${p.ans}. Dua cara, satu jawaban!`); return r.firstTry;
};
const showOverflow = async (t, have, extra, limit) => { const n = Math.min(20 - have, extra); for (let i = 0; i < n; i++) putCuke(t); bounce(t.g, 0.06); await speak('kakek', `Lihat, ketimunnya keluar dari tanda kuning! Kakek cuma mau ${limit}.`); for (let i = 0; i < n; i++) { const c = t.items.pop(); t.g.remove(c); } };
const roundJoinFix = async () => {
  const p = genJoin(); await setupJoin(p);
  const wrong = p.a + p.c; eq([p.a, '+', p.c, '=', wrong], 'kancil');
  await speak('kancil', `Ada kata "lagi". Lagi berarti tambah! ${p.a} tambah ${p.c} jadi ${wrong}!`);
  await speak('kakek', 'Hmm, betulkah? Bantu Kancil. Perlu berapa lagi?');
  const o = opts3(p.ans, wrong);
  const r = await askOpt({ options: o.arr, correct: o.correct, onWrong: async (i) => {
    if (o.arr[i] === wrong) { await showOverflow(T.a, p.a, p.c, p.c); await speak('kakek', `Kalau ditambah ${p.c}, jadi lebih dari ${p.c}. Kita cari dari ${p.a} sampai ${p.c} saja.`); }
    else await speak('kakek', `Hampir. Hitung pelan dari ${p.a}: ${p.a + 1}, ${p.a + 2}, dan terus sampai ${p.c}.`);
  } });
  eq([p.a, '+', '?', '=', p.c]); await checkJoin(p);
  await speak('kancil', `Oh! "Lagi" bukan berarti tambah ${p.a} dan ${p.c}. Yang dicari: dari ${p.a} sampai ${p.c}.`);
  const r2 = await twoWaysJoin(p); return r.firstTry && r2;
};

/* Tahap 2: awal dicari (keranjang tertutup kain) */
const genStartJoin = () => { const s = rand(3, 11), b = rand(2, 9); return { s, b, c: s + b, ans: s }; };
const genStartSep = () => { const a = rand(4, 11), b = rand(2, Math.min(9, a - 1)); return { a, b, c: a + b, ans: a + b }; };
const setupStartJoin = async (p) => {
  fill(T.a, p.s); cover(T.a); eq(['?', '+', p.b, '=', p.c]);
  await speak('kakek', 'Ketimun tadi pagi Kakek tutup dengan kain.');
  for (let i = 0; i < p.b; i++) { await flyIn(T.b, bedPos()); await countSay(i + 1); }
  hop(actors.jali, 0.2); await speak('jali', 'Basket!', 'en');
  await speak('kakek', `Kakek memetik ${p.b} lagi. Sekarang semuanya ada ${p.c}. Tadi pagi ada berapa?`);
};
const checkStartJoin = async (p) => { await speak('kancil', 'Ayo buka kainnya!'); await uncover(T.a); await countItems(T.a); eqFill(p.s, true); await speak('kakek', `Tadi pagi ${p.s}. Lalu ${p.s} tambah ${p.b}...`); await countItems(T.b, 0, p.b, (i) => p.s + i + 1, false); await speak('kakek', `jadi ${p.c}. Cocok!`); };
const roundStartJoinGuess = async () => { const p = genStartJoin(); await setupStartJoin(p); const g = await askNum(0, 20, p.ans); await checkStartJoin(p); await praiseGuess(g, p.ans); return g === p.ans ? true : null; };
const setupStartSep = async (p) => {
  fill(T.a, p.a); cover(T.a); warungSign.visible = true; eq(['?', '−', p.b, '=', p.a]);
  await speak('kakek', `Kancil mengantar ketimun ke Warung Bu Murni.`);
  for (let i = 0; i < p.b; i++) { await flyIn(T.b, T.a.g.localToWorld(new THREE.Vector3(0, 0.5, 0))); await countSay(i + 1); }
  await speak('kakek', `Kancil mengantar ${p.b}. Di bawah kain tinggal ${p.a}. Awalnya ada berapa?`);
};
const checkStartSep = async (p) => {
  await speak('kancil', 'Ayo buka kainnya, lalu bawa pulang yang ke warung!'); await uncover(T.a); await countItems(T.a, 0, p.a, (i) => i + 1, false);
  const from = T.b.g.localToWorld(new THREE.Vector3(0, 0.3, 0)); for (let i = 0; i < p.b; i++) { T.b.g.remove(T.b.items.pop()); await flyIn(T.a, from); await countSay(p.a + i + 1); }
  eqFill(p.c, true); await speak('kakek', `${p.a} tambah ${p.b} jadi ${p.c}. Awalnya ${p.c}!`);
};
const roundStartSepGuess = async () => { const p = genStartSep(); await setupStartSep(p); const g = await askNum(0, 20, p.ans); await checkStartSep(p); await praiseGuess(g, p.ans); return g === p.ans ? true : null; };
const twoWaysStartSep = async (p) => {
  await speak('kakek', `Cara Kakek: ${p.a} tambah ${p.b}.`);
  await speak('kancil', `Caraku: mulai dari ${p.a}, hitung maju ${p.b} kali. Siapa yang benar?`);
  const r = await askOpt({ options: ['Kakek', 'Kancil', 'Dua-duanya'], correct: 2, onWrong: async () => { await speak('kakek', `${p.a} tambah ${p.b} dapat ${p.c}. Maju ${p.b} kali dari ${p.a} juga sampai ${p.c}. Jadi?`); } });
  await speak('kancil', `Dua-duanya benar! ${Array.from({ length: p.b }, (_, i) => p.a + i + 1).join(', ')}. Sampai ${p.c}!`);
  await countItems(T.a, p.a, p.c, (i) => i + 1, false); return r.firstTry;
};
const roundStartSepFix = async () => {
  const p = genStartSep(); await setupStartSep(p);
  const wrong = p.a - p.b; eq([p.a, '−', p.b, '=', wrong], 'kancil');
  await speak('kancil', `"Mengantar" berarti kurang! ${p.a} kurang ${p.b} jadi ${wrong}!`);
  await speak('kakek', 'Hmm, betulkah? Bantu Kancil. Awalnya berapa?');
  const o = opts3(p.ans, wrong);
  const r = await askOpt({ options: o.arr, correct: o.correct, onWrong: async (i) => {
    if (o.arr[i] === wrong) await speak('kakek', `Kalau awalnya cuma ${wrong}, Kancil tidak bisa mengantar ${p.b}. Yang tersisa saja ${p.a}. Awalnya pasti lebih banyak dari ${p.a}.`);
    else await speak('kakek', `Hampir. Yang tinggal ${p.a}, yang diantar ${p.b}. Kumpulkan lagi semuanya.`);
  } });
  eq(['?', '−', p.b, '=', p.a]); await checkStartSep(p);
  const r2 = await twoWaysStartSep(p); return r.firstTry && r2;
};
const roundStartJoinFix = async () => {
  const p = genStartJoin(); await setupStartJoin(p);
  const wrong = p.c + p.b; eq([p.c, '+', p.b, '=', wrong], 'kancil');
  await speak('kancil', `Ada kata "lagi"! Berarti tambah: ${p.c} tambah ${p.b} jadi ${wrong}!`);
  await speak('kakek', 'Hmm, betulkah? Tadi pagi ada berapa?');
  const o = opts3(p.ans, wrong);
  const r = await askOpt({ options: o.arr, correct: o.correct, onWrong: async (i) => {
    if (o.arr[i] === wrong) await speak('kakek', `Kalau tadi pagi ${wrong}, lalu Kakek memetik lagi, sekarang pasti lebih dari ${wrong}. Padahal sekarang cuma ${p.c}.`);
    else await speak('kakek', `Hampir. Semuanya ${p.c}, yang baru dipetik ${p.b}. Sisanya yang di bawah kain.`);
  } });
  eq(['?', '+', p.b, '=', p.c]); await checkStartJoin(p); return r.firstTry;
};

/* Tahap 3: bagian dicari + soal terbuka + mana yang tidak cocok */
const genPart = () => { const b = rand(2, 9), s = rand(2, 9); return { b, s, c: b + s, ans: s }; };
const setupPart = async (p) => { fill(T.a, p.b, { big: true }); fill(T.b, p.s, { small: true }); cover(T.b); eq([p.b, '+', '?', '=', p.c]); hop(actors.jali, 0.2); await speak('jali', 'Big cucumbers, small cucumbers!', 'en'); await speak('kakek', `Ada ${p.c} ketimun. ${p.b} besar, sisanya kecil. Yang kecil Kakek tutup kain. Yang kecil berapa?`); };
const checkPart = async (p) => { await speak('kancil', 'Buka kainnya!'); await uncover(T.b); await countItems(T.b); eqFill(p.s, true); await speak('kakek', `${p.b} besar dan ${p.s} kecil. Hitung semua:`); await countItems(T.a, 0, p.b, (i) => i + 1, false); await countItems(T.b, 0, p.s, (i) => p.b + i + 1, false); };
const roundPartGuess = async () => { const p = genPart(); await setupPart(p); const g = await askNum(0, 20, p.ans); await checkPart(p); await praiseGuess(g, p.ans); return g === p.ans ? true : null; };
const roundPartFix = async () => {
  const p = genPart(); await setupPart(p);
  const wrong = p.c + p.b; eq([p.c, '+', p.b, '=', wrong], 'kancil');
  await speak('kancil', `Yang kecil? ${p.c} tambah ${p.b} jadi ${wrong}!`);
  await speak('kakek', 'Hmm, betulkah? Bantu Kancil. Yang kecil berapa?');
  const o = opts3(p.ans, wrong);
  const r = await askOpt({ options: o.arr, correct: o.correct, onWrong: async (i) => {
    if (o.arr[i] === wrong) await speak('kakek', `Semua ketimun cuma ${p.c}. Yang kecil hanya sebagian, jadi pasti kurang dari ${p.c}.`);
    else await speak('kakek', `Hampir. Dari ${p.b} hitung maju sampai ${p.c}.`);
  } });
  eq([p.b, '+', '?', '=', p.c]); await checkPart(p);
  await speak('kancil', `Oh, ${p.c} kurang ${p.b} jadi ${p.ans}. Atau maju dari ${p.b} sampai ${p.c}!`); return r.firstTry;
};
const roundSplitOpen = async () => {
  const n = rand(6, 12); fill(T.a, n); eq([n, '=', '?', '+', '?']);
  await speak('kakek', `Ada ${n} ketimun. Bagi ke dua keranjang. Tunjukkan satu cara! Berapa yang tetap di keranjang kiri?`);
  const k = await askNum(1, n - 1, null);
  const to = T.b.g.localToWorld(B.slotPos(0).clone());
  for (let i = 0; i < n - k; i++) { const c = T.a.items[T.a.items.length - 1]; const dst = T.b.g.localToWorld(B.slotPos(T.b.items.length).clone()); await flyOut(T.a, dst); putCuke(T.b); await countSay(i + 1); }
  void to; eq([n, '=', k, '+', n - k]);
  await speak('kakek', `${k} di kiri, ${n - k} di kanan. Hitung semua:`);
  await countItems(T.a, 0, k, (i) => i + 1, false); await countItems(T.b, 0, n - k, (i) => k + i + 1, false);
  chime([523, 659, 784]); await speak('kakek', `Tetap ${n}! Cara lain juga boleh, asal jumlahnya ${n}.`); hop(actors.jali, 0.2); await speak('jali', `${n} cucumbers in two baskets!`, 'en');
  return true;
};
const roundOddOne = async () => {
  const n = rand(7, 12); fill(T.a, n);
  const a1 = rand(1, n - 1); let a2 = rand(1, n - 1); while (a2 === a1) a2 = rand(1, n - 1);
  const a3 = rand(1, n - 2); const b3 = n - a3 + (Math.random() < 0.5 ? 1 : -1) * rand(1, 2); const bad = [a3, Math.max(1, b3 === n - a3 ? b3 + 1 : b3)];
  const pairs = shuffle([[a1, n - a1], [a2, n - a2], bad]); const correct = pairs.indexOf(bad);
  eq([n, '=', '?', '+', '?']);
  await speak('kakek', `Kakek membagi ${n} ketimun ke dua keranjang. Mana yang TIDAK cocok?`);
  await speak('kancil', 'Aku bingung. Bantu aku pilih, ya!');
  const r = await askOpt({ options: pairs.map(([x, y]) => ({ label: `${x} dan ${y}` })), correct, onWrong: async (i) => { const [x, y] = pairs[i]; await speak('kakek', `${x} dan ${y}: dari ${x} hitung maju ${y} kali, sampai ${x + y}. Itu cocok dengan ${n}. Cari yang lain.`); } });
  const [x, y] = bad; clearTray(T.a); fill(T.a, x); fill(T.b, y); eq([x, '+', y, '=', x + y]);
  await speak('kakek', `Betul! ${x} dan ${y} jadi ${x + y}, bukan ${n}. Hitung:`);
  await countItems(T.a, 0, x, (i) => i + 1, false); await countItems(T.b, 0, y, (i) => x + i + 1, false);
  await speak('kancil', x + y < n ? `Kurang ${n - (x + y)}! Jadi tidak cocok.` : `Lebih ${(x + y) - n}! Jadi tidak cocok.`); return r.firstTry;
};

const PLAN = [
  [roundJoinGuess, roundJoinFix, roundSepGuess],
  [roundStartJoinGuess, roundStartSepFix, roundStartSepGuess, roundStartJoinFix],
  [roundPartGuess, roundSplitOpen, roundOddOne, roundPartFix],
];

const NAMESR = [['joinGuess', 'joinFix', 'sepGuess'], ['startJoinGuess', 'startSepFix', 'startSepGuess', 'startJoinFix'], ['partGuess', 'splitOpen', 'oddOne', 'partFix']];
/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  await speak('kancil', 'Waktunya istirahat! Ada balon lepas dari gubuk. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = FAST ? 2 : 8;
  await new Promise((done) => {
    for (let i = 0; i < left; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.1 : 3.8;
      b.position.set((Math.random() * 2 - 1) * w, 0.3, portrait ? 1.4 + Math.random() * 0.5 : 0.6 + Math.random() * 0.8); b.scale.setScalar(portrait ? 1.0 : 1.2);
      b.userData = { v: (0.8 + Math.random() * 0.4) / SP, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100 * SP);
  });
  await speak('kancil', 'Seru! Yuk, lanjut panen.');
};

/* ---------- Alur bab ---------- */
let busy = false, phase = 'intro', rounds = 0, didBreak = false, idx = [0, 0, 0];
const intro = async () => {
  await speak('kakek', 'Selamat datang di kebun ketimun Kakek Ramlan! Kancil mau bantu panen?');
  await speak('kancil', 'Mau, Kek! Upahnya ketimun, ya? Tapi aku belum pandai berhitung.');
  await speak('kancil', 'Kamu mau jadi guruku?'); hop(actors.jali, 0.3);
  await speak('jali', 'Garden! Cucumber garden!', 'en');
};
const ending = async () => {
  phase = 'end'; reset(); eq(null);
  await speak('kakek', 'Panen selesai! Terima kasih, Kancil. Ini upahmu: sekeranjang ketimun!');
  for (let i = 0; i < 20; i++) { flyIn(T.a, bedPos()); await wait(90); } await wait(600);
  chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.5); hop(actors.kakek, 0.2);
  await speak('kancil', 'Terima kasih, Kakek! Terima kasih juga, guruku. Sekarang aku bisa mencari angka yang hilang!');
  hop(actors.jali, 0.3); await speak('jali', 'A basket of cucumbers! Thank you!', 'en');
  KK.done(BAB, 'Panen selesai! Kakek Ramlan memberi Kancil sekeranjang ketimun sebagai upah.');
};
const loop = async () => {
  phase = 'play';
  for (;;) {
    const s = KK.load(BAB); drawStage();
    const list = PLAN[s.stage]; const fn = list[idx[s.stage] % list.length]; const fname = NAMESR[s.stage][idx[s.stage] % list.length]; idx[s.stage]++;
    reset(); busy = true; cur = null; curRound = fname;
    let first = false; try { first = await fn(); } catch (e) { console.error(e); }
    const r = first === null ? { advanced: false, stage: KK.load(BAB).stage, finished: false } : KK.record(BAB, !!first, STAGES); drawStage(); rounds++;
    if (r.advanced) { chime([659, 784, 988, 1175]); confetti(); await speak('kakek', r.stage === 1 ? 'Hebat! Sekarang soalnya lebih seru: ketimun disembunyikan di bawah kain.' : 'Hebat! Tahap terakhir: membagi ketimun.'); }
    await wait(500);
    if (r.finished) { busy = false; await ending(); return; }
    if (!didBreak && rounds === 4) { didBreak = true; reset(); await balloonBreak(); }
  }
};
let curRound = '';
const start = async () => {
  const s = KK.load(BAB); if (s.done) KK.save(BAB, { stage: 0, streak: 0, done: false });
  busy = true; await intro(); await loop();
  /* Main lagi: tunggu kartu akhir ditutup, lalu mulai dari awal */
  const iv = setInterval(() => { if (!document.querySelector('.kk-done')) { clearInterval(iv); KK.save(BAB, { stage: 0, streak: 0, done: false }); idx = [0, 0, 0]; loop(); } }, 500);
};

/* ketuk tokoh (hanya saat tidak ada soal yang sedang dibacakan) */
let chat = false;
const onKancil = async () => { if (chat || cur || phase !== 'play') return; chat = true; play('toggle'); hop(actors.kancil); await speak('kancil', pick(['Ketimun Kakek Ramlan renyah sekali!', 'Aku tidak mencuri, aku bekerja. Upahku ketimun!'])); chat = false; };
const onKakek = async () => { if (chat || cur || phase !== 'play') return; chat = true; play('toggle'); hop(actors.kakek, 0.15); await speak('kakek', pick(['Orang-orangan sawah itu penjaga kebun Kakek. Lucu, kan?', 'Ketimun yang besar untuk Warung Bu Murni.'])); chat = false; };
const onJali = async () => { if (chat || phase !== 'play') return; chat = true; play('toggle'); hop(actors.jali, 0.3); await speak('jali', pick(['Cucumber!', 'Basket!', 'Garden!', 'How many?', 'More cucumbers!'])); chat = false; };

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
let started = false;
const go = () => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } start(); };
$('#startBtn').addEventListener('click', go);

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  placeCam();
  const K = actors.kancil, J = actors.jali, S = actors.kakek;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; K.userData.body.scale.y = 1 + Math.sin(t * 2.2) * 0.012; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  if (S) { S.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; S.userData.head.rotation.x = S.userData.talk ? Math.sin(t * 13) * 0.05 : 0; S.userData.body.scale.y = 1 + Math.sin(t * 2) * 0.01; }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > 7) b.userData.end(); }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

/* ---------- Kait tes ---------- */
const answerCorrect = () => {
  if (!cur) return false;
  if (cur.kind === 'line') { const r = document.querySelector('.kk-line input'); const v = cur.answer == null ? Math.round((+r.min + +r.max) / 2) : cur.answer; r.value = v; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); return true; }
  const bs = document.querySelectorAll('.kk-opt'); (bs[cur.answer == null ? 0 : cur.answer] || bs[0]).click(); return true;
};
const answerWrong = () => { if (!cur || cur.kind !== 'ask') return false; const bs = document.querySelectorAll('.kk-opt'); const i = [...bs].findIndex((b, j) => j !== cur.answer); if (i >= 0) bs[i].click(); return i >= 0; };

(async () => {
  fit(); placeCam();
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Kebun gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false; drawStage();
  window.__game = {
    state: () => ({ phase, stage: KK.load(BAB).stage, streak: KK.load(BAB).streak, done: KK.load(BAB).done, asking: cur && cur.kind, answer: cur && cur.answer, round: curRound, rounds, bubble: $('#msg').textContent }),
    answerCorrect, answerWrong, balloonBreak, actors, T, cam,
    popBalloons: () => balloons.slice().forEach(b => b.userData.tap && b.userData.tap()),
  };
  frame();
  if (QS.has('play')) go();
})();
