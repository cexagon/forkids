from _alat import *

# Huruf/kata Arab sebagai teks besar (bukan gambar). Sumber An-Nas: mushaf Kemenag (gramedia.com/literasi/surat-an-nas-bahasa-arab-dan-artinya),
# dicocokkan dengan quran.com (6 ayat, Makkiyah, surah ke-114).
def ar(t, size=58):
    """Pilihan jawaban berupa teks Arab besar (svg teks, kanan-ke-kiri)."""
    return svg(f'<text x="120" y="62" text-anchor="middle" direction="rtl" font-size="{size}" fill="{INK}" '
               f'font-family="Amiri, \'Noto Naskh Arabic\', \'Traditional Arabic\', serif">{t}</text>', 240, 90)

AYAT1 = 'قُلْ اَعُوْذُ بِرَبِّ النَّاسِ'
AYAT2 = 'مَلِكِ النَّاسِ'
AYAT3 = 'اِلٰهِ النَّاسِ'
AYAT6 = 'مِنَ الْجِنَّةِ وَالنَّاسِ'

# Kapal Nabi Nuh (hanya kapal, tanpa gambar nabi)
KAPAL = svg(
    '<path d="M10 128 Q40 116 70 128 T130 128 T190 128 T250 128" fill="none" stroke="#4A90C8" stroke-width="7" stroke-linecap="round"/>'
    f'<path d="M22 72 H218 L190 116 H50 Z" fill="#B5763C" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    f'<path d="M36 88 H204 M44 102 H196" stroke="{INK}" stroke-width="3"/>'
    f'<rect x="78" y="34" width="84" height="38" fill="#E9B872" stroke="{INK}" stroke-width="5"/>'
    f'<path d="M70 36 L120 12 L170 36 Z" fill="#C0392B" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    f'<rect x="92" y="46" width="16" height="14" fill="#fff" stroke="{INK}" stroke-width="3"/><rect x="132" y="46" width="16" height="14" fill="#fff" stroke="{INK}" stroke-width="3"/>',
    240, 140)

