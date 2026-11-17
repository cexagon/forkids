/* Kota Kancil, Bab 04: Labu Bawang Putih. Membandingkan, selisih sampai 20, kembar dan hampir kembar.
   Anak menjadi guru bagi Kancil. Isi labu dijajarkan berpasangan satu-satu di halaman Nenek Gabe. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const T = QS.has('fast') ? 0.06 : 1; /* tes otomatis: semua jeda dipercepat */
const wait = (ms) => new Promise(r => setTimeout(r, ms * T));
const BAB = 4, STAGES = 3;

/* ---------- Simpanan (hanya suara; kemajuan lewat KK) ---------- */
const KEY = 'kota-kancil-3d-v1';
let D = { sound: true };
try { D = Object.assign(D, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* abaikan */ }
const save = () => { try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); all.sound = D.sound; localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* abaikan */ } };

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
/* hitung bersuara: satu angka, tidak menunggu terlalu lama */
const num = (n) => Promise.race([say(String(n)), wait(D.sound ? 850 : 480)]);
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
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-7, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const loader = new GLTFLoader(); const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync(`../pasar3d/models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace; o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.01, dur * T), fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Warna dan tokoh ---------- */
const COL = { red: 0xe0453a, blue: 0x2f7fd6, orange: 0xf08a2a, orange2: 0xf5a83a, green: 0x6aa84f };
const NAMES = { kancil: 'Kancil', jali: 'Jali', nenek: 'Nenek Gabe', merah: 'Bawang Merah', putih: 'Bawang Putih' };
const actors = {}; let jaliPost = null, houseG = null, tikar = null;

/* ---------- Tata letak (lanskap / potret) ---------- */
let P = false, L = {};
const params = () => P
  ? { pz: 0, px: { 1: [0], 2: [-0.62, 0.62], 3: [-0.85, 0, 0.85], 4: [-1.08, -0.36, 0.36, 1.08] }, ps: { 1: 0.62, 2: 0.62, 3: 0.6, 4: 0.46 }, s: 0.23, r: 0.085, z0: 0.6, d: 0.3, g: 0.16, ox: 0.1, gz0: 0.42, gs: 0.165, gr: 0.06, bs: 0.26,
    act: { nenek: [0, -1.5, 0, 0.95], merah: [-1.0, -1.0, 0.25, 0.8], putih: [1.0, -1.0, -0.25, 0.8], kancil: [-1.3, -0.5, -0.9, 0.7], jali: [1.3, -0.55, -Math.PI * 0.62, 0.7] }, jp: 0.55, house: [0, -3.2] }
  : { pz: -0.4, px: { 1: [0], 2: [-1.2, 1.2], 3: [-1.8, 0, 1.8], 4: [-2.1, -0.7, 0.7, 2.1] }, ps: { 1: 1, 2: 1, 3: 0.95, 4: 0.8 }, s: 0.42, r: 0.15, z0: 0.8, d: 0.5, g: 0.12, ox: 0.15, gz0: 0.55, gs: 0.29, gr: 0.1, bs: 0.44,
    act: { nenek: [0, -1.7, 0, 1.45], merah: [-3.45, -0.35, 0.5, 1.2], putih: [3.1, -0.3, -0.5, 1.2], kancil: [-4.0, 1.3, -0.6, 1.3], jali: [4.0, 1.2, -Math.PI * 0.72, 1.3] }, jp: 1, house: [0, -3.9] };
const SIZE = { big: 1.45, small: 0.82, mid: 1.1 };

/* ---------- Isi adegan per soal ---------- */
let pumps = [], items = [], badges = [], pairs = [], ghosts = [], rowLines = 1;
const rowZ = (row, line) => L.z0 + line * (2 * L.d + L.g) + row * L.d;
const slotPos = (sl) => {
  if (sl.t === 'row') { const col = sl.i % 10, line = Math.floor(sl.i / 10); return new THREE.Vector3((col - 4.5) * L.s + L.ox, 0.1 + L.r, rowZ(sl.row, line)); }
  const px = L.px[pumps.length][sl.p], col = sl.i % 2, line = Math.floor(sl.i / 2);
  return new THREE.Vector3(px + (col - 0.5) * L.gs, 0.08 + L.gr, L.pz + L.gz0 + line * L.gs);
};
const slotR = (sl) => sl.t === 'row' ? L.r : L.gr;
const pumpTop = (p) => { const v = p.g.position.clone(); v.y += 0.64 * p.g.scale.x; return v; };
const relayout = () => {
  pumps.forEach(p => { p.g.position.set(L.px[pumps.length][p.i], 0.02, L.pz); if (!p.growing) p.g.scale.setScalar(L.ps[pumps.length] * SIZE[p.spec.size]); });
  items.concat(ghosts).forEach(o => { if (o.userData.moving) return; o.position.copy(slotPos(o.userData.slot)); o.scale.setScalar(slotR(o.userData.slot)); });
  badges.forEach(b => {
    if (b.userData.row != null) b.position.set(L.ox - 5.4 * L.s - L.bs * 0.1, 0.3, rowZ(b.userData.row, 0));
    else { const p = pumps[b.userData.p]; if (p) { const v = pumpTop(p); b.position.set(v.x, v.y + L.bs * 0.9, v.z); } }
    b.scale.setScalar(L.bs);
  });
  pairs.forEach(m => { const i = m.userData.i, col = i % 10, line = Math.floor(i / 10); m.position.set((col - 4.5) * L.s + L.ox, 0.12, (rowZ(0, line) + rowZ(1, line)) / 2); m.scale.set(L.r * 0.5, 0.05, Math.max(0.02, L.d - L.r * 2.1)); });
  if (tikar) { const w = 10 * L.s + 0.25, z1 = rowZ(0, 0) - L.d * 0.6, z2 = rowZ(1, rowLines - 1) + L.d * 0.6; tikar.scale.set(w, 1, z2 - z1); tikar.position.set(L.ox, 0.075, (z1 + z2) / 2); }
  for (const [k, v] of Object.entries(L.act)) { const a = actors[k]; if (!a) continue; a.position.set(v[0], a === actors.jali ? 0.03 + 1.3 * L.jp : 0.03, v[1]); a.rotation.y = v[2]; a.scale.setScalar(v[3]); }
  if (jaliPost) { jaliPost.position.set(L.act.jali[0], 0.03, L.act.jali[1]); jaliPost.scale.setScalar(L.jp); }
  if (houseG) houseG.position.set(L.house[0], 0.02, L.house[1]);
};

/* ---------- Kamera ---------- */
const cam = { az: 0, el: 0.5, target: new THREE.Vector3(0, 0.6, 0.6), dist: 20 };
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  P = w / h < 0.9; L = params(); document.body.classList.toggle('portrait', P);
  camera.fov = P ? 30 : 26;
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = P ? 1.42 : 4.7, needH = P ? 2.1 : 2.7;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = P ? 0.82 : 0.72; cam.target.set(0, P ? 0.1 : 0.3, P ? 0.4 : 0.45);
  camera.setViewOffset(w, h, 0, Math.round(h * (P ? 0.03 : 0)), w, h); camera.updateProjectionMatrix();
  relayout();
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Dunia ---------- */
const buildWorld = async () => {
  world.add(B.island()); world.add(B.sea());
  houseG = B.house(); world.add(houseG);
  for (const [x, z, s] of [[-4.6, -3.6, 1.2], [4.8, -3.4, 1.0], [-7.0, -1.2, 0.9]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  try { for (const [x, z] of [[-6.8, 3.6], [6.9, 3.4], [-2.9, -2.6], [2.9, -2.7]]) await inst('bush', 2.4, [x, 0.02, z]); } catch (e) { /* semak hanya hiasan */ }
  tikar = new THREE.Mesh(new THREE.BoxGeometry(1, 0.04, 1), B.mat(0xc98f4e)); tikar.receiveShadow = true; tikar.visible = false; world.add(tikar);
  const k = B.kancil(); world.add(k); actors.kancil = k; tap(k, onKancil);
  jaliPost = B.post(); world.add(jaliPost);
  const j = B.jali(); world.add(j); actors.jali = j; tap(j, onJali);
  actors.nenek = B.warga({ kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true });
  actors.merah = B.warga({ dress: 0xe9897a, head: 0xd8392f });
  actors.putih = B.warga({ dress: 0x7fb2e0, head: 0xf7f4ec });
  for (const n of ['nenek', 'merah', 'putih']) world.add(actors[n]);
};

/* ---------- Gelembung ---------- */
const bubble = $('#bubble');
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};

/* ---------- Gambar kecil labu untuk tombol (SVG) ---------- */
const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const pumpSVG = (spec) => {
  const s = spec.size === 'big' ? 1 : spec.size === 'mid' ? 0.8 : 0.62, c = hex(spec.color), cx = 50, cy = 92 - 34 * s;
  const rib = (dx, w) => `<ellipse cx="${cx + dx * s}" cy="${cy}" rx="${w * s}" ry="${32 * s}" fill="${c}" stroke="#3b2614" stroke-width="3"/>`;
  let dot = '';
  if (spec.item) dot = spec.item === 'coin' ? '<circle cx="84" cy="84" r="11" fill="#f2c230" stroke="#3b2614" stroke-width="3"/>' : `<circle cx="84" cy="84" r="11" fill="${hex(spec.col)}" stroke="#3b2614" stroke-width="3"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="${cx - 4}" y="${cy - 40 * s}" width="8" height="${14 * s + 4}" rx="3" fill="#6b4a22"/>${rib(-22, 22)}${rib(22, 22)}${rib(0, 24)}${dot}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
};

