from _alat import *

# Pendidikan Pancasila kelas 2 (SD Muhammadiyah), ASAS ganjil. 3 paket x (6 pg, 6 isian, 3 uraian).
# Lambang sila: 1 bintang, 2 rantai, 3 pohon beringin, 4 kepala banteng, 5 padi dan kapas.

SALAM = ["assalamualaikum", "assalamu'alaikum", "assalamu alaikum", "assalamu'alaikum warahmatullahi wabarakatuh", "assalamualaikum warahmatullahi wabarakatuh", "salam"]
ALHAMDULILLAH = ['alhamdulillah', 'alhamdulilah', 'hamdalah', 'alhamdulillahi rabbil alamin', 'alhamdulillahirobbilalamin', 'alhamdulillahirabbilalamin']
JAWAB_SALAM = ["wa'alaikumussalam", 'waalaikumsalam', 'walaikumsalam', 'wa alaikum salam', 'waalaikumussalam', "wa'alaikumsalam",
               "wa'alaikum salam", 'waalaikum salam', 'walaikum salam', 'wa’alaikumussalam', "wa'alaikumussalam warahmatullahi wabarakatuh",
               'waalaikumussalam warahmatullahi wabarakatuh', "wa'alaikumsalam warahmatullahi wabarakatuh"]


# ---- gambar lambang sila (sederhana, bukan tiruan rinci lambang resmi) ----
def _perisai(isi, latar):
    return svg(f'<rect x="6" y="6" width="148" height="148" rx="16" fill="{latar}" stroke="#3d2b1f" stroke-width="5"/>' + isi, 160, 160)

def _bintang():
    import math
    pts = []
    for i in range(10):
        r = 52 if i % 2 == 0 else 21
        a = -math.pi / 2 + i * math.pi / 5
        pts.append(f'{80 + r * math.cos(a):.1f},{82 + r * math.sin(a):.1f}')
    return _perisai(f'<polygon points="{" ".join(pts)}" fill="#F5C518" stroke="#b8860b" stroke-width="3" stroke-linejoin="round"/>', '#111')

def _rantai():
    mata = ''
    for i, (x, y, rot) in enumerate([(80, 38, 0), (80, 80, 90), (80, 122, 0)]):
        mata += f'<rect x="{x-14}" y="{y-24}" width="28" height="48" rx="14" fill="none" stroke="#f2f2f2" stroke-width="9" transform="rotate({rot} {x} {y})"/>'
    return _perisai(mata, '#C8102E')

def _beringin():
    akar = ''.join(f'<path d="M{x} 70 Q{x+dx} 100 {x} 118" fill="none" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>' for x, dx in [(34, -4), (50, 5), (110, -5), (126, 4)])
    mahkota = ('<ellipse cx="80" cy="56" rx="62" ry="36" fill="#2e8b3a" stroke="#1f6128" stroke-width="3"/>'
               '<circle cx="44" cy="60" r="22" fill="#3a9a46"/><circle cx="116" cy="60" r="22" fill="#3a9a46"/><circle cx="80" cy="40" r="24" fill="#43a64f"/>')
    batang = '<path d="M68 128 L72 70 L88 70 L92 128 Z" fill="#7a4a24" stroke="#4d2e14" stroke-width="3" stroke-linejoin="round"/>'
    return _perisai(akar + batang + mahkota, '#fff')

def _banteng():
    tanduk = ''.join(f'<path d="{d}" fill="none" stroke="#111" stroke-width="11" stroke-linecap="round"/>' for d in ['M50 62 Q16 66 22 26', 'M110 62 Q144 66 138 26'])
    kepala = ('<ellipse cx="30" cy="78" rx="16" ry="9" fill="#111" transform="rotate(-20 30 78)"/>'
              '<ellipse cx="130" cy="78" rx="16" ry="9" fill="#111" transform="rotate(20 130 78)"/>'
              '<path d="M46 56 Q80 42 114 56 Q122 92 100 128 Q80 142 60 128 Q38 92 46 56Z" fill="#111"/>'
              '<ellipse cx="66" cy="78" rx="6" ry="4" fill="#fff"/><ellipse cx="94" cy="78" rx="6" ry="4" fill="#fff"/>'
              '<ellipse cx="80" cy="116" rx="20" ry="13" fill="#3a3a3a"/><circle cx="72" cy="116" r="3.5" fill="#fff"/><circle cx="88" cy="116" r="3.5" fill="#fff"/>')
    return _perisai(tanduk + kepala, '#C8102E')

def _padi_kapas():
    padi = ''
    for x, x2 in [(34, 22), (54, 54), (74, 86)]:
        padi += f'<line x1="{x}" y1="140" x2="{x2}" y2="38" stroke="#c9972b" stroke-width="3" stroke-linecap="round"/>'
        for k in range(5):
            t = (k + 1) / 6.0
            gx = x2 + (x - x2) * t * 0.55 + (6 if k % 2 else -6)
            gy = 38 + 62 * t * 0.6 + k * 4
            padi += f'<ellipse cx="{gx:.1f}" cy="{gy:.1f}" rx="4.5" ry="8" fill="#F2C94C" stroke="#c9972b" stroke-width="1.5"/>'
    kapas = '<path d="M110 138 L110 80" stroke="#2e8b3a" stroke-width="4"/>' + ''.join(
        f'<circle cx="{x}" cy="{y}" r="11" fill="#fff" stroke="#9aa5ab" stroke-width="3"/>' for x, y in [(100, 64), (120, 64), (110, 48)])
    return _perisai(padi + kapas, '#fff')

LAMBANG = {k: {'img': f'aset/lambang-sila-{k}.png'} for k in range(1, 6)}  # gambar acuan dari cex (perisai Garuda Pancasila)

