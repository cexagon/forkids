"""PJOK kelas 2, ASAS ganjil. PAKET = [paket1, paket2, paket3]; tiap paket 6 pg, 6 isian, 3 uraian."""
from _alat import *

# kata sambung yang boleh muncul di antara istilah dan artinya pada uraian lokomotor/nonlokomotor
_ANTARA = ['', 'itu ', 'adalah ', 'yaitu ', 'ialah ', 'gerak ', 'adalah gerak ', 'yaitu gerak ', 'itu gerak ', 'ialah gerak ', 'gerak yang ', 'adalah gerak yang ',
           'yaitu gerak yang ', 'itu gerak yang ', 'membuat badan ', 'membuat tubuh ', 'bergerak ', 'dilakukan ', 'geraknya ', 'itu geraknya ', 'gerakannya ']

# ---------- figur gerak tambahan (viewBox 160x180, sama dengan orang()) ----------
OR = '#E8742A'
LANTAI = lambda y=170, x1=15, x2=145: f'<path d="M{x1} {y} H{x2}" stroke-width="4"/>'
MATA = lambda x, y: f'<circle cx="{x}" cy="{y}" r="2.5" fill="{INK}" stroke="none"/>'
WAJAH = lambda x, y: (f'<circle cx="{x-5}" cy="{y-3}" r="2.5" fill="{INK}" stroke="none"/><circle cx="{x+5}" cy="{y-3}" r="2.5" fill="{INK}" stroke="none"/>'
                      f'<path d="M{x-5} {y+5} Q{x} {y+9} {x+5} {y+5}" stroke-width="2.5"/>')

def panah(x1, y1, x2, y2, warna=OR):
    a = math.atan2(y2 - y1, x2 - x1); L = 14
    p1 = (x2 - L * math.cos(a - 0.5), y2 - L * math.sin(a - 0.5))
    p2 = (x2 - L * math.cos(a + 0.5), y2 - L * math.sin(a + 0.5))
    return (f'<path d="M{x1} {y1} L{x2} {y2} M{p1[0]:.1f} {p1[1]:.1f} L{x2} {y2} L{p2[0]:.1f} {p2[1]:.1f}" stroke="{warna}" stroke-width="6"/>')

# berdiri tegak, tampak depan
TEGAK = orang(KEPALA(80, 30) + WAJAH(80, 30) + '<path d="M80 45 V110 M80 110 L77 165 M80 110 L83 165 M80 60 L64 104 M80 60 L96 104"/>' + LANTAI())
# berdiri satu kaki, tangan terentang
SATU_KAKI = orang(KEPALA(80, 30) + WAJAH(80, 30) + '<path d="M80 45 V110 M80 110 L78 165 M80 110 L104 130 L86 142 M80 60 L36 64 M80 60 L124 64"/>' + LANTAI())
# duduk bertumpu tangan (tampak samping): kaki lurus ke depan, badan condong ke belakang, kedua tangan menahan di lantai
DUDUK_TANGAN = orang(KEPALA(66, 66) + MATA(73, 63) + '<path d="M66 82 L92 140 M92 140 L148 142 M70 94 L30 140"/>' + LANTAI(150, 10, 155)
                     + f'<circle cx="30" cy="144" r="6" fill="{OR}" stroke="none"/>')
# jongkok (tampak samping)
JONGKOK = orang(KEPALA(94, 64) + MATA(101, 61) + '<path d="M92 79 L84 150 M84 150 L120 126 L112 164 H128 M90 94 L134 102"/>' + LANTAI(168))
# merangkak (tampak samping)
MERANGKAK = orang(KEPALA(32, 70) + MATA(25, 67) + '<path d="M45 82 H115 M50 82 L48 140 M115 82 L112 140 M112 140 H152"/>' + LANTAI(145, 10, 155))
# berjalan mundur: badan menghadap kanan, panah menunjuk ke kiri (belakang)
MUNDUR = orang(KEPALA(96, 30) + MATA(103, 27) + '<path d="M94 45 V105 M94 105 L116 162 M94 105 L74 160 M94 60 L110 96 M94 60 L80 94"/>'
               + LANTAI(166, 10, 150) + panah(70, 124, 14, 124))
# meliukkan badan ke samping
MELIUK = orang('<path d="M80 125 L66 170 M80 125 L94 170 M80 125 L96 72 M95 78 L62 92 L80 114 M95 78 L120 98 L86 112"/>' + KEPALA(102, 54) + WAJAH(102, 54)
               + f'<path d="M48 26 Q14 44 18 86 M8 72 L18 86 L28 72" stroke="{OR}" stroke-width="5"/>'
               + f'<path d="M124 26 Q154 44 148 86 M138 72 L148 86 L158 72" stroke="{OR}" stroke-width="5"/>' + LANTAI(172))

def opsi(gbr):
    return dict(gbr)

# kata kunci yang dipakai berulang
K_SEIMBANG = [['tangan', 'lengan', 'jari'], ['kaki', 'telapak', 'tumit', 'jempol'], ['mata', 'pandangan'], ['badan', 'tubuh', 'perut', 'punggung', 'kepala']]
K_BERSIH = [['sehat', 'sakit', 'penyakit', 'kuman', 'demam', 'diare'], ['nyaman', 'bersih', 'indah', 'asri', 'enak', 'rapi', 'segar'],
            ['iman', 'allah', 'islam', 'perintah', 'agama'], ['bau', 'kotor', 'lalat', 'nyamuk', 'banjir', 'jorok']]

SALAT = ['salat', 'shalat', 'sholat', 'solat', 'sembahyang']
ZUHUR = [f'{s} {z}' for s in SALAT for z in ('zuhur', 'dzuhur', 'duhur', 'lohor')]