/* ---------- Bantu adegan ---------- */
const clearRound = () => {
  for (const o of [...items, ...badges, ...pairs, ...ghosts]) world.remove(o);
  for (const p of pumps) world.remove(p.g);
  pumps = []; items = []; badges = []; pairs = []; ghosts = []; tikar.visible = false;
};
const setup = async (specs, rows = false) => {
  clearRound();
  pumps = specs.map((spec, i) => { const g = B.labu(spec.color); world.add(g); return { g, spec, i, growing: true }; });
  rowLines = Math.max(...specs.map(s => s.n || 0)) > 10 ? 2 : 1; tikar.visible = rows;
  relayout(); play('placement-c');
  await tween(0.4, (t) => pumps.forEach(p => p.g.scale.setScalar(Math.max(0.001, t * L.ps[pumps.length] * SIZE[p.spec.size]))), (t) => 1 - Math.pow(1 - t, 2));
  pumps.forEach(p => { p.growing = false; }); relayout();
};
const openLid = (p) => { if (p.open) return Promise.resolve(); p.open = true; play('rotate', 1.2); const lid = p.g.userData.lid; return tween(0.35, (t) => { lid.position.set(t * 0.28, 0.57 + t * 0.32, 0); lid.rotation.z = -t * 0.8; }); };
const fly = (o, from, dur = 0.45) => { o.userData.moving = true; return tween(dur, (t) => { const to = slotPos(o.userData.slot); o.position.lerpVectors(from, to, t); o.position.y += Math.sin(t * Math.PI) * 0.7 * L.ps[pumps.length]; o.rotation.y = t * 5; }).then(() => { o.userData.moving = false; o.position.copy(slotPos(o.userData.slot)); o.rotation.y = 0; }); };
const rowSlots = (row, n, start = 0) => Array.from({ length: n }, (_, k) => ({ t: 'row', row, i: start + k }));
const spill = async (pi, slots, gap = 170) => {
  const p = pumps[pi]; await openLid(p);
  const proms = [];
  for (let k = 0; k < slots.length; k++) {
    const o = B.item(p.spec.item, p.spec.col); o.userData.slot = slots[k]; o.scale.setScalar(slotR(slots[k])); const top = pumpTop(p); o.position.copy(top); world.add(o); items.push(o);
    play('placement-a', 0.85 + k * 0.03); proms.push(fly(o, top)); await wait(gap);
  }
  await Promise.all(proms);
};
const rowItems = (row) => items.filter(o => o.userData.slot.t === 'row' && o.userData.slot.row === row).sort((a, b) => a.userData.slot.i - b.userData.slot.i);
const rowBadge = (row, n, color) => { const b = B.badge(n, hex(color)); b.userData.row = row; world.add(b); badges.push(b); relayout(); play('placement-b'); return b; };
const pumpBadge = (pi, n) => { const b = B.badge(n); b.userData.p = pi; world.add(b); badges.push(b); relayout(); return b; };
const pairUp = async (n) => { for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), B.mat(0xfff3d1)); m.userData.i = i; world.add(m); pairs.push(m); relayout(); if (i % 2 === 0) play('toggle', 1.4); await wait(70); } };
const mark = (objs) => objs.forEach(o => { if (!o.userData.ring) { const r = B.ring(); o.add(r); o.userData.ring = r; } });
const unmarkAll = () => items.forEach(o => { if (o.userData.ring) { o.remove(o.userData.ring); o.userData.ring = null; } });
const hopItem = (o) => tween(0.3, (t) => { if (!o.userData.moving) o.position.y = slotPos(o.userData.slot).y + Math.sin(t * Math.PI) * slotR(o.userData.slot) * 2.2; }, (t) => t);
const countAloud = async (objs, from = 1) => { for (let k = 0; k < objs.length; k++) { hopItem(objs[k]); play('placement-b', 1 + k * 0.05); await num(from + k); } };
const showGhosts = (row, from, to) => { for (let i = from; i < to; i++) { if (ghosts.some(g => g.userData.slot.row === row && g.userData.slot.i === i)) continue; const g = B.ghost(); g.userData.slot = { t: 'row', row, i }; world.add(g); ghosts.push(g); } relayout(); };
const clearGhosts = () => { ghosts.forEach(g => world.remove(g)); ghosts = []; };

