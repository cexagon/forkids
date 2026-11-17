/* Kota Kancil, Bab 06: Seratus Candi. Bandung membangun 100 candi kecil sebelum ayam berkokok; anak mengajari Kancil menghitung lewat puluhan. */
import * as THREE from 'three';
import * as B from './build.js';

const $ = (s) => document.querySelector(s);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[rand(0, a.length - 1)];
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const QS = new URLSearchParams(location.search);
const FAST = QS.has('fast');
const wait = (ms) => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 30) : ms));
const BAB = 6, STAGES = 3;
const W_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* ---------- Simpanan (suara saja) ---------- */
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
const chime = (freqs, type = 'triangle', step = 0.1) => { if (!D.sound) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); freqs.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * step; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.26); }); } catch (e) { /* abaikan */ } };

/* ---------- Renderer & adegan malam ---------- */
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: QS.has('shot') });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const NIGHT = new THREE.Color(0x1b2a4e), DAWN = new THREE.Color(0xf4b98a), SEA_DAWN = new THREE.Color(0xe9a98a);
scene.background = NIGHT.clone();
const camera = new THREE.PerspectiveCamera(30, 1, 1, 400);
const hemi = new THREE.HemisphereLight(0xa9c2ff, 0x3a3550, 1.35); scene.add(hemi);
const moon = new THREE.DirectionalLight(0xdfe8ff, 2.1); moon.position.set(-6, 12, 7); moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024); Object.assign(moon.shadow.camera, { left: -9, right: 9, top: 8, bottom: -8, near: 1, far: 40 }); moon.shadow.bias = -0.0005; moon.shadow.normalBias = 0.03;
scene.add(moon);
const warm = new THREE.DirectionalLight(0xffc27a, 0.7); warm.position.set(5, 4, 8); scene.add(warm);

const world = new THREE.Group(); scene.add(world);
const tappables = [];
const tap = (obj, fn) => { obj.userData.tap = fn; tappables.push(obj); };
const tweens = [];
const tween = (dur, fn, ease = (t) => 1 - Math.pow(1 - t, 3)) => new Promise(res => tweens.push({ t: 0, dur: FAST ? 0.02 : dur, fn, ease, res }));
const hop = (a, h = 0.3) => tween(0.42, (t) => { a.userData.body.position.y = Math.sin(t * Math.PI) * h; }, (t) => t);

/* ---------- Grid candi 10 x 10 ---------- */
const S = 0.56, GZ = 0;
const slotPos = (i) => { const r = Math.floor(i / 10), c = i % 10; return new THREE.Vector3((c - 4.5) * S, 0, GZ + (r - 4.5) * S); };
const parts = []; const scales = new Float32Array(100); const goal = new Float32Array(100);
const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v3 = new THREE.Vector3(), sc3 = new THREE.Vector3();
let count = 0; const rowLabels = []; let slots = null;
const writeInst = () => {
  for (let i = 0; i < 100; i++) { const s = scales[i]; const p = slotPos(i); sc3.set(s || 0.0001, s || 0.0001, s || 0.0001); m4.compose(p, q0, sc3); for (const m of parts) m.setMatrixAt(i, m4); }
  for (const m of parts) m.instanceMatrix.needsUpdate = true;
};
const setCount = (n) => { count = n; for (let i = 0; i < 100; i++) { scales[i] = goal[i] = i < n ? 1 : 0; } writeInst(); updateBoard(); updateRows(); };
const updateRows = () => rowLabels.forEach((l, r) => { const full = count >= (r + 1) * 10; l.material.opacity = full ? 1 : 0.28; l.scale.setScalar(1); l.scale.set(full ? 0.95 : 0.8, full ? 0.475 : 0.4, 1); });
const grow = (i, on) => tween(0.22, (t) => { scales[i] = on ? t * (1 + Math.sin(t * Math.PI) * 0.25) : 1 - t; writeInst(); });
const addOne = async () => { if (count >= 100) return; const i = count; count++; play('placement-b', 0.9 + (i % 10) * 0.04); updateBoard(); await grow(i, true); if (count % 10 === 0) { updateRows(); flashRow(count / 10 - 1); } };
const removeOne = async () => { if (count <= 0) return; count--; const i = count; play('placement-a', 1.2); updateBoard(); await grow(i, false); updateRows(); };
const flashRow = (r) => { const l = rowLabels[r]; if (!l) return; chime([660, 880]); tween(0.5, (t) => { const k = 1 + Math.sin(t * Math.PI) * 0.6; l.scale.set(0.95 * k, 0.475 * k, 1); }); };

/* ---------- Papan angka ---------- */
const boardN = $('#count'), boardEq = $('#eq');
let eqText = '';
const updateBoard = () => { boardN.textContent = count; };
const setEq = (html, cls = '') => { eqText = html; boardEq.innerHTML = html; boardEq.className = cls; };