# ================================== PAKET 1 ==================================
paket1 = [
    pg('Perhatikan gambar duduk bertumpu tangan. Saat duduk seperti ini, badan ditahan oleh kedua ....',
       'tangan', ['kepala', 'hidung', 'perut'], gambar=[DUDUK_TANGAN], kisi='PJ1',
       bahas='Pada duduk bertumpu tangan, kedua tangan menahan badan di lantai. Titik jingga pada gambar menunjukkan tangan itu.',
       konteks='Duduk bertumpu tangan: duduk di lantai, kaki lurus ke depan, badan condong ke belakang dan kedua tangan menahan di lantai. '
               'Ajak anak mempraktikkannya lalu bertanya, "Bagian mana yang terasa menahan badanmu?" Anak akan merasakan kedua tangannya bekerja menopang badan.'),
    pg('Dina berjongkok, lalu berdiri lagi di tempat yang sama. Gerak ini disebut gerak ....',
       'nonlokomotor', ['lokomotor', 'manipulatif', 'gerak air'], gambar=[JONGKOK, TEGAK], kisi='PJ1',
       bahas='Gerak nonlokomotor dilakukan di tempat tanpa berpindah. Jongkok dan berdiri termasuk gerak ini.',
       konteks='Ada tiga gerak dasar. Lokomotor: badan pindah tempat (berjalan, berlari). Nonlokomotor: badan bergerak di tempat (jongkok, berdiri, membungkuk). '
               'Manipulatif: bergerak memakai benda (melempar bola). Minta anak berjongkok dan berdiri, lalu tanyakan, "Apakah kakimu pindah tempat?" Jawabannya tidak, jadi geraknya nonlokomotor.'),
    pg('Eko berlari dari ujung lapangan ke ujung lainnya. Gerak berlari termasuk gerak ....',
       'lokomotor', ['nonlokomotor', 'manipulatif', 'berirama'], gambar=[BERLARI], kisi='PJ1',
       bahas='Berlari membuat badan berpindah tempat, jadi termasuk gerak lokomotor.',
       konteks='Lokomotor artinya gerak yang membuat badan berpindah tempat, seperti berjalan, berlari, dan melompat. '
               'Ajak anak berlari kecil dari satu sudut ruang ke sudut lain, lalu tanyakan, "Badanmu tadi pindah tempat atau tetap di tempat?" Karena pindah, geraknya termasuk lokomotor.'),
    pg('Musik senam diputar dengan ketukan yang pelan dan teratur. Gerakan yang sesuai dengan musik itu adalah ....',
       'gerakan pelan yang mengikuti ketukan', ['berlari kencang ke segala arah', 'diam saja tanpa bergerak', 'berguling-guling tanpa memperhatikan musik'],
       gambar=[img('musical-note')], kisi='PJ2',
       bahas='Pada gerak berirama, kecepatan gerakan disesuaikan dengan ketukan musik. Musik pelan berarti gerakan pelan.',
       konteks='Dalam gerak berirama, tubuh menyesuaikan diri dengan musik: musik pelan dibalas gerakan pelan, musik cepat dibalas gerakan cepat. '
               'Putar satu lagu pelan di rumah dan ajak anak bergerak mengikutinya, lalu tanyakan apakah gerakannya cocok dengan lagu itu.'),
    pg('Bersepeda baik untuk melatih kekuatan otot ....',
       'kaki', ['telinga', 'pipi', 'rambut'], gambar=[img('bicycle')], kisi='PJ3',
       bahas='Saat mengayuh pedal, otot kaki bekerja dan menjadi kuat.',
       konteks='Bersepeda adalah latihan kebugaran. Kaki mengayuh pedal terus-menerus sehingga otot kaki menjadi kuat. '
               'Tanyakan kepada anak, "Saat naik sepeda, bagian tubuh mana yang paling bergerak dan terasa pegal sesudahnya?"'),
    pg('Sesuai ajaran Islam, perbuatan yang menjaga kebersihan lingkungan adalah ....',
       'membuang sampah pada tempatnya', ['membuang bungkus jajan di halaman', 'mencoret-coret dinding kelas', 'membiarkan sampah di kolong meja'],
       gambar=[img('wastebasket')], kisi='PJ3',
       bahas='Islam mengajarkan bahwa kebersihan sebagian dari iman. Sampah dibuang ke tempat sampah.',
       konteks='Dalam Islam, menjaga kebersihan adalah bagian dari iman, termasuk kebersihan lingkungan. Ajak anak membayangkan halaman sekolah yang penuh bungkus jajan, lalu tanyakan mana yang membuat halaman jadi bersih. '
               'Pilihan yang benar adalah yang merapikan, bukan yang mengotori.'),
    pg('Dika berlari kecil mengelilingi halaman setiap pagi. Manfaat kegiatan ini adalah ....',
       'badan menjadi bugar dan sehat', ['badan menjadi cepat lemas', 'jantung menjadi lemah', 'napas menjadi pendek terus'],
       gambar=[img('person-running')], kisi='PJ3',
       bahas='Lari kecil yang rutin melatih jantung dan paru-paru sehingga badan bugar dan sehat.',
       konteks='Lari kecil adalah olahraga ringan yang dilakukan dengan santai. Jika rutin, jantung dan paru-paru terlatih sehingga badan terasa bugar. '
               'Tanyakan kepada anak, "Setelah rutin bergerak, badan terasa lebih segar atau lebih lemas?" Pilihan yang menyebut lemah atau lemas bertentangan dengan manfaat olahraga.'),
    pg('Latihan mengapung di air bertujuan agar kita ....',
       'bisa berbaring tenang di atas air', ['bisa menyelam sampai dasar kolam', 'cepat lelah dan tenggelam', 'tidak perlu ditemani orang dewasa'],
       gambar=[img('water-wave')], kisi='PJ4',
       bahas='Mengapung melatih badan tetap berada di permukaan air, tenang, dan tidak takut air.',
       konteks='Mengapung adalah latihan dasar air: badan dibiarkan rileks sehingga terapung di permukaan, dengan dibantu orang dewasa. Tujuannya agar anak tenang dan tidak takut air. '
               'Bandingkan dengan sehelai daun yang mengambang di air bila tidak digerak-gerakkan.'),
    pg('Mengapa kita berdoa sebelum berolahraga?',
       'karena kita ingat Allah swt. yang memberi badan sehat', ['supaya kita selalu menang dalam permainan', 'supaya tidak perlu melakukan pemanasan', 'supaya teman-teman takut kepada kita'],
       gambar=[img('folded-hands')], kisi='PJ5',
       bahas='Berdoa membuat kita mengingat Allah swt. dan bersyukur atas badan yang sehat.',
       konteks='Sebelum kegiatan, muslim memulai dengan doa (misalnya membaca basmalah) sebagai tanda mengingat Allah swt. dan meminta kelancaran serta keselamatan. '
               'Tanyakan kepada anak, "Siapa yang memberi kita kaki untuk berlari?" Dari situ anak akan paham doa adalah rasa syukur dan ingat kepada Allah swt., bukan jaminan menang.'),
    pg('Teman sekelompok Dito kesulitan membawa bola-bola besar ke gudang. Sikap yang baik bagi Dito adalah ....',
       'membantu membawanya', ['membiarkannya sendirian', 'menertawakannya', 'pergi bermain sendiri'], kisi='PJ5',
       bahas='Membantu teman yang kesulitan adalah sikap tolong-menolong dan kerja sama.',
       konteks='Dalam kegiatan kelompok, anak belajar bekerja sama dan tolong-menolong. Ajak anak membayangkan temannya membawa barang berat, lalu tanyakan apa yang ia harapkan dilakukan temannya jika ia yang kesulitan. '
               'Pilihan yang benar adalah yang meringankan beban teman.'),

    isian('Saat berdiri dengan satu kaki, Dika merentangkan kedua tangannya ke samping. Tangan direntangkan agar badan tidak ....',
          ['jatuh', 'terjatuh', 'goyang', 'oleng', 'goyah', 'limbung', 'miring'], gambar=[SATU_KAKI], kisi='PJ1',
          bahas='Tangan yang direntangkan membantu badan tetap seimbang, jadi tidak jatuh.',
          konteks='Merentangkan tangan seperti tongkat penyeimbang pada pemain akrobat. Ajak anak berdiri satu kaki dengan tangan di samping badan, lalu dengan tangan direntangkan. '
                  'Mana yang lebih mudah? Dari situ anak akan menyebut apa yang dicegah oleh tangan yang terentang.'),
    isian('Ayah melempar bola kepada Bima. Bima menerima bola itu dengan kedua tangannya. Gerakan Bima disebut ....',
          ['menangkap', 'menangkap bola', 'tangkap', 'tangkap bola'], gambar=[img('soccer-ball')], kisi='PJ1',
          bahas='Menerima bola dengan kedua tangan disebut menangkap. Menangkap termasuk gerak manipulatif.',
          konteks='Menangkap bola adalah gerak manipulatif, yaitu gerak yang memakai benda. Ajak anak bermain lempar-tangkap dengan bola kecil. '
                  'Setelah itu tanyakan, "Apa yang kamu lakukan dengan bola ketika Ibu melemparnya?" Kata kerjanya berawalan "me-" dan berarti menerima bola dengan tangan.'),
    isian('Rani melangkah ke arah belakang tanpa berbalik badan. Gerakan Rani disebut berjalan ....',
          ['mundur', 'berjalan mundur'], gambar=[MUNDUR], kisi='PJ1',
          bahas='Berjalan ke arah belakang disebut berjalan mundur. Panah pada gambar menunjuk ke belakang.',
          konteks='Berjalan mundur adalah gerak lokomotor, karena badan berpindah tempat, tetapi arahnya ke belakang. Ajak anak berjalan ke depan lalu ke belakang dengan hati-hati. '
                  'Lawan kata "maju" akan membantu anak menemukan jawabannya.'),
    isian('Perhatikan gambar. Dika menolak lantai dengan kedua kakinya sehingga badannya terangkat. Gerakan Dika disebut ....',
          ['melompat', 'lompat', 'meloncat', 'loncat'], gambar=[MELOMPAT], kisi='PJ1',
          bahas='Menolak lantai dengan kaki sehingga badan terangkat disebut melompat. Melompat termasuk gerak lokomotor.',
          konteks='Melompat adalah gerak lokomotor: badan terangkat dari lantai lalu mendarat di tempat lain. '
                  'Ajak anak melompat melewati garis selotip di lantai dan tanyakan, "Apa nama gerakan yang tadi kamu lakukan?" Kata yang dicari berawalan "me-".'),
    isian('Setelah berolahraga badan berkeringat. Cairan tubuh yang hilang diganti dengan minum air ....',
          ['putih', 'air putih'], kisi='PJ3',
          bahas='Air putih menggantikan cairan tubuh yang keluar sebagai keringat.',
          konteks='Saat berkeringat, tubuh kehilangan cairan, jadi kita perlu minum untuk menggantinya. Air putih adalah minuman terbaik karena tidak mengandung gula berlebih. '
                  'Tanyakan, "Setelah berlari, kamu ingin minum apa supaya segar dan sehat?"'),
    isian('Setelah bermain di lapangan, kita mencuci tangan dengan air dan .... agar kuman hilang.',
          ['sabun', 'sabun cuci tangan'], gambar=[img('soap')], kisi='PJ3',
          bahas='Mencuci tangan memakai air dan sabun membersihkan kuman sehingga kita tidak mudah sakit.',
          konteks='Mencuci tangan dengan sabun adalah kebiasaan hidup bersih dan sehat. Kuman tidak terlihat, tetapi sabun membantu mengangkatnya. '
                  'Tanyakan kepada anak, "Benda apa di dekat keran yang berbusa dan harum?" Dari situ anak dapat menjawabnya.'),
    isian('Agar aman, anak-anak belajar gerak dasar di kolam renang yang ... dan selalu ditemani orang dewasa.',
          ['dangkal', 'cetek', 'tidak dalam', 'kolam dangkal'], gambar=[img('person-swimming')], kisi='PJ4',
          bahas='Gerak dasar aktivitas air (membasahi tubuh, mengapung) dilatih di kolam dangkal dan ditemani orang dewasa.',
          konteks='Keselamatan adalah aturan pertama aktivitas air. Anak yang belajar membasahi tubuh dan mengapung berlatih di kolam yang airnya hanya setinggi pinggang atau dada, bukan di kolam dalam. '
                  'Tanyakan kepada anak, "Kolam seperti apa yang aman untuk anak yang baru belajar: yang dalam atau yang airnya rendah?"'),
    isian('Teman-teman antre menunggu giliran melempar bola. Rudi tidak menyerobot dan menunggu dengan tenang. Sikap Rudi disebut s.... (huruf awalnya s).',
          ['sabar', 'bersabar', 'sabar menunggu'], kisi='PJ5',
          bahas='Menunggu giliran dengan tenang adalah sikap sabar.',
          konteks='Sabar berarti mau menunggu dan menahan diri tanpa marah atau menyerobot. Contohnya menunggu giliran saat bermain bersama. '
                  'Tanyakan kepada anak bagaimana rasanya ketika ada teman menyerobot, lalu apa yang sebaiknya kita lakukan.'),
    isian('Anak muslim tetap menutup .... saat memakai pakaian olahraga.',
          ['aurat'], kisi='PJ5',
          bahas='Menutup aurat wajib bagi muslim, juga saat berolahraga.',
          konteks='Aurat adalah bagian tubuh yang wajib ditutup menurut ajaran Islam. Walaupun sedang olahraga dan berkeringat, kewajiban ini tetap berlaku, sehingga pakaian olahraga dipilih yang sopan. '
                  'Ajak anak menyebut kata yang artinya bagian tubuh yang harus ditutup.'),
    isian('Rina dapat berolahraga dengan badan yang sehat. Sikap berterima kasih kepada Allah swt. atas nikmat sehat itu disebut ....',
          ['syukur', 'bersyukur', 'bersyukur kepada allah', 'rasa syukur'], kisi='PJ5',
          bahas='Berterima kasih kepada Allah swt. atas nikmat yang diberikan disebut syukur.',
          konteks='Syukur berarti berterima kasih kepada Allah swt. atas semua nikmat, termasuk badan yang sehat. Tanyakan kepada anak nikmat apa yang ia rasakan hari ini, lalu apa yang sebaiknya ia ucapkan atau lakukan. '
                  'Kata yang dicari adalah nama sikap berterima kasih itu.'),

    uraian('Sebutkan dua bagian tubuh yang membantu kita menjaga keseimbangan saat berdiri dengan satu kaki.',
           'Kaki yang menahan badan dan tangan yang direntangkan ke samping. Mata yang melihat lurus ke depan juga membantu.',
           K_SEIMBANG, minimal=2, kisi='PJ1', gambar=[SATU_KAKI],
           bahas='Kaki sebagai tumpuan, tangan sebagai penyeimbang, dan mata menatap satu titik membantu badan tetap seimbang.',
           konteks='Keseimbangan dijaga oleh beberapa bagian tubuh sekaligus. Ajak anak berdiri satu kaki, lalu coba tutup mata atau tangan diturunkan, dan tanyakan apa yang berubah. '
                   'Dengan begitu anak akan menemukan sendiri bagian tubuh mana yang bekerja, misalnya kaki, tangan, dan mata.'),
    uraian('Apa yang dimaksud dengan gerak manipulatif? Sebutkan satu contohnya.',
           'Gerak manipulatif adalah gerak yang memakai atau memainkan benda, misalnya melempar bola.',
           [['benda', 'alat', 'memainkan', 'memegang', 'menggunakan', 'memakai', 'mengolah'],
            ['melempar', 'menangkap', 'menendang', 'memukul', 'memantulkan', 'menggiring', 'mengoper', 'mengumpan', 'lempar', 'tangkap', 'tendang', 'pukul']],
           minimal=2, kisi='PJ1', gambar=[img('soccer-ball')],
           bahas='Gerak manipulatif memakai benda, misalnya melempar, menangkap, atau menendang bola.',
           konteks='Manipulatif berasal dari kata "memanipulasi", yaitu memainkan sesuatu dengan tangan atau kaki. Ajak anak bermain dengan bola atau gulungan kaus kaki, lalu tanyakan apa yang ia lakukan dengan benda itu. '
                   'Jawaban yang baik memuat penjelasan (memakai benda) dan satu contoh (melempar, menangkap, menendang).'),
    uraian('Teman-teman bersenam di halaman sekolah dengan iringan musik. Sebutkan tiga anggota tubuh yang bergerak saat bersenam.',
           'Tangan, kaki, dan kepala bergerak mengikuti irama musik. Badan dan pinggang juga ikut bergoyang.',
           [['tangan', 'lengan', 'jari'], ['kaki', 'lutut', 'telapak'], ['kepala', 'leher'], ['badan', 'pinggang', 'pinggul', 'perut', 'bahu', 'punggung']],
           minimal=3, kisi='PJ2', gambar=[img('musical-note'), MELIUK],
           bahas='Saat gerak berirama, tangan, kaki, kepala, dan badan bergerak sesuai ketukan musik.',
           konteks='Gerak berirama adalah gerak yang mengikuti ketukan musik. Putar sebuah lagu riang dan ajak anak bergerak. '
                   'Setelah itu tanyakan, "Bagian tubuh apa saja yang tadi bergerak?" Biarkan anak menunjuk dan menyebutnya satu per satu.'),
    uraian('Mengapa kita harus menjaga kebersihan lingkungan di sekitar rumah? Jelaskan alasanmu.',
           'Supaya kita sehat, tidak ada bau dan kuman, dan tempat tinggal kita nyaman. Islam juga mengajarkan bahwa kebersihan sebagian dari iman.',
           K_BERSIH, minimal=1, kisi='PJ3',
           bahas='Lingkungan bersih membuat kita sehat dan nyaman, dan sesuai ajaran Islam.',
           konteks='Bantu anak membandingkan dua tempat: halaman yang penuh sampah dan halaman yang bersih. Tanyakan mana yang berbau, mana yang mengundang lalat dan nyamuk, dan mana yang enak dipakai bermain. '
                   'Dari situ anak dapat menjelaskan alasan menjaga kebersihan, dan Anda bisa menambahkan bahwa kebersihan sebagian dari iman.'),
    uraian('Mengapa kita tidak boleh menunda salat meskipun sedang asyik bermain bola? Jelaskan.',
           'Karena salat adalah perintah Allah swt. yang wajib dikerjakan tepat waktu. Kita harus berhenti bermain saat azan berkumandang.',
           [['perintah', 'wajib', 'kewajiban', 'allah', 'iman', 'agama', 'tiang', 'islam'],
            ['tepat waktu', 'waktunya', 'azan', 'adzan', 'tidak lalai', 'berhenti']],
           minimal=1, kisi='PJ5', gambar=[img('mosque')],
           bahas='Salat adalah kewajiban yang harus dikerjakan tepat waktu, jadi permainan tidak boleh membuatnya tertunda.',
           konteks='Salat lima waktu adalah perintah Allah swt. yang waktunya sudah ditentukan. Tanyakan kepada anak, "Kalau azan sudah terdengar tetapi kita masih bermain, apa yang sebaiknya kita lakukan?" '
                   'Jawaban cukup menyebut bahwa salat adalah perintah atau kewajiban, atau harus dikerjakan pada waktunya.'),
]

