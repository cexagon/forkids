from _alat import *

# =====================================================================
# Matematika kelas 2 - ASAS ganjil. 3 paket x (10 PG, 9 isian, 5 uraian) = 24 butir sesuai kisi-kisi.
# Semua angka hitungan diperiksa dengan assert di bagian "verifikasi" (bawah file).
# =====================================================================

# ---------- palet & alat gambar ----------
BIRU = ('#7CC6E8', '#B5E1F4', '#4E9FCB')
ORA = ('#F29A52', '#F8C197', '#D57A2E')
KUN = ('#F5B82E', '#FBD97E', '#D49A12')
HIJ = ('#7BC96F', '#B5E3AB', '#4FA042')
MER = ('#E5484D', '#F2999C', '#BF2A30')
W = {'merah': '#E5484D', 'kuning': '#F5B82E', 'biru': '#4A90E2', 'hijau': '#5BB04A'}
BC = {'c': '#E8742A', 't': '#F5B82E', 's': '#7CC6E8', 'r': '#7BC96F'}


def poly(pts, fill, sw=4):
    p = ' '.join(f'{x},{y}' for x, y in pts)
    return f'<polygon points="{p}" fill="{fill}" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"/>'


def putus(d, sw=2.5):
    return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{sw}" stroke-dasharray="6 5" stroke-linecap="round"/>'


def rr(x, y, w, h, c, sw=4):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{c}" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"/>'


def kotak(x, y, w, h, d, pal):
    """Balok/kubus: muka depan (x,y,w,h), kedalaman d ke kanan-atas. Rusuk tersembunyi putus-putus."""
    s = poly([(x, y), (x + d, y - d), (x + w + d, y - d), (x + w, y)], pal[1])
    s += poly([(x + w, y), (x + w + d, y - d), (x + w + d, y + h - d), (x + w, y + h)], pal[2])
    s += rr(x, y, w, h, pal[0])
    s += putus(f'M{x} {y+h} L{x+d} {y+h-d} L{x+d} {y-d} M{x+d} {y+h-d} L{x+w+d} {y+h-d}')
    return s


def tabung(cx, yt, rx, ry, h, pal):
    s = (f'<path d="M{cx-rx} {yt} V{yt+h} A{rx} {ry} 0 0 0 {cx+rx} {yt+h} V{yt} Z" fill="{pal[0]}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>')
    s += f'<ellipse cx="{cx}" cy="{yt}" rx="{rx}" ry="{ry}" fill="{pal[1]}" stroke="{INK}" stroke-width="4"/>'
    return s


def kerucut(cx, ya, yb, rx, ry, pal):
    s = putus(f'M{cx-rx} {yb} A{rx} {ry} 0 0 1 {cx+rx} {yb}')
    s += (f'<path d="M{cx-rx} {yb} A{rx} {ry} 0 0 0 {cx+rx} {yb} L{cx} {ya} Z" fill="{pal[0]}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>')
    return s


def bola(cx, cy, r, pal):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{pal[0]}" stroke="{INK}" stroke-width="4"/>'
            f'<ellipse cx="{cx-r*0.35:.1f}" cy="{cy-r*0.4:.1f}" rx="{r*0.22:.1f}" ry="{r*0.14:.1f}" fill="#fff" opacity="0.6" transform="rotate(-35 {cx-r*0.35:.1f} {cy-r*0.4:.1f})"/>')


def prisma(x, y, w, h, d, pal):
    """Prisma segitiga rebah: segitiga depan, sisi miring kanan, rusuk tersembunyi putus-putus."""
    A, B, C = (x, y + h), (x + w, y + h), (x + w / 2, y)
    A2, B2, C2 = (A[0] + d, A[1] - d), (B[0] + d, B[1] - d), (C[0] + d, C[1] - d)
    s = poly([C, B, B2, C2], pal[2])
    s += poly([A, B, C], pal[0])
    s += putus(f'M{A[0]} {A[1]} L{A2[0]} {A2[1]} L{B2[0]} {B2[1]} M{A2[0]} {A2[1]} L{C2[0]} {C2[1]}')
    return s


def shp(k, x, y, r, c=None):
    c = c or BC[k]
    if k == 'c': return circ(x, y, r, c)
    if k == 't': return tri(x, y, r, c)
    if k == 's': return sq(x, y, r, c)
    if k == 'r': return rr(x - r * 1.5, y - r * 0.8, r * 3, r * 1.6, c)


def kotak_tanya(x, y, r=16):
    return (f'<rect x="{x-r-3}" y="{y-r-3}" width="{2*r+6}" height="{2*r+6}" rx="10" fill="#fff" stroke="{INK}" stroke-width="4" stroke-dasharray="8 6"/>'
            f'<text x="{x}" y="{y+9}" text-anchor="middle" font-size="26" font-weight="800" fill="{INK}" font-family="sans-serif">?</text>')


def deretan(seq, q=1, r=16, gap=46):
    """seq: list (bentuk, warna|None). q = jumlah kotak tanya di ujung."""
    n = len(seq) + q
    s = ''
    for i, (k, c) in enumerate(seq):
        s += shp(k, 30 + i * gap, 45, r, c)
    for j in range(q):
        s += kotak_tanya(30 + (len(seq) + j) * gap, 45, r)
    return svg(s, gap * n + 14, 90)


def opsi(body):
    return svg(body, 100, 100)


# ---------- gambar bangun ruang ----------
KUBUS = svg(kotak(48, 52, 70, 70, 32, BIRU), 200, 150)
BALOK = svg(kotak(28, 62, 112, 52, 30, ORA), 200, 150)
TABUNG = svg(tabung(100, 38, 46, 15, 76, KUN), 200, 150)
KERUCUT = svg(kerucut(100, 18, 112, 46, 15, HIJ), 200, 150)
PRISMA = svg(prisma(30, 52, 92, 70, 40, MER), 200, 150)

O_KUBUS = opsi(kotak(22, 38, 44, 44, 20, BIRU))
O_BOLA = opsi(bola(50, 50, 33, MER))
O_KERUCUT = opsi(kerucut(50, 12, 78, 30, 10, HIJ))
O_TABUNG = opsi(tabung(50, 28, 28, 10, 44, KUN))

# ---------- gambar bangun datar ----------
PERSEGI_BIRU = svg(sq(120, 75, 50, BC['s']), 240, 150)
PERSEGI_PANJANG_G = svg(rr(40, 38, 160, 74, BC['r']), 240, 150)

O_LINGKARAN = opsi(circ(50, 50, 34, BC['c']))
O_PERSEGI = opsi(sq(50, 50, 30, BC['s']))
O_SEGITIGA = opsi(tri(50, 46, 34, BC['t']))
O_PERSEGI_PANJANG = opsi(rr(10, 28, 80, 44, BC['r']))

# ---------- gambar mengurai/menyusun ----------
BAGI_DUA = svg(rr(30, 32, 180, 90, '#B5E1F4') + putus('M120 32 V122', 4), 240, 150)
DUA_PERSEGI = svg(sq(65, 75, 40, BC['s']) + sq(175, 75, 40, BC['s']), 240, 150)
PERSEGI_DIAG = svg(
    poly([(60, 15), (180, 15), (120, 75)], '#F8C197') + poly([(180, 15), (180, 135), (120, 75)], '#B5E1F4')
    + poly([(180, 135), (60, 135), (120, 75)], '#FBD97E') + poly([(60, 135), (60, 15), (120, 75)], '#B5E3AB'), 240, 150)
DUA_SEGITIGA = svg(
    poly([(25, 115), (105, 115), (25, 35)], BC['t']) + poly([(135, 115), (215, 115), (135, 35)], BC['c'])
    + f'<path d="M25 99 H41 V115" fill="none" stroke="{INK}" stroke-width="3"/><path d="M135 99 H151 V115" fill="none" stroke="{INK}" stroke-width="3"/>', 240, 150)
PP_DIAG = svg(rr(30, 30, 180, 90, '#B5E1F4') + putus('M30 30 L210 120', 4), 240, 150)
EMPAT_PERSEGI = svg(''.join(sq(40 + 62 * i, 45, 22, BC['s']) for i in range(4)), 260, 90)

# ---------- segi banyak vs lengkung ----------
KUMPUL_1 = svg(shp('t', 45, 48, 24) + shp('c', 120, 45, 24) + shp('s', 200, 50, 22) + shp('r', 48, 115, 18)
               + shp('c', 130, 112, 20) + shp('t', 210, 112, 22), 255, 150)
KUMPUL_3 = svg(shp('s', 45, 48, 22) + shp('c', 115, 45, 24) + shp('t', 195, 50, 24) + shp('c', 55, 112, 20)
               + shp('r', 135, 115, 18) + shp('c', 210, 112, 22), 255, 150)

