/* Kota Kancil, Bab 07: Celengan Semut. Penjumlahan dua angka sampai 100 dengan tumpukan sepuluh keping dan keping lepas. */
import * as THREE from 'three';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const SP = QS.has('fast') ? 0.08 : 1; /* tes otomatis boleh mempercepat */
const wait = (ms) => new Promise(r => setTimeout(r, ms * SP));
const BAB = 7, STAGES = 3;
const KK = window.KK;

/* ---------- Simpanan (hanya suara) ---------- */
const KEY = 'kota-kancil-3d-v1';
let D = { sound: true };
try { D = Object.assign(D, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* abaikan */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* abaikan */ } };

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
const camera = new THREE.PerspectiveCamera(28, 1, 1, 400);
const hemi = new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-6, 12, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 7, bottom: -7, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);

const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.01, dur * SP), fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Dunia ---------- */
const TY = 0.62; /* tinggi permukaan meja */
const actors = {}; let tableObj = null, piggy = null, toy = null, rainObj = null, umb = null;
const labels = {};
const buildWorld = () => {
  world.add(B.veranda());
  tableObj = B.table(4.6, 2.8, TY); tableObj.position.set(0, 0, -0.1); world.add(tableObj);
  piggy = B.celengan(); piggy.scale.setScalar(1.25); world.add(piggy); tap(piggy, onPiggy);
  const nen = B.warga({ kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }); world.add(nen); actors.nenek = nen; tap(nen, onNenek);
  const se = B.semut(); world.add(se); actors.semut = se; tap(se, onSemut);
  const be = B.belalang(); world.add(be); actors.belalang = be; tap(be, onBelalang);
  const k = B.kancil(); world.add(k); actors.kancil = k; tap(k, onKancil);
  const post = new THREE.Group(); post.add(B.cyl(0.07, 0.09, 1.25, B.PAL.woodDark, [0, 0.62, 0], 10)); post.add(B.box(0.75, 0.1, 0.16, B.PAL.wood, [0, 1.25, 0])); world.add(post); actors.post = post;
  const j = B.jali(); world.add(j); actors.jali = j; tap(j, onJali);
  toy = B.gasing(); toy.visible = false; world.add(toy);
  umb = B.umbrella(); umb.visible = false; world.add(umb);
  for (const z of ['A', 'B']) { const s = B.numSprite(); s.visible = false; world.add(s); labels[z] = s; }
  labels.T = B.numSprite(); labels.T.visible = false; world.add(labels.T);
  rainObj = B.rain(); world.add(rainObj);
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0xa6dcea })); bg.rotation.x = -Math.PI / 2; bg.position.y = -1.2; world.add(bg);
};

