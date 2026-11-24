#!/usr/bin/env python3
"""Menyusun soal.js dan KISI.md dari _soal_<mapel>.py (masing-masing berisi PAKET = [paket1, paket2, paket3]).
Memeriksa: tiap paket memuat tepat jumlah butir per indikator dan bentuk seperti kisi-kisi, setiap soal punya kode kisi yang sah, semua indikator kisi-kisi tercakup
di gabungan 3 paket, tidak ada soal kembar, semua gambar/suara ada, kunci jawaban sah.
Jalankan: python3 latihan-kelas-1/_buat_soal.py"""
import importlib, json, os, sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _kisi import KISI

MAPEL = [
    ('alislam', 'Al-Islam', 'Huruf hijaiah, Al-Fatihah, Rukun Iman, basmalah dan hamdalah, Rukun Islam, syahadat, nabi dan mukjizat', False),
    ('pancasila', 'Pendidikan Pancasila', 'Patuh aturan, identitas diri, sikap baik kepada teman, lambang negara dan lagu kebangsaan', False),
    ('bindo', 'Bahasa Indonesia', 'Sumber bunyi, tanda baca, suku kata, kuman dan kebersihan, makanan sehat, gerakan', False),
    ('matematika', 'Matematika', 'Membilang dan membandingkan, penjumlahan dan pengurangan sampai 10, mengenal bentuk', False),
    ('pjok', 'PJOK', 'Bertumpu, bergantung, keseimbangan, gerak berirama, sikap tubuh, keselamatan di kolam renang', False),
    ('seni', 'Seni Rupa', 'Jenis garis, garis dan gerak di alam, bentuk geometris, topeng, bentuk berulang', False),
    ('inggris', 'Bahasa Inggris', 'Greetings, introducing yourself, numbers one to ten, I have, colors', False),
]

# --- Susunan paket = susunan ujian di kisi-kisi: tiap paket memuat tepat jumlah butir per indikator dan per bentuk ---
import re as _re
_JENIS = {'pg': 'pg', 'isian': 'isian', 'b/s': 'bs', 'uraian': 'uraian'}
URUT = ['pg', 'bs', 'isian', 'uraian']
def target(mid):
    t = Counter()
    for k, (teks, butir, bentuk) in KISI[mid].items():
        for f, n in _re.findall(r'([A-Za-z/]+)\s*(\d+)', bentuk):
            j = _JENIS[f.lower()]
            if j == 'uraian' and True: j = 'isian'
            t[(k, j)] += int(n)
    return t
def cek_susunan(mid, pi, soal):
    err = []
    t = target(mid)
    ada = Counter((q.get('kisi'), q['jenis']) for q in soal)
    if sum(t.values()) != len(soal): err.append(f'{mid} paket {pi}: {len(soal)} soal (kisi-kisi: {sum(t.values())})')
    for key in sorted(set(t) | set(ada)):
        if t[key] != ada[key]: err.append(f'{mid} paket {pi}: {key[0]} {key[1]} = {ada[key]} (kisi-kisi: {t[key]})')
    urut = [URUT.index(q['jenis']) for q in soal]
    if urut != sorted(urut): err.append(f'{mid} paket {pi}: urutan harus PG, B/S, isian, lalu uraian')
    return err

def ada(path):
    f = os.path.join(HERE, path)
    if not os.path.exists(f): return False
    if f.endswith('.svg'):  # unduhan gagal bisa tersimpan sebagai teks "404: Not Found"
        with open(f, 'rb') as h: return b'<svg' in h.read(400)
    return True

def periksa(mid, paket):
    err = []
    kode = KISI[mid]
    assert len(paket) == 3, f'{mid}: harus 3 paket, ada {len(paket)}'
    semua = Counter()
    tanya = Counter()
    for pi, soal in enumerate(paket, 1):
        err += cek_susunan(mid, pi, soal)
        for qi, q in enumerate(soal, 1):
            tag = f'{mid} P{pi} no {qi}'
            k = q.get('kisi')
            if k not in kode: err.append(f'{tag}: kode kisi {k!r} tidak dikenal')
            semua[k] += 1
            tanya[q['tanya'].strip().lower()] += 1
            j = q['jenis']
            if j == 'pg':
                if len(q['pilihan']) != 3 or not 0 <= q['jawab'] < 3: err.append(f'{tag}: pilihan/jawab salah')
                teks = [p if isinstance(p, str) else p.get('label', '') for p in q['pilihan']]
                if len(set(t.lower() for t in teks if t)) < len([t for t in teks if t]): err.append(f'{tag}: ada pilihan kembar')
            elif j == 'isian':
                if not q.get('terima'): err.append(f'{tag}: isian tanpa terima')
            elif j == 'bs':
                if not isinstance(q.get('benar'), bool): err.append(f'{tag}: bs tanpa benar')
            else:
                err.append(f'{tag}: jenis {j!r}')
            for part in q.get('gambar', []) + [p for p in q.get('pilihan', []) if isinstance(p, dict)]:
                if 'img' in part and not ada(part['img']): err.append(f'{tag}: gambar {part["img"]} tidak ada')
            if q.get('suara') and not ada(q['suara']): err.append(f'{tag}: suara {q["suara"]} tidak ada')
    for k in kode:
        if not semua[k]: err.append(f'{mid}: indikator {k} ({kode[k][0]}) belum ada soalnya')
    for t, n in tanya.items():
        if n > 1: err.append(f'{mid}: soal kembar: {t[:60]}')
    return err, semua

