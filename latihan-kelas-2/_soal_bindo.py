from _alat import *

# ---------- gambar buatan sendiri ----------
# Rambu peringatan Indonesia: belah ketupat, dasar kuning, tanda hitam (PM Perhubungan 13/2014)
RAMBU_AWAS = svg('<path d="M120 6 L184 70 L120 134 L56 70 Z" fill="#F5B82E" stroke="#222" stroke-width="7" stroke-linejoin="round"/>'
                 '<rect x="113" y="34" width="14" height="44" rx="5" fill="#222"/><circle cx="120" cy="96" r="8" fill="#222"/>')
RAMBU_PARKIR = svg('<circle cx="120" cy="70" r="56" fill="#fff" stroke="#D62828" stroke-width="12"/>'
                   '<text x="120" y="96" text-anchor="middle" font-size="76" font-weight="800" fill="#222" font-family="sans-serif">P</text>'
                   '<path d="M80 30 L160 110" stroke="#D62828" stroke-width="12" stroke-linecap="round"/>')
RAMBU_MASUK = svg('<circle cx="120" cy="70" r="58" fill="#D62828"/><rect x="72" y="58" width="96" height="24" rx="4" fill="#fff"/>')

def grafik(judul, data, satuan='anak'):
    """Piktogram: tiap lingkaran = 1 satuan. data = [(nama, jumlah, warna)]."""
    mx = max(n for _, n, _ in data)
    x0 = max(128, 34 + 10 * max(len(nama) for nama, _, _ in data))  # kolom gambar mulai setelah label terpanjang
    w = x0 - 8 + 34 * mx + 12
    h = 40 + 40 * len(data) + 30
    s = f'<text x="{w/2}" y="24" text-anchor="middle" font-size="19" font-weight="800" fill="{INK}" font-family="sans-serif">{judul}</text>'
    for i, (nama, n, warna) in enumerate(data):
        y = 40 + 40 * i + 20
        s += f'<line x1="8" y1="{y+20}" x2="{w-8}" y2="{y+20}" stroke="#ddd" stroke-width="2"/>'
        s += f'<text x="10" y="{y+6}" font-size="17" font-weight="700" fill="{INK}" font-family="sans-serif">{nama}</text>'
        for k in range(n):
            s += circ(x0 + 34 * k, y, 13, warna)
    ly = h - 14
    s += circ(20, ly, 9, '#bbb') + f'<text x="38" y="{ly+5}" font-size="15" fill="{INK}" font-family="sans-serif">= 1 {satuan}</text>'
    return svg(s, w, h)

MERAH, ORANYE, KUNING, BIRU, HIJAU, UNGU_ = '#E0443E', '#E8742A', '#F5B82E', '#5BA7DC', '#5DBB63', '#9B5DE5'

