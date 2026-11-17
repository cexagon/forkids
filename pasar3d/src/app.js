/* Kota Kancil 3D: diorama Pasar. Dunia dulu: semua interaksi lewat mengetuk benda dan warga di adegan. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const QS = new URLSearchParams(location.search);

/* ---------- Data ---------- */
const ITEMS = {
  tomato: { id: 'tomat', en: 'tomato', ens: 'tomatoes', s: 0.3 },
  carrot: { id: 'wortel', en: 'carrot', ens: 'carrots', s: 0.26, lift: 0.16 },
  lettuce: { id: 'selada', en: 'lettuce', ens: 'lettuces', s: 0.24 },
  potato: { id: 'kentang', en: 'potato', ens: 'potatoes', s: 0.34, lift: 0.13 },
  onion: { id: 'bawang', en: 'onion', ens: 'onions', s: 0.28 },
  bun: { id: 'roti', en: 'bun', ens: 'buns', s: 0.34 },
};
const CRATES = { tomato: 'crate_tomatoes', carrot: 'crate_carrots', lettuce: 'crate_lettuce', potato: 'crate_potatoes', onion: 'crate_onions', bun: 'crate_buns' };
const W_ID = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
const W_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Simpanan ---------- */
const KEY = 'kota-kancil-3d-v1';
let D = { sound: true, helped: 0, level: 0 };
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
for (const n of ['placement-a', 'placement-b', 'placement-c', 'toggle', 'rotate']) { const a = new Audio(`./sounds/${n}.ogg`); a.preload = 'auto'; sounds[n] = a; }
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
const sun = new THREE.DirectionalLight(0xffdfae, 2.7); sun.position.set(-7, 13, 9); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 40 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun);

const world = new THREE.Group(); scene.add(world);
const tappables = []; const flagGroups = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };

const loader = new GLTFLoader();
const cache = {};
const load = (name) => cache[name] || (cache[name] = loader.loadAsync((window.__MODELS && window.__MODELS[name]) || `./models/${name}.glb`).then(g => { g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material.map) { o.material.map.colorSpace = THREE.SRGBColorSpace; } o.material.roughness = 0.85; o.material.metalness = 0; } }); return g.scene; }));
const inst = async (name, s = 1, p = [0, 0, 0], ry = 0) => { const o = (await load(name)).clone(true); o.scale.setScalar(s); o.position.set(...p); o.rotation.y = ry; world.add(o); return o; };

const CUST = [
  { name: 'Bu Sari', opts: {}, hi: 'Halo! Aku mau belanja untuk warung.', bye: ['Terima kasih! Belanjaanku lengkap.', 'Makasih, ya. Warungku bisa buka!'] },
  { name: 'Bu Guru Dia', opts: { dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }, hi: 'Selamat pagi! Ibu Guru Dia mau belanja untuk bekal kelas.', bye: ['Pintar sekali! Hitunganmu tepat.', 'Terima kasih. Besok ceritakan di kelas, ya!'] },
  { name: 'Nenek Gabe', opts: { kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }, hi: 'Halo, Cucu! Nenek Gabe mau masak yang enak hari ini.', bye: ['Terima kasih, Cucu. Nanti Nenek masakkan, ya!', 'Wah, pas! Nenek senang sekali.'] },
  { name: 'Kakek Ramlan', opts: { kind: 'kakek', dress: 0x4f8a5b }, hi: 'Wah, pasarnya ramai! Kakek Ramlan titip belanja, ya.', bye: ['Mantap! Kakek bangga padamu.', 'Terima kasih. Kamu teliti seperti Kakek waktu muda!'] },
];
let cust = null; const balloons = [];
let pointer = null; const stallObjs = []; const tags = []; const actors = {}; const crates = {}; const lanterns = []; const flags = []; const clouds = [];
const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur, fn, ease, res }));
const bounce = (o, amt = 0.18) => { const y0 = o.userData.y0 ?? (o.userData.y0 = o.position.y); const s0 = o.userData.s0 ?? (o.userData.s0 = o.scale.x); return tween(0.38, (t) => { const k = Math.sin(t * Math.PI); o.position.y = y0 + k * amt; o.scale.setScalar(s0 * (1 + k * 0.08)); }, (t) => t); };