# ====================================================== PAKET 1
paket1 = [
    # --- PG (6)
    pg('Bacaan ini adalah ayat pertama dari surah ....', 'An-Nas', ['Al-Ikhlas', 'Al-Kausar', 'Al-Asr'],
       gambar=[{'teks': AYAT1}],
       bahas="Ayat ini berbunyi Qul a'udzu birabbin‑nas. Kata 'an‑nas' (manusia) ada di ujung ayat.",
       kisi='AI1',
       konteks="Surah An-Nas adalah surah penutup Al-Qur'an (ke-114) dan terdiri atas 6 ayat. Ayat pertamanya diawali Qul a'udzu, lalu diakhiri kata an‑nas yang artinya manusia. "
               "Ajak anak menunjuk kata di ujung ayat dan membacanya bersama; kata itulah yang menjadi nama surahnya."),
    pg('Allah Al-Hafiz artinya Allah Maha ....', 'Menjaga', ['Mengetahui', 'Penyayang', 'Pemaaf'],
       bahas='Al-Hafiz artinya Maha Menjaga (Maha Memelihara). Allah menjaga kita dan seluruh makhluk-Nya.',
       kisi='AI3',
       konteks="Al-Hafiz artinya Maha Menjaga atau Maha Memelihara. Contohkan: kita tidur nyenyak dan bangun dengan sehat karena Allah menjaga kita sepanjang malam. "
               "Tanyakan, 'Siapa yang menjaga kita saat tidur?' lalu kaitkan dengan nama Al-Hafiz."),
    pg('Allah Al-Halim artinya Allah Maha ....', 'Penyantun', ['Teliti', 'Kuat', 'Kaya'],
       bahas='Al-Halim artinya Maha Penyantun: Allah tidak cepat marah dan tidak tergesa-gesa menghukum hamba-Nya.',
       kisi='AI4',
       konteks="Al-Halim artinya Maha Penyantun, yaitu sangat sabar dan tidak cepat marah. Beri contoh: saat kita lupa atau berbuat salah lalu minta maaf, Allah tidak langsung menghukum. "
               "Bedakan dengan Al-Khabir yang artinya Maha Teliti, supaya anak tidak tertukar."),
    pg('Salat Magrib dikerjakan ketika ....', 'matahari terbenam', ['matahari terbit', 'matahari tepat di atas kepala', 'tengah malam'],
       bahas='Magrib dikerjakan saat matahari terbenam, sesudah Asar.',
       kisi='AI7',
       konteks="Kelima salat fardu punya waktu sendiri: Subuh menjelang terbit matahari, Zuhur siang, Asar sore, Magrib saat matahari terbenam, Isya malam. "
               "Ajak anak mengamati langit sore dan bertanya, 'Kapan adzan Magrib berkumandang?' sehingga ia mengaitkan Magrib dengan matahari yang baru tenggelam."),
    pg('Nabi Nuh a.s. mengajak kaumnya untuk menyembah ....', 'Allah Yang Maha Esa', ['patung besar', 'matahari', 'pohon besar'],
       bahas='Kaum Nabi Nuh a.s. menyembah berhala. Nabi Nuh a.s. mengajak mereka menyembah Allah saja.',
       kisi='AI8',
       konteks="Nabi Nuh a.s. adalah utusan Allah. Kaumnya dahulu menyembah patung (berhala), lalu Nabi Nuh a.s. mengajak mereka menyembah Allah saja. Mengajak orang kepada kebaikan disebut dakwah. "
               "Tanyakan kepada anak, 'Kepada siapa kita berdoa dan menyembah?' untuk menuntunnya ke jawaban."),
    pg('Nabi Nuh a.s. membuat kapal yang sangat besar. Sikap beliau yang patut kita contoh adalah ....',
       'bekerja keras dan tidak mudah menyerah', ['cepat marah kalau diejek', 'berhenti bekerja kalau lelah', 'menyuruh orang lain saja'],
       gambar=[KAPAL],
       kisi='AI9',
       konteks="Membuat kapal besar dari kayu itu pekerjaan yang berat dan lama, apalagi Nabi Nuh a.s. sering diejek. Beliau tetap bekerja keras dan tidak menyerah. "
               "Tanyakan, 'Kalau Kakak diejek saat mengerjakan sesuatu yang sulit, apa yang Nabi Nuh a.s. contohkan?'"),

    # --- Isian (6)
    isian('Huruf ini dibaca ba. Huruf ini keluar dari kedua ....', ['bibir', 'dua bibir', 'kedua bibir', 'bibir mulut'],
          gambar=[{'teks': 'ب'}],
          bahas='Huruf ba, mim, dan waw keluar dari kedua bibir.',
          kisi='AI2',
          konteks="Makharijul huruf artinya tempat keluarnya huruf. Huruf ب (ba) diucapkan dengan merapatkan kedua bibir. "
                  "Ajak anak mengucapkan 'ba, ba, ba' di depan cermin dan merasakan bibirnya yang menutup, lalu tanyakan bagian mulut mana yang bekerja."),
    isian('Allah Maha Teliti. Nama Allah ini adalah Al-....', ['khabir', 'khobir', 'habir', 'al khabir', 'al-khabir', 'alkhabir'],
          bahas='Al-Khabir artinya Maha Teliti (Maha Mengetahui hal yang kecil dan tersembunyi).',
          kisi='AI4',
          konteks="Al-Khabir artinya Maha Teliti, yaitu Allah mengetahui semua hal, bahkan yang kecil dan tersembunyi. "
                  "Ingatkan anak pada daftar nama yang pernah dihafalkan: Al-Hafiz (menjaga), Al-Wali (melindungi), Al-Halim (penyantun), dan yang ini."),
    isian('Teman kita terjatuh dan kakinya sakit. Sikap yang baik adalah segera ... teman itu.',
          ['menolong', 'membantu', 'tolong', 'bantu', 'menolongnya', 'membantunya', 'menolong dia', 'membantu dia'],
          gambar=[img('crying-face')],
          bahas='Menolong teman yang kesusahan adalah tanda sayang dan peduli.',
          kisi='AI5',
          konteks="Empati artinya ikut merasakan perasaan orang lain, lalu mau membantu. Teman yang jatuh pasti kesakitan; kita menolongnya karena sayang. "
                  "Tanyakan, 'Kalau Kakak yang jatuh, ingin ditolong atau ditertawakan?' lalu minta anak menyebut apa yang akan ia lakukan."),
    isian('Berkata sesuai kenyataan dan tidak berbohong disebut sikap ....', ['jujur', 'kejujuran', 'berkata jujur', 'bersikap jujur'],
          bahas='Orang yang tidak berbohong adalah orang yang jujur.',
          kisi='AI6',
          konteks="Jujur artinya berkata dan berbuat sesuai kenyataan. Contoh: bila gelas pecah karena tersenggol, kita mengaku, bukan menyalahkan orang lain. "
                  "Tanyakan, 'Kalau Ibu bertanya siapa yang makan kue, dan Kakak yang makan, apa yang Kakak katakan?'"),
    isian('Salat Zuhur dikerjakan sebanyak ... rakaat.', ['4', 'empat', '4 rakaat'],
          bahas='Rakaat salat fardu: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4.',
          kisi='AI7',
          konteks="Jumlah rakaat: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4. Trik mengingat: hanya Subuh dan Magrib yang tidak empat. "
                  "Ajak anak menghitung 'berdiri-rukuk-sujud-sujud' sebagai satu rakaat, lalu menghitung bersama sampai Zuhur selesai."),
    isian('Nabi Nuh a.s. tidak marah ketika diejek kaumnya. Nabi Nuh a.s. bersikap ....', ['sabar', 'penyabar', 'bersabar', 'sabar dan tabah'],
          bahas='Nabi Nuh a.s. sabar menghadapi ejekan dan tetap berdakwah.',
          kisi='AI9',
          konteks="Sabar artinya tetap tenang dan tidak marah saat menghadapi kesulitan atau ejekan. Nabi Nuh a.s. berdakwah sangat lama, banyak yang menolak, tetapi beliau tidak marah dan tidak menyerah. "
                  "Contoh sehari-hari: menunggu giliran dengan tenang. Tanyakan sikap itu namanya apa."),

    # --- Uraian (3)
    uraian('Tulislah pesan pokok Surah An-Nas dengan kalimatmu sendiri.',
           contoh='Kita memohon perlindungan kepada Allah dari bisikan setan yang jahat.',
           kata_kunci=[['berlindung', 'perlindungan', 'lindung', 'memohon', 'minta tolong'], ['allah', 'tuhan'], ['setan', 'syaitan', 'bisikan', 'godaan', 'jahat', 'buruk']],
           minimal=2,
           bahas='Surah An-Nas mengajarkan kita berlindung kepada Allah dari bisikan jahat setan.',
           kisi='AI1',
           konteks="Pesan pokok An-Nas: kita berlindung hanya kepada Allah, Tuhan manusia, dari bisikan jahat (setan dari golongan jin dan manusia). Ceritakan dengan bahasa anak: kadang ada suara di hati yang mengajak malas, bohong, atau marah. "
                   "Tanyakan, 'Kalau hati kita dibisiki hal buruk, kita minta tolong kepada siapa?'"),
    uraian('Mengapa kita harus berperilaku jujur? Tulislah satu alasanmu.',
           contoh='Karena Allah suka orang yang jujur dan orang lain jadi percaya kepada kita.',
           kata_kunci=[['allah', 'disukai', 'pahala', 'dosa', 'surga', 'tuhan'], ['percaya', 'dipercaya', 'teman', 'ibu', 'guru', 'orang tua', 'tenang', 'aman', 'baik', 'benar']],
           minimal=1,
           bahas='Jujur disukai Allah, membuat kita dipercaya, dan hati kita tenang.',
           kisi='AI6',
           konteks="Alasan jujur ada banyak: Allah menyukai orang jujur, orang lain jadi percaya kepada kita, dan hati kita tenang. Terima jawaban dengan kata anak sendiri. "
                   "Pancing dengan cerita: anak yang pernah berbohong lalu takut ketahuan, dan bandingkan dengan rasanya setelah berkata jujur."),
    uraian('Tulislah nama kelima salat fardu.',
           contoh='Subuh, Zuhur, Asar, Magrib, dan Isya.',
           kata_kunci=[['subuh', 'shubuh', 'subuhh'], ['zuhur', 'dzuhur', 'duhur', 'zhuhur', 'zuhr', 'lohor', 'dhuhur', 'dzhuhur'],
                       ['asar', 'ashar', 'asr', 'ashr'], ['magrib', 'maghrib', 'magrib'], ['isya', "isya'", 'isyak', 'isha', 'insya']],
           minimal=5,
           bahas='Urutannya dari pagi: Subuh, Zuhur, Asar, Magrib, Isya.',
           kisi='AI7',
           konteks="Salat fardu (wajib) ada lima kali sehari semalam. Hafalkan berurutan dari pagi hingga malam sambil mengaitkan dengan kegiatan: bangun tidur (Subuh), siang (Zuhur), sore (Asar), matahari terbenam (Magrib), malam (Isya). "
                   "Minta anak menyebut sambil menghitung dengan jari."),
]

