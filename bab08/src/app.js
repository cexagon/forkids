/* Kota Kancil Bab 08: Lomba Kancil dan Siput. Selisih dan pengurangan sampai 100 dengan menghitung naik di lintasan (garis bilangan 3D). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const FAST = QS.has('fast');
const wait = (ms) => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 20) : ms));
const BAB = 8, STAGES = 3;
const KK = window.KK;

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
  if (FAST) return wait(10);
  if (!D.sound || !('speechSynthesis' in window)) return wait(Math.min(3200, 800 + text.length * 50));
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
scene.add(new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3));
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-5, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 8, bottom: -8, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };

const loader = new GLTFLoader(); const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync(`../pasar3d/models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace; o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: FAST ? 0.01 : dur, fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.42, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Lintasan: 1 langkah = U satuan dunia ---------- */
const U = 0.15, X0 = -7.5; const X = (n) => X0 + n * U;
const LANE = { kancil: -0.5, siput: 0.45 }, LINE_Z = 1.2;
const actors = {}; const tags = {}; const pos = { kancil: 0, siput: 0 }; let finish = null; let jaliPost = null; const arcs = []; const cups = [];

const buildWorld = async () => {
  world.add(B.field(21, 8));
  /* dua lajur tanah liat */
  for (const z of [LANE.kancil, LANE.siput]) { const l = B.box(X(100) - X(0) + 1.2, 0.06, 0.82, 0xd99a6c, [0, 0.03, z]); l.receiveShadow = true; world.add(l); }
  for (const z of [-0.93, 0, 0.88]) world.add(B.box(X(100) - X(0) + 1.2, 0.065, 0.04, 0xfff3d1, [0, 0.035, z]));
  world.add(B.box(0.06, 0.07, 1.85, 0xffffff, [X(0), 0.04, -0.03]));
  /* garis bilangan: pita krem, ketukan tiap langkah, patok tiap 10 */
  world.add(B.box(X(100) - X(0) + 0.5, 0.05, 0.5, 0xfff3d1, [0, 0.03, LINE_Z]));
  for (let n = 0; n <= 100; n++) {
    const big = n % 10 === 0, mid = n % 5 === 0;
    const t = B.box(big ? 0.05 : 0.025, 0.02, big ? 0.42 : mid ? 0.3 : 0.18, 0x3b2614, [X(n), 0.065, LINE_Z - (big ? 0 : mid ? 0.06 : 0.12)]); t.castShadow = false; world.add(t);
    if (big) {
      const p = B.cyl(0.06, 0.07, 0.4, n === 100 ? B.PAL.red : n % 20 ? 0x2f8fd0 : B.PAL.orange, [X(n), 0.2, LINE_Z - 0.32], 10); world.add(p);
      world.add(B.sphere(0.07, 0xfff3d1, [1, 1, 1], [X(n), 0.42, LINE_Z - 0.32]));
      const s = B.textSprite(n, { size: 0.5, w: n === 100 ? 1.25 : 1 }); s.position.set(X(n), 0.3, LINE_Z + 0.42); world.add(s);
    }
  }
  finish = B.finishLine(-0.95, 0.9); finish.position.x = X(100); world.add(finish);
  /* latar tenang */
  for (const [x, z, s] of [[-9.6, -2.8, 1.1], [-5, -3.2, 0.9], [1.5, -3.3, 1.0], [6.0, -3.1, 0.85], [9.6, -2.6, 1.15]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }
  /* tokoh */
  const k = B.kancil(); k.scale.setScalar(0.85); world.add(k); actors.kancil = k; tap(k, () => onTap('kancil'));
  const s = B.siput(); s.scale.setScalar(0.95); world.add(s); actors.siput = s; tap(s, () => onTap('siput'));
  for (const who of ['kancil', 'siput']) { const tg = B.textSprite(0, { size: 0.42, bg: who === 'kancil' ? '#ffe3c4' : '#eef5c2' }); world.add(tg); tags[who] = tg; }
  const post = new THREE.Group(); post.add(B.cyl(0.06, 0.08, 1.1, B.PAL.woodDark, [0, 0.55, 0], 10)); post.add(B.box(0.6, 0.09, 0.14, B.PAL.wood, [0, 1.1, 0])); post.position.set(X(0) - 1.1, 0, -1.25); world.add(post); jaliPost = post;
  const j = B.jali(); j.position.set(X(0) - 1.1, 1.15, -1.25); j.rotation.y = -0.6; j.scale.setScalar(1.1); world.add(j); actors.jali = j; tap(j, () => onTap('jali'));
  const dia = B.warga({ dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }); dia.userData.basket.visible = false; dia.position.set(X(100) + 1.0, 0.02, -1.35); dia.rotation.y = -0.45; dia.scale.setScalar(1.05); world.add(dia); actors.dia = dia; tap(dia, () => onTap('dia'));
  /* meja minum di garis akhir: dipakai di penutup */
  const table = new THREE.Group(); table.add(B.box(0.8, 0.06, 0.5, B.PAL.wood, [0, 0.55, 0])); for (const [a, b] of [[-0.33, -0.18], [0.33, -0.18], [-0.33, 0.18], [0.33, 0.18]]) table.add(B.cyl(0.03, 0.03, 0.55, B.PAL.woodDark, [a, 0.27, b], 6));
  table.add(B.cyl(0.13, 0.11, 0.32, 0x8ed3e6, [0.18, 0.74, 0], 14)); table.position.set(X(100) + 1.15, 0.02, 0.55); world.add(table);
  for (let i = 0; i < 2; i++) { const c = B.cup(); c.position.set(X(100) + 0.95 - i * 0.2, 0.6, 0.55); c.visible = false; world.add(c); cups.push(c); }
  world.add(B.sea());
  setPos('kancil', 0); setPos('siput', 0);
};
const setPos = (who, n) => {
  pos[who] = n; const a = actors[who]; a.position.set(X(n) - (who === 'kancil' ? 0.3 : 0.45) * a.scale.x, 0.06, LANE[who]);
  const tg = tags[who]; if (tg.userData.text !== n) tg.userData.set(n); tg.position.set(X(n), who === 'kancil' ? 1.55 : 0.98, LANE[who]);
};
/* tokoh menyorongkan ujung hidungnya pada patok n; tween gerak dari a ke b */
const slide = (who, a, b, dur) => tween(dur, (t) => { const n = a + (b - a) * t; setPos(who, Math.round(n)); actors[who].position.x = X(n) - (who === 'kancil' ? 0.3 : 0.45) * actors[who].scale.x; tags[who].position.x = X(n); actors[who].userData.body.position.y = Math.abs(Math.sin(t * Math.PI * Math.max(1, Math.round(Math.abs(b - a) / 3)))) * (who === 'kancil' ? 0.12 : 0.04); });

/* ---------- Busur loncatan di atas garis bilangan ---------- */
const clearArcs = () => { arcs.forEach(o => world.remove(o)); arcs.length = 0; };
const addArc = (a, b, color, label) => {
  const d = Math.abs(b - a), h = Math.min(1.0, 0.22 + d * U * 0.32), y0 = 0.1, back = b < a;
  const z = LINE_Z + (back ? 0.12 : -0.05), lift = back ? 0 : 0;
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(X(a), y0, z), new THREE.Vector3((X(a) + X(b)) / 2, y0 + h * 2 + lift, z), new THREE.Vector3(X(b), y0, z));
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.035, 6), new THREE.MeshBasicMaterial({ color })); g.add(tube);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 10), new THREE.MeshBasicMaterial({ color })); head.position.set(X(b), y0 + 0.09, z); head.rotation.z = 0; head.rotation.x = Math.PI; g.add(head);
  const sp = B.textSprite(label, { size: 0.44, w: 1.25, fg: '#ffffff', bg: back ? '#2f8fd0' : '#e8742a', border: '#3b2614' }); sp.position.set((X(a) + X(b)) / 2, y0 + h + 0.3, z); g.add(sp);
  /* tumbuh dari kiri ke kanan */
  tube.geometry.setDrawRange(0, 0); const total = tube.geometry.index.count;
  world.add(g); arcs.push(g); sp.visible = false; head.visible = false;
  return tween(0.35, (t) => { tube.geometry.setDrawRange(0, Math.floor(total * t / 6) * 6); if (t >= 1) { sp.visible = true; head.visible = true; } }, (t) => t);
};
/* Potongan loncatan: dari a naik ke b (a<b) lewat puluhan */
const upSegs = (a, b) => { const s = []; let c = a; const t1 = Math.ceil(a / 10) * 10, t2 = Math.floor(b / 10) * 10; if (t1 >= b || t2 <= a) return [[a, b]]; if (t1 > c) { s.push([c, t1]); c = t1; } if (t2 > c) { s.push([c, t2]); c = t2; } if (b > c) s.push([c, b]); return s; };
const downSegs = (b, a) => upSegs(a, b).reverse().map(([x, y]) => [y, x]);