const buildWorld = async () => {
  world.add(B.island());
  /* deret ruko di belakang */
  const CS = 2.0;
  await inst('building_A', CS, [-4.3, 0.02, -3.6]);
  await inst('building_B', CS, [0, 0.02, -3.6]);
  for (const x of [-4.3, 0]) { const r = B.tileRoof(4, 4, 0.85); r.position.set(x, 3.3, -3.6); r.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.62).lerp(new THREE.Color(0x8a7a70), 0.35); } }); world.add(r); }
  for (const [x, z, sc, ry] of [[3.3, -3.6, 1.7, 0.4], [5.4, -2.9, 2.1, 2.2], [7.0, -4.1, 1.5, 4]]) { const t = B.palm(sc); t.position.set(x, 0, z); t.rotation.y = ry; world.add(t); }
  { const t = B.tree(1.2); t.position.set(4.5, 0, -4.6); world.add(t); }
  await inst('streetlight', 2.6, [-7.2, 0.05, 0.6], Math.PI / 2);
  await inst('streetlight', 2.6, [7.2, 0.05, 0.6], -Math.PI / 2);
  await inst('bench', 2.6, [5.5, 0.06, 4.1], 0.25);
  for (const [x, z] of [[-7.4, 3.6], [-6.8, 4.3], [7.3, 3.2], [3.4, -1.9], [-3.6, -1.9]]) await inst('bush', 2.6, [x, 0.02, z]);
  await inst('box_A', 2.4, [6.3, 0.06, -0.9], 0.4); await inst('box_B', 2.4, [6.75, 0.06, -0.55], -0.3); await inst('box_A', 2.4, [-0.05, 0.06, -1.1], 0.2);
  for (const [x, z, s] of [[-7.3, -3.9, 1.25], [-7.6, -1.6, 0.9]]) { const t = B.tree(s); t.position.set(x, 0, z); world.add(t); }

  /* dua lapak */
  const stalls = [[-2.35, ['tomato', 'carrot', 'lettuce'], '#e8742a', '#fff3d1', 'SAYUR SEGAR'], [2.35, ['potato', 'onion', 'bun'], '#2c8daa', '#fff3d1', 'WARUNG BU MURNI']];
  for (const [x, keys, c1, c2, label] of stalls) {
    const s = B.stall(c1, c2, label); s.position.set(x, 0.02, -0.4); world.add(s); const so = { g: s, x, cr: [] }; stallObjs.push(so);
    for (let i = 0; i < 3; i++) {
      const k = keys[i]; const c = await inst(CRATES[k], 0.53, [x - 1.1 + i * 1.1, 0.9, -0.22]);
      c.rotation.x = 0.42; c.userData.key = k; c.userData.dx = -1.1 + i * 1.1; crates[k] = c; so.cr.push(c); tap(c, () => onCrate(k));
      const it = ITEMS[k], ls = it.s * 1.55 / 0.53;
      for (const [hx, hy, hz, hr] of [[-0.42, 0.62, 0.25, 0.4], [0.42, 0.62, 0.2, 2.1], [0, 0.82, -0.05, 4.0]]) { const h = (await load('food_ingredient_' + k)).clone(true); h.scale.setScalar(ls); h.position.set(hx, hy, hz); h.rotation.y = hr; c.add(h); }
    }
  }
  /* umbul-umbul dan lampion */
  const a = new THREE.Vector3(-7.2, 2.75, 0.6), m1 = new THREE.Vector3(-2.35, 3.45, -0.6), m2 = new THREE.Vector3(2.35, 3.45, -0.6), b = new THREE.Vector3(7.2, 2.75, 0.6);
  for (const [p, q, n] of [[a, m1, 8], [m1, m2, 8], [m2, b, 8]]) { const bt = B.bunting(p, q, n); world.add(bt); flagGroups.push(bt); bt.traverse(o => { if (o.userData.sway) flags.push(o); }); }
  LPH = [[-4.2, 1.9, 0.7], [-0.5, 1.9, 0.7], [0.5, 1.9, 0.7], [4.2, 1.9, 0.7], [-7.0, 2.2, 1.0], [7.0, 2.2, 1.0]];
  for (let i = 0; i < 6; i++) { const l = B.lantern(); l.scale.setScalar(1.3); l.position.set(...LPH[i]); l.visible = i < Math.min(6, D.helped); const str = B.cyl(0.008, 0.008, 0.22, B.PAL.ink, [0, 0.3, 0], 4); l.add(str); world.add(l); lanterns.push(l); }

  /* gerobak tebu Kancil */
  const cart = B.tebuCart(); cart.position.set(-5.9, 0.02, 1.2); cart.rotation.y = 0.35; world.add(cart); tap(cart, () => onCart());

  /* warga */
  const k = B.kancil(); k.position.set(-3.2, 0.03, 2.6); k.rotation.y = -1.0; k.scale.setScalar(1.5); world.add(k); actors.kancil = k; tap(k, () => onKancil());
  const post = new THREE.Group(); post.add(B.cyl(0.07, 0.09, 1.25, B.PAL.woodDark, [0, 0.62, 0], 10)); post.add(B.box(0.75, 0.1, 0.16, B.PAL.wood, [0, 1.25, 0])); post.position.set(4.1, 0.03, 2.3); world.add(post); jaliPost = post;
  const j = B.jali(); j.position.set(4.1, 1.33, 2.3); j.rotation.y = -Math.PI * 0.7; j.scale.setScalar(1.45); world.add(j); actors.jali = j; tap(j, () => onJali());
  for (const c of CUST) { const s = B.warga(c.opts); s.position.set(0.5, 0.03, 2.4); s.rotation.y = 0.1; s.scale.setScalar(1.55); tap(s, () => onSari()); c.g = s; }
  cust = CUST[D.helped % CUST.length]; world.add(cust.g); actors.sari = cust.g;
  world.add(B.sea());
  pointer = B.arrow(); pointer.visible = false; world.add(pointer);
};