# ====================================================== PAKET 2
paket2 = [
    # --- PG (6)
    pg('Ayat pada kotak ini dibaca ....', 'Malikin‑nas', ['Ilahin‑nas', 'Minal jinnati wan‑nas', "Qul a'udzu birabbin‑nas"],
       gambar=[{'teks': AYAT2}],
       bahas='Ayat kedua Surah An-Nas: Malikin‑nas, artinya Raja manusia.',
       kisi='AI1',
       konteks="Ayat kedua Surah An-Nas berbunyi Malikin‑nas, artinya 'Raja manusia'. Ayat 1 sampai 3 menyebut tiga sifat Allah: Tuhan (Rabb), Raja (Malik), dan yang disembah (Ilah) bagi manusia. "
               "Ajak anak membaca ayat 1, 2, 3 berurutan; huruf pertama setiap ayat membantunya membedakan."),
    pg("Huruf-huruf ini dibaca dari kanan. Jika disambung menjadi ....", ar('كَتَبَ'), [ar('كَبَتَ'), ar('تَبَكَ'), ar('بَكَتَ')],
       gambar=[{'teks': 'ب'}, {'teks': '+'}, {'teks': 'ت'}, {'teks': '+'}, {'teks': 'ك'}],
       bahas='Urutan huruf mengikuti ك lebih dulu, lalu ت, lalu ب. Dibaca kataba.',
       kisi='AI2',
       konteks="Dalam huruf Arab, tulisan bersambung dibaca dari kanan ke kiri, dan bentuk huruf berubah di awal, tengah, atau akhir kata. "
               "Ajak anak membaca urutan huruf dari kanan: ka, ta, ba. Lalu cari pilihan yang mulai dengan ka, disusul ta, dan diakhiri ba."),
    pg('Budi tidak membawa bekal ke sekolah. Sikap sayang yang baik adalah ....', 'membagi bekalku dengan Budi',
       ['tertawa melihat Budi', 'makan cepat agar tidak diminta', 'pura-pura tidak tahu'],
       bahas='Berbagi dengan teman adalah wujud sayang dan empati.',
       kisi='AI5',
       konteks="Sayang kepada sesama berarti peduli dan mau berbagi. Anak bisa membayangkan dirinya lapar tanpa bekal. "
               "Tanyakan, 'Kalau Kakak tidak membawa bekal, Kakak ingin teman melakukan apa?' lalu minta ia memilih tindakan yang sama kepada Budi."),
    pg('Kamu ingin meminjam penghapus teman. Kalimat yang lembut adalah ....', 'Maaf, boleh aku pinjam penghapusmu?',
       ['Pinjam penghapusmu, cepat!', 'Hei, mana penghapusmu?', 'Aku ambil penghapusmu ya!'],
       gambar=[img('pencil')],
       bahas='Kata maaf dan boleh membuat kalimat terdengar lembut dan sopan.',
       kisi='AI6',
       konteks="Tutur kata lembut ditandai nada pelan dan kata-kata seperti tolong, maaf, boleh, dan terima kasih. Bacakan keempat pilihan dengan nada berbeda dan tanyakan mana yang enak didengar. "
               "Bisa juga berperan: Ibu menjadi teman, anak meminjam sesuatu dengan kalimat lembut."),
    pg('Salat Zuhur dikerjakan pada waktu ....', 'siang, setelah matahari condong ke barat',
       ['pagi sebelum matahari terbit', 'sore menjelang matahari terbenam', 'malam hari'],
       gambar=[img('sun')],
       bahas='Zuhur dikerjakan siang hari, ketika matahari sudah bergeser dari tengah langit ke barat.',
       kisi='AI7',
       konteks="Waktu salat mengikuti posisi matahari. Zuhur dikerjakan pada siang hari, saat matahari sudah bergeser sedikit dari puncak langit. "
               "Bandingkan dengan pilihan lain: pagi itu Subuh, sore itu Asar, malam itu Isya. Ajak anak menghubungkan dengan kegiatan siang, misalnya pulang sekolah."),
    pg('Dika diejek temannya, tetapi ia tidak marah dan terus berlatih. Sikap Dika seperti Nabi Nuh a.s., yaitu ....',
       'sabar dan tidak menyerah', ['pemarah dan pendendam', 'malas dan mudah bosan', 'suka mengejek balik'],
       bahas='Nabi Nuh a.s. sabar menghadapi ejekan dan tetap bekerja keras.',
       kisi='AI9',
       konteks="Nabi Nuh a.s. diejek ketika membuat kapal di daratan, tetapi beliau tetap sabar dan tekun. Kisah ini cocok dikaitkan dengan pengalaman anak, misalnya diejek karena belum bisa sesuatu. "
               "Tanyakan, 'Apa yang dilakukan Dika? Cocok dengan sikap Nabi Nuh a.s. yang mana?'"),

    # --- Isian (6)
    isian('Surah An-Nas terdiri atas ... ayat.', ['6', 'enam', '6 ayat', 'enam ayat'],
          bahas='Surah An-Nas terdiri atas 6 ayat dan termasuk surah Makkiyah.',
          kisi='AI1',
          konteks="Surah An-Nas memiliki 6 ayat. Ajak anak membaca surah itu sambil menghitung ayatnya dengan jari, karena akhir tiap ayat selalu ditutup kata an‑nas atau serupa. "
                  "Hitung ayatnya satu per satu, jangan sekadar menebak angkanya."),
    isian('Nama Allah yang artinya Maha Melindungi adalah Al-....', ['wali', 'waly', 'al wali', 'al-wali', 'alwali'],
          bahas='Al-Wali artinya Maha Melindungi dan Maha Menolong orang beriman.',
          kisi='AI3',
          konteks="Al-Wali artinya Maha Melindungi (Maha Menolong). Contohkan: saat takut, kita berdoa dan percaya Allah melindungi kita, seperti orang tua melindungi anak. "
                  "Bantu anak mengingat dua nama: Al-Hafiz menjaga, Al-Wali melindungi. Lalu tanyakan nama yang artinya 'melindungi'."),
    isian('Nama Allah yang artinya Maha Penyantun adalah Al-....', ['halim', 'haliim', 'al halim', 'al-halim', 'alhalim'],
          bahas='Al-Halim artinya Maha Penyantun: tidak cepat marah.',
          kisi='AI4',
          konteks="Al-Halim artinya Maha Penyantun, yaitu sangat sabar dan tidak cepat menghukum. Ceritakan: meski kita kadang lupa atau salah, Allah masih memberi kesempatan untuk memperbaiki diri. "
                  "Tanyakan, 'Allah yang sabar dan tidak cepat marah itu namanya Al-apa?' Beri petunjuk huruf awalnya bila perlu."),
    isian('Sebelum meminta bantuan dengan sopan, kita berkata: "Ibu, ... ambilkan minum."', ['tolong', 'tolong ya', 'tolong, ya'],
          bahas='Kata tolong membuat permintaan terdengar lembut.',
          kisi='AI6',
          konteks="Kata ajaib untuk meminta dengan lembut: tolong, maaf, dan terima kasih. Minta anak mengucapkan kalimat itu pelan-pelan dengan nada baik. "
                  "Beri contoh perbandingan: 'Ambilkan minum!' dan 'Bu, ... ambilkan minum.' Tanyakan kata mana yang membuat kalimat kedua lebih sopan."),
    isian('Salat Subuh dikerjakan sebanyak ... rakaat.', ['2', 'dua', '2 rakaat', 'dua rakaat'],
          bahas='Subuh 2 rakaat, Zuhur 4, Asar 4, Magrib 3, Isya 4.',
          kisi='AI7',
          konteks="Salat Subuh adalah salat fardu yang paling singkat, hanya dua rakaat. Ingatkan anak bahwa Subuh itu pagi hari dan paling pendek. "
                  "Coba hitung bersama: satu rakaat adalah berdiri-rukuk-sujud-sujud, jadi dua rakaat ada dua putaran seperti itu."),
    isian('Kaum Nabi Nuh a.s. menyembah benda buatan manusia yang disebut ....', ['berhala', 'patung', 'patung berhala', 'berhala-berhala'],
          bahas='Berhala adalah patung yang disembah. Menyembah berhala adalah perbuatan yang salah.',
          kisi='AI8',
          konteks="Kaum Nabi Nuh a.s. menyembah patung buatan manusia yang disebut berhala. Nabi Nuh a.s. mengajak mereka meninggalkannya dan hanya menyembah Allah. "
                  "Tanyakan, 'Apa nama patung yang mereka sembah?' Jika anak lupa, ingatkan bahwa kata itu dimulai dengan 'ber-'."),

    # --- Uraian (3)
    uraian('Bagaimana sikap kita meneladani sifat Allah Al-Halim? Tulislah satu contohnya.',
           contoh='Kita sabar dan tidak cepat marah, misalnya memaafkan teman yang tidak sengaja menyenggol kita.',
           kata_kunci=[['memaafkan', 'maafkan', 'menahan marah', 'sabar', 'tidak marah', 'tidak cepat marah', 'tidak memarahi', 'penyabar']],
           minimal=1,
           bahas='Al-Halim = Maha Penyantun. Kita belajar sabar dan tidak cepat marah.',
           kisi='AI4',
           konteks="Al-Halim artinya Maha Penyantun. Meneladani nama Allah ini artinya belajar tidak cepat marah dan mau memaafkan. "
                   "Bantu dengan tanya: apa yang kamu lakukan kalau adik merusak mainanmu tanpa sengaja? Anak menjawab dengan kata sendiri."),
    uraian('Apa yang dapat kita teladani dari Nabi Nuh a.s. saat membuat kapal? Jelaskan.',
           contoh='Nabi Nuh a.s. sabar saat diejek dan bekerja keras membuat kapal sampai selesai.',
           kata_kunci=[['sabar', 'tidak marah', 'bersabar', 'tabah'], ['kerja keras', 'rajin', 'semangat', 'tekun', 'tidak menyerah', 'berusaha', 'bekerja keras', 'giat']],
           minimal=2,
           bahas='Nabi Nuh a.s. sabar dan bekerja keras.',
           kisi='AI9',
           konteks="Kisahnya: Nabi Nuh a.s. diperintah Allah membuat kapal besar. Orang-orang mengejeknya, tetapi beliau sabar dan bekerja keras hingga kapal selesai. "
                   "Ajak anak menceritakan ulang dengan suaranya sendiri; sebut dua sifat baik yang muncul."),
    uraian('Sebutkan empat anggota badan yang dibasuh atau diusap saat berwudu.',
           contoh='Muka, tangan (sampai siku), kepala, dan kaki.',
           kata_kunci=[['muka', 'wajah'], ['tangan', 'siku'], ['kepala', 'rambut'], ['kaki']],
           minimal=4,
           bahas='Muka, tangan sampai siku, kepala (diusap), dan kaki sampai mata kaki.',
           kisi='AI7',
           konteks="Saat wudu, kita membasuh muka, tangan sampai siku, lalu mengusap kepala, dan membasuh kaki sampai mata kaki. "
                   "Minta anak memperagakan wudu pelan-pelan sambil menyebut setiap anggota yang disentuh air, lalu menulisnya."),
]