/* ---------- Tata letak keping ---------- */
/* Zona A (belakang) dan B (depan). Puluhan: 5 per baris di kiri. Satuan: bingkai 2×5 di kanan, bingkai kedua di depannya. */
const ZONE = { A: { x0: -1.2, z0: -1.05 }, B: { x0: -1.2, z0: 0.35 } };
const DT = 0.33, DO = 0.27, OX = 1.75;
const slot = (zone, kind, i) => { const Z = ZONE[zone]; return kind === 't' ? new THREE.Vector3(Z.x0 + (i % 5) * DT, TY, Z.z0 + Math.floor(i / 5) * DT) : new THREE.Vector3(Z.x0 + OX + (i % 5) * DO, TY + B.COIN.h / 2, Z.z0 + Math.floor(i / 5) * DO + (i >= 10 ? 0.12 : 0)); };
const Z = { A: { t: [], o: [] }, B: { t: [], o: [] } };
const COL = { semut: 0xd9a441, baru: 0xf2d16b, pinjam: 0x8fc6e8 };
const makeStack = (colors) => { const g = new THREE.Group(); for (let i = 0; i < 10; i++) { const c = B.coin(colors ? colors[i] : COL.semut); c.position.y = B.COIN.h / 2 + i * (B.COIN.h + 0.003); g.add(c); } const b = B.band(); b.position.y = 0.24; g.add(b); g.userData.isStack = true; return g; };
const popIn = (o) => { const s = o.scale.x || 1; o.scale.setScalar(0.01); return tween(0.25, (t) => o.scale.setScalar(Math.max(0.01, t * s))); };
const clearCoins = () => { for (const z of ['A', 'B']) { for (const o of [...Z[z].t, ...Z[z].o]) world.remove(o); Z[z].t = []; Z[z].o = []; labels[z].visible = false; } labels.T.visible = false; toy.visible = false; };
const showNum = async (zone, n, color = COL.semut, label = true) => {
  const t = Math.floor(n / 10), o = n % 10;
  for (let i = 0; i < t; i++) { const s = makeStack(); s.position.copy(slot(zone, 't', Z[zone].t.length)); world.add(s); Z[zone].t.push(s); popIn(s); play('placement-a', 0.9 + i * 0.05); await wait(70); }
  for (let i = 0; i < o; i++) { const c = B.coin(color); c.position.copy(slot(zone, 'o', Z[zone].o.length)); world.add(c); Z[zone].o.push(c); popIn(c); await wait(50); }
  if (label) setLabel(zone, String(n));
  await wait(250);
};
const setLabel = (zone, text, bg) => { const L = labels[zone]; L.userData.set(text, bg); const Zn = ZONE[zone]; L.position.set(Zn.x0 - 0.62, TY + 0.32, Zn.z0 + 0.2); L.visible = true; };
const fly = (o, to, h = 0.5, dur = 0.5) => { const from = o.position.clone(); return tween(dur, (t) => { o.position.lerpVectors(from, to, t); o.position.y += Math.sin(t * Math.PI) * h; }); };
const relayout = (zone) => Promise.all([...Z[zone].t.map((o, i) => fly(o, slot(zone, 't', i), 0.1, 0.3)), ...Z[zone].o.map((o, i) => fly(o, slot(zone, 'o', i), 0.1, 0.3))]);
/* Gabungkan B ke A: puluhan dengan puluhan, satuan dengan satuan */
const merge = async () => {
  const jobs = [];
  Z.B.t.forEach((o) => { jobs.push(fly(o, slot('A', 't', Z.A.t.length), 0.6, 0.7)); Z.A.t.push(o); });
  Z.B.o.forEach((o) => { jobs.push(fly(o, slot('A', 'o', Z.A.o.length), 0.5, 0.7)); Z.A.o.push(o); });
  Z.B.t = []; Z.B.o = []; labels.B.visible = false; labels.A.visible = false; play('placement-b');
  await Promise.all(jobs);
};
/* Tukar: sepuluh keping lepas naik, bertumpuk, diikat pita, jadi satu tumpukan puluhan */
const exchange = async (zone = 'A') => {
  if (Z[zone].o.length < 10) return false;
  const ten = Z[zone].o.splice(0, 10); const to = slot(zone, 't', Z[zone].t.length);
  ten.forEach(o => { o.userData.glow = true; });
  await Promise.all(ten.map((o, i) => tween(0.18, (t) => { o.position.y = slot(zone, 'o', i).y + t * 0.25; })));
  await Promise.all(ten.map((o, i) => { const tgt = to.clone(); tgt.y = TY + B.COIN.h / 2 + i * (B.COIN.h + 0.003); return wait(i * 40).then(() => fly(o, tgt, 0.35, 0.45)); }));
  const colors = ten.map(o => o.children[0].material.color.getHex());
  ten.forEach(o => world.remove(o));
  const s = makeStack(colors); s.position.copy(to); world.add(s); Z[zone].t.push(s);
  const b = s.children[10]; b.scale.setScalar(0.01); chime([660, 880]); play('placement-c', 1.2);
  await tween(0.3, (t) => b.scale.setScalar(Math.max(0.01, t)));
  await tween(0.35, (t) => { s.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.25); }, (t) => t);
  await relayout(zone);
  return true;
};
const bounceObj = (o, amt = 0.12) => { const y0 = o.position.y; return tween(0.3, (t) => { o.position.y = y0 + Math.sin(t * Math.PI) * amt; }, (t) => t).then(() => { o.position.y = y0; }); };
/* Hitung zona: tumpukan disebut per sepuluh, keping lepas dilanjutkan satu-satu di kartu */
const countZone = async (zone = 'A', start = 0) => {
  let n = start;
  for (const s of Z[zone].t) { n += 10; bounceObj(s, 0.2); setAns(n); play('placement-a', 0.8 + n / 200); await say(String(n)); }
  for (const c of Z[zone].o) { n += 1; bounceObj(c, 0.14); setAns(n); chime([500 + (n % 10) * 40]); await wait(330); }
  return n;
};

/* ---------- Kartu soal & gelembung ---------- */
const sumEl = $('#sum');
const setSum = (html) => { sumEl.innerHTML = html; sumEl.hidden = !html; };
const plus = (a, b, ans = '?', cls = 'q') => setSum(`<b>${a}</b><i>+</i><b>${b}</b><i>=</i><b class="${cls}" id="ans">${ans}</b>`);
const setAns = (v, cls) => { const e = $('#ans'); if (e) { e.textContent = v; if (cls) e.className = cls; } };
const bubble = $('#bubble');
const NAMES = { kancil: 'Kancil', jali: 'Jali', semut: 'Semut', belalang: 'Belalang', nenek: 'Nenek Gabe' };
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};