# ---------- posisi benda ----------
MEJA = svg('<line x1="15" y1="134" x2="225" y2="134" stroke="#3d2b1f" stroke-width="4" stroke-linecap="round"/>'
           + rr(50, 84, 140, 12, '#C98B55') + rr(58, 96, 10, 38, '#C98B55') + rr(172, 96, 10, 38, '#C98B55')
           + sq(120, 118, 14, BC['s']) + circ(120, 64, 20, W['merah']), 240, 150)
DEPAN = svg(poly([(25, 98), (215, 98), (232, 142), (8, 142)], '#EFE3C8', 3) + kotak(86, 52, 46, 46, 18, ORA)
            + '<ellipse cx="120" cy="137" rx="24" ry="5" fill="#3d2b1f" opacity="0.2"/>' + circ(120, 112, 24, W['merah']), 240, 150)
BARIS = svg(sq(55, 75, 26, BC['s']) + circ(125, 75, 26, BC['c']) + tri(195, 75, 28, BC['t']), 250, 150)

# ---------- pola ----------
POLA1 = deretan([('s', None), ('s', None), ('c', None), ('s', None), ('s', None), ('c', None), ('s', None)])
POLA2 = deretan([('c', W[x]) for x in ['merah', 'kuning', 'biru', 'merah', 'kuning', 'biru', 'merah']])
POLA3 = deretan([('t', None), ('c', None), ('c', None), ('t', None), ('c', None), ('c', None), ('t', None)])
POLA4 = deretan([('c', W[x]) for x in ['merah', 'merah', 'biru', 'merah', 'merah', 'biru', 'merah']])
POLA5 = deretan([(k, None) for k in 'tcstcstc'], q=2)
POLA6 = deretan([('c', W[x]) for x in ['merah', 'kuning', 'kuning', 'merah', 'kuning', 'kuning', 'merah']], q=2)

O_S = opsi(sq(50, 50, 30, BC['s']))
O_C = opsi(circ(50, 50, 34, BC['c']))
O_T = opsi(tri(50, 46, 34, BC['t']))
O_S2 = opsi(sq(50, 50, 30, BC['c']))

# =====================================================================
# PAKET 1
# =====================================================================
paket1 = [
    # ---- PG ----
    pg('Bandingkan 37 dan 29. Pernyataan yang benar adalah ....', '37 > 29', ['37 < 29', '37 = 29', '29 > 37'],
       bahas='37 punya 3 puluhan, 29 hanya 2 puluhan, jadi 37 lebih besar dari 29: 37 > 29.', kisi='MT1a',
       konteks='Untuk membandingkan bilangan, lihat puluhannya dulu: yang puluhannya lebih banyak berarti lebih besar. '
               'Tanda < dan > seperti mulut buaya yang selalu terbuka ke bilangan yang lebih besar. '
               'Ajak anak menaruh 37 lidi di satu sisi dan 29 lidi di sisi lain, lalu tanya sisi mana yang lebih banyak.'),
    pg('Nama bangun ruang pada gambar ini adalah ....', 'kubus', ['balok', 'tabung', 'bola'], gambar=[KUBUS],
       bahas='Semua sisi kubus berbentuk persegi yang sama besar, seperti dadu.', kisi='MT3a',
       konteks='Bangun ruang itu bangun yang punya isi dan bisa dipegang, seperti dadu, kotak, atau kaleng. '
               'Kubus seperti dadu atau kotak kado: semua sisinya persegi yang sama besar. '
               'Beda dengan balok yang seperti kotak sepatu. Ajak anak mencari benda di rumah yang bentuknya seperti gambar.'),
    pg('Balok pada gambar punya berapa titik sudut (pojok)?', '8', ['6', '12', '10'], gambar=[BALOK],
       bahas='Balok punya 8 titik sudut, 6 sisi, dan 12 rusuk.', kisi='MT3b',
       konteks='Titik sudut adalah pojok tempat beberapa rusuk bertemu. '
               'Ajak anak memegang kotak sepatu atau kotak kue, lalu menyentuh pojoknya satu per satu sambil berhitung. '
               'Ingatkan agar pojok di bagian bawah dan belakang tidak terlewat (di gambar ditunjukkan garis putus-putus).'),
    pg('Persegi panjang pada gambar dipotong sepanjang garis putus-putus. Potongannya menjadi ....', '2 persegi',
       ['2 segitiga', '2 lingkaran', '4 persegi'], gambar=[BAGI_DUA],
       bahas='Persegi panjang itu dipotong tepat di tengah. Tiap potongan punya 4 sisi yang sama panjang, yaitu persegi.', kisi='MT3d',
       konteks='Bangun datar bisa dipotong menjadi bangun lain atau disatukan menjadi bangun baru. '
               'Ajak anak menggunting selembar kertas berbentuk persegi panjang menurut garis tengahnya. '
               'Lalu minta ia memeriksa tiap potongan: berapa sisinya dan apakah semua sisinya sama panjang?'),
    pg('Bola merah berada di ... meja.', 'atas', ['bawah', 'kiri', 'kanan'], gambar=[MEJA],
       bahas='Bola merah ada di permukaan meja, jadi letaknya di atas meja. Kotak biru ada di bawah meja.', kisi='MT4a',
       konteks='Posisi benda diceritakan dengan kata atas, bawah, kiri, kanan, depan, dan belakang. '
               'Letakkan bola di atas meja sungguhan, lalu di bawahnya, dan minta anak menceritakan setiap posisi. '
               'Pada gambar, perhatikan bola berada pada bagian meja yang mana.'),
    pg('Bentuk yang tepat pada tanda ? adalah ....', O_S, [O_C, O_T, O_S2], gambar=[POLA1],
       bahas='Polanya: persegi, persegi, lingkaran, diulang terus. Setelah 1 persegi berikutnya persegi lagi.', kisi='MT4b',
       konteks='Pola bukan bilangan adalah susunan bentuk atau warna yang berulang. '
               'Minta anak membaca polanya sambil bertepuk, misalnya "kotak, kotak, bulat", untuk menemukan bagian yang diulang. '
               'Lalu lanjutkan bacaan itu sampai ke tanda tanya, dan perhatikan juga warnanya.'),

    # ---- ISIAN ----
    isian('Pada bilangan 34, angka 3 berada di tempat ....', ['puluhan', 'puluh', 'tempat puluhan', 'di puluhan'],
          bahas='34 = 3 puluhan + 4 satuan. Angka 3 ada di tempat puluhan.', kisi='MT1b',
          konteks='Nilai tempat artinya posisi angka menentukan nilainya. Angka di kiri adalah puluhan (ikatan isi sepuluh), '
                  'angka di kanan adalah satuan (yang lepas). Ajak anak mengikat sedotan atau lidi per sepuluh, '
                  'lalu tanyakan: angka 3 pada 34 menunjukkan ikatan atau yang lepas?'),
    isian('Bangun ruang pada gambar bernama ....', ['tabung'], gambar=[TABUNG],
          bahas='Tabung punya alas dan atas berbentuk lingkaran, seperti kaleng susu.', kisi='MT3a',
          konteks='Tabung punya dua sisi datar berbentuk lingkaran (atas dan bawah) dan satu sisi melengkung di sekelilingnya. '
                  'Ajak anak mencari benda di dapur yang bentuknya begitu, misalnya kaleng atau gelas. '
                  'Bedakan dengan bola yang bulat penuh.'),
    isian('Nama bangun datar pada gambar adalah ....', ['persegi panjang', 'persegipanjang', 'persegi-panjang'], gambar=[PERSEGI_PANJANG_G],
          bahas='Persegi panjang punya 4 sisi: 2 sisi panjang dan 2 sisi pendek.', kisi='MT3a',
          konteks='Bangun datar itu pipih, seperti gambar di kertas. Persegi panjang punya 4 sisi dan 4 pojok siku-siku, '
                  'tetapi dua sisinya lebih panjang daripada dua sisi lainnya, seperti pintu atau buku tulis. '
                  'Bedakan dengan persegi yang keempat sisinya sama panjang.'),
    isian('Kubus mempunyai ... sisi.', ['6', 'enam'],
          bahas='Sisi kubus ada 6, seperti 6 permukaan dadu: atas, bawah, dan 4 sisi samping.', kisi='MT3b',
          konteks='Sisi kubus adalah bidang datar yang membatasi kubus, seperti permukaan dadu. '
                  'Ajak anak memegang dadu atau kotak kado, lalu menghitung permukaannya satu per satu '
                  'sambil menyebut: atas, bawah, dan sisi-sisi samping.'),
    isian('Ada berapa bangun yang sisinya lurus (segi banyak) pada gambar?', ['4', 'empat'], gambar=[KUMPUL_1],
          bahas='Yang sisinya lurus: 2 segitiga, 1 persegi, 1 persegi panjang = 4. Lingkaran (2 buah) sisinya lengkung.', kisi='MT3c',
          konteks='Segi banyak adalah bangun datar yang sisinya garis lurus dan punya pojok, misalnya segitiga dan persegi. '
                  'Bangun lengkung sisinya melengkung mulus tanpa pojok, misalnya lingkaran. '
                  'Minta anak menelusuri tepi tiap bangun dengan jari, lalu hitung hanya yang tepinya lurus.'),
    isian('Bangun datar di sebelah kanan lingkaran adalah ....', ['segitiga'], gambar=[BARIS],
          bahas='Dari kiri ke kanan: persegi, lingkaran, segitiga. Di sebelah kanan lingkaran ada segitiga.', kisi='MT4a',
          konteks='Kiri dan kanan dilihat dari sisi si pembaca gambar: tangan kanan anak (yang dipakai menulis) berada di sisi kanan. '
                  'Ajak anak mengangkat tangan kanannya, lalu menggeser jari ke arah itu mulai dari lingkaran pada gambar.'),

    # ---- URAIAN ----
    uraian('Ibu punya 27 butir telur. Ayah membeli 15 butir telur lagi.\nBerapa butir telur Ibu sekarang? Tulis cara bersusun dan hasilnya.',
           '27 + 15 = 42. Satuan: 7 + 5 = 12, tulis 2 dan simpan 1 puluhan. Puluhan: 2 + 1 + 1 simpanan = 4. Jadi telur Ibu sekarang 42 butir.',
           [['42']], minimal=1,
           bahas='7 + 5 = 12 (tulis 2, simpan 1). 2 + 1 + 1 = 4. Hasilnya 42.', kisi='MT2a',
           konteks='Menyimpan dipakai bila satuan dijumlahkan hasilnya 10 atau lebih: satu puluhan "disimpan" ke kolom puluhan. '
                   'Contoh 18 + 5: satuan 8 + 5 = 13, tulis 3 dan simpan 1 puluhan. '
                   'Peragakan dengan sedotan: 10 sedotan lepas diikat jadi 1 ikat lalu dipindahkan ke kolom puluhan. '
                   'Minta anak menulis angka bersusun, satuan di bawah satuan.'),
    uraian('Di dalam toples ada 41 permen. Kakak makan 17 permen.\nBerapa permen yang tersisa? Tulis cara bersusun dan hasilnya.',
           '41 - 17 = 24. Satuan 1 tidak cukup dikurangi 7, jadi pinjam 1 puluhan: 11 - 7 = 4. Puluhan tinggal 3, 3 - 1 = 2. Sisa permen 24 buah.',
           [['24']], minimal=1,
           bahas='Pinjam 1 puluhan: 11 - 7 = 4. Puluhan tinggal 3, 3 - 1 = 2. Hasilnya 24.', kisi='MT2b',
           konteks='Meminjam dipakai bila angka satuan di atas lebih kecil daripada angka satuan yang dikurangkan. '
                   'Kita pinjam 1 puluhan dari kolom puluhan, yang berubah menjadi 10 satuan. '
                   'Contoh 32 - 5: satuan 2 tidak cukup, pinjam 1 puluhan jadi 12 - 5 = 7, lalu puluhan tinggal 2. '
                   'Peragakan dengan uang mainan: tukar 1 lembar sepuluhan menjadi 10 koin satuan.'),
    uraian('Gambar menunjukkan dua segitiga yang sama besar. Bagaimana cara menyusun keduanya menjadi satu persegi? Tulis dengan kata-katamu.',
           'Tempelkan kedua segitiga pada sisi miringnya (sisi yang paling panjang), maka terbentuk sebuah persegi.',
           [['miring', 'diagonal', 'terpanjang', 'paling panjang', 'sisi panjang'],
            ['tempel', 'gabung', 'satukan', 'disatukan', 'menyatukan', 'sambung', 'rapatkan', 'dempet', 'pasang', 'susun', 'hadapkan', 'balik']],
           minimal=2, gambar=[DUA_SEGITIGA],
           bahas='Dua segitiga siku-siku yang sama besar, jika sisi miringnya ditempelkan, membentuk persegi.', kisi='MT3d',
           konteks='Dua bangun datar bisa disusun menjadi bangun baru. Beri anak dua segitiga dari kertas (gunting persegi menurut garis pojok ke pojok). '
                   'Minta ia mencoba menempelkan sisi-sisi yang berbeda dan melihat hasilnya. '
                   'Tanyakan: sisi mana yang membuat bentuknya menjadi persegi? Terima jawaban dengan kata-kata anak sendiri.'),
]

