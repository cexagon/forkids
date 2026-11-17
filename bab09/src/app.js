/* Kota Kancil, Bab 09: Kantung Ajaib Timun Mas.
   Anak menjadi guru Kancil: kelompok sama banyak, hitung loncat 2/5/10, genap-ganjil, larik. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const BAB = 9, STAGES = 3;
const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const FAST = QS.has('fast');
const wait = (ms) => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 40) : ms));
const KK = window.KK;

/* ---------- Angka ---------- */
const ID = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
const numId = (n) => { if (n <= 11) return ID[n]; if (n < 20) return ID[n - 10] + ' belas'; const t = Math.floor(n / 10), u = n % 10; return (t === 1 ? 'sepuluh' : ID[t] + ' puluh') + (u ? ' ' + ID[u] : ''); };
const EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const numEn = (n) => n <= 20 ? EN[n] : (n < 30 ? 'twenty-' + EN[n - 20] : n === 30 ? 'thirty' : String(n));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rep = (s, g) => Array(g).fill(s).join('+');

/* ---------- Simpanan suara (dari Pasar) ---------- */
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
const camera = new THREE.PerspectiveCamera(28, 1, 1, 400);
scene.add(new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3));
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-7, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const loader = new GLTFLoader(); const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync(`../pasar3d/models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace; o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => { if (FAST) dur = Math.min(dur, 0.05); tweens.push({ t: 0, dur, fn, ease, res }); });
const bounce = (o, amt = 0.18) => { const y0 = o.userData.y0 ?? (o.userData.y0 = o.position.y); const s0 = o.userData.s0 ?? (o.userData.s0 = o.scale.x); return tween(0.38, (t) => { const k = Math.sin(t * Math.PI); o.position.y = y0 + k * amt; o.scale.setScalar(s0 * (1 + k * 0.15)); }, (t) => t); };
const hop = (a, h = 0.35) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Isi kantung ajaib ---------- */
const BAGS = [
  { item: 'biji', name: 'biji timun', unit: 'biji', tie: 0x4e9a3c, patch: 'kebun timun', laugh: 'Wah, timunnya lebat! Aku tersangkut. Hahaha!' },
  { item: 'jarum', name: 'jarum ajaib', unit: 'jarum', tie: 0x2f8fd0, patch: 'hutan bambu', laugh: 'Aduh, bambunya rapat sekali! Hihihi!' },
  { item: 'garam', name: 'garam', unit: 'butir', tie: 0xffffff, patch: 'kolam', laugh: 'Byur! Airnya segar. Hahaha!' },
  { item: 'terasi', name: 'terasi', unit: 'potong', tie: 0xe8574b, patch: 'lumpur', laugh: 'Lumpurnya lengket! Kakiku licin. Hahaha!' },
];

/* ---------- Tata letak ---------- */
const LAY = {
  land: { path: -1.9, pathLen: 15, patchX: [-3.3, -1.1, 1.1, 3.3], ps: 1, giant: -5.6, gs: 0.85, timun: 5.5, ts: 1.3, kancil: [-4.6, 2.3], jali: [4.9, 2.9], ks: 1.35, board: [0, 1.6] },
  port: { path: -2.3, pathLen: 6.4, patchX: [-1.5, -0.5, 0.5, 1.5], ps: 0.55, giant: -2.4, gs: 0.5, timun: 2.45, ts: 0.8, kancil: [-2.05, -0.75], jali: [2.2, 0.45], ks: 0.85, board: [0, 1.5] },
};
let L = LAY.land, portrait = false;
const actors = {}; const patches = []; let pathMesh = null, jaliPost = null; const boardG = new THREE.Group(); world.add(boardG);
let giantStep = -1; let shown = 0;

const buildWorld = async () => {
  world.add(B.meadow()); world.add(B.sea());
  for (const [x, z, s] of [[-7.2, -4.4, 1.1], [7.1, -4.2, 1.2], [-7.5, 3.8, 0.9], [7.4, 4.0, 0.85]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  try { await Promise.race([Promise.all([[-6.3, 4.6], [6.4, 4.8], [-3.5, -4.6], [3.8, -4.7]].map(([x, z]) => inst('bush', 2.4, [x, 0.02, z]))), wait(8000)]); } catch (e) { /* hiasan saja */ }
  for (let i = 0; i < 4; i++) { const p = B.patch(i); p.visible = false; world.add(p); patches.push(p); }
  const k = B.kancil(); k.rotation.y = -0.6; world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const post = new THREE.Group(); post.add(B.cyl(0.07, 0.09, 1.25, B.PAL.woodDark, [0, 0.62, 0], 10)); post.add(B.box(0.75, 0.1, 0.16, B.PAL.wood, [0, 1.25, 0])); world.add(post); jaliPost = post;
  const j = B.jali(); j.rotation.y = -Math.PI * 0.7; world.add(j); actors.jali = j; tap(j, () => onJali());
  const t = B.warga({ dress: 0x8cc63f, head: 0xffcc33 }); t.rotation.y = -0.5; world.add(t); actors.timun = t; tap(t, () => onTimun());
  t.userData.basket.add(B.sack(0x4e9a3c)); t.userData.basket.children.at(-1).scale.setScalar(0.8);
  const g = B.giant(); g.rotation.y = 0.5; world.add(g); actors.giant = g; tap(g, () => onGiant());
};

/* ---------- Kamera ---------- */
const cam = { az: 0, el: 0.55, target: new THREE.Vector3(), dist: 20 };
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9; L = portrait ? LAY.port : LAY.land; document.body.classList.toggle('portrait', portrait);
  camera.fov = portrait ? 34 : 28; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 2.75 : 7.6, needH = portrait ? 3.9 : 4.3;
  cam.dist = Math.max(needW / ht, needH / vt); cam.el = portrait ? 0.86 : 0.62;
  cam.target.set(0, 0.2, portrait ? 1.05 : 1.15);
  if (pathMesh) world.remove(pathMesh); pathMesh = B.path(L.pathLen, portrait ? 0.9 : 1.3); pathMesh.position.z = L.path; world.add(pathMesh);
  patches.forEach((p, i) => { p.position.set(L.patchX[i], 0, L.path); p.scale.setScalar(p.visible ? L.ps : 0.001); p.userData.s = L.ps; });
  if (!actors.kancil) return;
  actors.kancil.position.set(L.kancil[0], 0.03, L.kancil[1]); actors.kancil.scale.setScalar(L.ks);
  jaliPost.position.set(L.jali[0], 0.03, L.jali[1]); jaliPost.scale.setScalar(L.ks * 0.75);
  actors.jali.position.set(L.jali[0], 0.03 + 1.3 * L.ks * 0.75, L.jali[1]); actors.jali.scale.setScalar(L.ks);
  actors.timun.position.set(L.timun, 0.03, L.path); actors.timun.scale.setScalar(L.ts);
  actors.giant.position.set(giantX(), 0.03, L.path - (portrait ? 0.1 : 0.15)); actors.giant.scale.setScalar(L.gs);
  boardG.position.set(L.board[0], 0, L.board[1]); boardG.scale.setScalar(portrait ? 0.92 : 1.2);
};
const giantX = () => giantStep < 0 ? L.giant : L.patchX[giantStep];
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung bicara ---------- */
const bubble = $('#bubble'); const NAMES = { kancil: 'Kancil', jali: 'Jali', timun: 'Timun Mas', giant: 'Buta Ijo' };
let lastPrompt = null;
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};
const tally = $('#tally');
const showTally = (t) => { tally.textContent = t; tally.hidden = false; };
const hideTally = () => { tally.hidden = true; };

/* ---------- Papan hitung (larik di atas tikar) ---------- */
let board = null;
const numTex = {};
const numSprite = (n) => {
  if (!numTex[n]) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#e8742a'; x.beginPath(); x.arc(64, 64, 58, 0, 7); x.fill(); x.lineWidth = 8; x.strokeStyle = '#fff'; x.stroke(); x.fillStyle = '#fff'; x.font = '800 64px "Baloo 2", Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; numTex[n] = t; }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: numTex[n], depthTest: false })); s.scale.setScalar(0.5); s.renderOrder = 5; return s;
};
const clearBoard = () => { while (boardG.children.length) boardG.remove(boardG.children[0]); board = null; };

/* g kelompok, tiap kelompok s benda. Kelompok = baris (belakang ke depan). Isi 10 dilipat jadi 2 baris isi 5. */
const showArray = async (g, s, kind, bagTie) => {
  clearBoard();
  const ten = s === 10, cols = ten ? 5 : s, sx = 0.56, dz = ten ? 0.42 : 0.62, gap = ten ? 0.5 : 0;
  const rows = []; let z = 0;
  for (let r = 0; r < g; r++) { const row = []; for (let i = 0; i < s; i++) { const sub = ten ? Math.floor(i / 5) : 0, ci = ten ? i % 5 : i; row.push([(ci - (cols - 1) / 2) * sx, z + sub * dz]); } rows.push({ pos: row, zMid: z + (ten ? dz / 2 : 0) }); z += ten ? dz * 2 + gap : dz; }
  const depth = z - (ten ? dz + gap : dz); const z0 = -depth / 2;
  const left = -(cols - 1) / 2 * sx, right = (cols - 1) / 2 * sx;
  const m = B.mat2(cols * sx + 1.8, depth + 0.9); m.position.x = -0.1; boardG.add(m);
  board = { rows: [], bags: [], g, s, kind, right, z0, depth, sprites: [] };
  for (let r = 0; r < g; r++) {
    const R = rows[r]; const bag = B.sack(bagTie); bag.position.set(left - 0.72, 0, z0 + R.zMid); bag.scale.setScalar(ten ? 1.05 : 0.9); boardG.add(bag); board.bags.push(bag);
    const items = [];
    for (const [x, zz] of R.pos) { const it = B.item(kind); it.position.set(x, 0, z0 + zz); it.scale.setScalar(0.001); boardG.add(it); items.push(it); }
    board.rows.push({ items, z: z0 + R.zMid });
  }
  play('placement-c');
  for (const row of board.rows) { row.items.forEach(it => tween(0.3, (t) => it.scale.setScalar(Math.max(0.001, t)))); await wait(120); }
  await wait(250);
};
/* Untuk genap-ganjil: benda acak dulu, lalu dipasangkan dua-dua. */
const showScatter = async (n, kind) => {
  clearBoard();
  const cols = Math.ceil(n / 2), sx = Math.min(0.56, (portrait ? 4.1 : 6.2) / cols), sc = Math.min(1, sx / 0.5);
  const m = B.mat2(cols * sx + 0.9, 1.9); boardG.add(m);
  board = { rows: [], bags: [], n, kind, pairs: [], paired: false, right: (cols - 1) / 2 * sx, z0: -0.5, depth: 1, sprites: [], items: [] };
  for (let i = 0; i < n; i++) {
    const j = Math.floor(i / 2), k = i % 2; const it = B.item(kind); const tx = (j - (cols - 1) / 2) * sx, tz = (k - 0.5) * 0.62;
    it.position.set((Math.random() - 0.5) * cols * sx * 0.95, 0, (Math.random() - 0.5) * 1.2); it.rotation.y = Math.random() * 6; it.userData.to = [tx, tz]; it.userData.sc = sc; it.scale.setScalar(0.001); boardG.add(it); board.items.push(it);
  }
  for (let i = 0; i < cols; i++) board.pairs.push(board.items.slice(i * 2, i * 2 + 2));
  play('placement-c'); board.items.forEach(it => tween(0.3, (t) => it.scale.setScalar(Math.max(0.001, t * sc)))); await wait(450);
};
const pairUp = async () => {
  if (!board || board.paired) return; board.paired = true; play('rotate');
  await Promise.all(board.items.map(it => { const fx = it.position.x, fz = it.position.z, r0 = it.rotation.y; return tween(0.6, (t) => { it.position.x = fx + (it.userData.to[0] - fx) * t; it.position.z = fz + (it.userData.to[1] - fz) * t; it.rotation.y = r0 * (1 - t); }); }));
  for (const p of board.pairs) if (p.length === 2) { const bar = B.box(0.06, 0.03, 0.5, 0x4e9a3c, [p[0].userData.to[0], 0.03, 0]); boardG.add(bar); }
  const lone = board.pairs.find(p => p.length === 1);
  if (lone) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 24), new THREE.MeshBasicMaterial({ color: 0xff2e7a })); ring.rotation.x = -Math.PI / 2; ring.position.set(lone[0].userData.to[0], 0.05, lone[0].userData.to[1]); boardG.add(ring); await bounce(lone[0], 0.3); await bounce(lone[0], 0.3); }
};
const putSprite = (n, z) => { const sp = numSprite(n); sp.position.set(board.right + 0.62, 0.42, z); sp.scale.setScalar(0.001); boardG.add(sp); board.sprites.push(sp); tween(0.25, (t) => sp.scale.setScalar(Math.max(0.001, 0.5 * t))); };
const clearSprites = () => { if (!board) return; board.sprites.forEach(s => boardG.remove(s)); board.sprites = []; };
/* hitung loncat: tiap baris melompat bersama, angka jumlah sementara diucapkan */
const skipCount = async () => {
  clearSprites(); const s = board.s;
  for (let r = 0; r < board.rows.length; r++) {
    const row = board.rows[r]; const c = (r + 1) * s; row.items.forEach(it => bounce(it, 0.25)); bounce(board.bags[r], 0.15); play('placement-b', 0.9 + r * 0.06);
    putSprite(c, row.z); showTally(String(c));
    await Promise.all([say(numId(c)), wait(800)]);
  }
};
/* hitung satu-satu */
const countOne = async () => {
  clearSprites(); let c = 0;
  for (const row of board.rows) for (const it of row.items) { c++; bounce(it, 0.22); play('placement-a', 0.9 + (c % 5) * 0.05); showTally(String(c)); say(numId(c)); await wait(620); }
  await wait(400);
};
const flashBags = async () => { for (const b of board.bags) { bounce(b, 0.25); await wait(260); } };
const flashRows = async () => { for (const row of board.rows) { row.items.forEach(it => bounce(it, 0.2)); await wait(380); } };

/* ---------- Gambar kecil untuk pilihan ---------- */
const thumbs = {};
const makeThumbs = async () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(2, 4, 3); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 30);
  const shot = (o) => { sc.add(o); const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length(); c.position.set(ctr.x + size * 0.35, ctr.y + size * 0.35, ctr.z + size * 1.6); c.lookAt(ctr); r.render(sc, c); const u = r.domElement.toDataURL(); sc.remove(o); return u; };
  const k = B.kancil(); k.rotation.y = -1.2; thumbs.kancil = shot(k);
  const t = B.warga({ dress: 0x8cc63f, head: 0xffcc33 }); thumbs.timun = shot(t);
  const both = new THREE.Group(); const k2 = B.kancil(); k2.rotation.y = -0.9; k2.position.x = -0.55; both.add(k2); const t2 = B.warga({ dress: 0x8cc63f, head: 0xffcc33 }); t2.position.x = 0.45; t2.scale.setScalar(0.9); both.add(t2); thumbs.both = shot(both);
  r.dispose();
};
const dotsImg = (n, odd) => {
  const cv = document.createElement('canvas'); cv.width = 160; cv.height = 110; const x = cv.getContext('2d');
  const cols = Math.ceil(n / 2);
  for (let j = 0; j < cols; j++) for (let k = 0; k < 2; k++) { const i = j * 2 + k; if (i >= n) continue; const cx = 30 + j * 50, cy = 30 + k * 50; x.fillStyle = '#4e9a3c'; x.beginPath(); x.arc(cx, cy, 16, 0, 7); x.fill(); }
  x.strokeStyle = '#3b2614'; x.lineWidth = 5; for (let j = 0; j < Math.floor(n / 2); j++) { x.beginPath(); x.moveTo(30 + j * 50, 30); x.lineTo(30 + j * 50, 80); x.stroke(); }
  if (odd) { x.strokeStyle = '#ff2e7a'; x.lineWidth = 5; x.beginPath(); x.arc(30 + (cols - 1) * 50, 30, 23, 0, 7); x.stroke(); }
  return cv.toDataURL();
};

/* ---------- Mesin soal ---------- */
let cur = null; let solved = 0; let qi = 0; let lastGS = '';
const ask = (o) => { cur = { correct: o.correct, n: o.options.length }; return KK.ask(o).then(r => { cur = null; return r; }); };
const line = (o) => { cur = { line: true }; return KK.line(o).then(v => { cur = null; return v; }); };
const bag = () => BAGS[solved % 4];
const gen = (stage, forFix) => {
  let g, s, tries = 0;
  do {
    if (stage === 0) { if (Math.random() < 0.6) { g = rand(3, 6); s = 2; } else { g = rand(forFix ? 2 : 1, 3); s = 10; } }
    else if (stage === 1) { if (Math.random() < 0.6) { g = rand(2, 4); s = 5; } else { g = rand(3, 4); s = rand(2, 4); } }
    else { g = pick([3, 4, 3, 4, 2]); s = pick([3, 4, 4, 5]); }
  } while (`${g}x${s}` === lastGS && ++tries < 8);
  lastGS = `${g}x${s}`; return { g, s };
};
const kindFor = (stage, s) => (bag().item === 'biji' && stage === 0 && s === 2) ? 'timun' : bag().item;
const describe = (stage, g, s, kind) => {
  if (kind === 'timun') return `Tiap tabur tumbuh ${numId(s)} timun. Timun Mas menabur ${numId(g)} kali.`;
  if (stage === 2) return `Isi kantung ${bag().name} disusun ${numId(g)} baris. Tiap baris ${numId(s)}.`;
  return g === 1 ? `Ada satu kantung ${bag().name}, isinya ${numId(s)}.` : `Ada ${numId(g)} kantung ${bag().name}. Tiap kantung isi ${numId(s)}.`;
};
const unitOf = (kind) => kind === 'timun' ? 'timun' : bag().unit;
const jaliSkip = async (g, s) => { if ([2, 5, 10].includes(s)) { const seqEn = Array.from({ length: Math.min(g, 4) }, (_, i) => cap(numEn((i + 1) * s))).join(', '); await speak('jali', `${seqEn}! Count by ${numEn(s)}.`); } else await speak('jali', `${cap(numEn(g * s))}!`); };

/* 1. Tebak dulu, lalu cek */
const qGuess = async (stage) => {
  const { g, s } = gen(stage); const kind = kindFor(stage, s); const T = g * s;
  await showArray(g, s, kind, bag().tie);
  lastPrompt = `${describe(stage, g, s, kind)} Tebak dulu, semuanya berapa?`;
  await speak('timun', lastPrompt);
  const v = await line({ min: 0, max: stage === 0 ? 30 : 20, start: Math.min(stage === 0 ? 30 : 20, s) });
  await speak('kancil', `Tebakanmu ${numId(v)}. Ayo kita cek, loncat ${numId(s)}-${numId(s)}!`);
  await skipCount();
  if (v === T) { chime([523, 659, 784]); await speak('timun', `Semuanya ${numId(T)} ${unitOf(kind)}. Tebakanmu pas sekali!`); }
  else await speak('timun', `Semuanya ${numId(T)} ${unitOf(kind)}. Tebakanmu ${numId(v)}. Hebat, kamu mau mengecek!`);
  await jaliSkip(g, s);
  hideTally(); return true;
};

/* 2. Betulkan Kancil: g kantung isi s dijawab g + s */
const qFix = async (stage) => {
  const { g, s } = gen(stage, true); const kind = kindFor(stage, s); const T = g * s;
  await showArray(g, s, kind, bag().tie);
  await speak('timun', describe(stage, g, s, kind));
  await speak('jali', kind === 'biji' ? 'Bag! Seed!' : (g > 1 ? 'Bags!' : 'Bag!'));
  actors.kancil.userData.mood = 'think'; hop(actors.kancil, 0.3); flashBags();
  showTally(`${g} + ${s} = ${g + s}`);
  await speak('kancil', `Aku tahu! ${cap(numId(g))} ${kind === 'timun' ? 'kali tabur' : stage === 2 ? 'baris' : 'kantung'}, isi ${numId(s)}. ${cap(numId(g))} tambah ${numId(s)}, jadi ${numId(g + s)}!`);
  lastPrompt = `Betulkah kata Kancil? Bantu Kancil. Semuanya berapa ${unitOf(kind)}?`;
  await speak('timun', lastPrompt);
  let wrong3 = T + s; if (wrong3 > 30 || wrong3 === g + s) wrong3 = T - s; if (wrong3 <= 0 || wrong3 === g + s || wrong3 === T) wrong3 = T + 1;
  const optsRaw = [{ label: String(g + s), small: `${g}+${s}`, v: g + s }, { label: String(T), small: rep(s, g), v: T }, { label: String(wrong3), small: wrong3 === T + s ? rep(s, g + 1) : wrong3 === T - s ? rep(s, g - 1) : '', v: wrong3 }];
  const opts = shuffle(optsRaw); const correct = opts.findIndex(o => o.v === T);
  const r = await ask({
    options: opts.map(o => ({ label: o.label, small: o.small })), correct,
    onWrong: async (i) => {
      if (opts[i].v === g + s) { await flashBags(); await speak('kancil', `Hmm, ${numId(g)} itu banyaknya ${kind === 'timun' ? 'tabur' : stage === 2 ? 'baris' : 'kantung'}, bukan isinya. Kita harus menjumlah isi SEMUA ${kind === 'timun' ? 'tabur' : stage === 2 ? 'baris' : 'kantung'}.`); }
      else { await flashRows(); await speak('kancil', `Hitung lagi. Ada ${numId(g)} ${stage === 2 ? 'baris' : 'kelompok'}, masing-masing ${numId(s)}. ${cap(numId(s))} ditulis ${numId(g)} kali.`); }
    },
  });
  showTally(rep(s, g)); await speak('timun', `Betul! Kita loncat ${numId(s)}-${numId(s)}.`);
  await skipCount(); showTally(`${rep(s, g)} = ${T}`);
  hop(actors.kancil, 0.3); await speak('kancil', `Oh, aku salah! Bukan ${numId(g)} tambah ${numId(s)}. ${cap(numId(s))} ditambah ${numId(g)} kali, semuanya ${numId(T)}. Terima kasih, Guru!`);
  hideTally(); return r.firstTry;
};

/* 3a. Dua cara: satu-satu atau meloncat per kelompok */
const qWays = async (stage) => {
  let g, s; if (stage === 0) { g = rand(3, 5); s = 2; } else { g = rand(2, 4); s = 5; }
  lastGS = `${g}x${s}`; const kind = kindFor(stage, s); const T = g * s;
  await showArray(g, s, kind, bag().tie);
  await speak('timun', `${describe(stage, g, s, kind)} Kancil dan aku menghitung dengan cara berbeda.`);
  await speak('kancil', 'Aku hitung satu-satu, ya.'); await countOne();
  await speak('timun', `Aku meloncat ${numId(s)}-${numId(s)}.`); await skipCount();
  lastPrompt = `Kancil dapat ${numId(T)}. Aku juga dapat ${numId(T)}. Siapa yang benar? Kancil, Timun Mas, atau dua-duanya?`;
  showTally(`${T}`); await speak('timun', lastPrompt);
  const r = await ask({
    options: [{ img: thumbs.kancil, small: 'Kancil' }, { img: thumbs.timun, small: 'Timun Mas' }, { img: thumbs.both, small: 'Dua-duanya' }], correct: 2,
    onWrong: async () => { await speak('kancil', `Lihat angkanya. Kancil ${numId(T)}, Timun Mas juga ${numId(T)}. Caranya beda, hasilnya sama!`); },
  });
  await speak('timun', `Betul, dua-duanya benar! Meloncat ${numId(s)}-${numId(s)} lebih cepat daripada satu-satu.`);
  await jaliSkip(g, s);
  hideTally(); return r.firstTry;
};

/* 3b. Genap atau ganjil: pasangkan dua-dua */
const qParity = async () => {
  const n = rand(5, 20); const odd = n % 2 === 1; const kind = 'biji';
  await showScatter(n, kind);
  lastPrompt = `Timun Mas menumpahkan ${numId(n)} biji. Bisakah semuanya berpasangan? Genap, semua punya pasangan. Ganjil, ada satu yang sendirian.`;
  showTally(String(n)); await speak('timun', lastPrompt);
  const r = await ask({
    options: [{ img: dotsImg(6, false), label: 'Genap', small: 'semua berpasangan' }, { img: dotsImg(5, true), label: 'Ganjil', small: 'ada yang sendiri' }], correct: odd ? 1 : 0, cols: 2,
    onWrong: async () => { await pairUp(); await speak('kancil', odd ? 'Lihat, ada satu biji yang sendirian, tidak punya pasangan. Jadi ganjil.' : 'Lihat, semua biji punya pasangan, tidak ada yang sendirian. Jadi genap.'); },
  });
  await pairUp();
  const pairs = Math.floor(n / 2);
  await speak('timun', `Ayo hitung pasangannya, loncat dua-dua.`);
  for (let i = 0; i < pairs; i++) { board.pairs[i].forEach(it => bounce(it, 0.22)); showTally(String((i + 1) * 2)); await Promise.all([say(numId((i + 1) * 2)), wait(560)]); }
  showTally(String(n));
  await speak('kancil', odd ? `${cap(numId(pairs * 2))}, tambah satu yang sendirian, jadi ${numId(n)}. ${cap(numId(n))} itu ganjil!` : `${cap(numId(n))} biji, semua berpasangan. ${cap(numId(n))} itu genap!`);
  await speak('jali', `${cap(numEn(n))}! Two, four, six...`);
  hideTally(); return r.firstTry;
};

/* 3c. Cocokkan larik dengan penjumlahan berulang */
const qMatch = async () => {
  const r = pick([3, 4, 3, 4, 2]), c = pick([3, 4, 5, 4]); lastGS = `${r}x${c}`; const kind = bag().item; const T = r * c;
  await showArray(r, c, kind, bag().tie);
  lastPrompt = `Lihat larik ini. Ada ${numId(r)} baris, tiap baris ${numId(c)}. Mana penjumlahan yang cocok?`;
  await speak('timun', lastPrompt);
  const optsRaw = [{ label: rep(c, r), ok: 1 }, { label: `${r}+${c}` }, { label: rep(c, r > 2 ? r - 1 : r + 1) }];
  const opts = shuffle(optsRaw); const correct = opts.findIndex(o => o.ok);
  const res = await ask({
    options: opts.map(o => ({ label: o.label })), correct, cols: portrait ? 1 : 3,
    onWrong: async (i) => { await flashRows(); await speak('kancil', opts[i].label === `${r}+${c}` ? `${cap(numId(r))} tambah ${numId(c)} terlalu sedikit. Tiap baris isinya ${numId(c)}, dan ada ${numId(r)} baris. Jadi ${numId(c)} ditulis ${numId(r)} kali.` : `Hitung barisnya dulu: ada ${numId(r)} baris. Jadi ${numId(c)} ditulis ${numId(r)} kali.`); },
  });
  showTally(rep(c, r)); await speak('timun', `Betul! ${cap(numId(r))} baris isi ${numId(c)}. Kita cek.`);
  board.s = c; await skipCount(); showTally(`${rep(c, r)} = ${T}`);
  await speak('kancil', `${rep(c, r).split('+').map(Number).map(numId).join(' tambah ')}, sama dengan ${numId(T)}.`);
  hideTally(); return res.firstTry;
};

const TYPES = [
  [qGuess, qFix, null],
  [qGuess, qFix, qWays],
  [qMatch, qFix, qGuess],
];
let typeName = '';
const runQ = async (stage) => {
  let fn = TYPES[stage][qi % 3];
  if (!fn) fn = (Math.floor(qi / 3) % 2 === 0) ? qParity : qWays;
  qi++; typeName = fn === qGuess ? 'tebak' : fn === qFix ? 'betulkan' : fn === qWays ? 'duacara' : fn === qParity ? 'genapganjil' : 'larik';
  return fn(stage);
};

/* ---------- Cerita: kantung ditabur, raksasa tersangkut lalu tertawa ---------- */
const throwBag = async () => {
  const i = solved % 4, B0 = BAGS[i];
  if (i === 0 && patches.some(p => p.visible)) {
    await speak('giant', 'Hahaha! Lagi, lagi! Ayo main lagi!');
    patches.forEach(p => { p.visible = false; p.scale.setScalar(0.001); });
    const x0 = actors.giant.position.x; giantStep = -1; await tween(0.7, (t) => { actors.giant.position.x = x0 + (L.giant - x0) * t; });
  }
  clearBoard(); bubble.hidden = true;
  hop(actors.timun, 0.25); play('rotate');
  const s = B.sack(B0.tie); world.add(s); const from = actors.timun.position.clone(); from.y += 1.2 * L.ts; const to = patches[i].position.clone();
  await tween(0.7, (t) => { s.position.lerpVectors(from, to, t); s.position.y += Math.sin(t * Math.PI) * 1.5; s.rotation.z = t * 8; s.scale.setScalar(L.ps * (1 - t * 0.6)); });
  world.remove(s); const p = patches[i]; p.visible = true; play('placement-c', 0.8);
  await tween(0.45, (t) => p.scale.setScalar(Math.max(0.001, L.ps * (t * 1.15 - Math.sin(t * Math.PI) * 0.1))));
  p.scale.setScalar(L.ps);
  const g = actors.giant, x0 = g.position.x; giantStep = i; const x1 = giantX();
  await tween(0.9, (t) => { g.position.x = x0 + (x1 - x0) * t; g.userData.body.position.y = Math.abs(Math.sin(t * Math.PI * 4)) * 0.25; }, (t) => t);
  g.userData.body.position.y = 0; bounce(g, 0.1);
  await speak('giant', B0.laugh);
  solved++;
};

/* ---------- Alur bab ---------- */
let running = false;
const stageChip = () => { const s = KK.load(BAB); $('#stage').textContent = `Tahap ${Math.min(3, s.stage + 1)}`; };
const loop = async () => {
  if (running) return; running = true; let breakDone = false, n = 0;
  for (;;) {
    const before = KK.load(BAB);
    const firstTry = await runQ(before.stage);
    const r = KK.record(BAB, firstTry, STAGES);
    const fin = r.finished || (before.stage === STAGES - 1 && before.streak === 2 && firstTry);
    stageChip(); n++;
    await throwBag();
    if (fin) { await ending(); running = false; return; }
    if (r.advanced) { chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.45); await speak('kancil', ['', 'Hebat! Sekarang kantungnya isi lima. Kita loncat lima-lima!', 'Hebat! Sekarang kita susun jadi larik: baris dan kolom.'][r.stage]); }
    if (!breakDone && n >= 4) { breakDone = true; await balloonBreak(); }
  }
};
const ending = async () => {
  chime([523, 659, 784, 1047]); confetti();
  const g = actors.giant; await tween(0.6, (t) => { g.userData.body.rotation.x = -t * 0.25; g.userData.body.position.y = -t * 0.25; });
  await speak('giant', 'Hah, hah... Aku capek sekali! Kamu menang, Timun Mas. Hahaha!');
  await speak('timun', 'Kamu lucu, Buta Ijo! Ayo istirahat. Kita makan timun bersama!');
  await showArray(3, 4, 'timun', 0x4e9a3c);
  await speak('kancil', 'Tiga baris, tiap baris empat timun. Aku bisa sekarang!'); await skipCount();
  await speak('kancil', 'Empat, delapan, dua belas. Dua belas timun, cukup untuk semua!');
  await speak('jali', 'The giant can not run anymore! Bag, seed, two, five, ten. Well done!');
  hideTally(); bubble.hidden = true;
  KK.done(BAB, 'Buta Ijo tertawa, lalu makan timun bersama Timun Mas, Kancil, dan Jali.');
  const watch = setInterval(() => { if (!document.querySelector('.kk-done')) { clearInterval(watch); g.userData.body.rotation.x = 0; g.userData.body.position.y = 0; loop(); } }, 500);
};
const intro = async () => {
  await speak('kancil', 'Ini Timun Mas. Dia membawa empat kantung ajaib.');
  hop(actors.giant, 0.3); await speak('giant', 'Halo! Aku Buta Ijo, raksasa hijau. Ayo main kejar-kejaran!');
  hop(actors.jali, 0.25); await speak('jali', 'A giant! Run, run!');
  await speak('timun', 'Ayo! Tiap kantung yang kutabur jadi rintangan lucu. Tapi aku harus tahu isinya dulu.');
  await speak('kancil', 'Aku belum pandai menghitung banyak. Ajari aku, ya!');
};

const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloons = [];
const balloonBreak = async () => {
  await speak('kancil', 'Waktunya istirahat! Ada balon lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.5 : 4.2;
      b.position.set((Math.random() * 2 - 1) * w, 0.4, L.board[1] + Math.random() * 0.8); b.scale.setScalar(portrait ? 0.95 : 1.25);
      b.userData = { v: (FAST ? 6 : 0.8) + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * (FAST ? 50 : 1100));
  });
  await speak('kancil', 'Seru, ya! Yuk, lanjut membantu Timun Mas.');
};

/* ---------- Ketuk tokoh ---------- */
let busyTap = false;
const talkTap = async (fn) => { if (busyTap || cur === null && running && !bubble.hidden && false) return; busyTap = true; try { await fn(); } finally { busyTap = false; } };
const onKancil = () => talkTap(async () => { play('toggle'); hop(actors.kancil); await speak('kancil', lastPrompt && cur ? lastPrompt : 'Ajari aku menghitung, ya!'); });
const onJali = () => talkTap(async () => { play('toggle'); hop(actors.jali, 0.3); await speak('jali', pick(['Bag!', 'Seed!', 'Giant!', 'Run, run!', 'Two, four, six!', 'Five, ten, fifteen!', 'Ten, twenty, thirty!'])); });
const onGiant = () => talkTap(async () => { play('rotate'); hop(actors.giant, 0.25); await speak('giant', pick(['Hahaha! Ayo kejar aku!', 'Aku raksasa yang suka main!', 'Timun itu enak sekali!'])); });
const onTimun = () => talkTap(async () => { play('toggle'); hop(actors.timun, 0.2); await speak('timun', 'Kantungku ada empat: biji timun, jarum, garam, dan terasi.'); });

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 20) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
let started = false;
const start = async (skipIntro) => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } if (!skipIntro) await intro(); loop(); };
$('#startBtn').addEventListener('click', () => start(false));

/* ---------- Putaran ---------- */
const clock = new THREE.Clock(); const v = new THREE.Vector3();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  placeCam();
  const K = actors.kancil, J = actors.jali, T = actors.timun, Gt = actors.giant;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  if (T) { T.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; T.userData.head.rotation.x = T.userData.talk ? Math.sin(t * 13) * 0.05 : 0; }
  if (Gt) { Gt.userData.head.rotation.z = Math.sin(t * 0.9) * 0.06 + (Gt.userData.talk ? Math.sin(t * 10) * 0.08 : 0); Gt.userData.arms[0].rotation.z = 0.45 + Math.sin(t * 1.4) * 0.12 + (Gt.userData.talk ? 0.5 : 0); Gt.userData.arms[1].rotation.z = -0.45 - Math.sin(t * 1.4) * 0.12 - (Gt.userData.talk ? 0.5 : 0); }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > (portrait ? 8 : 6.5)) b.userData.end(); }
  renderer.render(scene, camera);
  if (!tally.hidden && board) { v.set(0, 0.5, board.z0 - 0.55); boardG.localToWorld(v); v.project(camera); tally.style.transform = `translate(calc(${(v.x * 0.5 + 0.5) * innerWidth}px - 50%), calc(${(-v.y * 0.5 + 0.5) * innerHeight}px - 100%))`; }
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Jalan setapak gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { await lim(makeThumbs(), 6000); } catch (e) { console.warn(e); }
  const dot = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#8cc63f"/></svg>');
  for (const k of ['kancil', 'timun', 'both']) if (!thumbs[k]) thumbs[k] = dot;
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  stageChip();
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ ...KK.load(BAB), type: typeName, asking: cur, solved, running, giantStep }),
    answerCorrect: () => { if (!cur) return false; if (cur.line) { document.querySelector('.kk-ok').click(); return true; } document.querySelectorAll('.kk-opt')[cur.correct].click(); return true; },
    answerWrong: () => { if (!cur || cur.line) return false; const i = (cur.correct + 1) % cur.n; document.querySelectorAll('.kk-opt')[i].click(); return true; },
    toStage: (s) => KK.save(BAB, { stage: s, streak: 0, done: false }),
    popAll: () => balloons.slice().forEach(b => b.userData.tap && b.userData.tap()),
    actors, cam, balloonBreak,
  };
  frame();
  if (QS.has('play')) start(true);
})();