/* ---------- Pilihan (dibungkus agar tes bisa menjawab) ---------- */
let cur = null; /* {correct} soal yang sedang tampil */
const ask = async (o) => { cur = { correct: o.correct, kind: 'ask' }; const r = await KK.ask(o); cur = null; return r; };
const line = async (o) => { cur = { kind: 'line' }; const r = await KK.line(o); cur = null; return r; };
const lineRange = (n) => { const t = Math.floor(n / 10) * 10; return { min: Math.max(0, t - 10), max: Math.min(100, t + 20) }; };

/* ---------- Pembangkit soal ---------- */
const genAdd = (regroup, onesFrom = 1) => {
  for (;;) {
    const at = rand(1, 6), bt = rand(1, 5), a1 = rand(onesFrom, 9), b1 = rand(1, 9);
    if (regroup ? (a1 + b1 < 10 || at + bt > 8) : (a1 + b1 > 9 || at + bt > 9)) continue;
    return [at * 10 + a1, bt * 10 + b1];
  }
};
const optsFor = (s, wrong) => { const set = [s, ...wrong].filter((v, i, a) => v > 0 && v < 1000 && a.indexOf(v) === i).slice(0, 3); while (set.length < 3) { const v = s + pick([-10, 10, -1, 1, 11, -11]); if (v > 0 && !set.includes(v)) set.push(v); } const o = shuffle(set); return { options: o.map(String), correct: o.indexOf(s), vals: o }; };

/* ---------- Mesin 1: tebak dulu, lalu cek ---------- */
const qGuess = async (regroup) => {
  state.q = 'guess';
  const [a, b] = genAdd(regroup); const s = a + b;
  clearCoins(); plus(a, b);
  await speak('nenek', pick([`Semut menabung ${a} keping. Hari ini Semut dapat ${b} keping lagi.`, `Di meja ada ${a} keping dan ${b} keping. Semut mau tahu jumlahnya.`]));
  await showNum('A', a); await showNum('B', b, COL.baru);
  await speak('kancil', `${a} tambah ${b}, berapa ya? Tebak dulu, Guru!`);
  const g = await line({ ...lineRange(s), step: 1, start: lineRange(s).min });
  await speak('kancil', `Tebakanmu ${g}. Ayo kita cek dengan keping!`);
  await speak('semut', 'Tumpukan dengan tumpukan. Keping lepas dengan keping lepas.');
  await merge();
  if (Z.A.o.length >= 10) { await speak('semut', `Keping lepasnya ${Z.A.o.length}. Sepuluh keping kita ikat jadi satu tumpukan!`); await exchange(); }
  setAns('…', 'q'); await countZone('A'); setLabel('A', String(s), '#dff3d6');
  await speak('kancil', Math.abs(g - s) <= 3 ? `${s}! Tebakanmu dekat sekali. Mengecek itu hebat!` : `${s}! Kita sudah mengecek, jadi kita tahu pasti.`);
  plus(a, b); const o = optsFor(s, [s - 10, s + 10, Math.floor(s % 10) * 10 + Math.floor(s / 10)]);
  await speak('kancil', `Jadi ${a} tambah ${b} sama dengan?`);
  const r = await ask({ options: o.options, correct: o.correct, onWrong: async (i) => { const v = o.vals[i]; await speak('semut', v === s - 10 ? `Hitung tumpukannya lagi: ada ${Math.floor(s / 10)} tumpukan, jadi ${Math.floor(s / 10) * 10}.` : v === s + 10 ? `Coba hitung tumpukannya. Hanya ${Math.floor(s / 10)} tumpukan.` : `Tumpukan itu puluhan, disebut dulu. ${Math.floor(s / 10)} tumpukan dan ${s % 10} keping.`); Z.A.t.forEach(t => bounceObj(t, 0.2)); } });
  setAns(s, 'ok'); chime([523, 659, 784]);
  return r.firstTry;
};