# =====================================================================
# PAKET 2
# =====================================================================
paket2 = [
    pg('Bilangan yang lebih besar daripada 38 adalah ....', '41', ['36', '29', '38'],
       bahas='41 punya 4 puluhan, lebih banyak dari 3 puluhan pada 38. Jadi 41 > 38.', kisi='MT1a',
       konteks='Lebih besar dari 38 artinya lebih banyak dari 38. Bandingkan puluhannya dulu; bila puluhannya sama, baru bandingkan satuannya. '
               'Ajak anak menaruh 38 kancing, lalu cek tiap pilihan: apakah kancingnya lebih banyak, lebih sedikit, atau sama?'),
    pg('Gambar yang berbentuk bola adalah ....', O_BOLA, [O_KUBUS, O_KERUCUT, O_TABUNG],
       bahas='Bola bulat penuh, tidak punya pojok dan tidak punya sisi datar.', kisi='MT3a',
       konteks='Bola bulat penuh seperti bola sepak: tidak punya pojok dan tidak punya sisi datar. '
               'Tunjukkan pada anak beberapa benda (bola, dadu, kaleng, topi ulang tahun), lalu tanya mana yang bisa menggelinding ke segala arah. '
               'Minta ia mencocokkan benda-benda itu dengan gambar.'),
    pg('Bangun datar yang sisinya lengkung adalah ....', O_LINGKARAN, [O_PERSEGI, O_SEGITIGA, O_PERSEGI_PANJANG],
       bahas='Lingkaran tidak punya pojok dan sisinya melengkung. Bangun lain sisinya lurus (segi banyak).', kisi='MT3c',
       konteks='Bangun datar ada yang tepinya lurus dan punya pojok (segi banyak), ada yang tepinya melengkung mulus (lengkung). '
               'Ajak anak menelusuri tepi tiap gambar dengan jari: mana yang licin tanpa pojok sama sekali? '
               'Bisa juga dicari di rumah, misalnya tutup toples dan piring.'),
    pg('Dua persegi yang sama besar ditempelkan pada satu sisinya. Bangun baru yang terbentuk adalah ....', 'persegi panjang',
       ['segitiga', 'lingkaran', 'persegi'], gambar=[DUA_PERSEGI],
       bahas='Dua persegi yang ditempel memanjang menjadi persegi panjang: sisi panjangnya dua kali sisi pendeknya.', kisi='MT3d',
       konteks='Menyusun bangun datar artinya menggabungkan beberapa bangun menjadi bangun baru. '
               'Beri anak dua kartu persegi yang sama besar dan minta ia menempelkan sisinya rapat. '
               'Lalu tanyakan: apakah keempat sisi bentuk barunya masih sama panjang? Bandingkan dengan pintu atau buku tulis.'),
    pg('Pada gambar ini, bola berada di ... kotak.', 'depan', ['belakang', 'atas', 'bawah'], gambar=[DEPAN],
       bahas='Bola lebih dekat dengan kita daripada kotak, jadi bola ada di depan kotak.', kisi='MT4a',
       konteks='Depan berarti lebih dekat ke kita yang melihat, belakang berarti lebih jauh. '
               'Atur dua benda di meja: satu dekat anak dan satu agak jauh, lalu minta anak menceritakan letaknya. '
               'Pada gambar, perhatikan benda mana yang lebih dekat (letaknya lebih ke bawah di lantai dan menutupi sebagian benda lain).'),
    pg('Warna bola yang cocok pada tanda ? adalah ....', 'kuning', ['merah', 'biru', 'hijau'], gambar=[POLA2],
       bahas='Polanya merah, kuning, biru, diulang terus. Setelah merah, warna berikutnya kuning.', kisi='MT4b',
       konteks='Pola bukan bilangan bisa berupa urutan warna yang berulang. '
               'Minta anak menyebutkan warna dari kiri ke kanan dan mencari kelompok warna yang berulang. '
               'Lalu lanjutkan menyebut kelompok itu sampai tiba di tanda tanya.'),

    isian('36 = 30 + ....', ['6', 'enam'],
          bahas='36 terdiri dari 3 puluhan (30) dan 6 satuan.', kisi='MT1b',
          konteks='Setiap bilangan dua angka bisa diuraikan menjadi puluhan ditambah satuan. '
                  'Contoh 25 = 20 + 5, yaitu 2 puluhan dan 5 satuan. '
                  'Ajak anak menguraikan 36 sedotan: berapa ikat sepuluh dan berapa sedotan yang lepas?'),
    isian('Bangun ruang pada gambar disebut ....', ['balok'], gambar=[BALOK],
          bahas='Balok seperti kotak sepatu: sisinya persegi panjang.', kisi='MT3a',
          konteks='Balok seperti kotak sepatu atau kotak susu: sisinya berbentuk persegi panjang. '
                  'Beda dengan kubus (dadu) yang semua sisinya persegi. '
                  'Ajak anak membandingkan kotak sepatu dan dadu, lalu menyebut nama keduanya.'),
    isian('Gambar ini adalah bangun datar yang bernama ....', ['persegi', 'bujur sangkar'], gambar=[PERSEGI_BIRU],
          bahas='Persegi punya 4 sisi yang sama panjang dan 4 pojok siku-siku.', kisi='MT3a',
          konteks='Persegi punya 4 sisi yang sama panjang dan 4 pojok siku-siku, seperti ubin atau sapu tangan. '
                  'Ajak anak melipat kertas persegi: sisi-sisinya akan saling menutupi dengan pas. '
                  'Bandingkan dengan persegi panjang yang dua sisinya lebih panjang.'),
    isian('Rusuk adalah garis tempat dua sisi bertemu. Kubus mempunyai ... rusuk.', ['12', 'dua belas'],
          bahas='Rusuk kubus: 4 di atas, 4 di bawah, dan 4 yang tegak. Jumlahnya 12.', kisi='MT3b',
          konteks='Rusuk adalah garis pinggir bangun ruang, tempat dua sisi bertemu. Pada kotak kado, rusuk adalah garis tempat pita biasa dililitkan. '
                  'Ajak anak menelusuri rusuk kubus sungguhan dengan jari dan menghitungnya per kelompok: rusuk atas, rusuk bawah, lalu rusuk yang tegak.'),
    isian('Lingkaran termasuk bentuk lengkung atau segi banyak? Tulis jawabanmu.', ['lengkung', 'bentuk lengkung'],
          bahas='Lingkaran tidak punya sisi lurus dan pojok, jadi termasuk bentuk lengkung.', kisi='MT3c',
          konteks='Segi banyak punya sisi lurus dan pojok (segitiga, persegi). Bentuk lengkung punya tepi yang melengkung mulus tanpa pojok. '
                  'Ajak anak membayangkan menggambar roda sepeda: apakah ada pojok yang tajam? Lalu pilih satu dari dua istilah itu.'),
    isian('Gambar apa yang cocok pada tanda ? pada pola ini?', ['pisang', 'buah pisang', 'banana'],
          gambar=[img('red-apple'), img('banana'), img('red-apple'), img('banana'), img('red-apple'), {'teks': '?'}],
          bahas='Polanya apel, pisang, apel, pisang, ... Setelah apel berikutnya pisang.', kisi='MT4b',
          konteks='Pola gambar berulang dalam urutan yang tetap. '
                  'Ajak anak menyebutkan nama gambarnya dari kiri ke kanan, lalu tebak gambar apa yang datang berikutnya. '
                  'Bisa dicoba dengan benda sungguhan, misalnya sendok dan garpu bergantian.'),

    uraian('Dina punya 28 stiker. Kakak memberi 19 stiker lagi.\nBerapa stiker Dina sekarang? Tulis cara bersusun dan hasilnya.',
           '28 + 19 = 47. Satuan: 8 + 9 = 17, tulis 7 dan simpan 1 puluhan. Puluhan: 2 + 1 + 1 simpanan = 4. Jadi stiker Dina 47.',
           [['47']], minimal=1,
           bahas='8 + 9 = 17 (tulis 7, simpan 1). 2 + 1 + 1 = 4. Hasilnya 47.', kisi='MT2a',
           konteks='Menyimpan dipakai bila jumlah satuan 10 atau lebih: puluhannya disimpan ke kolom puluhan. '
                   'Contoh 16 + 7: satuan 6 + 7 = 13, tulis 3 dan simpan 1 puluhan. '
                   'Ajak anak menaruh 28 kancing dan 19 kancing, mengelompokkan tiap 10 kancing, lalu menghitung ikatan dan sisanya. '
                   'Minta anak menuliskan angka bersusun dengan rapi.'),
    uraian('Persegi panjang pada gambar dipotong dari satu pojok ke pojok di seberangnya (garis putus-putus).\nPotongannya ada berapa dan berbentuk apa?',
           'Potongannya ada 2 dan berbentuk segitiga.',
           [['2', 'dua'], ['segitiga']], minimal=2, gambar=[PP_DIAG],
           bahas='Garis dari pojok ke pojok membagi persegi panjang menjadi 2 segitiga.', kisi='MT3d',
           konteks='Bangun datar dapat dipotong menjadi bangun lain. Beri anak kertas persegi panjang dan minta ia menggunting dari satu pojok ke pojok seberangnya. '
                   'Lalu tanyakan: ada berapa potongan dan berapa pojok tiap potongan? '
                   'Biarkan anak menyebutkan nama bangun yang ia lihat.'),
    uraian('Ayah punya 34 kelereng. Ayah memberikan 16 kelereng kepada adik.\nBerapa kelereng Ayah sekarang? Tulis cara bersusun dan hasilnya.',
           '34 - 16 = 18. Satuan 4 tidak cukup dikurangi 6, pinjam 1 puluhan: 14 - 6 = 8. Puluhan tinggal 2, 2 - 1 = 1. Sisa 18 kelereng.',
           [['18']], minimal=1,
           bahas='Pinjam 1 puluhan: 14 - 6 = 8. Puluhan tinggal 2, 2 - 1 = 1. Hasilnya 18.', kisi='MT2b',
           konteks='Meminjam dipakai bila angka satuan di atas lebih kecil dari satuan yang dikurangkan. '
                   'Puluhan di sebelahnya dipinjam 1, dan 1 puluhan itu menjadi 10 satuan yang ditambahkan ke satuan. '
                   'Contoh 32 - 8: satuan 2 tidak cukup, pinjam 1 puluhan jadi 12 - 8 = 4, puluhan tinggal 2, hasilnya 24. '
                   'Peragakan dengan 3 ikat lidi isi sepuluh dan 4 lidi lepas: buka satu ikat agar ada cukup lidi lepas untuk diambil.'),
]