/* ---------- Kamera ---------- */
let LPH = []; const cam = { az: 0.2, el: 0.4, target: new THREE.Vector3(0, 1.5, 0.6), azGoal: 0.2 };
const HOME = { kancil: [-4.9, 3.5], jali: [5.5, 2.9], sari: [0.5, 2.7] }, PORT = { kancil: [-1.55, 6.0], jali: [1.65, 6.0], sari: [0.05, 6.35] };
let jaliPost = null;
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  const portrait = w / h < 0.9;
  camera.fov = portrait ? 30 : 26; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 2.55 : 7.3, needH = portrait ? 2 : 4.1;
  cam.dist = Math.max(needW / ht, needH / vt);
  cam.el = portrait ? 0.62 : 0.4; cam.target.set(0, portrait ? 1.5 : 1.55, portrait ? 2.9 : 0.3); if (portrait) { cam.az = cam.azGoal = 0; } document.body.classList.toggle('portrait', portrait);
  stallObjs.forEach((so, i) => { const sx = portrait ? 0 : so.x, sz = portrait ? (i ? 2.85 : -0.6) : -0.4; so.g.position.x = sx; so.g.position.z = sz; so.g.userData.roof.visible = !(portrait && i); so.cr.forEach(c => { c.position.x = sx + c.userData.dx; c.position.z = sz + 0.18; }); });
  if (lanterns.length) { const L = portrait ? [[-1.85, 1.9, 0.5], [1.85, 1.9, 0.5], [-1.85, 1.9, 3.95], [1.85, 1.9, 3.95]] : LPH; for (let i = 0; i < 4; i++) lanterns[i].position.set(...L[i]); }
  flagGroups.forEach(g => { g.visible = !portrait; });
  const P = portrait ? PORT : HOME; for (const k of Object.keys(P)) if (actors[k]) { actors[k].position.x = P[k][0]; actors[k].position.z = P[k][1]; } if (jaliPost) { jaliPost.position.x = P.jali[0]; jaliPost.position.z = P.jali[1]; const f = portrait ? 0.72 : 1; jaliPost.scale.setScalar(f); actors.jali.position.y = 0.03 + 1.3 * f; for (const [k, b] of [['kancil', 1.5], ['jali', 1.45], ['sari', 1.55]]) actors[k].scale.setScalar(b * f); CUST.forEach(c => c.g && c.g.scale.setScalar(1.55 * f)); }
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung bicara ---------- */
const bubble = $('#bubble'); let bubbleOn = null;
const headPos = new THREE.Vector3();
const speak = async (who, text, lang) => {
  const names = { kancil: 'Kancil', jali: 'Jali', sari: cust.name };
  bubble.dataset.who = who; $('#who').textContent = names[who]; $('#msg').textContent = text; bubble.hidden = false; bubbleOn = who;
  const a = actors[who]; a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  a.userData.talk = 0;
};
const placeBubble = () => { };