/* ---------- Pilihan dan garis bilangan (dengan kait tes) ---------- */
let ui = null, curRound = null;
const ask = async (opts) => { ui = { type: 'ask', correct: opts.correct, n: opts.options.length }; try { return await KK.ask(opts); } finally { ui = null; } };
const line = async (opts, answer) => { ui = { type: 'line', answer }; try { return await KK.line(opts); } finally { ui = null; } };
const numOpts = (answer, ...others) => { const set = [answer]; for (const o of others) if (o >= 0 && o <= 20 && !set.includes(o)) set.push(o); let k = 1; while (set.length < 3) { const c = answer + (k % 2 ? k : -k); if (c >= 1 && c <= 20 && !set.includes(c)) set.push(c); k++; } const s = shuffle(set.slice(0, 3)); return { options: s.map(String), correct: s.indexOf(answer), vals: s }; };
const said = {};
const jaliOnce = async (key, text) => { if (said[key]) return; said[key] = 1; hop(actors.jali, 0.25); await speak('jali', text); };

/* ---------- Tahap 1: selisih dicari (tebak dulu / betulkan Kancil) ---------- */
const roundCompare = async (kancilMode) => {
  let a, b; do { a = rand(5, 13); b = rand(5, 13); } while (a === b);
  const hi = Math.max(a, b), lo = Math.min(a, b), diff = hi - lo; const bigFew = Math.random() < 0.65;
  const nBig = bigFew ? lo : hi, nSmall = bigFew ? hi : lo; const moreRow = nBig > nSmall ? 0 : 1, moreName = moreRow === 0 ? 'besar' : 'kecil';
  curRound = { type: kancilMode ? 'kancil' : 'tebak', nBig, nSmall, answer: diff };
  await setup([{ size: 'big', color: COL.orange, item: 'marble', col: COL.red, n: nBig }, { size: 'small', color: COL.orange2, item: 'marble', col: COL.blue, n: nSmall }], true);
  await speak('nenek', 'Ini labu besar dan labu kecil. Mana yang isinya lebih banyak?');
  hop(actors.merah, 0.2); await speak('merah', 'Pasti labu besar! Kan besar.');
  await jaliOnce('big', 'Big pumpkin. Small pumpkin!');
  let guess = null;
  if (!kancilMode) {
    await speak('kancil', 'Kamu tebak dulu, ya. Nanti kita cek bersama!');
    const r = await ask({ options: [{ img: pumpSVG({ size: 'big', color: COL.orange }), small: 'besar' }, { img: pumpSVG({ size: 'small', color: COL.orange2 }), small: 'kecil' }], correct: null, cols: 2 });
    guess = r.index;
  }
  await speak('nenek', 'Ayo kita buka dan kita jajarkan.');
  await spill(0, rowSlots(0, nBig)); rowBadge(0, nBig, COL.red); await speak('merah', `Labu besar isinya ${nBig}.`);
  await spill(1, rowSlots(1, nSmall)); rowBadge(1, nSmall, COL.blue); await speak('putih', `Labu kecil isinya ${nSmall}.`);
  if (guess != null) await speak('kancil', guess === moreRow ? 'Tebakanmu cocok! Untung kita cek dulu.' : `Ternyata labu ${moreName} yang lebih banyak. Hebat, kita sudah mengecek!`);
  await speak('putih', 'Kita pasangkan satu-satu.'); await pairUp(lo);
  const extras = rowItems(moreRow).slice(lo); mark(extras);
  const q = `Labu ${moreName} lebih banyak berapa?`;
  let res;
  const hint = async (v) => {
    if (v === hi) await speak('nenek', `${hi} itu semua isi labu ${moreName}. Yang ditanya kelebihannya: yang tidak punya pasangan, berlingkar kuning.`);
    else if (v === lo) await speak('nenek', `${lo} itu isi labu yang sedikit. Hitung yang tidak punya pasangan saja.`);
    else await speak('nenek', 'Hampir! Hitung pelan-pelan yang berlingkar kuning.');
    for (const o of extras) hopItem(o);
  };
  if (!kancilMode) {
    await speak('nenek', q);
    const o = numOpts(diff, hi, diff + 1); res = await ask({ options: o.options, correct: o.correct, onWrong: (i) => hint(o.vals[i]) });
  } else {
    hop(actors.kancil); await speak('kancil', `Aku tahu! Labu ${moreName} isinya ${hi}. Jadi lebih banyak ${hi}!`);
    for (const o of rowItems(moreRow)) hopItem(o);
    await speak('nenek', `Hmm. Kancil benar? Labu ${moreName} lebih banyak berapa?`);
    const o = numOpts(diff, hi, lo); res = await ask({ options: o.options, correct: o.correct, onWrong: (i) => hint(o.vals[i]) });
    await speak('kancil', `Oh, aku keliru! ${hi} itu jumlah semuanya. Yang ditanya cuma kelebihannya.`);
  }
  await speak('putih', 'Kita hitung yang tidak punya pasangan.');
  await countAloud(extras);
  await speak('nenek', `${hi} dan ${lo}, selisihnya ${diff}. Labu ${moreName} lebih banyak ${diff}.`);
  hop(actors.jali, 0.25); await speak('jali', `${diff} more!`); said.more = 1;
  return res.firstTry;
};