/* Tokoh berjalan di lintasan sesuai potongan; setiap loncatan diucapkan. Hasil: jumlah langkah */
const walk = async (who, segs, opts = {}) => {
  let total = 0; const back = segs[0][1] < segs[0][0]; const a = actors[who];
  const color = back ? 0x2f8fd0 : 0xe8742a; const parts = [];
  if (back) a.rotation.y = Math.PI; else a.rotation.y = 0;
  for (const [p, q] of segs) {
    const d = Math.abs(q - p); total += d; parts.push(d);
    focus(Math.min(p, q, opts.keep ?? p), Math.max(p, q, opts.keep ?? q));
    await addArc(p, q, color, (back ? '−' : '+') + d);
    play('placement-a', 0.8 + Math.min(0.6, d / 40));
    if (who === 'jali') await fly(p, q, 0.35 + d * 0.02); else await slide(who, p, q, (who === 'kancil' ? 0.3 : 0.55) + d * (who === 'kancil' ? 0.015 : 0.03));
    steps(stepLine(segs, parts.length, back));
    await speak(who === 'jali' ? 'dia' : who, `${who === 'jali' ? 'Jali ' : ''}${back ? 'mundur' : 'maju'} ${d} langkah, ${back ? 'turun' : 'sampai'} ke ${q}.`.replace(/^./, c => c.toUpperCase()));
  }
  a.rotation.y = 0;
  return { total, parts };
};
const stepLine = (segs, k, back) => { const nums = [segs[0][0], ...segs.slice(0, k).map(s => s[1])].join(' → '); return nums; };
const fly = (p, q, dur) => { const j = actors.jali; const from = j.position.clone(); const to = new THREE.Vector3(X(q), 1.7, LINE_Z - 0.1); if (Math.abs(from.x - X(p)) > 0.2 || from.y < 1.5) { j.position.set(X(p), 1.7, LINE_Z - 0.1); } const f2 = j.position.clone(); return tween(dur, (t) => { j.position.lerpVectors(f2, to, t); j.position.y += Math.sin(t * Math.PI) * 0.3; j.userData.wings[0].rotation.x = -Math.abs(Math.sin(t * 30)) * 0.8; j.userData.wings[1].rotation.x = Math.abs(Math.sin(t * 30)) * 0.8; }, (t) => t); };
const jaliHome = async () => { const j = actors.jali; const to = new THREE.Vector3(jaliPost.position.x, 1.15, jaliPost.position.z); const f = j.position.clone(); if (f.distanceTo(to) < 0.05) return; j.rotation.y = -0.6; await tween(0.6, (t) => { j.position.lerpVectors(f, to, t); j.position.y += Math.sin(t * Math.PI) * 0.4; }); };