# ================================== PAKET 2 ==================================
paket2 = [
    pg('Saat bermain bola bersama kelompok, Dani melempar bola ke temannya. Gerak melempar bola termasuk gerak ....',
       'manipulatif', ['lokomotor', 'nonlokomotor', 'keseimbangan'], gambar=[img('soccer-ball')], kisi='PJ1',
       bahas='Gerak yang memakai benda, seperti melempar bola, disebut gerak manipulatif.',
       konteks='Gerak manipulatif adalah gerak yang memainkan benda, misalnya melempar, menangkap, menendang, atau memukul bola. '
               'Ajak anak melempar bola kecil ke Anda lalu tanyakan, "Kamu bergerak memakai apa?" Karena ada benda yang dimainkan, jawabannya gerak yang memanipulasi benda.'),
    pg('Gerak nonlokomotor dilakukan di tempat tanpa berpindah. Contohnya adalah ....',
       'jongkok lalu berdiri di tempat', ['berlari mengelilingi lapangan', 'berjalan ke kantin', 'merangkak di bawah meja'], kisi='PJ1',
       bahas='Jongkok dan berdiri di tempat tidak membuat badan berpindah. Berlari, berjalan, dan merangkak berpindah tempat.',
       konteks='Nonlokomotor berarti badan bergerak tetapi tetap di tempatnya. Minta anak mencoba setiap pilihan satu per satu dan perhatikan apakah kakinya berpindah tempat. '
               'Pilihan yang membuat anak tetap di titik yang sama adalah jawabannya.'),
    pg('Dina berlatih berdiri dengan satu kaki. Agar badannya tidak mudah goyang, pandangan matanya sebaiknya ....',
       'tertuju pada satu titik di depan', ['berpindah-pindah dengan cepat', 'dipejamkan rapat-rapat', 'menoleh ke belakang terus'], gambar=[SATU_KAKI], kisi='PJ1',
       bahas='Menatap satu titik di depan membantu badan tetap seimbang saat berdiri dengan satu kaki.',
       konteks='Keseimbangan dibantu oleh mata. Ajak anak berdiri satu kaki sambil menatap satu titik di dinding, lalu mencoba dengan mata terpejam atau menoleh ke sana kemari. '
               'Tanyakan mana yang paling mudah. Anak akan menemukan bahwa pandangan yang tetap membuat badan stabil.'),
    pg('Bu Guru memutar lagu riang dan anak-anak menggerakkan tangan dan kaki sesuai irama. Kegiatan ini disebut ....',
       'gerak berirama', ['lari cepat', 'lempar tangkap bola', 'lompat jauh'], gambar=[img('musical-note')], kisi='PJ2',
       bahas='Gerak yang mengikuti irama musik disebut gerak berirama.',
       konteks='Gerak berirama adalah gerak tubuh yang mengikuti ketukan atau irama musik, seperti senam atau menari. '
               'Putar lagu yang disukai anak, lalu tanyakan kegiatan apa yang cocok dengan lagu itu, dan apakah ada musik pada lari cepat atau lompat jauh.'),
    pg('Sebelum bermain di dalam kelas, kita menggeser meja dan kursi ke pinggir. Tujuannya agar ....',
       'kita tidak tersandung dan bermain dengan nyaman', ['kelas terlihat kosong dan sepi', 'teman-teman cepat pulang', 'meja menjadi cepat rusak'], kisi='PJ3',
       bahas='Ruang yang tertata membuat bermain lebih aman dan nyaman.',
       konteks='Menata ruang sebelum bermain berarti memindahkan benda yang bisa menghalangi atau melukai. Tanyakan kepada anak, "Kalau ada kursi di tengah, lalu kita berlari, apa yang bisa terjadi?" '
               'Dari situ anak akan paham bahwa menata ruang bertujuan untuk keselamatan dan kenyamanan.'),
    pg('Sesudah bermain di lapangan, Alya mencuci tangan dengan sabun. Tujuannya agar ....',
       'kuman hilang dan ia tidak mudah sakit', ['tangannya menjadi lebih panjang', 'lapangan menjadi lebih luas', 'bola menjadi lebih ringan'], gambar=[img('soap')], kisi='PJ3',
       bahas='Mencuci tangan dengan sabun menghilangkan kuman sehingga kita terhindar dari penyakit.',
       konteks='Setelah bermain, tangan menempel banyak kotoran dan kuman yang tidak terlihat. Mencuci tangan dengan sabun mengangkatnya. '
               'Tanyakan kepada anak, "Kalau tangan kotor lalu langsung makan, apa yang bisa terjadi?" Dari situ ia akan memilih tujuan yang berkaitan dengan kesehatan.'),
    pg('Dalam ajaran Islam, kebersihan adalah sebagian dari ....',
       'iman', ['harta', 'permainan', 'pelajaran'], kisi='PJ3',
       bahas='Islam mengajarkan bahwa kebersihan sebagian dari iman, jadi menjaga bersih badan dan lingkungan adalah ibadah.',
       konteks='Ada ungkapan yang dikenal umat Islam: kebersihan sebagian dari iman. Artinya, menjaga badan, pakaian, dan lingkungan tetap bersih adalah bagian dari keimanan. '
               'Hubungkan dengan kebiasaan di rumah seperti mencuci tangan dan membuang sampah, lalu tanyakan kepada anak kata yang menyambung ungkapan itu.'),
    pg('Saat belajar mengapung di kolam dangkal, badan sebaiknya dibuat ....',
       'santai dan tidak tegang', ['kaku dan tegang', 'meronta-ronta dengan keras', 'ditekuk sekuat tenaga'], gambar=[img('person-swimming')], kisi='PJ4',
       bahas='Badan yang santai dan tidak tegang lebih mudah terapung di permukaan air.',
       konteks='Orang yang tegang cenderung tenggelam, sedangkan badan yang rileks mudah terapung. Itu sebabnya guru renang selalu meminta anak tenang. '
               'Bandingkan dengan sehelai daun yang mengambang karena tidak "melawan" air. Latihan ini hanya dilakukan di kolam dangkal dengan ditemani orang dewasa.'),
    pg('Dina dapat menangkap bola dengan baik. Ia bersyukur dengan mengucapkan ....',
       'Alhamdulillah', ['Bismillah', 'Astagfirullah', 'Assalamualaikum'], kisi='PJ5',
       bahas='Alhamdulillah artinya segala puji bagi Allah swt. Itu ucapan syukur.',
       konteks='Setiap kalimat dalam Islam punya saat pengucapannya. Bismillah dibaca untuk memulai, Alhamdulillah untuk bersyukur, Astagfirullah untuk memohon ampun, dan Assalamualaikum untuk salam. '
               'Tanyakan, "Kalau kita senang dan berterima kasih kepada Allah, kita bilang apa?"'),
    pg('Sebelum latihan senam, Bu Guru mengajak berdoa. Berdoa sebelum kegiatan adalah cara kita ....',
       'mengingat Allah swt. dan memohon kelancaran', ['memamerkan kekuatan', 'mengejek lawan', 'membuat teman menunggu'], gambar=[img('folded-hands')], kisi='PJ5',
       bahas='Doa mengingatkan kita kepada Allah swt. dan kita memohon keselamatan.',
       konteks='Berdoa sebelum kegiatan adalah bentuk mengingat Allah swt. dan memohon kelancaran dan keselamatan. '
               'Ajak anak membaca bismillah sebelum makan atau belajar, lalu tanyakan mengapa kita melakukannya. Pengecoh pada soal ini adalah sikap sombong, jadi tidak cocok.'),

    isian('Bayi bergerak maju dengan tangan dan lututnya. Gerak ini termasuk gerak .... (lokomotor atau nonlokomotor)',
          ['lokomotor'], gambar=[MERANGKAK], kisi='PJ1',
          bahas='Merangkak membuat badan berpindah tempat, jadi termasuk gerak lokomotor.',
          konteks='Lokomotor berarti berpindah tempat, dan merangkak membuat badan bergerak maju. '
                  'Tanyakan kepada anak, "Apakah bayi tetap di tempat atau pindah ke depan?" Setelah itu minta anak memilih dari dua kata di akhir soal.'),
    isian('Saat berjalan di atas papan titian, Rani merentangkan kedua tangannya agar badannya tetap ....',
          ['seimbang', 'imbang', 'berimbang', 'stabil'], kisi='PJ1',
          bahas='Tangan terentang membantu badan tetap seimbang.',
          konteks='Papan titian itu sempit, jadi badan mudah goyang. Orang yang berjalan di tali atau papan sempit biasanya merentangkan tangan agar tidak jatuh. '
                  'Ajak anak mencoba berjalan di garis lantai dengan tangan terentang dan tanyakan apa yang dirasakan badannya.'),
    isian('Gerak manipulatif pada permainan lempar tangkap ada dua: melempar dan .... bola.',
          ['menangkap', 'menangkap bola', 'tangkap', 'tangkap bola'], gambar=[img('soccer-ball')], kisi='PJ1',
          bahas='Dalam permainan lempar tangkap, ada yang melempar dan ada yang menangkap.',
          konteks='Dalam permainan lempar tangkap, satu anak melempar dan anak lain menerima bola dengan kedua tangan. '
                  'Mainkan sebentar dengan bola kecil, lalu tanyakan, "Kalau Ibu melempar, kamu melakukan apa dengan tanganmu?"'),
    isian('Rafi berlatih berjalan mundur. Agar tidak terjatuh, ia melangkah dengan ....',
          ['pelan', 'pelan-pelan', 'pelan pelan', 'perlahan', 'perlahan-lahan', 'hati-hati', 'hati hati', 'langkah kecil', 'langkah pendek', 'pelan dan hati-hati'], kisi='PJ1',
          bahas='Berjalan mundur dilakukan dengan langkah pelan dan hati-hati agar badan tetap seimbang dan tidak terjatuh.',
          konteks='Berjalan mundur melatih keseimbangan karena kita tidak melihat arah langkah. Ajak anak berjalan mundur di ruangan yang lapang, sekali cepat dan sekali pelan, lalu tanyakan mana yang membuatnya lebih mantap. '
                  'Jawaban berupa cara melangkah, misalnya pelan atau hati-hati.'),
    isian('Lari kecil melatih kerja jantung dan .... kita.',
          ['paru-paru', 'paru paru', 'paru', 'paruparu'], kisi='PJ3',
          bahas='Lari kecil membuat jantung dan paru-paru bekerja lebih kuat. Paru-paru dipakai untuk bernapas.',
          konteks='Lari kecil adalah olahraga ringan yang melatih ketahanan. Saat berlari kecil, jantung berdetak lebih cepat dan kita bernapas lebih dalam. '
                  'Ajak anak meletakkan tangan di dada setelah berlari lalu tanyakan, "Bagian dalam tubuh mana yang bekerja untuk bernapas?"'),
    isian('Agar gigi sehat, kita menyikat gigi paling sedikit ... kali sehari.',
          ['2', 'dua', '2 kali', 'dua kali'], gambar=[img('toothbrush')], kisi='PJ3',
          bahas='Menyikat gigi paling sedikit dua kali sehari (pagi dan malam sebelum tidur) menjaga gigi dan mulut tetap sehat.',
          konteks='Menyikat gigi, mandi, dan mencuci tangan adalah kebiasaan hidup sehat dan bersih. Gigi disikat paling sedikit pada pagi hari dan malam sebelum tidur. '
                  'Tanyakan kepada anak kapan saja ia menyikat gigi dalam sehari, lalu hitung bersama.'),
    isian('Sebelum masuk kolam renang, kita .... tubuh dengan air agar tidak kaget.',
          ['membasahi', 'basahi', 'membasahi tubuh', 'dibasahi', 'menyiram', 'siram', 'membasuh', 'mengguyur'], gambar=[img('shower')], kisi='PJ4',
          bahas='Tubuh dibasahi dulu agar terbiasa dengan suhu air.',
          konteks='Sebelum berenang, tubuh dibasahi, misalnya di pancuran, agar badan terbiasa dengan suhu air dan tidak kaget. '
                  'Ingatkan saat anak mandi: tubuh dibuat basah dulu sebelum disabun. Kata yang dicari berarti membuat tubuh menjadi basah.'),
    isian('Azan Zuhur berkumandang saat Fahri bermain bola. Fahri berhenti bermain, lalu .... tepat waktu.',
          SALAT + ZUHUR, kisi='PJ5',
          bahas='Salat harus dikerjakan tepat waktu, juga saat sedang bermain atau berolahraga.',
          konteks='Salat adalah kewajiban yang tidak boleh ditunda hanya karena sedang bermain atau berolahraga. Setelah azan, kita berhenti dan bersiap. '
                  'Tanyakan kepada anak apa yang dilakukan ayah atau ibu ketika mendengar azan, lalu minta ia menyebutkan kegiatan itu.'),
    isian('Sebelum memulai permainan, Hana membaca doa pendek dengan mengucapkan kata pembuka b.... (huruf awalnya b).',
          ['bismillah', 'basmalah', 'bismillahirrahmanirrahim', 'bismillahirrahmanirrahiim', 'bismillahirrohmanirrohim'], kisi='PJ5',
          bahas='Kata pembuka sebelum memulai kegiatan adalah bismillah.',
          konteks='Bismillah artinya dengan menyebut nama Allah. Kalimat ini diucapkan untuk memulai kegiatan yang baik, termasuk bermain dan berolahraga. '
                  'Tanyakan kepada anak apa yang ia ucapkan sebelum makan atau belajar. Kalimat itu juga yang dibaca sebelum memulai permainan.'),
    isian('Beberapa anak mengangkat matras yang berat secara bersama-sama. Mereka bekerja ....',
          ['sama', 'bekerja sama', 'kerja sama', 'bekerjasama', 'kerjasama'], kisi='PJ5',
          bahas='Saling membantu untuk menyelesaikan pekerjaan bersama disebut bekerja sama.',
          konteks='Kerja sama berarti beberapa orang mengerjakan sesuatu bersama-sama dan saling membantu. Beri anak sebuah benda yang agak berat, lalu minta ia membawanya bersama saudara atau Anda. '
                  'Tanyakan apa yang membuat benda itu terasa ringan. Kata terakhir pada soal melengkapi "bekerja ...".'),

    uraian('Sebutkan tiga contoh gerak lokomotor (gerak berpindah tempat).',
           'Berjalan, berlari, dan melompat. Merangkak dan berjingkat juga gerak lokomotor.',
           [['berjalan', 'jalan'], ['berlari', 'lari'], ['melompat', 'lompat', 'meloncat', 'loncat'], ['merangkak', 'rangkak'], ['berjingkat', 'jinjit', 'jingkat'], ['mundur', 'berjalan mundur']],
           minimal=3, kisi='PJ1', gambar=[MELOMPAT],
           bahas='Gerak lokomotor membuat badan berpindah tempat, misalnya berjalan, berlari, dan melompat.',
           konteks='Lokomotor berarti "berpindah tempat". Ajak anak berpindah dari ujung ruang ke ujung lainnya dengan cara berbeda-beda, dan tanyakan apa nama setiap cara itu. '
                   'Jawaban yang benar adalah gerak yang membuat badan pindah, seperti berjalan, berlari, melompat, atau merangkak.'),
    uraian('Sebutkan dua contoh gerak nonlokomotor (gerak di tempat).',
           'Membungkuk dan meliukkan badan. Mengayunkan tangan, jongkok, dan berdiri juga gerak nonlokomotor.',
           [['membungkuk', 'bungkuk'], ['meliuk', 'meliukkan', 'meliuk-liuk'], ['mengayun', 'ayun', 'mengayunkan'], ['jongkok', 'berjongkok', 'berdiri'],
            ['memutar', 'berputar', 'putar'], ['meregangkan', 'peregangan'], ['menekuk', 'tekuk'], ['mengangguk', 'menggeleng']],
           minimal=2, kisi='PJ1', gambar=[MELIUK],
           bahas='Gerak nonlokomotor dilakukan di tempat, misalnya membungkuk, meliuk, mengayun, dan jongkok.',
           konteks='Nonlokomotor berarti badan bergerak tetapi tidak berpindah tempat. Minta anak berdiri di satu titik lalu melakukan sebanyak mungkin gerakan tanpa melangkah. '
                   'Setiap gerakan yang ia temukan, misalnya membungkuk atau meliuk, boleh menjadi jawaban.'),
    uraian('Bu Guru memutar musik senam yang cepat dan ceria. Bagaimana gerakan kita agar sesuai dengan musik itu? Jelaskan.',
           'Gerakan kita menjadi cepat dan bersemangat mengikuti ketukan musik.',
           [['cepat', 'lincah', 'gesit', 'kencang', 'bersemangat', 'semangat', 'riang', 'gembira', 'ceria']],
           minimal=1, kisi='PJ2', gambar=[img('musical-note'), img('drum')],
           bahas='Musik yang cepat diikuti dengan gerakan yang cepat dan bersemangat.',
           konteks='Dalam gerak berirama, kecepatan gerakan mengikuti kecepatan musik. Putar lagu yang cepat dan lagu yang pelan, lalu minta anak bergerak mengikuti keduanya. '
                   'Tanyakan apa yang berubah pada gerakannya saat lagunya berganti. Jawaban yang tepat menyebut gerakannya cepat atau bersemangat.'),
    uraian('Nabila melihat sampah berserakan di halaman sekolah. Mengapa sampah itu harus dibuang ke tempat sampah? Jelaskan.',
           'Supaya halaman sekolah bersih dan nyaman dipakai bermain, tidak bau, dan kita tidak mudah sakit. Dalam Islam, kebersihan sebagian dari iman.',
           K_BERSIH, minimal=1, kisi='PJ3', gambar=[img('wastebasket')],
           bahas='Sampah yang dibuang pada tempatnya membuat lingkungan bersih dan sehat.',
           konteks='Ajak anak membayangkan bermain di halaman yang penuh sampah. Tanyakan, "Bagaimana baunya? Apakah ada lalat? Apakah kita nyaman bermain di sana?" '
                   'Setelah itu bantu anak menyusun alasan dalam satu atau dua kalimat, misalnya agar sehat dan nyaman.'),
    uraian('Teman sekelasmu terjatuh saat berlari. Sebutkan nama sikap baik saat kita membantu teman yang kesulitan, lalu beri satu contoh perbuatanmu.',
           'Sikap itu bernama tolong-menolong. Contohnya, aku membantu temanku berdiri dan mengantarnya ke UKS.',
           [['tolong-menolong', 'tolong menolong', 'saling menolong', 'saling membantu', 'menolong', 'tolong', 'peduli'],
            ['membantu berdiri', 'berdiri', 'uks', 'obat', 'mengobati', 'memapah', 'menggendong', 'mengantar', 'mengambilkan', 'menjemput', 'membersihkan luka', 'memberi', 'bilang ke guru', 'memanggil guru', 'lapor guru']],
           minimal=2, kisi='PJ5', gambar=[img('person-running')],
           bahas='Sikap membantu teman disebut tolong-menolong. Contohnya membantu teman berdiri dan mengantarnya ke UKS.',
           konteks='Tolong-menolong berarti saling membantu, terutama saat teman kesulitan. Tanyakan kepada anak apa yang ia inginkan jika ia sendiri jatuh, lalu apa yang sebaiknya ia lakukan kepada temannya. '
                   'Jawaban lengkap memuat nama sikapnya dan satu contoh perbuatan.'),
]