# ====================================================== PAKET 3
paket3 = [
    # --- PG (6)
    pg('Allah selalu menolong dan melindungi orang-orang yang beriman. Nama Allah yang sesuai adalah ....', 'Al-Wali',
       ['Al-Khabir', 'Al-Halim', 'Al-Ghaffar'],
       bahas='Al-Wali artinya Maha Melindungi (Maha Penolong) orang-orang beriman.',
       kisi='AI3',
       konteks="Al-Wali berarti Maha Melindungi atau Maha Penolong. Kita merasa aman karena yakin Allah menolong dan melindungi orang beriman. "
               "Bantu anak dengan contoh: orang tua melindungi anaknya, tetapi perlindungan Allah jauh lebih besar. Ingatkan arti Al-Khabir (teliti) dan Al-Halim (penyantun) agar tidak tertukar."),
    pg('Rani sedih karena tidak punya teman bermain. Sikap kamu yang paling baik adalah ....', 'mengajak Rani bermain bersama',
       ['membiarkan Rani sendirian', 'menertawakan Rani', 'bermain tanpa menoleh ke Rani'],
       gambar=[img('crying-face')],
       bahas='Mengajak teman yang sendirian bermain adalah wujud sayang dan empati.',
       kisi='AI5',
       konteks="Empati artinya menyadari perasaan teman dan mau bertindak. Rani sedih karena merasa sendirian. "
               "Ajak anak membayangkan dirinya yang tak punya teman bermain; tanyakan bagaimana rasanya dan apa yang ia harapkan dari orang lain."),
    pg('Salat yang dikerjakan sebanyak 3 rakaat adalah salat ....', 'Magrib', ['Subuh', 'Zuhur', 'Asar'],
       bahas='Magrib 3 rakaat. Subuh 2 rakaat, Zuhur dan Asar masing-masing 4 rakaat.',
       kisi='AI7',
       konteks="Jumlah rakaat: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4. Yang tiga rakaat hanya satu, yaitu Magrib. "
               "Ajak anak menyanyikan urutan, 'dua, empat, empat, tiga, empat', lalu mencocokkannya dengan nama salat."),
    pg('Bersuci sebelum salat dengan membasuh muka, tangan, mengusap kepala, dan membasuh kaki disebut ....', 'wudu',
       ['azan', 'ikamah', 'tayamum'],
       bahas='Wudu adalah bersuci dengan air sebelum salat.',
       kisi='AI7',
       konteks="Wudu adalah cara bersuci dengan air sebelum salat. Urutannya mulai dari niat, membasuh muka, tangan sampai siku, mengusap kepala, lalu membasuh kaki sampai mata kaki. "
               "Ajak anak mempraktikkan wudu sambil menyebut anggota yang dibasuh, lalu tanyakan nama kegiatan itu."),
    pg('Nabi Nuh a.s. berdakwah dengan sabar dalam waktu yang sangat lama, yaitu ....', '950 tahun', ['95 tahun', '59 tahun', '500 tahun'],
       bahas='Menurut Al-Qur\'an (Surah Al-Ankabut ayat 14) Nabi Nuh a.s. berdakwah 950 tahun, hampir seribu tahun.',
       kisi='AI8',
       konteks="Al-Qur'an menyebut Nabi Nuh a.s. tinggal di tengah kaumnya hampir seribu tahun (950 tahun), mengajak mereka menyembah Allah. Dakwah artinya mengajak orang kepada kebaikan. "
               "Ceritakan bahwa angka ini besar sekali, hampir 1000, dan beliau tetap tidak menyerah."),
    pg('Nabi Nuh a.s. bekerja keras membuat kapal. Contoh sikap kerja keras di sekolah adalah ....', 'mengerjakan tugas sampai selesai walau sulit',
       ['menunda tugas sampai besok', 'menyontek pekerjaan teman', 'meminta teman mengerjakan tugasku'],
       gambar=[KAPAL],
       bahas='Kerja keras berarti terus berusaha sampai selesai.',
       kisi='AI9',
       konteks="Kerja keras artinya terus berusaha sampai tugas selesai, walau sulit atau melelahkan, seperti Nabi Nuh a.s. membuat kapal. "
               "Hubungkan dengan tugas sekolah: anak merasa sulit mewarnai atau menulis, tetapi tetap mencoba. Tanyakan pilihan mana yang menunjukkan hal itu."),

    # --- Isian (6)
    isian("Lanjutkan hafalan Surah An-Nas ayat 4: Min syarril waswasil ....", ['khannas', 'khonnas', 'khanas', 'kannas', 'hannas', 'al khannas', 'al-khannas', 'alkhannas', 'il khannas'],
          bahas="Ayat 4: Min syarril waswasil khannas, artinya dari kejahatan (bisikan) setan yang bersembunyi.",
          kisi='AI1',
          konteks="Ayat 4 Surah An-Nas berbunyi Min syarril waswasil khannas, artinya 'dari kejahatan bisikan setan yang bersembunyi'. Al-khannas adalah setan yang mundur dan bersembunyi ketika kita mengingat Allah. "
                  "Ajak anak membaca surahnya dari ayat 1 tanpa melihat; biasanya kata yang hilang muncul sendiri saat ia sampai di ayat 4. Ejaan latin boleh beragam (khannas, khonnas)."),
    isian('Huruf ه (ha) keluar dari ....', ['tenggorokan', 'tenggorok', 'kerongkongan', 'rongga tenggorokan'],
          gambar=[{'teks': 'ه'}],
          bahas='Huruf ha keluar dari tenggorokan bagian bawah.',
          kisi='AI2',
          konteks="Huruf ha (ه) diucapkan dari tenggorokan. Suruh anak meletakkan tangan di leher lalu mengucapkan 'ha, ha, ha' pelan; rasakan napas keluar dari dalam tenggorokan. "
                  "Bandingkan dengan huruf ba yang keluar dari bibir, agar anak dapat membedakan tempat keluar huruf."),
    isian('Allah Al-Khabir artinya Allah Maha ....', ['teliti', 'maha teliti', 'mengetahui', 'maha mengetahui', 'mengenal'],
          bahas='Al-Khabir artinya Maha Teliti: Allah tahu semua hal, termasuk yang tersembunyi.',
          kisi='AI4',
          konteks="Al-Khabir artinya Maha Teliti atau Maha Mengetahui. Allah tahu perbuatan kita, bahkan yang tidak dilihat orang. "
                  "Contoh: Kakak merapikan mainan walau Ibu tidak melihat, Allah tahu. Bantu anak mengingat arti nama ini dengan satu kata."),
    isian('Rudi menemukan uang di lantai kelas. Sikap jujur Rudi adalah ... uang itu kepada guru.',
          ['menyerahkan', 'memberikan', 'mengembalikan', 'memberi', 'menyerahkannya', 'memberikannya', 'mengembalikannya'],
          bahas='Uang yang bukan milik kita harus diserahkan kepada guru agar kembali ke pemiliknya.',
          kisi='AI6',
          konteks="Sikap jujur berarti tidak mengambil milik orang lain. Uang yang ditemukan sebaiknya diserahkan kepada guru supaya pemiliknya dapat mengambilnya kembali. "
                  "Bertanyalah, 'Kalau uang Kakak yang jatuh, Kakak ingin ditemukan oleh siapa?' lalu minta anak melengkapi kalimat."),
    isian('Salat yang wajib dikerjakan lima kali sehari semalam disebut salat ....', ['fardu', 'fardhu', 'fardlu', 'wajib', 'salat fardu', 'shalat fardhu'],
          bahas='Salat fardu adalah salat wajib: Subuh, Zuhur, Asar, Magrib, dan Isya.',
          kisi='AI7',
          konteks="Salat fardu artinya salat yang wajib dikerjakan, lima kali sehari semalam. Jelaskan 'fardu' berarti wajib, tidak boleh ditinggalkan. "
                  "Tanyakan kepada anak ada berapa salat dalam sehari, dan kata apa yang dipakai untuk salat wajib itu."),
    isian('Nabi Nuh a.s. tetap membuat kapal dan tidak ... walau diejek.', ['menyerah', 'putus asa', 'berhenti', 'mundur'],
          bahas='Nabi Nuh a.s. tidak menyerah dan terus bekerja keras.',
          kisi='AI9',
          konteks="Nabi Nuh a.s. terus membuat kapal walau diejek dan banyak yang tidak percaya, ini bukti kerja keras dan tidak menyerah. "
                  "Tanyakan, 'Kalau sulit, apakah kita berhenti atau tetap mencoba?' Bantu anak melengkapi kalimat dengan kata yang sesuai."),

    # --- Uraian (3)
    uraian('Adi ingin berbohong karena ada bisikan buruk di hatinya. Apa yang sebaiknya Adi baca dan lakukan? Jelaskan.',
           contoh="Adi membaca Surah An-Nas dan berlindung kepada Allah dari bisikan setan, lalu memilih berkata jujur.",
           kata_kunci=[['berlindung', 'a\'udzu', 'audzu', 'an‑nas', 'an nas', 'istigfar', 'minta tolong', 'meminta perlindungan', 'memohon'], ['allah', 'tuhan'],
                       ['tidak berbohong', 'jujur', 'menolak', 'jauhi', 'menjauh', 'tidak jadi', 'berkata benar']],
           minimal=2,
           bahas='Kita berlindung kepada Allah dari bisikan setan dan memilih berbuat baik.',
           kisi='AI1',
           konteks="Surah An-Nas mengajarkan kita berlindung kepada Allah dari bisikan jahat setan, misalnya bisikan untuk berbohong. Jelaskan bahwa kita bisa membaca surah itu lalu memilih jujur. "
                   "Tanyakan, 'Kalau hati terasa ingin bohong, apa yang bisa Adi baca, dan apa yang Adi lakukan sesudahnya?'"),
    uraian('Mengapa kita tetap harus berbuat baik walaupun tidak ada orang yang melihat? Hubungkan dengan nama Allah Al-Khabir.',
           contoh='Karena Allah Maha Teliti dan tahu semua perbuatan kita, termasuk yang tidak terlihat orang.',
           kata_kunci=[['allah', 'tuhan'], ['tahu', 'mengetahui', 'teliti', 'melihat', 'mengawasi'], ['tersembunyi', 'sendiri', 'tidak terlihat', 'diam-diam']],
           minimal=2,
           bahas='Allah Al-Khabir tahu semua perbuatan kita.',
           kisi='AI4',
           konteks="Al-Khabir mengajarkan bahwa Allah mengetahui semuanya, termasuk perbuatan yang tersembunyi. Karena itu kita jujur dan berbuat baik walau tidak ada yang melihat. "
                   "Beri contoh: membuang sampah pada tempatnya saat sendirian. Tanyakan apakah Allah tahu dan mengapa itu penting."),
    uraian('Tuliskan dua kata atau kalimat lembut yang biasa kamu ucapkan kepada ibu atau temanmu.',
           contoh='Tolong, maaf, terima kasih, dan boleh aku pinjam?',
           kata_kunci=[['tolong'], ['maaf', 'mohon maaf'], ['terima kasih', 'terimakasih', 'makasih'], ['silakan', 'silahkan'], ['boleh', 'bolehkah'], ['permisi'], ['assalamualaikum', 'salam']],
           minimal=2,
           bahas='Contoh kata lembut: tolong, maaf, terima kasih, silakan, permisi.',
           kisi='AI6',
           konteks="Tutur kata lembut dilakukan dengan nada pelan dan kata sopan seperti tolong, maaf, terima kasih, silakan, dan permisi. "
                   "Latih dengan peran: Ibu meminta anak menyebut kalimat yang biasa dipakai saat meminta bantuan, minta maaf, atau berterima kasih. Terima jawaban apa pun yang sopan."),
]