# ---------------------------------------------------------------- PAKET 1
paket1 = [
    # ---- pilihan ganda (6)
    pg('Aturan di rumah Dika: sepulang bermain, tangan dan kaki harus dicuci dengan sabun. Aturan ini tentang menjaga ....',
       'kebersihan', ['kecepatan berlari', 'keindahan lagu', 'kekuatan otot'],
       gambar=[img('soap', label='sabun')], kisi='PK1a',
       bahas='Mencuci tangan dan kaki dengan sabun menjaga kebersihan badan.',
       konteks='Salah satu aturan keluarga adalah menjaga kebersihan. Tanyakan ke anak: "Kalau tangan kotor lalu makan, apa yang bisa terjadi?" '
               'Ajak ia menyebut aturan kebersihan di rumah, seperti cuci tangan, mandi, dan gosok gigi, lalu cari tahu aturan itu menjaga apa.'),
    pg('Bu Guru berdiri di depan pintu kelas. Saat masuk kelas, Rina sebaiknya ....',
       'mengucapkan salam dan tersenyum', ['langsung duduk tanpa menyapa', 'memanggil guru dengan berteriak', 'berlari ke bangku tanpa bicara'],
       gambar=[img('woman-teacher')], kisi='PK2',
       bahas='Kita menyapa guru dengan salam dan senyum. Ini sikap patuh aturan dan sopan.',
       konteks='Mengucapkan salam adalah aturan sopan santun di rumah dan di sekolah, sekaligus doa keselamatan bagi orang yang kita sapa. '
               'Bayangkan bersama anak ia tiba di kelas pagi hari: apa yang ia ucapkan dan lakukan pada guru? Ia boleh mempraktikkannya dengan Anda.'),
    pg('Rasulullah saw. dijuluki Al-Amin. Julukan itu diberikan karena beliau ....',
       'jujur dan dapat dipercaya', ['paling cepat berlari', 'paling kaya di kotanya', 'paling keras suaranya'],
       kisi='PK3', bahas='Al-Amin artinya orang yang dapat dipercaya, karena Rasulullah saw. selalu jujur.',
       konteks='Sejak muda Rasulullah saw. selalu berkata benar sehingga orang Makkah menyebut beliau Al-Amin, yaitu orang yang dapat dipercaya. '
               'Ceritakan ke anak: orang yang jujur membuat orang lain tenang menitipkan barang kepadanya. Tanyakan julukan itu mengacu ke sifat apa.'),
    pg('Burung pada lambang negara Indonesia bernama ....',
       'Garuda Pancasila', ['Merpati Putih', 'Burung Cendrawasih', 'Kakatua Raja'],
       kisi='PK4', bahas='Lambang negara Indonesia adalah Garuda Pancasila.',
       konteks='Lambang negara kita berupa burung besar yang gagah, namanya Garuda Pancasila. Tunjukkan gambar lambang negara dari uang, buku, atau dinding kelas, '
               'lalu tanyakan nama burungnya. Perhatikan bahwa nama lambang itu memuat kata "Pancasila".'),
    pg('Sila pertama Pancasila berbunyi ....',
       'Ketuhanan Yang Maha Esa', ['Persatuan Indonesia', 'Kemanusiaan yang Adil dan Beradab', 'Keadilan Sosial bagi Seluruh Rakyat Indonesia'],
       kisi='PK5', bahas='Sila pertama: Ketuhanan Yang Maha Esa.',
       konteks='Pancasila punya lima sila yang diurutkan dari sila pertama. Sila pertama berkaitan dengan Tuhan, yaitu Allah swt. yang Maha Esa. '
               'Ajak anak mengucapkan kelima sila bergantian lalu cari mana yang berisi kata "Ketuhanan".'),
    pg('Gambar rantai pada perisai Garuda mengajarkan kita untuk ....',
       'saling menyayangi dan menolong sesama', ['memilih-milih teman bermain', 'mementingkan diri sendiri', 'membiarkan teman yang kesulitan'],
       gambar=[LAMBANG[2]], kisi='PK6',
       bahas='Rantai adalah lambang sila kedua. Mata rantai saling terkait, seperti manusia yang saling menyayangi.',
       konteks='Rantai terbuat dari mata rantai yang saling berkait. Itu menggambarkan manusia yang saling menyayangi dan membantu, yaitu sila kedua. '
               'Tanyakan ke anak: kalau satu mata rantai lepas, apa yang terjadi? Lalu hubungkan dengan menolong teman yang sedang kesulitan.'),

    # ---- isian (6)
    isian('Salat yang dikerjakan bersama-sama dengan imam disebut salat ....', ['berjamaah', 'jamaah', 'berjemaah', 'jemaah'],
          gambar=[img('mosque')], kisi='PK1a', bahas='Salat bersama imam disebut salat berjamaah.',
          konteks='Banyak keluarga membuat aturan salat bersama, misalnya Magrib berjamaah di rumah atau masjid. Salat yang dikerjakan bersama-sama '
                  'dengan satu imam punya nama khusus. Ceritakan pengalaman salat bersama keluarga lalu minta anak menyebut namanya.'),
    isian('Dengan menaati aturan keluarga, kita berbakti kepada ....',
          ['orang tua', 'orangtua', 'ayah dan ibu', 'ibu dan ayah', 'ayah ibu', 'ibu ayah', 'ibu bapak', 'bapak ibu'], kisi='PK1b',
          bahas='Aturan keluarga dibuat oleh orang tua. Menaatinya adalah bakti kepada mereka.',
          konteks='Aturan keluarga dibuat oleh ayah dan ibu demi kebaikan anak. Saat kita menaatinya, kita berbakti kepada mereka. '
                  'Tanyakan siapa yang membuat aturan di rumah, lalu minta anak menyelesaikan kalimatnya sendiri.'),
    isian('Bungkus jajan yang sudah kosong harus dibuang ke tempat ....',
          ['sampah', 'tempat sampah', 'bak sampah', 'tong sampah', 'kotak sampah'], gambar=[img('wastebasket')], kisi='PK2',
          bahas='Sampah dibuang ke tempat sampah agar lingkungan bersih.',
          konteks='Membuang sampah pada tempatnya adalah aturan di rumah, sekolah, dan lingkungan. Ajak anak menunjuk tempat sampah di rumah atau sekolah, '
                  'lalu tanyakan ke mana bungkus jajan sebaiknya dibawa setelah habis.'),
    isian('Rasulullah saw. selalu salat tepat waktu. Sikap menaati waktu seperti ini disebut ....', ['disiplin', 'displin', 'disipilin'],
          gambar=[img('mantelpiece-clock', label='jam')], kisi='PK3', bahas='Tepat waktu adalah contoh sikap disiplin.',
          konteks='Rasulullah saw. mengajarkan agar kita tidak menunda-nunda ibadah dan menepati waktu. Sikap taat pada waktu dan aturan punya satu nama yang sering dipakai di sekolah, '
                  'misalnya saat masuk kelas ketika bel berbunyi. Tanyakan: "Kalau bel berbunyi lalu kamu langsung masuk, itu sikap apa?"'),
    isian('Gambar kepala hewan pada perisai Garuda Pancasila adalah kepala ....', ['banteng', 'kepala banteng', 'banteng liar'], gambar=[LAMBANG[4]], kisi='PK4',
          bahas='Kepala banteng adalah lambang sila keempat.',
          konteks='Di antara lima gambar pada perisai, hanya satu berupa kepala hewan bertanduk melengkung, yaitu lambang sila keempat. Perlihatkan gambar dan tanyakan ke anak: '
                  '"Hewan apa yang bertanduk besar dan hidup berkelompok di hutan?" Banteng hidup berkelompok, melambangkan musyawarah bersama.'),
    isian('Saat mendapat rezeki dari Allah swt., kita mengucapkan ....', ALHAMDULILLAH, kisi='PK6',
          bahas='Bersyukur kepada Allah swt. kita ungkapkan dengan ucapan Alhamdulillah.',
          konteks='Bersyukur artinya berterima kasih kepada Allah swt. atas nikmat yang diberikan. Ingatkan anak pada saat ia menerima hadiah atau makanan enak: '
                  'apa yang diajarkan untuk diucapkan? Kalau perlu, mulailah dengan "Al....", lalu biarkan anak menyambung.'),

    # ---- uraian (3)
    uraian('Mengapa kita harus menaati aturan di keluarga, misalnya membereskan mainan dan salat tepat waktu? Tulis alasanmu!',
           'Karena itu membuat orang tua senang dan itu cara berbakti kepada mereka. Keluarga juga menjadi tertib, rapi, dan rukun.',
           [['orang tua', 'orangtua', 'ibu', 'ayah', 'ortu'], ['senang', 'bahagia', 'berbakti', 'bakti', 'sayang', 'tidak marah', 'bangga'],
            ['tertib', 'rapi', 'bersih', 'rukun', 'damai', 'tenang', 'teratur']], minimal=2, kisi='PK1b',
           konteks='Tujuan aturan keluarga adalah kebaikan bersama, dan menaatinya adalah bakti kepada orang tua. '
                   'Tanyakan: "Kalau mainan dibereskan, bagaimana perasaan ibu? Rumah jadi bagaimana?" Bantu anak menyebut alasan dengan kalimatnya sendiri, minimal dua alasan.'),
    uraian('Mengapa kita harus antre saat membeli jajan di kantin? Jelaskan dengan kalimatmu!',
           'Supaya tertib dan adil. Semua mendapat giliran, tidak berdesakan, dan tidak ada yang terdorong.',
           [['tertib', 'rapi', 'teratur', 'aman'], ['giliran', 'bergiliran', 'adil', 'berebut', 'berdesakan', 'dorong', 'bergantian', 'menyerobot', 'menyelip', 'jatuh']],
           minimal=1, kisi='PK2',
           konteks='Antre adalah aturan lingkungan yang membuat semua orang mendapat giliran. Bayangkan bersama anak kantin saat istirahat: jika semua maju berebut, apa yang bisa terjadi? '
                   'Bantu anak membandingkan kantin yang berebut dan yang antre, lalu menulis alasannya.'),
    uraian('Apa arti sila pertama "Ketuhanan Yang Maha Esa" bagi kita sebagai anak muslim? Jelaskan!',
           'Artinya kita percaya dan beriman kepada Allah swt. yang Maha Esa, lalu beribadah kepada-Nya, misalnya salat.',
           [['percaya', 'beriman', 'iman', 'yakin'], ['allah', 'tuhan'],
            ['esa', 'satu', 'tunggal', 'ibadah', 'salat', 'sholat', 'shalat', 'beribadah', 'sembah', 'menyembah', 'taat', 'takwa', 'bertakwa']],
           minimal=2, kisi='PK5', bahas='Sila pertama berarti beriman dan beribadah kepada Allah swt. Yang Maha Esa (satu).',
           konteks='Sila pertama mengajarkan kita percaya hanya kepada satu Tuhan, yaitu Allah swt., dan menyembah-Nya dengan salat dan ibadah lain. '
                   'Tanyakan: "Siapa yang menciptakan kita? Kepada siapa kita salat?" Bantu anak menyusun jawaban yang memuat siapa yang kita percaya dan apa yang kita lakukan.'),
]

