#!/usr/bin/env python3
"""Menyusun soal.js dan KISI.md dari _soal_<mapel>.py (masing-masing berisi PAKET = [paket1, paket2, paket3]).
Memeriksa: 10 soal per paket, setiap soal punya kode kisi yang sah, semua indikator kisi-kisi tercakup
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

def ada(path):
    return os.path.exists(os.path.join(HERE, path))

def periksa(mid, paket):
    err = []
    kode = KISI[mid]
    assert len(paket) == 3, f'{mid}: harus 3 paket, ada {len(paket)}'
    semua = Counter()
    tanya = Counter()
    for pi, soal in enumerate(paket, 1):
        if len(soal) != 10: err.append(f'{mid} paket {pi}: {len(soal)} soal (harus 10)')
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

def main():
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
    out = ('/* Soal latihan Asesmen Sumatif Akhir Semester Ganjil kelas 1, 3 paket per mapel, disusun dari kisi-kisi sekolah (T.P 2026/2027).\n'
           '   Dibuat oleh _buat_soal.py dari _soal_<mapel>.py; ubah di sana lalu jalankan ulang. */\n'
           'window.SOAL = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    open(os.path.join(HERE, 'soal.js'), 'w').write(out)
    open(os.path.join(HERE, 'KISI.md'), 'w').write(
        '# Cakupan kisi-kisi ASAS ganjil kelas 1\n\nAngka di kolom paket = nomor soal yang menguji indikator itu. Dibuat otomatis oleh `_buat_soal.py`.\n\n' + '\n'.join(laporan))
    for d in data:
        print(d['id'], [''.join('abc'[q['jawab']] if q['jenis'] == 'pg' else 'B' if q.get('benar') is True else 'S' if q['jenis'] == 'bs' else '_' for q in p['soal']) for p in d['paket']])

if __name__ == '__main__':
    main()
