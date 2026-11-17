/* Pembangun bentuk: pulau, lapak, gerobak tebu, karakter. Semua dari primitif, gaya mainan low-poly. */
import * as THREE from 'three';

export const PAL = {
  grass: 0x9ccb6b, grassDark: 0x7fb85a, soil: 0xb9824f, soilDark: 0x9a6534, paving: 0xf3e2b8, pavingLine: 0xe6cf9a,
  wood: 0xc8985a, woodDark: 0x9a6534, orange: 0xe8742a, cream: 0xfff3d1, red: 0xe8574b, leaf: 0x4e9a3c, leafLight: 0x6db34f,
  kancil: 0xb8733a, kancilDark: 0x8a5428, kancilLight: 0xf3ddb8, ink: 0x3b2614, pink: 0xf09a6b,
  jali: 0xfbfbf7, jaliBlue: 0x2f8fd0, jaliBeak: 0xf2b33a, jaliTip: 0x2b2f3a, skin: 0xf0c39a, hijab: 0xf2a33a, sea: 0x5dbbd8, yellow: 0xffd166,
};
const mats = new Map();
export const mat = (color, opts = {}) => {
  const k = color + JSON.stringify(opts);
  if (!mats.has(k)) mats.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts }));
  return mats.get(k);
};
const sh = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
export const sphere = (r, color, s = [1, 1, 1], p = [0, 0, 0]) => { const m = sh(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), mat(color))); m.scale.set(...s); m.position.set(...p); return m; };
export const box = (w, h, d, color, p = [0, 0, 0]) => { const m = sh(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color))); m.position.set(...p); return m; };
export const cyl = (rt, rb, h, color, p = [0, 0, 0], seg = 20) => { const m = sh(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color))); m.position.set(...p); return m; };
export const cone = (r, h, color, p = [0, 0, 0]) => { const m = sh(new THREE.Mesh(new THREE.ConeGeometry(r, h, 16), mat(color))); m.position.set(...p); return m; };

const roundedRect = (w, d, r) => {
  const s = new THREE.Shape(); const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
};
const slab = (w, d, r, h, color, y) => {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, d, r), { depth: h, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3, curveSegments: 12 });
  g.rotateX(-Math.PI / 2); const m = sh(new THREE.Mesh(g, mat(color))); m.position.y = y; return m;
};

export const island = () => {
  const g = new THREE.Group();
  g.add(slab(17, 12, 2.2, 0.9, PAL.soil, -1.35));
  g.add(slab(17.3, 12.3, 2.3, 0.35, PAL.grass, -0.45));
  const plaza = slab(13.2, 6.6, 1.2, 0.08, PAL.paving, -0.1); plaza.position.z = 1.6; g.add(plaza);
  /* garis ubin */
  for (let i = -5; i <= 5; i++) { const l = box(0.04, 0.012, 6.2, PAL.pavingLine, [i * 1.15, 0.065, 1.6]); l.castShadow = false; g.add(l); }
  for (let j = -2; j <= 2; j++) { const l = box(12.6, 0.012, 0.04, PAL.pavingLine, [0, 0.065, 1.6 + j * 1.15]); l.castShadow = false; g.add(l); }
  return g;
};

