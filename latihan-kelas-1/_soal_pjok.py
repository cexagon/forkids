from _alat import *

# ---------- gambar orang lidi tambahan (viewBox 160x180, sama dengan orang()) ----------
OR = '#E8742A'   # warna panah
LANTAI = lambda y=170, x1=15, x2=145: f'<path d="M{x1} {y} H{x2}" stroke-width="4"/>'

def panah(x1, y1, x2, y2, warna=OR):
    """Panah lurus dengan kepala di (x2, y2)."""
    a = math.atan2(y2 - y1, x2 - x1); L = 14
    p1 = (x2 - L * math.cos(a - 0.5), y2 - L * math.sin(a - 0.5))
    p2 = (x2 - L * math.cos(a + 0.5), y2 - L * math.sin(a + 0.5))
    return (f'<path d="M{x1} {y1} L{x2} {y2} M{p1[0]:.1f} {p1[1]:.1f} L{x2} {y2} L{p2[0]:.1f} {p2[1]:.1f}" '
            f'stroke="{warna}" stroke-width="6"/>')

def cermin(d):
    """Balik kiri-kanan sebuah gambar orang()."""
    s = d['svg']
    i = s.index('<g ')
    j = s.rindex('</svg>')
    return {'svg': s[:i] + '<g transform="translate(160 0) scale(-1 1)">' + s[i:j] + '</g></svg>'}

WAJAH = lambda x, y: (f'<circle cx="{x-5}" cy="{y-3}" r="2.5" fill="{INK}" stroke="none"/><circle cx="{x+5}" cy="{y-3}" r="2.5" fill="{INK}" stroke="none"/>'
                      f'<path d="M{x-5} {y+5} Q{x} {y+9} {x+5} {y+5}" stroke-width="2.5"/>')   # wajah menghadap kita
HIDUNG = lambda x, y: f'<path d="M{x+14} {y-2} L{x+20} {y+3} L{x+14} {y+5}" stroke-width="3" fill="#F7C873"/>'   # hidung, kepala menghadap kanan
MATA = lambda x, y: f'<circle cx="{x}" cy="{y}" r="2.5" fill="{INK}" stroke="none"/>'

# berdiri tegak, kedua kaki rapat, tangan lurus di samping badan
BERDIRI_RAPAT = orang(KEPALA(80, 30) + WAJAH(80, 30) + '<path d="M80 45 V110 M80 110 L77 165 M80 110 L83 165 M80 60 L64 104 M80 60 L96 104"/>' + LANTAI())
# duduk selonjor di lantai (tampak samping, menghadap kanan)
DUDUK = orang(KEPALA(52, 62) + MATA(59, 59) + '<path d="M52 77 L55 140 M55 140 L140 142 M54 92 L88 136"/>' + LANTAI(150))
# jongkok (tampak samping, menghadap kanan)
JONGKOK = orang(KEPALA(94, 64) + MATA(101, 61) + '<path d="M92 79 L84 150 M84 150 L120 126 L112 164 H128 M90 94 L134 102"/>' + LANTAI(168))
# merangkak: bertumpu pada tangan dan lutut (tampak samping)
MERANGKAK = orang(KEPALA(32, 70) + MATA(25, 67) + '<path d="M45 82 H115 M50 82 L48 140 M115 82 L112 140 M112 140 H152"/>' + LANTAI(145, 10, 155))
# berdiri satu kaki, tangan terentang ke samping (tampak depan)
SATU_KAKI = orang(KEPALA(80, 30) + WAJAH(80, 30) + '<path d="M80 45 V110 M80 110 L78 165 M80 110 L104 130 L86 142 M80 60 L36 64 M80 60 L124 64"/>' + LANTAI())
# melangkah ke depan (tampak samping, menghadap kanan) + panah ke depan
LANGKAH_DEPAN = orang(KEPALA(66, 28) + MATA(73, 25) + HIDUNG(66, 28) + '<path d="M66 43 V105 M66 105 L96 160 M66 105 L44 160 M66 58 L84 94 M66 58 L50 92"/>'
                      + LANTAI(166, 10, 150) + panah(100, 70, 148, 70))
# melangkah ke samping kanan (tampak depan) + panah ke kanan
LANGKAH_KANAN = orang(KEPALA(62, 30) + WAJAH(62, 30) + '<path d="M62 45 V108 M62 108 L52 162 M62 108 L102 160 M62 60 L44 100 M62 60 L80 100"/>'
                      + LANTAI(166, 10, 150) + panah(96, 120, 150, 120))
LANGKAH_KIRI = cermin(LANGKAH_KANAN)
# meliukkan badan ke samping, tangan di atas kepala + panah lengkung kanan-kiri
_liuk = ('<path d="M80 125 L66 170 M80 125 L94 170 M80 125 L96 72 M95 78 L62 92 L80 114 M95 78 L120 98 L86 112"/>' + KEPALA(102, 54) + WAJAH(102, 54)
         + f'<path d="M48 26 Q14 44 18 86 M8 72 L18 86 L28 72" stroke="{OR}" stroke-width="5"/>'
         + f'<path d="M124 26 Q154 44 148 86 M138 72 L148 86 L158 72" stroke="{OR}" stroke-width="5"/>' + LANTAI(172))
