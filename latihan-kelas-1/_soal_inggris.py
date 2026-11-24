from _alat import *

paket1 = [
    pg('Pagi hari bertemu Bu Guru, kita mengucapkan ....', 'Good morning', ['Good afternoon', 'Good night'],
       gambar=[img('sunrise', label='pagi')], kisi='EN1a'),
    pg('Ani bertemu teman baru dan berkata “Hi!”\nMaksud Ani adalah ....', 'menyapa teman', ['pamit pulang', 'minta tolong'],
       gambar=[img('waving-hand')], bahas='Hi = halo, kata untuk menyapa.', kisi='EN2'),
    pg('“How are you?”\nJawaban yang tepat adalah ....', 'I am fine, thank you', ['Good night', 'My name is Dina'],
       bahas='How are you? = Apa kabar? Dijawab I am fine, thank you.', kisi='EN1b'),
    pg('“What is your name?”\nJawaban yang tepat adalah ....', 'My name is Dina', ['I am fine', 'I have a bag'],
       bahas='What is your name? = Siapa namamu?', kisi='EN3b'),
    pg('Kata “your” pada “What is your name?” artinya ....', 'kamu (-mu)', ['dia', 'aku'], kisi='EN3c'),
    isian('“Eight” dalam bahasa Indonesia adalah ....', ['delapan', '8'], kisi='EN4a'),
    pg('How many apples?\nAda berapa apel?', 'five', ['seven', 'three'],
       gambar=[img('red-apple', n=5)], kisi='EN4b'),
    pg('I have two ....', 'bags', ['books', 'balls'],
       gambar=[img('backpack', n=2)], bahas='bags = tas.', kisi='EN5'),
    pg('Warna ini dalam bahasa Inggris adalah ....', 'purple', ['yellow', 'green'],
       gambar=[UNGU], bahas='Ungu = purple.', kisi='EN6'),
    pg('Pasangan kalimat dan artinya yang benar adalah ....', 'My name is Tono. = Namaku Tono.',
       ['My name is Tono. = Namamu Tono.', 'My name is Tono. = Namanya Tono.'],
       bahas='My name is ... = Namaku ....', kisi='EN3a'),
]

paket2 = [
    pg('Siang hari, Ani bertemu Bu Guru. Ani mengucapkan ....', 'Good afternoon', ['Good night', 'Good morning'],
       gambar=[img('sun', label='siang')], bahas='Good afternoon = selamat siang.', kisi='EN1a'),
    pg('“Hi” artinya ....', 'halo', ['selamat tinggal', 'terima kasih'],
       gambar=[img('waving-hand')], kisi='EN2'),
    pg('“My name is Dodi.” artinya ....', 'Namaku Dodi.', ['Temanku Dodi.', 'Adikku Dodi.'], kisi='EN3a'),
    pg('Bu Guru bertanya: “What is your name?”\nAli menjawab ....', 'My name is Ali.', ['I am fine.', 'I have a book.'],
       kisi='EN3b'),
    pg('Pasangan angka dan artinya yang benar adalah ....', 'six = enam', ['seven = delapan', 'nine = lima'],
       bahas='six = 6 (enam).', kisi='EN4a'),
    pg('Perhatikan. How many stars?\nAda berapa bintang?', 'seven', ['six', 'nine'],
       gambar=[img('star', n=7)], kisi='EN4b'),
    pg('Perhatikan. Bu Guru bertanya: “How are you, Ani?”\nAni menjawab ....', 'I am fine, thank you.', ['My name is Ani.', 'Good afternoon.'],
       bahas='How are you? = Apa kabar? Dijawab I am fine, thank you.', kisi='EN1b'),
    pg('Coba pilih. “I have three books.” artinya ....', 'Aku punya tiga buku.', ['Aku punya tiga tas.', 'Aku punya dua buku.'],
       gambar=[img('green-book', n=3)], kisi='EN5'),
    pg('Teliti ya. Pasangan kata dan artinya yang benar adalah ....', 'your book = bukumu', ['your book = bukuku', 'your book = bukunya'],
       bahas='your = kamu (-mu). your book = bukumu.', kisi='EN3c'),
    isian('“Purple” artinya warna ....', ['ungu', 'warna ungu'], kisi='EN6'),
]

