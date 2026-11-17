/* Kota Kancil, Bab 05: Naik Angkot ke Sekolah. Jalan lurus = garis bilangan 0..100. Halte tiap 10, rumah satu-satu.
   Angkot melaju sepuluh-sepuluh, Kancil berjalan satu-satu. Anak menjadi guru bagi Kancil. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const BAB = 5, STAGES = 3;
const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
let SP = QS.has('fast') ? 0.08 : 1;
const wait = (ms) => new Promise(r => setTimeout(r, ms * SP));

/* ---------- Angka ---------- */
const SAT = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
const W = (n) => { if (n < 10) return SAT[n]; if (n === 10) return 'sepuluh'; if (n === 11) return 'sebelas'; if (n < 20) return SAT[n - 10] + ' belas'; if (n === 100) return 'seratus'; const t = Math.floor(n / 10), u = n % 10; return SAT[t] + ' puluh' + (u ? ' ' + SAT[u] : ''); };
const TEN_EN = ['zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const uniq = (arr) => { const out = []; for (const v of arr) if (v >= 0 && v <= 100 && !out.includes(v)) out.push(v); return out; };

/* ---------- Simpanan (suara saja; kemajuan lewat KK) ---------- */
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
  if (!D.sound || !('speechSynthesis' in window) || SP < 1) return wait(Math.min(2600, 700 + text.length * 45));
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
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 10, bottom: -10, near: 1, far: 50 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun); scene.add(sun.target);