const stripeTex = (c1, c2, text) => {
  const c = document.createElement('canvas'); c.width = text ? 1024 : 512; c.height = 128; const x = c.getContext('2d');
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? c1 : c2; x.fillRect(i * 64, 0, 64, 128); }
  if (text) { x.fillStyle = c2; x.fillRect(0, 0, 1024, 128); x.fillStyle = c1; x.fillRect(0, 0, 1024, 10); x.fillRect(0, 118, 1024, 10); x.font = '800 84px "Baloo 2", Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 512, 70); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

export const stall = (c1, c2, label) => {
  const g = new THREE.Group(); const W = 3.3, D = 1.15, H = 0.82;
  g.add(box(W + 0.1, 0.1, D + 0.1, PAL.cream, [0, H, 0]));
  g.add(box(W - 0.06, H - 0.08, 0.08, PAL.cream, [0, (H - 0.08) / 2, D / 2 - 0.04]));
  g.add(box(W - 0.04, 0.16, 0.1, new THREE.Color(c1).getHex(), [0, 0.1, D / 2 - 0.04]));
  for (let i = 0; i < 9; i++) { const sc = cyl(0.19, 0.19, 0.03, PAL.cream, [-W / 2 + 0.2 + i * (W - 0.4) / 8, H - 0.04, D / 2 + 0.065], 14); sc.rotation.x = Math.PI / 2; sc.scale.y = 1; g.add(sc); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(cyl(0.06, 0.06, sz < 0 ? 2.75 : 2.35, PAL.woodDark, [sx * (W / 2 - 0.08), (sz < 0 ? 2.75 : 2.35) / 2, sz * (D / 2 - 0.08)], 10));
  const roof = sh(new THREE.Mesh(new THREE.BoxGeometry(W + 0.5, 0.08, D + 0.75), new THREE.MeshStandardMaterial({ map: stripeTex(c1, c2), roughness: 0.9 })));
  roof.position.set(0, 2.6, 0.12); roof.rotation.x = 0.33; g.add(roof); g.userData.roof = roof;
  const val = sh(new THREE.Mesh(new THREE.BoxGeometry(W + 0.5, 0.36, 0.05), new THREE.MeshStandardMaterial({ map: stripeTex(c1, c2, label), roughness: 0.9 })));
  val.position.set(0, 2.27, D / 2 + 0.5); val.scale.y = 1.25; g.add(val);
  return g;
};

export const tree = (s = 1) => {
  const g = new THREE.Group();
  g.add(cyl(0.12, 0.16, 1.1, PAL.woodDark, [0, 0.55, 0], 10));
  g.add(sphere(0.75, PAL.leaf, [1, 0.95, 1], [0, 1.6, 0]));
  g.add(sphere(0.5, PAL.leafLight, [1, 1, 1], [-0.5, 1.3, 0.25]));
  g.add(sphere(0.5, PAL.leafLight, [1, 1, 1], [0.5, 1.35, 0.2]));
  g.add(sphere(0.42, PAL.leaf, [1, 1, 1], [0.1, 2.15, 0.1]));
  g.scale.setScalar(s); return g;
};
export const cloud = () => {
  const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (const [x, y, r] of [[0, 0, 0.8], [0.9, -0.1, 0.6], [-0.9, -0.15, 0.55], [0.35, 0.4, 0.55]]) { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); s.position.set(x, y, 0); s.scale.set(1.2, 0.8, 0.6); g.add(s); }
  return g;
};

/* Tebu: batang hijau beruas dengan daun */
export const tebuStick = (h = 1.5) => {
  const g = new THREE.Group();
  g.add(cyl(0.045, 0.05, h, 0xb7cf52, [0, h / 2, 0], 8));
  for (let i = 1; i < 4; i++) g.add(cyl(0.054, 0.054, 0.02, 0x7e9a2e, [0, (h * i) / 4, 0], 8));
  for (const a of [0, 2.1, 4.2]) { const l = cone(0.05, 0.42, PAL.leaf, [Math.cos(a) * 0.08, h + 0.12, Math.sin(a) * 0.08]); l.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); g.add(l); }
  return g;
};
const signTex = (text, bg, fg) => {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160; const x = c.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 512, 160); x.fillStyle = fg; x.font = '800 84px "Baloo 2", Nunito, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 88);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};
export const tebuCart = () => {
  const g = new THREE.Group();
  g.add(box(1.7, 0.7, 1.0, PAL.orange, [0, 0.85, 0]));
  g.add(box(1.8, 0.1, 1.1, PAL.woodDark, [0, 1.24, 0]));
  g.add(box(1.5, 0.3, 0.02, PAL.cream, [0, 0.9, 0.515]));
  const sign = sh(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 0.04), new THREE.MeshStandardMaterial({ map: signTex('ES TEBU', '#fff3d1', '#c25a18'), roughness: 0.9 })));
  sign.position.set(0, 0.86, 0.53); g.add(sign);
  for (const sx of [-1, 1]) { const w = cyl(0.36, 0.36, 0.1, PAL.woodDark, [sx * 0.62, 0.36, 0.58], 20); w.rotation.x = Math.PI / 2; g.add(w); const hub = cyl(0.1, 0.1, 0.12, PAL.cream, [sx * 0.62, 0.36, 0.6], 12); hub.rotation.x = Math.PI / 2; g.add(hub); }
  for (const sx of [-1, 1]) g.add(cyl(0.04, 0.04, 1.5, PAL.woodDark, [sx * 0.8, 1.95, -0.42], 8));
  const roof = sh(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.07, 1.5), new THREE.MeshStandardMaterial({ map: stripeTex('#4e9a3c', '#fff3d1'), roughness: 0.9 })));
  roof.position.set(0, 2.7, 0); roof.rotation.x = 0.22; g.add(roof);
  for (let i = 0; i < 7; i++) { const t = tebuStick(1.25 + (i % 3) * 0.12); t.position.set(-0.62 + i * 0.13, 1.28, -0.25 + (i % 2) * 0.1); t.rotation.z = (i - 3) * 0.035; g.add(t); }
  g.add(cyl(0.16, 0.14, 0.34, 0xdff2f9, [0.5, 1.46, 0.2], 14)); g.add(cyl(0.13, 0.12, 0.2, 0xc9e27a, [0.5, 1.42, 0.2], 14));
  g.add(cyl(0.03, 0.03, 0.9, PAL.woodDark, [1.05, 1.0, 0.3], 8));
  return g;
};

