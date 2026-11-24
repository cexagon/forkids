from _alat import *

S = 'aset/suara/'
TITIK, TANYA, SERU = '. (titik)', '? (tanda tanya)', '! (tanda seru)'

paket1 = [
    # --- PG ---
    pg('Lonceng sekolah dipukul. Bunyinya ....', 'teng teng', ['guk guk', 'kukuruyuk'],
       gambar=[img('bell', label='lonceng')], kisi='BI1a'),
    pg('Dengarkan suaranya. Itu suara hewan apa?', img('cow-face', label='sapi'),
       [img('goat', label='kambing'), img('horse-face', label='kuda')],
       suara=S + 'sapi.mp3', bahas='Itu suara sapi: mooo.', kisi='BI1b'),
    pg('Aku makan nasi ...\nTanda baca yang tepat adalah ....', TITIK, [TANYA, SERU],
       bahas='Kalimat berita (memberi tahu) diakhiri titik (.).', kisi='BI2a'),
    pg('Siapa namamu ...\nTanda baca yang tepat adalah ....', TANYA, [TITIK, SERU],
       bahas='Kalimat pertanyaan diakhiri tanda tanya (?).', kisi='BI2a'),
    pg('Wah, bunganya cantik sekali ...\nTanda baca yang tepat adalah ....', SERU, [TITIK, TANYA],
       bahas='Kalimat yang menunjukkan rasa kagum diakhiri tanda seru (!).', kisi='BI2a'),
    pg('Kata “meja” dipisah menjadi suku kata ....', 'me - ja', ['mej - a', 'm - eja'],
       bahas='meja = me - ja (2 suku kata).', kisi='BI2b'),
    pg('Kuman bisa membuat kita ....', 'sakit', ['kuat', 'pintar'],
       gambar=[img('microbe', label='kuman')], kisi='BI3a'),
    pg('Kuman ukurannya sangat ....', 'kecil', ['besar', 'tinggi'],
       gambar=[img('microbe', label='kuman')],
       bahas='Kuman sangat kecil, jadi sulit dilihat dengan mata biasa.', kisi='BI3a'),
    pg('Agar tangan bersih dari kuman, kita mencuci tangan dengan air dan ....', 'sabun', ['minyak', 'pasir'],
       gambar=[img('soap')], kisi='BI3b'),
    pg('Kuku yang panjang dan kotor harus ....', 'dipotong', ['dibiarkan', 'digigit'],
       gambar=[img('hand-with-fingers-splayed', label='tangan')],
       bahas='Kuku panjang menyimpan kuman, jadi harus dipotong agar bersih.', kisi='BI3b'),
    pg('Makanan mana yang sehat?', img('carrot', label='wortel'),
       [img('lollipop', label='permen'), img('french-fries', label='kentang goreng')], kisi='BI3c'),
    pg('Suku kata awal kata “bola” adalah ....', 'bo', ['ba', 'la'],
       gambar=[img('soccer-ball', label='bola')], bahas='bo-la: suku kata pertamanya bo.', kisi='BI3d'),
    pg('Suku kata awal kata “sapi” adalah ....', 'sa', ['pi', 'si'],
       gambar=[img('cow-face', label='sapi')], bahas='sa-pi: suku kata pertamanya sa.', kisi='BI3d'),
    pg('Dalam permainan ular naga, anak-anak berbaris sambil memegang ....',
       'bahu teman di depannya', ['kaki teman', 'rambut teman'],
       bahas='Barisan ular naga dibuat dengan memegang bahu teman di depan.', kisi='BI4b'),
    pg('Kamu kalah saat bermain dengan teman. Sikap yang sopan adalah ....', 'tetap tenang dan tidak marah', ['memukul teman', 'merusak mainan'],
       bahas='Bermain dengan sopan berarti tidak marah ketika kalah.', kisi='BI4e'),
    # --- ISIAN ---
    isian('Dengarkan suaranya. Hewan itu adalah ....', ['ayam', 'ayam jago', 'jago', 'ayam jantan'],
          gambar=[img('speaker-high-volume', label='dengarkan')],
          suara=S + 'ayam-jago.mp3', bahas='Itu suara ayam jago: kukuruyuk.', kisi='BI1b'),
    isian('Susu membuat tulang kuat. Susu adalah minuman yang ....', ['sehat', 'bergizi', 'menyehatkan', 'sehat dan bergizi'],
          gambar=[img('glass-of-milk', label='susu')],
          bahas='Susu adalah minuman sehat.', kisi='BI3c'),
    isian('Lihat gambar. Anak itu sedang ....', ['berlari', 'lari', 'belari', 'berlari-lari', 'lari-lari'],
          gambar=[img('person-running')], kisi='BI4a'),
    isian('Burung bergerak di udara dengan cara ....', ['terbang', 'terbang-terbang', 'berterbangan'],
          gambar=[img('bird', label='burung')], kisi='BI4c'),
    isian('Rina memegang tali mobil mainan, lalu berjalan mundur. Mobil itu bergerak mendekat karena ... oleh Rina.',
          ['ditarik', 'tarik', 'menarik', 'di tarik'], gambar=[img('person-walking', label='Rina')],
          bahas='Benda yang bergerak mendekat ke arah kita berarti ditarik. Kalau menjauh, berarti didorong.', kisi='BI4d'),
]

