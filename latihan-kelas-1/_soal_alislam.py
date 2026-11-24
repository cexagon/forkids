from _alat import *

# Kapal Nabi Nuh: lambung kayu, rumah di atas kapal, ombak
KAPAL = svg(
    '<path d="M10 128 Q40 116 70 128 T130 128 T190 128 T250 128" fill="none" stroke="#4A90C8" stroke-width="7" stroke-linecap="round"/>'
    f'<path d="M22 72 H218 L190 116 H50 Z" fill="#B5763C" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    f'<path d="M36 88 H204 M44 102 H196" stroke="{INK}" stroke-width="3"/>'
    f'<rect x="78" y="34" width="84" height="38" fill="#E9B872" stroke="{INK}" stroke-width="5"/>'
    f'<path d="M70 36 L120 12 L170 36 Z" fill="#C0392B" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    f'<rect x="92" y="46" width="16" height="14" fill="#fff" stroke="{INK}" stroke-width="3"/><rect x="132" y="46" width="16" height="14" fill="#fff" stroke="{INK}" stroke-width="3"/>',
    240, 140)

TERIMA_KASIH = ['terima kasih', 'terimakasih', 'makasih', 'terima kasih ya', 'makasih ya', 'jazakallah', 'jazakallahu khairan', 'jazakallah khairan', 'jazakillah']

paket1 = [
    isian('Huruf hijaiah ini dibaca ....', ['alif', 'alip'], gambar=[{'teks': 'ا'}],
          bahas='Huruf ini alif, huruf hijaiah yang pertama.', kisi='AI1a'),
    pg('Surah Al-Fatihah artinya ....', 'pembukaan', ['penutup', 'pertolongan'],
       bahas="Al-Fatihah artinya pembukaan, surah pertama dalam Al-Qur'an.", kisi='AI1b'),
    pg('Iman artinya ....', 'percaya', ['bermain', 'marah'],
       bahas='Iman artinya percaya dengan sepenuh hati.', kisi='AI2a'),
    pg("Ini adalah Al-Qur'an. Gambar ini mengingatkan kita untuk beriman kepada ....",
       'kitab Allah', ['malaikat', 'hari akhir'], gambar=[img('open-book', label="Al-Qur'an")], kisi='AI2b'),
    pg('Sebelum makan, kita membaca ....', 'Bismillahirrahmanirrahim',
       ["Alhamdulillahirabbil 'alamin", 'Astagfirullah'], gambar=[img('cooked-rice')],
       bahas='Sebelum makan kita membaca basmalah.', kisi='AI3a'),
    isian('Teman meminjamkan pensilnya kepadamu. Kamu mengucapkan ....', TERIMA_KASIH,
          gambar=[img('pencil')], bahas='Kita berterima kasih dengan santun, misalnya "terima kasih" atau "jazakallahu khairan".', kisi='AI3b'),
    pg('Di tempat ini kita mengerjakan Rukun Islam yang kedua, yaitu ....', 'salat', ['zakat', 'haji'],
       gambar=[img('mosque', label='masjid')],
       bahas='Rukun Islam: syahadat, salat, zakat, puasa Ramadan, haji. Yang kedua salat.', kisi='AI4a'),
    pg('Syahadat yang berisi pengakuan bahwa Nabi Muhammad adalah utusan Allah disebut syahadat ....',
       'rasul', ['tauhid', 'iman'],
       bahas='Syahadat tauhid: tiada Tuhan selain Allah. Syahadat rasul: Nabi Muhammad utusan Allah.', kisi='AI4b'),
    isian('Nabi pertama dan manusia pertama adalah Nabi ....', ['adam', 'nabi adam'],
          bahas='Nabi Adam adalah nabi pertama dari 25 nabi.', kisi='AI4c'),
    pg('Kapal besar ini mengingatkan kita pada mukjizat Nabi ....', 'Nuh', ['Musa', 'Ibrahim'], gambar=[KAPAL],
       bahas='Nabi Nuh membuat kapal besar yang menyelamatkan orang beriman dari banjir.', kisi='AI4d'),
]

