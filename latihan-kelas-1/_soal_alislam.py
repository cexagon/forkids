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

TERIMA_KASIH = ['terima kasih', 'terimakasih', 'makasih', 'jazakallah', 'jazakallahu khairan', 'jazakillah']

paket1 = [
    isian('Huruf hijaiah ini dibaca ....', ['alif', 'alip'], gambar=[{'teks': 'ا'}],
          bahas='Huruf ini alif, huruf hijaiah yang pertama.', kisi='AI1a'),
    pg('Surah Al-Fatihah artinya ....', 'pembukaan', ['penutup', 'pertolongan'],
       bahas="Al-Fatihah artinya pembukaan, surah pertama dalam Al-Qur'an.", kisi='AI1b'),
    pg('Iman artinya ....', 'percaya', ['bermain', 'marah'],
       bahas='Iman artinya percaya dengan sepenuh hati.', kisi='AI2a'),
    pg("Al-Qur'an adalah kitab Allah. Gambar ini mengingatkan kita untuk beriman kepada ....",
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
    isian('Rukun Iman yang keempat adalah iman kepada ....', ['rasul', 'para rasul', 'rasul allah', 'rasulullah', 'rasul-rasul'],
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
    pg('Bacaan syahadat rasul adalah ....', 'wa asyhadu anna Muhammadar rasulullah',
       ['Asyhadu an laa ilaaha illallah', "Alhamdulillahirabbil 'alamin"],
       bahas='Syahadat rasul berisi pengakuan bahwa Nabi Muhammad utusan Allah.', kisi='AI4b'),
    pg('Yang termasuk 25 nabi adalah ....', 'Nabi Yunus', ['Nabi Umar', 'Nabi Hasan'],
       bahas='Yunus termasuk 25 nabi. Umar adalah sahabat Nabi Muhammad, bukan nabi.', kisi='AI4c'),
    pg('Tongkat nabi ini bisa berubah menjadi ular atas izin Allah. Dia adalah Nabi ....', 'Musa', ['Ibrahim', 'Yunus'],
       gambar=[img('snake')], bahas='Mukjizat Nabi Musa: tongkatnya berubah menjadi ular dan dapat membelah laut.', kisi='AI4d'),
]

PAKET = [paket1, paket2, paket3]