export const bunting = (a, b, n = 9) => {
  const g = new THREE.Group(); const cols = [PAL.red, PAL.yellow, PAL.sea, PAL.leafLight, PAL.orange];
  const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; const p = new THREE.Vector3().lerpVectors(a, b, t); p.y -= Math.sin(t * Math.PI) * 0.45; pts.push(p); }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.015, 5), mat(PAL.ink)));
  const shape = new THREE.Shape(); shape.moveTo(-0.13, 0); shape.lineTo(0.13, 0); shape.lineTo(0, -0.3); shape.closePath();
  for (let i = 1; i < n; i++) { const t = i / n; const p = new THREE.Vector3().lerpVectors(a, b, t); p.y -= Math.sin(t * Math.PI) * 0.45; const f = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide, roughness: 0.9 })); f.position.copy(p); f.castShadow = true; f.userData.sway = i; f.lookAt(p.x, p.y, p.z + 1); g.add(f); }
  return g;
};
export const lantern = () => {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0xf6de9a, emissive: 0x000000, roughness: 0.6 });
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), m); b.scale.set(1, 1.15, 1); g.add(b);
  g.add(cyl(0.07, 0.07, 0.05, PAL.red, [0, 0.19, 0], 10)); g.add(cyl(0.07, 0.07, 0.05, PAL.red, [0, -0.19, 0], 10));
  g.userData.glow = m; return g;
};

/* ---------- Karakter ---------- */
const eye = (r, p) => { const g = new THREE.Group(); const e = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), new THREE.MeshBasicMaterial({ color: PAL.ink })); g.add(e); const h = new THREE.Mesh(new THREE.SphereGeometry(r * 0.38, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); h.position.set(r * 0.35, r * 0.4, r * 0.7); g.add(h); g.position.set(...p); return g; };

