from _alat import *

# ---------- gambar sendiri ----------
def _apel(x, y, coret=False):
    s = (f'<circle cx="{x}" cy="{y}" r="17" fill="#E5484D" stroke="{INK}" stroke-width="3"/>'
         f'<path d="M{x} {y-17} q2 -8 6 -10" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
         f'<path d="M{x+3} {y-20} q9 -8 14 -1 q-8 5 -14 1z" fill="#5BB04A" stroke="{INK}" stroke-width="2"/>')
    if coret:
        s += line(f'M{x-20} {y-20} L{x+20} {y+20} M{x+20} {y-20} L{x-20} {y+20}', INK, 6)
    return s

def _balon(x, y, coret=False, c='#F5B82E'):
    s = (f'<ellipse cx="{x}" cy="{y}" rx="15" ry="19" fill="{c}" stroke="{INK}" stroke-width="3"/>'
         f'<path d="M{x} {y+19} q-6 12 2 26" fill="none" stroke="{INK}" stroke-width="2"/>')
    if coret:
        s += line(f'M{x-20} {y-22} L{x+20} {y+22} M{x+20} {y-22} L{x-20} {y+22}', INK, 6)
    return s

def coret(n, k, benda=_apel):
    """n benda berjajar (maks 5 per baris), k benda terakhir dicoret."""
    s = ''
    for i in range(n):
        r, c = divmod(i, 5)
        s += benda(32 + c * 52, 34 + r * 62, coret=(i >= n - k))
    rows = (n + 4) // 5
    return svg(s, 280, 20 + rows * 62)

def bentuk(items, w=260, h=150):
    """items: list of ('c'|'t'|'s', x, y, size)"""
    col = {'c': '#E8742A', 't': '#F5B82E', 's': '#7CC6E8'}
    f = {'c': circ, 't': tri, 's': sq}
    return svg(''.join(f[k](x, y, z, col[k]) for k, x, y, z in items), w, h)

def deret(kinds):
    """Satu baris bentuk untuk pilihan jawaban."""
    col = {'c': '#E8742A', 't': '#F5B82E', 's': '#7CC6E8'}
    f = {'c': circ, 't': tri, 's': sq}
    return svg(''.join(f[k](35 + i * 60, 45, 20, col[k]) for i, k in enumerate(kinds)), 60 * len(kinds) + 10, 90)

JAM = svg(circ(70, 70, 55, '#fff') + f'<circle cx="70" cy="70" r="5" fill="{INK}"/>' + line('M70 70 V35', INK, 5) + line('M70 70 H98', INK, 5)
          + ''.join(f'<circle cx="{70+44*math.cos(a*math.pi/6):.1f}" cy="{70+44*math.sin(a*math.pi/6):.1f}" r="3" fill="{INK}"/>' for a in range(12)), 140, 140)
PERSEGI = svg(sq(120, 70, 50, '#7CC6E8'), 240, 140)

# lingkaran 4, segitiga 2, persegi 2
HITUNG_LINGKARAN = bentuk([('c', 35, 40, 22), ('t', 95, 45, 24), ('s', 160, 40, 22), ('c', 220, 42, 20),
                           ('s', 40, 112, 20), ('c', 100, 110, 22), ('t', 160, 112, 22), ('c', 220, 112, 20)])
# persegi 5, lingkaran 2, segitiga 2
HITUNG_PERSEGI = bentuk([('s', 30, 40, 20), ('c', 85, 40, 20), ('s', 140, 40, 20), ('t', 195, 42, 22), ('s', 250, 40, 20),
                         ('t', 30, 112, 22), ('s', 85, 110, 20), ('c', 140, 110, 20), ('s', 195, 110, 20)], 290, 150)

HITUNG_SEGITIGA = bentuk([('t', 35, 42, 22), ('c', 95, 40, 20), ('s', 160, 40, 20), ('t', 220, 42, 22),
                          ('c', 40, 112, 20), ('t', 100, 112, 22), ('s', 160, 110, 20), ('c', 220, 112, 20)])
LINGKARAN = svg(circ(120, 70, 55, '#E8742A'), 240, 140)