/* ---------- Mesin 2: betulkan Kancil ---------- */
const qFixStacks = async () => { /* tahap 1: Kancil menghitung tumpukan sebagai satu keping */
  state.q = 'fixStacks';
  const [a, b] = genAdd(false); const s = a + b; const t = Math.floor(s / 10), o1 = s % 10; const wrong = t + o1;
  clearCoins(); plus(a, b);
  await speak('nenek', `Kancil mau mencoba sendiri. ${a} tambah ${b}.`);
  await showNum('A', a); await showNum('B', b, COL.baru); await merge();
  await speak('kancil', `Aku hitung: ${Array.from({ length: t }, (_, i) => i + 1).join(', ')} tumpukan... lalu keping lepasnya. Jumlahnya ${wrong}!`);
  setAns(wrong + '?', 'bad');
  await speak('kancil', 'Benar tidak, Guru? Pilih jawaban yang benar.');
  const op = optsFor(s, [wrong, o1 * 10 + t]);
  const r = await ask({ options: op.options, correct: op.correct, onWrong: async (i) => {
    if (op.vals[i] === wrong) { await speak('semut', 'Satu tumpukan bukan satu keping. Satu tumpukan berisi sepuluh keping!'); await bounceObj(Z.A.t[0], 0.3); }
    else await speak('semut', `Tumpukan itu puluhan. ${t} tumpukan = ${t * 10}. Lalu ${o1} keping.`);
  } });
  setAns('…', 'q'); await countZone('A'); setAns(s, 'ok');
  await speak('kancil', `Oh, satu tumpukan itu sepuluh! ${a} tambah ${b} = ${s}. Terima kasih, Guru!`);
  return r.firstTry;
};
const qFixForget = async () => { /* tahap 2-3: Kancil lupa menukar sepuluh keping lepas */
  state.q = 'fixForget';
  const [a, b] = genAdd(true); const s = a + b; const t = Math.floor(a / 10) + Math.floor(b / 10), ones = (a % 10) + (b % 10);
  const v513 = Math.random() < 0.5; const wrong = v513 ? Number(`${t}${ones}`) : t * 10 + (ones % 10);
  clearCoins(); plus(a, b);
  await speak('nenek', `Sekarang Kancil menghitung ${a} tambah ${b}.`);
  await showNum('A', a); await showNum('B', b, COL.baru); await merge();
  await speak('kancil', v513 ? `${t} tumpukan, ${ones} keping. Kutulis ${t} lalu ${ones}: ${wrong}!` : `${t} tumpukan... dan keping lepasnya ${ones % 10}. Jadi ${wrong}!`);
  setAns(wrong + '?', 'bad');
  await speak('kancil', 'Benar tidak, Guru? Pilih jawaban yang benar.');
  const op = optsFor(s, [wrong, v513 ? t * 10 + (ones % 10) : Number(`${t}${ones}`)]);
  const r = await ask({ options: op.options, correct: op.correct, onWrong: async (i) => {
    const v = op.vals[i];
    if (v > 100) await speak('semut', `${v} itu banyak sekali, lebih dari seratus! Lihat, ada ${ones} keping lepas. Sepuluh keping harus diikat dulu jadi satu tumpukan.`);
    else if (v === t * 10 + (ones % 10)) await speak('semut', `Jangan lupa: ${ones} keping lepas itu lebih dari sepuluh. Sepuluh keping diikat jadi satu tumpukan lagi.`);
    else await speak('semut', `Ikat dulu sepuluh keping, lalu hitung tumpukannya.`);
    Z.A.o.slice(0, 10).forEach((c, k) => wait(k * 40).then(() => bounceObj(c, 0.18)));
  } });
  await speak('semut', 'Ayo kita tukar: sepuluh keping lepas jadi satu tumpukan!');
  await exchange(); setAns('…', 'q'); await countZone('A'); setAns(s, 'ok');
  await speak('kancil', `Oh, aku lupa menukar! ${a} tambah ${b} = ${s}. Terima kasih, Guru!`);
  return r.firstTry;
};