MELIUK = orang(_liuk)
# tanda dilarang berlari: orang berlari dalam lingkaran merah dicoret
DILARANG_BERLARI = {'svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img">'
    '<circle cx="90" cy="90" r="80" fill="#fff" stroke="#D93025" stroke-width="14"/>'
    f'<g transform="translate(14 6) scale(0.85)" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">'
    + KEPALA(88, 30) + '<path d="M86 45 L76 105 M76 105 L106 130 L100 165 M76 105 L52 140 L30 135 M82 62 L110 82 L128 66 M82 62 L56 74 L46 96"/></g>'
    '<path d="M33 33 L147 147" stroke="#D93025" stroke-width="14" stroke-linecap="round"/></svg>'}
# anak berpegangan di pinggir kolam
PEGANGAN = {'svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150" role="img">'
    f'<rect x="150" y="40" width="90" height="110" fill="#E9D7B0" stroke="{INK}" stroke-width="4"/>'
    '<rect x="0" y="60" width="150" height="90" fill="#7CC6E8"/>'
    f'<path d="M0 60 Q20 52 40 60 T80 60 T120 60 T150 60" fill="none" stroke="#fff" stroke-width="4"/>'
    f'<g fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
    + KEPALA(110, 48) + '<path d="M112 63 L108 120 M110 72 L148 46 M110 76 L150 56 M108 120 L96 145 M108 120 L118 145"/></g></svg>'}

def opsi(gbr, label=None):
    d = dict(gbr)
    if label: d['label'] = label
    return d

# ---------------------------------- PAKET 1 ----------------------------------
paket1 = [
    pg('Lihat gambar. Anak ini bertumpu pada ....', 'tangan dan lutut', ['kepala dan bahu', 'perut dan dada'],
       gambar=[MERANGKAK], bahas='Saat merangkak, tangan dan lutut menahan badan. Itu gerak bertumpu.', kisi='PJ1'),
    bs('Berdiri dengan satu kaki termasuk gerak keseimbangan.', True, gambar=[SATU_KAKI],
       bahas='Berdiri satu kaki melatih keseimbangan. Kita tidak berpindah tempat.', kisi='PJ1'),
    pg('Lagu berbunyi, lalu kaki melangkah maju. Itu gerak melangkah ke ....', 'depan', ['belakang', 'atas'],
       gambar=[LANGKAH_DEPAN, img('musical-note')], bahas='Panah menunjuk ke depan. Kaki melangkah ke depan sesuai irama.', kisi='PJ2'),
    bs('Anak pada gambar melangkah ke samping kanan.', True, gambar=[LANGKAH_KANAN, img('musical-note')],
       bahas='Panah menunjuk ke kanan. Anak melangkah ke samping kanan.', kisi='PJ2'),
    pg('Manakah yang termasuk sikap tubuh diam?', opsi(JONGKOK, 'jongkok'), [opsi(MELOMPAT, 'melompat'), opsi(BERLARI, 'berlari')],
       bahas='Jongkok, duduk, dan berdiri tegak adalah sikap tubuh diam.', kisi='PJ3'),
    bs('Berdiri tegak dengan kedua kaki rapat termasuk sikap tubuh diam.', True, gambar=[BERDIRI_RAPAT],
       bahas='Berdiri tegak tidak berpindah tempat. Itu sikap tubuh diam.', kisi='PJ3'),
    pg('Saat berenang, anak-anak harus ditemani ....', 'orang dewasa', ['kucing', 'adik bayi'], gambar=[img('person-swimming')],
       bahas='Orang dewasa menjaga kita agar aman di kolam.', kisi='PJ4'),
    bs('Kita boleh berlari-lari di pinggir kolam renang.', False, gambar=[DILARANG_BERLARI],
       bahas='Pinggir kolam licin. Kita berjalan pelan agar tidak jatuh.', kisi='PJ4'),
    pg('Setelah selesai berolahraga, kita mengucapkan ....', 'Alhamdulillah', ['Astagfirullah', 'Bismillah'],
       bahas='Alhamdulillah artinya segala puji bagi Allah. Kita bersyukur sudah selesai berolahraga.', kisi='PJ5'),
    pg('Kebersihan adalah sebagian dari ....', 'iman', ['makanan', 'mainan'], gambar=[img('soap')],
       bahas='Kebersihan sebagian dari iman. Anak muslim suka hidup bersih.', kisi='PJ5'),
]

