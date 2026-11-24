from _alat import *

# ---------- gambar sendiri ----------
def _gelombang(x0=20, x1=220, y=75, amp=28, n=3):
    pts = []
    for k in range(0, 121):
        t = k / 120
        pts.append(f'{x0 + (x1 - x0) * t:.1f} {y - amp * math.sin(t * n * 2 * math.pi):.1f}')
    return 'M' + ' L'.join(pts)

LENGKUNG = svg(line('M30 115 Q120 -5 210 115'))
BERGELOMBANG = svg(line(_gelombang()))

def _spiral_at(cx, cy, turns=3, gap=6.5):
    pts = []
    for k in range(0, int(turns * 72) + 1):
        t = k * math.pi / 36; r = 2 + gap * t / math.pi
        pts.append(f'{cx + r * math.cos(t):.1f} {cy + r * math.sin(t):.1f}')
    return 'M' + ' L'.join(pts)

AWAN = lambda x, y: (f'<path d="M{x-55} {y+20} Q{x-70} {y-5} {x-40} {y-10} Q{x-30} {y-40} {x} {y-30} '
                     f'Q{x+30} {y-45} {x+42} {y-12} Q{x+70} {y-5} {x+55} {y+20} Z" fill="#E6EEF5" stroke="{INK}" stroke-width="4"/>')
PETIR = svg(AWAN(120, 40) + f'<path d="M110 62 L135 62 L118 92 L140 92 L104 140 L114 104 L96 104 Z" fill="#F5B82E" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>', 240, 150)
OMBAK = svg(f'<rect x="0" y="0" width="240" height="150" fill="#EAF6FC"/>'
            + line(_gelombang(10, 230, 50, 14, 3), '#2F7FC1', 7) + line(_gelombang(10, 230, 85, 14, 3), '#2F7FC1', 7)
            + line(_gelombang(10, 230, 120, 14, 3), '#2F7FC1', 7), 240, 150)
HUJAN = svg(AWAN(120, 40) + ''.join(line(f'M{x} {y} V{y+30}', '#2F7FC1', 6) for x, y in
                                     [(80, 75), (110, 85), (140, 75), (170, 85), (95, 115), (125, 120), (155, 115)]), 240, 160)
SIPUT = svg(f'<path d="M30 125 H200 Q215 125 212 112 L190 110 Q170 112 160 95" fill="#F7C873" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
            + f'<path d="M200 112 Q205 80 196 62 M206 112 Q220 85 218 66" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
            + f'<circle cx="196" cy="60" r="5" fill="{INK}"/><circle cx="218" cy="64" r="5" fill="{INK}"/>'
            + f'<circle cx="115" cy="75" r="52" fill="#C98B4E" stroke="{INK}" stroke-width="4"/>' + line(_spiral_at(115, 75, 3.2, 7.2), INK, 5), 240, 150)
ULAR = svg(line(_gelombang(30, 200, 75, 30, 2), '#3FA34D', 16) + f'<ellipse cx="208" cy="75" rx="18" ry="13" fill="#3FA34D" stroke="{INK}" stroke-width="3"/>'
           f'<circle cx="212" cy="70" r="3" fill="{INK}"/>' + line('M225 77 l12 -2 m-12 2 l12 5', '#E5484D', 3), 250, 150)
JALAN_LURUS = svg(f'<rect x="0" y="45" width="240" height="60" fill="#9AA0A6"/>' + line('M10 75 H230', '#fff', 6).replace('stroke-linecap="round"', 'stroke-dasharray="22 14"'), 240, 150)

LINGKARAN = svg(circ(120, 70, 55, '#E8742A'))
PERSEGI = svg(sq(120, 70, 52, '#7CC6E8'))

def topeng(ekspresi='senang', panah=None):
    """Topeng kertas: wajah, lubang mata, hidung, mulut. panah: 'mata' | 'hidung' | 'mulut' -> panah menunjuk bagian itu."""
    s = f'<path d="M60 30 Q140 0 220 30 Q235 95 200 125 Q140 155 80 125 Q45 95 60 30Z" fill="#F7C873" stroke="{INK}" stroke-width="5"/>'
    s += f'<line x1="60" y1="55" x2="20" y2="45" stroke="{INK}" stroke-width="3"/><line x1="220" y1="55" x2="260" y2="45" stroke="{INK}" stroke-width="3"/>'
    s += f'<ellipse cx="108" cy="62" rx="17" ry="11" fill="{INK}"/><ellipse cx="172" cy="62" rx="17" ry="11" fill="{INK}"/>'
    s += f'<path d="M138 72 l-8 20 h18" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
    if ekspresi == 'senang':
        s += line('M105 104 Q140 132 175 104', INK, 6)
    elif ekspresi == 'sedih':
        s += line('M108 122 Q140 98 172 122', INK, 6)
        s += line('M92 46 L122 38', INK, 5) + line('M158 38 L188 46', INK, 5)
    elif ekspresi == 'marah':
        s += line('M110 118 Q140 104 170 118', INK, 6)
        s += line('M90 38 L124 50', INK, 6) + line('M156 50 L190 38', INK, 6)
    if panah:
        tx, ty = {'mata': (186, 68), 'hidung': (146, 92), 'mulut': (172, 114)}[panah]
        sx, sy = 272, 150
        L = math.hypot(tx - sx, ty - sy); ux, uy = (tx - sx) / L, (ty - sy) / L
        bx, by = tx - 20 * ux, ty - 20 * uy
        s += line(f'M{sx} {sy} L{bx:.1f} {by:.1f}', '#D7263D', 6)
        s += f'<path d="M{tx} {ty} L{bx - 10*uy:.1f} {by + 10*ux:.1f} L{bx + 10*uy:.1f} {by - 10*ux:.1f} Z" fill="#D7263D"/>'
    return svg(s, 290, 160)