# ---------- PAKET 1 ----------
paket1 = [
    pg('Lihat gambar. Mana yang lebih banyak?', 'apel', ['pisang', 'sama banyak'],
       gambar=[img('red-apple', n=7, label='apel'), img('banana', n=4, label='pisang')],
       bahas='Ada 7 apel dan 4 pisang. Apel lebih banyak.', kisi='MT1'),
    pg('Isi dengan tanda yang tepat:  8 ... 5', '>', ['<', '='],
       bahas='8 lebih besar dari 5, jadi tandanya >.', kisi='MT1'),
    pg('Ada berapa bintang semuanya?', '7', ['6', '8'], gambar=[img('star', n=3), {'teks': '+'}, img('star', n=4)],
       bahas='3 bintang ditambah 4 bintang = 7 bintang.', kisi='MT2'),
    pg('Lihat garis bilangan. 2 + 6 = ....', '8', ['7', '9'], gambar=[garis_bilangan(2, 6)],
       bahas='Mulai dari 2, loncat 6 kali ke kanan, sampai di 8.', kisi='MT2'),
    isian('6 + ... = 10', ['4', 'empat'], bahas='6 dan 4 jumlahnya 10.', kisi='MT2'),
    pg('Ada 7 apel. Apel yang dicoret dimakan adik. Sisa apel ada berapa?', '4', ['3', '7'], gambar=[coret(7, 3)],
       bahas='7 apel, 3 dicoret (dimakan), sisa 7 − 3 = 4.', kisi='MT3'),
    pg('Lihat garis bilangan. 9 − 4 = ....', '5', ['6', '4'], gambar=[garis_bilangan(9, -4)],
       bahas='Mulai dari 9, loncat 4 kali ke kiri, sampai di 5.', kisi='MT3'),
    isian('Selisih dua bilangan adalah 3.\n8 − ... = 3', ['5', 'lima'], bahas='8 − 5 = 3, jadi 8 dan 5 selisihnya 3.', kisi='MT3'),
    pg('Bentuk ini adalah ....', 'persegi', ['lingkaran', 'segitiga'], gambar=[PERSEGI],
       bahas='Persegi punya 4 sisi yang sama panjang.', kisi='MT4'),
    isian('Ada berapa lingkaran pada gambar?', ['4', 'empat'], gambar=[HITUNG_LINGKARAN],
          bahas='Ada 4 lingkaran (oranye); segitiga dan persegi tidak dihitung.', kisi='MT4'),
]

paket1 += [
    pg('Lanjutkan bilangan ini:  3, 4, 5, ....', '6', ['7', '2'], bahas='Setelah 5 adalah 6.', kisi='MT1'),
    pg('Ada berapa ekor ikan pada gambar?', '6', ['5', '7'], gambar=[img('fish', n=6)], bahas='Ada 6 ikan.', kisi='MT1'),
    pg('Ibu punya 5 telur. Ibu membeli 4 telur lagi. Telur Ibu jadi ....', '9', ['8', '10'], bahas='5 + 4 = 9.', kisi='MT2'),
    pg('Lihat garis bilangan. 5 + 3 = ....', '8', ['7', '9'], gambar=[garis_bilangan(5, 3)],
       bahas='Mulai dari 5, loncat 3 kali ke kanan, sampai di 8.', kisi='MT2'),
    isian('Dua bilangan jumlahnya 10.\n7 + ... = 10', ['3', 'tiga'], bahas='7 dan 3 jumlahnya 10.', kisi='MT2'),
    pg('Ada 9 permen. Dina memakan 6 permen. Sisa permen ada ....', '3', ['4', '2'], bahas='9 − 6 = 3.', kisi='MT3'),
    pg('Dua bilangan selisihnya 3. Pasangan bilangan yang cocok adalah ....', '10 dan 7', ['10 dan 6', '8 dan 6'],
       bahas='10 − 7 = 3. (10 − 6 = 4, 8 − 6 = 2.)', kisi='MT3'),
    isian('Ada 10 kue. Adik makan 6 kue. Sisa kue ada berapa?', ['4', 'empat'], bahas='10 − 6 = 4.', kisi='MT3'),
    pg('Kelompok mana yang semuanya segitiga?', deret('ttt'), [deret('tcs'), deret('tts')],
       bahas='Kelompok yang benar hanya berisi segitiga.', kisi='MT4'),
    pg('Roda sepeda bentuknya ....', 'lingkaran', ['persegi', 'segitiga'], gambar=[img('bicycle', label='sepeda')],
       bahas='Roda sepeda berbentuk lingkaran.', kisi='MT4'),
]