# ---------------------------------- PAKET 2 ----------------------------------
paket2 = [
    pg('Gambar mana yang menunjukkan gerak bergantung?', opsi(BERGANTUNG), [opsi(MERANGKAK), opsi(SATU_KAKI)],
       bahas='Bergantung: tangan memegang palang, badan menggantung.', kisi='PJ1'),
    bs('Bergantung artinya menahan tubuh dengan tangan pada alat yang kuat, seperti palang.', True, gambar=[BERGANTUNG],
       bahas='Saat bergantung, tangan memegang alat yang kuat dan tidak goyang.', kisi='PJ1'),
    pg('Badan digerakkan ke kanan dan ke kiri mengikuti irama. Gerakan ini disebut ....', 'meliukkan badan', ['melompat', 'merangkak'],
       gambar=[MELIUK], bahas='Badan meliuk ke kanan, lalu ke kiri, mengikuti irama lagu.', kisi='PJ2'),
    bs('Lihat panahnya. Anak ini melangkah ke samping kanan.', False, gambar=[LANGKAH_KIRI, img('musical-note')],
       bahas='Panah menunjuk ke kiri. Anak melangkah ke samping kiri.', kisi='PJ2'),
    pg('Gambar mana yang menunjukkan gerakan melompat?', opsi(MELOMPAT), [opsi(DUDUK), opsi(BERDIRI)],
       bahas='Saat melompat, kaki terangkat dari tanah.', kisi='PJ3'),
    bs('Bergerak membuat peredaran darah kita menjadi macet.', False,
       bahas='Bergerak membuat peredaran darah lancar, badan jadi sehat.', kisi='PJ3'),
    pg('Tanda di kolam renang ini artinya ....', 'dilarang berlari', ['boleh berlari', 'harus berlari'], gambar=[DILARANG_BERLARI],
       bahas='Garis merah mencoret orang berlari. Artinya dilarang berlari.', kisi='PJ4'),
    bs('Lantai di pinggir kolam licin, jadi kita tidak boleh berlari.', True, gambar=[img('water-wave')],
       bahas='Kalau berlari di lantai licin, kita bisa terpeleset dan jatuh.', kisi='PJ4'),
    pg('Sebelum mulai berolahraga, kita berdoa dan membaca ....', 'Bismillah', ['Alhamdulillah', 'Astagfirullah'], gambar=[img('folded-hands')],
       bahas='Bismillah artinya dengan nama Allah. Kita baca sebelum memulai.', kisi='PJ5'),
    pg('Selesai olahraga, badan berkeringat. Agar bersih, sebaiknya kita ....', 'mandi dan ganti baju', ['langsung tidur', 'bermain lumpur'],
       gambar=[img('shower'), img('soap')], bahas='Menjaga kebersihan adalah sebagian dari iman.', kisi='PJ5'),
]

# ---------------------------------- PAKET 3 ----------------------------------
paket3 = [
    pg('Gerakan pada gambar disebut sikap ....', 'pesawat', ['jongkok', 'duduk'], gambar=[PESAWAT],
       bahas='Satu kaki menumpu, badan condong ke depan, tangan terentang. Itu sikap pesawat.', kisi='PJ1'),
    bs('Berdiri dengan satu kaki termasuk gerak berpindah tempat.', False, gambar=[SATU_KAKI],
       bahas='Berdiri satu kaki tidak berpindah tempat. Itu gerak keseimbangan.', kisi='PJ1'),
    pg('Lihat gambar. Anak ini melangkah ke ....', 'samping', ['depan', 'belakang'], gambar=[LANGKAH_KANAN, img('musical-note')],
       bahas='Kaki digeser ke samping mengikuti irama lagu.', kisi='PJ2'),
    bs('Meliukkan badan ke kanan dan ke kiri bisa dilakukan mengikuti irama lagu.', True, gambar=[MELIUK],
       bahas='Meliukkan badan sesuai irama termasuk gerak berirama.', kisi='PJ2'),
    pg('Kita perlu banyak bergerak agar peredaran darah ....', 'lancar', ['berhenti', 'macet'], gambar=[img('person-running')],
       bahas='Bergerak membuat darah mengalir lancar, badan jadi sehat dan kuat.', kisi='PJ3'),
    bs('Duduk termasuk sikap tubuh bergerak.', False, gambar=[DUDUK],
       bahas='Duduk tidak berpindah tempat. Duduk termasuk sikap tubuh diam.', kisi='PJ3'),
    pg('Saat lelah di dalam kolam renang, sebaiknya kita ....', 'berpegangan di pinggir kolam, lalu naik dan istirahat',
       ['terus berenang ke tengah kolam', 'menyelam lama-lama'], gambar=[PEGANGAN],
       bahas='Kalau lelah, pegang pinggir kolam, lalu naik dan istirahat.', kisi='PJ4'),
    bs('Kita boleh berkejar-kejaran di pinggir kolam renang.', False, gambar=[DILARANG_BERLARI],
       bahas='Dilarang berlari di pinggir kolam karena lantainya licin.', kisi='PJ4'),
    pg('Olahraga sudah selesai. Kita bersyukur kepada Allah dengan mengucapkan ....', 'Alhamdulillah', ['Bismillah', 'Assalamualaikum'],
       bahas='Ucapan syukur adalah Alhamdulillah.', kisi='PJ5'),
    pg('Bacaan Bismillah kita ucapkan ....', 'sebelum mulai berolahraga', ['sesudah selesai berolahraga', 'saat bersin'],
       gambar=[img('folded-hands')], bahas='Bismillah dibaca sebelum memulai. Sesudah selesai kita membaca Alhamdulillah.', kisi='PJ5'),
]

PAKET = [paket1, paket2, paket3]