/* ---------- Kamera: mengikuti potongan lintasan yang sedang dibahas ---------- */
const cam = { el: 0.5, target: new THREE.Vector3(0, 0.5, 0.3), goal: new THREE.Vector3(0, 0.5, 0.3), dist: 20, distGoal: 20, lo: 0, hi: 100 };
let portrait = false;
const focus = (lo, hi) => { cam.lo = Math.max(-8, Math.min(lo, hi)); cam.hi = Math.min(108, Math.max(lo, hi)); aim(); };
const aim = () => {
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const span = (cam.hi - cam.lo) * U + (portrait ? 1.8 : 2.6);
  const needW = Math.max(span, portrait ? 4.4 : 8.5);
  cam.distGoal = Math.max(needW / 2 / ht, (portrait ? 2.4 : 2.2) / vt);
  let cx = (X(cam.lo) + X(cam.hi)) / 2; cam.goal.set(cx, portrait ? 0.55 : 0.35, 0.25);
};
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9; camera.fov = portrait ? 34 : 28; camera.updateProjectionMatrix(); cam.el = portrait ? 0.5 : 0.42;
  document.body.classList.toggle('portrait', portrait); aim();
};
const placeCam = () => { camera.position.set(cam.target.x, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung & papan ---------- */
const bubble = $('#bubble'), board = $('#board');
const NAMES = { kancil: 'Kancil', siput: 'Siput', jali: 'Jali', dia: 'Bu Guru Dia' };
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};
const eq = (html) => { $('#eq').innerHTML = html; board.hidden = false; };
const steps = (html) => { $('#steps').innerHTML = html; };
const hideBoard = () => { board.hidden = true; steps(''); };

/* ---------- Gambar kecil tokoh untuk pilihan (anak belum lancar membaca) ---------- */
const thumbs = {};
const makeThumbs = () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.4)); const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(2, 4, 4); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  for (const [k, mk] of [['kancil', B.kancil], ['siput', B.siput], ['jali', B.jali]]) {
    const o = mk(); o.rotation.y = -0.6; sc.add(o); const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length();
    c.position.set(ctr.x + size * 0.2, ctr.y + size * 0.25, ctr.z + size * 1.55); c.lookAt(ctr); r.render(sc, c); thumbs[k] = r.domElement.toDataURL(); sc.remove(o);
  }
  r.dispose();
  return Promise.all(['kancil', 'siput'].map(k => new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = thumbs[k]; }))).then(([a, b]) => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const x = cv.getContext('2d'); if (a) x.drawImage(a, 0, 0); if (b) x.drawImage(b, 128, 0); thumbs.both = cv.toDataURL();
  });
};
const who2opt = () => [{ img: thumbs.kancil, small: 'Kancil' }, { img: thumbs.siput, small: 'Siput' }];

