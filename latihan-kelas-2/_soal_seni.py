from _alat import *

# ---------- gambar sendiri ----------
def _gelombang(x0=20, x1=220, y=75, amp=28, n=3):
    pts = []
    for k in range(0, 121):
        t = k / 120
        pts.append(f'{x0 + (x1 - x0) * t:.1f} {y - amp * math.sin(t * n * 2 * math.pi):.1f}')
    return 'M' + ' L'.join(pts)

BERGELOMBANG = svg(line(_gelombang()))
LENGKUNG = svg(line('M30 115 Q120 -5 210 115'))

def blob(cx, cy, radii, warna, rot=0):
    """Bidang tidak beraturan: lengkung tertutup dengan jari-jari berbeda-beda."""
    n = len(radii)
    pts = []
    for i, r in enumerate(radii):
        a = rot + i * 2 * math.pi / n
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    mids = [((pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2) for i in range(n)]
    d = f'M{mids[-1][0]:.1f} {mids[-1][1]:.1f}'
    for i in range(n):
        d += f' Q{pts[i][0]:.1f} {pts[i][1]:.1f} {mids[i][0]:.1f} {mids[i][1]:.1f}'
    return f'<path d="{d} Z" fill="{warna}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'

BATU = svg(blob(120, 72, [52, 30, 48, 36, 56, 28, 44], '#B8A58C'), 240, 150)
AWAN_TB = svg('<path d="M58 108 C34 108 30 78 52 72 C48 46 82 34 98 50 C106 26 146 24 154 50 C176 40 200 58 190 80 C208 88 200 112 180 108 Z" fill="#BFE0F5" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>', 240, 150)  # awan bergelembung, bentuk bebas
DAUN_TB = svg(blob(120, 72, [40, 58, 26, 52, 30, 56, 24], '#6DBF6A', 1.1), 240, 150)
GENANGAN = svg('<path d="M28 92 C34 74 80 80 104 78 C122 64 150 60 168 74 C196 70 222 84 206 98 C214 112 182 116 160 108 C140 122 96 116 80 108 C56 116 20 108 28 92 Z" fill="#7CC6E8" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>', 240, 150)  # genangan melebar, tepi bergelombang
PERSEGI_PJG_K = svg(f'<rect x="45" y="35" width="150" height="80" rx="4" fill="#E8742A" stroke="{INK}" stroke-width="5"/>', 240, 150)
def _kotak_pilihan(isi): return svg(isi, 120, 100)
O_LINGKARAN = svg(circ(60, 50, 36, '#E8742A'), 120, 100)
O_PERSEGI = svg(sq(60, 50, 34, '#7CC6E8'), 120, 100)
O_SEGITIGA = svg(tri(60, 48, 38, '#F5B82E'), 120, 100)
O_PERSEGI_PJG = svg(f'<rect x="12" y="22" width="96" height="56" rx="4" fill="#7CC6E8" stroke="{INK}" stroke-width="4"/>', 120, 100)
O_BATU = svg(blob(60, 50, [40, 16, 36, 22, 42, 14, 30], '#B8A58C'), 120, 100)
O_AWAN = svg(blob(60, 52, [40, 14, 36, 22, 44, 12, 30, 24, 38], '#BFE0F5', 0.3), 120, 100)
O_DAUN = svg(blob(60, 50, [44, 16, 34, 12, 40, 22, 14, 38], '#6DBF6A', 0.8), 120, 100)
O_ZIGZAG = svg(line('M10 70 L35 25 L60 70 L85 25 L110 70', INK, 7), 120, 100)
O_GELOMBANG = svg(line(_gelombang(8, 112, 50, 20, 2), INK, 7), 120, 100)
O_LENGKUNG = svg(line('M12 78 Q60 -14 108 78', INK, 7), 120, 100)
O_LURUS = svg(line('M10 50 H110', INK, 7), 120, 100)

TITIK = svg(''.join(f'<circle cx="{25 + i * 24}" cy="75" r="6" fill="{INK}"/>' for i in range(9)), 240, 150)

def swatch(*warna):
    """Deretan kotak warna (kode warna hex)."""
    n = len(warna)
    w = 70
    body = ''.join(f'<rect x="{10 + i * (w + 8)}" y="25" width="{w}" height="{w}" rx="10" fill="{c}" stroke="{INK}" stroke-width="4"/>' for i, c in enumerate(warna))
    return svg(body, 20 + n * (w + 8) - 8, 120)

MERAH, ORANYE, KUNING = '#E5484D', '#F08A24', '#F5C518'
BIRU, HIJAU, BIRU_MUDA = '#2F7FC1', '#3FA34D', '#5CB8E6'
PANAS3 = swatch(MERAH, ORANYE, KUNING)
DINGIN3 = swatch(BIRU, HIJAU, BIRU_MUDA)
DINGIN2 = swatch(BIRU, HIJAU)
PANAS2 = swatch(MERAH, ORANYE)

# ============================ PAKET 1 ============================
paket1 = [
    pg('Garis pada gambar disebut garis ....', 'zig-zag', ['bergelombang', 'lengkung', 'lurus'], gambar=[ZIGZAG], kisi='SR1b',
       konteks='Garis zig-zag naik turun dengan ujung yang runcing, seperti huruf Z atau gigi gergaji. Bedakan dengan garis bergelombang yang naik turunnya melengkung halus. Minta anak menjalankan jari mengikuti garis: kalau jarinya patah-patah, itu zig-zag.',
       bahas='Garis zig-zag patah-patah dan runcing.'),
    pg('Manakah bidang yang bentuknya bebas dan tidak punya nama bentuk?', O_BATU, [O_LINGKARAN, O_PERSEGI, O_SEGITIGA], kisi='SR2b',
       konteks='Bidang beraturan punya bentuk yang jelas dan bisa dinamai, seperti lingkaran, persegi, dan segitiga. Bidang tidak beraturan bentuknya bebas, seperti batu, awan, atau genangan air. Tanyakan pada anak: bentuk mana yang bisa kamu sebut namanya? Yang tidak punya nama itulah yang tidak beraturan.',
       bahas='Bentuk batu tidak punya nama bentuk yang pasti, jadi tidak beraturan.'),
    pg('Warna merah, oranye, dan kuning memberikan kesan ....', 'hangat dan bersemangat', ['sejuk dan tenang', 'sepi dan sedih', 'gelap dan menakutkan'], gambar=[PANAS3], kisi='SR3',
       konteks='Warna panas (merah, oranye, kuning) mengingatkan pada api dan matahari, jadi terasa hangat dan penuh semangat. Ajak anak membayangkan duduk dekat api unggun atau di bawah matahari siang. Warna dingin, seperti biru dan hijau, mengingatkan pada air dan daun, jadi terasa sejuk.',
       bahas='Merah, oranye, kuning adalah warna panas: terasa hangat dan bersemangat.'),
    pg('Kamu melihat pelangi yang indah setelah hujan. Ucapan yang baik adalah ....', 'Subhanallah, indah sekali ciptaan Allah swt.', ['Biasa saja, aku sudah sering melihatnya.', 'Ah, pelanginya jelek sekali.', 'Ayo masuk, aku bosan melihatnya.'], gambar=[img('rainbow')], kisi='SR4a',
       konteks='Melihat hal yang indah di alam adalah kesempatan bersyukur kepada Allah swt. Kita bisa mengucapkan Subhanallah (Mahasuci Allah), Masyaallah, atau Alhamdulillah. Tanyakan pada anak: siapa yang membuat pelangi? Lalu apa kata yang baik untuk diucapkan?'),
    pg('Karya seni rupa adalah ....', 'hasil karya yang bisa dilihat, dibuat dari garis, bidang, dan warna', ['lagu yang dinyanyikan dengan merdu', 'tarian yang digerakkan dengan indah', 'cerita yang dibacakan oleh guru'], kisi='SR5a',
       konteks='Seni rupa adalah seni yang bisa dilihat dan disentuh, misalnya gambar, lukisan, patung, dan kolase. Lagu itu seni musik, tarian itu seni tari. Ajak anak menunjuk gambar atau kerajinan di rumah dan bertanya: ini bisa dilihat, ya? Itu karya seni rupa.'),
    pg('Pada teknik gosok, kertas diletakkan di atas daun lalu digosok dengan ....', 'krayon', ['gunting', 'lem', 'penggaris'], gambar=[img('leaf-fluttering-in-wind')], kisi='SR6a',
       konteks='Teknik gosok (frottage) menampilkan tekstur benda di atas kertas. Letakkan kertas tipis di atas daun, lalu gosok miring dengan krayon, maka urat daun muncul. Coba bersama anak di rumah dengan uang koin atau daun, supaya ia ingat alatnya.',
       bahas='Kertas digosok dengan krayon sampai tekstur daun muncul.'),

    isian('Goresan memanjang yang dibuat dari pensil atau krayon yang digerakkan disebut ....', ['garis'], kisi='SR1a',
          konteks='Garis adalah goresan memanjang atau titik-titik yang digerakkan dan disambung. Garis bisa panjang atau pendek, tebal atau tipis. Minta anak menggoreskan krayon dari satu ujung kertas ke ujung lain, lalu tanyakan: apa namanya hasil gerakan itu?'),
    isian('Garis yang berputar-putar ini disebut garis ....', ['spiral', 'garis spiral'], gambar=[SPIRAL], kisi='SR1b',
          konteks='Garis spiral berputar dari tengah ke luar (atau sebaliknya) seperti cangkang siput atau pusaran. Ajak anak menelusuri garis dengan jari. Bila jarinya berputar-putar terus, itu spiral.',
          bahas='Garis yang berputar-putar adalah spiral.'),
    isian('Bagian datar di dalam garis pinggir sebuah bentuk, seperti bagian dalam lingkaran, disebut ....', ['bidang'], kisi='SR2a',
          konteks='Bidang adalah daerah datar yang dibatasi garis, misalnya bagian dalam persegi. Gambarlah lingkaran di kertas bersama anak, lalu minta ia mewarnai isinya. Bagian yang diwarnai itu adalah bidang.'),
    isian('Warna biru dan hijau termasuk warna ....', ['dingin', 'warna dingin'], gambar=[DINGIN2], kisi='SR3',
          konteks='Warna dingin mengingatkan kita pada air, langit, dan daun, sehingga terasa sejuk dan tenang. Bandingkan dengan warna panas seperti merah dan oranye. Tanyakan pada anak: biru itu seperti api atau seperti air?',
          bahas='Biru dan hijau termasuk warna dingin.'),
    isian('Temanmu menunjukkan gambarnya. Kita menghargainya dengan berkata, "Wah, gambarmu ....!"',
          ['bagus', 'indah', 'keren', 'cantik', 'hebat', 'rapi', 'menarik', 'lucu', 'mantap', 'bagus sekali', 'indah sekali', 'keren sekali', 'cantik sekali', 'hebat sekali', 'bagus banget', 'keren banget', 'rapi sekali'], kisi='SR4b',
          konteks='Menghargai karya teman berarti memilih kata yang membuatnya senang, misalnya bagus, indah, atau rapi, dan tidak mengejek. Latihlah anak berpura-pura melihat gambar kakak atau adik: apa yang ia sukai dari gambar itu? Lalu minta ia mengucapkannya dengan satu kata pujian.'),
    isian('Alat untuk memotong kertas pada kegiatan seni rupa adalah ....', ['gunting'], gambar=[img('scissors')], kisi='SR6b',
          konteks='Alat seni rupa punya fungsi masing-masing: gunting untuk memotong, krayon untuk mewarnai, lem untuk menempel. Tunjukkan gambar alat dan tanyakan apa yang bisa dilakukan dengannya. Ingatkan anak bahwa gunting hanya untuk kertas dan dipakai dengan hati-hati.'),

    uraian('Kamu melihat laut yang luas dan indah. Apa yang kamu ucapkan dan kepada siapa kamu berterima kasih?',
           'Aku mengucapkan Subhanallah (Masyaallah). Aku bersyukur kepada Allah swt. yang menciptakan laut yang indah.',
           [['subhanallah', 'subhanalloh', 'masyaallah', 'masya allah', 'masyaalloh', 'mashaallah', 'alhamdulillah', 'alhamdulilah'], ['allah', 'alloh', 'tuhan']], minimal=2, kisi='SR4a',
           konteks='Anak diminta menyebut ucapan baik dan kepada siapa ia bersyukur. Ingatkan bahwa laut, gunung, dan langit adalah ciptaan Allah swt. Bantu dengan pertanyaan: kalau kamu kagum melihat sesuatu yang indah, kata apa yang diucapkan di rumah kita?'),
    uraian('Tulis dua hal yang kamu perhatikan saat melihat karya seni rupa.',
           'Aku memperhatikan warna dan bentuk (gambar) karyanya. Aku juga memperhatikan judulnya.',
           [['warna'], ['bentuk', 'bidang'], ['garis'], ['judul', 'tema', 'nama karya'], ['bahan', 'bahannya'], ['pesan', 'cerita', 'isi', 'gambar apa']], minimal=2, kisi='SR5a',
           konteks='Saat melihat karya, kita memperhatikan warna, bentuk, garis, judul, dan bahan yang dipakai. Ajak anak melihat gambar di buku, lalu tanyakan: warna apa yang paling banyak, bentuknya seperti apa, dan apa judul yang cocok?'),
    uraian('Tulis dua cara memakai gunting dengan hati-hati.',
           'Gunting dipakai sambil duduk dan tidak diarahkan ke teman. Setelah dipakai, gunting disimpan atau diberikan dengan gagang lebih dulu.',
           [['duduk', 'tidak berlari', 'jangan berlari', 'tidak sambil berlari'], ['gagang', 'pegangan', 'tangkai'], ['tidak diarahkan', 'jangan diarahkan', 'tidak mengarahkan', 'jangan menodongkan', 'tidak ditodongkan', 'menjauh dari teman'], ['untuk kertas', 'hanya kertas', 'memotong kertas'], ['disimpan', 'simpan', 'ditutup', 'dikembalikan']], minimal=2, kisi='SR6b',
           konteks='Gunting aman bila dipakai sambil duduk, ujungnya tidak diarahkan ke orang lain, tidak dibawa berlari, dan diserahkan dengan gagang lebih dulu. Peragakan bersama anak memberikan gunting dengan benar, lalu minta ia menyebut dua aturannya.'),
]

# ============================ PAKET 2 ============================
paket2 = [
    pg('Manakah garis bergelombang?', O_GELOMBANG, [O_ZIGZAG, O_LENGKUNG, O_LURUS], kisi='SR1b',
       konteks='Garis bergelombang naik turun dengan lengkungan halus seperti ombak. Garis zig-zag naik turun dengan ujung runcing. Garis lengkung hanya satu lengkungan, dan garis lurus tidak berbelok. Minta anak menyebut nama tiap garis sebelum memilih.',
       bahas='Garis bergelombang naik turun melengkung seperti ombak.'),
    pg('Warna biru dan hijau memberi kesan ....', 'sejuk dan tenang', ['hangat dan bersemangat', 'ramai dan penuh api', 'panas dan menyengat'], gambar=[DINGIN3], kisi='SR3',
       konteks='Warna dingin seperti biru dan hijau mengingatkan pada air, langit, dan daun, sehingga terasa sejuk dan tenang. Ajak anak membayangkan kolam renang atau taman yang hijau. Perasaannya santai, bukan panas.',
       bahas='Biru dan hijau adalah warna dingin: terasa sejuk dan tenang.'),
    pg('Kamu melihat gunung yang tinggi dan hijau. Ucapan yang baik adalah ....', 'Masyaallah, gunung ciptaan Allah swt. indah sekali.', ['Hmm, gunung biasa saja, tidak menarik.', 'Ah, aku bosan melihat gunung itu.', 'Aduh, gunungnya jelek, kita pulang saja.'], kisi='SR4a',
       konteks='Anak belajar mengucapkan kalimat baik saat melihat ciptaan Allah swt. yang indah, misalnya Masyaallah atau Subhanallah. Tanyakan: kalau kita kagum pada gunung, siapa yang menciptakannya? Lalu pilih ucapan yang menunjukkan rasa syukur dan kagum.'),
    pg('Gambar temanmu belum rapi. Kalimat yang sopan dan baik adalah ....', 'Warnanya cerah. Ayo terus menggambar!', ['Jelek sekali gambarmu!', 'Gambarku jauh lebih bagus.', 'Gambar begini saja tidak bisa!'], kisi='SR4b',
       konteks='Menghargai karya teman berarti menyebut sisi baiknya dan memberi semangat, bukan mengejek. Tanyakan pada anak: kalau gambarmu diejek, bagaimana perasaanmu? Lalu pilih kalimat yang membuat teman senang dan mau mencoba lagi.'),
    pg('Rina menggambar pohon dan bunga di taman dekat sekolahnya. Sumber idenya adalah ....', 'lingkungan sekitar', ['imajinasi', 'pengalaman pribadi', 'cerita dongeng'], kisi='SR5b',
       konteks='Ide membuat karya bisa dari imajinasi (khayalan), pengalaman pribadi (hal yang pernah dialami), dan lingkungan sekitar (hal yang dilihat di dekat kita). Rina melihat taman di sekitarnya, jadi idenya dari lingkungan. Ajak anak memilih: apakah yang digambar ada di dekat kita?'),
    pg('Cara yang aman memakai gunting adalah ....', 'dipakai sambil duduk dan tidak diarahkan ke teman', ['dipakai sambil berlari di kelas', 'ditodongkan ke teman yang usil', 'dibawa sambil berjalan dengan ujung ke depan'], kisi='SR6b',
       konteks='Gunting aman bila dipakai sambil duduk, ujungnya tidak diarahkan ke orang lain, dan tidak dibawa berlari. Tunjukkan cara memegang gunting dengan benar dan minta anak mengatakan satu aturan yang harus ditaati.'),

    isian('Titik-titik yang disambung terus seperti pada gambar akan membentuk ....', ['garis'], gambar=[TITIK], kisi='SR1a',
          konteks='Garis adalah titik-titik yang disambung atau digerakkan memanjang. Minta anak menyambungkan titik-titik di kertas dengan pensil, lalu bertanya: apa yang terbentuk sekarang?'),
    isian('Garis yang kedua ujungnya bertemu dan menutup akan membentuk daerah datar yang disebut ....', ['bidang'], kisi='SR2a',
          konteks='Bidang adalah daerah datar yang dibatasi garis. Ajak anak menggambar garis lurus yang bersambung dan menutup membentuk segitiga, lalu mewarnainya. Bagian yang diwarnai itu disebut bidang.'),
    isian('Lingkaran, persegi, dan segitiga adalah bidang ....', ['beraturan', 'bidang beraturan', 'teratur'], gambar=[svg(circ(45, 60, 28, '#E8742A') + sq(120, 60, 26, '#7CC6E8') + tri(200, 62, 30, '#F5B82E'), 250, 120)], kisi='SR2b',
          konteks='Bidang beraturan bentuknya jelas dan punya nama, seperti lingkaran, persegi, dan segitiga. Bidang tidak beraturan bentuknya bebas, misalnya batu atau awan. Tanyakan: ketiga bentuk ini punya nama atau tidak? Kalau punya nama, berarti bidangnya teratur.'),
    isian('Yang menciptakan bunga, laut, dan gunung yang indah adalah ... swt.', ['allah', 'alloh'], kisi='SR4a',
          konteks='Keindahan alam adalah ciptaan Allah swt., dan kita bersyukur dengan ucapan baik seperti Masyaallah dan Subhanallah. Ajak anak melihat bunga atau awan, lalu tanya: siapa yang membuatnya begitu indah?'),
    isian('Ali menggambar robot yang bisa terbang, padahal robot seperti itu belum ada. Idenya berasal dari ....', ['imajinasi', 'khayalan', 'hayalan', 'imajinasinya', 'khayalannya'], kisi='SR5b',
          konteks='Imajinasi artinya membayangkan sesuatu di kepala, bahkan yang belum pernah ada, seperti robot terbang atau kucing bersayap. Tanyakan pada anak: apakah robot itu pernah ia lihat? Kalau belum ada di dunia nyata, berarti idenya dari bayangan atau khayalan.'),
    isian('Membuat gambar dengan menempel potongan kertas atau kain pada kertas disebut teknik ....', ['kolase', 'teknik kolase'], kisi='SR6a',
          konteks='Kolase adalah karya yang dibuat dengan menempel potongan bahan seperti kertas, kain, atau daun kering pada kertas dasar. Ajak anak menggunting kertas bekas warna-warni dan menempelnya jadi gambar rumah, lalu sebutkan namanya.'),

    uraian('Temanmu menunjukkan gambarnya yang belum selesai. Tulis kalimat yang sopan dan baik untuknya.',
           'Gambarmu bagus. Ayo semangat, selesaikan ya!',
           [['bagus', 'hebat', 'keren', 'cantik', 'indah', 'rapi', 'suka', 'senang', 'warnanya', 'semangat', 'lanjutkan', 'teruskan', 'ayo']], minimal=1, kisi='SR4b',
           konteks='Anak berlatih memberi tanggapan yang menyenangkan, bukan mengejek. Bantu dengan rumus: sebut satu hal yang bagus, lalu beri semangat. Misalnya, warnanya cerah, ayo selesaikan. Periksa bahwa kalimatnya sopan dan tidak melukai perasaan.'),
    uraian('Dari mana saja kita bisa mendapat ide untuk menggambar? Tulis dua.',
           'Ide bisa dari imajinasi (khayalan) dan dari pengalaman pribadi. Bisa juga dari lingkungan sekitar.',
           [['imajinasi', 'khayalan', 'hayalan', 'membayangkan', 'bayangan'], ['pengalaman', 'kenangan', 'liburan', 'pernah'], ['lingkungan', 'sekitar', 'alam', 'sekolah', 'rumah', 'taman', 'sekeliling']], minimal=2, kisi='SR5b',
           konteks='Ada tiga sumber ide: imajinasi (khayalan), pengalaman pribadi (kejadian yang pernah dialami), dan lingkungan sekitar (yang dilihat di rumah, sekolah, taman). Tanyakan pada anak: kalau mau menggambar, apa yang bisa kamu ingat, bayangkan, atau lihat?'),
    uraian('Sebutkan satu karya seni rupa yang pernah kamu buat atau lihat. Lalu tulis satu hal yang kamu perhatikan dari karya itu.',
           'Karya seni rupa yang kulihat adalah lukisan pemandangan. Aku memperhatikan warnanya yang cerah dan judulnya.',
           [['gambar', 'lukisan', 'patung', 'kolase', 'kerajinan', 'topeng', 'anyaman', 'batik', 'melukis', 'menggambar', 'poster', 'mewarnai', 'tanah liat', 'origami'],
            ['warna', 'bentuk', 'bidang', 'garis', 'judul', 'tema', 'bahan', 'pesan', 'cerita', 'rapi', 'bagian']], minimal=2, kisi='SR5a',
           konteks='Karya seni rupa adalah hasil berkarya yang bisa dilihat, seperti gambar, lukisan, patung, dan kolase. Saat melihat karya, kita memperhatikan warna, bentuk, garis, judul, atau bahan yang dipakai. Ajak anak memilih satu gambar atau kerajinan di rumah, lalu tanyakan: apa namanya, dan apa yang paling menarik perhatianmu dari karya itu?'),
]

# ============================ PAKET 3 ============================
paket3 = [
    pg('Manakah bidang yang punya nama bentuk yang jelas?', O_PERSEGI_PJG, [O_BATU, O_AWAN, O_DAUN], kisi='SR2b',
       konteks='Bidang beraturan punya bentuk yang jelas dan bisa dinamai, seperti persegi panjang. Batu, awan, dan daun bentuknya bebas, jadi tidak beraturan. Tanyakan anak: bentuk mana yang punya nama bentuk?',
       bahas='Persegi panjang punya 4 sisi dan 4 sudut siku-siku, jadi beraturan.'),
    pg('Kamu bisa melihat taman bunga yang indah. Kita bersyukur dengan mengucapkan ....', 'Alhamdulillah, aku bisa melihat bunga yang indah.', ['Biasa saja, bunganya begitu-begitu saja.', 'Ih, bunga ini mau kupetik semuanya.', 'Aduh, banyak sekali bunganya, aku pusing.'], kisi='SR4a',
       konteks='Alhamdulillah artinya segala puji bagi Allah swt. Kita mengucapkannya saat bersyukur atas nikmat, termasuk bisa melihat keindahan alam. Tanyakan: pilihan mana yang membuat hati senang dan berterima kasih kepada Allah swt.?'),
    pg('Hasil kolase temanmu agak miring. Kalimat yang sopan dan baik adalah ....', 'Kolasemu bagus. Lain kali ditempel lebih lurus, ya.', ['Kolasemu miring, jelek sekali!', 'Kolaseku jauh lebih bagus darimu.', 'Kolase seperti itu tidak perlu dilihat.'], kisi='SR4b',
       konteks='Kita boleh memberi saran, tetapi harus dengan kata sopan dan mulai dari hal yang baik. Tanyakan pada anak: kalau temanmu bilang begitu padamu, kamu senang atau sedih? Kalimat yang membuat teman mau memperbaiki karyanya adalah pilihan yang tepat.'),
    pg('Hal yang perlu kita perhatikan saat melihat karya seni rupa adalah ....', 'judul, warna, dan bagian yang kita sukai', ['berat dan harga karya', 'nama ibu pembuatnya', 'suara dan nada lagunya'], kisi='SR5a',
       konteks='Saat melihat karya seni rupa, kita memperhatikan judul, warna, bentuk, garis, bahan, dan bagian yang paling disukai. Ajak anak menatap satu gambar lalu bertanya: apa judulnya, warna apa saja, bagian mana yang paling bagus?'),
    pg('Bayu menggambar perahu yang ia naiki bersama ayah ketika liburan. Sumber idenya adalah ....', 'pengalaman pribadi', ['imajinasi', 'meniru buku cerita', 'warna krayon'], kisi='SR5b',
       konteks='Pengalaman pribadi adalah kejadian yang pernah kita alami sendiri, seperti liburan atau bermain di pantai. Imajinasi adalah khayalan, dan lingkungan sekitar adalah yang kita lihat sehari-hari. Bayu mengingat liburannya, jadi idenya dari pengalaman.'),
    pg('Alat yang dipakai untuk mewarnai gambar adalah ....', 'krayon', ['gunting', 'lem', 'penggaris'], gambar=[img('crayon')], kisi='SR6b',
       konteks='Setiap alat seni rupa punya tugas: krayon untuk mewarnai, gunting untuk memotong, lem untuk menempel, penggaris untuk membuat garis lurus. Tunjukkan alatnya satu per satu dan tanyakan apa yang bisa dilakukan dengannya.'),

    isian('Garis seperti pelangi ini disebut garis ....', ['lengkung', 'garis lengkung', 'melengkung'], gambar=[LENGKUNG], kisi='SR1b',
          konteks='Garis lengkung melengkung dalam satu busur seperti pelangi atau jembatan. Bedakan dengan garis bergelombang yang naik turun berulang. Minta anak menelusuri garis dengan jarinya: kalau melengkung sekali saja, itu garis lengkung.'),
    isian('Bidang pada gambar bentuknya bebas dan tidak punya nama. Ia disebut bidang tidak ....', ['beraturan', 'teratur', 'tidak beraturan', 'tidak teratur'], gambar=[BATU], kisi='SR2b',
          konteks='Bidang tidak beraturan bentuknya bebas, misalnya batu, awan, atau genangan air. Bidang beraturan punya nama, seperti lingkaran atau persegi. Tanyakan: bentuk batu ini bisa disebut persegi atau lingkaran? Kalau tidak, berarti tidak beraturan.'),
    isian('Merah, oranye, dan kuning termasuk warna ....', ['panas', 'warna panas', 'hangat'], gambar=[PANAS3], kisi='SR3',
          konteks='Warna panas mengingatkan kita pada api dan matahari, sedangkan warna dingin mengingatkan pada air dan daun. Tanyakan: api berwarna apa? Matahari berwarna apa? Nah, warna-warna itu termasuk kelompok yang mana?'),
    isian('Bidang adalah bentuk datar yang dibatasi oleh ....', ['garis', 'garis-garis', 'garis tepi', 'garis pinggir'], gambar=[AWAN_TB], kisi='SR2a',
          konteks='Bidang terjadi bila sebuah garis ujungnya bertemu lagi sehingga menutup sebuah daerah datar. Gambarlah bentuk bebas bersama anak, lalu tunjuk tepinya: tepi itu dibuat dengan apa? Bagian dalamnya yang bisa diwarnai disebut bidang.'),
    isian('Kertas diletakkan di atas daun lalu digosok krayon. Teknik ini disebut teknik ....', ['gosok', 'teknik gosok', 'frottage'], gambar=[img('leaf-fluttering-in-wind')], kisi='SR6a',
          konteks='Teknik gosok memindahkan tekstur benda ke kertas dengan cara menggosok. Coba bersama anak menggosok krayon di atas kertas yang diletakkan di atas koin atau daun, lalu amati gambarnya muncul.'),
    isian('Untuk menempel potongan kertas pada kolase, kita memakai ....', ['lem', 'perekat', 'lem kertas'], kisi='SR6b',
          konteks='Kolase dibuat dengan menempel potongan bahan pada kertas dasar, sehingga butuh gunting dan lem. Ajak anak menyebutkan alat untuk memotong, lalu bahan untuk menempel.'),

    uraian('Temanmu menang lomba menggambar. Tulis kalimat yang sopan dan baik yang kamu ucapkan.',
           'Selamat ya, gambarmu bagus sekali!',
           [['selamat', 'hebat', 'keren', 'bagus', 'cantik', 'indah', 'senang', 'bangga', 'semangat', 'terima kasih']], minimal=1, kisi='SR4b',
           konteks='Anak berlatih ikut bahagia atas keberhasilan teman. Bantu dengan pertanyaan: kalau kamu yang menang, kamu ingin teman bilang apa? Periksa bahwa kalimatnya sopan, tidak sombong, dan tidak merendahkan.'),
    uraian('Apa yang dimaksud dengan karya seni rupa? Tulis dengan kata-katamu dan beri satu contoh.',
           'Karya seni rupa adalah hasil karya yang dibuat dan bisa dilihat, misalnya gambar, lukisan, patung, atau kolase.',
           [['hasil', 'karya', 'dibuat', 'membuat', 'buatan', 'dilihat'], ['gambar', 'lukisan', 'patung', 'kolase', 'kerajinan', 'topeng', 'anyaman', 'batik', 'melukis', 'menggambar']], minimal=2, kisi='SR5a',
           konteks='Karya seni rupa adalah hasil kegiatan berkarya yang bisa dilihat, seperti gambar, lukisan, patung, kolase, dan kerajinan. Tanyakan pada anak: apa yang pernah kamu buat di sekolah yang bisa dilihat dan dipajang? Itu contoh karya seni rupa.'),
    uraian('Pilih satu sumber ide untuk menggambar. Tulis nama sumber ide itu dan apa yang akan kamu gambar darinya.',
           'Dari pengalaman pribadi, aku akan menggambar pantai tempat aku bermain pasir waktu liburan.',
           [['imajinasi', 'khayalan', 'hayalan', 'pengalaman', 'lingkungan', 'sekitar'], ['liburan', 'rumah', 'sekolah', 'taman', 'pantai', 'pernah', 'pohon', 'bunga', 'gunung', 'sawah', 'laut', 'kucing', 'naga', 'robot', 'keluarga', 'teman', 'kebun', 'masjid', 'kapal', 'perahu', 'mobil', 'hewan', 'peri', 'istana']], minimal=2, kisi='SR5b',
           konteks='Anak memilih satu sumber ide lalu menyebut gambar yang akan dibuat. Bantu dengan contoh: imajinasi (kucing bersayap), pengalaman (liburan ke pantai), lingkungan (pohon di depan rumah). Pastikan isi gambarnya cocok dengan sumber yang dipilih.'),
]

# ============================ SOAL TAMBAHAN (menyamakan jumlah dengan kisi-kisi) ============================
_SYUKUR = ['subhanallah', 'subhanalloh', 'masyaallah', 'masya allah', 'masyaalloh', 'mashaallah', 'alhamdulillah', 'alhamdulilah']

paket1 += [
    pg('Kamu melihat bintang-bintang berkilau di langit malam. Ucapan yang baik adalah ....', 'Masyaallah, bintang-bintang ciptaan Allah swt. indah sekali.', ['Bintangnya hanya titik kecil, tidak penting.', 'Langit malam membosankan, aku tidak mau melihat.', 'Bintang itu mengganggu tidurku.'], gambar=[img('night-with-stars')], kisi='SR4a',
       konteks='Langit malam dan bintang adalah ciptaan Allah swt. Saat kagum, kita bisa mengucapkan Masyaallah atau Subhanallah. Ajak anak melihat langit malam dari jendela lalu tanyakan: siapa yang menciptakan bintang, dan kata apa yang baik diucapkan?'),
    pg('Temanmu mewarnai kucing dengan warna ungu. Kalimat yang menghargai karyanya adalah ....', 'Kucingmu unik, warnanya menarik.', ['Kucing tidak ada yang ungu, gambarmu salah!', 'Gambarmu aneh, aku mau tertawa saja.', 'Aku tidak mau melihat gambarmu.'], kisi='SR4b',
       konteks='Karya seni boleh berbeda dari kenyataan, dan kita menghargainya dengan kata yang sopan dan baik. Tanyakan pada anak: kalau gambarmu ditertawakan, perasaanmu bagaimana? Pilih kalimat yang menyebut sisi menarik dari karya teman.'),
    pg('Dika menggambar kucing yang bisa bicara dan memakai topi. Sumber idenya adalah ....', 'imajinasi', ['meniru gambar teman', 'lingkungan sekitar', 'cat air'], kisi='SR5b',
       konteks='Imajinasi adalah khayalan: membayangkan hal yang belum tentu ada, misalnya kucing yang bisa bicara. Pengalaman pribadi adalah kejadian yang pernah dialami, dan lingkungan sekitar adalah yang kita lihat. Tanyakan: apakah ada kucing yang bisa bicara di dunia nyata? Kalau tidak ada, idenya dari khayalan.'),
    pg('Alat yang membantu kita membuat garis lurus yang rapi adalah ....', 'penggaris', ['lem', 'gunting', 'kuas'], gambar=[img('straight-ruler')], kisi='SR6b',
       konteks='Penggaris dipakai untuk membuat garis lurus, lem untuk menempel, gunting untuk memotong, dan kuas untuk mengecat. Berikan penggaris dan kertas pada anak, minta ia membuat garis lurus, lalu bandingkan dengan garis yang dibuat tanpa penggaris.'),

    isian('Awan pada gambar bentuknya bebas dan tidak punya nama bentuk. Awan ini termasuk bidang ....', ['tidak beraturan', 'tidak teratur', 'bidang tidak beraturan'], gambar=[AWAN_TB], kisi='SR2b',
          konteks='Bidang tidak beraturan bentuknya bebas, seperti awan, batu, dan genangan air. Bidang beraturan punya nama, seperti lingkaran dan persegi. Tanyakan pada anak: awan ini bisa disebut persegi atau lingkaran? Kalau tidak, berarti tidak beraturan.'),
    isian('Kupu-kupu yang cantik ini ciptaan Allah swt. Rasa terima kasih kita kepada Allah swt. atas ciptaan itu disebut ....', ['syukur', 'bersyukur', 'rasa syukur', 'mensyukuri'], gambar=[img('butterfly')], kisi='SR4a',
          konteks='Syukur adalah rasa terima kasih kepada Allah swt. atas nikmat dan keindahan yang diberikan, dan kita menunjukkannya dengan ucapan baik seperti Alhamdulillah. Tanyakan pada anak: kalau diberi hadiah, kamu bilang apa? Kepada Allah swt. kita juga berterima kasih, namanya bersyukur.'),
    isian('Nina menggambar pesta ulang tahunnya yang kemarin. Idenya berasal dari ... pribadi.', ['pengalaman', 'pengalaman pribadi'], kisi='SR5b',
          konteks='Pengalaman pribadi adalah kejadian yang pernah kita alami sendiri, seperti ulang tahun, liburan, atau bermain bersama teman. Minta anak mengingat satu kejadian seru minggu ini, lalu menggambarnya. Itu ide dari pengalaman.'),
    isian('Pada teknik kolase, kita membuat gambar dengan cara ... potongan kertas atau kain pada kertas dasar.', ['menempel', 'menempelkan', 'tempel', 'merekatkan', 'menempelnya'], kisi='SR6a',
          konteks='Kolase dibuat dengan menempel potongan bahan seperti kertas warna, kain perca, atau daun kering pada kertas dasar. Kata kuncinya adalah menempel. Ajak anak membuat kolase kecil dari kertas bekas dan lem.'),

    uraian('Teman sebangkumu menunjukkan hasil kolase buatannya. Tulis satu kalimat pujian yang sopan.',
           'Kolasemu bagus, warnanya menarik.',
           [['bagus', 'hebat', 'keren', 'cantik', 'indah', 'rapi', 'menarik', 'suka', 'senang', 'unik', 'lucu']], minimal=1, kisi='SR4b',
           konteks='Anak berlatih menghargai karya teman dengan kata yang sopan, misalnya menyebut warna atau kerapian yang ia sukai. Periksa bahwa kalimatnya tidak mengejek dan tidak membandingkan dengan karyanya sendiri.'),
    uraian('Apa artinya imajinasi? Beri satu contoh gambar yang idenya dari imajinasi.',
           'Imajinasi artinya khayalan atau membayangkan sesuatu. Contohnya menggambar naga yang bisa terbang.',
           [['khayal', 'hayal', 'bayang', 'pikiran', 'belum ada', 'tidak nyata', 'tidak ada'],
            ['naga', 'robot', 'terbang', 'peri', 'monster', 'alien', 'bersayap', 'dinosaurus', 'istana', 'kastil', 'unicorn', 'raksasa', 'ajaib', 'roket', 'planet', 'putri', 'pahlawan']], minimal=2, kisi='SR5b',
           konteks='Imajinasi artinya membayangkan sesuatu di pikiran, termasuk hal yang belum ada, seperti naga terbang atau rumah di awan. Minta anak memejamkan mata, membayangkan hewan yang aneh, lalu menceritakannya. Gambar dari bayangan itu adalah ide dari imajinasi.'),
]

paket2 += [
    pg('Genangan air pada gambar bentuknya bebas dan tidak punya nama bentuk. Benda yang bentuknya juga bebas seperti genangan itu adalah ....', 'awan di langit', ['uang koin', 'papan catur', 'ubin lantai'], gambar=[GENANGAN], kisi='SR2b',
       bahas='Genangan air dan awan sama-sama bidang tidak beraturan. Koin (lingkaran), papan catur, dan ubin (persegi) adalah bidang beraturan.',
       konteks='Bidang tidak beraturan bentuknya bebas dan tidak punya nama bentuk, seperti genangan air, batu, atau awan. Bidang beraturan punya nama, misalnya koin berbentuk lingkaran dan ubin berbentuk persegi. Tanyakan pada anak: benda mana yang bentuknya bisa kamu sebut namanya? Yang tidak bisa dinamai, itulah jawabannya.'),
    pg('Kamu melihat matahari terbit yang indah di pagi hari. Ucapan yang baik adalah ....', 'Subhanallah, indah sekali matahari terbit ciptaan Allah swt.', ['Silau sekali, aku benci matahari.', 'Biasa saja, matahari tiap hari juga muncul.', 'Matahari itu mengganggu, aku mau tidur lagi.'], gambar=[img('sunrise')], kisi='SR4a',
       konteks='Matahari terbit adalah salah satu keindahan ciptaan Allah swt. Kita bisa mengucapkan Subhanallah atau Masyaallah dan bersyukur. Ajak anak melihat langit pagi lalu tanyakan: apa yang kamu rasakan, dan kepada siapa kita bersyukur?'),
    pg('Manakah yang termasuk karya seni rupa?', 'lukisan pemandangan', ['lagu anak-anak', 'tarian tradisional', 'puisi yang dibacakan'], kisi='SR5a',
       konteks='Karya seni rupa dapat dilihat dan disentuh, misalnya lukisan, patung, dan kolase. Lagu itu seni musik, tarian itu seni tari, dan puisi itu seni sastra. Minta anak menunjuk benda di rumah yang bisa dilihat dan disentuh sebagai karya seni.'),
    pg('Dayu meletakkan kertas di atas koin, lalu menggosoknya dengan krayon. Apa yang muncul di kertas?', 'gambar permukaan koin', ['potongan koin yang menempel', 'tulisan nama Dayu', 'warna koin berubah menjadi merah'], gambar=[img('coin')], kisi='SR6a',
       konteks='Pada teknik gosok, tekstur dan gambar benda berpindah ke kertas saat digosok krayon. Coba bersama anak dengan koin atau daun di bawah kertas tipis. Amati gambar yang muncul pelan-pelan.'),

    isian('Garis ini tidak berbelok dan tidak melengkung sama sekali. Namanya garis ....', ['lurus', 'garis lurus'], gambar=[LURUS], kisi='SR1b',
          konteks='Garis lurus adalah garis yang tidak berbelok dan tidak melengkung, seperti tepi penggaris. Bandingkan dengan garis lengkung, zig-zag, dan bergelombang. Minta anak menarik garis dari ujung kertas ke ujung lain dengan penggaris.'),
    isian('Air kolam dan daun hijau mengingatkan kita pada warna ....', ['dingin', 'warna dingin'], gambar=[img('water-wave')], kisi='SR3',
          konteks='Warna dingin seperti biru dan hijau mengingatkan pada air dan daun, sehingga terasa sejuk. Warna panas mengingatkan pada api dan matahari. Tanyakan pada anak: air itu terasa dingin atau panas? Maka warnanya termasuk kelompok yang mana?'),
    isian('Kita boleh memberi pujian pada karya teman, tetapi tidak boleh ... karyanya.', ['mengejek', 'menghina', 'mencela', 'mengolok-olok', 'mengolok', 'menertawakan', 'merendahkan', 'mencemooh', 'menjelekkan'], kisi='SR4b',
          konteks='Menghargai karya teman berarti memakai kata sopan, dan tidak mengejek atau menertawakan. Tanyakan pada anak: bagaimana rasanya kalau gambarmu ditertawakan? Lalu ajak ia menyebut perbuatan yang tidak boleh dilakukan pada karya teman.'),
    isian('Alat untuk mengecat atau melukis dengan cat air disebut ....', ['kuas', 'kuas lukis'], gambar=[img('paintbrush')], kisi='SR6b',
          konteks='Kuas dipakai untuk melukis dengan cat air atau cat poster. Tunjukkan kuas, krayon, dan gunting pada anak lalu tanyakan alat mana yang dipakai untuk mengecat. Ingatkan ia mencuci kuas setelah dipakai.'),

    uraian('Kamu melihat hamparan sawah hijau yang luas. Tulis ucapan baik yang kamu ucapkan dan satu alasannya.',
           'Masyaallah, indah sekali sawah ini. Aku bersyukur karena ini ciptaan Allah swt.',
           [['subhanallah', 'subhanalloh', 'masyaallah', 'masya allah', 'masyaalloh', 'mashaallah', 'alhamdulillah', 'alhamdulilah'],
            ['bersyukur', 'syukur', 'berterima kasih', 'terima kasih', 'kagum', 'indah', 'ciptaan', 'pencipta', 'menciptakan', 'diciptakan', 'allah', 'alloh']], minimal=2, kisi='SR4a',
           konteks='Anak diminta menyebut ucapan baik (Masyaallah, Subhanallah, atau Alhamdulillah) dan satu alasan, misalnya karena indah atau karena ciptaan Allah swt. Bantu dengan pertanyaan: kenapa kita mengucapkannya? Siapa yang menciptakan sawah dan langit?'),
    uraian('Tulis dua cara memakai bahan seni rupa seperti krayon, lem, dan cat dengan aman dan hati-hati.',
           'Krayon dan lem tidak dimasukkan ke mulut. Tutup lem ditutup kembali setelah dipakai.',
           [['mulut', 'dimakan', 'ditelan', 'dijilat'], ['bergantian', 'berbagi', 'antre', 'tidak berebut', 'meminjam'], ['ditutup', 'menutup', 'tutup'], ['mata', 'dicolek', 'dioles ke teman'], ['alas', 'koran', 'meja', 'dinding', 'dicoret']], minimal=2, kisi='SR6b',
           konteks='Bahan seni rupa dipakai dengan aman: tidak dimasukkan ke mulut, tidak dioles ke teman, ditutup setelah dipakai, dan dipakai bergantian. Ajak anak menyebut dua aturan sambil memegang krayon dan lem. Beri alas koran saat memakai lem atau cat.'),
]

paket3 += [
    pg('Cangkang siput berbentuk garis yang berputar-putar dari tengah ke luar. Garis ini disebut garis ....', 'spiral', ['lurus', 'zig-zag', 'bergelombang'], gambar=[img('snail')], kisi='SR1b',
       konteks='Garis spiral berputar dari tengah ke luar atau sebaliknya, seperti cangkang siput dan pusaran air. Minta anak menelusuri bentuk cangkang dengan jarinya. Kalau jarinya berputar terus, itu garis spiral.'),
    pg('Rani ingin menggambar suasana sejuk di tepi danau. Warna yang cocok adalah ....', 'biru dan hijau', ['merah dan oranye', 'merah dan kuning', 'oranye dan kuning'], kisi='SR3',
       konteks='Warna dingin (biru dan hijau) memberi kesan sejuk dan tenang, cocok untuk danau, langit, dan kebun. Warna panas (merah, oranye, kuning) memberi kesan hangat. Tanyakan: kalau ingin suasana sejuk, pilih warna api atau warna air?'),
    pg('Kamu mendengar burung berkicau merdu di pohon. Ucapan yang baik adalah ....', 'Masyaallah, merdu sekali kicau burung ciptaan Allah swt.', ['Berisik sekali, burung itu mengganggu.', 'Aku mau melempar burung itu supaya diam.', 'Biasa saja, aku tidak peduli.'], gambar=[img('bird')], kisi='SR4a',
       konteks='Keindahan alam bukan hanya yang dilihat, tetapi juga yang didengar, seperti kicau burung. Kita bersyukur dengan ucapan baik seperti Masyaallah. Ajak anak diam sebentar mendengarkan suara alam, lalu tanyakan siapa yang menciptakannya.'),
    pg('Bahan yang dapat dipakai untuk membuat kolase adalah ....', 'potongan kertas warna dan kain perca', ['krayon dan pensil warna', 'air dan sabun', 'es batu'], kisi='SR6a',
       bahas='Kolase dibuat dari potongan bahan yang bisa ditempel, seperti kertas warna, kain perca, atau daun kering.',
       konteks='Kolase adalah gambar yang disusun dari potongan bahan yang ditempel, seperti kertas warna, kain perca, biji-bijian, atau daun kering. Krayon dan pensil warna dipakai untuk mewarnai, bukan ditempel. Ajak anak mengumpulkan sisa kertas dan kain di rumah, lalu tanyakan mana yang bisa ditempel.'),

    isian('Tali, kawat, dan jalan yang panjang bentuknya mirip dengan ....', ['garis'], kisi='SR1a',
          konteks='Garis adalah bentuk memanjang. Banyak benda di sekitar kita bentuknya memanjang seperti garis, misalnya tali, kawat, atau jalan lurus. Ajak anak mencari tiga benda di rumah yang bentuknya seperti garis.'),
    isian('Kamu kagum melihat air terjun yang deras dan indah. Kalimat baik yang artinya "Maha Suci Allah" adalah ....', ['subhanallah', 'subhanalloh', 'subhaanallah', 'subhanallahu', 'subhanaallah'], kisi='SR4a',
          konteks='Saat kagum pada ciptaan Allah swt. kita bisa mengucapkan Masyaallah (atas kehendak Allah), Subhanallah (Maha Suci Allah), atau Alhamdulillah (segala puji bagi Allah). Ucapkan ketiganya bersama anak beserta artinya, lalu tanyakan mana yang artinya Maha Suci Allah.'),
    isian('Bila gambar temanmu belum bagus, kita tetap berkata dengan ..., tidak dengan kata yang kasar.', ['sopan', 'baik', 'santun', 'lembut', 'ramah'], kisi='SR4b',
          konteks='Menghargai teman berarti memilih kata yang sopan dan baik, walaupun gambarnya belum bagus. Latihlah anak mengubah kalimat kasar menjadi kalimat sopan: dari jelek sekali menjadi warnanya sudah bagus, ayo coba lagi.'),
    isian('Sumber ide dari hal yang kita lihat di dekat kita, seperti taman sekolah, disebut lingkungan ....', ['sekitar'], kisi='SR5b',
          konteks='Lingkungan sekitar adalah semua yang ada di dekat kita: rumah, sekolah, taman, dan pohon. Ajak anak melihat dari jendela lalu menyebut apa yang bisa digambar. Itu ide dari lingkungan sekitar.'),

    uraian('Tulis satu kalimat syukur atas keindahan alam, dan sebut kepada siapa kamu bersyukur.',
           'Alhamdulillah, aku bisa melihat pantai yang indah. Aku bersyukur kepada Allah swt.',
           [['subhanallah', 'subhanalloh', 'masyaallah', 'masya allah', 'masyaalloh', 'mashaallah', 'alhamdulillah', 'alhamdulilah', 'bersyukur', 'syukur', 'terima kasih'],
            ['allah', 'alloh', 'tuhan']], minimal=2, kisi='SR4a',
           konteks='Anak menulis satu kalimat syukur yang menyebut Allah swt., misalnya Alhamdulillah, aku bersyukur kepada Allah swt. atas pantai yang indah. Bantu dengan pertanyaan: alam apa yang kamu suka, dan kepada siapa kita berterima kasih?'),
    uraian('Setelah membuat kolase, meja penuh potongan kertas dan lem. Tulis dua hal yang kamu lakukan.',
           'Aku membuang sisa potongan kertas ke tempat sampah. Aku merapikan alat dan menutup lem.',
           [['sampah', 'dibuang', 'membuang', 'memungut', 'dipungut', 'menyapu', 'disapu'], ['dirapikan', 'merapikan', 'dibereskan', 'membereskan', 'disimpan', 'menyimpan', 'dikembalikan', 'mengembalikan'], ['ditutup', 'menutup', 'tutup'], ['dicuci', 'mencuci', 'dibersihkan', 'membersihkan', 'cuci tangan', 'dilap', 'mengelap']], minimal=2, kisi='SR6b',
           konteks='Setelah berkarya, kita bertanggung jawab merapikan: membuang sisa ke tempat sampah, menyimpan alat, menutup lem, dan membersihkan meja. Minta anak menyebut dua hal yang ia lakukan setelah mewarnai atau menempel di rumah.'),
]

# urutkan seperti lembar ujian: pg, bs, isian, uraian; di dalam bagian mengikuti urutan indikator kisi-kisi
_JENIS = ['pg', 'bs', 'isian', 'uraian']
_KODE = ['SR1a', 'SR1b', 'SR2a', 'SR2b', 'SR3', 'SR4a', 'SR4b', 'SR5a', 'SR5b', 'SR6a', 'SR6b']
for _p in (paket1, paket2, paket3):
    _p.sort(key=lambda q: (_JENIS.index(q['jenis']), _KODE.index(q['kisi'])))

PAKET = [paket1, paket2, paket3]
