from _alat import *

S = 'aset/suara/'
TITIK, TANYA, SERU = '. (titik)', '? (tanda tanya)', '! (tanda seru)'

paket1 = [
    pg('Lonceng sekolah dipukul. Bunyinya ....', 'teng teng', ['guk guk', 'kukuruyuk'],
       gambar=[img('bell', label='lonceng')], kisi='BI1a'),
    pg('Dengarkan suaranya. Itu suara hewan apa?', img('cow-face', label='sapi'),
       [img('goat', label='kambing'), img('horse-face', label='kuda')],
       suara=S + 'sapi.mp3', bahas='Itu suara sapi: mooo.', kisi='BI1b'),
    pg('Aku makan nasi ...\nTanda baca yang tepat adalah ....', TITIK, [TANYA, SERU],
       bahas='Kalimat berita (memberi tahu) diakhiri titik (.).', kisi='BI2a'),
    pg('Kamu mau ke mana ...\nTanda baca yang tepat adalah ....', TANYA, [TITIK, SERU],
       bahas='Kalimat bertanya diakhiri tanda tanya (?).', kisi='BI2a'),
    pg('Kuman bisa membuat kita ....', 'sakit', ['kuat', 'pintar'],
       gambar=[img('microbe', label='kuman')], kisi='BI3a'),
    pg('Agar tangan bersih dari kuman, kita mencuci tangan dengan air dan ....', 'sabun', ['minyak', 'pasir'],
       gambar=[img('soap')], kisi='BI3b'),
    pg('Makanan mana yang sehat?', img('carrot', label='wortel'),
       [img('lollipop', label='permen'), img('french-fries', label='kentang goreng')], kisi='BI3c'),
    pg('Suku kata awal kata “bola” adalah ....', 'bo', ['ba', 'la'],
       gambar=[img('soccer-ball', label='bola')], bahas='bo-la: suku kata pertamanya bo.', kisi='BI3d'),
    isian('Lihat gambar. Anak itu sedang ....', ['berlari', 'lari', 'belari'],
          gambar=[img('person-running')], kisi='BI4a'),
    pg('Dalam permainan ular naga, anak-anak berbaris sambil memegang ....',
       'bahu teman di depannya', ['kaki teman', 'rambut teman'],
       bahas='Barisan ular naga dibuat dengan memegang bahu teman di depan.', kisi='BI4b'),
]

paket2 = [
    isian('Dengarkan suaranya. Tulis nama hewan itu.', ['ayam', 'ayam jago', 'jago', 'ayam jantan'],
          suara=S + 'ayam-jago.mp3', bahas='Itu suara ayam jago: kukuruyuk.', kisi='BI1b'),
    pg('Bunyi tik tok tik tok berasal dari ....', img('mantelpiece-clock', label='jam'),
       [img('umbrella', label='payung'), img('pencil', label='pensil')], kisi='BI1a'),
    pg('Awas, ada ular ...\nTanda baca yang tepat adalah ....', SERU, [TITIK, TANYA],
       gambar=[img('snake')], bahas='Kalimat peringatan (awas!) diakhiri tanda seru (!).', kisi='BI2a'),
    pg('Kata “kucing” dipisah menjadi suku kata ....', 'ku - cing', ['kuc - ing', 'k - ucing'],
       gambar=[img('cat-face', label='kucing')], kisi='BI2b'),
    pg('Kuman banyak terdapat di tempat yang ....', 'kotor', ['bersih', 'wangi'], kisi='BI3a'),
    pg('Agar gigi bersih, kita menggosok gigi dengan ....', img('toothbrush', label='sikat gigi'),
       [img('pencil', label='pensil'), img('sponge', label='spons')], kisi='BI3b'),
    isian('Buah dan sayur adalah makanan yang ....', ['sehat', 'bergizi', 'sehat dan bergizi'],
          gambar=[img('banana', label='pisang'), img('broccoli', label='brokoli')], kisi='BI3c'),
    isian('Katak bergerak dengan cara ....', ['melompat', 'lompat', 'meloncat', 'loncat', 'melompat-lompat'],
          gambar=[img('frog', label='katak')], kisi='BI4c'),
    isian('Dalam lomba tarik tambang, tali tambang ditarik atau didorong? Tulis jawabanmu.',
          ['ditarik', 'tarik', 'menarik', 'di tarik'], bahas='Tarik tambang: tali ditarik ke arah kita.', kisi='BI4d'),
    pg('Saat bermain bersama teman, kita harus ....', 'bergantian', ['berebut', 'curang'],
       bahas='Bermain dengan sopan berarti mau bergantian dan tidak curang.', kisi='BI4e'),
]

paket3 = [
    pg('Dengarkan bunyi ini. Hewan apa yang bersuara seperti itu?', img('dog-face', label='anjing'),
       [img('cat-face', label='kucing'), img('monkey-face', label='monyet')],
       suara=S + 'anjing.mp3', bahas='Itu suara anjing: guk guk.', kisi='BI1b'),
    isian('Hewan yang berbunyi kwek kwek adalah ....', ['bebek', 'itik', 'bebe'],
          bahas='Bebek (itik) berbunyi kwek kwek.', kisi='BI1b'),
    pg('Ibu pergi ke pasar ...\nTanda baca yang tepat adalah ....', TITIK, [TANYA, SERU],
       bahas='Kalimat yang memberi tahu diakhiri titik (.).', kisi='BI2a'),
    pg('Hore, kita menang ...\nTanda baca yang tepat adalah ....', SERU, [TITIK, TANYA],
       bahas='Kalimat yang menunjukkan rasa senang (hore!) diakhiri tanda seru (!).', kisi='BI2a'),
    pg('Makan dengan tangan kotor membuat kuman masuk ke tubuh. Kita bisa sakit ....', 'perut', ['rambut', 'kuku'],
       gambar=[img('microbe', label='kuman')], kisi='BI3a'),
    pg('Kita mandi dua kali sehari agar badan ....', 'bersih', ['kotor', 'bau'],
       gambar=[img('shower')], kisi='BI3b'),
    isian('Makanan ini terlalu manis. Makanan ini sehat atau tidak sehat? Tulis jawabanmu.',
          ['tidak sehat', 'tidak', 'tidak sehat.', 'tdk sehat', 'gak sehat', 'nggak sehat'],
          gambar=[img('candy', label='permen'), img('chocolate-bar', label='cokelat'), img('doughnut', label='donat')],
          bahas='Makanan terlalu manis tidak sehat dan merusak gigi.', kisi='BI3c'),
    pg('Gambar yang namanya diawali suku kata “ku” adalah ....', img('horse-face', label='kuda'),
       [img('cow-face', label='sapi'), img('goat', label='kambing')], bahas='ku-da diawali ku.', kisi='BI3d'),
    isian('Lihat gambar. Gerakan anak itu adalah ....', ['berenang', 'renang', 'bernang'],
          gambar=[img('person-swimming')], kisi='BI4a'),
    isian('Ular bergerak dengan cara ....', ['merayap', 'melata', 'rayap', 'merayap-rayap'],
          gambar=[img('snake', label='ular')], kisi='BI4c'),
]

PAKET = [paket1, paket2, paket3]
