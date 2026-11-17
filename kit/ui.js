/* Kit bersama bab cerita Kota Kancil. Global: KK. Tidak ada ketergantungan lain. */
window.KK = (() => {
  const KEY = 'kota-kancil-cerita-v1';
  const all = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const load = (bab) => Object.assign({ stage: 0, streak: 0, done: false }, all()[bab] || {});
  const save = (bab, obj) => { try { const a = all(); a[bab] = obj; localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* abaikan */ } };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  let sheet = null;
  const clear = () => { if (sheet) { sheet.remove(); sheet = null; } };
  /* Pilihan jawaban. options: string atau {label, img, small}. correct: indeks benar, atau null bila semua jawaban sah (soal terbuka).
     onWrong(i): async, dipanggil saat salah (ucapkan petunjuk MENGAPA di sini). Hasil: {index, firstTry}. */
  const ask = ({ options, correct = null, onWrong = null, cols = null }) => new Promise((res) => {
    clear(); sheet = el('div', 'kk-sheet'); const grid = el('div', 'kk-opts'); grid.style.gridTemplateColumns = `repeat(${cols || Math.min(options.length, 3)}, 1fr)`;
    let first = true, lock = false;
    options.forEach((o, i) => {
      const b = el('button', 'kk-opt'); const ob = typeof o === 'object' ? o : { label: String(o) };
      b.innerHTML = (ob.img ? `<img src="${ob.img}" alt="">` : '') + (ob.label != null ? `<span>${ob.label}</span>` : '') + (ob.small ? `<small>${ob.small}</small>` : '');
      b.addEventListener('click', async () => {
        if (lock) return;
        if (correct == null || i === correct) { lock = true; b.classList.add('yes'); setTimeout(() => { clear(); res({ index: i, firstTry: first }); }, 450); return; }
        first = false; lock = true; b.classList.add('no'); if (onWrong) { try { await onWrong(i); } catch (e) { /* abaikan */ } } lock = false;
      });
      grid.appendChild(b);
    });
    sheet.appendChild(grid); document.body.appendChild(sheet);
  });
  /* Garis bilangan untuk menebak. Hasil: angka yang dipilih. */
  const line = ({ min = 0, max = 20, step = 1, start = null }) => new Promise((res) => {
    clear(); sheet = el('div', 'kk-sheet'); const box = el('div', 'kk-line');
    const out = el('output', '', String(start ?? min)); const minus = el('button', 'kk-step', '−'); const plus = el('button', 'kk-step', '+');
    const r = el('input'); r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = start ?? min;
    const ticks = el('div', 'kk-ticks', `<span>${min}</span><span>${Math.round((min + max) / 2)}</span><span>${max}</span>`);
    const ok = el('button', 'kk-ok', 'Ini tebakanku');
    const set = (v) => { r.value = Math.max(min, Math.min(max, v)); out.textContent = r.value; };
    r.addEventListener('input', () => { out.textContent = r.value; }); minus.addEventListener('click', () => set(+r.value - step)); plus.addEventListener('click', () => set(+r.value + step));
    ok.addEventListener('click', () => { const v = +r.value; clear(); res(v); });
    box.append(out, minus, r, plus, ticks, ok); sheet.appendChild(box); document.body.appendChild(sheet);
  });
  /* Catat hasil satu soal. Naik tahap setelah 3 benar berturut-turut. Hasil: {advanced, stage, finished}. */
  const record = (bab, firstTry, stages) => {
    const s = load(bab); s.streak = firstTry ? s.streak + 1 : 0; let advanced = false, finished = false;
    if (s.streak >= 3) { s.streak = 0; if (s.stage < stages - 1) { s.stage++; advanced = true; } else { finished = !s.done; s.done = true; } }
    save(bab, s); return { advanced, stage: s.stage, finished };
  };
  /* Kartu akhir bab. */
  const done = (bab, title, total = 10) => {
    const s = load(bab); s.done = true; save(bab, s);
    const d = el('div', 'kk-done'); const next = bab < total ? `../bab${String(bab + 1).padStart(2, '0')}/` : '../cerita/';
    d.innerHTML = `<div><h2>Kasus selesai!</h2><p>${title}</p><a class="go" href="${next}">${bab < total ? 'Kasus berikutnya' : 'Ke peta cerita'}</a><a href="../cerita/">Peta cerita</a><button>Main lagi</button></div>`;
    d.querySelector('button').addEventListener('click', () => d.remove()); document.body.appendChild(d);
  };
  return { ask, line, clear, load, save, record, done, all };
})();
