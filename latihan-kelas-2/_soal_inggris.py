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

    # ---- tambahan kisi-kisi (paket 1) ----
    pg('Kakek adalah ayah dari ayah atau ibu kita. Dalam bahasa Inggris kakek disebut ....', 'grandfather', ['grandmother', 'father', 'brother'],
       gambar=[img('old-man', label='kakek')], kisi='EN2a',
       konteks='Grandfather = kakek, grandmother = nenek. Kata grand menunjukkan orang tua dari orang tua kita: grand + father (ayah) = kakek. Father (ayah) dan brother (saudara laki-laki) berbeda. Tanyakan, “Kakek laki-laki atau perempuan? Ayah dari siapa?” lalu cocokkan dengan pilihan.'),
    pg('Kamu memasukkan buku dan pensil ke benda ini. Dalam bahasa Inggris disebut ....', 'bag', ['book', 'eraser', 'crayon'],
       gambar=[img('backpack')], kisi='EN3a',
       konteks='Bag artinya tas, tempat membawa buku dan perlengkapan sekolah. Book (buku), eraser (penghapus), dan crayon (krayon) adalah benda yang dimasukkan ke dalam tas. Minta anak menunjuk tasnya sendiri sambil menyebut “bag”.'),
    pg('Perhatikan gambar.\n“Where is the frog?”', 'It is in front of the box.', ['It is behind the box.', 'It is under the box.', 'It is on the box.'],
       gambar=[adegan('front', 'frog')], kisi='EN4b',
       bahas='Katak ada di depan kotak: in front of.',
       konteks='Pada gambar, katak berada di depan kotak dan menutupi sebagian kotak, jadi in front of. Bila hanya kepalanya muncul dari balik kotak, itu behind; bila di atas kotak, on; bila di bawah, under. Minta anak menunjuk bagian gambar yang menjadi petunjuknya.'),
    pg('Kamu menemukan pensil temanmu di lantai kelas. Sikap yang baik adalah ....', 'mengembalikannya kepada temanmu', ['menyimpannya untuk diri sendiri', 'membuangnya ke tempat sampah', 'membiarkannya di lantai'], kisi='EN5b',
       konteks='Menjaga barang bukan hanya barang sendiri, tetapi juga barang teman: dikembalikan agar tidak hilang atau rusak. Itu bentuk tanggung jawab dan kejujuran. Tanyakan, “Kalau pensilmu yang jatuh, kamu ingin temanmu berbuat apa?”'),
    # ---- isian ----
    isian('Tulis dalam bahasa Inggris: anggur', ['grapes', 'grape', 'a grape'], gambar=[img('grapes')], kisi='EN1a',
          konteks='Grapes artinya anggur. Karena anggur tumbuh bergerombol (banyak), biasanya disebut grapes dengan s. Minta anak mengeja g-r-a-p-e-s sambil menunjuk gambar atau anggur asli.'),
    isian('Rina tidak suka apel, sedangkan kamu suka apel. Kesukaan kalian berbeda. Kita harus ... kesukaan Rina.', ['menghargai', 'hargai', 'menghormati', 'menerima'],
          gambar=[img('red-apple')], kisi='EN1b',
          konteks='Kesukaan setiap orang boleh berbeda. Sebagai muslim kita menghargai teman yang berbeda kesukaan, tidak mengejek dan tidak memaksa. Tanyakan, “Kalau kamu tidak suka sayur lalu diejek, rasanya bagaimana?” lalu minta anak menyebut sikap yang baik dengan satu kata.'),
    isian('Perhatikan gambar.\n“Does your father like apples?”  “Yes, ____ does.”', ['he'], gambar=[img('man', label='father'), img('red-apple')], kisi='EN2b',
          bahas='father = laki-laki, jadi he: Yes, he does.',
          konteks='Jawaban untuk “Does your ... like ...?” memakai he untuk laki-laki (father, brother) dan she untuk perempuan (mother, sister). Ayah adalah laki-laki. Minta anak menentukan dulu laki-laki atau perempuan, baru memilih he atau she.'),
    isian('Perhatikan gambar. Ada berapa bebek?\n“There are ____ ducks in front of the box.”', ['three', '3'], gambar=[adegan('front', 'duck', n=3)], kisi='EN5a',
          konteks='Hitung bebek pada gambar satu per satu: ada tiga. “There are three ducks ...” artinya “Ada tiga bebek ...”. Boleh dijawab dengan huruf (three) atau angka (3). Latih berhitung dalam bahasa Inggris: one, two, three, four, five.'),
    # ---- uraian ----
    uraian('Tini bertanya, “Does your sister like oranges?” Kakak perempuanmu suka jeruk.\n(a) Tulis jawabanmu dalam bahasa Inggris.\n(b) Kakak laki-lakimu suka semangka. Tulis kalimat bahasa Inggris yang dimulai dengan “My brother ...”.',
           '(a) Yes, she does. (b) My brother likes watermelon.',
           [['yes, she does', 'yes she does'], ['my brother likes', 'brother likes', 'my bro likes']], minimal=2, kisi='EN2b',
           gambar=[img('girl', label='sister'), img('tangerine'), img('boy', label='brother'), img('watermelon')],
           bahas='sister = perempuan, jadi Yes, she does. Satu orang + likes: My brother likes watermelon.',
           konteks='Bagian (a): kakak perempuan dijawab she, kata kerja does. Bagian (b): “My brother” diikuti likes (pakai s) dan benda yang disukai. Latih dengan kesukaan nyata anggota keluarga anak, lalu minta anak mengucapkannya lebih dulu sebelum menulis.'),
    uraian('Baca teks pendek.\n“Tia has a red bag. It is on the table. The pencil is in the bag.”\nTulis jawaban dalam bahasa Inggris:\n(a) Where is the bag?\n(b) Where is the pencil?',
           '(a) It is on the table. (b) It is in the bag.',
           # frasa dengan penanda (a)/(b) atau subjeknya, agar jawaban yang tertukar tidak lolos otomatis
           [['a it is on the table', 'a it s on the table', 'a on the table', 'bag is on the table', 'a the bag is on the table'],
            ['b it is in the bag', 'b it s in the bag', 'b in the bag', 'pencil is in the bag', 'b the pencil is in the bag']], minimal=2, kisi='EN4b',
           bahas='Tas di atas meja (on the table) dan pensil di dalam tas (in the bag).',
           konteks='Anak membaca teks lalu mencari kata letak: “on the table” untuk tas dan “in the bag” untuk pensil. Bantu dengan menggarisbawahi kata on dan in di teks. Minta anak menulis (a) dan (b) di depan jawabannya; bila tidak, nilai diperiksa orang tua.'),
    uraian('Perhatikan gambar. Hitung bendanya, lalu tulis kalimat bahasa Inggris yang dimulai dengan “There are ...” dan memakai “in the ...”.',
           'There are three balls in the box.',
           [['there are'], ['three', '3'], ['ball', 'balls'], ['in the box', 'in box']], minimal=4, kisi='EN5a',
           gambar=[adegan('in', 'soccer-ball', n=3)],
           bahas='Jumlah (three), benda (balls), tempat (in the box).',
           konteks='Kalimat “There are ...” butuh jumlah, benda (jamak, pakai s), dan tempat. Pada gambar, tiga bola berada di dalam kotak. Bantu anak menyusun tiga bagian itu satu per satu: There are + three + balls + in the box.'),
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
    pg('Benda ini bernama ....', 'pencil case', ['eraser', 'pencil', 'ruler'],
       gambar=[KOTAK_PENSIL], kisi='EN3a',
       konteks='Pencil case adalah kotak atau tempat pensil, yang biasa dibawa ke sekolah. Perhatikan bentuk gambar: kotak panjang dengan resleting dan tulisan PENCIL. Bandingkan dengan eraser (penghapus), pencil (pensil), dan ruler (penggaris) yang bentuknya berbeda.'),
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
    isian('Perhatikan gambar.\n“There are two ____ in front of the box.”', ['dogs', 'dog'], gambar=[adegan('front', 'dog-face', n=2)], kisi='EN5a',
          konteks='Hewan pada gambar adalah anjing (dog). Karena ada dua, kata bendanya diberi s: dogs. Hitung dulu hewannya, sebut namanya dalam bahasa Inggris, lalu tambahkan s karena lebih dari satu.'),
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
           [['there are'], ['four', '4'], ['apples', 'apple'], ['on the table', 'on table']], minimal=4, kisi='EN5a',
           gambar=[adegan('on', 'red-apple', n=4)],
           konteks='Kalimat “There are ...” butuh tiga bagian: jumlah (four), benda (apples, banyak jadi pakai s), dan tempat (on the table). Minta anak menghitung apelnya dulu, lalu menyebut tempatnya, baru menulis.'),

    # ---- tambahan kisi-kisi (paket 2) ----
    pg('Temanmu tidak suka anggur, tetapi kamu sendiri suka anggur. Sikapmu yang baik adalah ....', 'menghargai pendapatnya dan tidak mengejek', ['mengejek temanmu', 'memaksa temanmu memakan anggur', 'tidak mau bermain dengan temanmu'],
       gambar=[img('grapes')], kisi='EN1b',
       konteks='Setiap orang boleh punya kesukaan yang berbeda, dan sebagai muslim kita menghargai teman, tidak mengejek dan tidak memaksa. Beri contoh nyata, misalnya adik tidak suka sayur: kita tidak mengolok-olok, cukup mengatakan “tidak apa-apa”.'),
    pg('Kamu ingin bertanya kepada temanmu apakah ibunya suka jeruk. Kalimat tanya yang benar adalah ....', 'Does your mother like oranges?', ['Do your mother like oranges?', 'Does your mother likes oranges?', 'Is your mother like oranges?'],
       gambar=[img('woman-with-headscarf', label='mother'), img('tangerine')], kisi='EN2b',
       bahas='Satu orang (mother): Does ... like ...? Setelah does, like tidak memakai s.',
       konteks='Pertanyaan tentang satu orang lain memakai “Does your ... like ...?”. Setelah does, kata like tetap tanpa s (does sudah membawa s-nya). Cek dua hal pada pilihan: awalnya does bukan do, dan like tanpa s.'),
    pg('Arti “next to” adalah ....', 'di sebelah', ['di depan', 'di belakang', 'di bawah'], kisi='EN4a',
       konteks='Next to = di sebelah, berdampingan. Peragakan dengan dua buku: letakkan berdampingan lalu ucapkan “next to”. Bandingkan dengan in front of (di depan) dan behind (di belakang) agar anak membedakannya.'),
    pg('Perhatikan gambar. Pilih kalimat yang menjelaskan gambar dengan benar.', 'There are three balloons in front of the box.',
       ['There are two balloons in front of the box.', 'There are three balloons behind the box.', 'There are three balls in front of the box.'],
       gambar=[adegan('front', 'balloon', n=3)], kisi='EN5a',
       bahas='3 balon di depan kotak: There are three balloons in front of the box.',
       konteks='Periksa tiga hal: jumlah (hitung balon: tiga), benda (balloons = balon, bukan balls = bola), dan tempat (di depan kotak = in front of). Pilihan yang benar harus cocok pada ketiganya; tiap pengecoh salah di satu bagian.'),
    # ---- isian ----
    isian('Tulis dalam bahasa Inggris: saudara laki-laki (kakak atau adik laki-laki)', ['brother', 'bro', 'a brother'], gambar=[img('boy')], kisi='EN2a',
          konteks='Brother artinya saudara laki-laki, baik kakak maupun adik. Saudara perempuan adalah sister. Minta anak mengeja b-r-o-t-h-e-r, lalu bertanya, “Siapa brother dan sister di keluarga kita?”'),
    isian('Tulis dalam bahasa Inggris: krayon', ['crayon', 'crayons', 'a crayon'], gambar=[img('crayon')], kisi='EN3a',
          konteks='Crayon artinya krayon, alat mewarnai. Bunyinya mirip dengan bahasa Indonesia, tetapi ditulis dengan c dan y: c-r-a-y-o-n. Minta anak memegang krayonnya, menyebut “crayon”, lalu mengeja.'),
    isian('Perhatikan gambar.\n“Where is my teddy bear?”  “It is ____ the table.”', ['on'], gambar=[adegan('on', 'teddy-bear')], kisi='EN3b',
          konteks='Boneka beruang berada di atas meja, bertumpu pada permukaan meja. Itu on. Bandingkan dengan under (di bawah meja) dan in (di dalam). Peragakan dengan boneka dan meja belajar.'),
    isian('Kamu ingin meminjam penghapus temanmu. Kamu berkata, “May I borrow your eraser, ____?”', ['please'], kisi='EN5b',
          konteks='“Please” (tolong) membuat permintaan terdengar sopan. Meminjam barang dengan sopan termasuk akhlak baik di sekolah. Latih dengan bermain peran: anak meminjam sesuatu pada orang tua dengan kalimat ini.'),
    # ---- uraian ----
    uraian('Kamu suka pisang, tetapi tidak suka anggur.\n(a) Bu Guru bertanya, “Do you like bananas?” Tulis jawabanmu.\n(b) Bu Guru bertanya, “Do you like grapes?” Tulis jawabanmu.\n(c) Temanmu suka anggur. Apa yang sebaiknya kamu lakukan?',
           '(a) Yes, I do. (b) No, I don’t. (c) Aku tidak mengejek temanku dan menghargai kesukaannya.',
           [['yes, i do', 'yes i do'],
            ['no, i don\'t', 'no i don\'t', 'no, i do not', 'no i do not', 'no, i don’t', 'no i dont', 'no, i dont', 'no, i don`t'],
            ['hargai', 'menghargai', 'tidak mengejek', 'tidak mengolok', 'tidak apa', 'tidak marah', 'tidak memaksa', 'menghormati', 'berbeda']],
           minimal=3, kisi='EN1b',
           gambar=[img('banana'), img('grapes')],
           bahas='Suka: Yes, I do. Tidak suka: No, I don’t. Menghargai kesukaan teman, tidak mengejek.',
           konteks='Bagian (a) jawaban suka (Yes, I do.), bagian (b) jawaban tidak suka (No, I don’t.), bagian (c) tentang akhlak: kesukaan boleh berbeda dan kita tidak mengejek. Mainkan tanya jawab dengan dua buah, satu disukai dan satu tidak, lalu bahas sikap pada teman.'),
    uraian('Benda nomor 1, 2, dan 3 ini bahasa Inggrisnya apa? Tulis ketiganya.',
           'book, bag, chair',
           [['book'], ['bag', 'backpack', 'schoolbag', 'school bag'], ['chair']], minimal=3, kisi='EN3a',
           gambar=[img('green-book', label='1'), img('backpack', label='2'), img('chair', label='3')],
           bahas='book = buku, bag = tas, chair = kursi.',
           konteks='Tiga benda kelas: book (buku), bag (tas), chair (kursi). Minta anak menunjuk benda yang sama di rumah, menyebut nama Inggrisnya, baru menulis. Urutan jawaban boleh berbeda.'),
    uraian('Ayah membelikan tas baru untukmu.\n(a) Apa yang kamu ucapkan kepada Ayah?\n(b) Tulis satu cara menjaga tas itu agar tidak cepat rusak.',
           '(a) Terima kasih, Ayah. / Thank you, Dad. (b) Aku menaruh tas di tempatnya, menjaganya tetap bersih, dan tidak menaruhnya sembarangan.',
           [['thank', 'terima kasih', 'makasih', 'terimakasih', 'trima kasih'],
            ['bersih', 'rapi', 'jaga', 'menjaga', 'merawat', 'rawat', 'menyimpan', 'simpan', 'tidak hilang', 'tidak sembarangan', 'mencuci', 'dicuci', 'menaruh', 'tempatnya']], minimal=2, kisi='EN5b',
           bahas='Berterima kasih (Thank you) dan menjaga barang: bersih, rapi, disimpan di tempatnya.',
           konteks='Bagian (a) menguji kebiasaan berterima kasih (thank you) atas pemberian. Bagian (b) menjaga barang: bersih, rapi, disimpan di tempatnya, tidak dilempar. Tanyakan, “Tas lamamu dulu kamu rawat bagaimana?” agar anak menemukan cara dari pengalamannya.'),
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
    pg('Baca teks pendek.\n“My ball is red. It is behind the chair.”\nWhere is the ball?', 'It is behind the chair.', ['It is on the chair.', 'It is under the chair.', 'It is in front of the chair.'],
       kisi='EN4b',
       bahas='Teks: It is behind the chair.',
       konteks='Soal ini membaca teks pendek lalu mencari letak benda. Garis bawahi kalimat yang berisi letaknya: “It is behind the chair.” Jawabannya sama dengan kalimat itu. Biasakan anak mencari kata tempat (on, under, behind, in front of) saat membaca.'),
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

    # ---- tambahan kisi-kisi (paket 3) ----
    pg('Perhatikan gambar. Nama buah ini dalam bahasa Inggris adalah ....', 'banana', ['apple', 'orange', 'grapes'],
       gambar=[img('banana')], kisi='EN1a',
       konteks='Banana artinya pisang. Bandingkan dengan apple (apel), orange (jeruk), dan grapes (anggur). Bentuk melengkung dan kulit kuning pada gambar adalah petunjuk. Ucapkan “ba-na-na” bersama anak sambil memegang pisang.'),
    pg('Kamu duduk di benda ini saat belajar di kelas. Dalam bahasa Inggris disebut ....', 'chair', ['ruler', 'eraser', 'crayon'],
       gambar=[img('chair')], kisi='EN3a',
       konteks='Chair artinya kursi, tempat kita duduk. Bunyi bacanya “cher”. Bandingkan dengan ruler (penggaris), eraser (penghapus), dan crayon (krayon), yang tidak bisa diduduki. Ajak anak menunjuk kursi di rumah sambil menyebut “chair”.'),
    pg('Perhatikan gambar.\n“Where is my book?”', 'It is under the table.', ['It is on the table.', 'It is in the table.', 'It is in front of the table.'],
       gambar=[adegan('under', 'green-book')], kisi='EN3b',
       bahas='under = di bawah. Buku ada di bawah meja.',
       konteks='Pada gambar, buku berada di bawah meja, di atas lantai. Itu under. Bila buku menumpang di permukaan meja itu on, dan bila berada di depan meja itu in front of. Peragakan dengan buku dan meja belajar.'),
    pg('Kata “behind” artinya ....', 'di belakang', ['di depan', 'di sebelah', 'di bawah'], kisi='EN4a',
       konteks='Behind = di belakang. Peragakan: letakkan boneka di belakang kotak sehingga tertutup sebagian, lalu ucapkan “behind”. Bandingkan dengan in front of (di depan) dan next to (di sebelah) agar anak tidak tertukar.'),
    # ---- isian ----
    isian('Lengkapi pertanyaan ini.\n“____ you like bananas?”  “No, I don’t.”', ['do'], gambar=[img('banana')], kisi='EN1b',
          bahas='Pertanyaan suka: Do you like ...?',
          konteks='Pertanyaan tentang kesukaan memakai “Do you like ...?”. Jawaban “No, I don’t” juga memakai do, jadi kata yang hilang adalah do. Minta anak membaca pasangan tanya-jawab itu dengan lantang.'),
    isian('Perhatikan gambar.\n“Does your mother like pizza?”  “Yes, ____ does.”', ['she'], gambar=[img('woman-with-headscarf', label='mother'), img('pizza')], kisi='EN2b',
          bahas='mother = perempuan, jadi she.',
          konteks='Mother (ibu) adalah perempuan, jadi jawabannya memakai she. Untuk laki-laki (father, brother) dipakai he. Mintalah anak mencari dulu: laki-laki atau perempuan, baru memilih he atau she.'),
    isian('Baca teks pendek.\n“The cat is in front of the house.”\nWhere is the cat?  “It is ____ the house.”', ['in front of', 'infront of', 'in-front-of'], kisi='EN4b',
          bahas='Teks: The cat is in front of the house.',
          konteks='Anak membaca teks lalu menyalin kata letaknya: “in front of” (tiga kata). Garis bawahi bagian itu di teks bersama anak. Biasakan membaca kalimat lengkap dulu, baru mengisi bagian yang kosong.'),
    isian('Perhatikan gambar. Ada berapa pisang?\n“There are ____ bananas on the table.”', ['three', '3'], gambar=[adegan('on', 'banana', n=3)], kisi='EN5a',
          konteks='Hitung pisang di atas meja satu per satu: ada tiga. “There are three bananas on the table” artinya “Ada tiga pisang di atas meja”. Boleh dijawab dengan huruf (three) atau angka (3). Latih berhitung dalam bahasa Inggris: one, two, three, four, five.'),
    # ---- uraian ----
    uraian('Nenekmu suka anggur.\n(a) Bu Guru bertanya, “Does your father like watermelon?” Ayahmu suka semangka. Tulis jawabanmu.\n(b) Tulis kalimat bahasa Inggris yang dimulai dengan “My grandmother ...”.',
           '(a) Yes, he does. (b) My grandmother likes grapes.',
           [['yes, he does', 'yes he does'], ['my grandmother likes', 'grandmother likes', 'my grandma likes', 'grandma likes']], minimal=2, kisi='EN2b',
           gambar=[img('man', label='ayah'), img('watermelon'), img('old-woman', label='nenek'), img('grapes')],
           bahas='father = laki-laki, jadi Yes, he does. My grandmother likes grapes.',
           konteks='Bagian (a): ayah adalah laki-laki, jadi he, dan kata kerjanya does. Bagian (b): “My grandmother” diikuti likes (pakai s) lalu benda yang disukai. Latih bercerita tentang kesukaan kakek dan nenek anak yang sebenarnya.'),
    uraian('Perhatikan gambar.\n“Where is the teddy bear?”\nTulis jawabanmu dalam kalimat bahasa Inggris yang dimulai dengan “It is ...”.',
           'It is behind the box.',
           [['it is', 'it\'s', 'the teddy bear is'], ['behind'], ['box']], minimal=3, kisi='EN4b',
           gambar=[adegan('behind', 'teddy-bear')],
           bahas='Hanya bagian atas boneka beruang yang terlihat dari balik kotak: It is behind the box.',
           konteks='Pada gambar, boneka beruang tersembunyi di balik kotak dan hanya bagian atas kepalanya yang terlihat. Itu behind (di belakang). Susun kalimat: It is + behind + the box. Bandingkan bila boneka berdampingan dengan kotak (next to) atau menutupinya (in front of).'),
    uraian('Perhatikan gambar. Hitung hewannya, lalu tulis kalimat bahasa Inggris yang dimulai dengan “There are ...” dan memakai “in front of”.',
           'There are three rabbits in front of the box.',
           [['there are'], ['three', '3'], ['rabbit', 'rabbits'], ['in front of', 'infront of']], minimal=4, kisi='EN5a',
           gambar=[adegan('front', 'rabbit-face', n=3)],
           bahas='Jumlah (three), benda (rabbits), tempat (in front of the box).',
           konteks='Kalimat “There are ...” butuh jumlah (three), benda jamak (rabbits, pakai s), dan tempat (in front of the box). Minta anak menghitung kelinci dulu, lalu menyusun tiga bagian itu menjadi satu kalimat.'),
]

# urut seperti lembar ujian: PG, B/S, isian, uraian; di dalam bagian mengikuti urutan indikator kisi-kisi
_URUT = {'pg': 0, 'bs': 1, 'isian': 2, 'uraian': 3}
PAKET = [sorted(p, key=lambda q: (_URUT[q['jenis']], q['kisi'])) for p in (paket1, paket2, paket3)]