export const kancil = () => {
  /* Kancil: badan bulat mungil, kepala besar, telinga pendek membulat, mata besar. Menghadap +x. */
  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  body.add(sphere(0.33, PAL.kancil, [1.12, 0.95, 0.95], [0, 0.5, 0]));
  body.add(sphere(0.3, PAL.kancilLight, [0.95, 0.62, 0.8], [0.06, 0.4, 0]));
  for (const [x, z] of [[0.2, 0.15], [0.2, -0.15], [-0.22, 0.15], [-0.22, -0.15]]) { body.add(cyl(0.05, 0.04, 0.3, PAL.kancilDark, [x, 0.16, z], 10)); body.add(cyl(0.048, 0.052, 0.06, PAL.ink, [x, 0.03, z], 10)); }
  body.add(sphere(0.075, 0xffffff, [1, 1, 1], [-0.38, 0.6, 0]));
  const head = new THREE.Group(); head.position.set(0.3, 1.0, 0); body.add(head);
  head.add(sphere(0.36, PAL.kancil, [1.0, 0.95, 1.05]));
  head.add(sphere(0.17, PAL.kancilLight, [1.25, 0.72, 0.9], [0.24, -0.13, 0]));
  head.add(sphere(0.05, PAL.ink, [1, 0.8, 1.2], [0.45, -0.08, 0]));
  head.add(eye(0.082, [0.27, 0.07, 0.2])); head.add(eye(0.082, [0.27, 0.07, -0.2]));
  for (const s of [1, -1]) { const c = sphere(0.065, PAL.pink, [0.5, 0.7, 1], [0.24, -0.1, 0.27 * s]); c.castShadow = false; head.add(c); }
  body.add(sphere(0.2, 0xffffff, [0.5, 0.9, 0.9], [0.27, 0.56, 0]));
  const ears = [];
  for (const s of [1, -1]) { const e = new THREE.Group(); e.position.set(-0.08, 0.27, 0.23 * s); e.add(sphere(0.12, PAL.kancil, [0.5, 1.75, 0.8], [0, 0.14, 0])); e.add(sphere(0.085, 0xe9a97a, [0.38, 1.6, 0.62], [0.045, 0.14, 0])); e.rotation.set(0.5 * s, 0, 0.15); head.add(e); ears.push(e); }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.013, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: PAL.ink })); mouth.position.set(0.4, -0.18, 0); mouth.rotation.set(0, Math.PI / 2, Math.PI); head.add(mouth);
  g.userData = { head, ears, body }; return g;
};

/* Jali: jalak bali, putih dengan topeng biru */
export const jali = () => {
  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  body.add(sphere(0.28, PAL.jali, [1.05, 1.1, 0.92], [0, 0.36, 0]));
  const tail = sphere(0.14, PAL.jali, [1.7, 0.35, 0.8], [-0.34, 0.24, 0]); tail.rotation.z = 0.5; body.add(tail);
  const tip = sphere(0.09, PAL.jaliTip, [1.3, 0.35, 0.85], [-0.5, 0.14, 0]); tip.rotation.z = 0.5; body.add(tip);
  const wings = [];
  for (const s of [1, -1]) { const w = new THREE.Group(); w.position.set(0, 0.46, 0.25 * s); w.add(sphere(0.2, PAL.jali, [1.05, 0.72, 0.22], [-0.08, -0.08, 0])); w.add(sphere(0.09, PAL.jaliTip, [1.2, 0.6, 0.24], [-0.26, -0.15, 0])); body.add(w); wings.push(w); }
  const head = new THREE.Group(); head.position.set(0.1, 0.74, 0); body.add(head);
  head.add(sphere(0.21, PAL.jali));
  for (let i = 0; i < 3; i++) { const c = sphere(0.06, PAL.jali, [2.4, 0.5, 0.55], [-0.16 - i * 0.03, 0.14 - i * 0.07, 0]); c.rotation.z = -0.5 + i * 0.25; head.add(c); }
  for (const s of [1, -1]) { const m = sphere(0.075, PAL.jaliBlue, [1.25, 0.95, 0.35], [0.09, 0.03, 0.17 * s]); m.castShadow = false; head.add(m); head.add(eye(0.04, [0.11, 0.04, 0.2 * s])); }
  const beak = cone(0.065, 0.22, PAL.jaliBeak, [0.28, -0.02, 0]); beak.rotation.z = -Math.PI / 2; head.add(beak);
  for (const s of [1, -1]) { body.add(cyl(0.018, 0.018, 0.16, 0x7d8aa3, [0.02, 0.06, 0.09 * s], 6)); body.add(sphere(0.04, 0x7d8aa3, [1.6, 0.4, 1], [0.05, 0.0, 0.09 * s])); }
  g.userData = { head, wings, body }; return g;
};