/* ---------- Tokoh ---------- */
const seaMats = []; const actors = {}; let jaliPost = null; const lanterns = []; let starPts = null; let rooster = null; const guests = [];
const NAMES = { kancil: 'Kancil', jali: 'Jali', rara: 'Rara', bandung: 'Bandung' };
const buildWorld = async () => {
  world.add(B.nightField());
  starPts = B.stars(); scene.add(starPts);
  { const mm = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff2c4 })); mm.position.set(-30, 26, -60); scene.add(mm); actors.moonDisc = mm; }
  /* tempat kosong: alas batu tipis untuk 100 candi */
  slots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.03, 0.46), B.mat(0x6f6b64), 100);
  for (let i = 0; i < 100; i++) { m4.compose(slotPos(i).setY(0.0), q0, sc3.set(1, 1, 1)); slots.setMatrixAt(i, m4); }
  slots.receiveShadow = true; world.add(slots);
  for (const [geo, col] of B.candiParts()) { const m = new THREE.InstancedMesh(geo, B.mat(col), 100); m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; parts.push(m); world.add(m); }
  for (let r = 0; r < 10; r++) { const l = B.numberSprite(String((r + 1) * 10), '#ffd166'); l.position.set(5 * S + 0.55, 0.25, GZ + (r - 4.5) * S); world.add(l); rowLabels.push(l); }
  setCount(0);
  for (const [x, z] of [[-3.9, -3.4], [3.9, -3.4], [-3.9, 3.0], [3.9, 3.0]]) { const p = B.lanternPost(); p.position.set(x, 0, z); p.rotation.y = x < 0 ? 0 : Math.PI; world.add(p); lanterns.push(p.userData.l); }
  for (const [x, z, s] of [[-6.6, -3.8, 1.2], [6.6, -3.6, 1.1], [-6.9, 0.5, 0.9], [6.8, 1.2, 0.95]]) { const t = B.tree(s); t.position.set(x, 0, z); t.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.55); } }); world.add(t); }
  /* tokoh */
  const k = B.kancil(); k.scale.setScalar(1.4); world.add(k); actors.kancil = k; tap(k, () => onActor('kancil'));
  const rara = B.warga({ dress: 0xd9577a, head: 0x3b2614 }); rara.scale.setScalar(1.35); world.add(rara); actors.rara = rara; tap(rara, () => onActor('rara'));
  const bd = B.warga({ kind: 'kakek', dress: 0x3a6fb0, hair: 0x3b2614 }); bd.scale.setScalar(1.4); world.add(bd); actors.bandung = bd; bd.userData.basket.visible = false; tap(bd, () => onActor('bandung'));
  rara.userData.basket.visible = false;
  const post = new THREE.Group(); post.add(B.cyl(0.07, 0.09, 1.0, B.PAL.woodDark, [0, 0.5, 0], 10)); post.add(B.box(0.7, 0.1, 0.16, B.PAL.wood, [0, 1.0, 0])); world.add(post); jaliPost = post;
  const j = B.jali(); j.scale.setScalar(1.35); world.add(j); actors.jali = j; tap(j, () => onActor('jali'));
  rooster = B.ayam(); rooster.visible = false; rooster.scale.setScalar(1.6); world.add(rooster);
  for (const o of [{ dress: 0x2f6fb0, head: 0x86d3c6, glasses: true }, { kind: 'nenek', dress: 0x8a5fb0, head: 0xf0d27a, glasses: true }, { kind: 'kakek', dress: 0x4f8a5b }]) { const g = B.warga(o); g.scale.setScalar(1.3); g.visible = false; g.userData.basket.visible = false; world.add(g); guests.push(g); }
  world.add(B.sea()); world.children[world.children.length - 1].traverse(o => { if (o.material && o.material.color) { o.material = o.material.clone(); o.material.color.set(0x22355e); seaMats.push(o.material); } });
};