# =====================================================================
# PAKET 3
# =====================================================================
paket3 = [
    pg('Bu Ani membeli 44 jeruk dan Bu Sari 48 jeruk. Pernyataan yang benar adalah ....', '44 < 48',
       ['44 > 48', '44 = 48', '48 < 44'],
       bahas='Puluhannya sama (4). Satuannya 4 lebih kecil dari 8, jadi 44 < 48.', kisi='MT1a',
       konteks='Bila puluhannya sama, bandingkan satuannya. Tanda < dan > membuka ke bilangan yang lebih besar, seperti mulut yang ingin "makan" yang banyak. '
               'Ajak anak menaruh 44 dan 48 kelereng berdampingan: mana yang lebih banyak, dan mana yang lebih sedikit? Lalu pilih kalimat yang cocok.'),
    pg('Nama bangun ruang ini adalah ....', 'prisma segitiga', ['balok', 'kerucut', 'tabung'], gambar=[PRISMA],
       bahas='Alas dan tutupnya berbentuk segitiga, sisi sampingnya persegi panjang. Namanya prisma segitiga.', kisi='MT3a',
       konteks='Prisma punya dua sisi yang bentuknya sama (alas dan tutup) dan sisi-sisi samping yang berbentuk persegi panjang. '
               'Pada gambar, perhatikan bentuk sisi depannya: itulah yang memberi nama prisma. '
               'Contoh benda sehari-hari: kotak cokelat segitiga atau atap rumah berbentuk pelana.'),
    pg('Dadu berbentuk kubus. Pernyataan yang benar tentang dadu adalah ....', 'punya 6 sisi dan 8 titik sudut',
       ['punya 6 sisi dan 12 titik sudut', 'punya 8 sisi dan 6 titik sudut', 'punya 12 sisi dan 6 rusuk'],
       bahas='Kubus: 6 sisi, 12 rusuk, 8 titik sudut.', kisi='MT3b',
       konteks='Setiap bangun ruang punya sisi (bidang), rusuk (garis pertemuan sisi), dan titik sudut (pojok). '
               'Ajak anak memegang dadu: hitung permukaannya, lalu pojoknya satu per satu. '
               'Bedakan dengan jumlah rusuk, yaitu garis-garis pinggirnya.'),
    pg('Kelompok yang semua bangunnya segi banyak (sisinya lurus) adalah ....', 'persegi, segitiga, persegi panjang',
       ['lingkaran, persegi, segitiga', 'segitiga, persegi panjang, lingkaran', 'lingkaran, persegi panjang, persegi'],
       bahas='Persegi, segitiga, dan persegi panjang sisinya lurus. Lingkaran sisinya lengkung.', kisi='MT3c',
       konteks='Segi banyak adalah bangun datar yang sisinya lurus, seperti segitiga dan persegi. Lingkaran bukan segi banyak karena tepinya melengkung. '
               'Ajak anak memeriksa tiap kelompok satu per satu: adakah satu bangun yang tepinya melengkung? Kalau ada, kelompok itu tidak cocok.'),
    pg('Persegi pada gambar tersusun dari beberapa segitiga kecil. Ada berapa segitiga kecil itu?', '4', ['2', '3', '6'], gambar=[PERSEGI_DIAG],
       bahas='Dua garis dari pojok ke pojok membagi persegi menjadi 4 segitiga kecil.', kisi='MT3d',
       konteks='Bangun datar bisa diurai menjadi bangun-bangun kecil. '
               'Ajak anak menunjuk dan mewarnai tiap bagian pada gambar satu per satu (di gambar tiap bagian sudah berbeda warna), lalu menghitungnya. '
               'Boleh juga menggunting kertas persegi menurut dua garis pojok ke pojok.'),
    pg('Lanjutkan pola. Bentuk berikutnya adalah ....', 'lingkaran', ['segitiga', 'persegi', 'persegi panjang'], gambar=[POLA3],
       bahas='Polanya segitiga, lingkaran, lingkaran, diulang. Setelah segitiga datang lingkaran.', kisi='MT4b',
       konteks='Pola dibaca dari kiri ke kanan. Minta anak mencari kelompok yang kembali muncul (di sini ada satu bentuk lalu dua bentuk lain), '
               'lalu menepuk iramanya sambil menyebut nama bentuk. '
               'Teruskan irama itu satu langkah setelah bentuk terakhir pada gambar.'),

    isian('4 puluhan dan 3 satuan ditulis ....', ['43', 'empat puluh tiga'],
          bahas='4 puluhan = 40, ditambah 3 satuan menjadi 43.', kisi='MT1b',
          konteks='Bilangan dua angka dibentuk dari puluhan (angka kiri) dan satuan (angka kanan). '
                  'Contoh 2 puluhan dan 5 satuan ditulis 25. '
                  'Ajak anak membuat ikatan sedotan isi sepuluh, lalu menaruh sedotan lepas di sampingnya dan menuliskan angkanya.'),
    isian('Topi ulang tahun berbentuk bangun ruang yang bernama ....', ['kerucut'],
          bahas='Topi ulang tahun runcing di atas dan bulat di bawah, itulah kerucut.', kisi='MT3a',
          konteks='Kerucut runcing di satu ujung dan alasnya berbentuk lingkaran, seperti topi ulang tahun atau cone es krim. '
                  'Ajak anak membayangkan atau menggambar topi ulang tahun, lalu mencari benda lain yang bentuknya serupa. '
                  'Bandingkan dengan tabung yang atas dan bawahnya sama besar.'),
    isian('Bangun datar yang punya 3 sisi dan 3 sudut bernama ....', ['segitiga'],
          bahas='Segi tiga berarti punya tiga sisi dan tiga sudut.', kisi='MT3a',
          konteks='Nama segitiga berasal dari "tiga": tiga sisi dan tiga pojok. '
                  'Ajak anak menggambar bangun itu di kertas dengan tiga garis lurus, lalu menghitung sisi dan pojoknya. '
                  'Contoh benda: penggaris segitiga dan rambu jalan tertentu.'),
    isian('Ada berapa bangun yang berbentuk lengkung (tanpa pojok) pada gambar?', ['3', 'tiga'], gambar=[KUMPUL_3],
          bahas='Ada 3 lingkaran. Persegi, segitiga, dan persegi panjang sisinya lurus.', kisi='MT3c',
          konteks='Bentuk lengkung tepinya melengkung mulus dan tidak punya pojok, misalnya lingkaran. '
                  'Ajak anak menelusuri tepi tiap bangun dengan telunjuk: kalau tidak ada pojok yang tajam, itu bentuk lengkung. '
                  'Hitung hanya bangun yang tepinya melengkung.'),
    isian('Kucing berada di sebelah ... rumah.', ['kiri', 'sebelah kiri', 'di kiri'], gambar=[img('cat-face'), img('house')],
          bahas='Pada gambar, kucing ada di sisi kiri, rumah di sisi kanan.', kisi='MT4a',
          konteks='Kiri dan kanan dilihat dari sisi pembaca gambar. Tangan yang dipakai menulis adalah tangan kanan; satunya lagi kiri. '
                  'Ajak anak mengangkat kedua tangannya, lalu mencocokkan sisi tangan itu dengan letak kucing terhadap rumah pada gambar.'),
    isian('Tulis warna bola pada tanda ? pada pola ini.', ['merah', 'warna merah'], gambar=[POLA4],
          bahas='Polanya merah, merah, biru, diulang. Setelah satu merah datang merah lagi.', kisi='MT4b',
          konteks='Pola warna berulang dengan urutan tetap. '
                  'Minta anak menyebutkan warna dari kiri ke kanan: "merah, merah, biru ...". '
                  'Bagian mana yang berulang? Lanjutkan menyebut kelompok itu sampai ke tanda tanya.'),

    uraian('Di dalam keranjang ada 45 jeruk. Ibu mengambil 28 jeruk untuk dibuat jus.\nBerapa jeruk yang tersisa? Tulis cara bersusun dan hasilnya.',
           '45 - 28 = 17. Satuan 5 tidak cukup dikurangi 8, pinjam 1 puluhan: 15 - 8 = 7. Puluhan tinggal 3, 3 - 2 = 1. Sisa 17 jeruk.',
           [['17']], minimal=1,
           bahas='Pinjam 1 puluhan: 15 - 8 = 7. Puluhan tinggal 3, 3 - 2 = 1. Hasilnya 17.', kisi='MT2b',
           konteks='Meminjam dipakai bila angka satuan di atas lebih kecil dari satuan yang dikurangkan. '
                   'Pinjam 1 puluhan dari kolom puluhan, yang berubah menjadi 10 satuan, lalu tambahkan ke satuan. '
                   'Contoh 23 - 6: satuan 3 tidak cukup, pinjam 1 puluhan jadi 13 - 6 = 7, puluhan tinggal 1. '
                   'Peragakan dengan uang mainan: tukar satu lembar sepuluhan dengan 10 koin satuan.'),
    uraian('Gambar menunjukkan 4 persegi kecil yang sama besar. Bagaimana cara menyusunnya menjadi satu persegi besar? Ceritakan susunannya.',
           'Susun 2 persegi di baris atas dan 2 persegi di baris bawah, rapat tanpa celah, sehingga menjadi satu persegi besar.',
           [['2 baris', 'dua baris', '2 kolom', 'dua kolom', '2 x 2', '2x2', '2 di atas', 'dua di atas', '2 di bawah', 'dua di bawah',
             '2 atas', '2 bawah', 'dua-dua', '2-2', '2 dan 2', 'dua dan dua', '2 persegi di']],
           minimal=1, gambar=[EMPAT_PERSEGI],
           bahas='2 persegi di atas dan 2 persegi di bawah, rapat, membentuk persegi besar.', kisi='MT3d',
           konteks='Menyusun bangun datar berarti menempatkan bangun kecil rapat tanpa celah agar membentuk bangun yang lebih besar. '
                   'Beri anak 4 kartu persegi yang sama besar dan minta ia mencoba berbagai susunan sampai bentuknya jadi persegi besar. '
                   'Lalu minta ia menceritakan susunan yang berhasil: berapa kartu di atas dan di bawah?'),
    uraian('Kakak mengumpulkan 25 kerang pada hari Sabtu dan 18 kerang pada hari Minggu.\nBerapa kerang Kakak semuanya? Tulis cara bersusun dan hasilnya.',
           '25 + 18 = 43. Satuan: 5 + 8 = 13, tulis 3 dan simpan 1 puluhan. Puluhan: 2 + 1 + 1 simpanan = 4. Jadi kerang Kakak 43.',
           [['43']], minimal=1,
           bahas='5 + 8 = 13 (tulis 3, simpan 1). 2 + 1 + 1 = 4. Hasilnya 43.', kisi='MT2a',
           konteks='Menyimpan dipakai bila jumlah satuan 10 atau lebih: 10 satuan ditukar menjadi 1 puluhan yang disimpan di kolom puluhan. '
                   'Contoh 14 + 9: satuan 4 + 9 = 13, tulis 3 dan simpan 1 puluhan, puluhan 1 + 1 = 2, hasilnya 23. '
                   'Ajak anak menaruh 25 dan 18 sendok es krim, menukar tiap 10 sendok lepas dengan 1 ikat, lalu menghitung ikatan dan sisanya.'),
]