# ---------------------------------------------------------------- PAKET 2
paket2 = [
    # ---- pilihan ganda (6)
    pg('Azan Magrib terdengar. Aturan di rumah Salma, seluruh keluarga ....',
       'berwudu dan salat berjamaah', ['menonton televisi dulu', 'bermain sepeda dulu', 'tidur lebih awal'],
       gambar=[img('mosque')], kisi='PK1a', bahas='Aturan keluarga yang baik: salat berjamaah saat waktu salat tiba.',
       konteks='Salat berjamaah bersama keluarga adalah aturan yang melatih disiplin dan kebersamaan. Tanyakan anak: "Waktu azan Magrib, apa yang biasa kita lakukan di rumah?" '
               'Lalu pilih kegiatan yang mengikuti aturan salat, bukan yang menunda salat.'),
    pg('Dengan menaati aturan keluarga, orang tua akan merasa ....',
       'senang dan tenang', ['kesal dan marah', 'sedih dan kecewa', 'repot dan bingung'], kisi='PK1b',
       bahas='Anak yang menaati aturan membuat orang tua senang. Itu cara berbakti.',
       konteks='Berbakti kepada orang tua dapat dimulai dari hal kecil, yaitu menaati aturan di rumah. Tanyakan ke anak bagaimana perasaan ibu dan ayah saat ia membereskan sepatu tanpa disuruh. '
               'Ajak ia membayangkan perasaan itu, lalu memilih perasaan yang sesuai.'),
    pg('Rudi melihat bungkus permen di lantai kelas. Yang sebaiknya Rudi lakukan adalah ....',
       'memungutnya dan membuang ke tempat sampah', ['menendangnya ke kolong meja', 'membiarkannya saja', 'menyembunyikannya di laci teman'],
       gambar=[img('wastebasket')], kisi='PK2', bahas='Sampah dipungut dan dibuang ke tempat sampah agar kelas bersih.',
       konteks='Menjaga kelas tetap bersih adalah tanggung jawab bersama, termasuk memungut sampah yang kita lihat. Ajak anak membayangkan kelasnya: '
               'kalau ada bungkus permen di lantai, apa yang akan ia lakukan? Pilih tindakan yang membuat kelas bersih untuk semua.'),
    pg('Gambar rantai pada perisai Garuda adalah lambang sila ke ....',
       'dua', ['satu', 'tiga', 'empat'], gambar=[LAMBANG[2]], kisi='PK4',
       bahas='Rantai adalah lambang sila kedua, Kemanusiaan yang Adil dan Beradab.',
       konteks='Setiap sila punya lambang di perisai: bintang, rantai, pohon beringin, kepala banteng, padi dan kapas. Urutannya sama dengan urutan sila. '
               'Ajak anak menghafal dengan menghitung jarinya: bintang jari 1, rantai jari ke berapa? Mulai dari bintang.'),
    pg('Sila kedua Pancasila berbunyi ....',
       'Kemanusiaan yang Adil dan Beradab', ['Ketuhanan Yang Maha Esa', 'Persatuan Indonesia', 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan'],
       kisi='PK5', bahas='Sila kedua: Kemanusiaan yang Adil dan Beradab.',
       konteks='Sila kedua berkaitan dengan kemanusiaan, yaitu bersikap baik dan adil kepada sesama. Bacakan lima sila dengan anak secara berurutan, '
               'lalu minta ia menunjuk sila kedua. Lambangnya, rantai, bisa dijadikan petunjuk.'),
    pg('Gambar pohon beringin pada perisai melambangkan persatuan. Sikap yang sesuai adalah ....',
       'bermain bersama dan rukun dengan semua teman', ['memilih teman yang sama sukunya saja', 'bermain sendiri-sendiri', 'bertengkar jika beda pendapat'],
       gambar=[LAMBANG[3]], kisi='PK6',
       bahas='Pohon beringin besar dan rindang, melindungi banyak makhluk. Ini lambang persatuan, yaitu rukun dengan semua orang.',
       konteks='Pohon beringin besar dan rindang, dan semua orang bisa berteduh di bawahnya. Itu menggambarkan persatuan: kita rukun dengan semua teman, walau berbeda. '
               'Tanyakan: "Kalau ada teman baru yang berbeda daerahnya, apa yang kamu lakukan?" Pilih sikap yang mempersatukan.'),

    # ---- isian (6)
    isian('Sebelum makan, kita membaca doa yang diawali kata ....',
          ['bismillah', 'basmalah', 'bismillahirrahmanirrahim', 'bismillahirohmanirohim', 'bismillahirrahmannirrahim', 'bismillahirrahmanirahim'],
          gambar=[img('fork-and-knife-with-plate', label='makan')], kisi='PK1a', bahas='Sebelum makan kita membaca Bismillah.',
          konteks='Berdoa sebelum makan adalah aturan keluarga muslim sebagai tanda syukur. Ajak anak mengingat apa yang biasa diucapkan saat makan bersama di meja. '
                  'Kata pertama dari doa itu menyebut nama Allah.'),
    isian('Menaati aturan keluarga adalah cara kita ... kepada orang tua.', ['berbakti', 'bakti', 'berbhakti'], kisi='PK1b',
          bahas='Menaati aturan orang tua adalah cara berbakti.',
          konteks='Berbakti artinya berbuat baik, patuh, dan menyayangi orang tua. Katakan pada anak bahwa membereskan kamar atau cuci tangan tanpa disuruh adalah bentuk bakti. '
                  'Minta anak menyebut kata untuk "berbuat baik kepada orang tua", yang diawali "ber-".'),
    isian('Saat antre, anak yang datang paling akhir berdiri di barisan paling ....', ['belakang', 'akhir', 'paling belakang', 'ujung'],
          kisi='PK2', bahas='Yang datang terakhir berdiri di belakang.',
          konteks='Antre berarti menunggu giliran sesuai urutan datang. Praktikkan dengan anak: buat antrean dengan boneka atau sandal di rumah. '
                  'Tanyakan di mana anak yang paling akhir datang harus berdiri.'),
    isian('Rasulullah saw. menjaga kambing gembalaannya dengan baik. Sikap ini disebut ....',
          ['tanggung jawab', 'tanggungjawab', 'bertanggung jawab', 'tanggung-jawab', 'bertanggungjawab'], kisi='PK3',
          bahas='Menjaga amanah dengan baik adalah sikap tanggung jawab.',
          konteks='Sejak muda Rasulullah saw. pernah menggembala kambing dan menjaganya dengan baik. Menjalankan tugas dengan sungguh-sungguh disebut sikap yang terdiri dari dua kata. '
                  'Tanyakan: "Kalau kamu piket dan menyapu sampai bersih, itu sikap apa?"'),
    isian('Perisai pada Garuda Pancasila berada di bagian ... Garuda.', ['dada', 'tengah dada'], kisi='PK4',
          bahas='Perisai terletak di dada Garuda.',
          konteks='Perisai adalah pelindung berbentuk papan yang digambarkan menggantung di dada Garuda. Lihat gambar lambang negara bersama anak, '
                  'lalu minta ia menunjuk letak perisai pada tubuh Garuda.'),
    isian('Sila kelima Pancasila berbunyi "Keadilan Sosial bagi Seluruh Rakyat ....".', ['indonesia'], kisi='PK5',
          bahas='Sila kelima: Keadilan Sosial bagi Seluruh Rakyat Indonesia.',
          konteks='Sila kelima berisi keadilan untuk semua orang di negeri kita. Bacakan sila itu sampai kata "Rakyat", lalu tanyakan: "Rakyat negara mana?" '
                  'Anak cukup melengkapi dengan satu kata nama negara kita.'),

    # ---- uraian (3)
    uraian('Mengapa kita mengucapkan salam saat bertemu orang atau masuk rumah? Jelaskan!',
           'Salam adalah doa keselamatan dan tanda sopan santun. Orang yang kita sapa menjadi senang.',
           [['doa', 'mendoakan', 'selamat', 'keselamatan', 'sejahtera', 'kebaikan'],
            ['ramah', 'sopan', 'santun', 'senang', 'sayang', 'hormat', 'menghormati', 'akrab', 'persaudaraan', 'menyapa']],
           minimal=1, kisi='PK2',
           konteks='Salam berarti mendoakan keselamatan orang yang kita sapa, dan juga tanda sopan santun. Tanyakan ke anak: "Kalau ada yang menyapa kita dengan ramah, perasaanmu bagaimana?" '
                   'Bantu anak menulis satu atau dua alasan, boleh dari sisi doa, sisi sopan santun, atau perasaan senang.'),
    uraian('Rasulullah saw. selalu jujur. Tuliskan satu contoh sikap jujur yang bisa kamu tiru di rumah atau di sekolah!',
           'Mengaku jika memecahkan gelas, tidak menyontek saat ulangan, atau mengembalikan barang teman yang ditemukan.',
           [['mengaku', 'jujur', 'berkata benar', 'tidak berbohong', 'tidak bohong', 'tidak menyontek', 'tidak nyontek', 'mengembalikan', 'mengatakan yang sebenarnya',
             'berkata jujur', 'bilang yang benar', 'bicara benar', 'tidak mencontek', 'tidak curang']],
           minimal=1, kisi='PK3',
           konteks='Contoh jujur terbaik bagi anak adalah kejadian nyata, misalnya mengakui kesalahan, tidak menyontek, atau mengembalikan barang yang ditemukan. '
                   'Tanyakan: "Pernahkah kamu menemukan barang teman? Apa yang kamu lakukan?" Terima contoh apa pun yang berupa berkata benar atau mengembalikan milik orang.'),
    uraian('Tuliskan satu contoh gotong royong di sekolah atau di lingkungan rumahmu, dan apa manfaatnya!',
           'Kerja bakti membersihkan lingkungan bersama-sama. Pekerjaan menjadi ringan dan cepat selesai.',
           [['kerja bakti', 'membersihkan', 'piket', 'menyapu', 'bersama', 'membantu', 'gotong royong', 'mengangkat', 'menanam', 'bekerja sama', 'bekerjasama', 'mengepel'],
            ['ringan', 'cepat', 'selesai', 'kompak', 'rukun', 'akrab', 'senang', 'bersih', 'mudah', 'tidak capek', 'tidak lelah']],
           minimal=2, kisi='PK6',
           konteks='Gotong royong artinya bekerja bersama-sama untuk tujuan yang sama. Tanyakan ke anak: "Kalau bersih-bersih kelas dilakukan sendirian atau beramai-ramai, mana yang lebih cepat?" '
                   'Bantu anak menyebut satu kegiatan bersama dan satu manfaatnya.'),
]

# ---------------------------------------------------------------- PAKET 3
paket3 = [
    # ---- pilihan ganda (6)
    pg('Ibu sudah menata makanan di meja. Menurut aturan keluarga Naya, sebelum makan kita ....',
       'berdoa bersama dahulu', ['bermain ponsel dahulu', 'menonton televisi dahulu', 'berlari keliling meja'],
       gambar=[img('cooked-rice', label='makan')], kisi='PK1a', bahas='Sebelum makan, keluarga berdoa bersama.',
       konteks='Berdoa sebelum makan mengajarkan syukur dan kebersamaan. Gambarkan suasana meja makan di rumah: sebelum menyuap, apa yang biasa dilakukan keluarga? '
               'Pilih kegiatan yang merupakan aturan sebelum makan, bukan yang mengganggu waktu makan.'),
    pg('Yang termasuk berbakti kepada orang tua adalah ....',
       'membereskan tempat tidur sesuai aturan rumah', ['pura-pura tidak mendengar perintah', 'menunda salat sampai nanti', 'menjawab dengan nada keras'],
       kisi='PK1b', bahas='Menaati aturan rumah dengan senang hati adalah bakti kepada orang tua.',
       konteks='Berbakti dapat dimulai dari kebiasaan kecil: menurut, sopan, dan membantu. Tanyakan ke anak: "Mana yang akan membuat ayah dan ibu senang?" '
               'Tiga pilihan lainnya menunjukkan sikap yang mengabaikan orang tua, jadi minta anak menimbang mana yang menaati aturan.'),
    pg('Di kantin, banyak teman ingin membeli jajan. Cara yang benar adalah ....',
       'antre sesuai urutan datang', ['menyelip ke barisan paling depan', 'mendorong supaya cepat', 'berteriak memesan lebih dahulu'],
       kisi='PK2', bahas='Antre sesuai urutan membuat semua tertib dan adil.',
       konteks='Antre adalah wujud patuh aturan di lingkungan sekolah. Ajak anak mengingat suasana kantin saat istirahat dan menanyakan: "Kalau semua menyelip, apa yang akan terjadi?" '
               'Pilih cara yang membuat semua dapat giliran dengan adil.'),
    pg('Rasulullah saw. selalu menepati waktu salat. Kita meniru beliau dengan ....',
       'berangkat sekolah tepat waktu', ['bangun siang agar puas tidur', 'selalu terlambat masuk kelas', 'menunda tugas sampai besok'],
       kisi='PK3',
       bahas='Tepat waktu adalah contoh sikap disiplin yang dicontohkan Rasulullah saw.',
       konteks='Rasulullah saw. memberi contoh disiplin, yaitu menepati waktu ibadah dan janji. Kita bisa meniru dalam hal kecil, seperti bangun pagi dan berangkat sekolah tepat waktu. '
               'Tanyakan: "Kalau mau tepat waktu, apa yang harus dilakukan pagi hari?"'),
    pg('Manakah gambar lambang sila ketiga, Persatuan Indonesia?',
       LAMBANG[3], [LAMBANG[1], LAMBANG[2], LAMBANG[4]], kisi='PK4', acak=True,
       bahas='Pohon beringin adalah lambang sila ketiga.',
       konteks='Urutan lambang pada perisai: bintang, rantai, pohon beringin, kepala banteng, padi dan kapas. Sila ketiga berarti lambangnya yang ketiga. '
               'Ajak anak mencocokkan gambar dengan nomor silanya. Petunjuk: pohon besar yang rindang, tempat banyak orang berteduh bersama.'),
    pg('Sila keempat Pancasila berbunyi ....',
       'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
       ['Persatuan Indonesia', 'Kemanusiaan yang Adil dan Beradab', 'Keadilan Sosial bagi Seluruh Rakyat Indonesia'],
       gambar=[LAMBANG[4]], kisi='PK5', bahas='Sila keempat: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan.',
       konteks='Sila keempat adalah sila tentang musyawarah, yaitu mengambil keputusan bersama dengan bijak. Kalimatnya panjang, jadi bacakan bersama anak sedikit demi sedikit. '
               'Petunjuk: lambangnya kepala banteng, hewan yang hidup berkelompok, dan sila ini memuat kata "Permusyawaratan".'),

    # ---- isian (6)
    isian('Menyikat gigi dua kali sehari menjaga kebersihan ....', ['gigi', 'mulut', 'gigi dan mulut'],
          gambar=[img('toothbrush', label='sikat gigi')], kisi='PK1a', bahas='Menyikat gigi menjaga kebersihan gigi dan mulut.',
          konteks='Menyikat gigi sebelum tidur adalah aturan kebersihan di banyak keluarga. Tanyakan anak: "Saat menyikat gigi, bagian badan mana yang kita bersihkan?" '
                  'Ia dapat menunjuk bagian badannya sendiri lalu menyebut namanya.'),
    isian('Temanmu mengucapkan "Assalamu\'alaikum". Jawabannya adalah ....', JAWAB_SALAM, kisi='PK2',
          bahas="Jawaban salam: Wa'alaikumussalam.",
          konteks='Menjawab salam hukumnya wajib dan merupakan aturan sopan santun. Latih bersama anak: Anda mengucapkan "Assalamu\'alaikum", ia menjawab. '
                  'Perhatikan bahwa jawabannya diawali "Wa" yang berarti "dan atas kalian juga".'),
    isian('Membuang sampah pada tempatnya membuat lingkungan menjadi ....', ['bersih', 'bersih dan sehat', 'rapi dan bersih', 'bersih rapi'],
          gambar=[img('wastebasket')], kisi='PK2', bahas='Sampah di tempatnya membuat lingkungan bersih.',
          konteks='Banyak aturan lingkungan, termasuk membuang sampah, berpengaruh pada keadaan sekitar. Bandingkan dua halaman: satu berserakan sampah, satu rapi. '
                  'Tanyakan keadaan halaman kedua, yaitu lawan dari kotor.'),
    isian('Rasulullah saw. selalu berkata jujur. Lawan kata jujur adalah ....', ['bohong', 'berbohong', 'dusta', 'berdusta', 'dusta'], kisi='PK3',
          bahas='Lawan jujur adalah bohong atau dusta.',
          konteks='Rasulullah saw. dikenal selalu berkata benar dan tidak pernah berbohong. Bantu anak memahami lawan kata jujur dengan contoh: "Kalau bilang sudah makan padahal belum, itu jujur atau bukan?" '
                  'Lalu minta ia menyebut nama perbuatannya.'),
    isian('Gambar bintang pada perisai Garuda adalah lambang sila ke ....', ['1', 'satu', 'pertama', 'ke-1', 'ke 1', 'kesatu', 'ke satu'],
          gambar=[LAMBANG[1]], kisi='PK4', bahas='Bintang adalah lambang sila pertama.',
          konteks='Bintang bersinar terang seperti cahaya, melambangkan Ketuhanan: iman kepada Allah swt. menerangi hidup kita. '
                  'Tanyakan: "Sila mana yang berbunyi tentang Tuhan?" Lalu hitung urutan sila dengan jari sampai bertemu sila itu.'),
    isian('Warga kerja bakti membersihkan selokan bersama-sama. Sikap bekerja sama ini disebut ....',
          ['gotong royong', 'gotong-royong', 'gotongroyong', 'gotong royong'], kisi='PK6',
          bahas='Bekerja bersama untuk kebaikan bersama disebut gotong royong.',
          konteks='Gotong royong berarti bekerja bersama-sama demi kebaikan bersama, misalnya kerja bakti di kampung. Tanyakan: "Pernah ikut kerja bakti atau piket bersama? '
                  'Apa nama sikap itu?" Dua kata ini sering diucapkan Pak RT saat mengajak warga.'),

    # ---- uraian (3)
    uraian('Ibu membuat aturan: sebelum makan harus mencuci tangan. Apa manfaat aturan ini, dan bagaimana perasaan ibu jika kita menaatinya?',
           'Tangan menjadi bersih dan kita tidak sakit perut karena kuman. Ibu senang karena kita berbakti.',
           [['bersih', 'sehat', 'kuman', 'tidak sakit', 'sakit perut', 'penyakit', 'tidak kotor'],
            ['senang', 'bahagia', 'bangga', 'berbakti', 'sayang', 'tenang']], minimal=2, kisi='PK1b',
           konteks='Aturan mencuci tangan sebelum makan melindungi kesehatan, dan menaatinya membuat orang tua senang karena anaknya berbakti. '
                   'Tanyakan: "Kenapa ibu menyuruh cuci tangan? Kalau kamu menurut, ibu merasa bagaimana?" Bantu anak menjawab dua bagian pertanyaan.'),
    uraian('Sebutkan dua contoh perbuatan yang menunjukkan kita beriman kepada Allah swt., sebagai pengamalan sila pertama!',
           'Salat lima waktu dan berdoa sebelum makan.',
           [['salat', 'sholat', 'shalat', 'solat'], ['berdoa', 'doa', 'bismillah'], ['mengaji', 'membaca al-quran', 'al quran', 'alquran', 'iqro', 'iqra'],
            ['puasa', 'berpuasa'], ['sedekah', 'bersedekah', 'zakat', 'infak'], ['bersyukur', 'alhamdulillah', 'zikir', 'berzikir'], ['menyembah allah', 'beribadah', 'ibadah']],
           minimal=2, kisi='PK5',
           konteks='Beriman kepada Allah swt. diwujudkan lewat ibadah dan akhlak, bukan hanya diucapkan. Ajak anak mengingat kegiatan hariannya: apa yang ia lakukan untuk Allah swt.? '
                   'Misalnya waktu bangun tidur, sebelum makan, atau saat azan. Bantu ia menyebut dua contoh.'),
    uraian('Sebutkan dua cara menghormati orang yang lebih tua atau guru!',
           'Mengucapkan salam dan mencium tangan, serta berbicara dengan sopan dan mendengarkan nasihat.',
           [['salam', 'menyapa'], ['salim', 'bersalaman', 'cium tangan', 'mencium tangan', 'berjabat tangan'], ['senyum', 'tersenyum'],
            ['sopan', 'santun', 'lembut'], ['mendengar', 'mendengarkan', 'tidak memotong'], ['menurut', 'patuh', 'tidak membantah'], ['membantu', 'menolong'], ['menunduk', 'membungkuk', 'permisi']],
           minimal=2, kisi='PK6',
           konteks='Menghormati orang yang lebih tua tampak lewat ucapan dan sikap. Tanyakan: "Saat bertemu kakek atau Bu Guru, apa yang kamu ucapkan dan lakukan? Bagaimana caramu berbicara?" '
                   'Bantu anak menyebut satu cara lewat tindakan dan satu cara lewat ucapan.'),
]

# ---------------------------------------------------------------- TAMBAHAN: tiap paket = 25 soal sesuai kisi-kisi
paket1 += [
    pg('Ibu membuat aturan: setelah bermain, mainan harus dirapikan. Rani merapikannya dengan senang hati. Sikap Rani menunjukkan bahwa ia ....',
       'anak yang berbakti', ['anak yang suka membantah', 'tidak peduli pada aturan', 'malas membantu'], kisi='PK1b',
       bahas='Menaati aturan ibu dengan senang hati adalah cara berbakti.',
       konteks='Berbakti dapat dimulai dari menaati aturan kecil di rumah, seperti merapikan mainan. Tanyakan ke anak: "Kalau kamu merapikan mainan tanpa diminta dua kali, ibu merasa apa?" '
               'Lalu ajak ia memilih sikap yang membuat orang tua bangga, bukan yang melawan atau menghindar.'),
    pg('Bel masuk kelas berbunyi. Anak yang patuh aturan sekolah akan ....',
       'segera masuk kelas dan duduk rapi', ['bermain dulu di halaman', 'membeli jajan dulu di kantin', 'berlari-lari di lorong'],
       gambar=[img('bell', label='bel')], kisi='PK2', bahas='Saat bel berbunyi, kita masuk kelas dan duduk rapi.',
       konteks='Bel sekolah adalah tanda aturan waktu yang harus dipatuhi semua murid. Bayangkan bersama anak suasana setelah bel berbunyi: apa yang dilakukan murid yang tertib? '
               'Ia dapat menceritakan apa yang biasa ia lakukan di sekolah sebelum memilih jawaban.'),
    pg('Sila ketiga Pancasila berbunyi ....',
       'Persatuan Indonesia', ['Ketuhanan Yang Maha Esa', 'Kemanusiaan yang Adil dan Beradab',
                              'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan'],
       kisi='PK5', bahas='Sila ketiga: Persatuan Indonesia.',
       konteks='Sila ketiga berkaitan dengan persatuan, yaitu rukun dan bersatu walau berbeda-beda. Bacakan kelima sila bersama anak sambil menghitung dengan jari sampai jari ketiga. '
               'Petunjuk: sila ini memuat nama negara kita dan lambangnya pohon beringin.'),
    pg('Padi dan kapas pada perisai melambangkan keadilan sosial. Sikap yang sesuai adalah ....',
       'membagi makanan dengan adil kepada semua teman', ['memberi lebih banyak hanya kepada teman dekat', 'mengambil bagian terbanyak untuk diri sendiri', 'tidak mau berbagi dengan siapa pun'],
       gambar=[LAMBANG[5]], kisi='PK6',
       bahas='Padi dan kapas adalah lambang sila kelima: pangan dan sandang cukup untuk semua. Kita bersikap adil dan mau berbagi.',
       konteks='Padi adalah makanan dan kapas adalah bahan pakaian, sehingga gambar itu berarti kebutuhan semua orang tercukupi secara adil. '
               'Tanyakan ke anak: "Kalau ada sepiring kue untuk lima teman, bagaimana membaginya supaya adil?" Pilih sikap yang tidak membeda-bedakan.'),
    isian('Mandi dua kali sehari adalah aturan di rumah Fajar. Aturan ini menjaga kebersihan ....', ['badan', 'tubuh', 'kulit', 'badan dan kulit', 'diri', 'badan kita', 'tubuh kita'],
          gambar=[img('shower', label='mandi')], kisi='PK1a', bahas='Mandi membersihkan badan.',
          konteks='Mandi teratur adalah salah satu aturan kebersihan keluarga yang juga diajarkan dalam Islam. Tanyakan ke anak: "Setelah mandi, bagian apa yang terasa segar dan bersih?" '
                  'Minta ia menyelesaikan kalimat dengan nama bagian yang kita bersihkan saat mandi.'),
    isian('Setiap pagi Dina menyapu halaman agar tidak ada sampah berserakan. Aturan ini menjaga kebersihan ....', ['lingkungan', 'halaman', 'rumah', 'halaman rumah', 'lingkungan rumah', 'lingkungan sekitar', 'sekitar'],
          kisi='PK2', bahas='Menyapu halaman menjaga kebersihan lingkungan.',
          konteks='Aturan menjaga kebersihan berlaku di rumah, sekolah, dan lingkungan sekitar. Ajak anak melihat halaman rumah atau sekolah yang bersih dan yang kotor, lalu tanyakan: '
                  '"Apa yang dijaga ketika kita menyapu halaman dan membuang sampah?" Jawabannya adalah tempat kita tinggal.'),
    isian('Gambar padi dan kapas pada perisai Garuda adalah lambang sila ke ....', ['5', 'lima', 'kelima', 'ke-5', 'ke 5', 'ke-lima'], gambar=[LAMBANG[5]], kisi='PK4',
          bahas='Padi dan kapas adalah lambang sila kelima.',
          konteks='Lambang pada perisai berurutan: bintang, rantai, pohon beringin, kepala banteng, lalu padi dan kapas. Padi dan kapas adalah gambar yang terakhir. '
                  'Ajak anak menghitung gambar dengan jari lalu menyebut angkanya.'),
    isian('Sila yang berbunyi "Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan" adalah sila ke ....', ['4', 'empat', 'keempat', 'ke-4', 'ke 4', 'ke-empat'],
          kisi='PK5', bahas='Sila keempat: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan.',
          konteks='Sila keempat adalah sila yang paling panjang dan berisi musyawarah, yaitu berunding bersama untuk mengambil keputusan. Bacakan kelima sila berurutan sambil menghitung dengan jari, '
                  'lalu minta anak berhenti di sila yang dimulai dengan kata "Kerakyatan" dan menyebut nomornya.'),
    uraian('Mengapa kita harus datang ke sekolah tepat waktu seperti Rasulullah saw. yang selalu menepati waktu? Jelaskan!',
           'Supaya tidak ketinggalan pelajaran dan tidak mengganggu teman. Tepat waktu menunjukkan kita disiplin dan menghargai waktu.',
           [['ketinggalan', 'terlambat', 'pelajaran', 'belajar', 'mengganggu', 'tertinggal'],
            ['disiplin', 'menghargai waktu', 'tertib', 'teratur', 'rajin', 'teladan', 'contoh', 'dipercaya', 'rapi']],
           minimal=1, kisi='PK3',
           konteks='Rasulullah saw. menepati waktu dalam ibadah dan janji, dan itu adalah contoh disiplin. Tanyakan: "Kalau datang terlambat, apa yang tidak kamu dapat di kelas?" '
                   'Bantu anak menyebut satu alasan dari akibatnya, misalnya ketinggalan pelajaran, atau dari sikapnya, yaitu menghargai waktu.'),
    uraian('Sebutkan dua cara kita bersyukur kepada Allah swt. atas nikmat yang diberikan!',
           'Mengucapkan Alhamdulillah dan menghabiskan makanan yang diberikan. Kita juga bisa berbagi dengan teman.',
           [['alhamdulillah', 'hamdalah', 'syukur', 'berterima kasih', 'terima kasih', 'berdoa', 'doa'],
            ['salat', 'sholat', 'shalat', 'beribadah', 'berbagi', 'sedekah', 'menghabiskan', 'menjaga', 'merawat', 'tidak mengeluh', 'rajin', 'belajar', 'tidak membuang', 'berzikir', 'zikir']],
           minimal=2, kisi='PK6',
           konteks='Bersyukur ditunjukkan lewat ucapan dan perbuatan. Tanyakan ke anak: "Setelah makan enak, apa yang kita ucapkan? Apa lagi yang bisa kita lakukan supaya nikmat itu tidak sia-sia?" '
                   'Bantu ia menyebut satu ucapan dan satu perbuatan.'),
]

paket2 += [
    pg('Meneladani Rasulullah saw., Rafi bertugas piket menghapus papan tulis. Yang sebaiknya Rafi lakukan adalah ....',
       'menyelesaikan tugas piketnya sampai selesai', ['menyuruh temannya mengerjakannya', 'pulang tanpa menyelesaikannya', 'berpura-pura sakit supaya tidak piket'],
       kisi='PK3', bahas='Tanggung jawab berarti menyelesaikan tugas yang menjadi bagian kita.',
       konteks='Tanggung jawab berarti menyelesaikan tugas yang diberikan kepada kita, seperti Rasulullah saw. menjaga amanah dengan sungguh-sungguh. '
               'Tanyakan: "Kalau jadwal piketmu hari ini, apa yang kamu kerjakan sampai selesai?" Pilih tindakan yang tidak melempar tugas ke orang lain.'),
    pg('Pak Satpam berpesan agar murid tidak berlari-lari di lorong sekolah. Anak yang patuh aturan akan ....',
       'berjalan dengan tertib', ['berlomba lari saat istirahat', 'bermain kejar-kejaran di lorong', 'berteriak sambil berlari'],
       gambar=[img('person-walking', label='berjalan')], kisi='PK2', bahas='Di lorong sekolah kita berjalan tertib supaya tidak menabrak teman.',
       konteks='Aturan tidak berlari di lorong dibuat agar tidak ada yang bertabrakan atau terjatuh. Ajak anak membayangkan lorong sekolah yang ramai saat istirahat. '
               'Tanyakan apa yang bisa terjadi bila semua berlari, lalu pilih sikap yang menjaga keselamatan bersama.'),
    pg('Sila yang berbunyi "Ketuhanan Yang Maha Esa" adalah sila ke ....',
       'satu', ['dua', 'tiga', 'empat'], kisi='PK5', bahas='"Ketuhanan Yang Maha Esa" adalah sila pertama.',
       konteks='Urutan sila Pancasila perlu dihafal dengan bunyinya. Sila pertama menyebut Ketuhanan, yaitu tentang iman kepada Allah swt. '
               'Tanyakan ke anak: "Mana sila yang menyebut Tuhan?" Lalu bacakan lima sila secara berurutan sambil menghitung dengan jari.'),
    pg('Gambar bintang pada perisai melambangkan ketuhanan. Sikap yang sesuai dengan lambang ini adalah ....',
       'beribadah dan bersyukur kepada Allah swt.', ['lupa berdoa dan salat', 'mengeluh atas rezeki yang diterima', 'menyembah benda-benda'],
       gambar=[LAMBANG[1]], kisi='PK6',
       bahas='Bintang adalah lambang sila pertama. Kita meneladaninya dengan beribadah dan bersyukur kepada Allah swt.',
       konteks='Bintang bersinar terang di langit dan melambangkan cahaya iman kepada Allah swt. Tanyakan ke anak: "Setelah bangun tidur dan sebelum makan, apa yang kita ucapkan kepada Allah?" '
               'Pilih sikap yang menunjukkan kita mengingat dan berterima kasih kepada-Nya.'),
    isian('Setelah azan Subuh berkumandang, keluarga Hana bangun untuk menunaikan ....', ['salat', 'sholat', 'shalat', 'solat', 'salat subuh', 'sholat subuh', 'shalat subuh', 'salat berjamaah'],
          gambar=[img('sunrise', label='subuh')], kisi='PK1a', bahas='Setelah azan Subuh, kita bangun dan menunaikan salat Subuh.',
          konteks='Banyak keluarga muslim punya aturan bangun saat azan Subuh untuk salat bersama. Tanyakan ke anak: "Kalau azan berbunyi, kegiatan apa yang kita lakukan?" '
                  'Kata yang dicari adalah ibadah yang dilakukan lima kali sehari.'),
    isian('Sebelum masuk ke rumah orang lain, kita mengetuk pintu lalu mengucapkan kalimat salam, yaitu ....', [x for x in SALAM if x != 'salam'] + ['asalamualaikum', 'assalamualaikum wr wb', "assalamu'alaikum wr. wb."], gambar=[img('house')], kisi='PK2',
          bahas="Kita mengucapkan salam, yaitu Assalamu'alaikum, sebelum masuk rumah.",
          konteks='Salam adalah aturan sopan santun sekaligus doa keselamatan saat bertamu. Latih bersama anak: ia berdiri di depan pintu, mengetuk, lalu mengucapkan sesuatu sebelum masuk. '
                  'Tanyakan ucapan apa yang dimulai dengan "Assalamu...".'),
    isian('Gambar kepala banteng pada perisai Garuda adalah lambang sila ke ....', ['4', 'empat', 'keempat', 'ke-4', 'ke 4', 'ke-empat'], gambar=[LAMBANG[4]], kisi='PK4',
          bahas='Kepala banteng adalah lambang sila keempat.',
          konteks='Lambang pada perisai berurutan: bintang, rantai, pohon beringin, kepala banteng, lalu padi dan kapas. Kepala banteng ada di urutan sesudah beringin. '
                  'Ajak anak menghitung gambar dengan jari lalu menyebut angkanya.'),
    isian('Saat berbicara dengan kakek, kita memakai kata-kata yang ....', ['sopan', 'santun', 'halus', 'lembut', 'sopan santun', 'baik dan sopan'], gambar=[img('old-man', label='kakek')], kisi='PK6',
          bahas='Menghormati orang yang lebih tua dengan berbicara sopan.',
          konteks='Menghormati orang yang lebih tua tampak dari cara kita berbicara. Tanyakan ke anak: "Kalau berbicara dengan kakek, apakah suara dan katamu sama dengan saat bercanda dengan teman?" '
                  'Minta ia menyebut sifat kata-kata yang pantas untuk orang tua.'),
    uraian('Mengapa kita tidak boleh membantah ketika orang tua mengingatkan aturan di rumah? Jelaskan!',
           'Karena membantah itu tidak sopan dan membuat orang tua sedih. Kita harus menghormati dan berbakti kepada mereka.',
           [['hormat', 'menghormati', 'sopan', 'santun', 'tidak sopan', 'berbakti', 'bakti', 'menyayangi', 'sayang', 'durhaka', 'dosa', 'berdosa', 'patuh', 'taat'],
            ['sedih', 'marah', 'kecewa', 'sakit hati', 'senang', 'bahagia', 'demi kebaikan', 'untuk kebaikan', 'pahala', 'rida', 'ridha']],
           minimal=1, kisi='PK1b',
           konteks='Orang tua membuat aturan demi kebaikan anak, sehingga menaatinya adalah bentuk hormat dan bakti. Tanyakan: "Kalau ibu mengingatkan dan kamu menjawab dengan nada tinggi, ibu merasa bagaimana?" '
                   'Bantu anak menulis satu alasan dari sisi sopan santun atau perasaan orang tua.'),
    uraian('Mengapa kita berdoa kepada Allah swt. sebelum belajar atau makan? Kaitkan dengan sila pertama!',
           'Karena kita percaya kepada Allah swt. yang Maha Esa. Kita meminta kemudahan dan bersyukur atas rezeki dari-Nya.',
           [['allah', 'tuhan'],
            ['percaya', 'beriman', 'iman', 'yakin', 'bergantung', 'meminta', 'memohon', 'pertolongan', 'izin', 'berkah', 'syukur', 'bersyukur', 'berterima kasih', 'terima kasih',
             'taat', 'takwa', 'bertakwa', 'mengingat', 'ingat', 'kemudahan', 'mudah', 'dimudahkan', 'lancar', 'dilancarkan', 'rezeki', 'rejeki', 'menciptakan', 'memberi']],
           minimal=2, kisi='PK5',
           konteks='Sila pertama mengajarkan bahwa kita percaya dan bergantung kepada Allah swt. Berdoa adalah cara kita mengingat-Nya dan meminta pertolongan. '
                   'Tanyakan: "Siapa yang memberi kita makanan dan ilmu?" Bantu anak menyebut siapa yang ia mintai tolong dan mengapa.'),
]

paket3 += [
    pg('Di perpustakaan sekolah ada aturan menjaga ketenangan. Anak yang patuh aturan akan ....',
       'berbicara dengan suara pelan', ['bercanda dengan suara keras', 'berlari di antara rak buku', 'menelepon dengan suara lantang'],
       gambar=[img('books', label='perpustakaan')], kisi='PK2', bahas='Di perpustakaan kita menjaga ketenangan dengan berbicara pelan.',
       konteks='Setiap tempat punya aturan sendiri; di perpustakaan aturannya adalah tenang agar semua dapat membaca. Tanyakan ke anak: "Kalau temanmu berteriak di perpustakaan, apa yang kamu rasakan?" '
               'Pilih sikap yang tidak mengganggu orang lain.'),
    pg('Sila kelima Pancasila berbunyi ....',
       'Keadilan Sosial bagi Seluruh Rakyat Indonesia', ['Ketuhanan Yang Maha Esa', 'Persatuan Indonesia', 'Kemanusiaan yang Adil dan Beradab'],
       kisi='PK5', bahas='Sila kelima: Keadilan Sosial bagi Seluruh Rakyat Indonesia.',
       konteks='Sila kelima adalah sila terakhir dan berisi keadilan bagi semua rakyat. Bacakan lima sila bersama anak sampai yang terakhir. '
               'Petunjuk: sila ini memuat kata "Keadilan", dan lambangnya padi dan kapas yang berarti makanan dan pakaian cukup untuk semua.'),
    pg('Saat kerja bakti di kampung, Pak RT meminta semua warga ikut membersihkan jalan. Sikap warga yang baik adalah ....',
       'ikut membersihkan jalan bersama-sama', ['menonton dari rumah saja', 'menyuruh orang lain mengerjakannya', 'pulang saat pekerjaan dimulai'], kisi='PK6',
       bahas='Gotong royong berarti ikut bekerja bersama untuk kebaikan bersama.',
       konteks='Gotong royong berarti semua orang ikut bekerja demi kepentingan bersama. Tanyakan: "Kalau semua warga ikut membersihkan jalan, apa bedanya dengan kalau hanya satu orang?" '
               'Pilih sikap yang ikut bekerja, bukan hanya melihat atau menyuruh.'),
    pg('Rima menerima hadiah dari nenek lalu berkata, "Terima kasih, Nek." Sikap Rima menunjukkan bahwa ia ....',
       'bersyukur dan menghargai pemberian', ['merasa sombong', 'tidak peduli pada pemberian', 'ingin hadiah yang lebih banyak'], kisi='PK6',
       bahas='Berterima kasih adalah cara menghargai pemberian dan bersyukur.',
       konteks='Bersyukur berarti berterima kasih atas pemberian, baik kepada Allah swt. maupun kepada sesama. Ajak anak mengingat saat ia menerima hadiah: apa yang ia ucapkan? '
               'Pilih sikap yang menghargai pemberi.'),
    isian('Selesai makan, keluarga Naya mengucapkan syukur dengan kalimat ....', ALHAMDULILLAH, gambar=[img('cooked-rice', label='selesai makan')], kisi='PK1a',
          bahas='Setelah makan kita mengucapkan Alhamdulillah.',
          konteks='Sebelum makan kita membaca Bismillah, dan sesudah makan kita bersyukur. Tanyakan ke anak: "Setelah perut kenyang, apa yang kita ucapkan kepada Allah?" '
                  'Kalimat itu diawali "Alham...".'),
    isian('Ibu melarang bermain ponsel saat waktu belajar. Anak yang berbakti akan ... larangan itu.', ['menaati', 'mematuhi', 'menuruti', 'menurut', 'taat', 'patuh', 'mengikuti', 'mentaati'],
          kisi='PK1b', bahas='Anak yang berbakti menaati aturan orang tua.',
          konteks='Berbakti artinya menaati dan menyayangi orang tua, termasuk saat aturan itu terasa berat. Tanyakan ke anak: "Kalau ibu bilang waktunya belajar, apa yang sebaiknya kamu lakukan?" '
                  'Ia dapat menjawab dengan kata kerja bahwa aturan itu diikuti.'),
    isian('Pada perisai di dada Garuda Pancasila terdapat ... gambar lambang sila.', ['5', 'lima'], kisi='PK4',
          bahas='Ada lima gambar pada perisai, sesuai lima sila Pancasila.',
          konteks='Perisai di dada Garuda berisi satu gambar untuk setiap sila. Ajak anak menghitung sila Pancasila dengan jari: bintang, rantai, pohon beringin, kepala banteng, padi dan kapas. '
                  'Jumlah gambar sama dengan jumlah sila.'),
    isian('"Kemanusiaan yang Adil dan Beradab" adalah bunyi sila ke ....', ['2', 'dua', 'kedua', 'ke-2', 'ke 2', 'ke-dua'], kisi='PK5', bahas='Sila kedua: Kemanusiaan yang Adil dan Beradab.',
          konteks='Sila kedua mengajarkan kita bersikap adil dan beradab (sopan, berakhlak baik) kepada sesama manusia. Bacakan kelima sila berurutan sambil menghitung dengan jari, '
                  'lalu minta anak berhenti di sila yang dimulai dengan kata "Kemanusiaan" dan menyebut nomornya.'),
    uraian('Mengapa kita harus membuang sampah pada tempatnya? Jelaskan dua alasan!',
           'Supaya lingkungan bersih dan indah. Sampah yang berserakan bisa menyebabkan banjir dan penyakit.',
           [['bersih', 'rapi', 'indah', 'asri', 'nyaman', 'sehat', 'tidak kotor', 'tidak berserakan'],
            ['banjir', 'penyakit', 'sakit', 'kuman', 'bau', 'selokan', 'tersumbat', 'nyamuk', 'tikus', 'tidak bau']],
           minimal=2, kisi='PK2',
           konteks='Membuang sampah pada tempatnya menjaga lingkungan dan kesehatan. Tanyakan ke anak: "Kalau selokan penuh sampah dan hujan deras, apa yang bisa terjadi? Kalau halaman bersih, perasaanmu bagaimana?" '
                   'Bantu anak menyebut satu alasan tentang kebersihan dan satu tentang akibat buruknya.'),
    uraian('Tuliskan satu tugas yang menjadi tanggung jawabmu di rumah atau di sekolah, dan bagaimana kamu menjalankannya!',
           'Tugas piket menyapu kelas. Aku menyapu sampai bersih dan tidak menyuruh teman.',
           [['piket', 'menyapu', 'membereskan', 'merapikan', 'mencuci', 'menyiram', 'menyiapkan', 'mengerjakan', 'pr', 'belajar', 'menjaga', 'merawat', 'membantu',
             'mainan', 'tempat tidur', 'buku', 'tas', 'sepatu', 'piring', 'kamar', 'sampah', 'kelas', 'tanaman', 'adik', 'menghapus', 'mengepel']],
           minimal=1, kisi='PK3',
           konteks='Tanggung jawab adalah menyelesaikan tugas yang menjadi bagian kita, seperti Rasulullah saw. menjaga amanah dengan baik. Tanyakan ke anak: "Apa tugasmu setiap hari di rumah atau saat piket?" '
                   'Terima contoh nyata apa pun dari anak, lalu minta ia menyebut cara ia menyelesaikannya.'),
]

# urutan lembar ujian: pg, bs, isian, uraian; di dalam bagian mengikuti urutan indikator kisi-kisi
_J = ['pg', 'bs', 'isian', 'uraian']
_K = ['PK1a', 'PK1b', 'PK2', 'PK3', 'PK4', 'PK5', 'PK6']
for _p in (paket1, paket2, paket3):
    _p.sort(key=lambda q: (_J.index(q['jenis']), _K.index(q['kisi'])))

PAKET = [paket1, paket2, paket3]