/* Bu Sari: penjual es tebu, menghadap +z */
export const warga = (o = {}) => {
  const kind = o.kind || 'hijab', dress = o.dress ?? PAL.red, hc = o.head ?? PAL.hijab;
  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  body.add(cyl(0.2, 0.36, 0.86, dress, [0, 0.43, 0], 20));
  body.add(cyl(0.365, 0.365, 0.06, PAL.cream, [0, 0.06, 0], 20));
  body.add(cyl(0.16, 0.3, 0.34, kind === 'kakek' ? dress : hc, [0, 0.86, 0], 20));
  const head = new THREE.Group(); head.position.set(0, 1.16, 0); body.add(head);
  if (kind === 'hijab') head.add(sphere(0.285, hc, [1, 1.04, 1], [0, 0.02, -0.045]));
  if (kind === 'nenek') { head.add(sphere(0.27, 0xe9e6df, [1, 1, 1], [0, 0.04, -0.06])); head.add(sphere(0.13, 0xe9e6df, [1, 1, 1], [0, 0.27, -0.14])); }
  if (kind === 'kakek') { head.add(cyl(0.2, 0.215, 0.17, 0x2b2f3a, [0, 0.24, -0.01], 20)); head.add(sphere(0.24, 0xe9e6df, [1, 0.8, 1], [0, 0.02, -0.06])); for (const sd of [1, -1]) { const m = sphere(0.06, 0xf4f1ea, [1.5, 0.55, 0.6], [0.06 * sd, -0.085, 0.262]); m.castShadow = false; head.add(m); } }
  head.add(sphere(0.235, PAL.skin, [1, 1, 0.9], [0, -0.01, 0.06]));
  head.add(eye(0.032, [0.085, 0.02, 0.265])); head.add(eye(0.032, [-0.085, 0.02, 0.265]));
  if (o.glasses) { const gm = new THREE.MeshBasicMaterial({ color: PAL.ink }); for (const sd of [1, -1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.011, 6, 18), gm); r.position.set(0.085 * sd, 0.02, 0.285); head.add(r); } const br = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.012), gm); br.position.set(0, 0.03, 0.29); head.add(br); }
  for (const s of [1, -1]) { const c = sphere(0.045, PAL.pink, [1, 0.7, 0.3], [0.14 * s, -0.06, 0.235]); c.castShadow = false; head.add(c); }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: PAL.ink })); mouth.position.set(0, kind === 'kakek' ? -0.1 : -0.07, 0.268); mouth.rotation.z = Math.PI; head.add(mouth);
  const armL = cyl(0.06, 0.055, 0.42, dress, [-0.3, 0.68, 0.05], 10); armL.rotation.z = -0.35; body.add(armL); body.add(sphere(0.065, PAL.skin, [1, 1, 1], [-0.38, 0.47, 0.06]));
  const armR = cyl(0.06, 0.055, 0.42, dress, [0.31, 0.68, 0.1], 10); armR.rotation.set(-0.5, 0, 0.4); body.add(armR); body.add(sphere(0.065, PAL.skin, [1, 1, 1], [0.4, 0.52, 0.22]));
  const basket = new THREE.Group(); basket.position.set(0.47, 0.3, 0.3);
  const bm = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.2, 0.24, 18, 1, true), new THREE.MeshStandardMaterial({ color: PAL.wood, side: THREE.DoubleSide, roughness: 0.9 })); bm.castShadow = true; basket.add(bm);
  basket.add(cyl(0.2, 0.2, 0.03, PAL.woodDark, [0, -0.11, 0], 18));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.022, 6, 18, Math.PI), mat(PAL.woodDark)); handle.position.y = 0.1; handle.rotation.y = Math.PI / 2; basket.add(handle);
  body.add(basket);
  g.userData = { head, body, basket }; return g;
};
export const buSari = () => warga();
export const balloon = (color) => { const g = new THREE.Group(); const b = sphere(0.36, color, [1, 1.18, 1], [0, 0, 0]); b.material = new THREE.MeshStandardMaterial({ color, roughness: 0.35 }); g.add(b); g.add(cone ? cyl(0.05, 0.02, 0.08, color, [0, -0.45, 0], 8) : new THREE.Group()); g.add(cyl(0.006, 0.006, 0.7, 0xffffff, [0, -0.84, 0], 4)); return g; };