/* ---------- Mesin 3: dua cara (Semut memisah, Belalang membulatkan) ---------- */
const qTwoWays = async () => {
  state.q = 'twoWays';
  const [a, b] = genAdd(true, 8); const s = a + b; const at = Math.floor(a / 10) * 10, a1 = a % 10, bt = Math.floor(b / 10) * 10, b1 = b % 10; const k = 10 - a1; const up = a + k;
  clearCoins(); plus(a, b);
  await speak('nenek', `Semut dan Belalang menghitung ${a} tambah ${b} dengan cara berbeda.`);
  await showNum('A', a); await showNum('B', b, COL.baru);
  await speak('semut', `Caraku: pisah puluhan dan satuan. ${at} tambah ${bt} = ${at + bt}.`);
  await merge(); setSum(`<b>${at}</b><i>+</i><b>${bt}</b><i>=</i><b>${at + bt}</b><i>·</i><b>${a1}</b><i>+</i><b>${b1}</b><i>=</i><b>${a1 + b1}</b>`);
  await speak('semut', `${a1} tambah ${b1} = ${a1 + b1}. Sepuluh kuikat jadi tumpukan.`); await exchange();
  setSum(`<b>${at + bt}</b><i>+</i><b>${a1 + b1}</b><i>=</i><b class="ok">${s}</b>`);
  await speak('semut', `${at + bt} tambah ${a1 + b1} = ${s}.`);
  /* cara Belalang */
  clearCoins(); plus(a, b); await showNum('A', a); await showNum('B', b, COL.baru);
  await speak('belalang', `Caraku: pinjam ${k} keping dari celengan, ${a} jadi ${up}.`);
  const p = piggy.position.clone(); p.y += 1.3;
  const borrowed = [];
  for (let i = 0; i < k; i++) { const c = B.coin(COL.pinjam); c.position.copy(p); world.add(c); borrowed.push(c); Z.A.o.push(c); await fly(c, slot('A', 'o', Z.A.o.length - 1), 0.8, 0.5); play('placement-a', 1.3); }
  setLabel('A', String(up), '#dbeefa');
  await speak('belalang', `Bingkainya penuh, sepuluh keping. Jadi ${up}. ${up} tambah ${b} = ${up + b}.`);
  await merge(); setSum(`<b>${up}</b><i>+</i><b>${b}</b><i>=</i><b>${up + b}</b>`);
  await speak('belalang', `Tapi tadi aku pinjam ${k} keping biru. Sekarang bagaimana?`);
  const opts = [`${up + b} − ${k}`, `${up + b} + ${k}`, `${up + b}`]; const order = shuffle([0, 1, 2]);
  const r = await ask({ options: order.map(i => opts[i]), correct: order.indexOf(0), onWrong: async (i) => {
    const w = order[i]; await speak('nenek', w === 1 ? `Kalau ditambah lagi, kepingnya makin banyak. Keping pinjaman harus dikembalikan, jadi dikurangi ${k}.` : `Keping biru itu milik celengan. Kembalikan dulu ${k} keping, jadi dikurangi.`);
    borrowed.forEach(c => bounceObj(c, 0.25));
  } });
  await speak('belalang', `Kukembalikan ${k} keping biru ke celengan.`);
  for (const c of borrowed) { const i = Z.A.o.indexOf(c); if (i >= 0) Z.A.o.splice(i, 1); await fly(c, p, 0.6, 0.45); world.remove(c); play('placement-b', 1.2); }
  await relayout('A'); await exchange();
  setSum(`<b>${up + b}</b><i>−</i><b>${k}</b><i>=</i><b class="ok">${s}</b>`);
  await speak('belalang', `${up + b} kurang ${k} = ${s}.`);
  hop(actors.semut); hop(actors.belalang);
  await speak('nenek', `Dua cara, jawabannya sama: ${s}! Kamu suka cara siapa?`);
  const ch = await ask({ options: [{ label: 'Semut', small: 'pisah puluhan' }, { label: 'Belalang', small: 'bulatkan dulu' }], correct: null, cols: 2 });
  await speak(ch.index ? 'belalang' : 'semut', ch.index ? 'Membulatkan ke puluhan itu cepat. Jangan lupa mengembalikan pinjamannya!' : 'Memisah puluhan dan satuan itu rapi. Tidak ada yang tertinggal!');
  return r.firstTry;
};