/* ---------- Pembungkus KK agar bisa dites otomatis ---------- */
let pending = null;
const ask = (o) => { pending = { type: 'ask', correct: o.correct, n: o.options.length }; return KK.ask(o).then(r => { pending = null; return r; }); };
const line = (o, answer) => { pending = { type: 'line', answer }; return KK.line(o).then(v => { pending = null; return v; }); };

/* ---------- Pembangkit soal per tahap ---------- */
const OPEN = ['main layangan', 'mengejar kupu-kupu', 'makan tebu', 'melihat bunga', 'menyapa teman'];
const gen = (stage) => {
  if (stage === 2) {
    let k, s; do { k = rand(41, 89); s = rand(41, 89); } while (k % 10 === 0 || s % 10 === 0 || Math.abs(k - s) < 5);
    return { stage, k, s };
  }
  let big, small;
  if (stage === 0) do { big = rand(35, 89); small = rand(11, big - 10); } while (small % 10 > big % 10 || small % 10 === 0 && big % 10 === 0);
  else do { big = rand(31, 95); small = rand(12, big - 6); } while (small % 10 <= big % 10);
  const kAhead = Math.random() < 0.65;
  return { stage, big, small, k: kAhead ? big : small, s: kAhead ? small : big, lead: kAhead ? 'kancil' : 'siput', trail: kAhead ? 'siput' : 'kancil' };
};
const place = async (p) => {
  clearArcs(); hideBoard(); await jaliHome();
  focus(Math.min(p.k, p.s), p.stage === 2 && !portrait ? 100 : Math.max(p.k, p.s) + (p.stage === 2 ? 6 : 0));
  const a = pos.kancil, b = pos.siput;
  await Promise.all([slide('kancil', a, p.k, 0.7), slide('siput', b, p.s, 0.9)]);
};
const intro = async (p) => {
  if (p.stage === 2) { await speak('dia', `Kancil di patok ${p.k}. Siput di patok ${p.s}.`); return; }
  if (p.lead === 'kancil') await speak('dia', `Kancil lari cepat sampai patok ${p.k}. Siput terus maju sampai patok ${p.s}.`);
  else await speak('dia', `Kancil berhenti ${pick(OPEN)} di patok ${p.k}. Siput terus maju sampai patok ${p.s}.`);
};
const qText = (p) => `${NAMES[p.lead]} lebih jauh berapa langkah?`;
const showEq = (p, x = '?') => eq(`<b>${p.big}</b> − <i>${p.small}</i> = ${x}`);
const showEqFin = (who, p, x = '?') => eq(`<b>100</b> − <i>${p[who === 'kancil' ? 'k' : 's']}</i> = ${x}`);

/* Cara benar di lintasan: yang di belakang berjalan naik ke yang di depan, lalu cek dengan menjumlah. */
const showRight = async (p, who) => {
  if (p.stage === 2) {
    const from = pos[who]; const segs = upSegs(from, 100);
    await speak('dia', `Kita hitung naik dari ${from} sampai garis akhir. Loncat ke puluhan dulu.`);
    const r = await walk(who, segs, { keep: from });
    steps(`${stepLine(segs, segs.length)}<br>${r.parts.join(' + ')} = <span class="ok">${r.total}</span>`);
    await speak('dia', `${r.parts.join(' tambah ')} sama dengan ${r.total}.`);
    showEqFin(who, p, r.total);
    steps(`Cek: ${from} + ${r.total} = <span class="ok">100</span>`); await speak('dia', `Cek dengan menjumlah: ${from} tambah ${r.total} sama dengan 100. Cocok!`);
    return r.total;
  }
  const segs = upSegs(p.small, p.big);
  await speak('dia', `${NAMES[p.trail]} berjalan dari ${p.small} ke ${p.big}. Kita hitung loncatannya.`);
  const r = await walk(p.trail, segs, { keep: p.small });
  if (r.parts.length > 1) { steps(`${stepLine(segs, segs.length)}<br>${r.parts.join(' + ')} = <span class="ok">${r.total}</span>`); await speak('dia', `${r.parts.join(' tambah ')} sama dengan ${r.total}.`); }
  showEq(p, r.total);
  steps(`Cek: ${p.small} + ${r.total} = <span class="ok">${p.big}</span>`); await speak('dia', `Cek dengan menjumlah: ${p.small} tambah ${r.total} sama dengan ${p.big}. Cocok!`);
  return r.total;
};
const back = async (p) => { await Promise.all([slide('kancil', pos.kancil, p.k, 0.5), slide('siput', pos.siput, p.s, 0.5)]); await jaliHome(); };

