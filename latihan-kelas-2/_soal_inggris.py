from _alat import *

# ---------- gambar posisi benda (svg + gambar Fluent) ----------
BG = '<rect width="260" height="150" fill="#F4F9FC"/><rect y="112" width="260" height="38" fill="#EAD9B5"/>'
KAYU, KAYU2, KARDUS, KARDUS2 = '#C98B4B', '#A86E33', '#D9A55B', '#B98240'

def im(nama, x, y, s):
    return f"<image href='aset/{nama}.svg' x='{x}' y='{y}' width='{s}' height='{s}'/>"

def meja():
    return (f'<rect x="63" y="88" width="9" height="38" fill="{KAYU2}" stroke="{INK}" stroke-width="2"/>'
            f'<rect x="188" y="88" width="9" height="38" fill="{KAYU2}" stroke="{INK}" stroke-width="2"/>'
            f'<rect x="55" y="78" width="150" height="10" rx="3" fill="{KAYU}" stroke="{INK}" stroke-width="3"/>')

def kotak(x, y, w, h):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{KARDUS}" stroke="{INK}" stroke-width="3"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="8" fill="{KARDUS2}" stroke="{INK}" stroke-width="3"/>'
            f'<rect x="{x + w / 2 - 5}" y="{y + 8}" width="10" height="20" fill="#EBC98F"/>')