# =====================================================================
# TAMBAHAN supaya tiap paket = 24 butir seperti kisi-kisi (10 PG, 9 isian, 5 uraian)
# =====================================================================
# ---------- gambar tambahan ----------
LINGKARAN_G = svg(circ(120, 75, 52, BC['c']), 240, 150)
BOLA_G = svg(bola(100, 78, 52, MER), 200, 150)
KERUCUT_G = KERUCUT
SEGITIGA_G = svg(tri(120, 72, 52, BC['t']), 240, 150)
RUMAH_DATAR = svg(poly([(40, 62), (120, 12), (200, 62)], '#F29A52') + sq(120, 100, 38, '#B5E1F4')
                  + rr(105, 100, 30, 38, '#C98B55') , 240, 150)
PERSEGI_BAGI = svg(sq(120, 75, 55, '#FBD97E') + putus('M120 20 V130', 4), 240, 150)
GRID_2X3 = svg(''.join(sq(45 + 75 * c, 40 + 70 * r, 32, BC['s']) for r in range(2) for c in range(3)), 240, 150)
PERSEGI_DIAG1 = svg(sq(120, 75, 55, '#B5E3AB') + putus('M65 20 L175 130', 4), 240, 150)
PERSEGI_DIAG2 = svg(sq(120, 75, 55, '#B5E3AB') + putus('M65 20 L175 130', 4) + putus('M175 20 L65 130', 4), 240, 150)
TIGA_PERSEGI = svg(''.join(sq(45 + 75 * i, 75, 28, BC['s']) for i in range(3)), 240, 150)
ROBOT = svg(sq(120, 38, 28, '#B5E1F4') + circ(108, 34, 6, '#fff') + circ(132, 34, 6, '#fff')
            + rr(84, 70, 72, 48, '#F8C197') + rr(60, 74, 22, 12, '#F8C197') + rr(158, 74, 22, 12, '#F8C197'), 240, 150)