# --- Modul belajar: _materi_<mapel>.py berisi MATERI = [kartu, ...], satu kartu atau lebih per indikator kisi-kisi ---
def cek_materi(mid):
    err = []
    f = os.path.join(HERE, f'_materi_{mid}.py')
    if not os.path.exists(f): return [f'{mid}: belum ada _materi_{mid}.py'], []
    mat = importlib.import_module(f'_materi_{mid}').MATERI
    kode = list(KISI[mid])
    ada_k = [m.get('kisi') for m in mat]
    def langkah(x): return _re.match(r'\d+\.\s', x) is not None
    def teks_contoh(c): return c if isinstance(c, str) else (c.get('teks') or '')
    def kunci(p):  # identitas gambar: aset (+ jumlah salinan) atau isi svg; bagian teks tidak dihitung
        if 'img' in p: return ('img', p['img'], p.get('n'))
        if 'svg' in p: return ('svg', p['svg'])
        return None
    for i, m in enumerate(mat, 1):
        tag = f'{mid} materi {i}'
        if m.get('kisi') not in KISI[mid]: err.append(f'{tag}: kode kisi {m.get("kisi")!r} tidak dikenal')
        if not (m.get('judul') or '').strip(): err.append(f'{tag}: tanpa judul')
        isi = m.get('isi') or []
        contoh = [c if isinstance(c, dict) else {'teks': c} for c in m.get('contoh', [])]
        # kartu langkah: pengantar (0-2 kalimat tanpa nomor), lalu semua item bernomor berurutan; hanya kartu ini boleh sampai 8 item
        nomor = [j for j, x in enumerate(isi) if langkah(x)]
        kartu_langkah = len(nomor) >= 2 and nomor[0] <= 2 and nomor == list(range(nomor[0], len(isi)))
        if kartu_langkah:
            urut = [int(_re.match(r'\d+', x).group()) for x in isi[nomor[0]:]]
            if urut != list(range(urut[0], urut[0] + len(urut))): err.append(f'{tag}: nomor langkah harus berurutan, ada {urut}')
        maks = 8 if kartu_langkah else 5
        if not 1 <= len(isi) <= maks: err.append(f'{tag}: isi harus 1-{maks} kalimat pendek' + ('' if kartu_langkah else ' (kartu langkah: pengantar lalu semua item bernomor, maks 8)'))
        if any(len(x) > 160 for x in isi): err.append(f'{tag}: ada kalimat isi lebih dari 160 huruf')
        # satu item = satu langkah: nomor langkah berikutnya tidak boleh ada di tengah teks (mis. "Urutannya: 1. A. 2. B.")
        for x in isi + [teks_contoh(c) for c in contoh]:
            pen = [int(n) for n in _re.findall(r'(?:^|(?<=[.:;!?])\s)(\d{1,2})\.\s+\S', x)]
            if any(b == a + 1 for a, b in zip(pen, pen[1:])): err.append(f'{tag}: beberapa langkah bernomor dalam satu item, pecah satu langkah per item: {x[:50]!r}')
        # tanda kurang pada ekspresi hitung memakai U+2212, bukan tanda hubung
        for x in isi + [teks_contoh(c) for c in contoh]:
            if _re.search(r'(?<=\d) - (?=\d)', x): err.append(f'{tag}: pakai tanda kurang \u2212 (U+2212), bukan "-": {x[:50]!r}')
        if not (m.get('ingat') or '').strip(): err.append(f'{tag}: tanpa kalimat ingat')
        if not (m.get('ortu') or '').strip(): err.append(f'{tag}: tanpa tips orang tua')
        utama = list(m.get('gambar', []))
        parts = list(utama)
        for c in contoh: parts += c.get('gambar', [])
        for part in parts:
            if 'img' in part and not ada(part['img']): err.append(f'{tag}: gambar {part["img"]} tidak ada')
        # kartu tidak boleh terlalu panjang: maks 4 gambar utama dan 3 contoh (kalau lebih, pecah jadi dua kartu dengan kode kisi sama)
        if len(utama) > 4: err.append(f'{tag}: {len(utama)} gambar utama, maksimal 4 (pangkas atau pecah kartu)')
        if len(contoh) > 3: err.append(f'{tag}: {len(contoh)} contoh, maksimal 3 (pangkas atau pecah kartu)')
        # contoh tidak boleh hanya mengulang gambar dari blok gambar utama
        kutama = {kunci(p) for p in utama} - {None}
        for c in contoh:
            for p in c.get('gambar', []):
                if kunci(p) in kutama: err.append(f'{tag}: contoh mengulang gambar utama ({p.get("img") or "svg"}), buang dari contoh')
        # PJOK: setiap gambar diberi label singkat
        if mid == 'pjok':
            for p in utama:
                if 'teks' not in p and not p.get('label'): err.append(f'{tag}: gambar PJOK tanpa label')
        # kartu suku kata: pemenggalan pada label gambar harus ikut tertulis di teks isi/contoh
        badan = ' '.join(isi + [teks_contoh(c) for c in contoh])
        for p in utama:
            lb = p.get('label') or ''
            if _re.fullmatch(r'[a-z]+( - [a-z]+)+', lb) and lb not in badan: err.append(f'{tag}: pemenggalan {lb!r} hanya ada di label gambar, tulis juga di isi/contoh')
        if m.get('suara') and not ada(m['suara']): err.append(f'{tag}: suara {m["suara"]} tidak ada')
    for k in kode:
        if k not in ada_k: err.append(f'{mid}: indikator {k} belum punya materi')
    if ada_k != sorted(ada_k, key=lambda x: kode.index(x) if x in kode else 99): err.append(f'{mid}: urutan materi harus mengikuti urutan kisi-kisi')
    return err, mat

