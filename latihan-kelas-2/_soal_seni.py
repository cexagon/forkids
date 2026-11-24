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
AWAN_TB = svg(blob(120, 72, [50, 28, 54, 34, 46, 26, 52, 30], '#BFE0F5', 0.4), 240, 150)
DAUN_TB = svg(blob(120, 72, [40, 58, 26, 52, 30, 56, 24], '#6DBF6A', 1.1), 240, 150)
GENANGAN = svg(blob(120, 75, [58, 34, 50, 26, 54, 38], '#7CC6E8', 2.0), 240, 150)
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
    pg('Manakah bidang yang tidak beraturan?', O_BATU, [O_LINGKARAN, O_PERSEGI, O_SEGITIGA], kisi='SR2b',
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

    uraian('Kamu melihat laut yang luas dan indah. Apa yang kamu ucapkan dan kepada siapa kamu bersyukur?',
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
    pg('Manakah bidang yang beraturan?', O_PERSEGI_PJG, [O_BATU, O_AWAN, O_DAUN], kisi='SR2b',
       konteks='Bidang beraturan punya bentuk yang jelas dan bisa dinamai, seperti persegi panjang. Batu, awan, dan daun bentuknya bebas, jadi tidak beraturan. Tanyakan anak: bentuk mana yang punya nama bentuk?',
       bahas='Persegi panjang punya 4 sisi dan 4 sudut siku-siku, jadi beraturan.'),
    pg('Kamu bisa melihat taman bunga yang indah. Kita bersyukur dengan mengucapkan ....', 'Alhamdulillah, aku bisa melihat bunga yang indah.', ['Biasa saja, bunganya begitu-begitu saja.', 'Ih, bunga ini mau kupetik semuanya.', 'Aduh, banyak sekali bunganya, aku pusing.'], kisi='SR4a',
       konteks='Alhamdulillah artinya segala puji bagi Allah swt. Kita mengucapkannya saat bersyukur atas nikmat, termasuk bisa melihat keindahan alam. Tanyakan: pilihan mana yang membuat hati senang dan berterima kasih kepada Allah swt.?'),
    pg('Hasil kolase temanmu agak miring. Kalimat yang sopan dan baik adalah ....', 'Kolasemu bagus. Lain kali ditempel lebih lurus, ya.', ['Kolasemu miring, jelek sekali!', 'Kolaseku jauh lebih bagus darimu.', 'Kolase seperti itu tidak perlu dilihat.'], kisi='SR4b',
       konteks='Kita boleh memberi saran, tetapi harus dengan kata sopan dan mulai dari hal yang baik. Tanyakan pada anak: kalau temanmu bilang begitu padamu, kamu senang atau sedih? Kalimat yang membuat teman mau memperbaiki karyanya adalah pilihan yang tepat.'),
    pg('Hal yang perlu kita perhatikan saat melihat karya seni rupa adalah ....', 'judul, warna, dan bagian yang kita sukai', ['berat dan harga karya', 'nama ibu pembuatnya', 'suara dan nada lagunya'], kisi='SR5a',
       konteks='Saat melihat karya seni rupa, kita memperhatikan judul, warna, bentuk, garis, bahan, dan bagian yang paling disukai. Ajak anak menatap satu gambar lalu bertanya: apa judulnya, warna apa saja, bagian mana yang paling bagus?'),
    pg('Bayu menggambar perahu yang ia naiki bersama ayah ketika liburan. Sumber idenya adalah ....', 'pengalaman pribadi', ['imajinasi', 'lingkungan sekitar', 'warna krayon'], kisi='SR5b',
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
    uraian('Pilih satu sumber ide (imajinasi, pengalaman pribadi, atau lingkungan sekitar). Tulis apa yang akan kamu gambar dari sumber itu.',
           'Dari pengalaman pribadi, aku akan menggambar pantai tempat aku bermain pasir waktu liburan.',
           [['imajinasi', 'khayalan', 'hayalan', 'pengalaman', 'liburan', 'lingkungan', 'sekitar', 'rumah', 'sekolah', 'taman', 'pantai', 'pernah'], ['gambar', 'menggambar', 'melukis', 'membuat', 'buat', 'akan']], minimal=2, kisi='SR5b',
           konteks='Anak memilih satu sumber ide lalu menyebut gambar yang akan dibuat. Bantu dengan contoh: imajinasi (kucing bersayap), pengalaman (liburan ke pantai), lingkungan (pohon di depan rumah). Pastikan isi gambarnya cocok dengan sumber yang dipilih.'),
]

PAKET = [paket1, paket2, paket3]