/* ---------- Mesin 1: tebak dulu, lalu cek ---------- */
const engTebak = async (p) => {
  await place(p); await intro(p);
  if (p.stage === 2) {
    const who = pick(['kancil', 'siput']), other = who === 'kancil' ? 'siput' : 'kancil';
    const ans = 100 - p[who === 'kancil' ? 'k' : 's'], ans2 = 100 - p[other === 'kancil' ? 'k' : 's'];
    showEqFin(who, p); await speak('dia', `Berapa langkah lagi ${NAMES[who]} ke garis akhir? Tebak dulu, ya.`);
    const g = await line({ min: 0, max: 60, step: 1, start: 30 }, ans);
    await speak('kancil', `Tebakanmu ${g}. Ayo kita cek di lintasan!`);
    await showRight(p, who);
    await praiseGuess(g, ans);
    await back(p); clearArcs();
    eq(`<b>${NAMES[who]}</b> ${ans} lagi · <i>${NAMES[other]}</i> ${ans2} lagi`); steps('');
    await speak('dia', `${NAMES[who]} kurang ${ans} langkah. ${NAMES[other]} kurang ${ans2} langkah. Siapa yang lebih dekat ke garis akhir?`);
    const closer = ans < ans2 ? who : other; const opts = who2opt();
    const r = await ask({ options: opts, correct: closer === 'kancil' ? 0 : 1, onWrong: async () => { await speak('dia', `Lihat angkanya: ${Math.min(ans, ans2)} lebih sedikit dari ${Math.max(ans, ans2)}. Yang sisanya lebih sedikit, dia lebih dekat.`); } });
    await speak(closer, `Aku lebih dekat! Sisaku ${Math.min(ans, ans2)} langkah.`);
    return g === ans ? r.firstTry : null;
  }
  showEq(p); await speak('dia', `${qText(p)} Tebak dulu, ya.`);
  const ans = p.big - p.small;
  const g = await line({ min: 0, max: 80, step: 1, start: 20 }, ans);
  await speak('kancil', `Tebakanmu ${g}. Ayo kita cek di lintasan!`);
  await showRight(p);
  await praiseGuess(g, ans);
  return g === ans ? true : null;
};
const praiseGuess = async (g, ans) => {
  if (g === ans) { chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.35); await speak('kancil', `Tebakanmu tepat ${ans}! Dan kita sudah mengecek. Hebat!`); }
  else await speak('kancil', `Tebakanmu ${g}, ternyata ${ans}. Selisihnya cuma ${Math.abs(g - ans)}. Bagus, kamu mau mengecek!`);
};

/* ---------- Mesin 2: betulkan Kancil ---------- */
const engBetul = async (p) => {
  await place(p); await intro(p);
  let ans, wrong, who = 'kancil', expl;
  if (p.stage === 2) {
    who = pick(['kancil', 'siput']); const n = p[who === 'kancil' ? 'k' : 's']; const t = Math.floor(n / 10), o = n % 10;
    ans = 100 - n; wrong = (10 - t) * 10 + (10 - o);
    showEqFin(who, p); await speak('dia', `Berapa langkah lagi ${NAMES[who]} ke garis akhir? Kancil mau menghitung.`);
    steps(`10 − ${o} = ${10 - o}<br>10 − ${t} = ${10 - t}<br>jadi <span class="bad">${wrong}</span>?`);
    await speak('kancil', `Gampang! 10 kurang ${o} itu ${10 - o}. 10 kurang ${t} itu ${10 - t}. Jadi ${wrong}!`);
    expl = async () => { steps(`Cek: ${n} + ${wrong} = <span class="bad">${n + wrong}</span>`); await speak('dia', `Cek dengan menjumlah: ${n} tambah ${wrong} sama dengan ${n + wrong}. Itu lewat dari garis akhir! Kancil memakai sepuluh dua kali. Dari ${n} ke ${(t + 1) * 10} itu ${10 - o}, lalu ke 100 tinggal ${(9 - t) * 10}.`); };
  } else if (p.stage === 1) {
    const bt = Math.floor(p.big / 10), bo = p.big % 10, st = Math.floor(p.small / 10), so = p.small % 10;
    ans = p.big - p.small; wrong = Math.abs(bt - st) * 10 + Math.abs(bo - so);
    showEq(p); await speak('dia', `${qText(p)} Kancil mau menghitung.`);
    steps(`${so} − ${bo} = ${so - bo}<br>${bt} − ${st} = ${bt - st}<br>jadi <span class="bad">${wrong}</span>?`);
    await speak('kancil', `Aku tahu! ${so} kurang ${bo} itu ${so - bo}. ${bt} kurang ${st} itu ${bt - st}. Jadi ${wrong}!`);
    expl = async () => { steps(`Cek: ${p.small} + ${wrong} = <span class="bad">${p.small + wrong}</span>`); await speak('dia', `Cek dengan menjumlah: ${p.small} tambah ${wrong} sama dengan ${p.small + wrong}, bukan ${p.big}. Kancil membalik angkanya: dia mengambil ${so} kurang ${bo}, padahal ${bo} lebih kecil dari ${so}. Kita harus melewati patok ${Math.ceil(p.small / 10) * 10}.`); };
  } else {
    ans = p.big - p.small; wrong = ans + 1;
    showEq(p); await speak('dia', `${qText(p)} Kancil mau menghitung patoknya.`);
    steps(`${p.small}, ${p.small + 1}, ${p.small + 2}, ... ${p.big}<br>jadi <span class="bad">${wrong}</span>?`);
    await speak('kancil', `Aku hitung semua titiknya: ${p.small}, ${p.small + 1}, ${p.small + 2}, terus sampai ${p.big}. Ada ${wrong}!`);
    expl = async () => { steps(`Cek: ${p.small} + ${wrong} = <span class="bad">${p.small + wrong}</span>`); await speak('dia', `Cek dengan menjumlah: ${p.small} tambah ${wrong} sama dengan ${p.small + wrong}, bukan ${p.big}. Kancil ikut menghitung titik awalnya. Yang dihitung itu loncatannya, bukan titik tempat berdiri.`); };
  }
  await speak('dia', 'Betul tidak, ya? Pilih jawaban yang benar.');
  let other = ans + (Math.random() < 0.5 ? 10 : -10); if (other === wrong || other <= 0) other = ans + 10; if (other === wrong) other = ans + 20;
  const vals = shuffle([wrong, ans, other]);
  const r = await ask({ options: vals.map(String), correct: vals.indexOf(ans), onWrong: async (i) => {
    if (vals[i] === wrong) await expl();
    else { const base = p.stage === 2 ? 100 - ans : p.small, top = p.stage === 2 ? 100 : p.big; steps(`Cek: ${base} + ${vals[i]} = <span class="bad">${base + vals[i]}</span>`); await speak('dia', `Cek dengan menjumlah: ${base} tambah ${vals[i]} sama dengan ${base + vals[i]}, bukan ${top}. Coba yang lain.`); }
  } });
  await speak('kancil', `Oh, jadi ${ans}! Terima kasih sudah membetulkan aku. Coba tunjukkan caranya di lintasan.`);
  await showRight(p, who);
  hop(actors.kancil, 0.3); await speak('kancil', 'Sekarang aku paham. Hitung naik ke puluhan dulu, baru sisanya.');
  return r.firstTry;
};