/* ---------- Tahap 3: menabung menuju sasaran ---------- */
const qGoal = async () => {
  state.q = 'goal';
  let have, target; do { have = rand(31, 68); target = (Math.floor(have / 10) + rand(2, 3)) * 10; } while (have % 10 === 0 || target > 90);
  const d = target - have, h1 = have % 10, fill = 10 - h1;
  clearCoins(); setSum(`<b>${have}</b><i>+</i><b class="q" id="ans">?</b><i>=</i><b>${target}</b>`);
  toy.visible = true; toy.position.set(ZONE.B.x0 + 0.45, TY, ZONE.B.z0 + 0.3); toy.scale.setScalar(0.9);
  labels.T.userData.set(String(target), '#ffe3d6'); labels.T.position.set(ZONE.B.x0 - 0.62, TY + 0.32, ZONE.B.z0 + 0.2); labels.T.visible = true;
  await showNum('A', have);
  await speak('nenek', `Semut punya ${have} keping. Semut ingin gasing seharga ${target} keping.`);
  hop(actors.jali, 0.2); await speak('jali', 'How much?');
  await speak('kancil', `Kurang berapa keping lagi? Tebak dulu!`);
  const g = await line({ ...lineRange(d), step: 1, start: lineRange(d).min });
  await speak('semut', `Tebakanmu ${g}. Ayo kita isi celengannya sampai ${target}!`);
  let added = 0; const p = piggy.position.clone(); p.y += 1.3;
  for (let i = 0; i < fill; i++) { const c = B.coin(COL.baru); c.position.copy(p); world.add(c); Z.A.o.push(c); await fly(c, slot('A', 'o', Z.A.o.length - 1), 0.7, 0.4); added++; setAns(added); chime([520 + i * 40]); }
  await speak('semut', `Tambah ${fill} keping, bingkainya penuh: jadi ${have + fill}.`); await exchange();
  let n = have + fill;
  while (n < target) { const s = makeStack(Array(10).fill(COL.baru)); s.position.copy(p); world.add(s); Z.A.t.push(s); await fly(s, slot('A', 't', Z.A.t.length - 1), 0.8, 0.5); n += 10; added += 10; setAns(added); play('placement-a', 0.9); await say(String(n)); }
  setLabel('A', String(target), '#dff3d6');
  await speak('semut', `Sampai ${target}! Yang ditambah: ${fill} keping dan ${(d - fill) / 10} tumpukan.`);
  setSum(`<b>${have}</b><i>+</i><b class="q" id="ans">?</b><i>=</i><b>${target}</b>`);
  await speak('kancil', `Jadi Semut kurang berapa keping?`);
  const op = optsFor(d, [d + 10, d - 10 > 0 ? d - 10 : d + 1, Number(`${Math.floor(target / 10) - Math.floor(have / 10)}${h1}`)]);
  const r = await ask({ options: op.options, correct: op.correct, onWrong: async (i) => { await speak('semut', `Hitung yang kita tambahkan saja: ${fill} keping lepas, lalu ${(d - fill) / 10} tumpukan. ${fill} tambah ${d - fill}.`); } });
  setAns(d, 'ok'); chime([523, 659, 784]);
  await speak('nenek', Math.abs(g - d) <= 3 ? `Benar, ${d}! Tebakanmu juga dekat. Sedikit demi sedikit, lama-lama jadi bukit.` : `Benar, ${d}! Mengecek membuat kita yakin. Sedikit demi sedikit, lama-lama jadi bukit.`);
  return r.firstTry;
};
const NEEDS = [
  { e: '☂️', n: 'payung', need: true, why: 'Musim hujan datang. Payung menjaga kita tetap kering.' },
  { e: '🍚', n: 'beras', need: true, why: 'Kita perlu makan setiap hari.' },
  { e: '🧥', n: 'jaket', need: true, why: 'Saat hujan dingin, jaket membuat kita hangat.' },
  { e: '🪁', n: 'layang-layang baru', need: false, why: 'Layang-layang memang seru. Tapi tanpa itu kita tetap sehat.' },
  { e: '🍭', n: 'permen', need: false, why: 'Permen enak, tapi tubuh kita tidak membutuhkannya.' },
  { e: '🧸', n: 'boneka baru', need: false, why: 'Boneka baru menyenangkan. Tapi itu keinginan, bukan kebutuhan.' },
];
let lastNeed = -1;
const qNeedWant = async () => {
  state.q = 'needWant';
  let i; do { i = rand(0, NEEDS.length - 1); } while (i === lastNeed); lastNeed = i; const it = NEEDS[i];
  clearCoins(); setSum(`<span class="big">${it.e}</span>`);
  if (it.n === 'payung') { umb.visible = true; umb.position.set(0.4, TY, -0.4); }
  await speak('nenek', `Musim hujan hampir tiba. Semut berpikir dulu sebelum memakai tabungannya.`);
  await speak('semut', `${it.n[0].toUpperCase() + it.n.slice(1)}: aku butuh, atau aku hanya ingin?`);
  await speak('kancil', 'Butuh di kiri, ingin di kanan.');
  const r = await ask({ options: [{ label: 'Butuh', small: 'harus ada' }, { label: 'Ingin', small: 'mau saja' }], correct: it.need ? 0 : 1, cols: 2, onWrong: async () => { await speak('nenek', it.why + ' Coba pilih lagi.'); } });
  umb.visible = false;
  await speak('nenek', `${it.need ? 'Butuh' : 'Ingin'}. ${it.why}`);
  return r.firstTry;
};