paket2 = [
    # --- PG ---
    pg('Pagi hari, ayam jago berkokok. Bunyinya ....', 'kukuruyuk', ['mbek mbek', 'miaw'],
       gambar=[img('rooster', label='ayam jago')], kisi='BI1a'),
    pg('Hewan apa yang suaranya seperti ini?', img('cat-face', label='kucing'),
       [img('rabbit-face', label='kelinci'), img('duck', label='bebek')],
       suara=S + 'kucing.mp3', bahas='Itu suara kucing: miaw.', kisi='BI1b'),
    pg('Awas, ada ular ...\nTanda baca yang tepat adalah ....', SERU, [TITIK, TANYA],
       gambar=[img('snake')], bahas='Kalimat peringatan (awas!) diakhiri tanda seru (!).', kisi='BI2a'),
    pg('Adik tidur di kamar ...\nTanda baca yang tepat adalah ....', TITIK, [TANYA, SERU],
       bahas='Kalimat berita diakhiri titik (.).', kisi='BI2a'),
    pg('Kamu mau makan apa ...\nTanda baca yang tepat adalah ....', TANYA, [TITIK, SERU],
       bahas='Kalimat pertanyaan diakhiri tanda tanya (?).', kisi='BI2a'),
    pg('Kata “kucing” dipisah menjadi suku kata ....', 'ku - cing', ['kuc - ing', 'k - ucing'],
       gambar=[img('cat-face', label='kucing')], kisi='BI2b'),
    pg('Kuman banyak terdapat di tempat yang ....', 'kotor', ['bersih', 'wangi'], kisi='BI3a'),
    pg('Adi sakit karena kuman. Ibu mengajak Adi pergi ke ....', 'dokter', ['pasar', 'lapangan'],
       gambar=[img('face-with-medical-mask', label='Adi')],
       bahas='Orang yang sakit perlu diperiksa dokter.', kisi='BI3a'),
    pg('Agar gigi bersih, kita menggosok gigi dengan ....', img('toothbrush', label='sikat gigi'),
       [img('pencil', label='pensil'), img('sponge', label='spons')], kisi='BI3b'),
    pg('Sebelum makan, kita wajib mencuci ....', 'tangan', ['sepatu', 'tas'],
       gambar=[img('soap')], bahas='Mencuci tangan sebelum makan membuang kuman.', kisi='BI3b'),
    pg('Pilih makanan yang menyehatkan badan.', img('red-apple', label='apel'),
       [img('doughnut', label='donat'), img('candy', label='permen')], kisi='BI3c'),
    pg('Gambar yang namanya diawali suku kata “ku” adalah ....', img('horse-face', label='kuda'),
       [img('cow-face', label='sapi'), img('goat', label='kambing')], bahas='ku-da diawali ku.', kisi='BI3d'),
    pg('Suku kata awal kata “kelinci” adalah ....', 'ke', ['li', 'ci'],
       gambar=[img('rabbit-face', label='kelinci')], bahas='ke-lin-ci: suku kata pertamanya ke.', kisi='BI3d'),
    pg('Anak-anak bermain ular naga sambil berbaris dan ....', 'bernyanyi', ['tidur', 'makan'],
       bahas='Ular naga dimainkan sambil berbaris dan bernyanyi bersama.', kisi='BI4b'),
    pg('Saat bermain bersama teman, kita harus ....', 'bergantian', ['berebut', 'curang'],
       bahas='Bermain dengan sopan berarti mau bergantian dan tidak curang.', kisi='BI4e'),
    # --- ISIAN ---
    isian('Hewan yang bersuara “mbek mbek” adalah ....', ['kambing', 'domba', 'biri-biri'],
          bahas='Kambing bersuara mbek mbek.', kisi='BI1b'),
    isian('Buah dan sayur adalah makanan yang ....', ['sehat', 'bergizi', 'sehat dan bergizi'],
          gambar=[img('banana', label='pisang'), img('broccoli', label='brokoli')], kisi='BI3c'),
    isian('Lihat gambar. Gerakan anak itu adalah ....', ['berenang', 'renang', 'bernang'],
          gambar=[img('person-swimming')], kisi='BI4a'),
    isian('Katak bergerak dengan cara ....', ['melompat', 'lompat', 'meloncat', 'loncat', 'melompat-lompat'],
          gambar=[img('frog', label='katak')], kisi='BI4c'),
    isian('Ibu berdiri di belakang troli belanja. Agar troli maju, troli itu ... oleh ibu.',
          ['didorong', 'dorong', 'mendorong', 'di dorong'], gambar=[img('shopping-cart', label='troli')],
          bahas='Benda di depan kita yang kita gerakkan menjauh berarti didorong. Kalau ditarik, benda mendekat ke arah kita.', kisi='BI4d'),
]