/* ---------- Mesin 3: dua cara (naik dari yang kecil, mundur dari yang besar) ---------- */
const engDua = async (p) => {
  await place(p); await intro(p);
  let lo, hi, upWho, downWho, ans;
  if (p.stage === 2) {
    upWho = pick(['kancil', 'siput']); lo = p[upWho === 'kancil' ? 'k' : 's']; hi = 100; downWho = 'jali'; ans = 100 - lo;
    showEqFin(upWho, p); await speak('dia', `Berapa langkah lagi ${NAMES[upWho]} ke garis akhir?`);
    await speak('jali', 'How far to the finish?');
  } else { lo = p.small; hi = p.big; upWho = p.trail; downWho = p.lead; ans = hi - lo; showEq(p); await speak('dia', qText(p)); }
  let o2 = ans + pick([-10, 10]); if (o2 <= 0) o2 = ans + 10; let o3 = ans + pick([-1, 1, 2]); if (o3 <= 0 || o3 === o2) o3 = ans + 3;
  const vals = shuffle([ans, o2, o3]);
  await speak('dia', 'Pilih dulu jawabanmu. Nanti dua teman mengecek dengan cara berbeda.');
  const first = await ask({ options: vals.map(String), correct: vals.indexOf(ans), onWrong: async (i) => { steps(`Cek: ${lo} + ${vals[i]} = <span class="bad">${lo + vals[i]}</span>`); await speak('dia', `Cek dengan menjumlah: ${lo} tambah ${vals[i]} sama dengan ${lo + vals[i]}, bukan ${hi}. Coba lagi.`); } });
  steps('');
  /* cara 1: hitung naik */
  await speak(upWho, `Caraku: hitung naik dari ${lo} ke ${hi}.`);
  const segU = upSegs(lo, hi); const r1 = await walk(upWho, segU, { keep: lo });
  steps(`naik: ${r1.parts.join(' + ')} = <span class="ok">${r1.total}</span>`);
  await speak(upWho, `${r1.parts.join(' tambah ')}, semuanya ${r1.total}.`);
  await slide(upWho, pos[upWho], lo, 0.4);
  /* cara 2: hitung mundur */
  await speak(downWho, downWho === 'jali' ? `I count back from ${hi}!` : `Caraku: hitung mundur dari ${hi} ke ${lo}.`, downWho === 'jali' ? 'en' : 'id');
  if (downWho === 'jali') { actors.jali.position.set(X(hi), 1.7, LINE_Z - 0.1); actors.jali.rotation.y = Math.PI; }
  const segD = downSegs(hi, lo); const r2 = await walk(downWho, segD, { keep: hi });
  steps(`naik: ${r1.parts.join(' + ')} = <span class="ok">${r1.total}</span><br>mundur: ${r2.parts.join(' + ')} = <span class="ok">${r2.total}</span>`);
  await speak(downWho === 'jali' ? 'dia' : downWho, `${downWho === 'jali' ? 'Jali mundur ' : ''}${r2.parts.join(' tambah ')}, semuanya ${r2.total}.`);
  if (downWho !== 'jali') await slide(downWho, pos[downWho], hi, 0.4); else await jaliHome();
  await speak('dia', `Satu menghitung naik, satu menghitung mundur. Cara siapa yang benar?`);
  const opts = [{ img: thumbs[upWho], small: NAMES[upWho] }, downWho === 'jali' ? { img: thumbs.jali, small: 'Jali' } : { img: thumbs[downWho], small: NAMES[downWho] }, { img: thumbs.both, small: 'Dua-duanya' }];
  await ask({ options: opts, correct: 2, onWrong: async () => { await speak('dia', `Coba lihat papan. Naik dapat ${r1.total}, mundur juga dapat ${r2.total}. Jaraknya sama, jadi dua cara itu sama benarnya.`); } });
  showEq(p.stage === 2 ? { big: 100, small: lo } : p, ans);
  await speak('dia', `Betul! Dua-duanya benar, jawabannya ${ans}. Pakai cara yang paling mudah buatmu.`);
  return first.firstTry;
};