export const sea = () => {
  const g = new THREE.Group();
  const w = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshBasicMaterial({ color: 0xa6dcea })); w.rotation.x = -Math.PI / 2; w.position.y = -1.3; g.add(w);
  const ring = (grow, color, y) => { const sh2 = new THREE.Shape(); const W = 17.3 + grow, D = 12.3 + grow, r = 2.3 + grow / 2, x = -W / 2, z = -D / 2; sh2.moveTo(x + r, z); sh2.lineTo(x + W - r, z); sh2.quadraticCurveTo(x + W, z, x + W, z + r); sh2.lineTo(x + W, z + D - r); sh2.quadraticCurveTo(x + W, z + D, x + W - r, z + D); sh2.lineTo(x + r, z + D); sh2.quadraticCurveTo(x, z + D, x, z + D - r); sh2.lineTo(x, z + r); sh2.quadraticCurveTo(x, z, x + r, z); const m = new THREE.Mesh(new THREE.ShapeGeometry(sh2, 16), new THREE.MeshBasicMaterial({ color })); m.rotation.x = -Math.PI / 2; m.position.y = y; return m; };
  g.add(ring(3.2, 0xb6e3ef, -1.29)); g.add(ring(1.3, 0xcdeef5, -1.28));
  return g;
};

/* Atap genteng limas untuk ruko */
export const tileRoof = (w, d, h = 0.9) => {
  const g = new THREE.Group();
  const m = sh(new THREE.Mesh(new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1), mat(0xc8573a))); m.rotation.y = Math.PI / 4; m.scale.set(w + 0.5, h, d + 0.5); m.position.y = h / 2; g.add(m);
  const eave = box(w + 0.42, 0.1, d + 0.42, 0xa9432b, [0, 0.0, 0]); g.add(eave);
  return g;
};
export const palm = (s = 1) => {
  const g = new THREE.Group(); let x = 0, y = 0; const segs = 7;
  for (let i = 0; i < segs; i++) { const lean = 0.07 * i; const c = cyl(0.11 - i * 0.008, 0.13 - i * 0.008, 0.5, i % 2 ? 0xa97a3e : 0x9a6534, [x, y + 0.25, 0], 10); c.rotation.z = -lean; g.add(c); x += Math.sin(lean) * 0.48; y += Math.cos(lean) * 0.48; }
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const f = new THREE.Group(); f.position.set(x, y, 0); f.rotation.y = a; const leaf = sphere(0.5, i % 2 ? PAL.leaf : PAL.leafLight, [1.9, 0.09, 0.42], [0.85, -0.18, 0]); leaf.rotation.z = -0.38; f.add(leaf); g.add(f); }
  for (const [dx, dz] of [[0.12, 0.08], [-0.1, 0.1], [0.02, -0.13]]) g.add(sphere(0.11, 0x8a5428, [1, 1, 1], [x + dx, y - 0.16, dz]));
  g.scale.setScalar(s); return g;
};
export const arrow = () => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: 0xff2e7a }); const c = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 4), m); c.rotation.x = Math.PI; g.add(c); const st = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.24, 0.13), m); st.position.y = 0.25; g.add(st); const wm = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide }); const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.4, 4), wm); c2.rotation.x = Math.PI; c2.position.y = -0.02; g.add(c2); const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), wm); s2.position.y = 0.25; g.add(s2); g.scale.setScalar(1.7); return g; };