/* ---------- Gambar kecil benda (untuk daftar pesanan) ---------- */
const thumbs = {};
const makeThumbs = async () => {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xffffff, 0xd9b88a, 2.2)); const dl = new THREE.DirectionalLight(0xffffff, 1.5); dl.position.set(-2, 4, 3); sc.add(dl);
  const c = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  for (const k of Object.keys(ITEMS)) {
    const o = (await load('food_ingredient_' + k)).clone(true); sc.add(o);
    const bx = new THREE.Box3().setFromObject(o), ctr = bx.getCenter(new THREE.Vector3()), size = bx.getSize(new THREE.Vector3()).length();
    c.position.set(ctr.x + size * 0.9, ctr.y + size * 0.8, ctr.z + size * 1.5); c.lookAt(ctr); r.render(sc, c); thumbs[k] = r.domElement.toDataURL(); sc.remove(o);
  }
  r.dispose();
  const tl = new THREE.TextureLoader();
  for (const k of Object.keys(crates)) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 160; const x = cv.getContext('2d');
    x.fillStyle = '#fffaf0'; x.beginPath(); x.arc(80, 80, 74, 0, 7); x.fill(); x.lineWidth = 9; x.strokeStyle = '#3b2614'; x.stroke();
    const im = new Image(); im.src = thumbs[k]; await im.decode(); x.drawImage(im, 16, 16, 128, 128);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.6, 28), new THREE.MeshBasicMaterial({ map: tx, transparent: true }));
    m.rotation.x = -0.42; m.position.set(0, -0.55, 1.3); crates[k].add(m);
  }
};