C, T, S = (lambda x: circ(x, 60, 20, '#E8742A')), (lambda x: tri(x, 62, 22, '#F5B82E')), (lambda x: sq(x, 60, 20, '#7CC6E8'))
def _tanya(x):
    return (f'<rect x="{x-25}" y="35" width="50" height="50" rx="10" fill="#fff" stroke="{INK}" stroke-width="4" stroke-dasharray="8 6"/>'
            f'<text x="{x}" y="73" text-anchor="middle" font-size="34" font-weight="800" fill="{INK}" font-family="sans-serif">?</text>')
def pola(seq):
    """seq: string dari c/t/s/? ; satu baris bentuk."""
    f = {'c': C, 't': T, 's': S, '?': _tanya}
    return svg(''.join(f[k](32 + i * 52) for i, k in enumerate(seq)), 52 * len(seq) + 12, 120)
def warna(seq):
    col = {'m': '#E5484D', 'k': '#F5B82E', 'b': '#2F7FC1'}
    return svg(''.join(_tanya(32 + i * 52) if k == '?' else circ(32 + i * 52, 60, 20, col[k]) for i, k in enumerate(seq)), 52 * len(seq) + 12, 120)

# ---------- PAKET 1 ----------
paket1 = [
    pg('Garis pada gambar adalah garis ....', 'zig-zag', ['lengkung', 'lurus'], gambar=[ZIGZAG],
       bahas='Garis zig-zag naik turun dengan ujung yang tajam.', kisi='SR1'),
    isian('Tulis nama garis ini: garis ....', ['lurus', 'garis lurus'], gambar=[LURUS],
          bahas='Garis lurus tidak berbelok.', kisi='SR1'),
    pg('Petir di langit seperti garis ....', 'zig-zag', ['spiral', 'bergelombang'], gambar=[PETIR],
       bahas='Petir (kilat) berbentuk patah-patah seperti garis zig-zag.', kisi='SR2'),
    pg('Gambar mana yang seperti garis bergelombang?', dict(OMBAK, label='ombak'), [dict(PETIR, label='petir'), dict(JALAN_LURUS, label='jalan lurus')],
       bahas='Ombak di laut naik turun seperti garis bergelombang.', kisi='SR2'),
    pg('Bentuk ini disebut ....', 'lingkaran', ['segitiga', 'persegi'], gambar=[LINGKARAN],
       bahas='Lingkaran bulat dan tidak punya sudut.', kisi='SR3'),
    isian('Tulis nama bentuk ini.', ['segitiga'], gambar=[SEGITIGA],
          bahas='Segitiga punya 3 sisi dan 3 sudut.', kisi='SR3'),
    pg('Panah merah menunjuk bagian topeng, yaitu ....', 'mata', ['hidung', 'mulut'], gambar=[topeng('senang', 'mata')],
       bahas='Panah menunjuk lubang mata pada topeng.', kisi='SR4'),
    pg('Ekspresi wajah topeng ini adalah ....', 'sedih', ['senang', 'marah'], gambar=[topeng('sedih')],
       bahas='Mulut melengkung ke bawah berarti sedih.', kisi='SR4'),
    pg('Bentuk berikutnya adalah ....', 'segitiga', ['lingkaran', 'persegi'], gambar=[pola('ctctc?')],
       bahas='Polanya lingkaran, segitiga, berulang. Setelah lingkaran adalah segitiga.', kisi='SR5'),
    pg('Manakah susunan bentuk yang berulang dan teratur?', pola('stststs'), [pola('sttcsct'), pola('tcsstcc')],
       bahas='Persegi, segitiga, persegi, segitiga ... selalu berulang dengan urutan yang sama.', kisi='SR5'),
]