KUMPUL_2 = svg(shp('c', 45, 48, 22) + shp('t', 120, 45, 24) + shp('c', 200, 50, 22) + shp('s', 55, 112, 20)
               + shp('r', 130, 115, 18) + shp('c', 210, 112, 22), 255, 150)
KUMPUL_4 = svg(shp('s', 45, 50, 22) + shp('t', 120, 48, 24) + shp('r', 55, 115, 18) + shp('c', 150, 112, 24), 255, 150)
TUMPUK = svg(tri(120, 28, 20, BC['t']) + circ(120, 80, 20, BC['c']) + sq(120, 128, 17, BC['s']), 240, 160)
POLA_UKURAN = svg(''.join(circ(30 + i * 44, 45, 22 if 'bkk'[i % 3] == 'b' else 12, BC['c']) for i in range(7))
                  + kotak_tanya(30 + 7 * 44, 45), 30 + 8 * 44 + 14, 90)
POLA_AABK = deretan([('c', W[x]) for x in ['merah', 'merah', 'biru', 'kuning'] * 2 + ['merah', 'merah']], r=14, gap=36)
POLA7 = deretan([('c', W[x]) for x in ['merah', 'merah', 'biru', 'biru'] * 2], q=2, r=16, gap=44)

paket1 += [
    pg('Bangun datar pada gambar bernama ....', 'lingkaran', ['persegi', 'segitiga', 'persegi panjang'], gambar=[LINGKARAN_G],
       bahas='Lingkaran bulat, tepinya melengkung dan tidak punya pojok. Bangun lain punya sisi lurus.', kisi='MT3a',
       konteks='Bangun datar itu pipih seperti gambar di kertas. Lingkaran bulat sempurna, tidak punya pojok, seperti tutup toples atau piring. '
               'Ajak anak menelusuri tepi gambar dengan jari, lalu bandingkan dengan tepi persegi dan segitiga yang punya pojok.'),
    pg('Pernyataan yang benar tentang segi banyak adalah ....', 'sisinya lurus dan punya pojok',
       ['sisinya melengkung', 'tidak punya pojok', 'bulat seperti bola'], kisi='MT3c',
       bahas='Segi banyak, seperti segitiga dan persegi, sisinya lurus dan punya pojok.',
       konteks='Bangun datar dibagi dua jenis: segi banyak (sisi lurus, punya pojok) dan bentuk lengkung (tepi melengkung, tanpa pojok). '
               'Gambar segitiga dan lingkaran bersama anak, lalu minta ia menunjuk pojok pada tiap gambar. '
               'Bangun yang punya pojok itulah segi banyak.'),
    pg('Gambar rumah tersusun dari beberapa bangun datar. Atap rumah berbentuk ....', 'segitiga',
       ['persegi', 'lingkaran', 'persegi panjang'], gambar=[RUMAH_DATAR],
       bahas='Atap rumah pada gambar punya 3 sisi dan 3 pojok, yaitu segitiga.', kisi='MT3d',
       konteks='Satu gambar bisa disusun dari beberapa bangun datar. Mengurai berarti memisahkan gambar menjadi bangun-bangun pembentuknya. '
               'Minta anak menunjuk bagian atap, lalu menghitung sisi dan pojoknya untuk menamai bangun itu. '
               'Ajak ia menyusun rumah-rumahan sendiri dari kertas.'),
    pg('Setelah bintang pada pola ini, gambar berikutnya adalah ....', 'bulan', ['bintang', 'awan', 'matahari'],
       gambar=[img('star'), img('crescent-moon'), img('crescent-moon'), img('star'), img('crescent-moon'), img('crescent-moon'), img('star'), {'teks': '?'}],
       bahas='Polanya bintang, bulan, bulan, diulang. Setelah bintang datang bulan.', kisi='MT4b',
       konteks='Pada pola gambar, cari kelompok yang berulang. Di sini kelompoknya "bintang, bulan, bulan". '
               'Minta anak menepuk tangan mengikuti irama itu sambil menyebut nama gambar, lalu lanjutkan sampai ke tanda tanya.'),
    isian('Bangun ruang yang bulat penuh pada gambar ini bernama ....', ['bola'], gambar=[BOLA_G],
          bahas='Bola bulat penuh, tidak punya pojok dan tidak punya sisi datar.', kisi='MT3a',
          konteks='Bangun ruang yang bulat penuh bernama bola, seperti bola sepak atau kelereng. '
                  'Ajak anak menggelindingkan bola dan kotak, lalu tanya mana yang bisa menggelinding ke segala arah.'),
    isian('Persegi termasuk segi banyak atau bentuk lengkung? Tulis jawabanmu.', ['segi banyak', 'segibanyak', 'segi-banyak', 'bentuk segi banyak'],
          bahas='Persegi punya 4 sisi lurus dan 4 pojok, jadi termasuk segi banyak.', kisi='MT3c',
          konteks='Segi banyak punya sisi lurus dan pojok, bentuk lengkung punya tepi melengkung tanpa pojok. '
                  'Ajak anak meraba pojok sapu tangan atau ubin berbentuk persegi, lalu memilih satu dari dua istilah itu.'),
    isian('Lengkapi pola gambar ini. Gambar pada tanda ? adalah ....', ['ikan', 'gambar ikan', 'fish'],
          gambar=[img('ant'), img('fish'), img('butterfly'), img('ant'), img('fish'), img('butterfly'), img('ant'), {'teks': '?'}],
          bahas='Polanya semut, ikan, kupu-kupu, diulang. Setelah semut datang ikan.', kisi='MT4b',
          konteks='Pola gambar dengan tiga unsur diulang dalam urutan tetap. '
                  'Minta anak membaca "semut, ikan, kupu-kupu" lalu mengulanginya sampai tiba di tanda tanya. '
                  'Bisa dilatih dengan tiga benda di rumah, misalnya sendok, garpu, piring.'),
    uraian('Kue berbentuk persegi dipotong sepanjang garis putus-putus tepat di tengah.\nPotongannya ada berapa dan berbentuk apa?',
           'Potongannya ada 2 dan berbentuk persegi panjang.',
           [['2', 'dua'], ['persegi panjang', 'persegipanjang']], minimal=2, gambar=[PERSEGI_BAGI],
           bahas='Persegi dibagi dua tepat di tengah menjadi 2 persegi panjang: dua sisinya panjang dan dua sisinya pendek.', kisi='MT3d',
           konteks='Bangun datar bisa dipotong menjadi bangun lain. Beri anak kertas persegi, minta ia melipat tepat di tengah lalu menggunting. '
                   'Tanyakan: ada berapa potongan, dan apakah keempat sisi tiap potongan masih sama panjang? '
                   'Terima jawaban dengan kata-kata anak sendiri.'),
    uraian('Tulis nama dua bentuk pada tanda ? pada pola ini, lalu jelaskan bagaimana polanya.',
           'Dua bentuknya persegi dan segitiga. Polanya segitiga, lingkaran, persegi, diulang terus.',
           [['persegi dan segitiga', 'persegi segitiga', 'persegi lalu segitiga', 'persegi kemudian segitiga', 'persegi terus segitiga'],
            ['diulang', 'berulang', 'ulang', 'segitiga lingkaran persegi']], minimal=2, gambar=[POLA5],
           bahas='Polanya segitiga, lingkaran, persegi, diulang. Setelah lingkaran datang persegi, lalu segitiga.', kisi='MT4b',
           konteks='Untuk melanjutkan pola, cari dulu kelompok kecil yang berulang (di sini tiga bentuk). '
                   'Minta anak membaca kelompok itu dengan lantang lalu mengulanginya sampai melewati bentuk terakhir pada gambar. '
                   'Minta ia menjelaskan dengan kalimatnya sendiri apa yang berulang.'),
]