# ================= PAKET 1 =================
paket1 = [
    # --- PG (6) ---
    pg('Lihat wajah ini. Anak ini sedang merasa ....', 'takut', ['senang', 'sedih', 'marah'],
       gambar=[img('fearful-face')], kisi='BI1a',
       bahas='Mata terbuka lebar dan mulut meringis menunjukkan perasaan takut.',
       konteks='Wajah kita bercerita tentang perasaan. Ajak anak berkaca dan menirukan wajah senang (mulut melengkung ke atas), sedih (alis turun), marah (alis mengerut), dan takut (mata melebar, mulut meringis). Minta ia mencocokkan ciri wajah pada gambar dengan wajah yang baru ia tirukan.'),
    pg('Kalimat yang penulisannya benar adalah ....', 'Ayah pergi ke masjid pada hari Jumat.',
       ['adik membaca buku di rumah.', 'Ibu memasak di dapur pada hari senin.', 'Kakak bermain bola di lapangan'],
       kisi='BI2',
       bahas='Huruf pertama kalimat dan nama hari memakai huruf kapital, dan kalimat pernyataan diakhiri titik.',
       konteks='Ada tiga hal yang perlu diperiksa: huruf pertama kalimat, nama hari (Senin, Jumat, dst.), dan titik di akhir kalimat. Minta anak memeriksa pilihan satu per satu seperti polisi kalimat: awalnya besar? nama harinya besar? ada titiknya? Pilihan yang lolos ketiganya adalah jawabannya.'),
    pg('Kelinci selalu membanggakan larinya yang cepat. Ia menantang Kura-kura berlomba. Di tengah jalan Kelinci tertidur karena yakin akan menang. Kura-kura terus berjalan pelan-pelan sampai ke garis akhir dan menang.\nPesan moral cerita ini adalah ....',
       'kita tidak boleh sombong, dan yang tekun akan berhasil',
       ['yang berlari cepat pasti selalu menang', 'tidur siang itu sangat penting', 'lebih baik tidak ikut lomba'],
       kisi='BI3b',
       bahas='Kelinci sombong lalu kalah. Kura-kura tekun dan akhirnya menang.',
       konteks='Pesan moral adalah pelajaran baik dari sebuah cerita. Tanyakan pada anak: siapa yang sombong, siapa yang tidak berhenti berusaha, dan siapa yang akhirnya menang? Dari jawaban itu anak bisa menemukan pelajarannya sendiri. Hubungkan juga dengan kehidupan: belajar sedikit-sedikit tiap hari lebih baik daripada menyepelekan.'),
    pg('Rambu belah ketupat berwarna kuning ini artinya ....', 'hati-hati, ada bahaya di depan',
       ['dilarang masuk ke jalan ini', 'boleh parkir di tempat ini', 'tempat bermain anak-anak'],
       gambar=[RAMBU_AWAS], kisi='BI5b',
       bahas='Rambu peringatan berbentuk belah ketupat dan berwarna kuning. Artinya kita harus berhati-hati.',
       konteks='Rambu peringatan memberi tahu kita untuk berhati-hati, bentuknya belah ketupat berwarna kuning dengan gambar hitam. Rambu larangan berbentuk lingkaran merah dan melarang kita melakukan sesuatu. Ajak anak mengamati rambu saat berjalan bersama, lalu tanyakan: ini memberi peringatan atau melarang?'),
    pg('Yang termasuk keluarga inti adalah ....', 'ayah, ibu, dan anak',
       ['kakek, nenek, dan paman', 'ayah, bibi, dan sepupu', 'ibu, om, dan tante'],
       kisi='BI6a',
       bahas='Keluarga inti terdiri dari ayah, ibu, dan anak-anak.',
       konteks='Keluarga inti adalah keluarga kecil yang tinggal serumah: ayah, ibu, dan anak-anak. Ajak anak menyebut nama semua anggota keluarga inti mereka sambil menunjuk foto keluarga. Kakek, nenek, paman, dan bibi termasuk keluarga besar, bukan keluarga inti.'),
    pg('Kalimat yang merupakan fakta adalah ....', 'Matahari terbit dari arah timur.',
       ['Mangga adalah buah paling enak.', 'Kucing lebih lucu daripada kelinci.', 'Hari Senin itu membosankan.'],
       kisi='BI8',
       bahas='Fakta bisa dibuktikan benar. Yang lain hanya pendapat atau perasaan seseorang (opini).',
       konteks='Fakta adalah hal yang bisa dibuktikan benar oleh siapa pun. Opini adalah pendapat atau perasaan seseorang, dan orang lain boleh berbeda. Tanyakan pada anak: bisakah kita membuktikannya? Kata seperti paling enak, lucu, dan membosankan biasanya tanda opini.'),
    # --- isian (6) ---
    isian('Dina menangis karena mainannya rusak. Dina merasa ....', ['sedih', 'bersedih', 'sedih sekali'],
          gambar=[img('crying-face')], kisi='BI1a',
          bahas='Menangis karena mainan rusak berarti sedih.',
          konteks='Perasaan bisa dikenali dari wajah dan dari kejadian yang dialami. Tanyakan pada anak: kalau mainanmu rusak, bagaimana rasanya? Dari situ ia akan menemukan kata sedih. Lanjutkan dengan pertanyaan: kapan kamu merasa senang, marah, atau takut?'),
    isian('Kalimat yang dipakai untuk bertanya disebut kalimat ....', ['tanya', 'kalimat tanya', 'pertanyaan'],
          kisi='BI4a',
          konteks='Kalimat tanya dipakai untuk meminta jawaban, contohnya "Siapa namamu?" atau "Kamu tinggal di mana?". Ajak anak bermain tanya jawab, lalu tanyakan: kalimat yang tadi kamu pakai untuk bertanya namanya apa?'),
    isian('Ibu menyapu lantai. Objek dalam kalimat itu adalah ....', ['lantai'],
          kisi='BI4b',
          bahas='Subjek: Ibu. Predikat: menyapu. Objek: lantai.',
          konteks='Subjek adalah pelaku (siapa), predikat adalah perbuatannya (melakukan apa), dan objek adalah yang dikenai perbuatan itu (apa). Tanyakan: siapa yang menyapu? Ibu. Apa yang disapu? Nah, jawaban pertanyaan terakhir itulah objeknya.'),
    isian('Berapa anak yang suka jeruk?', ['5', 'lima'],
          gambar=[grafik('Buah Kesukaan', [('Apel', 4, MERAH), ('Jeruk', 5, ORANYE), ('Pisang', 3, KUNING)])],
          kisi='BI4c',
          bahas='Ada 5 lingkaran pada baris jeruk, jadi ada 5 anak yang suka jeruk.',
          konteks='Dalam grafik gambar, setiap lingkaran mewakili satu anak. Bantu anak menemukan baris yang ditanyakan (jeruk), lalu hitung lingkarannya satu per satu sambil menunjuk. Jumlah lingkaran adalah jumlah anak.'),
    isian('Sebelum menyeberang jalan, kita menengok ke kiri dan ke ....', ['kanan'],
          kisi='BI5a',
          bahas='Kita melihat kiri dan kanan agar tahu tidak ada kendaraan yang lewat.',
          konteks='Menyeberang harus aman: berhenti di tepi jalan, lihat kiri dan kanan, lalu menyeberang sambil berjalan di zebra cross, ditemani orang dewasa. Ajak anak memeragakan caranya di depan rumah dan tanyakan arah yang dilihat setelah kiri.'),
    isian('Kalimat "Ayah menyiram bunga." adalah kalimat ....', ['aktif', 'kalimat aktif'],
          kisi='BI7',
          bahas='Subjek (Ayah) melakukan pekerjaan menyiram, jadi kalimatnya aktif.',
          konteks='Pada kalimat aktif, subjek yang melakukan pekerjaan (Ayah menyiram bunga). Pada kalimat pasif, subjek dikenai pekerjaan (Bunga disiram Ayah). Tanyakan: siapa yang bekerja dalam kalimat ini, dan apakah ia yang melakukan atau yang dikenai pekerjaan?'),
    # --- uraian (3) ---
    uraian('Temanmu menangis karena mainannya rusak. Apa yang akan kamu lakukan? Mengapa?',
           'Aku akan menghiburnya dan menemaninya, karena ia sedang sedih dan aku ingin menjadi teman yang baik.',
           [['hibur', 'menghibur', 'menenangkan', 'tenang', 'peluk', 'menemani', 'temani', 'bantu', 'menolong', 'perbaiki'],
            ['sedih', 'kasihan', 'sayang', 'peduli', 'menghargai', 'senang', 'teman yang baik', 'lebih baik']], minimal=2, kisi='BI1b',
           konteks='Menghargai perasaan berarti peduli ketika teman sedih, tidak mengejek, dan membantu semampu kita. Tanyakan pada anak: kalau kamu yang sedih, ingin diperlakukan bagaimana? Islam mengajarkan kita menyayangi sesama. Minta anak menyebut satu tindakan dan alasannya.'),
    uraian('Mengapa kita harus mandi dan menggosok gigi setiap hari? Jelaskan alasannya sesuai ajaran Islam.',
           'Karena kebersihan sebagian dari iman. Badan yang bersih membuat kita sehat, dan Allah swt. menyukai orang yang bersih.',
           [['bersih', 'kebersihan', 'sehat', 'kuman', 'penyakit', 'suci', 'wangi'],
            ['allah', 'islam', 'iman', 'syukur', 'rasulullah', 'nabi', 'ibadah', 'salat', 'sholat']], minimal=2, kisi='BI3a',
           konteks='Dalam Islam, menjaga kebersihan adalah bagian dari iman dan cara bersyukur atas tubuh yang Allah swt. berikan. Ajak anak berpikir: apa yang terjadi bila jarang mandi atau sikat gigi? Lalu hubungkan dengan salat dan ibadah yang menuntut kita bersih. Jawaban lengkap memuat alasan kesehatan dan alasan agama.'),
    uraian('Kamu antre di perosotan, tetapi ada teman yang menyerobot. Tulis kalimat perintah yang sopan untuk menegurnya. Lalu jelaskan mengapa kita harus tertib.',
           'Tolong antre di belakang ya. Kita harus tertib supaya semua mendapat giliran dengan adil dan tidak berdesakan.',
           [['tolong', 'mohon', 'silakan', 'maaf', 'yuk', 'ayo', 'harap'],
            ['antre', 'antri', 'belakang', 'giliran', 'berbaris'],
            ['tertib', 'adil', 'aman', 'rapi', 'nyaman', 'tidak berebut', 'berdesakan', 'tidak terjatuh']], minimal=2, kisi='BI5c',
           konteks='Kalimat perintah yang sopan memakai kata tolong, silakan, atau mohon, dan nadanya lembut. Tertib di tempat umum membuat semua orang mendapat giliran dan aman. Mainkan peran: anak mencoba menegur teman dengan kata tolong, lalu tanyakan apa yang terjadi bila semua orang berebut.'),
]