/* ---------- Tahap 2: yang besar/kecil dicari ---------- */
const roundFind = async (mode, useLine) => {
  let small, big, dif;
  if (mode === 'more') { small = rand(3, 9); dif = rand(2, Math.min(9, 18 - small)); big = small + dif; }
  else { big = rand(9, 18); dif = rand(2, Math.min(8, big - 3)); small = big - dif; }
  const answer = mode === 'more' ? big : small, knownRow = mode === 'more' ? 1 : 0, askRow = 1 - knownRow;
  curRound = { type: mode + (useLine ? '-tebak' : ''), big, small, dif, answer };
  await setup([{ size: 'big', color: COL.orange, item: 'marble', col: COL.red, n: big }, { size: 'small', color: COL.orange2, item: 'marble', col: COL.blue, n: small }], true);
  await spill(knownRow === 0 ? 0 : 1, rowSlots(knownRow, mode === 'more' ? small : big)); rowBadge(knownRow, mode === 'more' ? small : big, knownRow ? COL.blue : COL.red);
  const q = mode === 'more'
    ? `Labu kecil berisi ${small}. Labu besar berisi ${dif} lebih banyak dari labu kecil. Labu besar isinya berapa?`
    : `Labu besar berisi ${big}. Labu kecil berisi ${dif} lebih sedikit dari labu besar. Labu kecil isinya berapa?`;
  await speak('nenek', q);
  if (mode === 'fewer') await jaliOnce('fewer', 'Fewer! Fewer means less.');
  const scaffold = async () => {
    if (mode === 'more') { showGhosts(0, 0, small); await speak('nenek', `Labu besar punya ${small}, sama dengan labu kecil...`); showGhosts(0, small, big); await speak('nenek', `...lalu ${dif} lagi. Hitung semua lingkarannya.`); }
    else { showGhosts(1, 0, small); const ex = rowItems(0).slice(small); mark(ex); for (const o of ex) hopItem(o); await speak('nenek', `Labu kecil kurang ${dif}. Yang berlingkar kuning tidak punya pasangan. Hitung lingkaran kosongnya.`); }
  };
  let firstTry, guess = null;
  if (useLine) {
    await speak('kancil', 'Tebak dulu di garis bilangan. Nanti kita cek!');
    guess = await line({ min: 0, max: 20, start: mode === 'more' ? small : big }, answer); firstTry = guess === answer ? true : null;
  } else {
    const o = mode === 'more' ? numOpts(big, dif, Math.abs(small - dif) || big + 1) : numOpts(small, Math.min(20, big + dif), dif);
    const r = await ask({
      options: o.options, correct: o.correct, onWrong: async (i) => {
        const v = o.vals[i];
        if (mode === 'more') await speak('nenek', v === dif ? `${dif} itu lebihnya saja.` : `Lebih banyak artinya labu besar isinya lebih dari ${small}.`);
        else await speak('nenek', v > big ? `Lebih sedikit artinya kurang. Labu kecil isinya harus kurang dari ${big}.` : v === dif ? `${dif} itu kurangnya saja.` : 'Hampir!');
        await scaffold();
      },
    });
    firstTry = r.firstTry;
  }
  await speak('putih', 'Ayo kita cek. Buka labunya!');
  clearGhosts(); unmarkAll();
  await spill(askRow === 0 ? 0 : 1, rowSlots(askRow, answer), 130); rowBadge(askRow, answer, askRow ? COL.blue : COL.red);
  await pairUp(small); const ex = rowItems(0).slice(small); mark(ex);
  if (guess != null) await speak('kancil', guess === answer ? `Tebakanmu ${guess}, tepat sekali!` : `Tebakanmu ${guess}, ternyata ${answer}. Bagus, kita sudah mengecek!`);
  await countAloud(ex);
  await speak('nenek', mode === 'more' ? `${small} yang berpasangan, ditambah ${dif} lagi. Jadi labu besar isinya ${big}.` : `${big} kurang ${dif}, jadi ${small}. Labu kecil lebih sedikit ${dif}.`);
  hop(actors.jali, 0.25); await speak('jali', mode === 'more' ? `${big} is more than ${small}!` : `${small} is fewer than ${big}!`);
  return firstTry;
};