const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const loader = new GLTFLoader();
const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync(`../pasar3d/models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace; o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.01, dur * SP), fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.42, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Garis bilangan ---------- */
const U = 0.5; const X = (n) => (n - 50) * U;
const ROAD_Z = 0, FRONT_Z = 1.25, BACK_Z = -1.35;
const actors = {}; const halteSigns = {}; const plates = {};
let angkot = null, label = null, pointer = null, guru = null, flag = null;
const pos = { angkot: 0, kancil: 0, riding: true };

const buildWorld = async () => {
  /* tanah panjang */
  const ground = new THREE.Mesh(new THREE.BoxGeometry(70, 0.6, 14), B.mat(B.PAL.grass)); ground.position.set(1, -0.31, -1.5); ground.receiveShadow = true; world.add(ground);
  const walk = new THREE.Mesh(new THREE.BoxGeometry(70, 0.06, 0.9), B.mat(B.PAL.paving)); walk.position.set(1, 0.02, FRONT_Z + 0.25); walk.receiveShadow = true; world.add(walk);
  for (let x = -28; x <= 30; x += 2) await inst('road_straight', 1, [x, 0, ROAD_Z], Math.PI / 2);
  /* tanda garis bilangan + pelat angka */
  const tickM = new THREE.MeshBasicMaterial({ color: 0xffffff }), tenM = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  for (let n = 0; n <= 100; n++) {
    const ten = n % 10 === 0;
    const t = new THREE.Mesh(new THREE.BoxGeometry(ten ? 0.08 : 0.04, 0.01, ten ? 1.9 : 0.36), ten ? tenM : tickM); t.position.set(X(n), 0.108, ten ? 0 : 0.78); world.add(t);
    const p = B.numSprite(n, ten ? { bg: '#ffd166', sx: 0.46 } : { sx: 0.36, lw: 8 }); p.position.set(X(n), ten ? 0.3 : 0.24, FRONT_Z + 0.25); world.add(p); plates[n] = p;
  }
  /* halte tiap 10 dan rumah satu-satu */
  const walls = [0xfff3d1, 0xf6c9a8, 0xd9ecc4, 0xcfe3f2, 0xf3ddb8], roofs = [0xc8573a, 0xe8742a, 0x4f8a5b, 0x3b6fa0];
  for (let n = 0; n <= 100; n++) {
    if (n % 10 === 0) {
      const h = B.halte(); h.position.set(X(n), 0.02, BACK_Z + 0.15); world.add(h);
      const s = B.numSprite(n, { bg: '#ffd166', sx: 1.05, w: 256, h: 170 }); s.position.set(X(n) + 0.75, 2.75, BACK_Z + 0.3); world.add(s); halteSigns[n] = s;
    } else {
      const h = B.house(walls[n % walls.length], roofs[(n * 7) % roofs.length]); h.position.set(X(n), 0.02, BACK_Z - 0.1); world.add(h);
    }
  }
  /* latar tenang: pohon jarang di belakang */
  for (let x = -27; x <= 24; x += 5.5) { const t = B.tree(0.9 + Math.random() * 0.3); t.position.set(x + Math.random(), 0, -3.6 - Math.random()); world.add(t); }
  /* sekolah di ujung */
  await inst('building_C', 1.6, [X(100) + 3.1, 0.02, -2.4]);
  await inst('building_G', 1.4, [X(100) + 5.9, 0.02, -2.6]);
  const sg = B.signBoard('SEKOLAH', '#fff3d1', '#2f6fb0', 2.6, 0.62); sg.position.set(X(100) + 3.1, 1.25, -0.72); world.add(sg);
  for (const [x, z] of [[X(100) + 1.4, -1.2], [X(100) + 4.8, -1.0]]) await inst('bush', 2.4, [x, 0.02, z]);
  guru = B.warga({ dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }); guru.scale.setScalar(0.8); guru.position.set(X(100) + 1.0, 0.02, -0.9); guru.rotation.y = -0.5; world.add(guru); actors.guru = guru;
  /* angkot, Kancil, Jali */
  angkot = B.angkot(0x2aa876); angkot.scale.setScalar(0.95); angkot.position.set(X(0), 0.04, ROAD_Z - 0.15); world.add(angkot);
  const k = B.kancil(); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const j = B.jali(); j.scale.setScalar(0.62); world.add(j); actors.jali = j; tap(j, () => onJali());
  tap(angkot, () => onAngkot());
  label = B.numSprite(0, { bg: '#e8742a', fg: '#ffffff', border: '#ffffff', sx: 0.95, top: true, depthTest: false }); world.add(label);
  pointer = B.arrow(); pointer.scale.setScalar(0.75); world.add(pointer);
  flag = new THREE.Group(); flag.add(B.cyl(0.03, 0.03, 1.2, B.PAL.ink, [0, 0.6, 0], 6)); const fm = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.32), new THREE.MeshStandardMaterial({ color: 0xe8574b, side: THREE.DoubleSide })); fm.position.set(0.26, 1.04, 0); flag.add(fm); flag.visible = false; world.add(flag);
};
const showFlag = (n) => { flag.visible = n != null; if (n != null) flag.position.set(X(n) - 0.45, 0.02, BACK_Z + 0.6); };

/* ---------- Kamera ---------- */
const cam = { az: 0, el: 0.42, target: new THREE.Vector3(0, 0.6, 0), fx: X(0), dist: 20 };
let portrait = false, focusX = X(0);
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9;
  camera.fov = portrait ? 34 : 26; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  cam.dist = portrait ? Math.max(3.3 / ht, 2.6 / vt) : Math.max(6.6 / ht, 3.0 / vt);
  cam.az = portrait ? -0.6 : 0; cam.el = portrait ? 0.46 : 0.34;
  document.body.classList.toggle('portrait', portrait);
};
const placeCam = () => {
  cam.fx += (focusX - cam.fx) * 0.08;
  cam.target.set(cam.fx + (portrait ? 0.6 : 0), portrait ? 0.55 : 0.75, portrait ? 0.3 : 0.1);
  camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist);
  camera.lookAt(cam.target);
  sun.position.set(cam.fx - 7, 13, 9); sun.target.position.set(cam.fx, 0, 0);
};
addEventListener('resize', fit);

/* ---------- Gelembung & persamaan ---------- */
const bubble = $('#bubble');
const NAMES = { kancil: 'Kancil', jali: 'Jali', guru: 'Bu Guru Dia' };
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};
const eqEl = $('#eq');
const showEq = (html) => { if (html == null) { eqEl.hidden = true; return; } eqEl.innerHTML = html; eqEl.hidden = false; };
const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Gerak di garis bilangan ---------- */
const glowPlate = (n) => { const p = plates[n]; if (!p) return; if (!p.userData.base) p.userData.base = [p.scale.x, p.scale.y / p.scale.x]; const [s0, r] = p.userData.base; tween(0.5, (t) => { const k = 1 + Math.sin(t * Math.PI) * 0.6; p.scale.set(s0 * k, s0 * r * k, 1); }, (t) => t); };
/* Angkot melaju dari posisinya ke n, sepuluh-sepuluh (atau langsung bila quick). Kancil ikut di dalam. */
const driveTo = async (n, { count = true, quick = false, word = null, ride = true } = {}) => {
  if (ride) pos.riding = true; const from = pos.angkot; if (from === n) return;
  const dir = n > from ? 1 : -1;
  if (quick) { const a = X(from), b = X(n); await tween(Math.min(1.6, 0.4 + Math.abs(n - from) * 0.02), (t) => { pos.angkot = Math.round(from + (n - from) * t); angkot.position.x = a + (b - a) * t; }); pos.angkot = n; return; }
  let cur = from, hops = 0;
  while (cur !== n) {
    const step = Math.min(10, Math.abs(n - cur)) * dir; const nx = cur + step; const a = X(cur), b = X(nx);
    play('rotate', 1.2);
    await tween(0.9, (t) => { angkot.position.x = a + (b - a) * t; angkot.userData.body.rotation.z = Math.sin(t * Math.PI) * 0.03 * dir; }, (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    cur = nx; pos.angkot = cur; hops++; glowPlate(cur); if (halteSigns[cur]) bounceObj(halteSigns[cur]);
    if (count) { chime([660 + hops * 40]); const w = word ? word(hops, cur) : W(cur); bubble.dataset.who = 'kancil'; $('#who').textContent = 'Kancil'; $('#msg').textContent = w; bubble.hidden = false; await say(w); }
  }
};
/* Kancil turun dan berjalan satu-satu ke n. */
const walkTo = async (n, { count = true } = {}) => {
  if (pos.riding) { pos.riding = false; pos.kancil = pos.angkot; actors.kancil.position.x = X(pos.kancil); await tween(0.35, (t) => { actors.kancil.position.z = 0.15 + t * 0.45; }); }
  const dir = n > pos.kancil ? 1 : -1; actors.kancil.rotation.y = dir > 0 ? -0.35 : Math.PI + 0.35;
  while (pos.kancil !== n) {
    const a = X(pos.kancil), b = X(pos.kancil + dir); play('placement-a', 1 + Math.random() * 0.2);
    await tween(0.42, (t) => { actors.kancil.position.x = a + (b - a) * t; actors.kancil.userData.body.position.y = Math.sin(t * Math.PI) * 0.18; }, (t) => t);
    pos.kancil += dir; glowPlate(pos.kancil);
    if (count) { const w = W(pos.kancil); $('#who').textContent = 'Kancil'; bubble.dataset.who = 'kancil'; $('#msg').textContent = w; bubble.hidden = false; await Promise.race([say(w), wait(900)]); }
  }
  actors.kancil.rotation.y = -0.35;
};
const board = async (quick = false) => { if (pos.riding) return; const from = pos.kancil; if (pos.angkot !== from) await driveTo(from, { quick: true }); pos.riding = true; };
/* Letakkan angkot (dan Kancil) di n dengan cepat, tanpa menghitung. */
const setStart = async (n, walking = false) => {
  pos.riding = true; await driveTo(Math.round(n / 10) * 10 === n || !walking ? n : Math.floor(n / 10) * 10, { quick: true });
  if (walking) { pos.riding = false; pos.kancil = pos.angkot; actors.kancil.position.set(X(pos.kancil), 0.1, 0.6); await walkTo(n, { count: false }); }
};
const bounceObj = (o) => { if (!o.userData.base) o.userData.base = [o.scale.x, o.scale.y / o.scale.x]; const [s0, r] = o.userData.base; tween(0.4, (t) => { const k = 1 + Math.sin(t * Math.PI) * 0.15; o.scale.set(s0 * k, s0 * r * k, 1); }, (t) => t); };

/* ---------- Gambar kecil untuk pilihan ---------- */
const thumbs = {};
const makeThumbs = async () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(-2, 4, 3); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  for (const [k, o] of [['angkot', B.angkot(0x2aa876)], ['kancil', B.kancil()]]) {
    sc.add(o); o.rotation.y = -0.5; const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length();
    c.position.set(ctr.x + size * 0.3, ctr.y + size * 0.5, ctr.z + size * 1.6); c.lookAt(ctr); r.render(sc, c); thumbs[k] = r.domElement.toDataURL(); sc.remove(o);
  }
  r.dispose();
};

/* ---------- Soal ---------- */
let curQ = null, curCorrect = null, inLine = false;
const ask = (q, options, correct, onWrong) => { curCorrect = correct; inLine = false; return KK.ask({ options: options.map(String), correct, onWrong, cols: options.length }); };
const askNums = async (q, values, answer, onWrong) => {
  const opts = shuffle(uniq(values).slice(0, 3)); const ci = opts.indexOf(answer);
  const r = await ask(q, opts, ci, async (i) => { await onWrong(opts[i]); });
  return r.firstTry;
};
const line = (o) => { inLine = true; curCorrect = null; return KK.line(o).then(v => { inLine = false; return v; }); };
const praise = () => pick(['Betul!', 'Hebat!', 'Pintar!', 'Tepat!']);
const eq = (a, op, b, ans = '?') => `<b>${a}</b> ${op} <b>${b}</b> = <i>${ans}</i>`;

/* Tahap 1 & 2: loncat sepuluhan dari halte */
const qHalte = async (sub) => {
  const k = rand(1, sub ? 3 : 3), a = rand(sub ? k + 1 : 1, sub ? 9 : 9 - k) * 10, ans = sub ? a - k * 10 : a + k * 10;
  curQ = { type: 'halte', answer: ans };
  await setStart(a); showEq(eq(a, sub ? '−' : '+', k * 10));
  await speak('kancil', sub ? `Angkot di halte ${W(a)}. Ups, bukuku tertinggal! Angkot mundur ${W(k)} halte, ${W(k * 10)}. Sampai di halte berapa?` : `Angkot di halte ${W(a)}. Maju ${W(k)} halte, ${W(k * 10)}. Sampai di halte berapa?`);
  const ft = await askNums(curQ, [ans, sub ? a - k : a + k, sub ? ans - 10 : ans + 10, sub ? ans + 10 : ans - 10], ans, async (v) => {
    if (v === (sub ? a - k : a + k)) await speak('kancil', `Hmm, ${W(v)} itu cuma ${W(k)} rumah. Satu halte itu sepuluh. ${W(k * 10)} itu ${W(k)} halte!`);
    else { await speak('kancil', `Kita hitung haltenya pelan-pelan, ya. Mulai dari ${W(a)}.`); for (let i = 1; i <= k; i++) { const n = a + (sub ? -i : i) * 10; bounceObj(halteSigns[n]); glowPlate(n); await say(W(n)); } }
  });
  if (!sub && Math.random() < 0.5) await speak('jali', 'Go, go!');
  await driveTo(ans, { word: (h, n) => `${W(h)} halte, ${W(n)}` });
  showEq(eq(a, sub ? '−' : '+', k * 10, ans));
  await speak('kancil', `${praise()} ${cap(W(a))} ${sub ? 'kurang' : 'tambah'} ${W(k * 10)}, jadi ${W(ans)}.`);
  if (ans % 10 === 0 && ans <= 30 && ans > 0) await speak('jali', `${cap(TEN_EN[ans / 10])}! Bus stop ${TEN_EN[ans / 10]}!`);
  return ft;
};
/* Tahap 1 & 2: ±10 dari rumah bukan kelipatan 10 */
const qHouse = async (sub) => {
  let n; do { n = sub ? rand(21, 99) : rand(11, 89); } while (n % 10 === 0);
  const ans = sub ? n - 10 : n + 10, u = n % 10;
  curQ = { type: 'house', answer: ans };
  await setStart(n, true); await board(); showEq(eq(n, sub ? '−' : '+', 10));
  await speak('kancil', sub ? `Kancil di rumah nomor ${W(n)}. Angkot mundur satu halte, sepuluh. Sekarang di nomor berapa?` : `Kancil di rumah nomor ${W(n)}. Angkot maju satu halte, sepuluh. Sekarang di nomor berapa?`);
  const ft = await askNums(curQ, [ans, sub ? n - 1 : n + 1, sub ? Math.floor(n / 10) * 10 : Math.ceil(n / 10) * 10], ans, async (v) => {
    if (Math.abs(v - n) === 1) await speak('kancil', `Itu baru satu rumah. Angkot melompat sepuluh rumah! Puluhannya ${sub ? 'turun' : 'naik'} satu, satuannya tetap ${W(u)}.`);
    else await speak('kancil', `Angkot tidak berhenti di halte. Dari ${W(n)}, ${sub ? 'mundur' : 'maju'} tepat sepuluh rumah. Satuannya tetap ${W(u)}.`);
  });
  await driveTo(ans);
  showEq(eq(n, sub ? '−' : '+', 10, ans));
  await speak('kancil', `${praise()} ${cap(W(n))} jadi ${W(ans)}. Angka ${u} di belakang tetap ${u}.`);
  return ft;
};
/* Tahap 2: puluhan + puluhan */
const qTens = async (sub) => {
  let a, b; if (sub) { a = rand(3, 9); b = rand(1, a - 1); } else { a = rand(1, 7); b = rand(1, 9 - a); }
  const ans = (sub ? a - b : a + b) * 10; curQ = { type: 'tens', answer: ans };
  await setStart(a * 10); showEq(eq(a * 10, sub ? '−' : '+', b * 10));
  await speak('kancil', `Angkot di halte ${W(a * 10)}. ${sub ? 'Mundur' : 'Maju'} ${W(b * 10)}. ${cap(W(b * 10))} itu berapa halte, ya? Lalu sampai di mana?`);
  const ft = await askNums(curQ, [ans, sub ? a * 10 - b : a * 10 + b, sub ? ans + 10 : ans - 10], ans, async (v) => {
    if (v === (sub ? a * 10 - b : a * 10 + b)) await speak('kancil', `${cap(W(b * 10))} bukan ${W(b)} rumah. ${cap(W(b * 10))} itu ${W(b)} halte, ${W(b)} loncatan angkot.`);
    else await speak('kancil', `Hitung loncatannya: ${W(b * 10)} itu ${W(b)} halte. ${W(a)} ${sub ? 'kurang' : 'tambah'} ${W(b)}, jadi ${W(sub ? a - b : a + b)} halte, ya.`);
  });
  await driveTo(ans, { word: (h, n) => `${W(h)} halte, ${W(n)}` });
  showEq(eq(a * 10, sub ? '−' : '+', b * 10, ans));
  await speak('kancil', `${praise()} ${cap(W(a))} puluh ${sub ? 'kurang' : 'tambah'} ${W(b)} puluh, ${W(ans)}.`);
  return ft;
};
/* Tahap 3: puluhan dengan angkot, satuan dengan langkah */
const qOnes = async (sub) => {
  let t, u, d; t = rand(1, 8); if (sub) { u = rand(2, 9); d = rand(1, u - 1); } else { u = rand(0, 7); d = rand(1, 9 - u); }
  const n = t * 10 + u, ans = sub ? n - d : n + d; curQ = { type: 'ones', answer: ans };
  await setStart(t * 10); showEq(`<b>${n}</b>`);
  await speak('kancil', `Naik angkot ke halte ${W(t * 10)}, lalu jalan ${W(u)} langkah. Rumah nomor ${W(n)}.`);
  await walkTo(n, { count: false });
  showEq(eq(n, sub ? '−' : '+', d));
  await speak('kancil', sub ? `Aku jalan mundur ${W(d)} langkah. Sampai di nomor berapa?` : `Aku jalan lagi ${W(d)} langkah. Sampai di nomor berapa?`);
  const wrongDigits = sub ? n - d * 10 : t + u + d;
  const ft = await askNums(curQ, [ans, wrongDigits, sub ? ans + 1 : ans + 10, sub ? ans - 10 : ans - 1], ans, async (v) => {
    if (v === wrongDigits) await speak('kancil', sub ? `Itu mundur ${W(d)} halte! Aku jalan kaki, satu-satu. Halte puluhannya tetap.` : `${cap(W(n))} itu ${W(t)} halte dan ${W(u)} rumah, bukan ${W(t)} dan ${W(u)} biasa. Puluhannya tetap, satuannya saja yang bertambah.`);
    else await speak('kancil', `Hitung langkahnya dari ${W(n)}: satu langkah, satu rumah. Puluhannya tetap ${W(t * 10)}.`);
  });
  await walkTo(ans);
  showEq(eq(n, sub ? '−' : '+', d, ans));
  await speak('kancil', `${praise()} Puluhannya tetap ${W(t * 10)}. ${cap(W(u))} ${sub ? 'kurang' : 'tambah'} ${W(d)}, ${W(sub ? u - d : u + d)}. Jadi ${W(ans)}.`);
  await board();
  return ft;
};
/* Betulkan Kancil */
const qFix = async (stage) => {
  if (stage < 2) {
    const sub = stage === 1; let n; do { n = sub ? rand(21, 98) : rand(11, 88); } while (n % 10 === 0 || (n % 10 === 9 && !sub) || (n % 10 === 1 && sub));
    const ans = sub ? n - 10 : n + 10, wrong = sub ? n - 1 : n + 1, u = n % 10; curQ = { type: 'fix', answer: ans };
    await setStart(n, true); showEq(eq(n, sub ? '−' : '+', 10));
    await speak('kancil', `Aku di ${W(n)}. ${sub ? 'Kurang' : 'Tambah'} sepuluh... gampang! Satu langkah saja.`);
    await walkTo(wrong, { count: false }); showEq(eq(n, sub ? '−' : '+', 10, wrong));
    await speak('kancil', `Jadi ${W(wrong)}! Benar tidak, Guru? Yang benar berapa?`);
    const ft = await askNums(curQ, [ans, wrong, sub ? n - 11 : n + 11], ans, async (v) => {
      if (v === wrong) await speak('kancil', `Oh iya, ${W(wrong)} itu jawabanku. Satu langkah itu satu, bukan sepuluh.`);
      else await speak('kancil', `Sepuluh itu satu halte. Angka puluhannya ${sub ? 'turun' : 'naik'} satu, satuannya tetap ${W(u)}.`);
    });
    await speak('kancil', 'Ayo kita cek. Aku kembali dulu, lalu naik angkot satu halte.');
    await walkTo(n, { count: false }); await board(); await driveTo(ans);
    showEq(eq(n, sub ? '−' : '+', 10, ans));
    await speak('kancil', `Oh! ${sub ? 'Kurang' : 'Tambah'} sepuluh itu satu halte. Angka ${u} di belakang tetap ${u}. Terima kasih, Guru!`);
    return ft;
  }
  /* tahap 3: Kancil menjumlahkan semua angka, 23 + 6 jadi 2 + 3 + 6 */
  const t = rand(1, 7), u = rand(1, 6), d = rand(1, 9 - u); const n = t * 10 + u, ans = n + d, wrong = t + u + d; curQ = { type: 'fix', answer: ans };
  await setStart(t * 10); await walkTo(n, { count: false }); showEq(eq(n, '+', d));
  await speak('kancil', `${cap(W(n))} tambah ${W(d)}. Aku hitung semua angkanya: ${W(t)} tambah ${W(u)} tambah ${W(d)}... ${W(wrong)}!`);
  showEq(`<b>${t}</b> + <b>${u}</b> + <b>${d}</b> = <i>${wrong}</i> ?`);
  glowPlate(wrong); await speak('kancil', `Lho, rumah ${W(wrong)} jauh di belakang! Benar tidak, Guru? Yang benar berapa?`);
  const ft = await askNums(curQ, [ans, wrong, ans + 10], ans, async (v) => {
    if (v === wrong) await speak('kancil', `Angka ${t} di ${W(n)} itu artinya ${W(t)} halte, ${W(t * 10)}. Bukan ${W(t)} biasa.`);
    else await speak('kancil', `Aku jalan kaki ${W(d)} langkah, bukan naik angkot. Halte puluhannya tetap ${W(t * 10)}.`);
  });
  showEq(eq(n, '+', d));
  await speak('kancil', `Ayo cek. Puluhan dengan angkot: halte ${W(t * 10)}. Satuan dengan langkah: ${W(u)} tambah ${W(d)}.`);
  await walkTo(ans); showEq(eq(n, '+', d, ans));
  await speak('kancil', `${cap(W(ans))}! Angka ${t} itu halte, jadi tidak ikut dijumlah dengan satuan. Terima kasih, Guru!`);
  await board();
  return ft;
};
/* Tebak dulu, lalu cek */
const qGuess = async (stage) => {
  if (stage < 2) {
    const k = rand(2, stage ? 6 : 4), a = rand(stage ? 1 : 0, 9 - k) * 10, b = a + k * 10; curQ = { type: 'guess', answer: k };
    await setStart(a); showFlag(b); showEq(`<b>${a}</b> → <b>${b}</b> = <i>? halte</i>`);
    await speak('kancil', `Kita di halte ${W(a)}. Kita turun di halte ${W(b)}, ada bendera merah. Berapa halte lagi? Tebak dulu!`);
    const g = await line({ min: 0, max: 9, step: 1, start: 1 });
    await speak('kancil', `Tebakanmu ${W(g)} halte. Ayo kita cek! Hitung haltenya.`);
    await speak('jali', 'Go!');
    await driveTo(b, { word: (h, n) => `${W(h)} halte, ${W(n)}` });
    showFlag(null); showEq(`<b>${a}</b> → <b>${b}</b> = <i>${k} halte</i>`);
    await speak('kancil', g === k ? `Tebakanmu tepat, ${W(k)} halte! Hebat sudah mengecek.` : `Ternyata ${W(k)} halte. Tebakanmu ${W(g)}, dekat! Bagus, kita sudah mengecek.`);
    await speak('kancil', `Dari ${W(a)} ke ${W(b)} itu ${W(k * 10)}. ${cap(W(k))} halte, ${W(k)} puluh.`);
    if (Math.random() < 0.6) await speak('jali', `${cap(TEN_EN[b / 10])}! Bus stop!`);
    return true;
  }
  const t = rand(1, 8), u = rand(0, 5), d = rand(2, 9 - u), n = t * 10 + u, ans = n + d; curQ = { type: 'guess', answer: ans };
  await setStart(t * 10); if (u) await walkTo(n, { count: false }); showEq(eq(n, '+', d));
  await speak('kancil', `Aku di ${W(n)}. Jalan ${W(d)} langkah. Sampai di nomor berapa? Tebak dulu!`);
  const g = await line({ min: t * 10, max: t * 10 + 10, step: 1, start: n });
  await speak('kancil', `Tebakanmu ${W(g)}. Ayo cek, hitung langkahku!`);
  await walkTo(ans); showEq(eq(n, '+', d, ans));
  await speak('kancil', g === ans ? `Tepat, ${W(ans)}! Hebat sudah mengecek.` : `Ternyata ${W(ans)}. Tebakanmu ${W(g)}. Bagus, kita sudah mengecek!`);
  await board();
  return true;
};
/* Dua cara: sepuluh langkah satu-satu, atau satu loncatan angkot */
const qTwo = async (stage) => {
  const sub = stage === 1 && Math.random() < 0.5; let n; do { n = sub ? rand(21, 95) : rand(11, 85); } while (n % 10 === 0);
  const ans = sub ? n - 10 : n + 10; curQ = { type: 'two', answer: ans };
  await setStart(n, true); showEq(eq(n, sub ? '−' : '+', 10));
  await speak('kancil', `Aku di ${W(n)}. Aku mau coba ${sub ? 'mundur' : 'maju'} sepuluh dengan jalan kaki, satu-satu.`);
  await walkTo(ans);
  await speak('kancil', `Fiuh, sampai di ${W(ans)}! Sekarang Jali coba naik angkot dari ${W(n)}.`);
  await speak('jali', 'Go!'); await driveTo(n, { quick: true, ride: false });
  await driveTo(ans, { count: false, ride: false });
  await speak('kancil', 'Aku jalan kaki, Jali naik angkot. Cara mana yang lebih cepat?');
  curCorrect = 0; inLine = false;
  const r = await KK.ask({ options: [{ img: thumbs.angkot, small: '1 loncat' }, { img: thumbs.kancil, small: '10 langkah' }], correct: 0, cols: 2, onWrong: async () => { await speak('kancil', 'Jalan kaki itu sepuluh langkah, lama dan capek. Angkot cukup satu loncatan sepuluh!'); } });
  showEq(eq(n, sub ? '−' : '+', 10, ans));
  await speak('kancil', `${praise()} Sepuluh langkah sama dengan satu loncatan angkot. Sampainya sama-sama di ${W(ans)}.`);
  await board();
  return r.firstTry;
};

const PLAN = [
  [(s) => qHalte(false), (s) => qHouse(false), qFix, qGuess, (s) => qHouse(false), qTwo],
  [(s) => qHouse(true), (s) => qTens(false), qFix, (s) => qTens(true), qGuess, (s) => qHalte(true), qTwo],
  [(s) => qOnes(false), (s) => qOnes(true), qFix, qGuess, (s) => qOnes(Math.random() < 0.5)],
];

/* ---------- Alur bab ---------- */
let stage = 0, qi = 0, breakDone = false, running = false, finishedFlag = false;
const intro = async () => {
  await setStart(10); focusX = X(10);
  await speak('kancil', 'Pagi! Kancil mau naik angkot ke sekolah Bu Guru Dia. Tapi aku belum pandai berhitung di jalan. Kamu jadi guruku, ya!');
  bounceObj(halteSigns[10]); bounceObj(halteSigns[20]); bounceObj(halteSigns[30]);
  await speak('jali', 'Bus stop! Ten, twenty, thirty!');
  await speak('kancil', 'Jalan ini seperti garis bilangan. Setiap halte berjarak sepuluh. Di antaranya, rumah satu-satu.');
};
const run = async () => {
  if (running) return; running = true;
  const s = KK.load(BAB); stage = s.done ? 0 : s.stage; if (s.done) KK.save(BAB, { stage: 0, streak: 0, done: true });
  await intro();
  while (!finishedFlag) {
    const plan = PLAN[stage]; const fn = plan[qi % plan.length]; qi++;
    const ft = await fn(stage);
    const before = KK.load(BAB); const r = KK.record(BAB, ft, STAGES);
    const fin = r.finished || (before.stage === STAGES - 1 && ft && before.streak === 2);
    curQ = null; showEq(null);
    if (fin) { finishedFlag = true; break; }
    if (r.advanced) {
      stage = r.stage; qi = 0; chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.4);
      await speak('kancil', stage === 1 ? 'Wah, aku sudah bisa maju sepuluh! Sekarang kita coba mundur dan loncat puluhan.' : 'Hebat! Sekarang kita pakai angkot lalu jalan kaki.');
      if (!breakDone) { breakDone = true; await balloonBreak(); }
    }
  }
  await ending();
};
const ending = async () => {
  await speak('kancil', 'Sekarang aku sudah pandai! Ayo ke sekolah, halte seratus!');
  await speak('jali', 'Go, go, go!');
  if (!pos.riding) await board();
  if (pos.angkot % 10) await driveTo(Math.ceil(pos.angkot / 10) * 10, { quick: true });
  await driveTo(100, { count: true });
  pos.riding = false; pos.kancil = 100; actors.kancil.position.z = 0.6;
  chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.45); hop(guru, 0.2);
  await speak('guru', 'Selamat pagi, Kancil! Kamu tiba tepat waktu.');
  await speak('kancil', 'Terima kasih, Guru kecilku! Puluhan dengan angkot, satuan dengan jalan kaki.');
  await speak('jali', 'School! Ten, twenty, thirty... one hundred!');
  bubble.hidden = true;
  KK.done(BAB, 'Kancil tiba di sekolah tepat waktu. Bu Guru Dia menyambut dengan senyum.');
  window.__game.finished = true;
};

/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple']];
const balloonBreak = async () => {
  await speak('kancil', 'Istirahat sebentar! Ada balon terbang di jalan. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = 8;
  await new Promise((done) => {
    for (let i = 0; i < 8; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col);
      b.position.set(cam.fx + (Math.random() * 2 - 1) * (portrait ? 1.6 : 4), 0.5, 1.2 + Math.random() * 0.8); b.scale.setScalar(portrait ? 0.75 : 0.9);
      b.userData = { v: 0.7 + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1000 * SP);
  });
  await speak('kancil', 'Seru! Yuk, lanjut naik angkot.');
};

const onKancil = async () => { if (curQ) return; play('toggle'); hop(actors.kancil); };
const onJali = async () => { if (curQ) return; play('toggle'); hop(actors.jali, 0.3); say(pick(['Bus stop!', 'School!', 'Go!']), 'en'); };
const onAngkot = () => { play('rotate'); hop(angkot, 0.06); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 20) return;
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
  const K = actors.kancil, J = actors.jali;
  if (angkot && K) {
    const ax = angkot.position.x;
    if (pos.riding) { K.position.set(ax - 0.28, 0.5, ROAD_Z + 0.1); K.scale.setScalar(0.46); K.rotation.y = 0; }
    else { K.position.y = 0.1; K.scale.setScalar(0.5); }
    J.position.set(ax + 0.25, 1.22, ROAD_Z - 0.15); J.rotation.y = -0.3;
    const fxn = pos.riding ? pos.angkot : pos.kancil; const lx = pos.riding ? ax : K.position.x;
    focusX = lx;
    label.position.set(lx, pos.riding ? 2.05 : 1.55, pos.riding ? ROAD_Z : 0.6); if (label.userData.n !== fxn) { label.userData.n = fxn; label.userData.set(fxn); }
    pointer.position.set(lx, 0.75 + Math.abs(Math.sin(t * 4)) * 0.1, FRONT_Z + 0.25); pointer.rotation.y = t * 2;
    K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4;
    J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f;
    if (guru) guru.userData.head.rotation.x = guru.userData.talk ? Math.sin(t * 13) * 0.05 : 0;
    if (flag && flag.visible) flag.children[1].rotation.y = Math.sin(t * 3) * 0.3;
  }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > 6) b.userData.end(); }
  placeCam();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Jalan gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { await lim(makeThumbs(), 6000); } catch (e) { console.warn(e); }
  for (const k of ['angkot', 'kancil']) if (!thumbs[k]) thumbs[k] = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#E8742A"/></svg>');
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ stage, q: curQ, line: inLine, correct: curCorrect, sheet: !!document.querySelector('.kk-sheet'), riding: pos.riding, angkot: pos.angkot, kancil: pos.kancil, kk: KK.load(BAB) }),
    answerCorrect: () => { const sh = document.querySelector('.kk-sheet'); if (!sh) return false; if (sh.querySelector('.kk-ok')) { sh.querySelector('.kk-ok').click(); return true; } const bs = sh.querySelectorAll('.kk-opt'); const b = bs[curCorrect]; if (!b) return false; b.click(); return true; },
    answerWrong: () => { const sh = document.querySelector('.kk-sheet'); if (!sh || sh.querySelector('.kk-ok')) return false; const bs = [...sh.querySelectorAll('.kk-opt')]; const i = bs.findIndex((b, j) => j !== curCorrect && !b.classList.contains('no')); if (i < 0) return false; bs[i].click(); return true; },
    speed: (f) => { SP = f; }, balloonBreak, driveTo, finished: false, run,
  };
  frame();
  if (QS.has('play')) { $('#intro').classList.add('gone'); run(); }
})();