# ---------- PAKET 2 ----------
paket2 = [
    pg('Lihat gambar. Banyak bebek dan banyak ikan ....', 'sama banyak', ['bebek lebih banyak', 'ikan lebih banyak'],
       gambar=[img('duck', n=5, label='bebek'), img('fish', n=5, label='ikan')],
       bahas='Ada 5 bebek dan 5 ikan. Banyaknya sama.', kisi='MT1'),
    pg('Tanda yang tepat untuk  7 ... 7  adalah ....', '=', ['<', '>'],
       bahas='7 sama dengan 7, jadi tandanya =.', kisi='MT1'),
    pg('Dina punya 4 balon. Ibu memberi 3 balon lagi. Balon Dina sekarang ada ....', '7', ['6', '8'],
       bahas='4 + 3 = 7.', kisi='MT2'),
    pg('Pasangan bilangan yang jumlahnya 10 adalah ....', '3 dan 7', ['4 dan 5', '2 dan 6'],
       bahas='3 + 7 = 10. (4 + 5 = 9, 2 + 6 = 8.)', kisi='MT2'),
    isian('Berapa bebek semuanya?', ['9', 'sembilan'], gambar=[img('duck', n=5), {'teks': '+'}, img('duck', n=4)],
          bahas='5 bebek + 4 bebek = 9 bebek.', kisi='MT2'),
    pg('Ada 8 burung di pohon. 3 burung terbang. Burung yang tinggal ada ....', '5', ['4', '11'],
       gambar=[img('bird', n=8)], bahas='8 − 3 = 5.', kisi='MT3'),
    pg('Pasangan bilangan yang selisihnya 3 adalah ....', '9 dan 6', ['9 dan 5', '7 dan 5'],
       bahas='9 − 6 = 3. (9 − 5 = 4, 7 − 5 = 2.)', kisi='MT3'),
    isian('Ada 6 balon. Balon yang dicoret meletus. Sisa balon ada berapa?', ['4', 'empat'], gambar=[coret(6, 2, _balon)],
          bahas='6 balon, 2 dicoret (meletus), sisa 6 − 2 = 4.', kisi='MT3'),
    pg('Benda yang bentuknya sama dengan koin adalah ....', 'jam dinding', ['buku', 'penggaris segitiga'],
       gambar=[img('coin', label='koin')], bahas='Koin dan jam dinding sama-sama berbentuk lingkaran.', kisi='MT4'),
    isian('Ada berapa persegi pada gambar?', ['5', 'lima'], gambar=[HITUNG_PERSEGI],
          bahas='Ada 5 persegi (biru).', kisi='MT4'),
]

paket2 += [
    pg('Pilih tanda yang tepat:  3 ... 9', '<', ['>', '='], bahas='3 lebih kecil dari 9, jadi tandanya <.', kisi='MT1'),
    pg('Ada berapa ekor kupu-kupu pada gambar?', '8', ['7', '9'], gambar=[img('butterfly', n=8)], bahas='Ada 8 kupu-kupu.', kisi='MT1'),
    pg('Perhatikan garis bilangan. 3 + 5 = ....', '8', ['7', '9'], gambar=[garis_bilangan(3, 5)],
       bahas='Mulai dari 3, loncat 5 kali ke kanan, sampai di 8.', kisi='MT2'),
    pg('Ali punya 2 kelereng. Lalu ia mendapat 6 kelereng lagi. Kelereng Ali sekarang ada ....', '8', ['4', '7'], bahas='2 + 6 = 8.', kisi='MT2'),
    isian('Dua bilangan jumlahnya 10.\n1 + ... = 10', ['9', 'sembilan'], bahas='1 dan 9 jumlahnya 10.', kisi='MT2'),
    pg('Perhatikan garis bilangan. 9 − 5 = ....', '4', ['5', '3'], gambar=[garis_bilangan(9, -5)],
       bahas='Mulai dari 9, loncat 5 kali ke kiri, sampai di 4.', kisi='MT3'),
    pg('Ada 7 ikan di kolam. Lalu 2 ikan dipindahkan ke ember. Ikan di kolam tinggal ....', '5', ['4', '9'], bahas='7 − 2 = 5.', kisi='MT3'),
    isian('Selisih dua bilangan adalah 3.\n6 − ... = 3', ['3', 'tiga'], bahas='6 − 3 = 3, jadi 6 dan 3 selisihnya 3.', kisi='MT3'),
    pg('Bentuk pada gambar ini adalah ....', 'segitiga', ['persegi', 'lingkaran'], gambar=[SEGITIGA], bahas='Segitiga punya 3 sisi.', kisi='MT4'),
    pg('Kelompok mana yang semuanya persegi?', deret('sss'), [deret('scs'), deret('sst')],
       bahas='Kelompok yang benar hanya berisi persegi.', kisi='MT4'),
]