/* ---------- Tahap 3: kembar dan hampir kembar ---------- */
const roundDoubles = async () => {
  const n = rand(3, 9); curRound = { type: 'kembar', n, answer: 2 * n };
  await setup([{ size: 'mid', color: COL.orange, item: 'marble', col: COL.red, n: n }, { size: 'mid', color: COL.orange, item: 'marble', col: COL.blue, n: n + 1 }], true);
  rowLines = n + 1 > 10 ? 2 : 1; relayout();
  await speak('nenek', `Dua labu sama. Masing-masing isinya ${n}.`);
  await Promise.all([spill(0, rowSlots(0, n), 120), spill(1, rowSlots(1, n), 120)]); rowBadge(0, n, COL.red); rowBadge(1, n, COL.blue); await pairUp(n);
  await speak('putih', 'Semua punya pasangan. Sama banyak!'); await jaliOnce('same', 'Same! Same!');
  await speak('nenek', `${n} tambah ${n}, semuanya berapa?`);
  const o1 = numOpts(2 * n, 2 * n - 1, 2 * n + 1);
  const r1 = await ask({ options: o1.options, correct: o1.correct, onWrong: async () => { await speak('nenek', `Mulai dari ${n}, lalu hitung terus kelereng biru.`); await countAloud(rowItems(1), n + 1); } });
  await speak('kancil', `${n} tambah ${n} sama dengan ${2 * n}. Itu kembar!`);
  await speak('nenek', 'Nenek tambah satu kelereng ke labu Bawang Putih.'); hop(actors.nenek, 0.15);
  { const p = pumps[1]; const it = B.item('marble', COL.blue); it.userData.slot = { t: 'row', row: 1, i: n }; it.scale.setScalar(L.r); const top = pumpTop(p); top.y += 0.4; it.position.copy(top); world.add(it); items.push(it); play('placement-c'); await fly(it, top, 0.6); mark([it]); badges.filter(b => b.userData.row === 1).forEach(b => world.remove(b)); badges = badges.filter(b => b.userData.row !== 1); rowBadge(1, n + 1, COL.blue); }
  await speak('nenek', `Sekarang ${n} tambah ${n + 1}. Semuanya berapa?`);
  const o2 = numOpts(2 * n + 1, 2 * n, 2 * n + 2);
  const r2 = await ask({ options: o2.options, correct: o2.correct, onWrong: async () => { await speak('nenek', `${n} tambah ${n} itu ${2 * n}. Yang ini lebih satu, berlingkar kuning. Jadi satu lebih dari ${2 * n}.`); hopItem(items[items.length - 1]); } });
  await speak('kancil', `${2 * n}, lalu satu lagi: ${2 * n + 1}. Hampir kembar!`);
  return r1.firstTry && r2.firstTry;
};