/* ---------- Kamera ---------- */
const cam = { az: 0, el: 0.95, target: new THREE.Vector3(0, 0, 0), azGoal: 0, dist: 20 };
const LAND = { kancil: [-4.6, 1.4, 0.9], rara: [-4.3, -1.2, 0.6], bandung: [4.5, -1.3, -0.6], jali: [4.6, 1.5, -2.4] };
const PORT = { kancil: [-1.95, -3.95, 0.4], rara: [-0.7, -4.05, 0.0], bandung: [0.65, -4.05, 0.0], jali: [1.95, -3.95, -0.6] };
let portrait = false;
const fit = () => {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  portrait = w / h < 0.9; document.body.classList.toggle('portrait', portrait);
  camera.fov = portrait ? 34 : 28; camera.updateProjectionMatrix();
  const vt = Math.tan((camera.fov * Math.PI) / 360), ht = vt * camera.aspect;
  const needW = portrait ? 3.75 : 7.0, needH = portrait ? 3.4 : 4.3;
  cam.dist = Math.max(needW / ht, needH / vt) * 1.05;
  cam.el = portrait ? 1.0 : 0.9;
  /* geser target ke depan supaya grid naik di layar, memberi ruang untuk lembar jawaban di bawah */
  cam.target.set(0, 0, portrait ? 1.1 : 1.0);
  if (portrait) cam.az = cam.azGoal = 0;
  const P = portrait ? PORT : LAND;
  for (const k of Object.keys(P)) if (actors[k]) { actors[k].position.set(P[k][0], 0.03, P[k][1]); actors[k].rotation.y = k === 'kancil' ? (portrait ? -1.3 : -0.2) : k === 'jali' ? (portrait ? -2.0 : -2.6) : P[k][2]; }
  if (jaliPost) { jaliPost.position.set(P.jali[0], 0.02, P.jali[1]); actors.jali.position.y = 1.07; }
  const f = portrait ? 0.85 : 1; for (const [k, b] of [['kancil', 1.4], ['jali', 1.35], ['rara', 1.35], ['bandung', 1.4]]) if (actors[k]) actors[k].scale.setScalar(b * f);
  if (rooster) rooster.position.set(portrait ? 0 : 3.3, 0.03, portrait ? 3.4 : 3.3);
  guests.forEach((g, i) => g.position.set(portrait ? -1.6 + i * 1.6 : -5.2 + i * 0.0, 0.03, portrait ? 4.0 : 2.6 + i * 0.0 - (i - 1) * 1.6));
  if (!portrait) guests.forEach((g, i) => { g.position.set(-5.6 - (i % 2) * 0.6, 0.03, 3.0 - i * 1.5); g.rotation.y = 0.9; });
};
const placeCam = () => { camera.position.set(cam.target.x + Math.sin(cam.az) * Math.cos(cam.el) * cam.dist, cam.target.y + Math.sin(cam.el) * cam.dist, cam.target.z + Math.cos(cam.az) * Math.cos(cam.el) * cam.dist); camera.lookAt(cam.target); };
addEventListener('resize', fit);

/* ---------- Gelembung bicara ---------- */
const bubble = $('#bubble');
const speak = async (who, text, lang) => {
  bubble.dataset.who = who; $('#who').textContent = NAMES[who] || who; $('#msg').textContent = text; bubble.hidden = false;
  const a = actors[who]; if (a) a.userData.talk = 1;
  await say(text, lang || (who === 'jali' ? 'en' : 'id'));
  if (a) a.userData.talk = 0;
};

/* ---------- Soal ---------- */
const f10 = (n) => Math.floor(n / 10) * 10;
let lastKey = '';
const gen = (stage, qi, tensSeen) => {
  for (let tries = 0; tries < 30; tries++) {
    let p;
    if (stage === 0) {
      if (Math.random() < 0.4) { const a = rand(91, 99); p = { kind: 'fill', a, T: 100, ans: 100 - a, b: 100 - a }; }
      else { let a = rand(11, 89); if (a % 10 === 0) a += rand(1, 9); const T = f10(a) + 10; p = { kind: 'fill', a, T, ans: T - a, b: T - a }; }
      p.wrong = p.a % 10; p.eq = `${p.a} + ? = ${p.T}`; if (p.wrong === p.ans) continue;
    } else if (stage === 1) {
      const o = rand(3, 9), b = rand(11 - o, 9); const a = rand(1, 8) * 10 + o; if (a + b > 99) continue;
      const T = f10(a) + 10; p = { kind: 'add', a, b, T, ans: a + b, s1: T - a, s2: a + b - T, eq: `${a} + ${b}` };
      p.wrongType = Math.random() < 0.5 ? 'glue' : 'ten'; p.wrong = p.wrongType === 'glue' ? +(`${a}${b}`) : a + b - 10;
    } else {
      if ((qi === 2 && !tensSeen) || Math.random() < 0.25) { const a = rand(1, 9) * 10; p = { kind: 'tens', a, T: 100, ans: 100 - a, b: 100 - a, wrong: (100 - a) / 10, eq: `${a} + ? = 100` }; }
      else {
        const o = rand(1, 7), b = rand(o + 1, 9), a = rand(2, 9) * 10 + o; const T = f10(a);
        p = { kind: 'sub', a, b, T, ans: a - b, s1: a - T, s2: b - (a - T), eq: `${a} − ${b}` };
        p.wrongType = Math.random() < 0.5 ? 'swap' : 'ten'; p.wrong = p.wrongType === 'swap' ? T + (b - o) : a - b + 10;
      }
    }
    const key = p.kind + p.a + '_' + p.b; if (key === lastKey) continue; lastKey = key; return p;
  }
  return { kind: 'fill', a: 37, T: 40, ans: 3, b: 3, wrong: 7, eq: '37 + ? = 40' };
};
const question = (p) => {
  if (p.kind === 'fill') return p.T === 100 ? `Sudah ${p.a} candi. Kurang berapa lagi sampai seratus?` : `Sudah ${p.a} candi. Berapa lagi supaya baris ini penuh jadi ${p.T}?`;
  if (p.kind === 'add') return `Sudah ${p.a} candi. Bandung membangun ${p.b} lagi. Jadi berapa candi?`;
  if (p.kind === 'sub') return `Ada ${p.a} candi. ${p.b} candi dibawa ke alun-alun untuk dihias lentera. Tinggal berapa di lapangan?`;
  return `Sudah ${p.a} candi, ${p.a / 10} baris penuh. Tinggal berapa lagi sampai seratus?`;
};
const lineOpts = (p) => {
  if (p.kind === 'fill') return { min: 0, max: 10, step: 1, start: 0 };
  if (p.kind === 'tens') return { min: 0, max: 100, step: 10, start: 0 };
  if (p.kind === 'add') return { min: f10(p.a), max: f10(p.a) + 20, step: 1, start: p.a };
  return { min: f10(p.a) - 10, max: f10(p.a) + 10, step: 1, start: p.a };
};