paket3 = [
    pg('Malam hari, Budi pamit tidur kepada ayah. Budi mengucapkan ....', 'Good night', ['Good morning', 'Good afternoon'],
       gambar=[img('night-with-stars', label='malam')], bahas='Good night = selamat malam (sebelum tidur).', kisi='EN1a'),
    pg('Perhatikan. Dina bertanya: “How are you?”\nBudi menjawab ....', 'Fine, thank you.', ['Good night.', 'My name is Budi.'],
       kisi='EN1b'),
    pg('“Hi, I am Rina.” artinya ....', 'Halo, aku Rina.', ['Selamat tinggal, Rina.', 'Terima kasih, Rina.'],
       gambar=[img('girl'), img('waving-hand')], kisi='EN2'),
    pg('Kalimat untuk menyebutkan namamu adalah ....', 'My name is Sari.', ['I am fine.', 'Good morning.'],
       bahas='My name is ... = Namaku ....', kisi='EN3a'),
    pg('Teliti ya. “What is your name?”\nKata “your name” artinya ....', 'namamu', ['namaku', 'namanya'],
       bahas='your = kamu (-mu); name = nama. Jadi your name = namamu.', kisi='EN3c'),
    isian('Tulis arti “ten” dalam bahasa Indonesia.', ['sepuluh', '10'], kisi='EN4a'),
    pg('Perhatikan. How many balloons?\nAda berapa balon?', 'six', ['eight', 'four'],
       gambar=[img('balloon', n=6)], kisi='EN4b'),
    pg('Coba pilih. Rina berkata: “I have books.”\nRina punya ....', img('books', label='buku'),
       [img('backpack', label='tas'), img('pencil', label='pensil')], bahas='books = buku.', kisi='EN5'),
    pg('Pasangan pertanyaan dan jawaban yang benar adalah ....', 'What is your name? = My name is Budi.',
       ['What is your name? = I am fine.', 'What is your name? = Good night.'],
       bahas='What is your name? (Siapa namamu?) dijawab My name is ....', kisi='EN3b'),
    isian('Tulis arti “green” dalam bahasa Indonesia.', ['hijau', 'warna hijau'], kisi='EN6'),
]

def warna(c): return svg(f'<circle cx="120" cy="70" r="56" fill="{c}" stroke="{INK}" stroke-width="4"/>')

paket1 += [
    pg('Sore hari, Ayah pulang kerja. Ani menyapa Ayah, “....”', 'Good afternoon', ['Good morning', 'Good night'],
       gambar=[img('sun-behind-cloud', label='sore')], bahas='Good afternoon = selamat siang / sore.', kisi='EN1a'),
    pg('Sebelum tidur, Dina berkata kepada Ibu, “....”', 'Good night', ['Good morning', 'Good afternoon'],
       gambar=[img('sleeping-face', label='tidur')], bahas='Good night = selamat malam.', kisi='EN1a'),
    pg('Arti angka bahasa Inggris yang benar adalah ....', 'three = tiga', ['three = empat', 'three = dua'],
       bahas='three = 3 (tiga).', kisi='EN4a'),
    isian('Tulis arti “seven” dalam bahasa Indonesia.', ['tujuh', '7'], kisi='EN4a'),
    pg('How many bananas?\nAda berapa pisang?', 'four', ['six', 'two'],
       gambar=[img('banana', n=4)], kisi='EN4b'),
    pg('How many balls?\nAda berapa bola?', 'nine', ['five', 'ten'],
       gambar=[img('soccer-ball', n=9)], kisi='EN4b'),
    pg('Dina punya empat buku.\nDina berkata, “I have four ....”', 'books', ['bags', 'balls'],
       gambar=[img('green-book', n=4)], bahas='books = buku.', kisi='EN5'),
    isian('Tulis arti “red” dalam bahasa Indonesia.', ['merah', 'warna merah'], kisi='EN6'),
    isian('Tulis arti “blue” dalam bahasa Indonesia.', ['biru', 'warna biru'], kisi='EN6'),
    isian('Tulis arti “yellow” dalam bahasa Indonesia.', ['kuning', 'warna kuning'], kisi='EN6'),
]