/* ---------- Urutan ---------- */
const ENG = [
  [() => qGuess(false), qFixStacks, () => qGuess(false)],
  [() => qGuess(true), qFixForget, qTwoWays],
  [qGoal, qNeedWant, qFixForget, qGoal, () => qGuess(true)],
];
const STAGE_INTRO = [
  async () => { await speak('nenek', 'Tahap pertama: gabungkan tumpukan dengan tumpukan, keping dengan keping.'); },
  async () => { await speak('nenek', 'Sekarang keping lepasnya bisa lebih dari sepuluh. Sepuluh keping kita ikat jadi satu tumpukan!'); await speak('jali', 'Coin! Ten coins.'); },
  async () => { await speak('nenek', 'Semut mau menabung untuk gasing. Ayo bantu Semut menghitung kurangnya!'); await speak('jali', 'Save! Save your coins.'); },
];
const chip = () => { const s = KK.load(BAB); $('#stage').textContent = `Tahap ${s.stage + 1}/3`; };
let breakDone = false, qi = 0;
const state = { phase: 'loading' };
const run = async () => {
  state.phase = 'intro'; const wasDone = KK.load(BAB).done;
  await speak('nenek', 'Halo, Cucu! Ini celengan ayam Nenek. Dengar ceritanya, ya.');
  hop(actors.semut, 0.2); await speak('nenek', 'Semut rajin menabung, sedikit demi sedikit. Belalang suka bermain.');
  hop(actors.jali, 0.2); await speak('jali', 'Ant! The ant saves coins.');
  await speak('kancil', 'Aku belum pandai menghitung keping. Kamu jadi guruku, ya!');
  await STAGE_INTRO[KK.load(BAB).stage]();
  state.phase = 'play';
  for (;;) {
    const st = KK.load(BAB).stage; chip();
    const q = ENG[st][qi % ENG[st].length]; qi++;
    const first = await q();
    const before = KK.load(BAB); const r = KK.record(BAB, first, STAGES); chip();
    if (first) { hop(actors.kancil, 0.35); chime([523, 659, 784, 1047]); confetti(); }
    await wait(600);
    const replayEnd = wasDone && before.stage === STAGES - 1 && first && before.streak === 2;
    if (r.finished || replayEnd) { await ending(); return; }
    if (r.advanced) {
      qi = 0;
      if (!breakDone) { breakDone = true; clearCoins(); setSum(''); await balloonBreak(); }
      await STAGE_INTRO[r.stage]();
    }
  }
};
const ending = async () => {
  state.phase = 'ending'; clearCoins(); setSum('<span class="big">🐔</span>'); KK.clear();
  await speak('nenek', 'Hari demi hari, Semut menabung. Celengan ayam pun penuh!');
  const p = piggy.position.clone(); p.y += piggy.scale.x * piggy.userData.slotY;
  for (let i = 0; i < 12; i++) { const c = B.coin(pick([COL.semut, COL.baru])); c.position.set(p.x + (Math.random() - 0.5) * 2, p.y + 1.5, p.z + 1); world.add(c); fly(c, p, 0.4, 0.5).then(() => world.remove(c)); play('placement-a', 1 + i * 0.04); await wait(140); }
  await tween(0.4, (t) => piggy.scale.setScalar(1.25 * (1 + Math.sin(t * Math.PI) * 0.15)), (t) => t); chime([523, 659, 784, 1047]);
  rainObj.visible = true; hemi.intensity = 0.9; sun.intensity = 1.6;
  hop(actors.jali, 0.2); await speak('jali', 'Rain! It is raining.');
  await speak('nenek', 'Musim hujan datang. Belalang kedinginan dan tidak punya tabungan.');
  await speak('semut', 'Belalang, ayo masuk! Aku berbagi bijiku denganmu.');
  hop(actors.semut, 0.3); hop(actors.belalang, 0.3);
  await speak('belalang', 'Terima kasih, Semut! Ajari aku menabung, ya.');
  await speak('jali', 'Share! Ant and grasshopper share.');
  await speak('nenek', 'Sedikit demi sedikit, lama-lama jadi bukit. Dan yang punya, berbagi.');
  confetti(); state.phase = 'done';
  KK.done(BAB, 'Celengan penuh! Semut berbagi dan mengajari Belalang menabung di musim hujan.');
};

/* ---------- Ketukan tokoh (petunjuk singkat) ---------- */
let tapBusy = false;
const chat = (fn) => async () => { if (tapBusy || state.phase === 'loading') return; tapBusy = true; play('toggle'); try { await fn(); } finally { tapBusy = false; } };
const onPiggy = chat(async () => { await bounceObj(piggy, 0.15); await speak('nenek', 'Celengan ayam dari tanah liat. Isinya keping tabungan.'); });
const onNenek = chat(async () => { hop(actors.nenek, 0.15); await speak('nenek', 'Sepuluh keping lepas = satu tumpukan. Ingat itu, Cucu!'); });
const onSemut = chat(async () => { hop(actors.semut); await speak('semut', 'Tumpukan dulu, lalu keping lepas.'); });
const onBelalang = chat(async () => { hop(actors.belalang); await speak('belalang', 'Aku suka membulatkan ke puluhan!'); });
const onKancil = chat(async () => { hop(actors.kancil); await speak('kancil', 'Ajari aku, ya. Aku masih sering lupa menukar.'); });
const onJali = chat(async () => { hop(actors.jali, 0.3); await speak('jali', pick(['Coin!', 'Save!', 'Ant!'])); });