/* Perlihatkan jawaban di adegan: candi dibangun atau dipindah, dengan loncatan ke puluhan. */
const jumpStrip = (p) => {
  if (p.kind === 'add') return `${p.a} <i>+${p.s1}</i> <b>${p.T}</b> <i>+${p.s2}</i> <b>${p.ans}</b>`;
  if (p.kind === 'sub') return `${p.a} <i>−${p.s1}</i> <b>${p.T}</b> <i>−${p.s2}</i> <b>${p.ans}</b>`;
  if (p.kind === 'tens') { let s = `${p.a}`; for (let x = p.a + 10; x <= 100; x += 10) s += ` <i>+10</i> <b>${x}</b>`; return s; }
  return `${p.a} <i>+${p.ans}</i> <b>${p.T}</b>`;
};
const showJumps = async (p, who = 'kancil') => {
  setCount(p.a); await wait(350);
  if (p.kind === 'fill') {
    setEq(`${p.a} <i>+?</i> <b>${p.T}</b>`, 'jump');
    for (let i = 0; i < p.ans; i++) { await addOne(); await speak(who, `${i + 1}`); }
    setEq(jumpStrip(p), 'jump');
    await speak(who, `${p.ans} candi lagi, baris penuh jadi ${p.T}!`);
  } else if (p.kind === 'tens') {
    for (let x = p.a + 10; x <= 100; x += 10) { for (let i = 0; i < 10; i++) { addOne(); await wait(60); } await wait(250); setEq(jumpStrip({ ...p, a: p.a }).split(`<b>${x}</b>`)[0] + `<b>${x}</b>`, 'jump'); await speak(who, `${x}`); }
    await speak(who, `${(100 - p.a) / 10} baris lagi. Tiap baris sepuluh, jadi ${p.ans} candi.`);
  } else {
    const up = p.kind === 'add', sign = up ? '+' : '−';
    setEq(`${p.a} <i>${sign}${p.s1}</i> ?`, 'jump');
    for (let i = 0; i < p.s1; i++) { await (up ? addOne() : removeOne()); await wait(120); }
    setEq(`${p.a} <i>${sign}${p.s1}</i> <b>${p.T}</b>`, 'jump');
    await speak(who, up ? `Loncat ${p.s1} dulu, baris penuh: ${p.T}!` : `Mundur ${p.s1} dulu, pas ${p.T}.`);
    for (let i = 0; i < p.s2; i++) { await (up ? addOne() : removeOne()); await wait(120); }
    setEq(jumpStrip(p), 'jump');
    await speak(who, up ? `Lalu ${p.s2} lagi di baris baru: ${p.ans}.` : `Lalu mundur ${p.s2} lagi: ${p.ans}.`);
  }
};

/* ---------- Pembungkus kit (supaya tes otomatis bisa menjawab) ---------- */
let pending = null;
const ask = (o) => { pending = { type: 'ask', correct: o.correct ?? 0, n: o.options.length }; return KK.ask(o).finally(() => { pending = null; }); };
const line = (o, ans) => { pending = { type: 'line', ans }; return KK.line(o).finally(() => { pending = null; }); };
const numOpts = (ans, extra) => { const set = new Set([ans, ...extra.filter(x => x >= 0 && x !== ans)]); let d = 1; while (set.size < 3) { if (ans + d >= 0) set.add(ans + d); if (set.size < 3 && ans - d >= 0) set.add(ans - d); d++; } const arr = shuffle([...set].slice(0, 3)); return { options: arr.map(String), correct: arr.indexOf(ans), arr }; };