paket3 = [
    # --- PG ---
    pg('Bunyi tik tok tik tok berasal dari ....', img('mantelpiece-clock', label='jam'),
       [img('umbrella', label='payung'), img('pencil', label='pensil')], kisi='BI1a'),
    pg('Dengarkan bunyi ini. Hewan apa yang bersuara seperti itu?', img('dog-face', label='anjing'),
       [img('cat-face', label='kucing'), img('monkey-face', label='monyet')],
       suara=S + 'anjing.mp3', bahas='Itu suara anjing: guk guk.', kisi='BI1b'),
    pg('Hore, kita menang ...\nTanda baca yang tepat adalah ....', SERU, [TITIK, TANYA],
       bahas='Kalimat yang menunjukkan rasa senang (hore!) diakhiri tanda seru (!).', kisi='BI2a'),
    pg('Ayah membaca koran di teras ...\nTanda baca yang tepat adalah ....', TITIK, [TANYA, SERU],
       bahas='Kalimat berita diakhiri titik (.).', kisi='BI2a'),
    pg('Di mana tasku ...\nTanda baca yang tepat adalah ....', TANYA, [TITIK, SERU],
       bahas='Kalimat pertanyaan diakhiri tanda tanya (?).', kisi='BI2a'),
    pg('Kata “buku” dipisah menjadi suku kata ....', 'bu - ku', ['b - uku', 'buk - u'],
       gambar=[img('green-book', label='buku')], bahas='buku = bu - ku (2 suku kata).', kisi='BI2b'),
    pg('Makan dengan tangan kotor membuat kuman masuk ke tubuh. Kita bisa sakit ....', 'perut', ['rambut', 'kuku'],
       gambar=[img('microbe', label='kuman')], kisi='BI3a'),
    pg('Luka yang kotor bisa dimasuki kuman. Luka itu harus ....', 'dibersihkan', ['dibiarkan', 'digaruk'],
       bahas='Luka dibersihkan agar kuman tidak masuk.', kisi='BI3a'),
    pg('Kita mandi dua kali sehari agar badan ....', 'bersih', ['kotor', 'bau'],
       gambar=[img('shower')], kisi='BI3b'),
    pg('Agar rambut bersih dan tidak gatal, kita keramas memakai ....', 'sampo', ['odol', 'minyak goreng'],
       bahas='Keramas dengan sampo membuat rambut bersih dan tidak gatal.', kisi='BI3b'),
    pg('Kita makan sayur dan buah agar badan ....', 'sehat', ['sakit', 'lemas'],
       gambar=[img('broccoli', label='brokoli'), img('red-apple', label='apel')],
       bahas='Sayur dan buah adalah makanan sehat.', kisi='BI3c'),
    pg('Suku kata awal kata “mata” adalah ....', 'ma', ['ta', 'mat'],
       gambar=[img('eye', label='mata')], bahas='ma-ta: suku kata pertamanya ma.', kisi='BI3d'),
    pg('Gambar yang namanya diawali suku kata “ba” adalah ....', img('balloon', label='balon'),
       [img('carrot', label='wortel'), img('kite', label='layang-layang')],
       bahas='ba-lon diawali ba.', kisi='BI3d'),
    pg('Ular naga adalah permainan yang dimainkan bersama ....', 'banyak teman', ['seekor ular', 'satu teman saja'],
       bahas='Ular naga dimainkan oleh banyak anak yang berbaris dan bernyanyi bersama.', kisi='BI4b'),
    pg('Kita mau meminjam mainan teman. Kita berkata dengan sopan, ....', 'Boleh aku pinjam?', ['Berikan padaku!', 'Sini, punyaku!'],
       bahas='Meminjam dengan sopan: minta izin dulu.', kisi='BI4e'),
    # --- ISIAN ---
    isian('Hewan yang bersuara “kwek kwek” adalah ....', ['bebek', 'itik'],
          bahas='Bebek bersuara kwek kwek.', kisi='BI1b'),
    isian('Makanan ini terlalu manis. Makanan ini sehat atau tidak sehat? Tulis jawabanmu.',
          ['tidak sehat', 'tidak', 'tidak sehat.', 'tdk sehat', 'gak sehat', 'nggak sehat'],
          gambar=[img('candy', label='permen'), img('chocolate-bar', label='cokelat'), img('doughnut', label='donat')],
          bahas='Makanan terlalu manis tidak sehat dan merusak gigi.', kisi='BI3c'),
    isian('Perhatikan gambar. Anak itu sedang ....', ['memanjat', 'panjat', 'memanjat-manjat', 'naik'],
          gambar=[img('person-climbing')], kisi='BI4a'),
    isian('Ular bergerak dengan cara ....', ['merayap', 'melata', 'rayap', 'merayap-rayap'],
          gambar=[img('snake', label='ular')], kisi='BI4c'),
    isian('Kakak memegang gagang pintu, lalu membuka pintu ke arah badannya. Pintu itu ... oleh kakak.',
          ['ditarik', 'tarik', 'menarik', 'di tarik'], gambar=[img('door', label='pintu')],
          bahas='Benda yang bergerak mendekat ke arah kita berarti ditarik.', kisi='BI4d'),
]

PAKET = [paket1, paket2, paket3]

# Seimbangkan letak kunci PG (a/b/c) agar tidak berpola: pindahkan jawaban benar soal-soal ini ke huruf tertentu.
def _geser(p, awal, huruf):
    k = 'abc'.index(huruf)
    for q in p:
        if q['jenis'] == 'pg' and q['tanya'].startswith(awal):
            j = q['jawab']; q['pilihan'][j], q['pilihan'][k] = q['pilihan'][k], q['pilihan'][j]; q['jawab'] = k
            return
    raise KeyError(awal)
_geser(PAKET[0], 'Siapa namamu', 'c')
_geser(PAKET[0], 'Agar tangan bersih dari kuman', 'c')
_geser(PAKET[0], 'Suku kata awal kata “sapi”', 'c')
_geser(PAKET[0], 'Kuman ukurannya sangat', 'c')