/* ---------- Permainan ---------- */
let order = null, busy = false, greeted = false, target = null;
const orderEl = $('#order'), askEl = $('#ask');
const drawOrder = () => {
  const nxt = order && order.list.find(o => o.got < o.n); target = nxt ? nxt.k : null;
  if (!order) { orderEl.hidden = true; askEl.hidden = true; return; }
  orderEl.hidden = false;
  askEl.hidden = !nxt; if (nxt) askEl.innerHTML = `<img src="${thumbs[nxt.k]}" alt=""><div>${Array.from({ length: nxt.n }, (_, i) => `<u class="${i < nxt.got ? 'on' : ''}"></u>`).join('')}</div>`;
  orderEl.innerHTML = order.list.map(o => `<div class="want ${o.got >= o.n ? 'done' : ''}"><img src="${thumbs[o.k]}" alt=""><b>${o.got}</b><span>/ ${o.n}</span><i>${ITEMS[o.k].id}</i></div>`).join('');
};
const basketWorld = new THREE.Vector3();
const flyItem = async (k, toBasket) => {
  const src = crates[k]; const o = (await load('food_ingredient_' + k)).clone(true); const it = ITEMS[k]; o.scale.setScalar(it.s); world.add(o);
  const from = src.getWorldPosition(new THREE.Vector3()); from.y += 0.45;
  const basket = actors.sari.userData.basket;
  const n = basket.children.filter(c => c.userData.item).length;
  if (toBasket) {
    basket.getWorldPosition(basketWorld); const to = basketWorld.clone(); to.y += 0.1;
    await tween(0.55, (t) => { o.position.lerpVectors(from, to, t); o.position.y += Math.sin(t * Math.PI) * 1.3; o.rotation.y = t * 6; });
    world.remove(o); o.userData.item = true; const a = n * 2.4, rr = n === 0 ? 0 : 0.11; o.scale.setScalar(it.s / actors.sari.scale.x * 0.8); o.position.set(Math.cos(a) * rr, 0.0 + Math.floor(n / 4) * 0.1 + (it.lift || 0), Math.sin(a) * rr); o.rotation.set(0, a, 0); basket.add(o); play('placement-b', 1.1);
  } else {
    await tween(0.9, (t) => { o.position.copy(from); o.position.y += Math.sin(t * Math.PI) * 0.95; o.rotation.y = t * 7; const k2 = Math.sin(t * Math.PI); o.scale.setScalar(it.s * (0.6 + k2 * 0.9)); }, (t) => t);
    world.remove(o);
  }
};
const hop = (a, h = 0.35) => tween(0.45, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

const onCrate = async (k) => {
  if (busy) return; const it = ITEMS[k]; play('placement-a', 0.9 + Math.random() * 0.3); bounce(crates[k], 0.12);
  if (!order) {
    busy = true; flyItem(k, false);
    await speak('kancil', `Ini ${it.id}.`); hop(actors.jali, 0.2);
    await speak('jali', `${cap(it.en)}!`); busy = false; return;
  }
  const want = order.list.find(o => o.k === k);
  if (!want) { busy = true; order.tries++; actors.kancil.userData.mood = 'think'; await speak('kancil', `Itu ${it.id}. ${cust.name} minta ${order.list.filter(o => o.got < o.n).map(o => ITEMS[o.k].id).join(' dan ')}.`); busy = false; return; }
  if (want.got >= want.n) { busy = true; await speak('kancil', `${cap(it.id)} sudah cukup, ${W_ID[want.n]}. ${order.list.some(o => o.got < o.n) ? 'Sekarang ambil yang lain.' : ''}`); busy = false; return; }
  want.got++; drawOrder(); busy = true; await flyItem(k, true); busy = false;
  say(W_ID[want.got]);
  if (order.list.every(o => o.got >= o.n)) return finishOrder();
  if (want.got === want.n) { busy = true; await wait(500); await speak('kancil', `${cap(W_ID[want.n])} ${it.id}, pas! Sekarang ${order.list.filter(o => o.got < o.n).map(o => `${W_ID[o.n]} ${ITEMS[o.k].id}`).join(' dan ')}.`); busy = false; }
};
const newOrder = () => {
  const lv = D.level; const keys = shuffle(Object.keys(ITEMS)).slice(0, lv >= 1 ? 2 : 1);
  return { list: keys.map(k => ({ k, n: rand(lv >= 2 ? 3 : 2, lv >= 2 ? 6 : lv >= 1 ? 4 : 5), got: 0 })), tries: 0 };
};
const onSari = async () => {
  if (busy) return; play('toggle');
  if (order) { busy = true; await speak('sari', `Aku mau ${order.list.map(o => `${W_ID[o.n]} ${ITEMS[o.k].id}`).join(' dan ')}.`); busy = false; return; }
  busy = true; $('#alert').hidden = true; hop(actors.sari, 0.15);
  const o = newOrder();
  await speak('sari', `${cust.hi} Tolong ambilkan ${o.list.map(x => `${W_ID[x.n]} ${ITEMS[x.k].id}`).join(' dan ')}, ya.`);
  order = o; drawOrder();
  await speak('kancil', `Ketuk peti ${ITEMS[o.list[0].k].id} ${W_ID[o.list[0].n]} kali. Kita hitung bersama!`);
  busy = false;
};
const finishOrder = async () => {
  busy = true; const total = order.list.reduce((s, o) => s + o.n, 0); const first = order.tries === 0;
  await wait(400); chime([523, 659, 784, 1047]); confetti(); hop(actors.kancil, 0.45); hop(actors.sari, 0.2);
  const l = order.list;
  await speak('kancil', l.length > 1 ? `Hebat! ${cap(W_ID[l[0].n])} tambah ${W_ID[l[1].n]}, semuanya ${W_ID[total] || total} belanjaan.` : `Hebat! ${cap(W_ID[l[0].n])} ${ITEMS[l[0].k].id}, pas!`);
  hop(actors.jali, 0.25);
  await speak('jali', l.length > 1 ? `${cap(W_EN[l[0].n])} ${l[0].n > 1 ? ITEMS[l[0].k].ens : ITEMS[l[0].k].en} and ${W_EN[l[1].n]} ${l[1].n > 1 ? ITEMS[l[1].k].ens : ITEMS[l[1].k].en}. Well done!` : `${cap(W_EN[l[0].n])} ${l[0].n > 1 ? ITEMS[l[0].k].ens : ITEMS[l[0].k].en}. Well done!`);
  await speak('sari', pick(cust.bye));
  D.helped++; if (first) D.level = Math.min(2, D.level + 1); save();
  const lan = lanterns[Math.min(lanterns.length - 1, D.helped - 1)];
  if (lan && D.helped <= lanterns.length) { lan.visible = true; lan.userData.glow.emissive.setHex(0xffb347); lan.userData.glow.emissiveIntensity = 0.9; lan.scale.setScalar(0.01); chime([784, 988, 1175]); await tween(0.6, (t) => lan.scale.setScalar(t)); await speak('kancil', 'Lihat, satu lampion pasar menyala! Makin banyak membantu, makin terang pasarnya.'); }
  /* kosongkan keranjang, pesanan berikutnya menunggu */
  const basket = actors.sari.userData.basket; basket.children.filter(c => c.userData.item).forEach(c => basket.remove(c));
  order = null; drawOrder(); bubble.hidden = true; bubbleOn = null; $('#helped').textContent = `${D.helped} bantuan`;
  if (D.helped % 2 === 0) await balloonBreak();
  /* pembeli berikutnya datang */
  { const old = cust.g, s0 = old.scale.x; await tween(0.3, (t) => old.scale.setScalar(s0 * (1 - t) + 0.001)); world.remove(old); old.scale.setScalar(s0);
    cust = CUST[D.helped % CUST.length]; const nw = cust.g; nw.position.copy(old.position); nw.rotation.y = old.rotation.y; world.add(nw); actors.sari = nw; play('placement-c'); await tween(0.4, (t) => nw.scale.setScalar(s0 * t + 0.001)); nw.scale.setScalar(s0); }
  busy = false;
  setTimeout(() => { if (!order) $('#alert').hidden = false; }, 2500);
};
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
const balloonBreak = async () => {
  await speak('kancil', 'Waktunya istirahat! Ada balon lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; const portrait = innerWidth / innerHeight < 0.9; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 1.5 : 4.2;
      b.position.set((Math.random() * 2 - 1) * w, 0.9, (portrait ? 6.9 : 3.4) + Math.random() * 0.8); b.scale.setScalar(portrait ? 0.95 : 1.25);
      b.userData = { v: 0.8 + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, i * 1100);
  });
  await speak('kancil', 'Seru, ya! Yuk, lanjut membantu.');
  bubble.hidden = true; bubbleOn = null;
};
const onKancil = async () => { if (busy) return; busy = true; play('toggle'); hop(actors.kancil); await speak('kancil', order ? `Ayo, ketuk petinya. Kita hitung sama-sama!` : pick(['Ketuk peti mana saja, nanti kusebut namanya.', `${cust.name} sedang menunggu. Ketuk dia kalau mau membantu!`, 'Warung Bu Murni itu paling lengkap di pasar ini!', 'Mau es tebu? Itu gerobakku!'])); busy = false; };
const onJali = async () => { if (busy) return; busy = true; play('toggle'); hop(actors.jali, 0.3); await speak('jali', pick(['Hello! I am Jali. Tap a crate!', 'Good morning! What a sunny day.', 'I like tomatoes. Do you?'])); busy = false; };
const onCart = async () => { if (busy) return; busy = true; play('rotate'); await speak('kancil', 'Itu gerobak es tebuku. Tebunya manis sekali!'); await speak('jali', 'Sugar cane juice. Sweet!'); busy = false; };

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, az: cam.azGoal, moved: false }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 8) down.moved = true; if (down.moved) cam.azGoal = Math.max(-0.45, Math.min(0.75, down.az - dx * 0.004)); });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || d.moved) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
$('#startBtn').addEventListener('click', async () => {
  $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ }
  if (greeted) return; greeted = true; busy = true;
  await speak('kancil', 'Selamat datang di Pasar Kota Kancil! Ketuk apa saja yang kamu lihat.');
  await speak('jali', 'Hello! Welcome to the market!');
  busy = false; $('#alert').hidden = false;
});