paket2 = [
    pg('Lihat huruf hijaiah ini. Huruf ini dibaca ....', 'ba', ['ta', 'nun'], gambar=[{'teks': 'ب'}],
       bahas='Ba punya satu titik di bawah; ta punya dua titik di atas.', kisi='AI1a'),
    pg('Surah Al-Fatihah terdiri dari ... ayat.', '7', ['5', '10'],
       bahas='Al-Fatihah terdiri dari 7 ayat.', kisi='AI1b'),
    isian('Jumlah Rukun Iman ada ....', ['6', 'enam'],
          bahas='Rukun Iman ada 6: iman kepada Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar.', kisi='AI2a'),
    pg('Allah menurunkan kitab-kitab ini. Iman kepada kitab Allah adalah Rukun Iman urutan ke ....',
       '3', ['2', '4'], gambar=[img('green-book', n=4, label='Taurat, Zabur, Injil, Al-Qur\'an')],
       bahas='Urutan Rukun Iman: Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar. Kitab ada di urutan ketiga.', kisi='AI2b'),
    pg('Alhamdulillah artinya ....', 'segala puji bagi Allah', ['dengan nama Allah', 'Allah Maha Besar'],
       bahas='Alhamdulillah (hamdalah) artinya segala puji bagi Allah.', kisi='AI3a'),
    pg('Ibu memberimu kue. Sikap yang santun adalah ....', 'tersenyum dan berkata terima kasih',
       ['langsung pergi tanpa bicara', 'berteriak minta kue lagi'], gambar=[img('cookie')], kisi='AI3b'),
    isian('Pada bulan Ramadan, umat Islam menjalankan ibadah ....',
          ['puasa', 'berpuasa', 'puasa ramadan', 'puasa ramadhan', 'saum', 'shaum'],
          gambar=[img('crescent-moon')], bahas='Puasa Ramadan adalah Rukun Islam yang keempat.', kisi='AI4a'),
    pg('"Asyhadu an laa ilaaha illallah" adalah bacaan syahadat ....', 'tauhid', ['rasul', 'salat'],
       bahas='Asyhadu an laa ilaaha illallah artinya aku bersaksi tiada Tuhan selain Allah: syahadat tauhid.', kisi='AI4b'),
    isian('Nabi yang terakhir adalah Nabi ....', ['muhammad', 'nabi muhammad', 'muhamad', 'muhammad saw'],
          bahas='Nabi Muhammad adalah nabi terakhir dari 25 nabi.', kisi='AI4c'),
    pg('Nabi yang tidak terbakar oleh api adalah Nabi ....', 'Ibrahim', ['Nuh', 'Isa'], gambar=[img('fire')],
       bahas='Atas izin Allah, api menjadi dingin dan Nabi Ibrahim selamat.', kisi='AI4d'),
]