/* ---------- Balon (jeda) ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  state.phase = 'balloon';
  await speak('kancil', 'Waktunya istirahat! Ada balon lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; const portrait = innerWidth / innerHeight < 0.9; let left = 8;
  await new Promise((done) => {
    for (let i = 0; i < 8; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.6 : 3.4;
      b.position.set((Math.random() * 2 - 1) * w, 0.9, 0.6 + Math.random() * 0.8); b.scale.setScalar(portrait ? 1.0 : 1.2);
      b.userData = { v: (0.8 + Math.random() * 0.4) / SP, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1000 * SP);
  });
  await speak('kancil', 'Seru, ya! Yuk, lanjut mengajariku.');
  state.phase = 'play';
};
const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Kamera & tata letak lanskap/potret ---------- */
const cam = { az: 0, el: 0.7, target: new THREE.Vector3(0, TY, 0), azGoal: 0, dist: 12 };
/* posisi [x, z, rotY, skala] */
const LAND = { piggy: [-3.0, -2.3, 0.9, 1.15], nenek: [2.3, -2.4, -0.3, 1.3], semut: [-3.35, 1.6, 0.35, 1.05], belalang: [3.2, 1.25, -0.35, 1.05], kancil: [-4.2, -0.15, -0.7, 1.05], post: [3.6, -0.6, 0, 1], jali: [3.6, -0.6, -2.4, 1.2] };
const PORT = { piggy: [-1.75, -2.2, 1.0, 1.0], nenek: [-0.15, -2.75, 0, 1.1], semut: [-1.75, 1.7, 0.3, 0.85], belalang: [1.75, 1.65, -0.3, 0.85], kancil: [1.25, -2.3, -2.2, 0.95], post: [2.1, -3.1, 0, 0.8], jali: [2.1, -3.1, -2.0, 1.0] };
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  const portrait = w / h < 0.9;
  camera.fov = portrait ? 34 : 28; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 2.55 : 5.0, needH = portrait ? 3.2 : 2.9;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = portrait ? 0.92 : 0.72; cam.target.set(0, TY, portrait ? 0.85 : 0.75); cam.az = cam.azGoal = 0;
  const P = portrait ? PORT : LAND;
  const place = (o, [x, z, ry, s]) => { if (!o) return; o.position.x = x; o.position.z = z; o.rotation.y = ry; o.scale.setScalar(s); };
  place(piggy, P.piggy); for (const k of ['nenek', 'semut', 'belalang', 'kancil', 'post', 'jali']) place(actors[k], P[k]);
  if (actors.jali && actors.post) actors.jali.position.y = 1.3 * actors.post.scale.x + 0.02;
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, az: cam.azGoal, moved: false }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* abaikan */ } });
canvas.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 18) down.moved = true; if (down.moved) cam.azGoal = Math.max(-0.4, Math.min(0.4, down.az - dx * 0.004)); });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || d.moved) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent && o.visible !== false), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
let started = false;
const start = () => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } run().catch(e => { console.error(e); }); };
$('#startBtn').addEventListener('click', start);

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  cam.az += (cam.azGoal - cam.az) * 0.12; placeCam();
  const K = actors.kancil, J = actors.jali;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  for (const k of ['semut', 'belalang', 'nenek']) { const a = actors[k]; if (!a) continue; a.userData.head.rotation.z = Math.sin(t * 1.2 + k.length) * 0.05 + (a.userData.talk ? Math.sin(t * 14) * 0.06 : 0); if (a.userData.ant) a.userData.ant.forEach((x, i) => { x.rotation.x = Math.sin(t * 3 + i) * 0.15; }); }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > 7) b.userData.end(); }
  if (rainObj.visible) rainObj.children.forEach(r => { r.position.y -= dt * r.userData.v; if (r.position.y < 0) r.position.y = 6; });
  if (toy && toy.visible) toy.rotation.y = t * 1.5;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

addEventListener('error', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + e.message; });
addEventListener('unhandledrejection', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + (e.reason && e.reason.message || e.reason); });
(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { buildWorld(); } catch (e) { $('#loading').textContent = 'Beranda gagal dimuat: ' + (e && e.message || e); throw e; }
  if (!KK) { $('#loading').textContent = 'Berkas kit belum termuat. Tutup lalu buka lagi.'; return; }
  fit(); chip();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false; state.phase = 'ready';
  window.__game = {
    state: () => ({ ...state, stage: KK.load(BAB).stage, streak: KK.load(BAB).streak, done: KK.load(BAB).done, sheet: cur ? cur.kind : null, A: Z.A.t.length * 10 + Z.A.o.length, B: Z.B.t.length * 10 + Z.B.o.length }),
    answerCorrect: () => { if (!cur) return false; if (cur.kind === 'line') { document.querySelector('.kk-line .kk-ok').click(); return true; } const b = document.querySelectorAll('.kk-sheet .kk-opt'); b[cur.correct == null ? 0 : cur.correct].click(); return true; },
    answerWrong: () => { if (!cur || cur.kind !== 'ask' || cur.correct == null) return false; const b = document.querySelectorAll('.kk-sheet .kk-opt'); b[(cur.correct + 1) % b.length].click(); return true; },
    popBalloons: () => { balloons.slice().forEach(b => b.userData.tap && b.userData.tap()); },
    actors, world, start, balloonBreak, ending,
  };
  if (QS.has('play')) start();
  frame();
})();