/* Mesin 1: tebak dulu, lalu cek */
const engGuess = async (p) => {
  setCount(p.a); setEq(p.kind === 'add' || p.kind === 'sub' ? p.eq + ' = ?' : p.eq);
  await speak('rara', question(p));
  await speak('kancil', 'Tebak dulu di garis bilangan, ya. Nanti kita cek bersama!');
  bubble.hidden = true;
  const g = await line(lineOpts(p), p.ans);
  await speak('kancil', `Tebakanmu ${g}. Ayo kita cek!`);
  await showJumps(p, 'bandung');
  const ok = g === p.ans;
  if (ok) { chime([523, 659, 784]); hop(actors.kancil, 0.4); await speak('rara', `Tebakanmu tepat, ${p.ans}! Kamu mengecek dengan teliti.`); }
  else await speak('rara', `Ternyata ${p.ans}, bukan ${g}. Bagus sekali kamu mengecek. Sekarang kita tahu pasti!`);
  if (p.kind === 'fill' || p.kind === 'tens') { hop(actors.jali, 0.25); await speak('jali', `How many more? ${p.ans <= 10 ? cap(W_EN[p.ans]) : p.ans} more!`); }
  return ok;
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Mesin 2: betulkan Kancil */
const wrongWhy = (p, x) => {
  if (x === p.wrong) {
    if (p.kind === 'fill') return `Bukan ${x}. ${x} itu candi yang sudah ada di baris ini. Lihat tempat yang masih kosong!`;
    if (p.kind === 'tens') return `${x} itu jumlah barisnya. Satu baris isinya sepuluh candi, jadi ${x} baris itu ${x * 10} candi.`;
    if (p.kind === 'add') return p.wrongType === 'glue' ? `Angkanya jangan ditempel. ${p.a} tambah ${p.b} hanya sedikit lebih banyak dari ${p.a}, tidak mungkin sampai ratusan!` : `${p.a % 10} tambah ${p.b} lewat dari sepuluh. Satu baris jadi penuh, jadi puluhannya naik ke ${p.T}, bukan tetap ${f10(p.a)}.`;
    return p.wrongType === 'swap' ? `Tidak boleh dibalik jadi ${p.b} kurang ${p.a % 10}. Candinya berkurang, jadi hasilnya harus di bawah ${p.T}.` : `${p.a % 10} candi tidak cukup untuk dipindah ${p.b}. Kita harus mundur ke baris sebelumnya, jadi puluhannya turun.`;
  }
  if (p.kind === 'fill' || p.kind === 'tens') return `Kalau ${x}, jadinya ${p.a + x}, bukan ${p.T}. Hitung tempat yang kosong.`;
  if (p.kind === 'add') return `Coba lihat: dari ${p.a} loncat ${p.s1} dulu ke ${p.T}, lalu ${p.s2} lagi. Bukan ${x}.`;
  return `Coba lihat: dari ${p.a} mundur ${p.s1} ke ${p.T}, lalu ${p.s2} lagi. Bukan ${x}.`;
};
const engFix = async (p) => {
  setCount(p.a); setEq(p.kind === 'add' || p.kind === 'sub' ? p.eq + ' = ?' : p.eq);
  await speak('rara', question(p));
  hop(actors.kancil, 0.3);
  setEq(`${p.eq} = <s>${p.wrong}</s>`, 'bad');
  if (p.kind === 'fill' || p.kind === 'tens') await speak('kancil', `Aku tahu! Kurang ${p.wrong}!`);
  else await speak('kancil', `Aku tahu! ${p.eq.replace('−', 'kurang').replace('+', 'tambah')}... ${p.wrong}!`);
  await speak('rara', 'Hmm, benarkah? Kamu gurunya. Mana jawaban yang benar?');
  bubble.hidden = true;
  const extra = p.kind === 'tens' ? [p.wrong, p.ans + 10] : p.kind === 'fill' ? [p.wrong, p.ans + 1] : [p.wrong, p.kind === 'add' ? p.ans + 10 : p.ans - 10];
  const o = numOpts(p.ans, extra);
  const r = await ask({ options: o.options, correct: o.correct, onWrong: async (i) => { await speak('rara', wrongWhy(p, o.arr[i])); } });
  chime([523, 659, 784]);
  await speak('kancil', `Oh, ${p.ans}! Ajari aku caranya, ya.`);
  await showJumps(p, 'kancil');
  await speak('kancil', 'Terima kasih, Guru kecil! Sekarang aku paham.');
  return r.firstTry;
};

/* Mesin 3: dua cara. Kancil menghitung satu-satu, Jali meloncat ke puluhan dulu. */
const engTwo = async (p) => {
  setCount(p.a); setEq(p.kind === 'add' || p.kind === 'sub' ? p.eq + ' = ?' : p.eq);
  await speak('rara', question(p));
  await speak('kancil', 'Aku hitung satu-satu, ya.');
  const up = p.kind !== 'sub'; const n = Math.min(p.b, p.kind === 'tens' ? 5 : 9);
  for (let i = 0; i < n; i++) { await (up ? addOne() : removeOne()); await speak('kancil', `${count}`); }
  if (p.kind === 'tens') await speak('kancil', 'Wah, lama sekali! Masih banyak.');
  else await speak('kancil', `${count}! Capek juga menghitung satu-satu.`);
  hop(actors.jali, 0.35); await speak('jali', p.kind === 'tens' ? 'Jump! Ten, ten, ten!' : 'Jump! Tens first!');
  await speak('rara', p.kind === 'tens' ? 'Jali meloncat satu baris sekaligus: sepuluh, sepuluh, sepuluh.' : p.kind === 'fill' ? 'Jali melihat barisnya: satu baris ada sepuluh tempat.' : `Jali meloncat ke ${p.T} dulu, lalu sisanya.`);
  await showJumps(p, 'rara');
  let o, why;
  if (p.kind === 'fill') {
    const has = p.a % 10; await speak('rara', `Di baris ini sudah ada ${has} candi. ${has} tambah berapa jadi sepuluh?`);
    o = numOpts(10 - has, [has, 10 - has + 1]); why = (x) => `${has} tambah ${x} jadi ${has + x}, bukan sepuluh. Hitung tempat kosongnya.`;
  } else if (p.kind === 'tens') {
    const rows = (100 - p.a) / 10; await speak('rara', 'Berapa baris yang diloncati Jali?');
    o = numOpts(rows, [p.ans, rows + 1]); why = (x) => x === p.ans ? `${p.ans} itu jumlah candinya. Jali meloncat per baris. Hitung angka kuning yang menyala.` : `Lihat angka kuning di ujung baris: dari ${p.a + 10} sampai 100.`;
  } else {
    const verb = p.kind === 'add' ? 'loncat' : 'mundur';
    await speak('rara', `Jali memecah ${p.b} jadi dua loncatan. Loncatan pertamanya berapa, supaya pas ${p.T}?`);
    o = numOpts(p.s1, [p.s2, p.b]); why = (x) => `Kalau ${verb} ${x} dulu, kita sampai ${p.kind === 'add' ? p.a + x : p.a - x}, bukan ${p.T}. Dari ${p.a} ke ${p.T} itu ${p.s1}.`;
  }
  bubble.hidden = true;
  const r = await ask({ options: o.options, correct: o.correct, onWrong: async (i) => { await speak('rara', why(o.arr[i])); } });
  chime([523, 659, 784]);
  await speak('rara', p.kind === 'tens' ? `Betul! ${(100 - p.a) / 10} baris, jadi ${p.ans} candi. Loncat per sepuluh jauh lebih cepat.` : p.kind === 'fill' ? `Betul! ${p.a % 10} dan ${p.ans} jadi sepuluh. Jadi kurang ${p.ans}.` : `Betul! Pas ke ${p.T} dulu, lalu ${p.s2} lagi. Jadi ${p.ans}. Lebih cepat daripada satu-satu!`);
  return r.firstTry;
};

/* ---------- Jeda balon ---------- */
const balloons = [];
const BCOL = [[0xe8574b, 'Red'], [0xf5b82e, 'Yellow'], [0x4e9a3c, 'Green'], [0x3a8fd6, 'Blue'], [0xe8742a, 'Orange'], [0x9a6ad6, 'Purple'], [0xf08fb0, 'Pink']];
let breakOn = false;
const balloonBreak = async () => {
  breakOn = true; setEq('');
  await speak('kancil', 'Istirahat dulu! Ada balon pesta lepas. Ketuk balonnya, ya!');
  bubble.hidden = true; let left = 10;
  await new Promise((done) => {
    for (let i = 0; i < 10; i++) setTimeout(() => {
      const [col, name] = pick(BCOL); const b = B.balloon(col); const w = portrait ? 2.6 : 4.5;
      b.position.set((Math.random() * 2 - 1) * w, 0.6, (Math.random() * 2 - 1) * 2.2); b.scale.setScalar(portrait ? 1.3 : 1.35);
      b.userData = { v: 0.9 + Math.random() * 0.4, ph: Math.random() * 6, x0: b.position.x, end: () => { const k = balloons.indexOf(b); if (k >= 0) balloons.splice(k, 1); const j = tappables.indexOf(b); if (j >= 0) tappables.splice(j, 1); world.remove(b); if (--left <= 0) done(); } };
      tap(b, () => { if (b.userData.pop) return; b.userData.pop = true; play('placement-c', 1.5); say(name + '!', 'en'); const s0 = b.scale.x; tween(0.16, (t) => b.scale.setScalar(s0 * (1 + t * 0.5))).then(b.userData.end); });
      world.add(b); balloons.push(b);
    }, FAST ? i * 20 : i * 1100);
  });
  breakOn = false;
  await speak('kancil', 'Seru! Yuk, lanjut menghitung candi.');
};

/* ---------- Alur bab ---------- */
let busy = true, started = false, qi = 0, engine = '', stageNow = 0, tensSeen = false, localStreak = 0, finishedFlag = false, breakDone = false, problem = null;
const ENG = [['tebak', engGuess], ['betulkan', engFix], ['duacara', engTwo]];
const stageIntro = [
  'Tahap satu: kita lengkapi barisnya sampai penuh, dan sampai seratus.',
  'Tahap dua: tambah candi sampai lewat satu baris.',
  'Tahap tiga: candi berkurang, dan berapa lagi sampai seratus.',
];
const run = async () => {
  busy = true;
  setCount(23); setEq('');
  await speak('bandung', 'Aku Bandung, tukang batu. Aku janji membangun seratus candi kecil sebelum ayam berkokok, untuk pesta desa!');
  await speak('rara', 'Aku Rara. Ayo bantu menghitung, apakah candinya sudah cukup?');
  hop(actors.jali, 0.3); await speak('jali', 'Look! Temple, temple, temple! One hundred temples tonight!');
  await speak('kancil', 'Aku belum pandai menghitung lewat puluhan. Kamu jadi guruku, ya! Lihat, tiap baris ada sepuluh candi.');
  stageNow = KK.load(BAB).stage;
  await speak('rara', stageIntro[stageNow]);
  for (;;) {
    const st = KK.load(BAB).stage; if (st !== stageNow) { stageNow = st; qi = 0; tensSeen = false; }
    const p = gen(st, qi, tensSeen); problem = p; if (p.kind === 'tens') tensSeen = true;
    const [name, fn] = ENG[qi % 3]; engine = name; qi++;
    const ok = await fn(p);
    bubble.hidden = true;
    const r = KK.record(BAB, ok, STAGES);
    localStreak = st === STAGES - 1 ? (ok ? localStreak + 1 : 0) : 0;
    if (r.finished || (st === STAGES - 1 && localStreak >= 3)) break;
    if (r.advanced) {
      chime([523, 659, 784, 1047]); confetti();
      await speak('bandung', 'Hebat! Hitunganmu membantuku membangun lebih cepat.');
      if (!breakDone) { breakDone = true; await balloonBreak(); }
      hop(actors.jali, 0.3); await speak('jali', r.stage === 1 ? 'What a night! Look at the stars!' : 'Many stars, many temples!');
      await speak('rara', stageIntro[r.stage]);
    } else if (!ok) await speak('kancil', 'Tidak apa-apa. Kita coba soal lain, ya.');
  }
  await finale();
};
const finale = async () => {
  finishedFlag = true; setCount(99); setEq('99 + 1 = 100');
  await speak('bandung', 'Sudah sembilan puluh sembilan candi. Tinggal satu lagi! Ketuk untuk membangun candi keseratus.');
  bubble.hidden = true;
  await ask({ options: [{ label: '100', small: 'bangun!' }], correct: 0, cols: 1 });
  await addOne(); chime([523, 659, 784, 1047, 1319]);
  await speak('kancil', 'Seratus! Sepuluh baris penuh, sepuluh kali sepuluh!');
  hop(actors.jali, 0.4); await speak('jali', 'One hundred temples! Good night, stars!');
  rooster.visible = true; rooster.scale.setScalar(0.01); await tween(0.5, (t) => rooster.scale.setScalar(1.6 * t + 0.01));
  rooster.rotation.y = portrait ? -Math.PI / 2 + 0.3 : -2.4;
  chime([392, 523, 659, 784, 659], 'square', 0.14); hop(rooster, 0.3);
  await speak('rara', 'Kukuruyuk! Ayam berkokok, pagi datang. Candinya selesai tepat waktu!');
  const s0 = scene.background.clone();
  await tween(2.0, (t) => { scene.background.copy(s0).lerp(DAWN, t); starPts.material.opacity = 0.95 * (1 - t); hemi.intensity = 1.35 + t * 0.6; actors.moonDisc.material.color.set(0xfff2c4).lerp(DAWN, t); seaMats.forEach(m => m.color.set(0x22355e).lerp(SEA_DAWN, t)); });
  guests.forEach(g => { g.visible = true; }); confetti(); confetti();
  await speak('bandung', 'Terima kasih, Guru kecil! Ayo semua, kita berpesta!');
  setEq('');
  KK.done(BAB, 'Seratus candi berdiri. Ayam berkokok, dan desa berpesta!');
};

/* ---------- Ketukan tokoh ---------- */
const LINES = {
  kancil: ['Tiap baris ada sepuluh candi. Asyik dihitung!', 'Aku sedang belajar. Kamu guruku!'],
  rara: ['Lihat angka kuning di ujung baris. Itu puluhannya.', 'Pestanya sesudah seratus candi berdiri.'],
  bandung: ['Satu baris, sepuluh candi. Sepuluh baris, seratus!', 'Batu-batunya kususun rapi.'],
  jali: ['Star! Look at the star!', 'Temple! What a night!', 'How many more? Let us count!'],
};
const onActor = async (who) => { if (busy) { hop(actors[who], 0.2); return; } busy = true; play('toggle'); hop(actors[who], 0.3); await speak(who, pick(LINES[who])); busy = false; };

const confetti = () => { const box = document.createElement('div'); box.className = 'confetti'; for (let i = 0; i < 28; i++) { const p = document.createElement('i'); p.style.left = rand(4, 96) + '%'; p.style.animationDelay = Math.random() * 0.4 + 's'; p.style.background = pick(['#E8742A', '#F5B82E', '#4E9A3C', '#5DBBD8', '#E8574B']); box.appendChild(p); } document.body.appendChild(box); setTimeout(() => box.remove(), 1900); };

/* ---------- Sentuhan ---------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, az: cam.azGoal, moved: false }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* abaikan */ } });
canvas.addEventListener('pointermove', (e) => { if (!down || portrait) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 18) down.moved = true; if (down.moved) cam.azGoal = Math.max(-0.4, Math.min(0.4, down.az - dx * 0.004)); });
canvas.addEventListener('pointercancel', () => { down = null; });
canvas.addEventListener('pointerup', (e) => {
  const d = down; down = null; if (!d || d.moved) return;
  ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(tappables.filter(o => o.parent), true); if (!hits.length) return;
  let o = hits[0].object; while (o && !o.userData.tap) o = o.parent; if (o) o.userData.tap();
});
$('#soundBtn').addEventListener('click', (e) => { D.sound = !D.sound; save(); e.currentTarget.setAttribute('aria-pressed', String(D.sound)); if (!D.sound) { seq++; try { speechSynthesis.cancel(); } catch (er) { /* abaikan */ } } });
$('#soundBtn').setAttribute('aria-pressed', String(D.sound));
const begin = () => { if (started) return; started = true; $('#intro').classList.add('gone'); try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* abaikan */ } run().catch(e => console.error(e)); };
$('#startBtn').addEventListener('click', begin);