paket2 += [
    pg('Perhatikan. Pagi hari, Rudi berangkat sekolah. Rudi menyapa Pak Satpam, “....”', 'Good morning', ['Good night', 'Good afternoon'],
       gambar=[img('school', label='sekolah')], bahas='Good morning = selamat pagi.', kisi='EN1a'),
    pg('Malam hari, Rina akan tidur. Rina berkata kepada Ayah, “....”', 'Good night', ['Good morning', 'Good afternoon'],
       gambar=[img('crescent-moon', label='malam')], bahas='Good night = selamat malam.', kisi='EN1a'),
    isian('Tulis arti “four” dalam bahasa Indonesia.', ['empat', '4'], kisi='EN4a'),
    isian('Tulis arti “nine” dalam bahasa Indonesia.', ['sembilan', '9'], kisi='EN4a'),
    pg('Ayo pilih. How many cupcakes?\nAda berapa kue mangkuk?', 'three', ['five', 'four'],
       gambar=[img('cupcake', n=3)], kisi='EN4b'),
    pg('How many ducks?\nAda berapa bebek?', 'ten', ['eight', 'nine'],
       gambar=[img('duck', n=10)], kisi='EN4b'),
    pg('“I have five bags.” artinya ....', 'Aku punya lima tas.', ['Aku punya lima buku.', 'Aku punya empat tas.'],
       gambar=[img('backpack', n=5)], bahas='bags = tas.', kisi='EN5'),
    pg('“White” dalam bahasa Indonesia adalah warna ....', 'putih', ['hitam', 'biru'],
       gambar=[warna('#FFFFFF')], bahas='White = putih.', kisi='EN6'),
    isian('Tulis arti “orange” sebagai warna dalam bahasa Indonesia.', ['jingga', 'oranye', 'oren', 'warna jingga', 'warna oranye', 'warna oren'], kisi='EN6'),
    isian('“Green” artinya warna ....', ['hijau', 'warna hijau'], kisi='EN6'),
]

paket3 += [
    pg('Perhatikan. Pagi hari, Dodi bertemu Bu Guru di depan kelas. Dodi berkata, “....”', 'Good morning', ['Good night', 'Good afternoon'],
       gambar=[img('man-teacher', label='guru')], bahas='Good morning = selamat pagi.', kisi='EN1a'),
    pg('Siang hari, Tono bertemu Pak Guru di jalan. Tono berkata, “....”', 'Good afternoon', ['Good morning', 'Good night'],
       gambar=[img('sun', label='siang')], bahas='Good afternoon = selamat siang.', kisi='EN1a'),
    pg('Pilih angka dan arti yang cocok ....', 'one = satu', ['one = dua', 'one = sepuluh'],
       bahas='one = 1 (satu).', kisi='EN4a'),
    isian('Tulis arti “two” dalam bahasa Indonesia.', ['dua', '2'], kisi='EN4a'),
    pg('Ayo pilih. How many butterflies?\nAda berapa kupu-kupu?', 'five', ['four', 'seven'],
       gambar=[img('butterfly', n=5)], kisi='EN4b'),
    pg('How many carrots?\nAda berapa wortel?', 'eight', ['six', 'nine'],
       gambar=[img('carrot', n=8)], kisi='EN4b'),
    pg('“I have six bags.” artinya ....', 'Aku punya enam tas.', ['Aku punya enam buku.', 'Aku punya empat tas.'],
       gambar=[img('backpack', n=6)], bahas='bags = tas.', kisi='EN5'),
    pg('Apel itu berwarna merah.\n“Merah” dalam bahasa Inggris adalah ....', 'red', ['blue', 'green'],
       gambar=[img('red-apple')], bahas='Merah = red.', kisi='EN6'),
    isian('Tulis arti “black” dalam bahasa Indonesia.', ['hitam', 'warna hitam'], kisi='EN6'),
    isian('Tulis arti “brown” dalam bahasa Indonesia.', ['cokelat', 'coklat', 'warna cokelat', 'warna coklat'], kisi='EN6'),
]

_KODE = ['EN1a','EN1b','EN2','EN3a','EN3b','EN3c','EN4a','EN4b','EN5','EN6']
_JENIS = {'pg': 0, 'bs': 1, 'isian': 2, 'uraian': 3}
for _p in (paket1, paket2, paket3):
    _p.sort(key=lambda q: (_JENIS[q['jenis']], _KODE.index(q['kisi'])))

PAKET = [paket1, paket2, paket3]