paket2 += [
    pg('Perhatikan gambar. Bangun ruang ini bernama ....', 'kerucut', ['tabung', 'kubus', 'bola'], gambar=[KERUCUT_G],
       bahas='Kerucut runcing di atas dan alasnya berbentuk lingkaran, seperti topi ulang tahun.', kisi='MT3a',
       konteks='Kerucut runcing di satu ujung dan alasnya lingkaran, seperti topi ulang tahun atau cone es krim. '
               'Ajak anak membedakannya dari tabung (kaleng) yang atas dan bawahnya sama besar.'),
    pg('Kubus pada gambar punya ... titik sudut.', '8', ['4', '6', '12'], gambar=[KUBUS],
       bahas='Kubus punya 8 titik sudut (4 di atas dan 4 di bawah), 6 sisi, dan 12 rusuk.', kisi='MT3b',
       konteks='Titik sudut adalah pojok tempat rusuk bertemu. Pegang dadu bersama anak, hitung pojok atas (4) lalu pojok bawah (4). '
               'Jangan lupa menghitung pojok bagian belakang yang di gambar tampak sebagai garis putus-putus.'),
    pg('Persegi panjang pada gambar dibagi menjadi persegi-persegi kecil. Ada berapa persegi kecil?', '6', ['3', '5', '8'], gambar=[GRID_2X3],
       bahas='Ada 2 baris dan tiap baris 3 persegi, jadi 3 + 3 = 6 persegi kecil.', kisi='MT3d',
       konteks='Bangun datar besar bisa diurai menjadi bangun kecil. Ajak anak menghitung per baris lalu menjumlahkannya, jangan menghitung acak. '
               'Boleh menutup baris pertama dengan kertas agar anak fokus pada satu baris.'),
    pg('Warna lingkaran pada tanda ? adalah ....', 'biru', ['merah', 'kuning', 'hijau'], gambar=[POLA_AABK],
       bahas='Polanya merah, merah, biru, kuning, diulang. Setelah dua merah datang biru.', kisi='MT4b',
       konteks='Pola ini punya kelompok empat warna: merah, merah, biru, kuning. '
               'Minta anak melingkari tiap kelompok empat lingkaran dengan pensil, lalu melihat kelompok terakhir yang belum lengkap. '
               'Warna apa yang harus datang berikutnya?'),
    isian('Perhatikan gambar. Bangun datar ini bernama ....', ['segitiga'], gambar=[SEGITIGA_G],
          bahas='Segitiga punya 3 sisi dan 3 pojok.', kisi='MT3a',
          konteks='Segitiga punya 3 sisi lurus dan 3 pojok. Ajak anak menghitung sisi dan pojok pada gambar sambil menyentuh satu per satu. '
                  'Contoh benda: penggaris segitiga atau potongan pizza.'),
    isian('Ada berapa bangun yang punya pojok pada gambar?', ['3', 'tiga'], gambar=[KUMPUL_2],
          bahas='Yang punya pojok: 1 segitiga, 1 persegi, 1 persegi panjang = 3. Lingkaran (3 buah) tidak punya pojok.', kisi='MT3c',
          konteks='Bangun yang punya pojok adalah segi banyak. Lingkaran bulat mulus tanpa pojok. '
                  'Minta anak menelusuri tepi tiap bangun dengan jari: bila jarinya "tersangkut" di pojok, hitung bangun itu.'),
    isian('Bangun datar yang berada di bawah lingkaran adalah ....', ['persegi', 'bujur sangkar'], gambar=[TUMPUK],
          bahas='Dari atas ke bawah: segitiga, lingkaran, persegi. Di bawah lingkaran ada persegi.', kisi='MT4a',
          konteks='Atas dan bawah dilihat dari posisi gambar pada kertas: yang lebih dekat ke bagian atas kertas ada di atas. '
                  'Ajak anak menumpuk tiga benda di meja lalu menyebut urutannya dari atas ke bawah, kemudian mencocokkannya dengan gambar.'),
    uraian('Kue berbentuk persegi dipotong sepanjang kedua garis putus-putus yang bersilang dari pojok ke pojok.\nPotongannya ada berapa dan berbentuk apa?',
           'Potongannya ada 4 dan berbentuk segitiga.',
           [['4', 'empat'], ['segitiga']], minimal=2, gambar=[PERSEGI_DIAG2],
           bahas='Dua garis silang dari pojok ke pojok membagi persegi menjadi 4 segitiga.', kisi='MT3d',
           konteks='Bangun datar dapat dipotong menjadi bangun lain. Beri anak kertas persegi, minta ia melipat dari pojok ke pojok dua kali (bersilang), lalu menggunting di lipatan. '
                   'Tanyakan: ada berapa potongan, dan berapa pojok tiap potongan? Biarkan anak menyebut nama bangunnya sendiri.'),
    uraian('Tulis warna dua bola pada tanda ? pada pola ini, lalu jelaskan polanya.',
           'Dua bola itu berwarna kuning dan kuning. Polanya merah, kuning, kuning, diulang terus.',
           [['kuning dan kuning', 'kuning kuning', 'dua kuning', '2 kuning', 'keduanya kuning', 'semuanya kuning', 'kuning semua', 'sama sama kuning'],
            ['diulang', 'berulang', 'ulang', 'merah kuning kuning', 'satu merah', '1 merah']],
           minimal=2, gambar=[POLA6],
           bahas='Polanya merah, kuning, kuning, diulang. Setelah merah datang dua kuning.', kisi='MT4b',
           konteks='Cari kelompok kecil yang berulang: "merah, kuning, kuning". '
                   'Minta anak membaca polanya sambil menepuk, lalu meneruskannya dua langkah. '
                   'Minta ia menjelaskan dengan kalimatnya sendiri apa yang berulang.'),
]