# ---------- PAKET 2 ----------
paket2 = [
    pg('Garis ini disebut garis ....', 'bergelombang', ['zig-zag', 'lurus'], gambar=[BERGELOMBANG],
       bahas='Garis bergelombang naik turun dengan lengkungan yang halus.', kisi='SR1'),
    pg('Manakah garis lengkung?', LENGKUNG, [ZIGZAG, LURUS],
       bahas='Garis lengkung melengkung seperti pelangi.', kisi='SR1'),
    isian('Ombak di laut seperti garis ....', ['bergelombang', 'garis bergelombang', 'gelombang'], gambar=[OMBAK],
          bahas='Ombak naik turun seperti garis bergelombang.', kisi='SR2'),
    pg('Air hujan jatuh ke bawah seperti garis ....', 'lurus', ['spiral', 'zig-zag'], gambar=[HUJAN],
       bahas='Tetes hujan jatuh lurus ke bawah.', kisi='SR2'),
    pg('Nama bentuk ini adalah ....', 'persegi', ['persegi panjang', 'lingkaran'], gambar=[PERSEGI],
       bahas='Persegi punya 4 sisi yang sama panjang.', kisi='SR3'),
    pg('Bentuk yang punya 3 sisi adalah ....', 'segitiga', ['persegi', 'lingkaran'],
       bahas='Segitiga punya 3 sisi; persegi punya 4 sisi; lingkaran tidak bersisi lurus.', kisi='SR3'),
    isian('Bagian topeng yang ditunjuk panah merah adalah ....', ['hidung'], gambar=[topeng('senang', 'hidung')],
          bahas='Panah menunjuk hidung di tengah topeng.', kisi='SR4'),
    pg('Untuk memotong kertas topeng, kita memakai ....', img('scissors', label='gunting'),
       [img('paintbrush', label='kuas'), img('straight-ruler', label='penggaris')],
       bahas='Topeng kertas dibuat dengan teknik lipat dan gunting.', kisi='SR4'),
    isian('Lanjutkan polanya. Bentuk berikutnya adalah ....', ['persegi'], gambar=[pola('sccscc?')],
          bahas='Polanya persegi, lingkaran, lingkaran, berulang. Setelah dua lingkaran datang persegi lagi.', kisi='SR5'),
    pg('Warna lingkaran berikutnya adalah ....', 'merah', ['kuning', 'biru'], gambar=[warna('mkmkmk?')],
       bahas='Warnanya merah, kuning, berulang. Setelah kuning adalah merah.', kisi='SR5'),
]

# ---------- PAKET 3 ----------
paket3 = [
    pg('Garis yang berputar seperti ini disebut garis ....', 'spiral', ['lengkung', 'bergelombang'], gambar=[SPIRAL],
       bahas='Garis spiral berputar-putar dari tengah ke luar.', kisi='SR1'),
    isian('Tulis nama garis pada gambar: garis ....', ['lengkung', 'garis lengkung'], gambar=[LENGKUNG],
          bahas='Garis lengkung melengkung seperti pelangi.', kisi='SR1'),
    pg('Ular bergerak meliuk-liuk seperti garis ....', 'bergelombang', ['lurus', 'zig-zag'], gambar=[ULAR],
       bahas='Gerak ular meliuk-liuk seperti garis bergelombang.', kisi='SR2'),
    pg('Cangkang siput bergaris ....', 'spiral', ['lurus', 'zig-zag'], gambar=[SIPUT],
       bahas='Garis pada cangkang siput berputar seperti spiral.', kisi='SR2'),
    pg('Bentuk pada gambar adalah ....', 'persegi panjang', ['persegi', 'segitiga'], gambar=[PERSEGI_PANJANG],
       bahas='Persegi panjang punya 2 sisi panjang dan 2 sisi pendek.', kisi='SR3'),
    pg('Roda sepeda berbentuk ....', 'lingkaran', ['segitiga', 'persegi'], gambar=[img('bicycle')],
       bahas='Roda sepeda bulat seperti lingkaran.', kisi='SR3'),
    pg('Topeng ini menunjukkan wajah yang ....', 'marah', ['senang', 'sedih'], gambar=[topeng('marah')],
       bahas='Alis turun ke tengah dan mulut cemberut berarti marah.', kisi='SR4'),
    pg('Supaya kedua lubang mata topeng sama besar, kertas ... dulu, lalu digunting.', 'dilipat', ['dibasahi', 'diremas'],
       bahas='Kertas dilipat dua lalu digunting, jadi kedua sisi sama.', kisi='SR4'),
    isian('Tulis bentuk yang datang berikutnya.', ['segitiga'], gambar=[pola('ttsttst?')],
          bahas='Polanya segitiga, segitiga, persegi, berulang. Berikutnya segitiga.', kisi='SR5'),
    pg('Bentuk yang hilang pada pola ini adalah ....', 'lingkaran', ['segitiga', 'persegi'], gambar=[pola('ct?tct')],
       bahas='Polanya lingkaran, segitiga, berulang; yang hilang lingkaran.', kisi='SR5'),
]

PAKET = [paket1, paket2, paket3]