/* ---------- Tahap 3: mana yang tidak cocok (semua pilihan sah) ---------- */
const roundOdd = async () => {
  const k = rand(5, 8), kn = k + 2 <= 10 ? k + 2 : k - 2;
  const base = () => ({ size: 'small', color: COL.orange, item: 'marble', col: COL.red, n: k });
  const specs = shuffle([
    { ...base(), n: kn, why: `Labu ini isinya ${kn}, yang lain ${k}.` },
    { ...base(), item: 'coin', why: 'Labu ini isinya koin, yang lain kelereng.' },
    { ...base(), size: 'big', why: 'Labu ini besar, yang lain kecil.' },
    { ...base(), color: COL.green, why: 'Labu ini hijau, yang lain oranye.' },
  ]);
  curRound = { type: 'tidak-cocok', specs: specs.map(s => s.why) };
  await setup(specs, false);
  await Promise.all(specs.map((s, i) => spill(i, Array.from({ length: s.n }, (_, j) => ({ t: 'grid', p: i, i: j })), 90)));
  specs.forEach((s, i) => pumpBadge(i, s.n));
  await speak('nenek', 'Empat labu. Mana yang tidak cocok dengan yang lain? Semua boleh dipilih, asal ada alasannya.');
  const r = await ask({ options: specs.map(s => ({ img: pumpSVG(s), label: String(s.n) })), correct: null, cols: P ? 2 : 4 });
  hop(actors.nenek, 0.15); await speak('nenek', `Pilihan bagus! ${specs[r.index].why}`);
  const other = specs[(r.index + 1 + rand(0, 2)) % 4];
  await speak('kancil', `Aku pilih labu lain. ${other.why}`);
  await speak('putih', 'Dua-duanya benar. Alasannya saja yang beda.');
  return true;
};