paket3 += [
    pg('Kaleng susu dan kaleng sarden berbentuk bangun ruang yang bernama ....', 'tabung', ['kubus', 'kerucut', 'bola'],
       bahas='Kaleng punya alas dan tutup berbentuk lingkaran serta sisi melengkung di sekelilingnya: tabung.', kisi='MT3a',
       konteks='Tabung punya dua sisi datar berbentuk lingkaran (atas dan bawah) dan satu sisi melengkung. '
               'Ajak anak mencari kaleng atau gelas di dapur, lalu meraba bagian atas, bawah, dan sisinya.'),
    pg('Robot pada gambar tersusun dari beberapa bangun datar. Mata robot berbentuk ....', 'lingkaran',
       ['persegi', 'segitiga', 'persegi panjang'], gambar=[ROBOT],
       bahas='Mata robot bulat tanpa pojok, yaitu lingkaran. Kepalanya persegi dan badannya persegi panjang.', kisi='MT3d',
       konteks='Satu gambar bisa disusun dari banyak bangun datar. Ajak anak menunjuk bagian gambar satu per satu dan menyebut bangun penyusunnya. '
               'Untuk tiap bagian, tanyakan: ada pojoknya atau bulat mulus?'),
    pg('Buah yang berada di sebelah kanan pisang adalah ....', 'anggur', ['apel', 'jeruk', 'pisang'],
       gambar=[img('red-apple'), img('banana'), img('grapes')],
       bahas='Dari kiri ke kanan: apel, pisang, anggur. Di sebelah kanan pisang ada anggur.', kisi='MT4a',
       konteks='Kiri dan kanan dilihat dari sisi pembaca gambar: tangan penulis (kanan) berada di sisi kanan. '
               'Ajak anak menyebut urutan gambar dari kiri ke kanan, lalu menunjuk pisang dan menggeser jarinya ke arah kanan.'),
    pg('Lingkaran pada tanda ? berukuran ....', 'lingkaran kecil', ['lingkaran besar', 'persegi kecil', 'segitiga besar'], gambar=[POLA_UKURAN],
       bahas='Polanya besar, kecil, kecil, diulang. Setelah satu besar datang lingkaran kecil.', kisi='MT4b',
       konteks='Pola tidak hanya tentang bentuk atau warna, tetapi juga ukuran. '
               'Minta anak menyebut "besar, kecil, kecil" sambil menunjuk gambar, lalu melanjutkan ke tanda tanya. '
               'Perhatikan juga bentuknya: pilihan jawaban ada yang berbeda bentuk.'),
    isian('Bangun ruang yang semua sisinya berbentuk persegi yang sama besar bernama ....', ['kubus'],
          bahas='Kubus: 6 sisi persegi yang sama besar, seperti dadu.', kisi='MT3a',
          konteks='Kubus seperti dadu atau kotak kado berbentuk kubus: semua sisinya persegi yang sama besar. '
                  'Bandingkan dengan balok (kotak sepatu) yang sisinya persegi panjang.'),
    isian('Balok pada gambar mempunyai ... rusuk.', ['12', 'dua belas'], gambar=[BALOK],
          bahas='Balok punya 12 rusuk: 4 di atas, 4 di bawah, dan 4 yang tegak.', kisi='MT3b',
          konteks='Rusuk adalah garis pinggir tempat dua sisi bertemu. Ajak anak menelusuri rusuk kotak sepatu dengan jari per kelompok: '
                  'rusuk atas, rusuk bawah, lalu rusuk yang tegak. Garis putus-putus di gambar adalah rusuk bagian belakang.'),
    isian('Tulis nama satu-satunya bangun yang bentuknya lengkung pada gambar.', ['lingkaran'], gambar=[KUMPUL_4],
          bahas='Persegi, segitiga, dan persegi panjang sisinya lurus. Hanya lingkaran yang lengkung.', kisi='MT3c',
          konteks='Bentuk lengkung punya tepi yang melengkung mulus tanpa pojok. '
                  'Ajak anak menelusuri tepi tiap bangun dengan telunjuk: bangun mana yang tidak punya pojok sama sekali?'),
    uraian('Gambar menunjukkan 3 persegi yang sama besar. Bagaimana cara menyusunnya menjadi satu persegi panjang? Ceritakan susunannya.',
           'Tempelkan ketiga persegi berjajar dalam satu baris, sisinya rapat tanpa celah, sehingga menjadi satu persegi panjang.',
           [['berjajar', 'sebaris', 'satu baris', '1 baris', 'berderet', 'berdampingan', 'berbaris', 'sejajar', 'ke samping', 'mendatar', 'memanjang', 'dijajarkan', 'ditumpuk', 'bertumpuk', 'ke bawah', 'satu kolom', 'tegak']],
           minimal=1, gambar=[TIGA_PERSEGI],
           bahas='3 persegi diletakkan berjajar dalam satu baris, rapat tanpa celah, menjadi persegi panjang.', kisi='MT3d',
           konteks='Menyusun bangun datar berarti menempatkan bangun kecil rapat tanpa celah. '
                   'Beri anak 3 kartu persegi yang sama besar dan minta ia mencoba susunan yang berbeda. '
                   'Tanyakan: susunan mana yang membuat satu bangun panjang dengan 4 pojok siku-siku?'),
    uraian('Tulis warna dua bola pada tanda tanya, lalu ceritakan bagaimana polanya.',
           'Dua bola itu berwarna merah dan merah. Polanya merah, merah, biru, biru, diulang terus.',
           [['merah dan merah', 'merah merah', 'dua merah', '2 merah', 'keduanya merah', 'semuanya merah', 'merah semua', 'sama sama merah'],
            ['diulang', 'berulang', 'ulang', 'dua biru', '2 biru', 'merah merah biru biru']],
           minimal=2, gambar=[POLA7],
           bahas='Polanya merah, merah, biru, biru, diulang. Setelah dua biru datang dua merah.', kisi='MT4b',
           konteks='Cari kelompok yang berulang: di sini empat bola "merah, merah, biru, biru". '
                   'Minta anak melingkari tiap kelompok empat bola, lalu memeriksa kelompok terakhir yang belum lengkap. '
                   'Minta ia menjelaskan dengan kalimatnya sendiri.'),
]

# urutkan seperti lembar ujian: PG, B/S, isian, uraian; di dalam bagian mengikuti urutan indikator kisi-kisi
from _kisi import KISI as _K
_KODE = list(_K['matematika'])
_URUT = ['pg', 'bs', 'isian', 'uraian']
for _p in (paket1, paket2, paket3):
    _p.sort(key=lambda q: (_URUT.index(q['jenis']), _KODE.index(q['kisi'])))

PAKET = [paket1, paket2, paket3]

# =====================================================================
# verifikasi angka (dijalankan setiap file ini dimuat)
# =====================================================================
assert 37 > 29 and 44 < 48 and 41 > 38                       # perbandingan; 41 satu-satunya pilihan > 38
assert [x for x in (41, 36, 29, 38) if x > 38] == [41]
assert 27 + 15 == 42 and 28 + 19 == 47 and 41 - 17 == 24 and 45 - 28 == 17
# menyimpan / meminjam memang terjadi (satuan penjumlahan >= 10; satuan atas < satuan bawah)
assert 7 + 5 >= 10 and 8 + 9 >= 10 and 1 < 7 and 5 < 8
assert 34 - 16 == 18 and 4 < 6 and 25 + 18 == 43 and 5 + 8 >= 10   # P2 MT2b, P3 MT2a
assert max(42, 47, 24, 17) <= 50
# nilai tempat
assert 34 // 10 == 3 and 36 - 30 == 6 and 4 * 10 + 3 == 43
# bangun ruang (Euler V - E + F = 2) untuk kubus/balok dan prisma segitiga
assert 8 - 12 + 6 == 2 and 6 - 9 + 5 == 2
KUBUS_FS = {'sisi': 6, 'rusuk': 12, 'titik sudut': 8}
assert KUBUS_FS['sisi'] == 6 and KUBUS_FS['rusuk'] == 12 and KUBUS_FS['titik sudut'] == 8
assert 4 + 4 + 4 == 12                                        # rusuk kubus: atas, bawah, tegak
# segi banyak vs lengkung: KUMPUL_1 (t,c,s,r,c,t) dan KUMPUL_3 (s,c,t,c,r,c)
assert sum(k != 'c' for k in 'tcsrct') == 4 and sum(k == 'c' for k in 'sctcrc') == 3
# pola
_p1 = 'ssc' * 3
assert _p1[7] == 's'                                           # S S C S S C S -> S
_p2 = ['merah', 'kuning', 'biru'] * 3
assert _p2[7] == 'kuning'
_p3 = 'tcc' * 3
assert _p3[7] == 'c'
_p4 = ['merah', 'merah', 'biru'] * 3
assert _p4[7] == 'merah'
_p5 = 'tcs' * 4
assert _p5[8] == 's' and _p5[9] == 't'                        # 8 bentuk tampil -> dua berikutnya persegi, segitiga
_p6 = ['merah', 'kuning', 'kuning'] * 3
assert _p6[7] == 'kuning' and _p6[8] == 'kuning'
assert 'tcstcstc'[:8] == 'tcstcstc'

# tambahan: verifikasi pola/jumlah baru
assert (6 * 2 == 12) and 3 + 3 == 6
assert ['bs', 'bkk'[0]] and 'bkk' * 3 == 'bkkbkkbkk' and 'bkkbkkbkk'[7] == 'k'   # besar, kecil, kecil -> setelah 7 gambar (idx 7) = kecil
_a = ['merah', 'merah', 'biru', 'kuning'] * 3
assert _a[10] == 'biru'
_b = ['merah', 'merah', 'biru', 'biru'] * 3
assert _b[8] == 'merah' and _b[9] == 'merah'
_c = ['ant', 'fish', 'butterfly'] * 3
assert _c[7] == 'fish'
_d = ['star', 'moon', 'moon'] * 3
assert _d[7] == 'moon' and _d[6] == 'star'
assert sum(k != 'c' for k in 'ctcsrc') == 3 and sum(k == 'c' for k in 'stcr') == 1