# ====================================================== TAMBAHAN (genapkan ke kisi-kisi: 25 soal per paket)
paket1 += [
    pg('Kata ini dibaca ....', 'qalam', ['qilam', 'qulam', 'kalam'],
       gambar=[{'teks': 'قَلَم'}],
       bahas='Huruf ق (qaf), ل (lam), dan م (mim) bersambung dibaca dari kanan: qa-la-m, yaitu qalam (pena).',
       kisi='AI2',
       konteks="Huruf Arab bersambung dibaca dari kanan ke kiri. Kata ini terdiri atas ق (qa), ل (la), dan م (m), sehingga dibaca qalam, artinya pena. "
               "Ajak anak menunjuk huruf dari kanan satu per satu dan membunyikannya, lalu menggabungkannya. Perhatikan ق berbeda dengan ك (kaf)."),
    pg('Teman sebangkumu sakit dan tidak masuk sekolah. Sikap sayang yang baik adalah ....', 'mendoakan dan menanyakan kabarnya',
       ['senang karena tempat dudukku jadi luas', 'tidak peduli sama sekali', 'mengejek karena ia tidak masuk'],
       bahas='Mendoakan dan menanyakan kabar teman yang sakit adalah wujud sayang dan empati.',
       kisi='AI5',
       konteks="Empati dan sayang kepada teman ditunjukkan dengan peduli saat ia kesusahan, misalnya sakit. Mendoakan dan menanyakan kabar membuat teman merasa diperhatikan. "
               "Tanyakan, 'Kalau Kakak sedang sakit, Kakak ingin teman berbuat apa?' lalu hubungkan dengan pilihan yang benar."),
    pg('Ibu memanggilmu untuk makan malam. Jawaban yang lembut adalah ....', 'Iya, Bu, sebentar ya.',
       ['Apaan sih!', 'Nanti dulu!', 'Aku tidak mau!'],
       bahas='Menjawab dengan nada pelan dan kata sopan seperti "iya, Bu" menunjukkan tutur kata yang lembut.',
       kisi='AI6',
       konteks="Tutur kata lembut berarti memakai kata dan nada yang enak didengar, terutama kepada orang tua. 'Iya, Bu' menunjukkan hormat. "
               "Bacakan keempat jawaban dengan nada berbeda dan minta anak memilih yang membuat Ibu senang."),
    pg('Dalam sehari semalam kita mengerjakan salat fardu sebanyak ....', '5 kali', ['3 kali', '4 kali', '6 kali'],
       bahas='Salat fardu ada lima: Subuh, Zuhur, Asar, Magrib, dan Isya.',
       kisi='AI7',
       konteks="Salat fardu (wajib) dikerjakan lima kali sehari semalam: Subuh, Zuhur, Asar, Magrib, Isya. "
               "Ajak anak menyebut kelimanya sambil menghitung dengan jari tangan; satu tangan penuh sama dengan lima waktu salat."),
    isian('Lengkapi ayat ketiga Surah An-Nas: ... an‑nas.', ['ilahi', 'ilahin', 'ilah', 'ilaahi', 'ilaahin', 'ilahin-nas', 'ilahin‑nas', 'ilahinnas', 'ilahin nas', 'ilahi nas'],
          gambar=[{'teks': AYAT3}],
          bahas='Ayat 3: Ilahin‑nas, artinya Sembahan manusia.',
          kisi='AI1',
          konteks="Ayat 1 sampai 3 Surah An-Nas diawali tiga sebutan untuk Allah: Rabbi (Tuhan), Maliki (Raja), Ilahi (Sembahan), lalu ditutup an‑nas. "
                  "Minta anak melafalkan ayat 1 dan 2 lebih dulu, lalu ayat 3, dan menulis kata pertamanya. Ejaan latin boleh beragam (ilahi, ilahin)."),
    isian('Allah Al-Wali artinya Allah Maha ....', ['melindungi', 'pelindung', 'maha melindungi', 'menolong', 'penolong', 'melindunginya'],
          bahas='Al-Wali artinya Maha Melindungi (Maha Menolong) orang-orang beriman.',
          kisi='AI3',
          konteks="Al-Wali artinya Maha Melindungi atau Penolong. Beri contoh: kita merasa aman karena yakin Allah melindungi, seperti anak merasa aman di dekat orang tuanya. "
                  "Beda dengan Al-Hafiz yang berarti Maha Menjaga; tanyakan arti nama yang sedang ditanyakan."),
    isian('Salat Magrib dikerjakan sebanyak ... rakaat.', ['3', 'tiga', '3 rakaat', 'tiga rakaat'],
          bahas='Rakaat salat fardu: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4.',
          kisi='AI7',
          konteks="Jumlah rakaat: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4. Magrib adalah satu-satunya salat yang tiga rakaat. "
                  "Ajak anak menyanyikan 'dua, empat, empat, tiga, empat' lalu mencari yang kelima dari kiri; Magrib berada di urutan keempat."),
    isian('Nabi Nuh a.s. mengajak kaumnya kepada kebaikan. Kegiatan mengajak orang kepada kebaikan disebut ....',
          ['dakwah', 'berdakwah', 'berdakwa', 'dakwa', "da'wah"],
          bahas='Mengajak orang kepada kebaikan dan beriman kepada Allah disebut dakwah.',
          kisi='AI8',
          konteks="Dakwah artinya mengajak orang kepada kebaikan dan kepada Allah. Nabi Nuh a.s. berdakwah kepada kaumnya agar meninggalkan berhala. "
                  "Contoh dalam keseharian: mengajak teman salat berjamaah. Tanyakan nama kegiatan mengajak kepada kebaikan itu."),
    uraian('Adikmu tidak sengaja menumpahkan minuman di bukumu. Apa yang kamu lakukan jika meneladani sifat Allah Al-Halim?',
           contoh='Aku tidak marah kepada adik, memaafkannya, lalu menasihatinya dengan lembut agar lebih hati-hati.',
           kata_kunci=[['tidak marah', 'tidak memarahi', 'menahan marah', 'memaafkan', 'maafkan', 'sabar', 'menasihati', 'nasihati', 'tidak membentak', 'lembut']],
           minimal=1,
           bahas='Al-Halim = Maha Penyantun (tidak cepat marah). Meneladaninya: sabar, tidak marah, dan memaafkan.',
           kisi='AI4',
           konteks="Al-Halim berarti Maha Penyantun: Allah sangat sabar dan tidak cepat marah kepada hamba-Nya. Meneladaninya berarti menahan marah dan memaafkan, apalagi jika orang lain tidak sengaja. "
                   "Tanyakan, 'Adik kan tidak sengaja. Kalau Kakak dimarahi saat tidak sengaja, rasanya bagaimana?' lalu minta anak menulis tindakannya."),
    uraian('Temanmu mengejekmu. Tulislah satu hal yang kamu lakukan jika meneladani Nabi Nuh a.s. saat diejek kaumnya.',
           contoh='Aku tidak marah dan tidak membalas ejekannya, lalu tetap berbuat baik kepadanya.',
           kata_kunci=[['tidak marah', 'menahan marah', 'tidak membalas', 'diam', 'tenang', 'sabar', 'memaafkan', 'maafkan', 'mengabaikan', 'berdoa', 'tetap berbuat baik', 'tetap baik']],
           minimal=1,
           bahas='Bersabar berarti tidak marah, tidak membalas, dan tetap berbuat baik.',
           kisi='AI9',
           konteks="Nabi Nuh a.s. sabar menghadapi ejekan. Anak diminta menuliskan tindakan sabar dengan kata sendiri: tidak marah, tidak membalas, memaafkan, atau berdoa. "
                   "Bantu dengan peran: Ibu berpura-pura mengejek, lalu anak mencoba menjawab dengan tenang."),
]