# ================= PAKET 2 =================
paket2 = [
    pg('Temanmu kalah dalam lomba lari dan merasa sedih. Sikap yang baik adalah ....',
       'menghiburnya dan mengajaknya mencoba lagi', ['menertawakannya di depan teman lain', 'membiarkannya sendirian tanpa menyapa', 'mengatakan bahwa ia lambat sekali'],
       kisi='BI1b', bahas='Kita menghargai perasaan teman dengan menghibur, bukan mengejek.',
       konteks='Menghargai perasaan teman berarti menghibur, bukan mengejek. Tanyakan pada anak: kalau kamu kalah lalu ditertawakan, rasanya bagaimana? Pilihan yang membuat teman merasa lebih baik adalah jawabannya.'),
    pg('Kalimat yang memakai huruf kapital dan tanda titik dengan benar adalah ....', 'Kami berenang pada hari Sabtu.',
       ['ibu pergi ke pasar pada hari Rabu.', 'Nenek datang ke rumah pada hari minggu.', 'Ayah membaca koran di teras?'],
       kisi='BI2', bahas='Kalimat dimulai huruf kapital, nama hari memakai huruf kapital, dan kalimat pernyataan berakhir titik.',
       konteks='Periksa tiga hal: huruf pertama kalimat, nama hari, dan tanda baca penutup. Kalimat pernyataan, yang hanya menyampaikan kabar, diakhiri titik, sedangkan tanda tanya dipakai untuk bertanya. Ajak anak mencoret pilihan yang salah satu cirinya tidak terpenuhi.'),
    pg('Kelinci menertawakan Kura-kura yang berjalan lambat. Kura-kura tidak marah. Ia berkata, "Ayo kita berlomba." Kelinci berlari jauh, lalu beristirahat dan tertidur. Kura-kura terus berjalan tanpa berhenti dan sampai lebih dulu.\nDari cerita ini kita belajar bahwa ....',
       'yang sabar dan terus berusaha bisa berhasil',
       ['hewan yang lambat tidak boleh ikut lomba', 'kita boleh menertawakan teman yang lambat', 'tidur sebelum lomba membuat kita menang'],
       kisi='BI3b', bahas='Kura-kura sabar dan tidak menyerah, jadi ia berhasil.',
       konteks='Pesan moral adalah pelajaran dari cerita. Ceritakan ulang bersama anak, lalu tanyakan sikap Kura-kura saat ditertawakan dan sikapnya selama lomba. Pelajaran yang cocok dengan sikap itu adalah jawabannya. Dua pilihan lain berisi sikap yang justru tidak baik.'),
    pg('Mengapa kita harus mencuci tangan dengan sabun sebelum makan?', 'agar kuman hilang dan kita tidak sakit',
       ['agar tangan menjadi berwarna putih', 'agar makanan cepat habis', 'agar sabun cepat habis'],
       gambar=[img('soap')], kisi='BI3a',
       bahas='Sabun membersihkan kuman. Rasulullah saw. mengajarkan kita menjaga kebersihan.',
       konteks='Kuman tidak terlihat tetapi bisa membuat perut sakit. Ajak anak mencuci tangan dengan sabun sambil membaca basmalah, lalu jelaskan bahwa Islam mengajarkan hidup bersih agar sehat dan siap beribadah. Tanyakan apa gunanya sabun bagi tangan.'),
    pg('Budi tinggal bersama ayah, ibu, dan adik. Mereka disebut keluarga ....', 'inti', ['besar', 'jauh', 'kampung'],
       kisi='BI6a', bahas='Ayah, ibu, dan anak yang tinggal serumah disebut keluarga inti.',
       konteks='Keluarga inti adalah ayah, ibu, dan anak-anak. Jika ada kakek, nenek, paman, atau bibi, itu sudah keluarga besar. Minta anak menghitung siapa saja yang tinggal serumah dengannya untuk melatih mengenali keluarga inti.'),
    pg('Kalimat pasif di bawah ini adalah ....', 'Kue itu dimakan adik.',
       ['Adik memakan kue itu.', 'Adik duduk sambil makan kue.', 'Ibu membuat kue itu.'],
       kisi='BI7', bahas='Pada kalimat pasif, subjek (kue) dikenai pekerjaan (dimakan).',
       konteks='Kalimat pasif biasanya memakai awalan di- (dimakan, disiram, dibaca), dan yang dibicarakan menerima pekerjaan. Tanyakan: dalam kalimat ini, kue yang makan atau dimakan? Anak bisa mengubah kalimat aktif menjadi pasif dengan menukar posisi pelaku.'),
    # isian
    isian('Kalimat tanya diakhiri dengan tanda ....', ['tanya', 'tanda tanya', '?'],
          kisi='BI4a', bahas='Kalimat tanya diakhiri tanda tanya (?).',
          konteks='Kalimat tanya meminta jawaban dan diakhiri tanda tanya. Tunjukkan beberapa kalimat dalam buku cerita anak, lalu ajak anak menemukan tanda di akhir kalimat yang bertanya.'),
    isian('Adik menendang bola. Predikat kalimat itu adalah ....', ['menendang'],
          kisi='BI4b', bahas='Subjek: Adik. Predikat: menendang. Objek: bola.',
          konteks='Predikat adalah perbuatan yang dilakukan subjek. Tanyakan: adik sedang melakukan apa? Kata yang menjawab pertanyaan itu adalah predikat. Anak bisa memeragakan perbuatannya agar mudah diingat.'),
    isian('Hewan apa yang paling banyak dipelihara anak-anak?', ['kucing'],
          gambar=[grafik('Hewan Peliharaan', [('Kucing', 6, ORANYE), ('Ikan', 3, BIRU), ('Burung', 4, HIJAU)])],
          kisi='BI4c', bahas='Baris kucing paling panjang, yaitu 6 lingkaran.',
          konteks='Pada grafik gambar, baris yang paling panjang berarti paling banyak. Minta anak membandingkan panjang tiga baris dengan jarinya, lalu menyebut nama hewan pada baris yang terpanjang.'),
    isian('Ayu mendapat hadiah boneka dari nenek. Wajah Ayu seperti ini. Ayu merasa ....', ['senang', 'gembira', 'bahagia', 'riang', 'senang sekali'],
          gambar=[img('smiling-face-with-smiling-eyes')], kisi='BI1a', bahas='Mata dan mulut tersenyum karena mendapat hadiah, itu perasaan senang.',
          konteks='Perasaan bisa dikenali dari wajah dan dari kejadian yang dialami. Mendapat hadiah biasanya membuat kita tersenyum dan merasa gembira. Ajak anak menirukan wajah Ayu, lalu tanyakan: kapan kamu pernah merasa seperti itu? Dari situ ia akan menemukan kata perasaannya.'),
    isian('Rambu ini artinya dilarang ....', ['parkir', 'berhenti parkir', 'parkir di sini'],
          gambar=[RAMBU_PARKIR], kisi='BI5b', bahas='Huruf P berarti parkir, garis merah berarti dilarang.',
          konteks='Rambu bulat dengan lingkaran merah dan garis miring berarti larangan. Gambar di tengahnya menjelaskan apa yang dilarang. Tanyakan: huruf P mewakili apa pada kendaraan yang berhenti lama?'),
    isian('Ketika lampu lalu lintas berwarna merah, kendaraan harus ....', ['berhenti', 'behenti', 'diam', 'berhenti dulu'],
          kisi='BI5a', bahas='Lampu merah berarti kendaraan berhenti, sehingga pejalan kaki bisa menyeberang dengan aman.',
          konteks='Di jalan, lampu merah berarti berhenti, kuning berarti hati-hati, dan hijau berarti jalan. Pejalan kaki baru menyeberang saat kendaraan berhenti, dan sebaiknya digandeng orang dewasa. Ajak anak memeragakan lampu lalu lintas dengan tiga kertas warna, lalu tanyakan apa yang dilakukan kendaraan saat kertas merah diangkat.'),
    # uraian
    uraian('Di perpustakaan, temanmu berbicara dengan suara keras. Tulis kalimat perintah yang sopan untuk menegurnya. Lalu jelaskan mengapa kita harus tertib.',
           'Tolong bicara pelan-pelan ya. Kita harus tertib supaya tidak mengganggu teman lain yang sedang membaca.',
           [['tolong', 'mohon', 'silakan', 'maaf', 'harap', 'yuk', 'ayo'],
            ['pelan', 'tenang', 'tidak berisik', 'jangan berisik', 'diam', 'kecilkan'],
            ['mengganggu', 'terganggu', 'orang lain', 'nyaman', 'tertib', 'menghargai', 'membaca']], minimal=2, kisi='BI5c',
           konteks='Kalimat perintah yang sopan memakai tolong atau mohon, dan tidak berteriak. Ajak anak membayangkan perpustakaan yang berisik: apakah teman bisa membaca dengan nyaman? Tertib berarti menghargai orang lain di tempat umum.'),
    uraian('Sebutkan satu cara menghormati kakek dan nenek, dan satu cara menjaga silaturahmi dengan keluarga yang tinggal jauh.',
           'Aku mencium tangan kakek dan nenek serta berbicara sopan. Aku menjaga silaturahmi dengan menelepon keluarga yang jauh atau mengunjungi mereka saat libur.',
           [['salam', 'salim', 'cium tangan', 'sopan', 'hormat', 'bantu', 'menurut', 'santun', 'mendengarkan', 'menyayangi', 'menolong', 'mendoakan'],
            ['telepon', 'telpon', 'menelepon', 'video', 'kunjung', 'berkunjung', 'mengunjungi', 'silaturahmi', 'surat', 'pesan', 'mudik', 'bertemu', 'lebaran', 'idulfitri']],
           minimal=2, kisi='BI6b',
           konteks='Keluarga besar meliputi kakek, nenek, paman, bibi, dan sepupu. Menghormati orang tua berarti berbicara santun, salim, dan membantu mereka. Silaturahmi berarti menjaga hubungan, misalnya bertemu, menelepon, atau mengunjungi, dan Islam mengajarkannya. Minta anak menyebut satu contoh dari kebiasaan keluarga sendiri.'),
    uraian('Rina berkata, "Kucing adalah hewan paling lucu." Doni berkata, "Kelinci lebih lucu." Kalimat mereka fakta atau opini? Bagaimana sikap kita pada pendapat yang berbeda?',
           'Kalimat mereka opini karena itu pendapat. Kita harus menghargai pendapat yang berbeda dan tidak boleh memaksa atau marah.',
           [['opini', 'pendapat'],
            ['hargai', 'menghargai', 'menghormati', 'boleh beda', 'boleh berbeda', 'tidak marah', 'menerima', 'tidak memaksa', 'sopan', 'tidak apa']],
           minimal=2, kisi='BI8',
           konteks='Opini adalah pendapat dan boleh berbeda, sedangkan fakta bisa dibuktikan. Ajak anak melihat bahwa lucu itu soal selera. Lalu bahas sikap yang baik: mendengarkan, tidak mengejek, dan tidak memaksa teman setuju dengan kita.'),
]