# ---------- PAKET 3 ----------
paket3 = [
    pg('Lihat gambar. Mana yang lebih sedikit?', 'balon', ['bintang', 'sama banyak'],
       gambar=[img('balloon', n=3, label='balon'), img('star', n=6, label='bintang')],
       bahas='Ada 3 balon dan 6 bintang. Balon lebih sedikit.', kisi='MT1'),
    pg('Urutan bilangan dari yang terkecil adalah ....', '2, 5, 9', ['9, 5, 2', '5, 2, 9'],
       bahas='Dari terkecil: 2, lalu 5, lalu 9.', kisi='MT1'),
    pg('Lihat garis bilangan. 1 + 6 = ....', '7', ['6', '8'], gambar=[garis_bilangan(1, 6)],
       bahas='Mulai dari 1, loncat 6 kali ke kanan, sampai di 7.', kisi='MT2'),
    pg('Raka punya 5 ikan. Ayah membeli 3 ikan lagi. Ikan Raka sekarang ada ....', '8', ['7', '2'],
       bahas='5 + 3 = 8.', kisi='MT2'),
    isian('... + 2 = 10', ['8', 'delapan'], bahas='8 dan 2 jumlahnya 10.', kisi='MT2'),
    pg('Lihat garis bilangan. 10 − 3 = ....', '7', ['6', '8'], gambar=[garis_bilangan(10, -3)],
       bahas='Mulai dari 10, loncat 3 kali ke kiri, sampai di 7.', kisi='MT3'),
    pg('Ada 9 apel. Apel yang dicoret sudah dimakan. Sisa apel ada berapa?', '4', ['5', '3'], gambar=[coret(9, 5)],
       bahas='9 apel, 5 dicoret, sisa 9 − 5 = 4.', kisi='MT3'),
    isian('Selisih dua bilangan adalah 3.\n... − 4 = 3', ['7', 'tujuh'], bahas='7 − 4 = 3, jadi 7 dan 4 selisihnya 3.', kisi='MT3'),
    pg('Benda yang berbentuk segitiga adalah ....', img('triangular-ruler', label='penggaris segitiga'),
       [img('coin', label='koin'), img('green-book', label='buku')],
       bahas='Penggaris segitiga punya 3 sisi.', kisi='MT4'),
    pg('Kelompok mana yang semuanya lingkaran?', deret('ccc'), [deret('cts'), deret('cct')],
       bahas='Kelompok yang benar hanya berisi lingkaran.', kisi='MT4'),
]

paket3 += [
    pg('Bilangan yang lebih kecil dari 4 adalah ....', '3', ['5', '4'], bahas='3 lebih kecil dari 4. 5 dan 4 tidak lebih kecil dari 4.', kisi='MT1'),
    pg('Bilangan berikutnya:  7, 8, 9, ....', '10', ['6', '8'], bahas='Setelah 9 adalah 10.', kisi='MT1'),
    pg('Dua bilangan jumlahnya 10. Pasangan dari 6 adalah ....', '4', ['5', '3'], bahas='6 + 4 = 10.', kisi='MT2'),
    pg('Ada 3 kucing di rumah. Lalu datang 4 kucing lagi. Kucing di rumah sekarang ada ....', '7', ['6', '8'], bahas='3 + 4 = 7.', kisi='MT2'),
    isian('Ada berapa anjing semuanya?', ['9', 'sembilan'], gambar=[img('dog-face', n=4), {'teks': '+'}, img('dog-face', n=5)],
          bahas='4 anjing + 5 anjing = 9 anjing.', kisi='MT2'),
    pg('Sinta punya 8 kelereng. Ia memberikan 5 kelereng kepada adik. Kelereng Sinta tinggal ....', '3', ['4', '2'], bahas='8 − 5 = 3.', kisi='MT3'),
    pg('Perhatikan garis bilangan. 7 − 2 = ....', '5', ['4', '6'], gambar=[garis_bilangan(7, -2)],
       bahas='Mulai dari 7, loncat 2 kali ke kiri, sampai di 5.', kisi='MT3'),
    isian('Selisih dua bilangan adalah 3.\n9 − ... = 3', ['6', 'enam'], bahas='9 − 6 = 3, jadi 9 dan 6 selisihnya 3.', kisi='MT3'),
    pg('Gambar di bawah ini berbentuk ....', 'lingkaran', ['persegi', 'segitiga'], gambar=[LINGKARAN], bahas='Lingkaran tidak punya sudut.', kisi='MT4'),
    isian('Ada berapa segitiga pada gambar?', ['3', 'tiga'], gambar=[HITUNG_SEGITIGA], bahas='Ada 3 segitiga (kuning).', kisi='MT4'),
]

def _urut(p):
    jn = {'pg': 0, 'bs': 1, 'isian': 2, 'uraian': 3}
    return sorted(p, key=lambda q: (jn[q['jenis']], q['kisi']))

PAKET = [_urut(paket1), _urut(paket2), _urut(paket3)]

# Seimbangkan letak kunci PG (a/b/c) agar tidak berpola: pindahkan jawaban benar soal-soal ini ke huruf tertentu.
def _geser(p, awal, huruf):
    k = 'abc'.index(huruf)
    for q in p:
        if q['jenis'] == 'pg' and q['tanya'].startswith(awal):
            j = q['jawab']; q['pilihan'][j], q['pilihan'][k] = q['pilihan'][k], q['pilihan'][j]; q['jawab'] = k
            return
    raise KeyError(awal)
_geser(PAKET[0], 'Ada 9 permen', 'a')
_geser(PAKET[0], 'Dua bilangan selisihnya 3', 'c')