paket3 = [
    pg('Huruf hijaiah di bawah ini dibaca ....', 'jim', ['kha', 'dal'], gambar=[{'teks': 'ج'}],
       bahas='Jim punya satu titik di dalam bagian bawahnya; kha titiknya di atas.', kisi='AI1a'),
    pg("Bacaan \"Alhamdulillahirabbil 'alamin\" ada di dalam surah ....", 'Al-Fatihah', ['An-Nas', 'Al-Ikhlas'],
       bahas="Alhamdulillahirabbil 'alamin adalah ayat dalam surah Al-Fatihah.", kisi='AI1b'),
    isian('Rukun Iman yang keempat adalah iman kepada ....', ['rasul', 'para rasul', 'rasul allah', 'rasulullah', 'rasul-rasul', 'rasul-rasul allah', 'nabi dan rasul'],
          bahas='Urutan Rukun Iman: Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar.', kisi='AI2a'),
    pg('Matahari, bulan, dan bintang diciptakan oleh Allah. Gambar ini mengingatkan kita untuk beriman kepada ....',
       'Allah', ['malaikat', 'hari akhir'], gambar=[img('sun'), img('crescent-moon'), img('star')],
       bahas='Semua ciptaan ini menunjukkan kebesaran Allah, Rukun Iman yang pertama.', kisi='AI2b'),
    pg('Bismillahirrahmanirrahim artinya ....', 'dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
       ['segala puji bagi Allah', 'Allah Maha Besar'], kisi='AI3a'),
    isian('Kamu tidak sengaja menyenggol teman sampai bukunya jatuh. Kamu mengucapkan ....',
          ['maaf', 'minta maaf', 'mohon maaf', 'maafkan aku', 'maafkan saya', 'maaf ya'],
          bahas='Anak santun segera meminta maaf.', kisi='AI3b'),
    pg("Rukun Islam yang dikerjakan di Ka'bah, kota Mekah, adalah ....", 'haji', ['zakat', 'puasa'],
       gambar=[img('kaaba', label="Ka'bah")], bahas='Haji adalah Rukun Islam yang kelima, dikerjakan di Mekah.', kisi='AI4a'),
    pg('Bacaan syahadat rasul adalah ....', 'Wa asyhadu anna Muhammadar Rasulullah',
       ['Asyhadu an laa ilaaha illallah', "Alhamdulillahirabbil 'alamin"],
       bahas='Syahadat rasul berisi pengakuan bahwa Nabi Muhammad utusan Allah.', kisi='AI4b'),
    pg('Yang termasuk 25 nabi adalah ....', 'Nabi Yunus', ['Nabi Umar', 'Nabi Hasan'],
       bahas='Yunus termasuk 25 nabi. Umar adalah sahabat Nabi Muhammad, bukan nabi.', kisi='AI4c'),
    pg('Tongkat nabi ini bisa berubah menjadi ular atas izin Allah. Dia adalah Nabi ....', 'Musa', ['Ibrahim', 'Yunus'],
       gambar=[img('snake')], bahas='Mukjizat Nabi Musa: tongkatnya berubah menjadi ular dan dapat membelah laut.', kisi='AI4d'),
]

paket1 += [
    pg('Huruf hijaiah berikut dibaca ....', 'ta', ['ba', 'jim'], gambar=[{'teks': 'ت'}],
       bahas='Ta punya dua titik di atas; ba punya satu titik di bawah.', kisi='AI1a'),
    pg('Nama huruf hijaiah ini adalah ....', 'mim', ['nun', 'ha'], gambar=[{'teks': 'م'}],
       bahas='Huruf ini dibaca mim.', kisi='AI1a'),
    isian('Rukun Iman yang kedua adalah iman kepada ....', ['malaikat', 'malaikat allah', 'para malaikat', 'malaikat-malaikat allah', 'malaikat malaikat allah'],
          bahas='Urutan Rukun Iman: Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar.', kisi='AI2a'),
    pg('Ikan, burung, dan kupu-kupu adalah makhluk ciptaan Allah. Gambar ini mengingatkan kita untuk beriman kepada ....',
       'Allah', ['kitab Allah', 'hari akhir'], gambar=[img('fish'), img('bird'), img('butterfly')],
       bahas='Semua makhluk diciptakan Allah, jadi kita beriman kepada Allah, Rukun Iman yang pertama.', kisi='AI2b'),
    pg('Setelah makan roti, kita membaca ....', 'Alhamdulillah', ['Bismillah', 'Astagfirullah'], gambar=[img('bread')],
       bahas='Selesai makan kita bersyukur dengan hamdalah: Alhamdulillah.', kisi='AI3a'),
    pg('Kamu ingin minta tolong diambilkan susu oleh Ibu. Kata yang santun adalah ....',
       'Ibu, tolong ambilkan susu ya.', ['Ibu, ambilkan susu sekarang!', 'Ambil susu sana!'], gambar=[img('glass-of-milk')],
       bahas='Meminta dengan kata "tolong" dan nada lembut adalah sikap santun.', kisi='AI3b'),
    pg('Banyaknya Rukun Islam ada ... macam.', '5', ['4', '6'],
       bahas='Rukun Islam ada 5: syahadat, salat, zakat, puasa Ramadan, haji.', kisi='AI4a'),
    isian('Rukun Islam yang pertama adalah ....', ['syahadat', 'dua kalimat syahadat', 'membaca syahadat', 'mengucap syahadat', 'syahadatain'],
          bahas='Rukun Islam yang pertama adalah syahadat.', kisi='AI4a'),
    pg('Syahadat tauhid berarti kita bersaksi bahwa tidak ada Tuhan selain ....', 'Allah', ['nabi', 'sahabat'],
       bahas='Syahadat tauhid: Asyhadu an laa ilaaha illallah, tiada Tuhan selain Allah.', kisi='AI4b'),
    pg('Nabi Ismail adalah anak dari Nabi ....', 'Ibrahim', ['Nuh', 'Musa'],
       bahas='Nabi Ismail adalah putra Nabi Ibrahim.', kisi='AI4c'),
]

