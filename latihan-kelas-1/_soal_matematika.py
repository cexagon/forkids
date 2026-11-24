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

# ---------- PAKET 1 ----------
paket1 = [
    pg('Ada berapa apel?', '8', ['7', '9'], gambar=[img('red-apple', n=8)],
       bahas='Hitung apel satu per satu sampai 8.', kisi='MT1'),
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

# ---------- PAKET 2 ----------
paket2 = [
    pg('2, 4, 6, 8, ....\nBilangan berikutnya adalah ....', '10', ['9', '7'],
       bahas='Bilangannya loncat 2: 2, 4, 6, 8, 10.', kisi='MT1'),
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

# ---------- PAKET 3 ----------
paket3 = [
    pg('Ada berapa ikan?', '6', ['5', '7'], gambar=[img('fish', n=6)],
       bahas='Hitung ikan satu per satu sampai 6.', kisi='MT1'),
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

PAKET = [paket1, paket2, paket3]