/* ---------- Putaran ---------- */
const clock = new THREE.Clock(); const alertEl = $('#alert'); const v = new THREE.Vector3();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  cam.az += (cam.azGoal - cam.az) * 0.12; placeCam();
  /* gerak diam */
  const K = actors.kancil, J = actors.jali, S = actors.sari;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; K.userData.body.scale.y = 1 + Math.sin(t * 2.2) * 0.012; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  if (S) { S.userData.head.rotation.z = Math.sin(t * 1.1) * 0.04; S.userData.head.rotation.x = S.userData.talk ? Math.sin(t * 13) * 0.05 : 0; S.userData.body.scale.y = 1 + Math.sin(t * 2) * 0.01; }
  if (pointer) { pointer.visible = !!target; if (target) { const c = crates[target]; pointer.position.set(c.position.x, 1.52 + Math.abs(Math.sin(t * 4)) * 0.16, c.position.z + 0.5); pointer.rotation.y = t * 2; } }
  Object.values(crates).forEach((c, i) => { const s0 = c.userData.s0 || 0.53; if (!tweens.length) c.scale.setScalar(s0 * (1 + (c.userData.key === target ? Math.abs(Math.sin(t * 4)) * 0.06 : Math.max(0, Math.sin(t * 1.2 + i * 1.1) - 0.96) * 1.2))); });
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v; b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; b.rotation.z = Math.sin(t * 1.6 + b.userData.ph) * 0.12; if (b.position.y > (innerWidth / innerHeight < 0.9 ? 9.5 : 6.5)) b.userData.end(); }
  flags.forEach(f => { f.rotation.x = Math.sin(t * 2.2 + f.userData.sway) * 0.22; });
  lanterns.forEach((l, i) => { if (l.visible) { l.rotation.z = Math.sin(t * 1.4 + i) * 0.08; l.userData.glow.emissive.setHex(0xffb347); l.userData.glow.emissiveIntensity = 0.75 + Math.sin(t * 3 + i) * 0.12; } });
  clouds.forEach((c, i) => { c.position.x += dt * (0.12 + i * 0.04); if (c.position.x > 16) c.position.x = -16; });
  renderer.render(scene, camera);
  placeBubble();
  if (!alertEl.hidden && S) { S.userData.head.getWorldPosition(v); v.y += 0.36 * S.scale.x + Math.abs(Math.sin(t * 3)) * 0.1; v.project(camera); alertEl.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth - 29}px, ${(-v.y * 0.5 + 0.5) * innerHeight - 58}px)`; }
  if (!askEl.hidden && S) { S.userData.head.getWorldPosition(v); v.y += 0.36 * S.scale.x; v.project(camera); askEl.style.transform = `translate(calc(${(v.x * 0.5 + 0.5) * innerWidth}px - 50%), calc(${(-v.y * 0.5 + 0.5) * innerHeight}px - 100%))`; }
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  try { await document.fonts.load('800 40px "Baloo 2"'); } catch (e) { /* abaikan */ }
  await buildWorld(); fit(); await makeThumbs();
  $('#helped').textContent = `${D.helped} bantuan`;
  renderer.compile(scene, camera);
  $('#loading').remove(); $('#startBtn').disabled = false;
  if (QS.has('play')) { $('#intro').classList.add('gone'); greeted = true; $('#alert').hidden = false; }
  window.__game = { balloonBreak, CUST, world, onSari, onCrate, get order() { return order; }, cam, actors, D };
  frame();
})();