/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  clearRound();
  await speak('kancil', 'Waktunya istirahat! Ada balon lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col);
      b.position.set((Math.random() * 2 - 1) * (P ? 1.1 : 3.6), 0.5, (P ? 0.9 : 1.6) + Math.random() * 0.6); b.scale.setScalar(P ? 0.55 : 1.05);
      b.userData = { v: (0.6 + Math.random() * 0.3) / T, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100 * T);
  });
  await speak('kancil', 'Seru, ya! Yuk, lanjut membantu Nenek.');
};

/* ---------- Penutup: berbagi sama banyak ---------- */
const ending = async () => {
  const m = rand(6, 9); curRound = { type: 'penutup', m };
  await setup([{ size: 'big', color: COL.orange, item: 'marble', col: COL.red, n: 2 * m }], true); rowLines = 1; relayout();
  await speak('nenek', `Isi semua labu Nenek kumpulkan di labu besar ini. Ada ${2 * m}.`);
  hop(actors.merah, 0.2); await speak('merah', 'Maaf ya, Putih. Aku selalu pilih yang besar. Ternyata harus hitung dulu.');
  hop(actors.putih, 0.2); await speak('putih', 'Tidak apa-apa, Kak. Kita bagi berdua, satu-satu!');
  const p = pumps[0]; await openLid(p);
  for (let i = 0; i < 2 * m; i++) { const row = i % 2, idx = Math.floor(i / 2); const o = B.item('marble', row ? COL.blue : COL.red); o.userData.slot = { t: 'row', row, i: idx }; o.scale.setScalar(L.r); const top = pumpTop(p); o.position.copy(top); world.add(o); items.push(o); play('placement-a', 0.9 + i * 0.02); fly(o, top); await wait(200); }
  await wait(500); await pairUp(m); rowBadge(0, m, COL.red); rowBadge(1, m, COL.blue);
  chime([523, 659, 784, 1047]); confetti(); hop(actors.merah, 0.3); hop(actors.putih, 0.3); hop(actors.kancil, 0.4);
  await speak('nenek', `Semua punya pasangan. Sama banyak, masing-masing ${m}!`);
  hop(actors.jali, 0.3); await speak('jali', `${m} and ${m}. The same! Thank you!`);
  await speak('kancil', 'Aku sudah paham: besar belum tentu lebih banyak. Hitung dulu! Terima kasih, Guru kecil!');
  bubble.hidden = true;
};