# ================= PAKET 3 =================
paket3 = [
    pg('Tiba-tiba ada kejutan ulang tahun untuk Dina. Wajah Dina seperti ini. Dina merasa ....', 'terkejut', ['sedih', 'marah', 'bosan'],
       gambar=[img('astonished-face')], kisi='BI1a', bahas='Mata dan mulut terbuka lebar karena kaget, itu terkejut.',
       konteks='Terkejut muncul saat ada hal yang tidak disangka, dan wajahnya bermata lebar serta mulut terbuka. Ajak anak mengingat kapan ia pernah kaget, misalnya karena suara keras atau kejutan, lalu menirukan wajahnya.'),
    pg('Kalimat yang benar adalah ....', 'Setiap hari Kamis, kami berolahraga.',
       ['dina menyiram bunga di taman.', 'Kami belajar mengaji pada hari selasa.', 'Adik bermain layang-layang di lapangan'],
       kisi='BI2', bahas='Awal kalimat dan nama hari berhuruf kapital, kalimat berakhir titik.',
       konteks='Bantu anak memeriksa tiga hal: huruf awal kalimat, nama hari, dan titik di akhir. Setiap pilihan yang salah melanggar tepat satu aturan, jadi periksa satu per satu sambil mencoret pilihan yang salah.'),
    pg('Kelinci dan Kura-kura berlomba menuju pohon besar. Kelinci berlari cepat, lalu bersantai karena meremehkan Kura-kura. Kura-kura berjalan terus tanpa berhenti dan tiba lebih dulu.\nSikap Kelinci yang tidak boleh kita tiru adalah ....',
       'meremehkan dan menyepelekan teman', ['berlari sambil bergembira', 'mengajak teman berlomba', 'datang ke tempat lomba'],
       kisi='BI3b', bahas='Kelinci kalah karena sombong dan meremehkan Kura-kura.',
       konteks='Pesan moral juga bisa ditemukan dari sikap tokoh yang salah. Tanyakan: mengapa Kelinci kalah padahal larinya cepat? Anak akan melihat bahwa sombong dan meremehkan orang lain membuat kita gagal. Pilihan lain hanyalah kegiatan biasa.'),
    pg('Saat berjalan di tepi jalan raya, tindakan yang aman adalah ....', 'berjalan di trotoar',
       ['berlari di tengah jalan', 'bermain bola di jalan', 'menyeberang sambil bermain ponsel'],
       gambar=[img('person-walking')], kisi='BI5a', bahas='Trotoar dibuat untuk pejalan kaki agar jauh dari kendaraan.',
       konteks='Jalan raya adalah jalur kendaraan, jadi pejalan kaki memakai trotoar. Jika tidak ada, berjalan di tepi sambil menghadap arah datangnya kendaraan dan bergandengan dengan orang dewasa. Tanyakan: mana tempat yang jauh dari kendaraan?'),
    pg('Sinta tinggal bersama ayah, ibu, kakek, nenek, dan bibi. Yang termasuk keluarga inti Sinta adalah ....', 'ayah dan ibu',
       ['kakek dan nenek', 'nenek dan bibi', 'kakek dan bibi'],
       kisi='BI6a', bahas='Keluarga inti: ayah, ibu, dan anak. Kakek, nenek, dan bibi adalah keluarga besar.',
       konteks='Keluarga inti hanya ayah, ibu, dan anak-anak. Meski serumah, kakek, nenek, dan bibi termasuk keluarga besar. Minta anak menunjuk siapa orang tuanya, lalu orang yang bukan orang tuanya.'),
    pg('Yang termasuk kalimat opini adalah ....', 'Hujan adalah cuaca yang paling menyenangkan.',
       ['Air hujan jatuh dari awan.', 'Hari Jumat datang setelah hari Kamis.', 'Kucing mempunyai empat kaki.'],
       kisi='BI8', bahas='Menyenangkan adalah perasaan seseorang, jadi itu opini. Yang lain adalah fakta.',
       konteks='Opini berisi perasaan atau penilaian (menyenangkan, paling enak, cantik), sedangkan fakta bisa dibuktikan. Tanyakan pada anak: apakah semua orang pasti setuju? Jika tidak, itu opini.'),
    # isian
    isian('Kalimat "Di mana kamu tinggal?" termasuk kalimat ....', ['tanya', 'kalimat tanya', 'pertanyaan'],
          kisi='BI4a', bahas='Kalimat itu bertanya dan berakhir tanda tanya, jadi kalimat tanya.',
          konteks='Kalimat tanya meminta jawaban dan biasanya diawali kata tanya (apa, siapa, di mana, kapan). Minta anak menjawab kalimat itu dengan alamat rumahnya agar paham bahwa kalimat ini sedang bertanya.'),
    isian('Kakak membaca buku. Subjek kalimat itu adalah ....', ['kakak'],
          kisi='BI4b', bahas='Subjek: Kakak. Predikat: membaca. Objek: buku.',
          konteks='Subjek adalah pelaku, yaitu yang melakukan pekerjaan. Tanyakan: siapa yang membaca? Jawaban pertanyaan itu adalah subjek, biasanya berada di awal kalimat.'),
    isian('Anak yang suka membaca lebih banyak berapa anak daripada yang suka menggambar?', ['3', 'tiga'],
          gambar=[grafik('Kegiatan Kesukaan', [('Menggambar', 4, MERAH), ('Membaca', 7, HIJAU), ('Menyanyi', 5, UNGU_)])],
          kisi='BI4c', bahas='Membaca 7 anak, menggambar 4 anak. 7 - 4 = 3.',
          konteks='Mintalah anak menghitung lingkaran pada baris membaca (7) dan menggambar (4). Lalu cari selisihnya dengan menghitung lingkaran yang lebih panjang atau mengurangkan 7 dikurangi 4.'),
    isian('Saudara perempuan ibu kita panggil ....', ['bibi', 'tante', 'tanta', 'bi', 'bulik', 'bude', 'budhe', 'uwak', 'wak'],
          kisi='BI6b', bahas='Saudara perempuan ibu atau ayah dipanggil bibi atau tante.',
          konteks='Keluarga besar meliputi kakek, nenek, paman, bibi, dan sepupu. Gambar pohon keluarga sederhana bersama anak lalu tanyakan: adik atau kakak perempuan ibumu dipanggil apa?'),
    isian('Rambu bulat merah ini artinya kita dilarang ....', ['masuk', 'memasuki', 'masuk ke sini'],
          gambar=[RAMBU_MASUK], kisi='BI5b', bahas='Lingkaran merah dengan garis putih berarti dilarang masuk.',
          konteks='Rambu berbentuk lingkaran merah adalah rambu larangan. Garis putih mendatar menggambarkan pintu yang tertutup. Ajak anak berimajinasi: jika ada rambu ini di jalan, kendaraan boleh lewat atau tidak?'),
    isian('Kalimat "Bunga disiram Ayah." adalah kalimat ....', ['pasif', 'kalimat pasif'],
          kisi='BI7', bahas='Bunga dikenai pekerjaan (disiram), jadi kalimatnya pasif.',
          konteks='Kalimat pasif biasanya memakai awalan di-, dan yang dibicarakan menerima pekerjaan. Tanyakan: bunga itu menyiram atau disiram? Bandingkan dengan Ayah menyiram bunga untuk melihat bedanya.'),
    # uraian
    uraian('Temanmu mengejek gambarmu dan kamu menjadi marah. Apa yang kamu lakukan agar tidak membalas mengejek?',
           'Aku menarik napas dan beristigfar agar sabar. Lalu aku mengatakan dengan baik bahwa aku tidak suka diejek.',
           [['tarik napas', 'napas', 'diam', 'sabar', 'menahan', 'tenang', 'istigfar', 'istighfar', 'beristigfar', 'wudu', 'wudhu'],
            ['bicara', 'bilang', 'katakan', 'lapor', 'guru', 'ibu', 'maaf', 'memaafkan', 'tidak membalas']], minimal=1, kisi='BI1b',
           konteks='Marah boleh dirasakan, tetapi tidak boleh dipakai untuk menyakiti. Ajarkan menahan amarah dengan menarik napas, menghitung sampai sepuluh, dan beristigfar, lalu menyampaikan perasaan dengan baik. Tanyakan: apa yang kamu lakukan sebelum membalas?'),
    uraian('Sebutkan satu cara menjaga kebersihan diri dan alasan kita harus melakukannya menurut Islam.',
           'Aku mencuci tangan dengan sabun karena Islam mengajarkan kebersihan, supaya kita sehat dan siap beribadah.',
           [['mandi', 'sikat gigi', 'gosok gigi', 'menggosok gigi', 'cuci tangan', 'mencuci tangan', 'keramas', 'potong kuku', 'memotong kuku', 'ganti baju', 'wudu', 'wudhu', 'sabun', 'cuci kaki'],
            ['sehat', 'kuman', 'penyakit', 'bersih', 'iman', 'allah', 'suka', 'suci', 'syukur', 'ibadah']], minimal=2, kisi='BI3a',
           konteks='Cara menjaga kebersihan diri misalnya mandi, sikat gigi, cuci tangan, dan memotong kuku. Dalam Islam, kebersihan bagian dari iman dan membuat ibadah nyaman. Minta anak menyebut satu kebiasaannya, lalu tanyakan mengapa itu penting.'),
    uraian('Kamu melihat temanmu berlari-lari di dalam masjid saat orang sedang salat. Tulis kalimat perintah yang sopan untuk menegurnya. Lalu jelaskan mengapa kita harus tertib di tempat umum.',
           'Tolong jangan berlari ya, berjalanlah pelan-pelan. Kita harus tertib supaya tidak mengganggu orang yang sedang salat dan tidak ada yang terjatuh.',
           [['tolong', 'mohon', 'silakan', 'maaf', 'harap', 'yuk', 'ayo'],
            ['jangan berlari', 'tidak berlari', 'jalan', 'berjalan', 'pelan', 'tenang', 'diam', 'jangan berisik'],
            ['mengganggu', 'terganggu', 'orang lain', 'nyaman', 'tertib', 'menghargai', 'khusyuk', 'jatuh', 'aman']], minimal=2, kisi='BI5c',
           konteks='Kalimat perintah yang sopan memakai kata tolong, silakan, atau mohon, dan nadanya lembut, tidak membentak. Tertib di tempat umum seperti masjid membuat semua orang nyaman dan aman. Mainkan peran: anak menegur teman dengan kata tolong, lalu tanyakan apa yang dirasakan orang yang sedang salat bila ada yang berlari dan berisik.'),
]

PAKET = [paket1, paket2, paket3]