# ================================== PAKET 3 ==================================
paket3 = [
    pg('Gambar mana yang menunjukkan duduk bertumpu tangan?',
       opsi(DUDUK_TANGAN), [opsi(JONGKOK), opsi(TEGAK), opsi(SATU_KAKI)], kisi='PJ1',
       bahas='Pada duduk bertumpu tangan, anak duduk di lantai dan kedua tangan menahan badan di belakang.',
       konteks='Duduk bertumpu tangan: kaki lurus ke depan, badan condong ke belakang, dan kedua tangan menahan badan di lantai. '
               'Minta anak mempraktikkan posisi ini, lalu cocokkan dengan gambar. Gambar yang benar adalah satu-satunya yang duduk di lantai.'),
    pg('Saat bermain bola bersama kelompok, gerak manipulatif yang dilakukan adalah ....',
       'menendang bola ke teman', ['duduk menunggu giliran', 'berjalan ke lapangan', 'berdiri tegak'], gambar=[img('soccer-ball')], kisi='PJ1',
       bahas='Menendang bola memakai benda, jadi termasuk gerak manipulatif.',
       konteks='Gerak manipulatif adalah gerak yang memakai atau memainkan benda, seperti menendang, melempar, dan menangkap bola. '
               'Tanyakan kepada anak, "Dari pilihan ini, mana yang memerlukan bola?" Pilihan lain hanya duduk, berjalan, atau berdiri tanpa benda.'),
    pg('Fira melompat dari satu garis ke garis berikutnya. Gerak melompat termasuk gerak ....',
       'lokomotor', ['nonlokomotor', 'manipulatif', 'berirama'], gambar=[MELOMPAT], kisi='PJ1',
       bahas='Melompat dari satu garis ke garis lain membuat badan berpindah tempat, jadi termasuk gerak lokomotor.',
       konteks='Lokomotor adalah gerak berpindah tempat. Buat dua garis selotip di lantai dan ajak anak melompat dari garis pertama ke garis kedua. '
               'Tanyakan apakah badannya tetap di tempat atau pindah. Karena pindah, geraknya lokomotor, bukan nonlokomotor.'),
    pg('Agar gerakan senam terlihat kompak, semua anak harus ....',
       'bergerak mengikuti ketukan musik bersama-sama', ['bergerak sesuka hati masing-masing', 'berlari keluar barisan', 'menutup telinga saat musik diputar'],
       gambar=[img('trumpet')], kisi='PJ2',
       bahas='Gerakan menjadi kompak jika semua anak mengikuti ketukan musik yang sama.',
       konteks='Gerak berirama dilakukan bersama-sama mengikuti musik yang sama, sehingga gerakan terlihat serempak. '
               'Ajak anak dan anggota keluarga lain bergerak dengan lagu yang sama, lalu bandingkan dengan saat setiap orang bergerak sendiri-sendiri. Anak akan melihat sendiri mana yang tampak kompak.'),
    pg('Arif bersepeda setiap sore. Kegiatan ini dapat menguatkan otot ....',
       'kaki', ['mata', 'pipi', 'telinga'], gambar=[img('bicycle')], kisi='PJ3',
       bahas='Mengayuh pedal melatih otot kaki.',
       konteks='Bersepeda membuat kaki mengayuh pedal berulang-ulang sehingga ototnya terlatih dan kuat. '
               'Tanyakan kepada anak bagian tubuh mana yang paling lelah setelah naik sepeda lama, lalu ia dapat mencocokkannya dengan pilihan jawaban.'),
    pg('Arsy akan bermain lompat tali di ruang tamu. Hal yang dilakukan lebih dulu adalah ....',
       'memindahkan kursi ke pinggir ruangan', ['menyebar mainan di lantai', 'menumpuk kursi di tengah ruangan', 'langsung melompat tanpa melihat sekitar'], kisi='PJ3',
       bahas='Ruang ditata dulu agar aman dan nyaman, tidak membuat tersandung.',
       konteks='Sebelum bermain, ruang ditata supaya tidak ada benda yang menghalangi atau membahayakan. Ajak anak melihat ruang bermainnya dan tanyakan benda apa yang bisa membuatnya tersandung. '
               'Jawaban yang benar adalah tindakan yang membuat ruang lebih lapang.'),
    pg('Setelah rutin berlari kecil setiap pagi, tubuh Wawan menjadi ....',
       'bugar dan tidak mudah lelah', ['lemas sepanjang hari', 'sering mengantuk di kelas', 'mudah sakit'],
       gambar=[img('person-running')], kisi='PJ3',
       bahas='Lari kecil yang rutin membuat jantung dan paru-paru terlatih sehingga tubuh bugar.',
       konteks='Lari kecil yang dilakukan teratur melatih ketahanan tubuh. Orang yang rutin berolahraga biasanya tidak mudah lelah. '
               'Tanyakan kepada anak, "Kalau kita sering bergerak dan berolahraga, badan jadi lebih kuat atau lebih lemah?"'),
    pg('Anak-anak berlatih mengapung di kolam dangkal bersama guru. Latihan ini bertujuan agar mereka ....',
       'tenang dan tidak takut berada di air', ['bisa balapan paling cepat', 'bisa melompat paling tinggi', 'langsung ke kolam yang dalam'], gambar=[img('person-swimming')], kisi='PJ4',
       bahas='Latihan mengapung membuat anak tenang dan percaya diri di air.',
       konteks='Mengapung adalah langkah awal belajar berenang yang melatih badan agar rileks di atas air. Tujuannya membuat anak tenang dan tidak takut air, bukan lomba kecepatan atau tinggi lompatan. '
               'Tanyakan, "Kenapa kita belajar dulu di kolam yang dangkal bersama guru?"'),
    pg('Tim kelas kami selesai bertanding dengan selamat. Ucapan syukur yang tepat adalah ....',
       'Alhamdulillah', ['Bismillah', 'Astagfirullah', 'Assalamualaikum'], kisi='PJ5',
       bahas='Alhamdulillah adalah ucapan syukur kepada Allah swt.',
       konteks='Syukur diucapkan sesudah mendapat kebaikan, misalnya selamat dan sehat. Ucapannya Alhamdulillah. '
               'Bismillah dibaca saat memulai, Astagfirullah saat memohon ampun, dan Assalamualaikum saat memberi salam. Tanyakan mana yang cocok sesudah kegiatan berakhir dengan selamat.'),
    pg('Pakaian olahraga yang tepat bagi anak muslim adalah yang ....',
       'sopan dan menutup aurat', ['ketat dan terbuka', 'tipis dan tembus pandang', 'bagus walaupun terbuka'], kisi='PJ5',
       bahas='Anak muslim memakai pakaian olahraga yang sopan dan menutup aurat.',
       konteks='Dalam Islam, menutup aurat tetap dilakukan saat berolahraga. Pakaian olahraga yang baik longgar secukupnya, nyaman bergerak, dan tidak terbuka. '
               'Tanyakan kepada anak pakaian apa yang ia pakai saat pelajaran PJOK dan mengapa bentuknya seperti itu.'),

    isian('Lawan kata berjalan maju adalah berjalan ....',
          ['mundur', 'berjalan mundur'], gambar=[MUNDUR], kisi='PJ1',
          bahas='Berjalan ke belakang disebut berjalan mundur.',
          konteks='Berjalan mundur adalah berjalan ke arah belakang, dan ini termasuk gerak lokomotor. '
                  'Ajak anak berjalan maju lalu berjalan ke arah sebaliknya di tempat aman, lalu tanyakan namanya. Panah pada gambar menunjuk ke arah belakang.'),
    isian('Bayi yang belum bisa berjalan bergerak maju dengan tangan dan lututnya. Gerak ini bernama ....',
          ['merangkak', 'rangkak', 'merangkak maju'], gambar=[MERANGKAK], kisi='PJ1',
          bahas='Bergerak dengan tangan dan lutut disebut merangkak.',
          konteks='Merangkak adalah gerak lokomotor, karena badan berpindah tempat dengan bertumpu pada tangan dan lutut. '
                  'Tunjukkan gambar, lalu ajak anak mengingat cara adik bayi atau sepupunya bergerak sebelum bisa berjalan.'),
    isian('Kedua tangan direntangkan ke samping saat berdiri dengan satu kaki. Gerakan ini membantu menjaga .... badan.',
          ['keseimbangan', 'seimbang'], gambar=[SATU_KAKI], kisi='PJ1',
          bahas='Tangan yang direntangkan membantu menjaga keseimbangan badan.',
          konteks='Saat berdiri satu kaki badan mudah goyang, sehingga tangan direntangkan untuk membantu menjaga keseimbangan. '
                  'Ajak anak mencoba berdiri satu kaki dengan tangan di bawah dan dengan tangan terentang, lalu tanyakan mana yang lebih stabil. Jawabannya adalah nama dari keadaan stabil itu.'),
    isian('Teman melempar bola ke arah kita, lalu kita menyambut bola itu dengan kedua tangan. Gerakan kita disebut ....',
          ['menangkap', 'menangkap bola', 'tangkap', 'tangkap bola'], gambar=[img('soccer-ball')], kisi='PJ1',
          bahas='Menyambut bola dengan kedua tangan disebut menangkap. Menangkap bola termasuk gerak manipulatif.',
          konteks='Menangkap bola adalah gerak manipulatif sekaligus melatih keseimbangan: mata melihat bola, kedua tangan dijulurkan ke depan, lalu bola didekap. '
                  'Lempar bola kecil pelan-pelan kepada anak, lalu tanyakan apa nama gerakan yang ia lakukan dengan tangannya.'),
    isian('Setelah berlari, Salsa merasa haus. Minuman terbaik untuk mengganti cairan tubuh adalah air ....',
          ['putih', 'air putih'], kisi='PJ3',
          bahas='Air putih paling baik untuk mengganti cairan tubuh yang keluar sebagai keringat.',
          konteks='Saat berlari kita berkeringat, sehingga tubuh kehilangan cairan dan merasa haus. Minuman yang paling baik untuk menggantinya adalah air putih, bukan minuman manis. '
                  'Tanyakan kepada anak minuman yang tidak berwarna dan tidak manis yang biasa diminum sehari-hari.'),
    isian('Setelah berolahraga dan berkeringat, kita .... agar badan bersih dan segar.',
          ['mandi', 'mandi dan berganti baju', 'mandi air'], gambar=[img('shower')], kisi='PJ3',
          bahas='Mandi setelah berkeringat membuat badan bersih, segar, dan sehat.',
          konteks='Setelah berolahraga, badan berkeringat dan mudah berbau. Mandi dan berganti pakaian bersih adalah kebiasaan hidup sehat. '
                  'Tanyakan kepada anak apa yang biasa ia lakukan sepulang bermain di luar agar badannya bersih dan segar.'),
    isian('Sebelum masuk ke kolam, Wati memercikkan air ke kaki, tangan, dan dadanya lebih dulu. Gerak dasar aktivitas air ini disebut .... tubuh.',
          ['membasahi', 'basahi', 'membasahi tubuh', 'membasahkan', 'membasuh', 'membasuh tubuh'], gambar=[img('water-wave')], kisi='PJ4',
          bahas='Memercikkan air ke tubuh sebelum masuk kolam disebut membasahi tubuh, agar badan tidak kaget dengan dinginnya air.',
          konteks='Membasahi tubuh adalah gerak dasar aktivitas air yang dilakukan sebelum masuk kolam, dimulai dari kaki lalu tangan dan dada, agar badan tidak kaget. '
                  'Peragakan dengan gayung di kamar mandi, lalu tanyakan kata kerja untuk membuat tubuh menjadi basah. Kata itu berawalan "mem-".'),
    isian('Ani terjatuh saat berlari, lalu Budi membantunya berdiri. Sikap baik Budi disebut ....',
          ['tolong-menolong', 'tolong menolong', 'menolong', 'tolong', 'saling menolong', 'saling membantu', 'membantu'], kisi='PJ5',
          bahas='Membantu teman yang kesulitan adalah sikap tolong-menolong.',
          konteks='Tolong-menolong berarti saling membantu. Tanyakan kepada anak apa yang ia rasakan jika ada teman yang membantunya saat ia kesulitan. '
                  'Lalu minta ia menyebutkan nama sikap Budi yang dalam Islam juga dianjurkan.'),
    isian('Salat lima waktu harus dikerjakan tepat .... meskipun kita sedang asyik berolahraga.',
          ['waktu', 'pada waktunya', 'waktunya'], kisi='PJ5',
          bahas='Salat harus dikerjakan tepat waktu, juga ketika sedang berolahraga.',
          konteks='Salat adalah kewajiban yang dikerjakan pada waktunya masing-masing: Subuh, Zuhur, Asar, Magrib, dan Isya. '
                  'Ingatkan anak bahwa olahraga atau bermain tidak boleh membuat kita menunda salat. Frasa "tepat ..." sering dipakai dalam kalimat sehari-hari, misalnya "tepat ... datang ke sekolah".'),
    isian('Meskipun timnya kalah, Fajar tidak marah dan menerima hasilnya dengan tenang. Sikap Fajar disebut s.... (huruf awalnya s).',
          ['sabar', 'bersabar'], kisi='PJ5',
          bahas='Tetap tenang dan tidak marah saat kalah adalah sikap sabar.',
          konteks='Sabar berarti tetap tenang dan tidak mudah marah, termasuk saat kalah dalam permainan. Tanyakan kepada anak apa yang ia rasakan ketika kalah, lalu apa yang sebaiknya dilakukan. '
                  'Nama sikap itu juga bisa dikaitkan dengan menunggu giliran tanpa marah.'),

    uraian('Rina berjalan di atas garis lurus seperti titian. Sebutkan dua bagian tubuh yang membantu agar Rina tidak jatuh, lalu jelaskan caranya.',
           'Tangan direntangkan ke samping agar badan tetap seimbang, dan mata melihat lurus ke depan. Kaki melangkah pelan satu per satu.',
           K_SEIMBANG, minimal=2, kisi='PJ1',
           bahas='Tangan terentang, mata menatap ke depan, dan kaki melangkah pelan membantu keseimbangan.',
           konteks='Buat garis dari selotip di lantai dan ajak anak berjalan di atasnya. Minta ia mengamati apa yang membantunya tetap di garis, misalnya tangan di samping badan atau mata ke depan. '
                   'Jawaban cukup menyebut dua bagian tubuh disertai caranya.'),
    uraian('Jelaskan perbedaan gerak lokomotor dan gerak nonlokomotor. Tulis seperti ini: Gerak lokomotor ..., gerak nonlokomotor ....',
           'Gerak lokomotor membuat badan berpindah tempat, sedangkan gerak nonlokomotor dilakukan di tempat tanpa berpindah.',
           # kunci berupa frasa "lokomotor ... berpindah" dan "nonlokomotor ... di tempat" agar jawaban terbalik tidak lolos otomatis
           [[f'lokomotor {m}{v}' for m in _ANTARA for v in ('berpindah', 'pindah')],
            [f'{n} {m}{v}' for n in ('nonlokomotor', 'non lokomotor') for m in _ANTARA
             for v in ('di tempat', 'tidak berpindah', 'tanpa berpindah', 'tetap di tempat', 'tidak pindah', 'tanpa pindah', 'diam di tempat')]],
           minimal=2, kisi='PJ1', gambar=[BERLARI, JONGKOK],
           bahas='Lokomotor berpindah tempat; nonlokomotor dilakukan di tempat.',
           konteks='Bandingkan dua kegiatan bersama anak: berlari mengelilingi ruangan dan membungkuk di satu titik. Tanyakan, "Pada kegiatan mana badanmu pindah tempat?" '
                   'Jawaban yang baik menyebut bahwa lokomotor berpindah tempat dan nonlokomotor tidak berpindah, boleh disertai contoh.'),
    uraian('Kita bisa menari mengikuti irama musik. Tuliskan tiga anggota tubuh yang ikut bergerak saat menari.',
           'Tangan, kaki, dan kepala ikut bergerak. Pinggang dan bahu juga bisa bergoyang mengikuti irama.',
           [['tangan', 'lengan', 'jari'], ['kaki', 'lutut', 'telapak'], ['kepala', 'leher'], ['badan', 'pinggang', 'pinggul', 'perut', 'bahu', 'punggung']],
           minimal=3, kisi='PJ2', gambar=[img('drum'), img('musical-note')],
           bahas='Dalam gerak berirama, banyak anggota tubuh yang ikut bergerak mengikuti musik.',
           konteks='Ajak anak menari mengikuti musik di rumah, lalu minta ia menyebutkan bagian tubuh yang bergerak. '
                   'Sebaiknya anak diminta menunjuk bagian itu sambil menyebut namanya, misalnya kepala diangguk-angguk atau kaki dihentakkan.'),
    uraian('Sebutkan dua kegiatan yang dapat kita lakukan untuk menjaga kebersihan kelas.',
           'Menyapu lantai dan membuang sampah pada tempatnya. Mengelap meja dan merapikan kursi juga menjaga kelas tetap bersih.',
           [['menyapu', 'sapu'], ['membuang sampah', 'buang sampah', 'tempat sampah', 'memungut sampah', 'memungut'],
            ['mengepel', 'pel', 'mengelap', 'lap', 'membersihkan', 'merapikan', 'menata', 'piket', 'menghapus', 'mencuci', 'menyiram']],
           minimal=2, kisi='PJ3', gambar=[img('wastebasket')],
           bahas='Menyapu dan membuang sampah pada tempatnya membuat kelas bersih dan nyaman.',
           konteks='Ajak anak mengingat jadwal piket di kelasnya atau tugas membersihkan rumah. Tanyakan apa saja yang dikerjakan agar ruangan tidak kotor. '
                   'Jawaban benar adalah kegiatan yang membuat ruangan bersih atau rapi, seperti menyapu, mengelap, dan membuang sampah.'),
    uraian('Saat bermain lompat tali, temanmu belum bisa melompat. Apa yang akan kamu lakukan untuk membantunya? Sebutkan juga nama sikap baik itu.',
           'Aku mengajarinya pelan-pelan dan mengajaknya bermain bersama. Sikap itu bernama tolong-menolong.',
           [['tolong-menolong', 'tolong menolong', 'saling menolong', 'saling membantu', 'menolong', 'tolong', 'peduli', 'sabar'],
            ['mengajari', 'mengajarkan', 'mengajak', 'memberi contoh', 'melatih', 'memegang', 'membantu', 'menemani', 'menyemangati', 'memberi semangat', 'mencontohkan']],
           minimal=2, kisi='PJ5', 
           bahas='Mengajari teman yang belum bisa adalah sikap tolong-menolong dan sabar.',
           konteks='Tolong-menolong dan sabar berarti membantu teman yang kesulitan dengan tenang. Tanyakan kepada anak apa yang akan ia lakukan bila temannya belum bisa melompat. '
                   'Jawaban lengkap memuat satu cara membantu dan nama sikapnya.'),
]

PAKET = [paket1, paket2, paket3]
