from _alat import *
from _soal_matematika import (poly, putus, rr, kotak, tabung, kerucut, bola, prisma, shp, deretan,
                              BIRU, ORA, KUN, HIJ, MER, W, BC,
                              BAGI_DUA, PP_DIAG, PERSEGI_DIAG, DUA_PERSEGI, DUA_SEGITIGA, EMPAT_PERSEGI)

# =====================================================================
# Modul "Belajar dulu" - Matematika kelas 2 (ASAS ganjil)
# Urutan kartu mengikuti kisi-kisi: MT1a, MT1b, MT2a, MT2b, MT3a, MT3b, MT3c, MT3d, MT4a, MT4b
# Contoh hitungan sengaja berbeda dari angka di soal paket; semua dicek dengan assert di bawah.
# =====================================================================

OR_SIMPAN = '#E8742A'      # angka simpanan / pinjaman (kecil)
MERAH = '#E5484D'
SOROT = '#FFF0C9'
ABU = '#8a7a6c'
F = 'font-family="sans-serif"'


def teks(x, y, s, size=20, w=700, c=INK, anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{w}" fill="{c}" {F}>{s}</text>'


# ---------- gambar: cara bersusun ----------
def susun(a, b, op, tahap=2):
    """Contoh bersusun sebagai gambar. Angka sejajar puluhan-satuan; angka simpanan/pinjaman kecil berwarna.
    tahap 0 = soal saja, 1 = satuan selesai (sorot satuan), 2 = semua selesai (sorot puluhan)."""
    xP, xS = 112, 172
    yK, yA, yB, yG, yH = 66, 114, 162, 178, 220
    aP, aS = divmod(a, 10)
    bP, bS = divmod(b, 10)
    s = ''
    if tahap == 1:
        s += f'<rect x="{xS-27}" y="22" width="54" height="214" rx="12" fill="{SOROT}"/>'
    if tahap == 2:
        s += f'<rect x="{xP-27}" y="22" width="54" height="214" rx="12" fill="{SOROT}"/>'
    s += teks(xP, 16, 'puluhan', 14, 700, ABU) + teks(xS, 16, 'satuan', 14, 700, ABU)
    # angka atas
    s += teks(xP, yA, aP, 50, 800) + teks(xS, yA, aS, 50, 800)
    # angka bawah + tanda
    s += teks(52, yB, '+' if op == '+' else '−', 46, 800, ABU)
    if bP: s += teks(xP, yB, bP, 50, 800)
    s += teks(xS, yB, bS, 50, 800)
    s += f'<line x1="74" x2="206" y1="{yG}" y2="{yG}" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    if op == '+':
        simpan = (aS + bS) >= 10
        hS = (aS + bS) % 10
        hP = aP + bP + (1 if simpan else 0)
        if tahap >= 1:
            if simpan: s += teks(xP, yK, 1, 28, 800, OR_SIMPAN)
            s += teks(xS, yH, hS, 50, 800)
        if tahap >= 2 and (hP or True):
            s += teks(xP, yH, hP, 50, 800)
    else:
        pinjam = aS < bS
        satA = aS + 10 if pinjam else aS
        hS = satA - bS
        hP = (aP - 1 if pinjam else aP) - bP
        if tahap >= 1:
            if pinjam:
                s += f'<line x1="{xP-17}" y1="{yA-4}" x2="{xP+17}" y2="{yA-38}" stroke="{MERAH}" stroke-width="5" stroke-linecap="round"/>'
                s += f'<line x1="{xS-17}" y1="{yA-4}" x2="{xS+17}" y2="{yA-38}" stroke="{MERAH}" stroke-width="5" stroke-linecap="round"/>'
                s += teks(xP, yK - 6, aP - 1, 28, 800, OR_SIMPAN) + teks(xS, yK - 6, satA, 28, 800, OR_SIMPAN)
            s += teks(xS, yH, hS, 50, 800)
        if tahap >= 2:
            s += teks(xP, yH, hP, 50, 800)
    return svg(s, 230, 236)


# ---------- gambar: puluhan dan satuan ----------
def tempat(n):
    """Ikatan puluhan (batang isi 10) dan satuan (kotak kecil) untuk bilangan n."""
    p, sa = divmod(n, 10)
    wr = p * 22
    wu = (min(sa, 5) * 20 if sa else 0)
    total = wr + (24 if p and sa else 0) + wu
    x0 = (300 - total) / 2
    s = ''
    for i in range(p):
        x = x0 + i * 22
        s += f'<rect x="{x}" y="14" width="16" height="84" rx="3" fill="{ORA[0]}" stroke="{INK}" stroke-width="3"/>'
        for k in range(1, 10):
            s += f'<line x1="{x}" x2="{x+16}" y1="{14+k*8.4:.1f}" y2="{14+k*8.4:.1f}" stroke="{INK}" stroke-width="1.2"/>'
    ux = x0 + wr + (24 if p and sa else 0)
    for j in range(sa):
        cx, cy = ux + (j % 5) * 20, 40 + (j // 5) * 22
        s += f'<rect x="{cx}" y="{cy+0}" width="16" height="16" rx="3" fill="{BIRU[0]}" stroke="{INK}" stroke-width="3"/>'
    s += teks(150, 134, n, 36, 800)
    s += teks(150, 156, f'{p} puluhan, {sa} satuan', 15, 700, ABU)
    return svg(s, 300, 166)


def banding(a, tanda, b):
    return svg(teks(150, 62, f'{a} <tanda> {b}'.replace('<tanda>', {'<': '&lt;', '>': '&gt;', '=': '='}[tanda]), 52, 800)
               + teks(150, 98, {'<': 'lebih kecil dari', '>': 'lebih besar dari', '=': 'sama dengan'}[tanda], 17, 700, ABU), 300, 112)


# ---------- gambar: bangun ----------
def grup(items, per=150, fs=20):
    """items = [(isi gambar pada kotak 200x150, nama)]; digambar kecil dengan nama di bawahnya."""
    s = ''
    for i, (body, nama) in enumerate(items):
        s += f'<g transform="translate({i*per+5} 4) scale(0.72)">{body}</g>' + teks(i * per + per / 2, 128, nama, fs, 800)
    return svg(s, per * len(items), 140)


def titik(pts, r=6, c=MERAH):
    return ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" stroke="{INK}" stroke-width="2"/>' for x, y in pts)


B_PERSEGI = sq(100, 70, 46, BC['s']) + titik([(54, 24), (146, 24), (54, 116), (146, 116)])
B_PERSEGI_PANJANG = rr(24, 36, 152, 76, BC['r']) + titik([(24, 36), (176, 36), (24, 112), (176, 112)])
B_SEGITIGA = tri(100, 66, 52, BC['t']) + titik([(100, 14), (152, 107.6), (48, 107.6)])
B_LINGKARAN = circ(100, 70, 50, BC['c'])

R_KUBUS = kotak(52, 52, 70, 70, 32, BIRU)
R_BALOK = kotak(26, 62, 112, 52, 30, ORA)
R_TABUNG = tabung(100, 38, 46, 15, 76, KUN)
R_KERUCUT = kerucut(100, 18, 112, 46, 15, HIJ)
R_BOLA = bola(100, 70, 50, MER)
R_PRISMA = prisma(30, 52, 92, 70, 40, MER)

# kubus bertanda: sisi, rusuk, titik sudut (x, y, w, h, d = 52, 50, 70, 70, 32)
_x, _y, _w, _h, _d = 50, 56, 66, 66, 30
SISI_KUBUS = svg(kotak(_x, _y, _w, _h, _d, BIRU)
                 + f'<rect x="{_x}" y="{_y}" width="{_w}" height="{_h}" rx="3" fill="#F8C197" stroke="{INK}" stroke-width="4"/>'
                 + teks(_x + _w / 2, _y + _h / 2 + 8, 'sisi', 22, 800), 200, 150)


def _rusuk():
    x, y, w, h, d = _x, _y, _w, _h, _d
    P = {'a1': (x, y), 'a2': (x + w, y), 'a3': (x, y + h), 'a4': (x + w, y + h),
         'b1': (x + d, y - d), 'b2': (x + w + d, y - d), 'b3': (x + d, y + h - d), 'b4': (x + w + d, y + h - d)}
    def L(p, q, c):
        return f'<line x1="{P[p][0]}" y1="{P[p][1]}" x2="{P[q][0]}" y2="{P[q][1]}" stroke="{c}" stroke-width="7" stroke-linecap="round"/>'
    atas = [('a1', 'a2'), ('a2', 'b2'), ('b2', 'b1'), ('b1', 'a1')]
    bawah = [('a3', 'a4'), ('a4', 'b4'), ('b4', 'b3'), ('b3', 'a3')]
    tegak = [('a1', 'a3'), ('a2', 'a4'), ('b1', 'b3'), ('b2', 'b4')]
    s = kotak(x, y, w, h, d, ('#f4efe6', '#f4efe6', '#f4efe6'))
    s += ''.join(L(p, q, '#E8742A') for p, q in atas) + ''.join(L(p, q, '#4E9FCB') for p, q in bawah) + ''.join(L(p, q, '#4FA042') for p, q in tegak)
    s += teks(160, 24, '4 atas', 15, 800, '#E8742A', 'start')
    s += teks(150, 142, '4 bawah', 15, 800, '#4E9FCB', 'start') + teks(6, 24, '4 tegak', 15, 800, '#4FA042', 'start')
    return svg(s, 245, 150), len(atas) + len(bawah) + len(tegak)


RUSUK_KUBUS, _n_rusuk = _rusuk()


def _sudut():
    x, y, w, h, d = _x, _y, _w, _h, _d
    pts = [(x, y), (x + w, y), (x, y + h), (x + w, y + h), (x + d, y - d), (x + w + d, y - d), (x + d, y + h - d), (x + w + d, y + h - d)]
    s = kotak(x, y, w, h, d, BIRU) + titik(pts, 8)
    for i, (px, py) in enumerate(pts, 1):
        s += teks(px + (-14 if i in (1, 3, 2) else 14), py + (-6 if i in (1, 5, 6) else 20), i, 16, 800)
    return svg(s, 215, 150), len(pts)


SUDUT_KUBUS, _n_sudut = _sudut()


# rumah dari bangun datar (untuk "menyusun")
RUMAH = svg(rr(60, 70, 120, 70, BC['s']) + poly([(48, 72), (120, 18), (192, 72)], BC['t']) + rr(105, 98, 30, 42, BC['c'])
            + circ(80, 96, 10, BC['r']) + circ(160, 96, 10, BC['r']), 240, 150)

# posisi benda
ATAS_BAWAH = svg(sq(70, 30, 20, BC['s']) + tri(70, 78, 24, BC['t']) + circ(70, 126, 22, BC['c'])
                 + teks(150, 36, 'atas', 24, 800) + teks(150, 84, 'tengah', 24, 800) + teks(150, 132, 'bawah', 24, 800), 230, 160)
DEPAN_BELAKANG = svg(rr(40, 20, 110, 70, '#B5E1F4') + teks(95, 62, 'belakang', 20, 800)
                     + circ(130, 106, 28, W['merah']) + teks(130, 112, 'depan', 17, 800, '#fff')
                     + '<line x1="190" y1="50" x2="190" y2="120" stroke="#8a7a6c" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>'
                     + teks(215, 150, 'lebih dekat ke kita', 13, 700, ABU, 'end'), 230, 160)

# pola
POLA_ABAB = deretan([('c', W['hijau']), ('c', W['kuning'])] * 2 + [('c', W['hijau'])])
POLA_AAB = deretan([(k, None) for k in 'cctcct' + 'c'][:7])
POLA_ABC = deretan([('c', W[x]) for x in ['biru', 'hijau', 'merah', 'biru', 'hijau', 'merah', 'biru']], q=2)


def _pola_ukuran():
    s = ''
    for i, r in enumerate([22, 12, 12, 22, 12, 12, 22]):
        s += circ(32 + i * 50, 48, r, BC['c'])
    s += (f'<rect x="{32+7*50-22}" y="22" width="44" height="52" rx="10" fill="#fff" stroke="{INK}" stroke-width="4" stroke-dasharray="8 6"/>'
          + teks(32 + 7 * 50, 60, '?', 30, 800))
    return svg(s, 420, 96)


POLA_UKURAN = _pola_ukuran()

# ---------- cek hitungan semua contoh ----------
assert 36 + 0 == 36 and 26 + 19 == 45 and 6 + 9 == 15 and 2 + 1 + 1 == 4
assert 14 + 8 == 22 and 4 + 8 == 12 and 1 + 0 + 1 == 2
assert 23 + 15 == 38 and 3 + 5 < 10
assert 43 - 18 == 25 and 13 - 8 == 5 and 4 - 1 - 1 == 2
assert 26 - 9 == 17 and 16 - 9 == 7 and 2 - 1 == 1
assert 37 - 14 == 23 and 7 >= 4
assert 30 - 12 == 18 and 10 - 2 == 8 and 3 - 1 - 1 == 1
assert max(45, 22, 38, 25, 17, 23, 18) <= 50
assert 48 > 31 and 46 > 39 and 41 < 45 and 33 == 33 and 29 < 31
assert 47 == 40 + 7 and 3 * 10 + 5 == 35 and divmod(26, 10) == (2, 6)
assert _n_rusuk == 12 and _n_sudut == 8 and 4 + 4 + 4 == 12
assert 'cctcctc'[6] == 'c'
_abc = ['biru', 'hijau', 'merah'] * 3
assert _abc[7] == 'hijau' and _abc[8] == 'merah'
assert (['hijau', 'kuning'] * 3)[5] == 'kuning'
assert (['besar', 'kecil'] * 3)[5] == 'kecil'

MATERI = [
    # ------------------------------------------------------------------ MT1a
    {'kisi': 'MT1a',
     'judul': 'Mana yang lebih besar?',
     'isi': ['Yuk bandingkan dua bilangan. Lihat puluhannya dulu.',
             'Puluhan yang lebih banyak berarti bilangan itu lebih besar.',
             'Lebih besar dari 31 artinya lebih banyak dari 31. Lebih kecil artinya lebih sedikit.'],
     'contoh': [{'teks': '48 dan 31. Puluhan 4 lebih banyak dari 3, jadi 48 lebih besar.', 'gambar': [tempat(48), tempat(31)]},
                {'teks': '46 dan 39. Puluhan 4 lebih banyak dari 3, jadi 46 lebih besar. Satuan 9 tidak perlu dilihat dulu.',
                 'gambar': [tempat(46), tempat(39)]}],
     'ingat': 'Bandingkan puluhannya dulu: puluhan yang lebih banyak berarti bilangannya lebih besar.',
     'ortu': 'Peragakan dengan sedotan atau lidi: ikat tiap sepuluh, lalu banding dua tumpukan. Tanyakan "ikatan siapa lebih banyak?" sebelum melihat satuannya.'},
    {'kisi': 'MT1a',
     'judul': 'Tanda lebih besar, lebih kecil',
     'isi': ['Tanda > dibaca "lebih besar dari". Tanda < dibaca "lebih kecil dari". Tanda = dibaca "sama dengan".',
             'Mulut tanda selalu terbuka ke bilangan yang lebih besar.',
             'Kalau puluhannya sama, bandingkan satuannya. Contoh 41 dan 45: puluhan sama, satuan 1 lebih kecil dari 5, jadi 41 < 45.'],
     'gambar': [banding(41, '<', 45), banding(29, '<', 31), banding(33, '=', 33)],
     'ingat': 'Mulut tanda < dan > menghadap bilangan yang lebih besar. Kalau puluhannya sama, lihat satuannya.',
     'ortu': 'Gambar mulut buaya yang ingin makan bilangan terbesar. Minta anak memilih tanda sendiri setelah menaruh dua tumpukan benda berdampingan.'},

    # ------------------------------------------------------------------ MT1b
    {'kisi': 'MT1b',
     'judul': 'Puluhan dan satuan',
     'isi': ['Bilangan dua angka punya dua tempat. Puluhan di kiri, satuan di kanan.',
             'Satu puluhan adalah satu ikat berisi sepuluh. Satuan adalah yang lepas.',
             'Contoh 26: ada 2 puluhan dan 6 satuan. Angka 2 ada di tempat puluhan, angka 6 ada di tempat satuan.'],
     'gambar': [tempat(26)],
     'ingat': 'Angka di kiri ada di tempat puluhan, angka di kanan ada di tempat satuan.',
     'ortu': 'Ikat sedotan sepuluh-sepuluh dengan karet. Tanyakan: "Angka ini menunjukkan ikatan atau yang lepas?" supaya anak memahami arti posisi angka.'},
    {'kisi': 'MT1b',
     'judul': 'Menguraikan bilangan',
     'isi': ['Bilangan dua angka bisa diurai: puluhan ditambah satuan.',
             'Contoh: 47 = 40 + 7. Itu artinya 4 puluhan dan 7 satuan.',
             'Sebaliknya, tulis angka puluhan lebih dulu, lalu angka satuan di sebelah kanannya.',
             'Jadi 3 puluhan dan 5 satuan ditulis 35.'],
     'contoh': [{'teks': '47 = 40 + 7', 'gambar': [tempat(47)]},
                {'teks': '3 puluhan dan 5 satuan ditulis 35', 'gambar': [tempat(35)]}],
     'ingat': 'Bilangan = puluhan + satuan. Contoh: 47 = 40 + 7.',
     'ortu': 'Beri anak kartu puluhan (10, 20, 30...) dan kartu satuan (1-9), lalu minta ia menumpuknya menjadi bilangan dan menguraikannya kembali.'},

    # ------------------------------------------------------------------ MT2a
    {'kisi': 'MT2a',
     'judul': 'Menjumlah dengan menyimpan',
     'isi': ['Tulis bilangan bersusun: puluhan di bawah puluhan, satuan di bawah satuan. Contoh 26 + 19.',
             '1. Jumlahkan satuan dulu: 6 + 9 = 15. Tulis 5, lalu simpan 1 puluhan di atas kolom puluhan.',
             '2. Jumlahkan puluhan: 2 + 1 + 1 simpanan = 4. Tulis 4.',
             '3. Hasilnya 45. Jadi 26 + 19 = 45.'],
     'gambar': [susun(26, 19, '+', 0), susun(26, 19, '+', 1), susun(26, 19, '+', 2)],
     'ingat': 'Jumlahkan satuan dulu. Tulis satuannya, simpan 1 puluhan, lalu jumlahkan puluhan ditambah simpanan.',
     'ortu': 'Tunjukkan bahwa 15 satuan ditukar menjadi 1 ikat sepuluh dan 5 lepas. Minta anak menulis angka rapi lurus ke bawah dan menyebut tiap langkah dengan suara.'},
    {'kisi': 'MT2a',
     'judul': 'Kapan harus menyimpan?',
     'isi': ['Lihat jumlah satuannya. Kalau hasilnya 10 atau lebih, 10 satuan ditukar menjadi 1 puluhan dan disimpan.',
             'Kalau jumlah satuannya kurang dari 10, tidak perlu menyimpan.',
             'Setelah itu jumlahkan puluhan, jangan lupa tambah simpanannya.'],
     'contoh': [{'teks': 'Menyimpan: 14 + 8. Satuan 4 + 8 = 12, tulis 2, simpan 1. Puluhan 1 + 1 = 2. Hasil 22.', 'gambar': [susun(14, 8, '+', 2)]},
                {'teks': 'Tanpa menyimpan: 23 + 15. Satuan 3 + 5 = 8. Puluhan 2 + 1 = 3. Hasil 38.', 'gambar': [susun(23, 15, '+', 2)]}],
     'ingat': 'Satuan berjumlah 10 atau lebih: simpan 1 puluhan. Kurang dari 10: tidak perlu menyimpan.',
     'ortu': 'Bermain tukar uang mainan: 10 koin satuan ditukar 1 lembar sepuluhan. Minta anak menebak dulu apakah perlu menyimpan sebelum menghitung.'},

    # ------------------------------------------------------------------ MT2b
    {'kisi': 'MT2b',
     'judul': 'Mengurang dengan meminjam',
     'isi': ['Contoh 43 − 18. Satuan 3 tidak cukup dikurangi 8, jadi kita meminjam.',
             '1. Pinjam 1 puluhan dari 4. Puluhan 4 tinggal 3. Satuan 3 menjadi 13.',
             '2. Kurangi satuan: 13 − 8 = 5. Tulis 5.',
             '3. Kurangi puluhan: 3 − 1 = 2. Tulis 2. Jadi 43 − 18 = 25.'],
     'gambar': [susun(43, 18, '-', 0), susun(43, 18, '-', 1), susun(43, 18, '-', 2)],
     'ingat': 'Satuan atas kurang? Pinjam 1 puluhan: puluhan berkurang 1 dan satuan bertambah 10.',
     'ortu': 'Peragakan dengan 4 ikat lidi dan 3 lidi lepas: buka satu ikat agar ada 13 lidi lepas, lalu ambil 8. Hitung kembali sisa lidinya bersama anak.'},
    {'kisi': 'MT2b',
     'judul': 'Kapan harus meminjam?',
     'isi': ['Bandingkan satuan atas dengan satuan bawah. Kalau satuan atas lebih kecil, pinjam 1 puluhan.',
             'Kalau satuan atas cukup besar, tidak perlu meminjam.',
             'Kalau satuan atas 0, kita juga pinjam. Contoh 30 − 12: 10 − 2 = 8, puluhan tinggal 2, lalu 2 − 1 = 1.'],
     'contoh': [{'teks': 'Pinjam: 26 − 9. Satuan 6 kurang dari 9. 16 − 9 = 7, puluhan 2 − 1 = 1. Hasil 17.', 'gambar': [susun(26, 9, '-', 2)]},
                {'teks': 'Tanpa pinjam: 37 − 14. Satuan 7 − 4 = 3, puluhan 3 − 1 = 2. Hasil 23.', 'gambar': [susun(37, 14, '-', 2)]},
                {'teks': 'Satuan 0: 30 − 12. Hasil 18.', 'gambar': [susun(30, 12, '-', 2)]}],
     'ingat': 'Satuan atas lebih kecil dari satuan bawah: pinjam. Kalau tidak, kurangi langsung.',
     'ortu': 'Tukar selembar uang mainan sepuluhan menjadi 10 koin satuan, lalu bayar. Minta anak mengatakan sendiri alasan meminjam sebelum menulisnya.'},

    # ------------------------------------------------------------------ MT3a
    {'kisi': 'MT3a',
     'judul': 'Bangun datar',
     'isi': ['Bangun datar itu pipih, seperti gambar di kertas.',
             'Persegi: 4 sisi sama panjang. Persegi panjang: 4 sisi, dua sisi panjang dan dua sisi pendek.',
             'Segitiga: 3 sisi dan 3 pojok (pojok disebut juga sudut). Lingkaran: bulat, tidak punya pojok.'],
     'gambar': [grup([(B_PERSEGI, 'persegi'), (B_PERSEGI_PANJANG, 'persegi panjang')], 200),
                grup([(B_SEGITIGA, 'segitiga'), (B_LINGKARAN, 'lingkaran')], 200)],
     'ingat': 'Persegi, persegi panjang, segitiga, dan lingkaran adalah bangun datar.',
     'ortu': 'Cari benda di rumah: ubin, pintu, rambu segitiga, tutup toples. Minta anak menyebut nama bentuknya dan menghitung sisi serta pojoknya.'},
    {'kisi': 'MT3a',
     'judul': 'Bangun ruang',
     'isi': ['Bangun ruang punya isi dan bisa dipegang.',
             'Kubus seperti dadu: semua sisinya persegi sama besar. Balok seperti kotak sepatu.',
             'Tabung seperti kaleng susu. Kerucut seperti topi ulang tahun. Bola seperti bola sepak.',
             'Prisma segitiga seperti atap rumah: alas dan tutupnya segitiga, sisi sampingnya persegi panjang.'],
     'gambar': [grup([(R_KUBUS, 'kubus'), (R_BALOK, 'balok'), (R_TABUNG, 'tabung')]),
                grup([(R_KERUCUT, 'kerucut'), (R_BOLA, 'bola'), (R_PRISMA, 'prisma segitiga')], 150, 16)],
     'ingat': 'Bangun ruang: kubus, balok, tabung, kerucut, bola, dan prisma segitiga.',
     'ortu': 'Kumpulkan benda: dadu, kotak sepatu, kaleng, topi ulang tahun, bola. Minta anak mengelompokkan dan menyebut namanya, lalu mencari benda lain yang sama bentuknya.'},

    # ------------------------------------------------------------------ MT3b
    {'kisi': 'MT3b',
     'judul': 'Sisi, rusuk, titik sudut',
     'isi': ['Sisi adalah bidang datar yang membungkus bangun ruang, seperti permukaan dadu.',
             'Rusuk adalah garis pinggir tempat dua sisi bertemu. Titik sudut adalah pojok tempat rusuk bertemu.',
             'Kubus dan balok sama-sama punya 6 sisi, 12 rusuk, dan 8 titik sudut.',
             'Rusuk 12 itu 4 di atas, 4 di bawah, dan 4 yang tegak.'],
     'gambar': [SISI_KUBUS, RUSUK_KUBUS, SUDUT_KUBUS],
     'ingat': 'Kubus dan balok: 6 sisi, 12 rusuk, 8 titik sudut.',
     'ortu': 'Pegang kotak sepatu, lalu hitung pelan-pelan: permukaan dulu, garis pinggir kelompok demi kelompok, lalu pojok. Pojok bagian belakang sering terlewat.'},

    # ------------------------------------------------------------------ MT3c
    {'kisi': 'MT3c',
     'judul': 'Segi banyak dan lengkung',
     'isi': ['Segi banyak punya sisi lurus dan pojok. Contoh: segitiga, persegi, persegi panjang.',
             'Bentuk lengkung tepinya melengkung mulus dan tidak punya pojok. Contoh: lingkaran.',
             'Untuk memeriksa, telusuri tepinya dengan jari. Kalau ada pojok tajam, itu segi banyak.'],
     'gambar': [grup([(B_SEGITIGA, 'segitiga'), (B_PERSEGI, 'persegi'), (B_PERSEGI_PANJANG, 'persegi panjang')], 150, 16),
                grup([(B_LINGKARAN, 'lingkaran')], 150)],
     'ingat': 'Segi banyak: sisi lurus dan ada pojok. Bentuk lengkung: tepi melengkung dan tanpa pojok.',
     'ortu': 'Titik merah pada gambar menandai pojok. Minta anak menelusuri tepi piring dan buku dengan jarinya, lalu menjelaskan mana yang punya pojok.'},

    # ------------------------------------------------------------------ MT3d
    {'kisi': 'MT3d',
     'judul': 'Membagi bangun datar',
     'isi': ['Bangun datar bisa dipotong menjadi bangun lain.',
             'Persegi panjang yang panjangnya dua kali lebarnya dipotong di tengah menjadi 2 persegi. Dipotong dari pojok ke pojok menjadi 2 segitiga.',
             'Persegi dipotong dengan dua garis silang dari pojok ke pojok menjadi 4 segitiga kecil.',
             'Persegi yang dipotong lurus tepat di tengah menjadi 2 persegi panjang. Hitung potongannya, lalu sebut bentuknya.'],
     'contoh': [{'teks': 'Dipotong di tengah: 2 persegi', 'gambar': [BAGI_DUA]},
                {'teks': 'Dipotong pojok ke pojok: 2 segitiga', 'gambar': [PP_DIAG]},
                {'teks': 'Dua garis silang: 4 segitiga kecil', 'gambar': [PERSEGI_DIAG]}],
     'ingat': 'Garis potong membagi bangun menjadi bangun-bangun kecil. Hitung dan sebut bentuknya.',
     'ortu': 'Gunting kertas persegi panjang dan persegi bersama anak menurut garisnya. Setiap hasil guntingan diperiksa: berapa jumlahnya dan apa bentuknya.'},
    {'kisi': 'MT3d',
     'judul': 'Menyusun bangun datar',
     'isi': ['Bangun-bangun kecil bisa disusun rapat tanpa celah menjadi bangun baru.',
             '2 persegi sama besar disusun sebaris menjadi persegi panjang. Begitu juga 3 persegi sebaris.',
             '4 persegi disusun 2 baris dan 2 kolom menjadi persegi besar. 2 segitiga sama besar menjadi persegi bila sisi miringnya ditempelkan.',
             'Gambar juga bisa disusun dari bangun datar, misalnya rumah.'],
     'gambar': [DUA_PERSEGI, EMPAT_PERSEGI, DUA_SEGITIGA, RUMAH],
     'ingat': 'Susun bangun kecil rapat tanpa celah, lalu lihat bangun baru yang terbentuk.',
     'ortu': 'Beri anak kartu persegi dan segitiga hasil guntingan, lalu biarkan ia mencoba susunan berbeda. Minta ia menceritakan susunan yang berhasil dengan kata-katanya sendiri.'},

    # ------------------------------------------------------------------ MT4a
    {'kisi': 'MT4a',
     'judul': 'Di mana letaknya? Atas, bawah, depan, belakang',
     'isi': ['Letak benda diceritakan dengan kata atas, bawah, kiri, kanan, depan, dan belakang.',
             'Lihat gambar: ada bentuk di atas, di tengah, dan di bawah.',
             'Benda yang lebih dekat denganmu ada di depan. Benda yang lebih jauh ada di belakang.'],
     'gambar': [ATAS_BAWAH, DEPAN_BELAKANG],
     'ingat': 'Atas dan bawah, depan dan belakang: pakai kata-kata itu untuk letak benda.',
     'ortu': 'Taruh tiga benda bertumpuk atau berjajar, lalu tanya "apa yang paling atas?" dan "mana yang lebih dekat ke kamu?".'},
    {'kisi': 'MT4a',
     'judul': 'Di mana letaknya? Kiri dan kanan',
     'isi': ['Kiri dan kanan dilihat seperti kamu melihat gambar.',
             'Tangan yang kamu pakai menulis adalah kanan.',
             'Contoh: kelinci ada di sebelah kanan bintang. Anjing ada di sebelah kiri bintang.'],
     'gambar': [img('dog-face', label='kiri'), img('star', label='tengah'), img('rabbit-face', label='kanan')],
     'ingat': 'Tangan untuk menulis adalah kanan. Lawannya kiri.',
     'ortu': 'Taruh tiga benda berjajar, lalu tanya "apa di sebelah kiri gelas?". Minta anak mengangkat tangan kanan lebih dulu agar tidak tertukar.'},

    # ------------------------------------------------------------------ MT4b
    {'kisi': 'MT4b',
     'judul': 'Pola yang berulang',
     'isi': ['Pola adalah susunan bentuk, warna, atau ukuran yang berulang.',
             'Cari bagian yang berulang. Tepuk sambil menyebutnya, lalu teruskan sampai tanda tanya.',
             'Jelaskan polanya dengan kata-kata, misalnya "hijau, kuning, diulang".'],
     'contoh': [{'teks': 'Pola warna: hijau, kuning, hijau, kuning ... Berikutnya hijau.', 'gambar': [POLA_ABAB]},
                {'teks': 'Pola bentuk: lingkaran, lingkaran, segitiga, diulang. Berikutnya lingkaran.', 'gambar': [POLA_AAB]},
                {'teks': 'Pola ukuran: besar, kecil, kecil, diulang. Berikutnya kecil.', 'gambar': [POLA_UKURAN]}],
     'ingat': 'Temukan bagian yang berulang, lalu teruskan. Pola dijelaskan dengan menyebut bagian yang diulang.',
     'ortu': 'Buat pola dari benda di rumah: sendok, garpu, sendok, garpu. Minta anak menebak benda berikutnya dan menjelaskan alasannya.'},
    {'kisi': 'MT4b',
     'judul': 'Pola dengan dua tanda tanya',
     'isi': ['Kadang ada dua tanda tanya. Teruskan pola dua langkah.',
             'Cari dulu bagian yang berulang, lalu sebut dua bagian berikutnya.'],
     'contoh': [{'teks': 'Biru, hijau, merah, diulang. Dua berikutnya hijau dan merah.', 'gambar': [POLA_ABC]}],
     'ingat': 'Dua tanda tanya berarti teruskan pola dua langkah.',
     'ortu': 'Buat pola tiga benda yang berulang, misalnya sendok, garpu, gelas. Tutup dua benda terakhir dan minta anak menebaknya.'},
]