/* ---------- Bab 08: lintasan lomba ---------- */
export const field = (w = 21, d = 8) => {
  const g = new THREE.Group();
  g.add(slab(w, d, 1.6, 0.9, PAL.soil, -1.35));
  g.add(slab(w + 0.3, d + 0.3, 1.7, 0.35, PAL.grass, -0.45));
  return g;
};
/* Teks di kanvas menjadi sprite yang selalu menghadap kamera */
export const textSprite = (text, { fg = '#3b2614', bg = '#fffaf0', border = '#3b2614', size = 0.5, w = 1 } = {}) => {
  const c = document.createElement('canvas'); c.width = 128 * w; c.height = 128; const x = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(size * w, size, 1); sp.renderOrder = 5;
  sp.userData.set = (t, o2 = {}) => {
    const f = o2.fg || fg, b = o2.bg || bg, bo = o2.border || border; x.clearRect(0, 0, c.width, 128);
    const r = 40, W = c.width - 12; x.beginPath(); x.roundRect(6, 10, W, 108, r); x.fillStyle = b; x.fill(); x.lineWidth = 9; x.strokeStyle = bo; x.stroke();
    x.fillStyle = f; x.font = `800 ${String(t).length > 3 ? 60 : 76}px "Baloo 2", Nunito, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(t), c.width / 2, 70); tex.needsUpdate = true; sp.userData.text = t;
  };
  sp.userData.set(text); return sp;
};
/* Siput: kaki panjang, cangkang spiral sederhana, mata bertangkai. Menghadap +x. */
export const siput = () => {
  const g = new THREE.Group(); const body = new THREE.Group(); g.add(body);
  const skin = 0xd6e07e, skinDark = 0xb7c45c;
  body.add(sphere(0.3, skin, [1.75, 0.36, 0.72], [0.02, 0.1, 0]));
  const head = new THREE.Group(); head.position.set(0.44, 0.28, 0); body.add(head);
  head.add(sphere(0.17, skin, [1, 1.15, 1]));
  for (const s of [1, -1]) {
    const st = cyl(0.024, 0.03, 0.3, skinDark, [0.03, 0.3, 0.07 * s], 8); st.rotation.set(0.25 * s, 0, -0.2); head.add(st);
    head.add(sphere(0.075, 0xffffff, [1, 1, 1], [0.07, 0.46, 0.11 * s]));
    head.add(eye(0.04, [0.12, 0.47, 0.12 * s]));
    const ch = sphere(0.04, PAL.pink, [0.6, 0.6, 0.6], [0.12, -0.03, 0.12 * s]); ch.castShadow = false; head.add(ch);
  }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: PAL.ink })); mouth.position.set(0.16, -0.05, 0); mouth.rotation.set(0, Math.PI / 2, Math.PI); head.add(mouth);
  const shell = new THREE.Group(); shell.position.set(-0.12, 0.43, 0); body.add(shell);
  shell.add(sphere(0.31, 0xe9a24a, [1, 1, 0.7]));
  for (const s of [1, -1]) {
    const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 4.2, r = 0.27 * (1 - t * 0.9); pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, s * (0.2 + 0.02 * t))); }
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.022, 5), mat(0xa85a24)); shell.add(tube);
  }
  g.userData = { head, body, shell }; return g;
};
export const finishLine = (z0, z1) => {
  const g = new THREE.Group();
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
  for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? '#3b2614' : '#ffffff'; x.fillRect(i * 16, j * 16, 16, 16); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(z1 - z0, 0.22), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 })); strip.rotation.set(-Math.PI / 2, 0, Math.PI / 2); strip.position.set(0, 0.075, (z0 + z1) / 2); strip.receiveShadow = true; g.add(strip);
  for (const z of [z0 - 0.15, z1 + 0.15]) { g.add(cyl(0.05, 0.06, 2.0, PAL.cream, [0, 1.0, z], 10)); g.add(sphere(0.08, PAL.red, [1, 1, 1], [0, 2.02, z])); }
  const ban = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.38, z1 - z0 + 0.3), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 })); ban.position.set(0, 1.75, (z0 + z1) / 2); ban.castShadow = true; g.add(ban);
  const flags = [];
  for (const z of [z0 - 0.15, z1 + 0.15]) { const sh2 = new THREE.Shape(); sh2.moveTo(0, 0); sh2.lineTo(0.42, -0.12); sh2.lineTo(0, -0.26); sh2.closePath(); const f = new THREE.Mesh(new THREE.ShapeGeometry(sh2), new THREE.MeshStandardMaterial({ color: PAL.red, side: THREE.DoubleSide, roughness: 0.9 })); f.position.set(0, 2.0, z); g.add(f); flags.push(f); }
  g.userData.flags = flags; return g;
};
export const cup = (color = 0xdff2f9) => { const g = new THREE.Group(); g.add(cyl(0.09, 0.07, 0.2, color, [0, 0.1, 0], 14)); g.add(cyl(0.075, 0.065, 0.12, 0xc9e27a, [0, 0.09, 0], 14)); g.add(cyl(0.01, 0.01, 0.22, PAL.red, [0.03, 0.25, 0], 6)); return g; };