/* ---------- Putaran ---------- */
const clock = new THREE.Clock();
const frame = () => {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt / tw.dur; const k = Math.min(1, tw.t); tw.fn(tw.ease(k)); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
  cam.az += (cam.azGoal - cam.az) * 0.12; placeCam();
  const K = actors.kancil, J = actors.jali;
  if (K) { K.userData.head.rotation.z = Math.sin(t * 1.3) * 0.05 + (K.userData.talk ? Math.sin(t * 14) * 0.05 : 0); K.userData.ears[0].rotation.x = 0.25 + Math.max(0, Math.sin(t * 0.9) - 0.9) * 4; }
  if (J) { J.userData.head.rotation.y = Math.sin(t * 0.8) * 0.2; J.userData.head.rotation.z = J.userData.talk ? Math.sin(t * 16) * 0.12 : 0; const f = J.userData.talk ? Math.abs(Math.sin(t * 12)) * 0.7 : Math.max(0, Math.sin(t * 0.6) - 0.93) * 8; J.userData.wings[0].rotation.x = -f; J.userData.wings[1].rotation.x = f; }
  for (const k of ['rara', 'bandung']) { const a = actors[k]; if (a) { a.userData.head.rotation.z = Math.sin(t * 1.1 + (k === 'rara' ? 0 : 2)) * 0.04; a.userData.head.rotation.x = a.userData.talk ? Math.sin(t * 13) * 0.05 : 0; } }
  for (let i = balloons.length - 1; i >= 0; i--) { const b = balloons[i]; if (b.userData.pop) continue; b.position.y += dt * b.userData.v * (FAST ? 40 : 1); b.position.x = b.userData.x0 + Math.sin(t * 1.3 + b.userData.ph) * 0.25; if (b.position.y > 7) b.userData.end(); }
  lanterns.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.4 + i) * 0.08; l.userData.glow.emissiveIntensity = 0.8 + Math.sin(t * 3 + i) * 0.12; });
  if (starPts) starPts.rotation.y = t * 0.004;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

