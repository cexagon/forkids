/* Kota Kancil, Bab 01: Kancil dan Buaya. Hitung lanjut dari N, pasangan sepuluh, bilangan hilang, dua cara. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const QS = new URLSearchParams(location.search);
const FAST = QS.has('fast'); const SP = FAST ? 0.05 : 1; const nap = (ms) => wait(ms * SP);
const BAB = 1, STAGES = 3;
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
  if (FAST) return wait(30);
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
const camera = new THREE.PerspectiveCamera(30, 1, 1, 400);
scene.add(new THREE.HemisphereLight(0xd6ecff, 0xe9c79a, 1.3));
const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-6, 13, 8); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);
const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const loader = new GLTFLoader();
const lim = (p, ms) => Promise.race([p, wait(ms)]);

const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: Math.max(0.01, dur * SP), fn, ease, res }));

/* ---------- Nomor punggung (sprite selalu menghadap kamera) ---------- */
const texCache = {};
const BADGE = { n: ['#fffaf0', '#3b2614', '#3b2614'], hi: ['#e8742a', '#ffffff', '#c25a18'], y: ['#ffd166', '#3b2614', '#3b2614'], g: ['#4e9a3c', '#ffffff', '#2f6b22'], blank: ['#fffaf0', '#3b2614', '#d8c8a8'] };
const badgeTex = (text, mode) => {
  const k = text + '|' + mode; if (texCache[k]) return texCache[k];
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  if (mode === 'leaf') {
    x.save(); x.translate(64, 66); x.rotate(-0.6); x.fillStyle = '#4e9a3c'; x.strokeStyle = '#2f6b22'; x.lineWidth = 7;
    x.beginPath(); x.ellipse(0, 0, 58, 36, 0, 0, Math.PI * 2); x.fill(); x.stroke(); x.beginPath(); x.moveTo(-56, 0); x.lineTo(56, 0); x.stroke(); x.restore();
    x.fillStyle = '#fff'; x.font = '800 64px "Baloo 2", Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', 64, 72);
  } else {
    const [bg, fg, st] = BADGE[mode] || BADGE.n;
    x.fillStyle = bg; x.beginPath(); x.arc(64, 64, 56, 0, 7); x.fill(); x.lineWidth = 9; x.strokeStyle = st; x.stroke();
    if (text) { x.fillStyle = fg; x.font = `800 ${text.length > 1 ? 62 : 72}px "Baloo 2", Nunito, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 70); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; texCache[k] = t; return t;
};

/* ---------- Dunia ---------- */
const MAX = 20, PER = 5, SX = 1.25, SZ = 1.35;
const crocs = []; const actors = {}; let nearBank, farBank, jaliPost, sign = null; const balloons = [];
const GREEN = 0x6fae4f, YELLOW = 0xf2c14e;
const buildWorld = async () => {
  const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: 0x6cc3dc, roughness: 0.55 }));
  water.rotation.x = -Math.PI / 2; water.position.y = -0.03; water.receiveShadow = true; world.add(water);
  nearBank = B.bank(26, 8); farBank = B.bank(26, 8); world.add(nearBank, farBank);
  for (let i = 0; i < MAX; i++) {
    const g = B.croc(); g.scale.setScalar(0.82); world.add(g);
    const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTex(String(i + 1), 'n'), depthTest: false, transparent: true })); badge.renderOrder = 10; badge.scale.setScalar(0.52); world.add(badge);
    const c = { g, badge, label: i + 1, mode: 'n', ph: Math.random() * 6 }; crocs.push(c);
    tap(g, () => onCroc(c));
  }
  sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTex('', 'y'), depthTest: false, transparent: true })); sign.renderOrder = 11; sign.scale.setScalar(0.9); sign.visible = false; world.add(sign);
  const k = B.kancil(); k.scale.setScalar(0.74); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const bk = B.basket(); bk.position.set(-0.08, 0.86, 0); bk.scale.setScalar(1.1); k.userData.body.add(bk); k.userData.basket = bk;
  jaliPost = new THREE.Group(); jaliPost.add(B.cyl(0.06, 0.08, 0.9, B.PAL.woodDark, [0, 0.45, 0], 10)); jaliPost.add(B.box(0.6, 0.08, 0.14, B.PAL.wood, [0, 0.9, 0])); world.add(jaliPost);
  const j = B.jali(); j.scale.setScalar(1.05); world.add(j); actors.jali = j; tap(j, () => onJali());
  const n = B.warga({ kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }); n.scale.setScalar(1.05); world.add(n); actors.nenek = n; n.userData.basket.visible = false;
  for (const [x, dz, s] of [[-7.5, -3.2, 1.3], [-4.6, -4.4, 1.0], [5.2, -3.8, 1.2], [8.2, -2.6, 1.0], [1.2, -5.2, 1.1]]) { const t = B.tree(s); t.position.set(x, 0.1, dz); t.userData.dz = dz; farBank.add(t); t.position.z = dz + 4; }
  try { const bush = (await lim(loader.loadAsync('../pasar3d/models/bush.glb'), 5000)); if (bush && bush.scene) { for (const [x, z] of [[-6.2, 2.8], [6.4, 3.0], [3.8, 2.4]]) { const o = bush.scene.clone(true); o.scale.setScalar(2.2); o.position.set(x, 0.08, z); o.traverse(m => { if (m.isMesh) { m.castShadow = true; } }); farBank.add(o); } } } catch (e) { /* hiasan saja */ }
};

/* ---------- Tata letak barisan buaya (berkelok, 5 per baris, dari tepi dekat ke tepi jauh) ---------- */
let T = 10, rows = 2, kIdx = -1;
const zOf = (r) => ((rows - 1) / 2 - r) * SZ;
const slot = (i) => { const r = Math.floor(i / PER), c = i % PER, col = r % 2 === 0 ? c : PER - 1 - c; return new THREE.Vector3((col - 2) * SX, 0.2, zOf(r)); };
const nearEdge = () => zOf(0) + 0.85, farEdge = () => zOf(rows - 1) - 0.85;
const point = (i) => {
  if (i < 0) { const p = slot(0); p.z = nearEdge() + 0.45; p.y = 0.12; return p; }
  if (i >= T) { const p = slot(T - 1); p.z = farEdge() - 0.45; p.y = 0.12; return p; }
  return slot(i);
};
const portrait = () => innerWidth / innerHeight < 0.9;
const layout = (n, labels = null) => {
  T = n; rows = Math.ceil(n / PER);
  crocs.forEach((c, i) => {
    const on = i < n; c.g.visible = on; c.badge.visible = on; if (!on) return;
    const p = slot(i); const r = Math.floor(i / PER); c.g.position.set(p.x, 0, p.z); c.g.rotation.y = r % 2 === 0 ? 0 : Math.PI;
    c.label = labels ? labels[i] : i + 1; c.g.userData.skin.color.setHex(GREEN); setBadge(i, 'n');
    c.badge.position.set(p.x - (r % 2 === 0 ? 0.12 : -0.12), 0.6, p.z + 0.3);
  });
  sign.visible = false;
  nearBank.position.set(0, 0, nearEdge() + 4); farBank.position.set(0, 0, farEdge() - 4);
  const P = portrait(); const fz = farEdge();
  jaliPost.position.set(P ? 2.6 : 4.4, 0.1, fz - (P ? 1.2 : 0.9)); actors.jali.position.set(jaliPost.position.x, 1.03, jaliPost.position.z); actors.jali.rotation.y = -Math.PI * 0.62;
  actors.nenek.position.set(P ? -2.6 : -4.4, 0.1, fz - (P ? 1.3 : 1.0)); actors.nenek.rotation.y = P ? 0.35 : 0.5;
  fit();
};
const setBadge = (i, mode, text) => { const c = crocs[i]; c.mode = mode; const t = text != null ? text : (mode === 'blank' ? '' : String(c.label)); c.badge.material.map = mode === 'leaf' ? badgeTex('', 'leaf') : badgeTex(t, mode); c.badge.material.needsUpdate = true; };
const tint = (i, col) => crocs[i].g.userData.skin.color.setHex(col);
const placeK = (i) => { kIdx = i; const p = point(i); actors.kancil.position.copy(p); face(i + 1 < T ? point(i + 1).sub(p) : new THREE.Vector3(0, 0, -1)); };
const face = (dir) => { if (dir.lengthSq() > 0.0001) actors.kancil.rotation.y = Math.atan2(-dir.z, dir.x); };
const hopTo = async (i, sfx = true) => {
  const from = actors.kancil.position.clone(), to = point(i); face(to.clone().sub(from)); kIdx = i;
  if (sfx) play('placement-a', 0.9 + Math.random() * 0.3);
  await tween(0.42, (t) => { actors.kancil.position.lerpVectors(from, to, t); actors.kancil.position.y += Math.sin(t * Math.PI) * 0.55; }, (t) => t);
  if (i >= 0 && i < T) { const g = crocs[i].g; tween(0.3, (t) => { g.userData.body.position.y = -Math.sin(t * Math.PI) * 0.08; }, (t) => t); }
};
const walkTo = async (i) => { const step = i > kIdx ? 1 : -1; while (kIdx !== i) await hopTo(kIdx + step, false); };

/* ---------- Kamera: muat barisan di antara gelembung (atas) dan lembar jawaban (bawah) ---------- */
const cam = { el: 0.92, target: new THREE.Vector3(0, 0.3, 0), dist: 14 };
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  const P = portrait(); camera.fov = P ? 34 : 30;
  const top = P ? 150 : 130, bottom = P ? 250 : 215; const avail = Math.max(200, h - top - bottom);
  const vt = Math.tan((camera.fov * Math.PI) / 360) * (avail / h), ht = Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
  cam.el = P ? 1.0 : 0.9;
  const halfW = P ? 3.35 : 5.2, halfD = (rows - 1) * SZ / 2 + (P ? 2.4 : 1.9);
  cam.dist = Math.max(halfW / ht, (halfD * Math.sin(cam.el) + 0.4) / vt) * 1.02;
  cam.target.set(0, 0.3, -0.15);
  camera.setViewOffset(w, h, 0, (bottom - top) / 2, w, h);
  camera.updateProjectionMatrix(); document.body.classList.toggle('portrait', P);
};
const placeCam = () => { camera.position.set(cam.target.x, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', () => { layout(T, crocs.slice(0, T).map(c => c.label)); if (actors.kancil) placeK(kIdx); });

/* ---------- Gelembung bicara ---------- */
const bubble = $('#bubble');
const NAMES = { kancil: 'Kancil', jali: 'Jali', buaya: 'Buaya', nenek: 'Nenek Gabe' };
let talking = 0;
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who]; $('#msg').textContent = text; bubble.hidden = false;
  const a = who === 'buaya' ? crocs[0].g : actors[who]; talking++; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0; talking--;
};
const hopsEl = $('#hops');
const showHops = (n, word = 'lompatan') => { hopsEl.hidden = false; hopsEl.innerHTML = `<b>${n}</b><span>${word}</span>`; };
const hideHops = () => { hopsEl.hidden = true; };

/* ---------- Gambar kecil Kancil dan Jali untuk pilihan ---------- */
const thumbs = {};
const makeThumbs = async () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(2, 4, 3); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  for (const [k, o] of [['kancil', B.kancil()], ['jali', B.jali()]]) {
    o.rotation.y = -0.6; sc.add(o); const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length();
    c.position.set(ctr.x + size * 0.2, ctr.y + size * 0.3, ctr.z + size * 1.9); c.lookAt(ctr); r.render(sc, c); thumbs[k] = r.domElement.toDataURL(); sc.remove(o);
  }
  r.dispose();
};

/* ---------- Penanda soal untuk tes otomatis ---------- */
let pending = null, stage = 0, kind = null, finishedAll = false;
const askLine = async (opts, answer) => { pending = { type: 'line', answer }; const v = await KK.line(opts); pending = null; return v; };
const askOpts = async (o) => { pending = { type: 'ask', correct: o.correct, n: o.options.length }; const r = await KK.ask(o); pending = null; return r; };
const options3 = (correct, extra) => { const s = new Set([correct]); for (const v of extra) { if (s.size >= 3) break; if (v >= 0 && v <= 20 && !s.has(v)) s.add(v); } let k = 1; while (s.size < 3) { if (!s.has(correct + k)) s.add(correct + k); k++; } const o = shuffle([...s]); return { options: o, correct: o.indexOf(correct) }; };
const blink = async (idxs, mode = 'hi') => { const prev = idxs.map(i => crocs[i].mode); for (let r = 0; r < 2; r++) { idxs.forEach(i => setBadge(i, mode)); await nap(350); idxs.forEach((i, k) => setBadge(i, prev[k])); await nap(250); } };
let prompt = '';
const ask = async (text) => { prompt = text; await speak('kancil', text); };

/* Hitung lanjut: Kancil di punggung ke-N (indeks N-1), melompat sampai punggung ke-to. */
const countOn = async (N, to) => {
  await speak('kancil', `Aku mulai dari ${N}. Punggung ini tidak dihitung.`);
  for (let k = 1; N + k <= to; k++) { await hopTo(N + k - 1); setBadge(N + k - 1, 'hi'); showHops(k); await speak('kancil', `${N + k}`); }
};

/* ---------- Mesin 1: tebak dulu, lalu cek ---------- */
let saidJump = false, saidHow = false, saidTen = false;
const qGuess = async () => {
  let N, d; if (stage === 0) { N = rand(2, 8); d = 10 - N; } else { d = rand(2, 6); N = rand(7, Math.min(15, 20 - d)); }
  const to = N + d; layout(to); placeK(N - 1); setBadge(N - 1, 'y'); setBadge(to - 1, 'g');
  await ask(`Aku di punggung ${N}. Seberang ada sesudah punggung ${to}. Berapa lompatan lagi sampai punggung ${to}?`);
  if (!saidHow) { saidHow = true; await speak('jali', 'How many jumps?'); }
  const g = await askLine({ min: 0, max: 10, start: 0 }, d);
  await speak('kancil', `Tebakanmu ${g}. Ayo kita cek dengan melompat!`);
  if (!saidJump) { saidJump = true; await speak('jali', 'Jump, jump!'); }
  await countOn(N, to);
  await speak('kancil', g === d ? `Tebakanmu tepat! Dari ${N} ke ${to}, ${d} lompatan.` : `Dari ${N} ke ${to} ternyata ${d} lompatan. Tebakanmu ${g}. Bagus, kita sudah mengecek!`);
  if (to === 10) { await speak('kancil', `${N} dan ${d} jadi 10.`); if (!saidTen) { saidTen = true; await speak('jali', 'Ten!'); } }
  hideHops(); await hopTo(T); return g === d;
};

/* ---------- Pasangan sepuluh (tahap 1) ---------- */
const qPair = async () => {
  const N = rand(2, 8), d = 10 - N; layout(10); placeK(N - 1);
  for (let i = 0; i < N; i++) { tint(i, YELLOW); setBadge(i, 'y'); }
  await ask(`Ada 10 buaya. Aku sudah melewati ${N} buaya kuning. ${N} dan berapa jadi 10?`);
  const o = options3(d, [d + 1, d - 1, d + 2, N]); const rest = Array.from({ length: d }, (_, k) => N + k);
  const r = await askOpts({ ...o, onWrong: async (i) => { const v = o.options[i]; await speak('kancil', `${N} dan ${v} jadi ${N + v}, bukan 10. Hitung buaya hijau yang belum kulewati.`); await blink(rest); } });
  for (let k = 0; k < d; k++) { setBadge(N + k, 'hi', String(k + 1)); showHops(k + 1, 'buaya hijau'); await speak('kancil', `${k + 1}`); }
  await speak('kancil', `${d} buaya hijau. ${N} dan ${d} jadi 10!`);
  if (!saidTen) { saidTen = true; await speak('jali', 'Ten crocodiles!'); }
  hideHops(); return r.firstTry;
};

/* ---------- Mesin 2: betulkan Kancil ---------- */
const qFix = async () => {
  let N, d, err; if (stage === 0) { N = rand(3, 7); d = 10 - N; err = 'own'; } else { d = rand(2, 6); N = rand(7, Math.min(15, 20 - d)); err = pick(['own', 'restart']); }
  const to = N + d; layout(to); placeK(N - 1); setBadge(N - 1, 'y'); setBadge(to - 1, 'g');
  await ask(`Aku di punggung ${N}, mau ke punggung ${to}. Biar aku hitung sendiri lompatannya!`);
  let wrong;
  if (err === 'own') { for (let v = N; v <= to; v++) { setBadge(v - 1, 'hi'); showHops(v - N + 1); await speak('kancil', `${v}`); } wrong = d + 1; }
  else { for (let v = 1; v <= to; v++) { setBadge(v - 1, 'hi'); showHops(v); await speak('kancil', `${v}`); } wrong = to; }
  await speak('kancil', `Jadi ${wrong} lompatan!`); hideHops();
  for (let i = 0; i < to; i++) setBadge(i, i === N - 1 ? 'y' : i === to - 1 ? 'g' : 'n');
  prompt = 'Betul tidak, ya? Berapa lompatan yang benar?'; await speak('kancil', prompt);
  const o = options3(d, [wrong, d - 1, d + 2]);
  const path = Array.from({ length: d }, (_, k) => N + k);
  const r = await askOpts({ ...o, onWrong: async (i) => {
    const v = o.options[i];
    if (v === wrong && err === 'own') { await speak('kancil', `Oh, punggung ${N} itu tempatku berdiri. Itu belum lompatan. Lompatan pertama mendarat di ${N + 1}.`); await blink([N - 1], 'y'); }
    else if (v === wrong) { await speak('kancil', `Oh, aku tidak perlu mulai dari 1. Aku sudah di ${N}. Lanjut saja: ${N + 1}, ${N + 2}, dan seterusnya.`); await blink([N - 1], 'y'); }
    else { await speak('kancil', `Hitung punggung yang kuinjak sesudah ${N}, sampai ${to}.`); await blink(path); }
  } });
  await speak('kancil', 'Terima kasih, Guru kecil! Sekarang cara yang benar.');
  await countOn(N, to);
  await speak('kancil', err === 'own' ? `${d} lompatan. Tempatku berdiri tidak dihitung.` : `${d} lompatan. Aku mulai dari ${N}, tidak dari 1.`);
  hideHops(); await hopTo(T); return r.firstTry;
};

/* ---------- Bilangan yang hilang (tahap 3) ---------- */
const qMissing = async () => {
  const down = Math.random() < 0.5, S = rand(1, 11); const labels = Array.from({ length: 10 }, (_, i) => down ? S + 9 - i : S + i);
  layout(10, labels); placeK(-1);
  const cov = shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, rand(2, 3)).sort((a, b) => a - b); cov.forEach(i => setBadge(i, 'leaf'));
  await speak('kancil', down ? 'Nomor punggung buaya ini mundur, makin kecil. Ada daun menutupi nomornya!' : 'Nomor punggung buaya ini maju, makin besar. Ada daun menutupi nomornya!');
  await blink([0, 1].filter(i => !cov.includes(i)), 'y');
  let all = true;
  for (const i of cov) {
    await walkTo(i - 1); const prev = labels[i - 1], c = labels[i];
    await ask(`Aku di ${prev}. Nomor berapa di bawah daun?`);
    const o = options3(c, down ? [c - 1, c + 1, c + 2] : [c + 1, c - 1, c - 2]);
    const r = await askOpts({ ...o, onWrong: async () => { await speak('kancil', down ? `Nomornya turun satu-satu. Sesudah ${prev}, satu lebih kecil.` : `Nomornya naik satu-satu. Sesudah ${prev}, satu lebih besar.`); await blink([i - 1], 'y'); } });
    if (!r.firstTry) all = false;
    setBadge(i, 'g'); chime([660, 880]); await hopTo(i); await speak('kancil', `${c}!`);
  }
  await walkTo(T - 1); await hopTo(T);
  await speak('kancil', `Semua nomor: ${labels.join(', ')}.`); return all;
};

/* ---------- Mesin 3: dua cara ---------- */
const qTwoWays = async () => {
  const a = rand(6, 12), b = rand(2, 4), n = a + b; layout(n); placeK(-1);
  for (let i = 0; i < n; i++) setBadge(i, 'blank'); for (let i = 0; i < a; i++) tint(i, YELLOW);
  const mid = slot(Math.floor((a - 1) / 2)); sign.material.map = badgeTex(String(a), 'y'); sign.material.needsUpdate = true;
  sign.position.set(mid.x, 1.35, mid.z); sign.visible = true;
  await ask(`Ada ${a} buaya kuning, sudah dihitung kemarin. Lalu datang ${b} buaya hijau. Berapa semuanya?`);
  await speak('kancil', 'Aku hitung dari 1, ya.');
  for (let v = 1; v <= n; v++) { setBadge(v - 1, 'hi', String(v)); showHops(v, 'kali hitung'); await speak('kancil', `${v}`); }
  await speak('kancil', `Semuanya ${n}!`); hideHops();
  for (let i = 0; i < n; i++) setBadge(i, 'blank');
  await speak('jali', `Aku mulai dari ${a}, karena buaya kuning sudah ${a}.`, 'id');
  for (let v = a + 1; v <= n; v++) { setBadge(v - 1, 'hi', String(v)); showHops(v - a, 'kali hitung'); await speak('jali', `${v}`, 'id'); }
  await speak('jali', `Semuanya ${n}!`, 'id'); hideHops();
  prompt = `Hasil kami sama, ${n}. Cara siapa yang lebih cepat?`; await speak('kancil', prompt);
  const opt = shuffle([{ label: 'Kancil', img: thumbs.kancil, k: 'kancil' }, { label: 'Jali', img: thumbs.jali, k: 'jali' }]);
  const r = await askOpts({ options: opt.map(({ label, img }) => (img ? { label, img } : label)), correct: opt.findIndex(o => o.k === 'jali'), cols: 2, onWrong: async () => { await speak('kancil', `Aku menghitung ${n} kali, mulai dari 1. Jali hanya menghitung ${b} kali, karena ia mulai dari ${a}.`); } });
  await speak('kancil', `Betul, Jali lebih cepat. Hasilnya sama karena buayanya sama. Jali tidak mengulang ${a} buaya yang sudah dihitung.`);
  sign.visible = false; return r.firstTry;
};

/* ---------- Alur bab ---------- */
const FORCED = { 0: ['guess', 'pair', 'fix'], 1: ['fix', 'guess'], 2: ['twoways', 'missing'] };
const nextKind = () => {
  const q = FORCED[stage]; if (q.length) return q.shift(); const r = Math.random();
  if (stage === 0) return r < 0.4 ? 'guess' : r < 0.75 ? 'pair' : 'fix';
  if (stage === 1) return r < 0.5 ? 'guess' : 'fix';
  return r < 0.45 ? 'missing' : r < 0.85 ? 'twoways' : 'fix';
};
const Q = { guess: qGuess, pair: qPair, fix: qFix, missing: qMissing, twoways: qTwoWays };
const drawChip = () => { const s = KK.load(BAB); $('#stage').innerHTML = `Tahap ${stage + 1}/3 <i>${[0, 1, 2].map(i => `<u class="${i < s.streak ? 'on' : ''}"></u>`).join('')}</i>`; };
let breakDone = false;
const intro = async () => {
  layout(10); placeK(-1);
  await speak('kancil', 'Aku mau mengantar buah untuk Nenek Gabe di seberang sungai. Tapi sungainya dalam.');
  await speak('jali', 'River! A big river!');
  await speak('kancil', 'Buaya, maukah kalian berbaris jadi jembatan? Nanti buahnya kubagi.');
  for (let i = 0; i < 10; i++) { const g = crocs[i].g; tween(0.35, (t) => { g.userData.body.position.y = Math.sin(t * Math.PI) * 0.15; }, (t) => t); await nap(90); }
  await speak('buaya', 'Boleh, Kancil! Ayo naik ke punggung kami.');
  await speak('jali', 'Crocodile! Hello, crocodiles!');
  await speak('kancil', 'Tapi aku belum pandai berhitung. Kamu jadi guruku, ya!');
};
const levelUp = async () => {
  chime([523, 659, 784, 1047]); confetti(); drawChip();
  if (stage === 1) { layout(20); placeK(-1); await speak('kancil', 'Hebat! Sekarang sungainya lebih lebar. Buayanya sampai 20!'); await speak('buaya', 'Kami datang lagi, Kancil!'); await speak('jali', 'A wide river!'); }
  if (stage === 2) { await speak('kancil', 'Kamu guru yang hebat! Sekarang ada teka-teki nomor punggung.'); }
};
const ending = async () => {
  layout(10); placeK(-1); drawChip();
  await speak('kancil', 'Ayo menyeberang sampai seberang!');
  await walkTo(9); await hopTo(10);
  await speak('kancil', 'Aku sampai di seberang! Sekarang aku bagi buahnya. Satu buaya, satu buah.');
  const from = new THREE.Vector3();
  for (let i = 0; i < 10; i++) {
    actors.kancil.userData.basket.getWorldPosition(from); const f = B.fruit(pick([0xf5a623, 0xe8574b, 0xffd166])); world.add(f);
    const to = crocs[i].g.userData.head.getWorldPosition(new THREE.Vector3()); to.y += 0.15; const fr = from.clone();
    play('placement-b', 1 + i * 0.04);
    await tween(0.45, (t) => { f.position.lerpVectors(fr, to, t); f.position.y += Math.sin(t * Math.PI) * 1.2; });
    world.remove(f); setBadge(i, 'g'); const g = crocs[i].g; tween(0.35, (t) => { g.userData.body.position.y = Math.sin(t * Math.PI) * 0.15; }, (t) => t);
    showHops(i + 1, 'buah'); await speak('kancil', `${i + 1}`);
  }
  hideHops(); chime([523, 659, 784, 1047]); confetti();
  await speak('kancil', 'Sepuluh buaya, sepuluh buah. Terima kasih, buaya!');
  await speak('buaya', 'Terima kasih, Kancil! Kamu menepati janji.');
  await speak('nenek', 'Kancil, buah untuk Nenek juga sampai. Kamu baik sekali.');
  await speak('jali', 'Ten crocodiles. Thank you, crocodiles!');
  finishedAll = true; bubble.hidden = true;
  KK.done(BAB, 'Kancil menyeberang sungai dan membagi buah kepada sepuluh buaya.');
};
const run = async () => {
  stage = Math.min(STAGES - 1, KK.load(BAB).stage); drawChip();
  await intro();
  for (;;) {
    kind = nextKind(); const ft = await Q[kind]();
    const before = KK.load(BAB); const res = KK.record(BAB, ft, STAGES);
    if (before.stage === STAGES - 1 && ft && before.streak >= 2) res.finished = true;
    drawChip();
    if (res.finished) { kind = 'ending'; await ending(); return; }
    if (res.advanced) { stage = res.stage; await levelUp(); if (stage === 1 && !breakDone) { breakDone = true; await balloonBreak(); } }
    else if (!ft) await speak('kancil', 'Tidak apa-apa. Kita coba lagi, ya!');
    else await speak('jali', pick(['Good!', 'Well done!', 'Yes!']));
  }
};

/* ---------- Jeda balon ---------- */
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  kind = 'balloons';
  await speak('kancil', 'Waktunya istirahat! Ada balon terbang di atas sungai. Ketuk balonnya, ya!');
  bubble.hidden = true; const P = portrait(); let left = 8;
  await new Promise((done) => {
    for (let i = 0; i < 8; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = P ? 2.4 : 4.5;
      b.position.set((Math.random() * 2 - 1) * w, 0.4, 0.5 + Math.random() * 1.5); b.scale.setScalar(P ? 1.1 : 1.3);
      b.userData = { v: (0.8 + Math.random() * 0.4) / SP, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100 * SP);
  });
  await speak('kancil', 'Seru, ya! Yuk, lanjut menyeberang.');
};

/* ---------- Ketukan bebas ---------- */
const onKancil = async () => { if (talking) return; play('toggle'); hop(actors.kancil); if (pending && prompt) await speak('kancil', prompt); else await speak('kancil', 'Aku Kancil. Aku mau menyeberang!'); };
const onJali = async () => { if (talking) return; play('toggle'); hop(actors.jali, 0.25); await speak('jali', pick(['Crocodile!', 'River!', 'Jump!', 'How many?', 'Ten!'])); };
const onCroc = async (c) => { if (talking) return; play('placement-c', 1.2); const g = c.g; tween(0.35, (t) => { g.userData.body.position.y = Math.sin(t * Math.PI) * 0.15; }, (t) => t); if (c.mode !== 'leaf' && c.mode !== 'blank') say(String(c.label)); };
const hop = (a, h = 0.35) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);
const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 20) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent && o.visible), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
let started = false;
const start = () => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } run(); };
$('#startBtn').addEventListener('click', start);

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  placeCam();
  const K = actors.kancil, J = actors.jali, N = actors.nenek;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  if (N) { N.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; N.userData.head.rotation.x = N.userData.talk ? Math.sin(t * 13) * 0.05 : 0; }
  crocs.forEach((c, i) => { if (!c.g.visible) return; c.g.position.y = Math.sin(t * 1.4 + c.ph) * 0.02; c.g.userData.tail.rotation.y = Math.sin(t * 1.8 + c.ph) * 0.25; c.g.userData.head.rotation.z = c.g.userData.talk || (i === 0 && crocs[0].g.userData.talk) ? Math.sin(t * 12) * 0.08 : 0; c.badge.scale.setScalar(c.mode === 'hi' ? 0.62 : 0.52); });
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; b.rotation.z = Math.sin(t * 1.6 + b.userData.ph) * 0.12; if (b.position.y > 8) b.userData.end(); }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Sungai gagal dimuat: ' + (e && e.message || e); throw e; }
  layout(10); placeK(-1);
  try { await lim(makeThumbs(), 5000); } catch (e) { console.warn(e); }
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false;
  window.__game = {
    state: () => ({ stage, kind, pending: pending && { ...pending }, kk: KK.load(BAB), finished: finishedAll, T, kIdx }),
    answerCorrect: () => { if (!pending) return false; if (pending.type === 'line') { const r = document.querySelector('.kk-line input'); r.value = pending.answer; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); } else document.querySelectorAll('.kk-opt')[pending.correct].click(); return true; },
    answerWrong: () => { if (!pending || pending.type !== 'ask') return false; const i = (pending.correct + 1) % pending.n; document.querySelectorAll('.kk-opt')[i].click(); return true; },
    popBalloons: () => { balloons.slice().forEach(b => b.userData.tap()); },
    setStage: (s) => { const o = KK.load(BAB); o.stage = s; o.streak = 0; KK.save(BAB, o); stage = s; },
    actors, crocs, cam,
  };
  frame();
  if (QS.has('play')) start();
})();