/* ---------- Jeda balon (sekali di tengah bab) ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple']];
const balloonBreak = async () => {
  clearArcs(); hideBoard(); focus(Math.min(pos.kancil, pos.siput) - 5, Math.max(pos.kancil, pos.siput) + 15);
  await speak('kancil', 'Istirahat dulu! Ada balon lepas dari garis akhir. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = FAST ? 1 : 8;
  await new Promise((done) => {
    for (let i = 0; i < left; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const cx = (X(cam.lo) + X(cam.hi)) / 2, w = (X(cam.hi) - X(cam.lo)) / 2;
      b.position.set(cx + (Math.random() * 2 - 1) * w * 0.8, 0.6, 1.4 + Math.random() * 0.8); b.scale.setScalar(portrait ? 0.9 : 1.1);
      b.userData = { v: 0.7 + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b); if (FAST) b.userData.end();
    }, FAST ? 0 : i * 1100);
  });
  await speak('kancil', 'Seru! Yuk, lanjut lombanya.');
};

/* ---------- Ketuk tokoh ---------- */
let busyTap = false;
const onTap = async (who) => {
  if (busyTap || pending == null) return; busyTap = true; play('toggle'); if (actors[who].userData.body) hop(actors[who], who === 'siput' ? 0.1 : 0.25);
  const lines = { kancil: ['Aku cepat, tapi suka berhenti bermain!', 'Ayo hitung dari patok puluhan.'], siput: ['Pelan-pelan, tapi aku terus maju.', 'Satu langkah demi satu langkah.'], jali: [['Race! Fast and slow!', 'en'], ['Snail. Slow, slow, slow!', 'en']], dia: ['Ibu jurinya. Hitung dengan teliti, ya!', 'Jangan lupa cek dengan menjumlah.'] };
  const l = pick(lines[who]); if (Array.isArray(l)) await speak(who, l[0], l[1]); else await speak(who, l);
  busyTap = false;
};

