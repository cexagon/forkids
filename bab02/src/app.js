/* Kota Kancil, Bab 02: Warung Bu Murni. Kancil magang menjaga warung; anak mengajari Kancil menggenapkan sepuluh. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const BAB = 2, STAGES = 3;
const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const SP = QS.has('fast') ? 0.12 : 1;
const wait = (ms) => new Promise(r => setTimeout(r, ms * SP));
const KK = window.KK;

/* ---------- Angka ---------- */
const W_ID = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
const W_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const nid = (n) => n <= 10 ? W_ID[n] : n === 11 ? 'sebelas' : n < 20 ? `${W_ID[n - 10]} belas` : n === 20 ? 'dua puluh' : String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Benda ---------- */
const KINDS = {
  bun: { id: 'roti', model: 'food_ingredient_bun' },
  tomato: { id: 'tomat', model: 'food_ingredient_tomato' },
  potato: { id: 'kentang', model: 'food_ingredient_potato' },
  onion: { id: 'bawang', model: 'food_ingredient_onion' },
  coin: { id: 'keping', model: null },
};

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
  if (!D.sound || !('speechSynthesis' in window)) return wait(Math.min(2800, 800 + text.length * 45));
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
/* hitungan cepat: angka diucapkan, tanpa gelembung */
const count = (n) => D.sound ? say(nid(n)) : wait(420);
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
const hemi = new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffdfae, 2.7); sun.position.set(-7, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);

const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };

const loader = new GLTFLoader();
const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync(`../pasar3d/models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) { o.material.map.colorSpace = THREE.SRGBColorSpace; } o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.02, dur * SP), fn, ease, res }));
const hop = (a, h = 0.35) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Tokoh ---------- */
const CUST = [
  { name: 'Bu Guru Dia', opts: { dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }, hi: 'Selamat pagi, Kancil!', bye: 'Terima kasih! Hitunganmu rapi.' },
  { name: 'Nenek Gabe', opts: { kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }, hi: 'Halo, Cucu Kancil!', bye: 'Terima kasih, Cucu. Nenek senang.' },
  { name: 'Kakek Ramlan', opts: { kind: 'kakek', dress: 0x4f8a5b }, hi: 'Wah, warungnya ramai!', bye: 'Mantap! Kakek bangga padamu.' },
];
let ci = 0, cust = CUST[0];
const actors = {}; const lanterns = []; let stallG = null, jaliSpot = null;

/* ---------- Meja: dua baki sepuluh petak dan piring ---------- */
let counter = null, stool = null; const trays = []; const slots = []; const plateSlots = [];
let inTray = []; let onPlate = []; /* benda yang sedang ada */
const norm = {};
const buildWorld = async () => {
  world.add(B.island());
  const CS = 2.0;
  await inst('building_A', CS, [-3.6, 0.02, -4.0]);
  await inst('building_B', CS, [3.6, 0.02, -4.0]);
  for (const x of [-3.6, 3.6]) { const r = B.tileRoof(4, 4, 0.85); r.position.set(x, 3.3, -4.0); r.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.62).lerp(new THREE.Color(0x8a7a70), 0.35); } }); world.add(r); }
  for (const [x, z, s] of [[-6.8, -2.6, 1.2], [6.6, -2.2, 1.1], [0, -4.6, 1.3]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  for (const [x, z] of [[-6.2, 3.4], [6.3, 3.2]]) await inst('bush', 2.6, [x, 0.02, z]);

  /* satu lapak besar */
  stallG = B.stall('#2c8daa', '#fff3d1', 'WARUNG BU MURNI'); stallG.position.set(0, 0.02, -0.4); stallG.userData.roof.visible = false; stallG.userData.val.position.set(0, 2.95, -0.5); world.add(stallG);
  for (const sx of [-1, 1]) stallG.add(B.cyl(0.06, 0.06, 0.5, B.PAL.woodDark, [sx * 1.57, 2.95, -0.5], 10));
  counter = new THREE.Group(); counter.position.set(0, 1.0, -0.3); counter.rotation.x = 0.42; world.add(counter);
  for (const [i, x] of [[0, -0.84], [1, 0.84]]) {
    const t = B.tenFrame(i ? 0x2c8daa : B.PAL.woodDark); t.position.set(x, 0, 0.14); counter.add(t); trays.push(t);
    t.userData.cells.forEach(c => slots.push(new THREE.Vector3(x + c.x, c.y, 0.14 + c.z)));
    tap(t, () => onTray(i));
  }
  const pl = B.plate(3.1); pl.position.set(0, 0, -0.42); counter.add(pl);
  for (let i = 0; i < 10; i++) plateSlots.push(new THREE.Vector3(-1.35 + i * 0.3, 0.06, -0.42));

  /* ukuran benda disamakan agar pas di petak */
  for (const k of Object.keys(KINDS)) {
    if (!KINDS[k].model) continue; const o = await load(KINDS[k].model);
    const bx = new THREE.Box3().setFromObject(o), sz = bx.getSize(new THREE.Vector3());
    const s = 0.22 / Math.max(sz.x, sz.z); norm[k] = { s, lift: -bx.min.y * s };
  }

  /* lampion di bawah papan nama, menyala saat penutup */
  for (let i = 0; i < 10; i++) { const l = B.lantern(); l.scale.setScalar(0.85); l.position.set(-1.62 + i * 0.36, 2.55, -0.85); l.visible = false; l.add(B.cyl(0.008, 0.008, 0.22, B.PAL.ink, [0, 0.3, 0], 4)); world.add(l); lanterns.push(l); }

  /* tokoh */
  const murni = B.warga({ dress: 0xd9534f, head: 0xffffff }); murni.userData.basket.visible = false; world.add(murni); actors.murni = murni; tap(murni, () => onMurni());
  stool = B.box(0.8, 0.45, 0.6, B.PAL.wood, [0, 0.25, 0]); world.add(stool);
  const k = B.kancil(); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const j = B.jali(); world.add(j); actors.jali = j; tap(j, () => onJali());
  jaliSpot = new THREE.Group(); jaliSpot.add(B.cyl(0.06, 0.08, 1.2, B.PAL.woodDark, [0, 0.6, 0], 10)); jaliSpot.add(B.box(0.7, 0.1, 0.16, B.PAL.wood, [0, 1.2, 0])); world.add(jaliSpot);
  for (const c of CUST) { c.g = B.warga(c.opts); tap(c.g, () => onCust()); }
  cust = CUST[0]; world.add(cust.g); actors.cust = cust.g;
  world.add(B.sea());
};

/* ---------- Kamera dan tata letak (potret: lebih sempit, tokoh di samping) ---------- */
const cam = { az: 0, el: 0.42, target: new THREE.Vector3(0, 1.3, 0.2), azGoal: 0 };
const LAY = {
  land: { kancil: [-0.95, -1.55, -1.3, 1.3], murni: [0.95, -1.35, -0.15, 1.4], cust: [2.65, 0.5, -0.7, 1.25], jali: [-2.75, 1.7, -0.9, 0.8] },
  port: { kancil: [-0.95, -1.55, -1.3, 1.2], murni: [0.95, -1.35, -0.15, 1.3], cust: [1.45, 2.0, -0.5, 0.95], jali: [-1.45, 2.1, -1.0, 0.7] },
};
let portrait = false;
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9;
  camera.fov = portrait ? 30 : 26; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 1.95 : 4.4, needH = portrait ? 2 : 2.3;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = portrait ? 0.78 : 0.55; cam.target.set(portrait ? 0 : -0.6, portrait ? 0.55 : 1.05, portrait ? 0.5 : 0.25); cam.az = cam.azGoal = 0;
  document.body.classList.toggle('portrait', portrait);
  const L = portrait ? LAY.port : LAY.land;
  for (const k of ['kancil', 'murni', 'cust']) { const a = actors[k]; if (!a) continue; const [x, z, ry, s] = L[k]; a.position.set(x, k === 'kancil' ? 0.48 : 0.03, z); if (k === 'kancil') stool.position.set(x, 0, z); a.rotation.y = k === 'kancil' ? ry : (k === 'cust' ? ry : 0); a.scale.setScalar(s); a.userData.s0 = s; }
  if (actors.jali) { const [x, z, ry, s] = L.jali; jaliSpot.position.set(x, 0.03, z); jaliSpot.scale.setScalar(s); actors.jali.position.set(x, 0.03 + 1.25 * s, z); actors.jali.rotation.y = ry; actors.jali.scale.setScalar(1.35 * s); }
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung dan papan hitungan ---------- */
const bubble = $('#bubble');
const speak = async (who, text, lang) => {
  const names = { kancil: 'Kancil', jali: 'Jali', murni: 'Bu Murni', cust: cust.name };
  bubble.dataset.who = who; $('#who').textContent = names[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};
const eqEl = $('#eq');
const showEq = (main, tally = '', cls = '') => { eqEl.hidden = !main; eqEl.className = cls; eqEl.innerHTML = `<b>${main}</b>${tally !== '' ? `<i>${tally}</i>` : ''}`; };
const tally = (n) => { const i = eqEl.querySelector('i') || eqEl.appendChild(document.createElement('i')); i.textContent = n; };

/* ---------- Benda di baki ---------- */
const makeItem = async (k) => {
  if (k === 'coin') { const c = B.coin(); c.userData.lift = 0; return c; }
  const o = (await load(KINDS[k].model)).clone(true); o.scale.setScalar(norm[k].s); o.userData.lift = norm[k].lift; o.rotation.y = Math.random() * 6; return o;
};
const placeAt = (o, p) => { o.position.set(p.x, p.y + o.userData.lift, p.z); };
const clearAll = async () => {
  const all = [...inTray.filter(Boolean), ...onPlate.filter(Boolean)];
  if (all.length) await tween(0.25, (t) => all.forEach(o => o.scale.setScalar((o.userData.s0 || 1) * (1 - t) + 0.001)));
  all.forEach(o => counter.remove(o)); inTray = []; onPlate = [];
};
const popIn = (o) => { const s0 = o.scale.x; o.userData.s0 = s0; o.scale.setScalar(0.001); counter.add(o); return tween(0.22, (t) => o.scale.setScalar(s0 * t + 0.001)); };
/* isi baki langsung: n benda, sepuluh pertama di baki kiri */
const fillTrays = async (n, k) => { for (let i = 0; i < n; i++) { const o = await makeItem(k); placeAt(o, slots[i]); inTray[i] = o; popIn(o); if (i % 3 === 2) await wait(60); } await wait(250); };
const fillPlate = async (n, k) => { const off = Math.floor((10 - n) / 2); for (let i = 0; i < n; i++) { const o = await makeItem(k); placeAt(o, plateSlots[off + i]); onPlate.push(o); popIn(o); } await wait(250); };
const nTray = () => inTray.filter(Boolean).length;
const flashTray = (i) => { const t = trays[i]; return tween(0.5, (k) => { const s = 1 + Math.sin(k * Math.PI) * 0.08; t.scale.set(s, 1, s); }, (k) => k); };
const arc = (o, to, h = 0.5, dur = 0.42) => { const from = o.position.clone(); return tween(dur, (t) => { o.position.lerpVectors(from, to, t); o.position.y += Math.sin(t * Math.PI) * h; }); };
/* pindahkan satu benda dari piring ke petak kosong berikutnya; hasil: jumlah di baki */
const plateToTray = async () => {
  const o = onPlate.shift(); if (!o) return nTray(); const i = nTray(); const to = slots[i].clone(); to.y += o.userData.lift;
  play('placement-a', 0.9 + Math.random() * 0.3); await arc(o, to); inTray[i] = o; play('placement-b', 1.1); return i + 1;
};
/* ambil satu benda dari petak terakhir yang terisi, terbang ke keranjang pembeli */
const v3 = new THREE.Vector3();
const trayToBasket = async () => {
  const i = nTray() - 1; if (i < 0) return 0; const o = inTray[i]; inTray[i] = null; inTray.length = i;
  cust.g.userData.basket.getWorldPosition(v3); const to = counter.worldToLocal(v3.clone()); to.y += 0.15;
  play('placement-a', 1.2); const s0 = o.scale.x;
  await arc(o, to, 0.6, 0.5); await tween(0.12, (t) => o.scale.setScalar(s0 * (1 - t) + 0.001)); counter.remove(o); play('placement-b', 0.9);
  return i;
};
const bounceItem = (o) => { const y0 = o.position.y; return tween(0.3, (t) => { o.position.y = y0 + Math.sin(t * Math.PI) * 0.18; }, (t) => t); };

/* ---------- Pembeli datang bergiliran ---------- */
const nextCustomer = async () => {
  const old = cust.g; const s0 = old.scale.x;
  ci = (ci + 1) % CUST.length; if (CUST[ci].g === old) return;
  await tween(0.3, (t) => old.scale.setScalar(s0 * (1 - t) + 0.001)); world.remove(old); old.scale.setScalar(s0);
  cust = CUST[ci]; const nw = cust.g; nw.position.copy(old.position); nw.rotation.y = old.rotation.y; nw.scale.setScalar(0.001); world.add(nw); actors.cust = nw; play('placement-c');
  await tween(0.4, (t) => nw.scale.setScalar(s0 * t + 0.001)); nw.scale.setScalar(s0); nw.userData.s0 = s0;
};

/* ---------- Jawaban: pegangan untuk tes ---------- */
let cur = null; /* {type:'line'|'ask', answer, correct} */
const askLine = async (answer) => { cur = { type: 'line', answer }; const v = await KK.line({ min: 0, max: 20, start: 10 }); cur = null; return v; };
const askOpts = async (options, correct, onWrong) => { cur = { type: 'ask', correct }; const r = await KK.ask({ options, correct, onWrong }); cur = null; return r; };

/* ---------- Mesin 1: tebak dulu, lalu cek ---------- */
const checkAdd = async (a, b, word) => {
  /* genapkan sepuluh dulu */
  const need = 10 - a;
  await speak('kancil', `Ayo kita cek! Baki ini perlu ${nid(need)} lagi supaya penuh.`);
  for (let i = 0; i < need; i++) { const n = await plateToTray(); tally(n); await count(n); }
  chime([523, 659, 784]); flashTray(0); tally(10);
  await speak('kancil', `Sepuluh! Baki penuh.`); hop(actors.jali, 0.25); await speak('jali', 'Ten!');
  const rest = b - need;
  await speak('kancil', `Sisa ${nid(rest)} di baki kedua.`);
  for (let i = 0; i < rest; i++) { const n = await plateToTray(); tally(n); await count(n); }
  showEq(`${a} + ${need} + ${rest} = ${a + b}`, '', 'ok');
  await speak('kancil', `Sepuluh tambah ${nid(rest)}, jadi ${nid(a + b)} ${word}.`);
};
const checkSub = async (a, b, word) => {
  const o = a - 10, more = b - o;
  await speak('kancil', `Ayo kita cek! Ambil ${nid(o)} dulu dari baki kedua.`);
  for (let i = 0; i < o; i++) { const n = await trayToBasket(); tally(n); await count(n); }
  chime([523, 659, 784]); flashTray(0);
  await speak('kancil', `Pas sepuluh. Masih kurang ${nid(more)}, ambil dari baki penuh.`);
  for (let i = 0; i < more; i++) { const n = await trayToBasket(); tally(n); await count(n); }
  showEq(`${a} − ${o} − ${more} = ${a - b}`, '', 'ok');
  await speak('kancil', `Sisa ${nid(a - b)} ${word}.`);
};
const praiseGuess = async (g, ans) => {
  if (g === ans) { chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.4); await speak('murni', `Tebakanmu ${nid(g)}, tepat! Kamu sudah mengecek, hebat.`); }
  else await speak('murni', `Tebakanmu ${nid(g)}. Setelah dicek, ternyata ${nid(ans)}. ${g < ans ? 'Sedikit lebih banyak.' : 'Sedikit lebih sedikit.'} Bagus, kamu mau mengecek!`);
};
let saidBread = false;
const roundGuessAdd = async () => {
  const a = rand(7, 9), b = rand(3, 6), ans = a + b;
  const k = Math.random() < 0.6 ? 'bun' : pick(['tomato', 'potato', 'onion']), w = KINDS[k].id;
  await fillTrays(a, k); await fillPlate(b, k);
  showEq(`${a} + ${b} = ?`);
  await speak('cust', `${cust.hi} Aku beli ${nid(a)} ${w}, tambah ${nid(b)} ${w} lagi.`);
  if (!saidBread && k === 'bun') { saidBread = true; hop(actors.jali, 0.25); await speak('jali', 'Bread! How many?'); }
  else if (Math.random() < 0.4) { hop(actors.jali, 0.25); await speak('jali', `${cap(W_EN[a])} plus ${W_EN[b]}!`); }
  await speak('kancil', `Berapa semuanya, ya? Kamu tebak dulu!`);
  const g = await askLine(ans);
  showEq(`${a} + ${b} = ?`, g === ans ? '' : '');
  await checkAdd(a, b, w); await praiseGuess(g, ans);
  return g === ans;
};

/* ---------- Mesin 2: betulkan Kancil ---------- */
const roundFix = async () => {
  const a = rand(11, 16), b = rand(Math.max(3, a - 9), 9), ans = a - b, o = a - 10;
  const k = Math.random() < 0.5 ? 'bun' : pick(['tomato', 'potato', 'onion']), w = KINDS[k].id;
  await fillTrays(a, k);
  showEq(`${a} − ${b} = ?`);
  await speak('murni', `Ada ${nid(a)} ${w}: sepuluh di baki penuh, ${nid(o)} di baki kedua.`);
  await speak('cust', `${cust.hi} Aku beli ${nid(b)} ${w}.`);
  const flip = Math.random() < 0.5;
  let kAns;
  if (flip) {
    kAns = 10 + (b - o);
    await speak('kancil', `Aku tahu! ${cap(nid(o))} kurang ${nid(b)} tidak bisa. Jadi kubalik: ${nid(b)} kurang ${nid(o)}, ${nid(b - o)}. Sisa ${nid(kAns)}!`);
    showEq(`${a} − ${b} = ${kAns} ?`, '', 'bad');
  } else {
    kAns = 10;
    await speak('kancil', `Aku ambil dari baki kedua.`);
    for (let i = 0; i < o; i++) { const n = await trayToBasket(); tally(n); await count(n); }
    await speak('kancil', `Baki kedua kosong. Sisa sepuluh!`);
    showEq(`${a} − ${b} = 10 ?`, '', 'bad');
  }
  await speak('murni', `Hmm, Kancil benar? Berapa sisa ${w} yang betul?`);
  let d = flip ? ans + 1 : ans + 2; if (d === kAns || d === ans) d = ans - 1;
  const opts = shuffle([ans, kAns, d]); const ci2 = opts.indexOf(ans);
  const r = await askOpts(opts.map(String), ci2, async (i) => {
    const v = opts[i];
    if (v === kAns && flip) await speak('murni', `Kalau dibalik, ${w}nya malah tambah banyak! Dibeli itu berkurang. Ambil ${nid(o)} dulu sampai pas sepuluh, lalu ambil ${nid(b - o)} lagi.`);
    else if (v === kAns) { trays[0].userData && flashTray(0); await speak('murni', `Kancil baru mengambil ${nid(o)}. Pembeli mau ${nid(b)}, jadi masih kurang ${nid(b - o)}. Ambil dari baki penuh.`); }
    else await speak('murni', `Belum pas. Ambil ${nid(o)} dulu jadi sepuluh. Lalu sepuluh kurang ${nid(b - o)}, berapa?`);
  });
  hop(actors.kancil, 0.3);
  await speak('kancil', r.firstTry ? `Oh, aku salah! Terima kasih sudah membetulkan.` : `Iya, sekarang aku paham.`);
  /* cara yang benar, diperlihatkan */
  showEq(`${a} − ${b} = ?`);
  if (flip) await checkSub(a, b, w);
  else {
    const more = b - o; chime([523, 659]); flashTray(0);
    await speak('kancil', `Tadi baru ${nid(o)}. Masih kurang ${nid(more)}, ambil dari baki penuh.`);
    for (let i = 0; i < more; i++) { const n = await trayToBasket(); tally(n); await count(n); }
    showEq(`${a} − ${o} − ${more} = ${ans}`, '', 'ok'); await speak('kancil', `Sisa ${nid(ans)} ${w}.`);
  }
  if (r.firstTry) { chime([523, 659, 784, 1047]); confetti(); }
  return r.firstTry;
};

/* ---------- Mesin 3: dua cara (keping) dan campuran ---------- */
const roundTwoWays = async () => {
  const a = rand(7, 9), b = rand(3, 7), ans = a + b, need = 10 - a;
  await fillTrays(a, 'coin'); await fillPlate(b, 'coin');
  showEq(`${a} + ${b} = ?`);
  await speak('cust', `${cust.hi} Roti ${nid(a)} keping, susu ${nid(b)} keping. Ini uangku.`);
  await speak('kancil', `Aku hitung satu-satu, ya.`);
  const all = [...inTray.filter(Boolean), ...onPlate];
  for (let i = 0; i < all.length; i++) { bounceItem(all[i]); tally(i + 1); await count(i + 1); }
  await speak('kancil', `${cap(nid(ans))}! Fiuh, lama sekali.`);
  hop(actors.jali, 0.3); await speak('jali', `${cap(W_EN[a])} plus ${W_EN[need]}, ten! Ten plus ${W_EN[b - need]}!`);
  await speak('murni', `Jali pindahkan ${nid(need)} keping dulu supaya baki penuh.`);
  for (let i = 0; i < need; i++) { const n = await plateToTray(); tally(n); }
  chime([523, 659, 784]); flashTray(0);
  for (let i = 0; i < b - need; i++) { const n = await plateToTray(); tally(n); }
  showEq(`${a} + ${need} + ${b - need} = ${ans}`, '', 'ok');
  await speak('murni', `Sepuluh tambah ${nid(b - need)}, ${nid(ans)}. Sama hasilnya! Cara siapa yang lebih cepat?`);
  const r = await askOpts([{ label: 'Kancil', img: thumbs.kancil, small: 'satu-satu' }, { label: 'Jali', img: thumbs.jali, small: 'genapkan 10' }], 1, async () => {
    hop(actors.kancil, 0.2);
    await speak('murni', `Cara Kancil juga benar, tapi ia menghitung ${nid(ans)} kali. Jali cukup melihat baki penuh, sepuluh, lalu tambah ${nid(b - need)}. Lebih cepat!`);
  });
  await speak('murni', `Betul! Genapkan sepuluh dulu, lalu tambah sisanya. Cepat dan tidak mudah salah.`);
  if (r.firstTry) { chime([523, 659, 784, 1047]); confetti(); }
  return r.firstTry;
};
const roundGuessMix = async () => {
  const add = Math.random() < 0.5;
  if (add) {
    const a = rand(6, 9), b = rand(11 - a, Math.min(9, 18 - a)), ans = a + b;
    await fillTrays(a, 'coin'); await fillPlate(b, 'coin'); showEq(`${a} + ${b} = ?`);
    await speak('cust', `${cust.hi} Aku bayar ${nid(a)} keping, lalu ${nid(b)} keping lagi. Berapa keping semuanya?`);
    await speak('kancil', `Tebak dulu, nanti kita cek bersama.`);
    const g = await askLine(ans); await checkAdd(a, b, 'keping'); await praiseGuess(g, ans); return g === ans;
  }
  const a = rand(11, 18), b = rand(Math.max(3, a - 9), 9), ans = a - b;
  await fillTrays(a, 'coin'); showEq(`${a} − ${b} = ?`);
  await speak('cust', `${cust.hi} Kotak uangku ada ${nid(a)} keping. Kancil, ambil ${nid(b)} keping untuk harga roti.`);
  await speak('kancil', `Sisa berapa keping, ya? Tebak dulu!`);
  const g = await askLine(ans); await checkSub(a, b, 'keping'); await praiseGuess(g, ans); return g === ans;
};

/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  showEq('');
  await speak('murni', 'Istirahat dulu! Ada balon lepas dari pasar. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.6 : 3.6;
      b.position.set((Math.random() * 2 - 1) * w, 0.6, (portrait ? 2.0 : 1.6) + Math.random() * 0.8); b.scale.setScalar(portrait ? 0.9 : 1.1);
      b.userData = { v: 0.8 + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100 * SP);
  });
  await speak('kancil', 'Seru! Yuk, jaga warung lagi.');
};

/* ---------- Ketukan bebas ---------- */
let busy = true;
const onKancil = async () => { if (busy) return; busy = true; hop(actors.kancil); await speak('kancil', 'Aku masih belajar. Ajari aku, ya!'); busy = false; };
const onJali = async () => { if (busy) return; busy = true; hop(actors.jali, 0.3); await speak('jali', pick(['This is a shop!', 'Ten! I like ten.', 'Bread, please!'])); busy = false; };
const onMurni = async () => { if (busy) return; busy = true; await speak('murni', 'Genapkan sepuluh dulu, ya. Itu rahasia warungku.'); busy = false; };
const onCust = async () => { if (busy) return; busy = true; await speak('cust', cust.hi); busy = false; };
const onTray = async (i) => { if (busy) return; busy = true; flashTray(i); await speak('kancil', i === 0 ? 'Baki ini punya sepuluh petak.' : 'Baki kedua untuk sisanya.'); busy = false; };

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Alur bab ---------- */
const STAGE_TXT = ['Tahap 1: tambah lewat sepuluh', 'Tahap 2: kurang lewat sepuluh', 'Tahap 3: keping dan dua cara'];
const setChip = () => { const s = KK.load(BAB).stage; $('#stageChip').textContent = `Tahap ${s + 1} / ${STAGES}`; };
let round = 0, breakDone = false, phase = 'intro';
const closing = async () => {
  phase = 'closing'; showEq(''); await clearAll();
  await speak('murni', 'Warung tutup! Terima kasih, Kancil. Dan terima kasih juga untukmu, guru kecil Kancil!');
  const sky0 = new THREE.Color(0xa6dcea), sky1 = new THREE.Color(0x3d4a7a);
  await tween(1.4, (t) => { hemi.intensity = 1.3 - t * 0.9; sun.intensity = 2.7 - t * 2.3; const c = sky0.clone().lerp(sky1, t); document.body.style.background = '#' + c.getHexString(); });
  await speak('kancil', 'Ayo nyalakan sepuluh lampion!');
  for (let i = 0; i < 10; i++) { const l = lanterns[i]; l.visible = true; l.userData.glow.emissive.setHex(0xffb347); l.userData.glow.emissiveIntensity = 0.9; l.scale.setScalar(0.01); chime([784 + i * 40]); tween(0.3, (t) => l.scale.setScalar(0.85 * t + 0.01)); showEq(String(i + 1)); await count(i + 1); }
  confetti(); hop(actors.kancil, 0.45); hop(actors.jali, 0.3);
  await speak('kancil', 'Sepuluh lampion, penuh seperti baki!'); await speak('jali', 'Thank you! Good night, shop!');
  await speak('murni', 'Besok Kancil boleh jaga warung lagi. Kalian hebat!');
  showEq(''); phase = 'done'; KK.done(BAB, 'Kancil sekarang pandai menggenapkan sepuluh. Warung Bu Murni tutup dengan lampion menyala.');
};
const runGame = async () => {
  busy = true; phase = 'play';
  const st0 = KK.load(BAB);
  await speak('murni', st0.stage === 0 && st0.streak === 0 ? 'Hari ini Kancil magang menjaga warungku. Kancil sering salah hitung. Tolong ajari dia, ya!' : 'Selamat datang lagi di warungku! Ayo bantu Kancil.');
  hop(actors.jali, 0.3); await speak('jali', 'Hello! Welcome to the shop!');
  for (; ;) {
    const s = KK.load(BAB); setChip();
    let ok;
    if (s.stage === 0) ok = await roundGuessAdd();
    else if (s.stage === 1) ok = await roundFix();
    else ok = round % 2 === 0 ? await roundTwoWays() : await roundGuessMix();
    round++;
    const wasDone = s.done; const r = KK.record(BAB, ok, STAGES); const fin = r.finished || (wasDone && ok && r.stage === STAGES - 1 && s.streak === 2);
    await speak('cust', cust.bye); hop(actors.jali, 0.2); await speak('jali', 'Thank you!');
    if (fin) { await closing(); busy = false; return; }
    if (r.advanced) {
      chime([523, 659, 784, 1047, 1319]); confetti(); setChip();
      await speak('murni', ['', 'Kancil makin pintar menambah! Sekarang ada pembeli yang mengambil barang. Kita belajar mengurangi.', 'Hebat! Sekarang kita hitung keping uang. Ada dua cara menghitung.'][r.stage]);
      if (r.stage === 1 && !breakDone) { breakDone = true; await clearAll(); await balloonBreak(); }
    }
    await clearAll(); showEq(''); await nextCustomer();
  }
};

/* ---------- Gambar kecil tokoh untuk pilihan ---------- */
const thumbs = {};
const makeThumbs = async () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(-2, 4, 3); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  for (const [k, o] of [['kancil', B.kancil()], ['jali', B.jali()]]) {
    o.rotation.y = -1.1; sc.add(o); const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length();
    c.position.set(ctr.x, ctr.y + size * 0.2, ctr.z + size * 1.7); c.lookAt(ctr); r.render(sc, c); thumbs[k] = r.domElement.toDataURL(); sc.remove(o);
  }
  r.dispose();
};

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, az: cam.azGoal, moved: false }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* abaikan */ } });
canvas.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 18) down.moved = true; if (down.moved) cam.azGoal = Math.max(-0.4, Math.min(0.4, down.az - dx * 0.004)); });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || d.moved) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
let started = false;
const start = () => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } runGame().catch(e => console.error(e)); };
$('#startBtn').addEventListener('click', start);

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  cam.az += (cam.azGoal - cam.az) * 0.12; placeCam();
  const K = actors.kancil, J = actors.jali;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; K.userData.body.scale.y = 1 + Math.sin(t * 2.2) * 0.012; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  for (const S of [actors.murni, actors.cust]) if (S) { S.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; S.userData.head.rotation.x = S.userData.talk ? Math.sin(t * 13) * 0.05 : 0; S.userData.body.scale.y = 1 + Math.sin(t * 2) * 0.01; }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v / SP; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > (portrait ? 7.5 : 5.5)) b.userData.end(); }
  lanterns.forEach((l, i) => { if (l.visible) { l.rotation.z = Math.sin(t * 1.4 + i) * 0.08; l.userData.glow.emissiveIntensity = 1.6 + Math.sin(t * 3 + i) * 0.12; } });
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

addEventListener('error', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + e.message; });
addEventListener('unhandledrejection', (e) => { const l = $('#loading'); if (l) l.textContent = 'Ada gangguan: ' + (e.reason && e.reason.message || e.reason); });
(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Warung gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { await lim(makeThumbs(), 5000); } catch (e) { console.warn(e); }
  for (const k of ['kancil', 'jali']) if (!thumbs[k]) thumbs[k] = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="${k === 'jali' ? '#2F8FD0' : '#B8733A'}"/></svg>`);
  setChip();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ phase, round, stage: KK.load(BAB).stage, streak: KK.load(BAB).streak, done: KK.load(BAB).done, question: cur ? { ...cur } : null }),
    answerCorrect: () => {
      if (!cur) return false;
      if (cur.type === 'line') { const r = document.querySelector('.kk-line input'); r.value = cur.answer; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); return true; }
      const bs = document.querySelectorAll('.kk-opt'); bs[cur.correct].click(); return true;
    },
    answerWrong: () => { if (!cur || cur.type !== 'ask') return false; const bs = [...document.querySelectorAll('.kk-opt')]; const i = bs.findIndex((b, j) => j !== cur.correct); bs[i].click(); return true; },
    setStage: (stage) => KK.save(BAB, { stage, streak: 0, done: false }),
    balloonBreak, actors, world, cam,
  };
  frame();
  if (QS.has('play')) start();
})();
