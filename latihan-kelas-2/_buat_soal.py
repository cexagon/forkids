#!/usr/bin/env python3
"""Menyusun soal.js dan KISI.md dari _soal_<mapel>.py (masing-masing berisi PAKET = [paket1, paket2, paket3]).
Memeriksa: 15 soal per paket (6 PG, 6 isian, 3 uraian), setiap soal punya kode kisi yang sah, semua indikator kisi-kisi tercakup
di gabungan 3 paket, tidak ada soal kembar, semua gambar/suara ada, kunci jawaban sah.
Jalankan: python3 latihan-kelas-2/_buat_soal.py"""
import importlib, json, os, sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _kisi import KISI

N_SOAL = 15
BENTUK = {'pg': 6, 'isian': 6, 'uraian': 3}

MAPEL = [
    ('alislam', 'Al-Islam', 'Surah An-Nas, hijaiah bersambung, Al-Hafiz, Al-Wali, Al-Halim, Al-Khabir, jujur dan santun, salat fardu, kisah Nabi Nuh', False),
    ('pancasila', 'Pendidikan Pancasila', 'Aturan di keluarga, rumah, sekolah dan lingkungan, keteladanan Rasulullah, Garuda Pancasila dan sila-silanya', False),
    ('bindo', 'Bahasa Indonesia', 'Perasaan, huruf kapital, kebersihan diri, fabel, kalimat tanya, S-P-O, grafik, rambu, keluarga, kalimat aktif-pasif, fakta dan opini', False),
    ('matematika', 'Matematika', 'Bilangan sampai 50, nilai tempat, menyimpan dan meminjam, bangun datar dan ruang, posisi benda, pola', False),
    ('pjok', 'PJOK', 'Gerak lokomotor, nonlokomotor, manipulatif, gerak berirama, kebugaran dan hidup bersih, aktivitas air, sikap syukur', False),
    ('seni', 'Seni Rupa', 'Garis dan bidang, warna panas dan dingin, menghargai karya, sumber ide, teknik gosok dan kolase, alat dan bahan', False),
    ('inggris', 'Bahasa Inggris', 'Fruits, Do you like, family members, classroom objects, Where is my, in front of, behind, next to, There are', False),
]

def ada(path):
    return os.path.exists(os.path.join(HERE, path))

def periksa(mid, paket):
    err = []
    kode = KISI[mid]
    assert len(paket) == 3, f'{mid}: harus 3 paket, ada {len(paket)}'
    semua = Counter()
    tanya = Counter()
    for pi, soal in enumerate(paket, 1):
        if len(soal) != N_SOAL: err.append(f'{mid} paket {pi}: {len(soal)} soal (harus {N_SOAL})')
        jml = Counter(q['jenis'] for q in soal)
        if dict(jml) != BENTUK: err.append(f'{mid} paket {pi}: bentuk {dict(jml)} (harus {BENTUK})')
        for qi, q in enumerate(soal, 1):
            tag = f'{mid} P{pi} no {qi}'
            k = q.get('kisi')
            if k not in kode: err.append(f'{tag}: kode kisi {k!r} tidak dikenal')
            semua[k] += 1
            tanya[q['tanya'].strip().lower()] += 1
            if not (q.get('konteks') or '').strip(): err.append(f'{tag}: belum ada konteks untuk tombol 😵‍💫')
            j = q['jenis']
            if j == 'pg':
                if len(q['pilihan']) not in (3, 4) or not 0 <= q['jawab'] < len(q['pilihan']): err.append(f'{tag}: pilihan/jawab salah')
                teks = [p if isinstance(p, str) else p.get('label', '') for p in q['pilihan']]
                if len(set(t.lower() for t in teks if t)) < len([t for t in teks if t]): err.append(f'{tag}: ada pilihan kembar')
            elif j == 'isian':
                if not q.get('terima'): err.append(f'{tag}: isian tanpa terima')
            elif j == 'uraian':
                if not q.get('contoh') or not q.get('kunci') or not all(isinstance(g, list) and g for g in q['kunci']):
                    err.append(f'{tag}: uraian butuh contoh dan kunci [[sinonim,...],...]')
                elif q.get('minimal', 1) > len(q['kunci']): err.append(f'{tag}: minimal > jumlah gagasan')
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

def cek(mid):
    mod = importlib.import_module(f'_soal_{mid}')
    err, cak = periksa(mid, mod.PAKET)
    print('\n'.join(err) or f'{mid}: lulus')
    for k in KISI[mid]: print(f'  {k}: {cak[k]} soal')
    sys.exit(1 if err else 0)

def main():
    if len(sys.argv) == 3 and sys.argv[1] == '--cek': cek(sys.argv[2])
    data, laporan, errors = [], [], []
    for mid, nama, materi, tambahan in MAPEL:
        mod = importlib.import_module(f'_soal_{mid}')
        paket = mod.PAKET
        err, cak = periksa(mid, paket)
        errors += err
        item = {'id': mid, 'nama': nama, 'materi': materi,
                'paket': [{'nama': f'Paket {i}', 'soal': s} for i, s in enumerate(paket, 1)]}
        if tambahan: item['tambahan'] = True
        data.append(item)
        # tabel cakupan
        laporan.append(f'## {nama}\n')
        laporan.append('| Kode | Indikator kisi-kisi | Butir di kisi | Paket 1 | Paket 2 | Paket 3 |')
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
    out = ('/* Soal latihan Asesmen Sumatif Akhir Semester Ganjil kelas 2, 3 paket per mapel, disusun dari kisi-kisi sekolah (T.P 2026/2027).\n'
           '   Dibuat oleh _buat_soal.py dari _soal_<mapel>.py; ubah di sana lalu jalankan ulang. */\n'
           'window.SOAL = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    open(os.path.join(HERE, 'soal.js'), 'w').write(out)
    open(os.path.join(HERE, 'KISI.md'), 'w').write(
        '# Cakupan kisi-kisi ASAS ganjil kelas 2\n\nAngka di kolom paket = nomor soal yang menguji indikator itu. Dibuat otomatis oleh `_buat_soal.py`.\n\n' + '\n'.join(laporan))
    for d in data:
        print(d['id'], [''.join('abcd'[q['jawab']] if q['jenis'] == 'pg' else 'B' if q.get('benar') is True else 'S' if q['jenis'] == 'bs' else 'U' if q['jenis'] == 'uraian' else '_' for q in p['soal']) for p in d['paket']])

if __name__ == '__main__':
    main()