paket2 += [
    pg('Nama Allah yang berarti Maha Menjaga adalah ....', 'Al-Hafiz', ['Al-Halim', 'Al-Khabir', 'Al-Ghaffar'],
       bahas='Al-Hafiz artinya Maha Menjaga. Al-Halim Maha Penyantun, Al-Khabir Maha Teliti.',
       kisi='AI3',
       konteks="Al-Hafiz artinya Maha Menjaga atau Maha Memelihara. Hubungkan dengan pengalaman: kita bangun pagi dalam keadaan selamat karena dijaga Allah. "
               "Bantu anak membedakan: Halim penyantun, Khabir teliti, Hafiz menjaga."),
    pg('Allah tahu perbuatan kita walaupun tidak ada yang melihat. Hal ini sesuai dengan nama Allah ....', 'Al-Khabir', ['Al-Halim', 'Al-Hafiz', 'Al-Ghaffar'],
       bahas='Al-Khabir artinya Maha Teliti: Allah mengetahui hal yang kecil dan tersembunyi.',
       kisi='AI4',
       konteks="Al-Khabir artinya Maha Teliti; Allah tahu semua perbuatan kita, termasuk yang tersembunyi. Beri contoh: membuang sampah pada tempatnya saat sendirian, Allah tetap tahu. "
               "Tanyakan nama Allah yang berarti 'Maha Teliti' di antara pilihan."),
    pg('Salat Isya dikerjakan pada malam hari sebanyak ... rakaat.', '4', ['2', '3', '5'],
       bahas='Rakaat salat fardu: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4.',
       kisi='AI7',
       konteks="Jumlah rakaat: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4. Salat Isya dikerjakan malam hari dan jumlahnya empat. "
               "Pastikan anak tidak tertukar dengan Magrib (3) dan Subuh (2); tanyakan, 'Salat mana yang tiga rakaat?' sebagai pembanding."),
    pg('Nabi Nuh a.s. mengajak kaumnya menyembah Allah dengan cara ....', 'menasihati dengan sabar siang dan malam',
       ['memaksa dengan kekerasan', 'mengusir mereka dari kampung', 'diam dan menunggu saja'],
       bahas='Nabi Nuh a.s. berdakwah dengan sabar, siang dan malam, secara terang-terangan maupun diam-diam.',
       kisi='AI8',
       konteks="Nabi Nuh a.s. berdakwah dengan sabar dan terus-menerus, siang dan malam, tanpa memaksa. Meski banyak yang menolak, beliau tidak berhenti mengajak kepada Allah. "
               "Tanyakan, 'Kalau mengajak teman berbuat baik, lebih baik dengan lembut atau dengan marah?'"),
    isian('Huruf ل (lam) keluar dari ....', ['lidah', 'ujung lidah', 'tepi lidah', 'kedua tepi lidah'],
          gambar=[{'teks': 'ل'}],
          bahas='Huruf lam keluar dari lidah (ujung lidah menyentuh langit-langit).',
          kisi='AI2',
          konteks="Huruf ل (lam) diucapkan dengan ujung lidah menyentuh langit-langit mulut di belakang gigi depan atas. "
                  "Ajak anak mengucap 'la, la, la' dan merasakan lidahnya bergerak, lalu bandingkan dengan ba yang keluar dari bibir."),
    isian('Temanmu sedang sedih. Kita ... dia dengan kata-kata baik.', ['menghibur', 'hibur', 'menghiburnya', 'menenangkan', 'menenangkannya', 'menghibur dia'],
          gambar=[img('crying-face')],
          bahas='Menghibur teman yang sedih adalah tanda sayang dan empati.',
          kisi='AI5',
          konteks="Empati berarti ikut merasakan perasaan teman. Saat teman sedih, kita menghiburnya dengan kata baik atau menemaninya. "
                  "Tanyakan, 'Kalau Kakak sedih, kata apa yang membuat Kakak tenang?' lalu minta anak memakainya untuk temannya."),
    isian('Salat Asar dikerjakan pada sore hari sebanyak ... rakaat.', ['4', 'empat', '4 rakaat', 'empat rakaat'],
          bahas='Asar 4 rakaat. Rakaat lain: Subuh 2, Zuhur 4, Magrib 3, Isya 4.',
          kisi='AI7',
          konteks="Salat Asar dikerjakan sore hari dan jumlahnya empat rakaat, sama seperti Zuhur dan Isya. "
                  "Ajak anak menghitung kelompok rakaat: dua (Subuh), empat (Zuhur, Asar), tiga (Magrib), empat (Isya)."),
    isian('Orang yang terus berusaha sungguh-sungguh sampai pekerjaannya selesai bersikap ....',
          ['kerja keras', 'bekerja keras', 'pekerja keras', 'tekun', 'rajin', 'gigih', 'tidak menyerah', 'pantang menyerah'],
          bahas='Terus berusaha sampai selesai disebut kerja keras, seperti Nabi Nuh a.s. membuat kapal.',
          kisi='AI9',
          konteks="Kerja keras artinya terus berusaha dengan sungguh-sungguh sampai selesai, seperti Nabi Nuh a.s. yang membuat kapal besar. "
                  "Beri contoh: belajar menulis sampai rapi walaupun lelah. Anak boleh memakai kata serupa seperti tekun atau tidak menyerah."),
    uraian('Pada ayat 1 sampai 3 Surah An-Nas, Allah disebut dengan tiga sifat. Tulislah dua di antaranya.',
           contoh='Tuhan (Rabb) manusia, Raja (Malik) manusia, dan Sembahan (Ilah) manusia.',
           kata_kunci=[['tuhan', 'rabb', 'rob', 'pemelihara'], ['raja', 'malik'], ['sembahan', 'yang disembah', 'ilah', 'disembah']],
           minimal=2,
           gambar=[{'teks': AYAT1}, {'teks': AYAT2}, {'teks': AYAT3}],
           bahas='Rabb = Tuhan, Malik = Raja, Ilah = Sembahan.',
           kisi='AI1',
           konteks="Tiga ayat pertama An-Nas menyebut Allah sebagai Rabb (Tuhan atau Pemelihara), Malik (Raja), dan Ilah (Sembahan) manusia. "
                   "Ajak anak membaca tiga ayat itu sambil menunjuk kata pertama tiap ayat, lalu menyebut artinya. Terima dua jawaban benar saja."),
    uraian('Tulislah satu contoh sikap jujur yang dapat kamu lakukan di sekolah.',
           contoh='Mengakui kesalahan, tidak menyontek saat ulangan, atau mengembalikan barang teman yang kutemukan.',
           kata_kunci=[['mengaku', 'mengakui', 'tidak menyontek', 'tidak mencontek', 'tidak nyontek', 'menyerahkan', 'mengembalikan', 'kembalikan', 'berkata benar', 'berkata jujur', 'tidak berbohong', 'tidak bohong', 'menceritakan sebenarnya']],
           minimal=1,
           bahas='Contoh sikap jujur: mengakui kesalahan, tidak menyontek, mengembalikan barang yang bukan milik kita.',
           kisi='AI6',
           konteks="Jujur di sekolah berarti mengakui kesalahan, tidak menyontek, dan mengembalikan barang yang bukan milik kita. "
                   "Tanyakan contoh nyata: 'Kalau Kakak menemukan pensil teman di lantai, apa yang Kakak lakukan?' Terima jawaban apa pun yang menunjukkan kejujuran."),
]