/* ---------- Alur bab ---------- */
let roundNo = 0, balloonDone = false, finishedFlow = false, running = false;
const stageChip = () => { const s = KK.load(BAB); $('#stage').textContent = s.done ? 'Selesai' : `Tahap ${s.stage + 1}/3`; };
const playRound = async (stage) => {
  roundNo++;
  if (stage === 0) return roundCompare(roundNo === 2 ? true : roundNo === 1 ? false : Math.random() < 0.4);
  if (stage === 1) return roundFind(roundNo % 2 ? 'more' : 'fewer', Math.random() < 0.5);
  return roundNo % 2 ? roundDoubles() : roundOdd();
};
const run = async () => {
  if (running) return; running = true;
  stageChip();
  await speak('nenek', 'Terima kasih sudah membantu Nenek memanen, Bawang Merah dan Bawang Putih! Ini hadiahnya: labu berisi kelereng.');
  await jaliOnce('pumpkin', 'Pumpkin! Pumpkin!');
  await speak('kancil', 'Aku belum pandai membandingkan. Ajari aku, ya!');
  let lastStage = KK.load(BAB).stage;
  for (;;) {
    const st = KK.load(BAB).stage; if (st !== lastStage) { roundNo = 0; lastStage = st; }
    const ok = await playRound(st);
    const r = ok === null ? { advanced: false, stage: KK.load(BAB).stage, finished: false } : KK.record(BAB, ok, STAGES); stageChip();
    if (r.advanced) {
      chime([659, 784, 1047]); confetti(); hop(actors.kancil, 0.4);
      await speak('nenek', r.stage === 1 ? 'Pintar! Sekarang soalnya lebih menantang: ada yang disembunyikan di dalam labu.' : 'Hebat! Tantangan terakhir: labu kembar dan labu yang tidak cocok.');
      if (r.stage === 1 && !balloonDone) { balloonDone = true; await balloonBreak(); }
    } else if (r.finished) {
      await ending(); finishedFlow = true; stageChip();
      KK.done(BAB, 'Bawang Merah dan Bawang Putih berbagi sama banyak. Besar belum tentu lebih banyak: hitung dulu!');
      await new Promise(res => { const chk = () => document.querySelector('.kk-done') ? setTimeout(chk, 400) : res(); setTimeout(chk, 400); });
    } else if (!ok) {
      await speak('kancil', 'Tidak apa-apa. Kita coba labu lain, ya!');
    }
  }
};

/* ---------- Ketukan iseng ---------- */
let talking = false;
const onKancil = async () => { if (talking || ui == null) return; talking = true; hop(actors.kancil); await say('Besar belum tentu lebih banyak. Hitung dulu!'); talking = false; };
const onJali = async () => { if (talking) return; talking = true; hop(actors.jali, 0.3); await say(pick(['Pumpkin!', 'Big and small!', 'More or fewer?', 'The same!']), 'en'); talking = false; };

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 18) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
$('#startBtn').addEventListener('click', () => { $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } run(); });

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  placeCam();
  const K = actors.kancil, J = actors.jali;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  ['nenek', 'merah', 'putih'].forEach((n, i) => { const S = actors[n]; if (!S) return; S.userData.head.rotation.z = Math.sin(t * 1.1 + i) * 0.04; S.userData.head.rotation.x = S.userData.talk ? Math.sin(t * 13) * 0.06 : 0; });
  items.forEach(o => { if (o.userData.ring) o.userData.ring.scale.setScalar(1 + Math.abs(Math.sin(t * 4)) * 0.12); });
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.2; if (b.position.y > (P ? 3.2 : 4.5)) b.userData.end(); }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

addEventListener('error', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + e.message; });
addEventListener('unhandledrejection', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + (e.reason && e.reason.message || e.reason); });
(async () => {
  fit(); placeCam();
  try { await Promise.race([buildWorld(), wait(25000 / T)]); } catch (e) { $('#loading').textContent = 'Halaman gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false; stageChip();
  window.__game = {
    state: () => ({ ...KK.load(BAB), round: curRound, ui, items: items.length, finishedFlow, balloonDone }),
    answerCorrect: () => { if (!ui) return false; if (ui.type === 'ask') document.querySelectorAll('.kk-opt')[ui.correct ?? 0].click(); else { const r = document.querySelector('.kk-line input'); r.value = ui.answer; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); } return true; },
    answerWrong: () => { if (!ui) return false; if (ui.type === 'ask') { const i = ui.correct == null ? 0 : (ui.correct + 1) % ui.n; document.querySelectorAll('.kk-opt')[i].click(); } else { const r = document.querySelector('.kk-line input'); r.value = Math.max(0, ui.answer - 2); r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); } return true; },
    setStage: (s) => KK.save(BAB, { stage: s, streak: 0, done: false }),
    balloonBreak, D, actors,
  };
  frame();
  if (QS.has('play')) { $('#intro').classList.add('gone'); run(); }
})();