const confetti = () => { if (FAST) return; const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Alur bab ---------- */
const stageChip = () => { $('#helped').textContent = `Tahap ${KK.load(BAB).stage + 1}`; };
const stageUp = async (st) => {
  chime([523, 659, 784, 1047]); confetti(); stageChip(); clearArcs(); hideBoard();
  if (st === 1) { await speak('dia', 'Hebat! Sekarang angkanya melewati patok puluhan. Kita loncat ke puluhan dulu.'); }
  if (st === 2) { focus(40, 100); await speak('dia', 'Sekarang garis akhirnya sudah dekat. Berapa langkah lagi ke garis akhir?'); await speak('jali', 'Finish! How far?'); }
};
const opening = async () => {
  focus(0, 100);
  await speak('dia', 'Selamat datang di lomba lari! Ibu Guru Dia jadi jurinya.');
  await speak('jali', 'A race! Kancil and the snail!');
  await speak('kancil', 'Aku cepat sekali!'); await speak('jali', 'Fast!');
  await speak('siput', 'Aku lambat, tapi aku terus maju.'); await speak('jali', 'Slow!');
  await speak('dia', 'Lihat patok bernomor di lintasan. Kita hitung jarak mereka dengan loncatan.');
};
const ending = async () => {
  clearArcs(); hideBoard(); focus(Math.min(pos.kancil, pos.siput), 104);
  await speak('dia', 'Putaran terakhir! Ayo, sampai garis akhir!');
  await Promise.all([slide('kancil', pos.kancil, 100, 1.4), slide('siput', pos.siput, 100, 3.0)]);
  chime([523, 659, 784, 1047, 1319]); confetti(); hop(actors.kancil, 0.4);
  await speak('jali', 'Finish! Well done, both of you!');
  cups.forEach(c => { c.visible = true; }); await tween(0.5, (t) => { cups[0].position.set(X(100) + 0.95 - t * 1.0, 0.6 - t * 0.1, 0.55 - t * 0.9); cups[1].position.set(X(100) + 0.75 - t * 0.85, 0.6 - t * 0.35, 0.55 - t * 0.2); });
  await speak('dia', 'Kalian berdua sampai! Ini es tebu untuk kalian. Ayo berbagi minum.');
  await speak('kancil', 'Siput, kamu tidak pernah berhenti. Hebat sekali!');
  await speak('siput', 'Kancil, kamu cepat sekali. Terima kasih sudah menunggu aku.');
  await speak('dia', 'Dan terima kasih untukmu yang sudah membantu Kancil menghitung!');
};
let started = false;
const main = async () => {
  if (started) return; started = true;
  { const s = KK.load(BAB); if (s.done) KK.save(BAB, { stage: 0, streak: 0, done: false }); }
  stageChip();
  await opening();
  let round = 0, breakDone = false;
  for (;;) {
    const st = KK.load(BAB).stage; const p = gen(st);
    const eng = [engTebak, engBetul, engDua][round % 3]; round++;
    state.engine = eng === engTebak ? 'tebak' : eng === engBetul ? 'betul' : 'dua'; state.problem = p; state.rounds = round;
    const res = await eng(p);
    if (res === null) { await wait(600); continue; }
    const r = KK.record(BAB, res, STAGES);
    if (r.finished) { await ending(); state.finished = true; KK.done(BAB, 'Kancil dan Siput sampai di garis akhir dan berbagi es tebu. Kamu jago menghitung selisih!'); return; }
    if (r.advanced) { await stageUp(r.stage); if (!breakDone) { breakDone = true; await balloonBreak(); } }
    await wait(500);
  }
};
const state = { engine: null, problem: null, rounds: 0, finished: false };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
$('#startBtn').addEventListener('click', () => { $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } main(); });

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  const f = FAST ? 1 : 0.06; cam.target.lerp(cam.goal, f); cam.dist += (cam.distGoal - cam.dist) * f; placeCam();
  const K = actors.kancil, J = actors.jali, S = actors.siput, Dg = actors.dia;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.06 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (S) { S.userData.head.rotation.z = Math.sin(t * 1.1) * 0.06 + (S.userData.talk ? Math.sin(t * 12) * 0.08 : 0); S.userData.shell.rotation.z = Math.sin(t * 1.5) * 0.03; }
  if (J) { J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; }
  if (Dg) { Dg.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; Dg.userData.head.rotation.x = Dg.userData.talk ? Math.sin(t * 13) * 0.05 : 0; }
  if (finish) finish.userData.flags.forEach((fl, i) => { fl.rotation.y = Math.sin(t * 2.4 + i) * 0.3; });
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > 6) b.userData.end(); }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await lim(buildWorld(), 20000); } catch (e) { $('#loading').textContent = 'Lintasan gagal dimuat: ' + (e && e.message || e); throw e; }
  if (!actors.kancil) { $('#loading').textContent = 'Lintasan gagal dimuat. Tutup lalu buka lagi halaman ini.'; return; }
  fit(); cam.target.copy(cam.goal); cam.dist = cam.distGoal;
  try { await lim(makeThumbs(), 5000); } catch (e) { console.warn(e); }
  const dot = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#E8742A"/></svg>');
  for (const k of ['kancil', 'siput', 'jali', 'both']) if (!thumbs[k]) thumbs[k] = dot;
  stageChip();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ ...state, stage: KK.load(BAB).stage, kk: KK.load(BAB), pending }),
    answerCorrect: () => { if (!pending) return false; if (pending.type === 'line') { const r = document.querySelector('.kk-line input'); r.value = pending.answer; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); } else document.querySelectorAll('.kk-opt')[pending.correct].click(); return true; },
    answerWrong: () => { if (!pending) return false; if (pending.type === 'line') { const r = document.querySelector('.kk-line input'); r.value = Math.max(0, pending.answer - 3); r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); } else document.querySelectorAll('.kk-opt')[(pending.correct + 1) % pending.n].click(); return true; },
    setStage: (s) => KK.save(BAB, { stage: s, streak: 0, done: false }),
    balloonBreak, actors, pos, cam, focus, upSegs,
  };
  frame();
  if (QS.has('play')) { $('#intro').classList.add('gone'); main(); }
})();