paket2 += [
    pg('Huruf yang ada di gambar dibaca ....', 'dal', ['ta', 'mim'], gambar=[{'teks': 'د'}],
       bahas='Huruf ini dibaca dal.', kisi='AI1a'),
    isian('Tulis nama huruf hijaiah ini: ....', ['ra', 'ro', 'raa'], gambar=[{'teks': 'ر'}],
          bahas='Huruf ini dibaca ra.', kisi='AI1a'),
    pg('Percaya kepada Allah dengan sepenuh hati disebut ....', 'iman', ['salat', 'puasa'],
       bahas='Iman artinya percaya. Kita beriman kepada Allah.', kisi='AI2a'),
    pg('Semangka, pisang, dan apel adalah ciptaan Allah. Gambar ini mengingatkan kita untuk beriman kepada ....',
       'Allah', ['hari akhir', 'rasul'], gambar=[img('watermelon'), img('banana'), img('red-apple')],
       bahas='Semua buah diciptakan Allah, jadi kita beriman kepada Allah.', kisi='AI2b'),
    pg('Setelah belajar kita bersyukur dengan membaca ....', 'Alhamdulillah', ['Bismillah', 'Astagfirullah'], gambar=[img('books')],
       bahas='Alhamdulillah (hamdalah) dibaca untuk bersyukur. Sebelum belajar kita membaca basmalah.', kisi='AI3a'),
    isian('Kamu ingin lewat di depan Pak Guru. Kata yang santun: "...., Pak."', ['permisi', 'misi', 'permisi pak'],
          gambar=[img('man-teacher')], bahas='Saat lewat di depan orang kita berkata "permisi".', kisi='AI3b'),
    pg('Rukun Islam yang ketiga adalah ....', 'zakat', ['salat', 'haji'], gambar=[img('coin')],
       bahas='Rukun Islam: syahadat, salat, zakat, puasa Ramadan, haji. Zakat urutan ketiga.', kisi='AI4a'),
    pg('Salat Subuh dikerjakan sebanyak ... rakaat.', '2', ['3', '4'], gambar=[img('sunrise')],
       bahas='Subuh 2 rakaat, Zuhur 4, Asar 4, Magrib 3, Isya 4.', kisi='AI4a'),
    pg('"Wa asyhadu anna Muhammadar Rasulullah" artinya ....', 'aku bersaksi Nabi Muhammad utusan Allah',
       ['aku bersaksi tiada Tuhan selain Allah', 'segala puji bagi Allah'],
       bahas='Syahadat rasul: aku bersaksi bahwa Nabi Muhammad adalah utusan Allah.', kisi='AI4b'),
    pg('Nabi yang wajib kita ketahui namanya ada ... orang.', '25', ['10', '15'],
       bahas='Ada 25 nabi dan rasul yang wajib kita ketahui.', kisi='AI4c'),
]