def cek(mid):
    mod = importlib.import_module(f'_soal_{mid}')
    err, cak = periksa(mid, mod.PAKET)
    print('\n'.join(err) or f'{mid}: lulus')
    sys.exit(1 if err else 0)

def main():
    if len(sys.argv) == 3 and sys.argv[1] == '--cek': cek(sys.argv[2])
    if len(sys.argv) == 3 and sys.argv[1] == '--cek-materi':
        e, _ = cek_materi(sys.argv[2]); print('\n'.join(e) or f'{sys.argv[2]}: materi lulus'); sys.exit(1 if e else 0)
    data, laporan, errors = [], [], []
    for mid, nama, materi, tambahan in MAPEL:
        mod = importlib.import_module(f'_soal_{mid}')
        paket = mod.PAKET
        err, cak = periksa(mid, paket)
        errors += err
        item = {'id': mid, 'nama': nama, 'materi': materi,
                'paket': [{'nama': f'Latihan {i}', 'soal': s} for i, s in enumerate(paket, 1)]}
        if tambahan: item['tambahan'] = True
        data.append(item)
        # tabel cakupan
        laporan.append(f'## {nama}\n')
        laporan.append('| Kode | Indikator kisi-kisi | Butir di kisi | Latihan 1 | Latihan 2 | Latihan 3 |')
        laporan.append('| --- | --- | --- | --- | --- | --- |')
        for k, (teks, butir, bentuk) in KISI[mid].items():
            sel = []
            for s in paket:
                no = [str(i) for i, q in enumerate(s, 1) if q.get('kisi') == k]
                sel.append(', '.join(no) or '-')
            laporan.append(f'| {k} | {teks} | {butir} ({bentuk}) | ' + ' | '.join(sel) + ' |')
        laporan.append('')
    if errors:
        print('\n'.join(errors)); sys.exit(1)
    out = ('/* Soal latihan Asesmen Sumatif Akhir Semester Ganjil kelas 1, 3 paket per mapel, disusun dari kisi-kisi sekolah (T.P 2026/2027).\n'
           '   Dibuat oleh _buat_soal.py dari _soal_<mapel>.py; ubah di sana lalu jalankan ulang. */\n'
           'window.SOAL = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    open(os.path.join(HERE, 'soal.js'), 'w').write(out)
    materi, merr = {}, []
    for mid, *_ in MAPEL:
        e, m = cek_materi(mid)
        merr += e
        if m: materi[mid] = m
    if merr: print('\n'.join(merr)); sys.exit(1)
    open(os.path.join(HERE, 'materi.js'), 'w').write('/* Modul belajar per mapel, dibuat oleh _buat_soal.py dari _materi_<mapel>.py. */\nwindow.MATERI = ' + json.dumps(materi, ensure_ascii=False, indent=1) + ';\n')
    open(os.path.join(HERE, 'KISI.md'), 'w').write(
        '# Cakupan kisi-kisi ASAS ganjil kelas 1\n\nAngka di kolom paket = nomor soal yang menguji indikator itu. Dibuat otomatis oleh `_buat_soal.py`.\n\n' + '\n'.join(laporan))
    for d in data:
        print(d['id'], [''.join('abc'[q['jawab']] if q['jenis'] == 'pg' else 'B' if q.get('benar') is True else 'S' if q['jenis'] == 'bs' else '_' for q in p['soal']) for p in d['paket']])

if __name__ == '__main__':
    main()