(async () => {
  fit(); placeCam();
  const lim = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
  try { await lim(document.fonts.load('800 40px "Baloo 2"'), 1500); } catch (e) { /* abaikan */ }
  try { await buildWorld(); } catch (e) { $('#loading').textContent = 'Lapangan gagal dimuat: ' + (e && e.message || e); throw e; }
  fit();
  try { renderer.compile(scene, camera); } catch (e) { /* abaikan */ }
  $('#loading').remove(); $('#startBtn').disabled = false; busy = false;
  window.__game = {
    state: () => ({ stage: KK.load(BAB).stage, streak: KK.load(BAB).streak, done: KK.load(BAB).done, engine, qi, count, problem, pending: pending && { ...pending }, finished: finishedFlag, breakOn, doneCard: !!document.querySelector('.kk-done') }),
    answerCorrect: () => {
      if (!pending) return false;
      if (pending.type === 'ask') { const b = document.querySelectorAll('.kk-opt')[pending.correct]; if (b) b.click(); return !!b; }
      const r = document.querySelector('.kk-line input'); if (!r) return false; r.value = pending.ans; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); return true;
    },
    answerWrong: () => {
      if (!pending) return false;
      if (pending.type === 'ask') { const bs = [...document.querySelectorAll('.kk-opt')]; const i = bs.findIndex((b, k) => k !== pending.correct && !b.classList.contains('no')); if (i >= 0) bs[i].click(); return i >= 0; }
      const r = document.querySelector('.kk-line input'); r.value = +r.min; r.dispatchEvent(new Event('input')); document.querySelector('.kk-ok').click(); return true;
    },
    popAll: () => balloons.slice().forEach(b => b.userData.tap()),
    setCount, balloonBreak, actors, cam,
  };
  frame();
  if (QS.has('play')) begin();
})();