paket3 += [
    pg('Pilih bacaan huruf hijaiah di bawah ini ....', 'nun', ['mim', 'sin'], gambar=[{'teks': 'ن'}],
       bahas='Nun punya satu titik di atas.', kisi='AI1a'),
    isian('Huruf hijaiah apakah ini? Jawab: ....', ['lam', 'lām', 'lamm', 'laam'], gambar=[{'teks': 'ل'}],
          bahas='Huruf ini dibaca lam.', kisi='AI1a'),
    pg('Banyaknya Rukun Iman ada ... macam.', '6', ['4', '5'],
       bahas='Rukun Iman ada 6. Rukun Islam ada 5.', kisi='AI2a'),
    pg("Kitab suci Al-Qur'an diturunkan Allah kepada Nabi Muhammad saw. Gambar ini mengingatkan kita untuk beriman kepada ....",
       'kitab Allah', ['hari akhir', 'qada dan qadar'], gambar=[img('green-book', label="Al-Qur'an")],
       bahas='Iman kepada kitab Allah adalah Rukun Iman yang ketiga.', kisi='AI2b'),
    pg('Kalimat "Alhamdulillah" disebut ....', 'hamdalah', ['basmalah', 'syahadat'],
       bahas='Alhamdulillah disebut hamdalah. Bismillah disebut basmalah.', kisi='AI3a'),
    pg('Temanmu membantu mengangkat tasmu. Yang kamu lakukan adalah ....', 'berterima kasih', ['diam saja', 'pergi begitu saja'],
       gambar=[img('backpack')], bahas='Kita berterima kasih saat dibantu.', kisi='AI3b'),
    pg('Saat berpuasa Ramadan, kita menahan diri dari ....', 'makan dan minum', ['bernapas', 'berjalan'],
       bahas='Orang berpuasa menahan makan dan minum dari Subuh sampai Magrib.', kisi='AI4a'),
    isian('Salat Magrib dikerjakan sebanyak ... rakaat.', ['3', 'tiga'],
          bahas='Subuh 2, Zuhur 4, Asar 4, Magrib 3, Isya 4.', kisi='AI4a'),
    pg('Asyhadu an laa ilaaha illallah artinya ....', 'aku bersaksi tiada Tuhan selain Allah',
       ['aku bersaksi Nabi Muhammad utusan Allah', 'dengan nama Allah'],
       bahas='Syahadat tauhid: aku bersaksi tiada Tuhan selain Allah.', kisi='AI4b'),
    isian('Nabi yang diberi kitab Zabur adalah Nabi ....', ['daud', 'nabi daud', 'dawud'],
          bahas='Kitab Zabur diturunkan kepada Nabi Daud.', kisi='AI4c'),
]

from _kisi import KISI as _K
_o = {'pg': 0, 'bs': 1, 'isian': 2, 'uraian': 3}
_k = list(_K['alislam'])
paket1, paket2, paket3 = [sorted(p, key=lambda q: (_o[q['jenis']], _k.index(q['kisi']))) for p in (paket1, paket2, paket3)]

PAKET = [paket1, paket2, paket3]

# Seimbangkan letak kunci PG (a/b/c) agar tidak berpola: pindahkan jawaban benar soal-soal ini ke huruf tertentu.
def _geser(p, awal, huruf):
    k = 'abc'.index(huruf)
    for q in p:
        if q['jenis'] == 'pg' and q['tanya'].startswith(awal):
            j = q['jawab']; q['pilihan'][j], q['pilihan'][k] = q['pilihan'][k], q['pilihan'][j]; q['jawab'] = k
            return
    raise KeyError(awal)
_geser(PAKET[2], "Kitab suci Al-Qur'an diturunkan", 'c')
_geser(PAKET[2], 'Saat berpuasa Ramadan', 'c')
_geser(PAKET[2], 'Yang termasuk 25 nabi', 'c')