def kotak_buka(x, y, w, h, isi):
    """Kardus terbuka (tutup terbuka ke samping, rongga dalam tampak): isi digambar di antara rongga dan dinding depan,
    sehingga jelas berada DI DALAM kotak, bukan di atasnya."""
    rongga = f'<polygon points="{x+10},{y-14} {x+w-10},{y-14} {x+w},{y} {x},{y}" fill="#7A4E22" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
    tutup = (f'<polygon points="{x},{y} {x+10},{y-14} {x-8},{y-34} {x-20},{y-16}" fill="{KARDUS2}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
             f'<polygon points="{x+w},{y} {x+w-10},{y-14} {x+w+8},{y-34} {x+w+20},{y-16}" fill="{KARDUS2}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    depan = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{KARDUS}" stroke="{INK}" stroke-width="3"/>'
    return tutup + rongga + isi + depan

def baris(n, s, pusat=130, jarak=None):
    jarak = jarak or s + 4
    x0 = pusat - (n * jarak - (jarak - s)) / 2
    return [x0 + i * jarak for i in range(n)]

def adegan(prep, item, n=1, ref='kotak'):
    """prep: on, under, in, next, front, behind. ref: kotak (kardus) atau kursi (gambar chair)."""
    s = 40 if n > 1 else 44
    o = BG
    if prep == 'on':
        o += meja() + ''.join(im(item, x, 78 - s, s) for x in baris(n, s))
    elif prep == 'under':
        o += meja() + im(item, 110, 86, 40)
    elif prep == 'in':
        if n == 1:
            o += kotak_buka(80, 78, 100, 48, im(item, 108, 40, 44))
        else:
            o += kotak_buka(60, 78, 140, 48, ''.join(im(item, x, 50, 34) for x in baris(n, 34, 130, 32)))
    else:
        def R(x):  # benda acuan
            return kotak(x, 52, 80, 70) if ref == 'kotak' else im('chair', x - 4, 36, 88)
        if prep == 'next':
            o += R(45) + im(item, 138, 72, 50)
        elif prep == 'front':
            o += R(85) + ''.join(im(item, x, 98 if n > 1 else 94, s) for x in baris(n, s, 125))
        elif prep == 'behind':
            o += im(item, 112, 24, 50) + R(85)  # separuh bola menyembul dari balik kotak
    return svg(o, 260, 150)

KOTAK_PENSIL = svg(
    '<rect width="260" height="150" fill="#F4F9FC"/>'
    f'<rect x="40" y="52" width="180" height="60" rx="22" fill="#4BA3E3" stroke="{INK}" stroke-width="4"/>'
    f'<path d="M62 62 H198" stroke="#fff" stroke-width="4" stroke-dasharray="5 5" fill="none"/>'
    f'<rect x="188" y="56" width="16" height="12" rx="4" fill="#F5B82E" stroke="{INK}" stroke-width="3"/>'
    f'<rect x="92" y="84" width="76" height="16" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>'
    f'<text x="130" y="97" text-anchor="middle" font-size="12" font-weight="800" fill="{INK}" font-family="sans-serif">PENCIL</text>', 260, 150)

# ================= PAKET 1 =================
paket1 = [
    # ---- PG ----
    pg('Buah ini dalam bahasa Inggris disebut ....', 'pineapple', ['apple', 'mango', 'orange'],
       gambar=[img('pineapple')], kisi='EN1a',
       konteks='Pineapple artinya nanas. Anak sering tertukar dengan apple (apel) karena ada kata apple di dalamnya. Tunjukkan nanas asli atau gambarnya, ucapkan “pineapple” bersama, lalu bandingkan dengan apel yang bulat dan halus.'),
    pg('Ayu bertanya, “Do you like mango?” Kamu suka mangga. Jawabanmu ....', 'Yes, I do.', ['Yes, I am.', 'No, I do.', 'Yes, I does.'],
       gambar=[img('mango', label='mango')], kisi='EN1b',
       bahas='Do you like ...? dijawab Yes, I do. (suka) atau No, I don’t. (tidak suka).',
       konteks='“Do you like ...?” artinya “Apakah kamu suka ...?”. Jawaban suka selalu memakai kata do: “Yes, I do.” Latih seperti permainan tanya jawab di rumah: tanya “Do you like apples?” lalu minta anak menjawab sesuai kesukaannya yang asli.'),
    pg('Ayahmu suka pisang. Kalimat yang tepat adalah ....', 'My father likes bananas.', ['My father like bananas.', 'My mother likes bananas.', 'My sister likes bananas.'],
       gambar=[img('man', label='ayah'), img('banana', label='pisang')], kisi='EN2b',
       bahas='Untuk satu orang (father, mother, ...) kata like ditambah s: likes.',
       konteks='Pola “My ... likes ...” dipakai untuk bercerita tentang kesukaan keluarga. Karena yang disukai oleh satu orang (dia), kata like menjadi likes. Pertama cari siapa orangnya (father = ayah), lalu cek kata kerjanya ada s atau tidak.'),
    pg('Di mana pensilku? Perhatikan gambar.\n“Where is my pencil?”', 'It is on the table.', ['It is under the table.', 'It is in the table.', 'It is in the bag.'],
       gambar=[adegan('on', 'pencil')], kisi='EN3b',
       bahas='on = di atas, under = di bawah, in = di dalam.',
       konteks='“Where is my ...?” artinya “Di mana ... milikku?”. Jawabannya “It is” lalu kata tempat: on (di atas), under (di bawah), in (di dalam). Latih dengan benda sungguhan: taruh pensil di atas, di bawah, lalu di dalam kotak sambil menyebut kalimatnya.'),
    pg('Arti “in front of” adalah ....', 'di depan', ['di belakang', 'di sebelah', 'di atas'], kisi='EN4a',
       konteks='Front artinya depan. In front of = di depan sesuatu. Peragakan dengan boneka dan kotak: letakkan boneka di depan kotak (dekat anak), lalu di belakang kotak, dan di sebelah kotak sambil menyebut tiap kata.'),
    pg('Perhatikan gambar. Kalimat yang benar adalah ....', 'There are three books on the table.',
       ['There are two books on the table.', 'There are three bags on the table.', 'There are three books under the table.'],
       gambar=[adegan('on', 'green-book', n=3)], kisi='EN5a',
       bahas='There are + jumlah + benda + tempat.',
       konteks='“There are ...” dipakai untuk menyebut jumlah benda yang banyak (lebih dari satu) dan letaknya. Ajak anak memeriksa tiga hal berurutan: berapa jumlahnya, benda apa, dan di mana letaknya. Satu pengecoh salah di tiap bagian itu.'),
    # ---- isian ----
    isian('Perhatikan gambar.\n“Where is the dog?”  “It is ____ to the chair.”', ['next'],
          gambar=[adegan('next', 'dog-face', ref='kursi')], kisi='EN4b',
          bahas='Anjing berdampingan dengan kursi: It is next to the chair.',
          konteks='Lihat gambar: anjing berada di samping kursi, berdampingan dan tidak menutupi kursi. Dalam bahasa Inggris itu next to (di sebelah). Pada soal ini tinggal satu kata yang kosong, yaitu kata sebelum to. Bila anjing berada di depan kursi dan menutupinya, jawabannya in front of; bila bersembunyi di balik kursi, behind.'),
    isian('Tulis dalam bahasa Inggris: ibu (My ____)', ['mother', 'mom', 'mum', 'mommy', 'mummy', 'mama'],
          gambar=[img('woman-with-headscarf', label='ibu')], kisi='EN2a',
          konteks='Anggota keluarga: father (ayah), mother (ibu), brother (kakak/adik laki-laki), sister (kakak/adik perempuan), grandfather (kakek), grandmother (nenek). Mother artinya ibu; susunan hurufnya m-o-t-h-e-r. Boleh juga mom.'),
    isian('Tulis nama benda ini dalam bahasa Inggris.', ['ruler', 'a ruler', 'the ruler'],
          gambar=[img('straight-ruler')], kisi='EN3a',
          konteks='Ruler artinya penggaris. Minta anak mengambil penggarisnya sendiri, tunjuk lalu ucapkan “ruler” dan eja bersama r-u-l-e-r. Latihan ini bisa dikembangkan ke benda lain di tas.'),
    isian('Tulis dalam bahasa Inggris: di belakang', ['behind'], kisi='EN4a',
          konteks='Kata tempat dalam bahasa Inggris: in front of (di depan), behind (di belakang), next to (di sebelah). Letakkan boneka di belakang kotak lalu tanya, “Di mana bonekanya? Bahasa Inggrisnya apa?” Ingat pola be-hind: be (di) + hind (belakang).'),
    isian('Temanmu meminjamkan penggaris. Kamu berkata, “Thank ____.”', ['you'], kisi='EN5b',
          konteks='“Thank you” adalah cara sopan berterima kasih, tanda kita menghargai bantuan orang lain. Bayangkan situasi nyata, misalnya adik mengambilkan sandal, lalu minta anak mengucapkannya dalam bahasa Inggris.'),
    isian('Perhatikan gambar.\n“Where is my bag?”  “It is ____ the table.”', ['under'],
          gambar=[adegan('under', 'backpack')], kisi='EN3b',
          konteks='Lihat posisi tasnya terhadap meja. Tas ada di bawah meja. Bantu anak membedakan tiga kata tempat: on = menempel di atas, under = di bawah (ada ruang di bawah meja), in = di dalam. Peragakan dengan tas dan meja belajar.'),
    # ---- uraian ----
    uraian('Bu Guru bertanya, “Do you like mango?” Kamu tidak suka mangga.\n(a) Tulis jawabanmu dalam bahasa Inggris.\n(b) Temanmu, Tini, sangat suka mangga. Apa yang sebaiknya kamu lakukan?',
           '(a) No, I don’t. (b) Aku tidak mengejek Tini. Aku menghargai kesukaannya, karena setiap orang boleh punya kesukaan yang berbeda.',
           [['no, i don\'t', 'no i don\'t', 'no, i do not', 'no i do not', 'no, i don’t', 'no i dont', 'no, i dont', 'no, i don`t'],
            ['hargai', 'menghargai', 'tidak mengejek', 'tidak mengolok', 'tidak mengganggu', 'tidak apa', 'tidak boleh mengejek', 'berbeda', 'tidak marah', 'menghormati']],
           minimal=2, kisi='EN1b',
           bahas='Jawaban tidak suka: No, I don’t. Dalam Islam kita menghargai teman yang berbeda kesukaan dan tidak mengejek.',
           konteks='Bagian (a) menguji pola “No, I don’t.” untuk jawaban tidak suka. Bagian (b) tentang akhlak: kita boleh berbeda selera, dan tidak boleh mengejek teman. Tanyakan, “Kalau kamu diejek karena suka sesuatu, rasanya bagaimana?” agar anak menemukan alasan menghargai.'),
    uraian('Tulis nama ketiga benda ini dalam bahasa Inggris.',
           'ruler, chair, pencil case',
           [['ruler'], ['chair'], ['pencil case', 'pencilcase', 'pensil case']], minimal=3, kisi='EN3a',
           gambar=[img('straight-ruler', label='1'), img('chair', label='2'), KOTAK_PENSIL],
           bahas='ruler = penggaris, chair = kursi, pencil case = kotak pensil.',
           konteks='Tiga benda kelas: ruler (penggaris), chair (kursi), pencil case (kotak pensil). Pencil case adalah dua kata: pensil + tempat. Latih dengan menunjuk benda di rumah satu per satu, anak menyebut nama Inggrisnya dulu sebelum menulis.'),
    uraian('Bukumu tidak ada di tasmu. Kamu ingin bertanya kepada Bu Guru dengan sopan. Tulis kalimat yang kamu ucapkan (boleh bahasa Inggris atau Indonesia). Lalu, apa yang kamu ucapkan setelah Bu Guru membantu?',
           'Excuse me, Ma’am. Where is my book? Setelah dibantu: Thank you, Ma’am. (Permisi, Bu. Di mana bukuku? ... Terima kasih, Bu.)',
           [['excuse me', 'permisi', 'maaf', 'tolong', 'please'], ['thank', 'terima kasih', 'makasih', 'terimakasih', 'trima kasih']], minimal=2, kisi='EN5b',
           bahas='Bertanya sopan: Excuse me, ... lalu berterima kasih: Thank you.',
           konteks='Anak belajar dua kebiasaan sopan: membuka dengan “Excuse me” (permisi) saat bertanya, dan menutup dengan “Thank you” (terima kasih). Mainkan peran: orang tua jadi guru, anak “mencari” bukunya. Perhatikan apakah anak memakai nada yang halus.'),
]

# ================= PAKET 2 =================
paket2 = [
    # ---- PG ----
    pg('Mana gambar “watermelon”?', img('watermelon'), [img('tangerine'), img('banana'), img('grapes')], kisi='EN1a',
       konteks='Watermelon = semangka (water = air, melon = melon, karena buahnya banyak air). Bantu anak mengingat dengan petunjuk itu. Tunjukkan buah lain: banana (pisang), grapes (anggur), orange (jeruk), lalu minta anak menunjuk saat kamu menyebut namanya.'),
    pg('Wanita tua ini nenekmu. Dalam bahasa Inggris dia disebut ....', 'grandmother', ['grandfather', 'mother', 'sister'],
       gambar=[img('old-woman', label='nenek')], kisi='EN2a',
       bahas='grand = besar/tua; mother = ibu. Grandmother = nenek.',
       konteks='Grandmother = nenek, grandfather = kakek. Kata grand menunjukkan orang tua dari orang tua kita. Anak sering tertukar mother dan grandmother; ajak anak menyebut “ibu dari ibuku” sebagai petunjuk bahwa grandmother adalah mother yang lebih tua.'),
    pg('Benda ini bernama ....', 'pencil case', ['book', 'bag', 'ruler'],
       gambar=[KOTAK_PENSIL], kisi='EN3a',
       konteks='Pencil case adalah kotak atau tempat pensil, yang biasa dibawa ke sekolah. Perhatikan bentuk gambar: kotak panjang dengan resleting dan tulisan PENCIL. Bandingkan dengan book (buku), bag (tas), dan ruler (penggaris) yang bentuknya jauh berbeda.'),
    pg('“Where is my ball?” Perhatikan gambar.', 'It is in the box.', ['It is on the box.', 'It is under the box.', 'It is behind the box.'],
       gambar=[adegan('in', 'soccer-ball')], kisi='EN3b',
       bahas='in = di dalam. Bola ada di dalam kotak.',
       konteks='Pada gambar, bola masuk ke dalam kotak (sebagian tertutup dinding kotak). Artinya in. Peragakan dengan kotak asli: bola di atas kotak (on), di dalam kotak (in), lalu di bawah meja (under). Minta anak mengucapkan kalimat “It is ... the box.”'),
    pg('Di mana kucing? Perhatikan gambar.\n“Where is the cat?”', 'It is next to the box.', ['It is behind the box.', 'It is in front of the box.', 'It is on the box.'],
       gambar=[adegan('next', 'cat-face')], kisi='EN4b',
       bahas='next to = di sebelah (berdampingan).',
       konteks='Pada gambar, kucing berdampingan dengan kotak dan tidak menutupi kotak, jadi next to (di sebelah). Kalau kucing menutupi kotak dari depan, itu in front of; kalau tersembunyi sebagian di balik kotak, itu behind. Ajak anak mengamati letak, bukan menebak.'),
    pg('Kamu ingin bertanya letak penggarismu kepada Bu Guru. Kalimat yang paling sopan adalah ....',
       'Excuse me, Ma’am. Where is my ruler?', ['Hey, Ma’am! Give me my ruler!', 'Ma’am, my ruler. Quick, quick!', 'Where is my ruler? Tell me now!'], kisi='EN5b',
       bahas='Awali dengan Excuse me, nada halus, tidak memerintah.',
       konteks='Bertanya sopan berarti memakai “Excuse me” (permisi), nada lembut, dan bentuk pertanyaan, bukan perintah. Tiga kalimat lain terdengar memerintah atau terburu-buru. Baca keempat pilihan dengan nada yang berbeda agar anak merasakan bedanya.'),
    # ---- isian ----
    isian('Tulis nama buah ini dalam bahasa Inggris.', ['orange', 'oranges', 'an orange'],
          gambar=[img('tangerine')], kisi='EN1a',
          konteks='Orange artinya jeruk (dan juga warna oranye). Dalam bahasa Inggris, o-r-a-n-g-e. Tunjukkan jeruk asli, ucapkan “orange”, lalu minta anak mengeja huruf demi huruf.'),
    isian('“Does your father like mangoes?”\n“Yes, he ____.”', ['does'], gambar=[img('man', label='father'), img('mango')], kisi='EN2b',
          bahas='Untuk he/she, jawabannya does.',
          konteks='Pertanyaan tentang satu orang lain memakai “Does your ... like ...?” dan dijawab “Yes, he does.” (untuk laki-laki) atau “Yes, she does.” (untuk perempuan). Anak tinggal menulis does. Latih dengan menanyakan kesukaan ayah, ibu, kakak di rumah.'),
    isian('Tulis dalam bahasa Inggris: di depan', ['in front of', 'infront of', 'in-front-of'], kisi='EN4a',
          bahas='in front of = di depan (tiga kata).',
          konteks='“Di depan” dalam bahasa Inggris adalah in front of (tiga kata). Peragakan: letakkan boneka di depan kotak, tanya “Di mana bonekanya?”, lalu ucapkan “in front of” bersama. Ingat front = depan; bantu anak menulis tiga kata dengan jarak.'),
    isian('Perhatikan gambar. Pilih kata: behind, next to, atau in front of.\n“The ball is ____ the box.”', ['behind'],
          gambar=[adegan('behind', 'soccer-ball')], kisi='EN4b',
          konteks='Lihat gambar: bola tersembunyi sebagian di balik kotak dan hanya bagian atasnya yang terlihat. Itu behind (di belakang). Bila bola berdampingan dengan kotak berarti next to, dan bila menutupi kotak dari depan berarti in front of.'),
    isian('Perhatikan gambar.\n“There ____ two cats in front of the box.”', ['are'], gambar=[adegan('front', 'cat-face', n=2)], kisi='EN5a',
          konteks='Untuk lebih dari satu benda, pakai “There are”. Untuk satu benda, “There is”. Hitung dulu kucing pada gambar (dua), lalu pilih are. Cara mudah: dua atau lebih = are.'),
    isian('Do you like oranges? Kamu tidak suka jeruk.\nJawab: “No, I ____.”', ['don\'t', 'dont', 'do not', 'don’t', 'don`t'],
          gambar=[img('tangerine', label='orange')], kisi='EN1b',
          konteks='Jawaban tidak suka adalah “No, I don’t.” Don’t adalah singkatan dari do not. Boleh ditulis do not juga. Latih dengan memberi dua pertanyaan: satu yang disukai anak, satu yang tidak, lalu minta anak menjawab keduanya.'),
    # ---- uraian ----
    uraian('Contoh: My sister likes grapes.\nTulis satu kalimat bahasa Inggris seperti contoh itu, tentang apa yang disukai ayah, ibu, kakak, atau adikmu.',
           'My father likes bananas. (contoh: My mother likes mangoes.)',
           [['my '], ['likes'], ['father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'dad', 'mom', 'mum', 'grandpa', 'grandma']],
           minimal=3, kisi='EN2b',
           bahas='Pola: My + anggota keluarga + likes + benda.',
           konteks='Kalimat ini punya tiga bagian: My (milikku), anggota keluarga (father, mother, ...), dan likes + yang disukai. Tanya anak, “Ayah suka makan apa?” lalu susun bersama: My father likes ... Jangan lupa huruf s pada likes.'),
    uraian('Perhatikan gambar.\n“Where is the ball?”\nTulis jawabanmu dalam bahasa Inggris dengan kata “It is ...”.',
           'It is in front of the chair.',
           [['it is', 'it\'s', 'the ball is'], ['in front of', 'infront of'], ['chair']], minimal=3, kisi='EN4b',
           gambar=[adegan('front', 'soccer-ball', ref='kursi')],
           bahas='Bola ada di depan kursi: It is in front of the chair.',
           konteks='Anak diminta menjelaskan letak benda dari gambar. Ajak anak mengamati: bola menutupi sebagian kursi dari depan, jadi “in front of”. Lalu susun kalimat dengan urutan: It is + kata tempat + the + benda acuan (chair).'),
    uraian('Perhatikan gambar. Tulis satu kalimat bahasa Inggris yang dimulai dengan “There are ...” tentang gambar itu.',
           'There are four apples on the table.',
           [['there are'], ['four', '4'], ['apples', 'apple'], ['on the table', 'on table']], minimal=3, kisi='EN5a',
           gambar=[adegan('on', 'red-apple', n=4)],
           konteks='Kalimat “There are ...” butuh tiga bagian: jumlah (four), benda (apples, banyak jadi pakai s), dan tempat (on the table). Minta anak menghitung apelnya dulu, lalu menyebut tempatnya, baru menulis.'),
]

# ================= PAKET 3 =================
paket3 = [
    # ---- PG ----
    pg('Dodi bertanya, “Do you like grapes?” Artinya ....', 'Apakah kamu suka anggur?', ['Apakah kamu punya anggur?', 'Anggur ada di mana?', 'Aku suka anggur.'],
       gambar=[img('grapes', label='grapes')], kisi='EN1b',
       bahas='Do you like ...? = Apakah kamu suka ...?',
       konteks='Do you like ...? adalah pertanyaan, jadi artinya “Apakah kamu suka ...?”. Bedanya dengan kalimat pernyataan “I like grapes” (aku suka anggur). Ajak anak menerjemahkan tiap kata: Do (tanda tanya), you (kamu), like (suka), grapes (anggur).'),
    pg('Anak laki-laki ini adalah kakakmu. Dalam bahasa Inggris, dia adalah your ....', 'brother', ['sister', 'father', 'grandfather'],
       gambar=[img('boy', label='kakak laki-laki')], kisi='EN2a',
       konteks='Brother = saudara laki-laki (kakak atau adik), sister = saudara perempuan. Petunjuk: gambar anak laki-laki, jadi brother. Father (ayah) dan grandfather (kakek) adalah orang dewasa, jadi tidak cocok.'),
    pg('“Does your sister like apples?” Dia suka apel. Jawabannya ....', 'Yes, she does.', ['Yes, he does.', 'Yes, she do.', 'Yes, I does.'],
       gambar=[img('girl', label='sister'), img('red-apple')], kisi='EN2b',
       bahas='sister = perempuan, jadi she. Jawaban: Yes, she does.',
       konteks='Jawaban untuk “Does your ... like ...?” ikut siapa yang ditanya: perempuan she, laki-laki he. Sister adalah perempuan, jadi she, dan kata kerjanya selalu does. Cek dua hal: she atau he, lalu does bukan do.'),
    pg('Baca teks pendek.\n“My bag is brown. It is next to the chair.”\nWhere is the bag?', 'It is next to the chair.', ['It is on the chair.', 'It is under the chair.', 'It is behind the chair.'],
       kisi='EN4b',
       bahas='Teks: It is next to the chair.',
       konteks='Soal ini membaca teks pendek lalu mencari letak benda. Garis bawahi kalimat yang berisi letaknya: “It is next to the chair.” Jawabannya sama dengan kalimat itu. Biasakan anak mencari kata tempat (on, under, behind, next to) saat membaca.'),
    pg('Lihat gambar. Pilih kalimat yang cocok dengan gambar.', 'There are four apples in the box.',
       ['There are three apples in the box.', 'There are four apples in front of the box.', 'There are four balls in the box.'],
       gambar=[adegan('in', 'red-apple', n=4)], kisi='EN5a',
       bahas='4 apel di dalam kotak: There are four apples in the box.',
       konteks='Periksa tiga hal: jumlah (hitung apel: empat), benda (apel, bukan bola), dan tempat (di dalam kotak karena sebagian apel tertutup dinding kotak). Pilihan yang benar harus cocok pada ketiganya.'),
    pg('Setelah memakai gunting, Rani langsung menaruhnya kembali di tempat pensil. Sikap Rani adalah ....', 'rapi dan bertanggung jawab', ['malas dan tidak peduli', 'marah dan tidak sabar', 'curang dan tidak jujur'], kisi='EN5b',
       konteks='Menaruh barang kembali ke tempatnya adalah sikap rapi dan bertanggung jawab, jadi barang mudah dicari lagi dan tidak hilang. Tanyakan, “Kalau Rani tidak menaruhnya, apa yang terjadi?” Biarkan anak menyimpulkan sendiri.'),
    # ---- isian ----
    isian('Tulis dalam bahasa Inggris: kakek', ['grandfather', 'grandpa', 'granddad', 'grandad', 'grand father'],
          gambar=[img('old-man', label='kakek')], kisi='EN2a',
          konteks='Grandfather = kakek. Kata ini gabungan grand (orang tua dari orang tua) dan father (ayah), jadi “ayah dari ayah/ibu”. Latih mengeja per bagian: grand + father. Grandpa juga bisa diterima karena artinya sama.'),
    isian('Benda ini bahasa Inggrisnya apa? Tulis jawabanmu.', ['pencil', 'a pencil', 'the pencil'], gambar=[img('pencil')], kisi='EN3a',
          konteks='Pencil artinya pensil. Hati-hati: pencil case adalah kotak pensil, bukan pensilnya. Minta anak memegang pensil, mengucapkan “pencil”, dan mengeja p-e-n-c-i-l.'),
    isian('Tulis dalam bahasa Inggris: di sebelah', ['next to', 'nextto', 'next-to'], kisi='EN4a',
          bahas='next to = di sebelah.',
          konteks='“Di sebelah” dalam bahasa Inggris adalah next to (dua kata). Peragakan dengan dua buku di meja: letakkan berdampingan, tanya, “Buku merah ada di mana terhadap buku biru?” Ucapkan “next to” bersama. Bedakan dari in front of dan behind.'),
    isian('Pensil barumu bagus. Kamu bersyukur kepada Allah swt. dengan mengucap ....', ['alhamdulillah', 'alhamdulilah', 'alhamdullilah', 'alhamdulillahi', 'hamdalah'], kisi='EN5b',
          bahas='Alhamdulillah = segala puji bagi Allah.',
          konteks='Bersyukur kepada Allah swt. atas nikmat, termasuk perlengkapan sekolah, diucapkan dengan “Alhamdulillah”. Tanyakan anak kapan terakhir mengucapkannya, lalu hubungkan dengan menjaga pensil agar tidak hilang sebagai wujud syukur.'),
    isian('Buah apa ini? Tulis namanya dalam bahasa Inggris.', ['mango', 'mangoes', 'mangos', 'a mango'], gambar=[img('mango')], kisi='EN1a',
          konteks='Mango adalah mangga. Bunyi bacanya “mang-go”. Tunjukkan mangga asli atau gambar ini, ucapkan bersama, lalu eja m-a-n-g-o.'),
    isian('“Where is my pencil?”  “It is ____ the box.”', ['in', 'inside'], gambar=[adegan('in', 'pencil')], kisi='EN3b',
          konteks='Pensil berada di dalam kotak (separuh tertutup dinding kotak), jadi jawabannya in. Bandingkan: on (di atas) dan under (di bawah). Peragakan dengan kotak pensil asli: pensil di atas, di dalam, lalu di bawah kotak.'),
    # ---- uraian ----
    uraian('Rafi bertanya, “Do you like pineapple?” Kamu suka nanas.\n(a) Tulis jawabanmu dalam bahasa Inggris.\n(b) Rafi bilang ia tidak suka nanas. Apa yang kamu katakan atau lakukan?',
           '(a) Yes, I do. (b) Aku bilang tidak apa-apa dan tidak mengejek Rafi, karena setiap orang boleh punya kesukaan sendiri.',
           [['yes, i do', 'yes i do'],
            ['hargai', 'menghargai', 'tidak mengejek', 'tidak mengolok', 'tidak apa', 'boleh', 'tidak marah', 'tidak memaksa', 'menghormati', 'berbeda']],
           minimal=2, kisi='EN1b',
           gambar=[img('pineapple')],
           bahas='Yes, I do. = ya, suka. Kita menghargai kesukaan teman dan tidak memaksanya.',
           konteks='Bagian (a) memakai jawaban suka: “Yes, I do.” Bagian (b) tentang menghargai perbedaan: tidak mengejek dan tidak memaksa teman. Bantu anak dengan contoh nyata, misalnya adik tidak suka sayur, dan bagaimana kita bersikap.'),
    uraian('Sebutkan dalam bahasa Inggris nama ketiga benda sekolah ini.',
           'book, bag, pencil',
           [['book'], ['bag', 'backpack', 'schoolbag', 'school bag'], ['pencil']], minimal=3, kisi='EN3a',
           gambar=[img('green-book', label='1'), img('backpack', label='2'), img('pencil', label='3')],
           bahas='book = buku, bag = tas, pencil = pensil.',
           konteks='Tiga benda sekolah: book (buku), bag (tas), pencil (pensil). Minta anak membuka tasnya dan menyebut nama Inggris setiap benda sebelum menulis. Tidak masalah bila urutan jawaban berbeda.'),
    uraian('Kamu meminjam penggaris Dina, lalu penggaris itu hilang. Sebagai anak yang bertanggung jawab, apa yang kamu lakukan? Tulis satu atau dua kalimat.',
           'Aku minta maaf kepada Dina, lalu mencari penggarisnya. Jika tidak ketemu, aku bilang dengan jujur dan menggantinya.',
           [['minta maaf', 'maaf'], ['mencari', 'cari', 'ganti', 'mengganti', 'menggantinya', 'mengembalikan'], ['bilang', 'memberi tahu', 'mengatakan', 'jujur', 'cerita', 'menceritakan', 'lapor']],
           minimal=2, kisi='EN5b',
           bahas='Bertanggung jawab: meminta maaf, mencari, dan mengganti.',
           konteks='Bertanggung jawab berarti berani mengakui dan memperbaiki kesalahan. Tanyakan anak: “Kalau mainanmu dipinjam teman lalu hilang, kamu ingin dia berbuat apa?” Dari situ ia bisa menyebut minta maaf, ikut mencari, dan mengganti.'),
]

PAKET = [paket1, paket2, paket3]