paket3 += [
    pg('Ayat terakhir Surah An-Nas pada kotak ini dibaca ....', "Minal jinnati wan‑nas", ['Malikin‑nas', 'Ilahin‑nas', "Qul a'udzu birabbin‑nas"],
       gambar=[{'teks': AYAT6}],
       bahas='Ayat terakhir (ayat 6) Surah An-Nas: Minal jinnati wan‑nas, artinya dari golongan jin dan manusia.',
       kisi='AI1',
       konteks="Ayat 6 adalah ayat terakhir Surah An-Nas dan terakhir pula dalam Al-Qur'an: Minal jinnati wan‑nas, artinya 'dari (golongan) jin dan manusia'. "
               "Ajak anak membandingkan awal tiap ayat: ayat 2 diawali Malik, ayat 3 diawali Ilah, ayat 1 diawali Qul, ayat 6 diawali Minal."),
    pg('Kata bersambung pada kotak ini dibaca ....', 'jamal', ['jimal', 'jumal', 'zamal'],
       gambar=[{'teks': 'جَمَل'}],
       bahas='Huruf ج (jim), م (mim), ل (lam) bersambung dibaca dari kanan: ja-ma-l, yaitu jamal (unta).',
       kisi='AI2',
       konteks="Huruf Arab bersambung dibaca dari kanan ke kiri. Kata ini dimulai huruf ج (jim) berharakat fathah sehingga dibaca ja, lalu ma, lalu l: jamal. "
               "Ajak anak menunjuk dari kanan; hati-hati bedakan ج (jim) dengan ز (zai) yang titiknya di atas dan bentuknya berbeda."),
    pg('Ibu tidak marah ketika adik tidak sengaja memecahkan gelas, tetapi menasihatinya dengan sabar. Sikap ini sesuai dengan sifat Allah ....',
       'Al-Halim', ['Al-Khabir', 'Al-Wali', 'Al-Ghaffar'],
       bahas='Al-Halim artinya Maha Penyantun: tidak cepat marah dan sabar.',
       kisi='AI4',
       konteks="Al-Halim artinya Maha Penyantun, yaitu sangat sabar dan tidak cepat marah. Sikap Ibu yang menasihati dengan sabar mencerminkan sifat itu. "
               "Bedakan dengan Al-Khabir (Maha Teliti) dan Al-Wali (Maha Melindungi): tanyakan sifat mana yang menyangkut 'tidak cepat marah'."),
    pg('Salah satu manfaat berperilaku jujur adalah ....', 'dipercaya oleh orang lain', ['ditakuti oleh teman', 'selalu menang saat bermain', 'mendapat banyak mainan'],
       bahas='Orang jujur dipercaya oleh orang lain dan disukai Allah.',
       kisi='AI6',
       konteks="Orang yang jujur dipercaya orang lain dan disukai Allah. Kebohongan membuat orang sulit dipercaya, walaupun hanya sekali. "
               "Ceritakan kisah anak yang pernah berbohong lalu tidak dipercaya, dan tanyakan pilihan jawaban yang benar."),
    isian('Orang tua menjaga anaknya, tetapi yang menjaga seluruh makhluk setiap saat adalah Allah Al-....',
          ['hafiz', 'hafidz', 'hafizh', 'hafidh', 'al hafiz', 'al-hafiz', 'alhafiz'],
          bahas='Al-Hafiz artinya Maha Menjaga.',
          kisi='AI3',
          konteks="Al-Hafiz artinya Maha Menjaga. Orang tua menjaga anak dari bahaya, tetapi penjagaan Allah meliputi seluruh makhluk sepanjang waktu. "
                  "Beri petunjuk huruf awalnya (H) bila anak bingung. Ejaan latin boleh beragam (hafiz, hafidz)."),
    isian('Temanmu tidak punya pensil untuk menulis. Kita dapat ... pensil kita kepada temanmu.',
          ['meminjamkan', 'meminjami', 'memberi', 'memberikan', 'membagi', 'berbagi', 'meminjamkannya', 'pinjamkan', 'pinjami'],
          bahas='Meminjamkan atau berbagi dengan teman yang kesulitan adalah wujud sayang dan empati.',
          kisi='AI5',
          konteks="Empati dan sayang kepada teman diwujudkan dengan berbagi atau meminjamkan barang saat ia membutuhkan. "
                  "Tanyakan, 'Kalau pensil Kakak patah dan teman punya dua, Kakak ingin teman melakukan apa?' lalu minta anak melengkapi kalimat."),
    isian('Salat Subuh dikerjakan sebelum matahari ....', ['terbit', 'terbitnya', 'terbit pagi', 'muncul', 'naik', 'keluar'],
          bahas='Waktu Subuh dimulai dari terbit fajar sampai matahari terbit.',
          kisi='AI7',
          konteks="Waktu salat Subuh dimulai ketika fajar muncul dan berakhir saat matahari terbit. Karena itu Subuh dikerjakan pagi sekali, sebelum matahari terlihat. "
                  "Tanyakan, 'Kapan Kakak biasa mendengar azan Subuh, sebelum atau sesudah matahari naik?'"),
    isian('Nabi Nuh a.s. adalah utusan ... yang mengajak kaumnya hanya menyembah kepada-Nya.', ['allah', 'allah swt', 'allah swt.', 'tuhan', 'allah yang maha esa'],
          bahas='Nabi Nuh a.s. diutus oleh Allah swt. untuk mengajak kaumnya menyembah Allah saja.',
          kisi='AI8',
          konteks="Nabi Nuh a.s. adalah nabi dan rasul, yaitu utusan Allah. Tugas beliau mengajak kaumnya meninggalkan berhala dan menyembah Allah saja. "
                  "Tanyakan, 'Siapa yang mengutus para nabi?' bila anak masih ragu."),
    uraian('Sebutkan tiga salat fardu yang dikerjakan sebanyak 4 rakaat.',
           contoh='Zuhur, Asar, dan Isya.',
           kata_kunci=[['zuhur', 'dzuhur', 'duhur', 'zhuhur', 'zuhr', 'lohor', 'dhuhur', 'dzhuhur'], ['asar', 'ashar', 'asr', 'ashr'], ['isya', "isya'", 'isyak', 'isha']],
           minimal=3,
           bahas='Salat 4 rakaat: Zuhur, Asar, dan Isya. Subuh 2 rakaat, Magrib 3 rakaat.',
           kisi='AI7',
           konteks="Rakaat: Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4. Jadi salat empat rakaat ada tiga: Zuhur, Asar, dan Isya. "
                   "Bantu anak menyingkirkan dua yang bukan empat (Subuh dan Magrib) lalu menyebut sisanya berurutan."),
    uraian('Sebutkan satu sikap Nabi Nuh a.s. yang ingin kamu tiru dan cara kamu melakukannya.',
           contoh='Aku ingin bekerja keras seperti Nabi Nuh a.s., yaitu mengerjakan PR sampai selesai walaupun sulit.',
           kata_kunci=[['sabar', 'bersabar', 'kerja keras', 'bekerja keras', 'tekun', 'rajin', 'tidak menyerah', 'pantang menyerah', 'gigih', 'tabah', 'semangat']],
           minimal=1,
           bahas='Sikap yang dapat ditiru: sabar dan kerja keras.',
           kisi='AI9',
           konteks="Dari kisah Nabi Nuh a.s. kita dapat meneladani sikap sabar dan kerja keras. Anak menuliskan satu sikap beserta contoh penerapannya sendiri. "
                   "Pancing dengan, 'Kapan Kakak harus bersabar atau bekerja keras?' dan terima jawaban yang masuk akal."),
]

# urutan lembar ujian: pg, bs, isian, uraian; di dalam bagian mengikuti urutan indikator kisi-kisi
_JENIS = {'pg': 0, 'bs': 1, 'isian': 2, 'uraian': 3}
for _p in (paket1, paket2, paket3):
    _p.sort(key=lambda q: (_JENIS[q['jenis']], q['kisi']))

PAKET = [paket1, paket2, paket3]
