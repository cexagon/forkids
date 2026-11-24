"""Modul "Belajar dulu" PJOK kelas 2: satu atau lebih kartu per indikator PJ1-PJ5 (urutan mengikuti _kisi.py)."""
import re
from _alat import *
from _soal_pjok import (TEGAK, SATU_KAKI, DUDUK_TANGAN, JONGKOK, MERANGKAK, MUNDUR, MELIUK)


def lab(g, t):
    """Beri label pada gambar. Gambar svg tidak menampilkan 'label' di latihan.js,
    jadi teks label digambar langsung di bawah figur (viewBox diperpanjang) dan dipakai sebagai aria-label."""
    d = dict(g); d['label'] = t
    if 'svg' in d:
        m = re.search(r'viewBox="0 0 (\d+) (\d+)"', d['svg'])
        w, h = int(m.group(1)), int(m.group(2))
        fs = min(16, (w - 12) / (len(t) * 0.6))
        txt = (f'<text x="{w // 2}" y="{h + 20}" text-anchor="middle" font-size="{fs:.1f}" font-weight="800" '
               f'fill="{INK}" font-family="sans-serif">{t}</text>')
        sv = d['svg'].replace(m.group(0), f'viewBox="0 0 {w} {h + 28}" aria-label="{t}"', 1)
        d['svg'] = sv.replace('</svg>', txt + '</svg>')
    return d


MATERI = [
    # ---------------- PJ1: gerak dasar ----------------
    {'kisi': 'PJ1',
     'judul': 'Tiga gerak dasar',
     'isi': ['Badan kita bisa bergerak dengan banyak cara.',
             'Ada tiga gerak dasar: lokomotor, nonlokomotor, dan manipulatif.',
             'Lokomotor: badan berpindah tempat. Nonlokomotor: badan bergerak di tempat.',
             'Manipulatif: badan bergerak sambil memakai benda, misalnya bola.'],
     'gambar': [lab(BERLARI, 'lokomotor'), lab(JONGKOK, 'nonlokomotor'), img('soccer-ball', label='manipulatif')],
     'contoh': [{'teks': 'Berlari dari pintu ke pagar: badan pindah tempat, jadi lokomotor.'},
                {'teks': 'Berjongkok lalu berdiri di tempat yang sama: nonlokomotor.'},
                {'teks': 'Melempar bola: memakai benda, jadi manipulatif.'}],
     'ingat': 'Lokomotor berpindah tempat, nonlokomotor di tempat, manipulatif memakai benda.',
     'ortu': 'Peragakan ketiganya bergantian lalu tanyakan, "Tadi badanmu pindah tempat atau tidak? Pakai benda atau tidak?" '
             'Kata kunci "pindah", "di tempat", dan "benda" membantu anak membedakan.'},
    {'kisi': 'PJ1',
     'judul': 'Gerak lokomotor',
     'isi': ['Lokomotor artinya gerak yang membuat badan berpindah tempat.',
             'Contohnya berjalan, berlari, melompat, merangkak, dan berjalan mundur.',
             'Berjalan mundur tetap lokomotor karena badan pindah, hanya arahnya ke belakang.',
             'Merangkak memakai tangan dan lutut, seperti adik bayi.'],
     'gambar': [lab(BERLARI, 'berlari'), lab(MELOMPAT, 'melompat'), lab(MERANGKAK, 'merangkak'), lab(MUNDUR, 'jalan mundur')],
     'contoh': [{'teks': 'Melompat: kaki menolak lantai, badan terangkat, lalu mendarat di tempat lain.'},
                {'teks': 'Berjalan mundur: panah menunjuk ke belakang. Melangkahlah pelan-pelan dan hati-hati agar tidak jatuh.'}],
     'ingat': 'Berjalan, berlari, melompat, merangkak, dan berjalan mundur adalah gerak lokomotor.',
     'ortu': 'Beri tantangan berpindah dari ujung ruang ke ujung lain dengan cara berbeda: jalan, lari kecil, lompat, merangkak. '
             'Untuk berjalan mundur, pilih tempat lapang dan aman, dan minta anak melangkah pelan.'},
    {'kisi': 'PJ1',
     'judul': 'Gerak nonlokomotor',
     'isi': ['Nonlokomotor artinya gerak yang dilakukan di tempat, tanpa berpindah.',
             'Contohnya berjongkok, berdiri, membungkuk, meliukkan badan, dan mengayunkan tangan.',
             'Kakimu tetap di tempat yang sama, hanya badan yang bergerak.'],
     'gambar': [lab(JONGKOK, 'berjongkok'), lab(MELIUK, 'meliuk'), lab(TEGAK, 'berdiri')],
     'contoh': [{'teks': 'Meliukkan badan ke kiri dan ke kanan sambil tetap berdiri di satu titik.'}],
     'ingat': 'Nonlokomotor: bergerak di tempat, misalnya jongkok, berdiri, membungkuk, dan meliuk.',
     'ortu': 'Minta anak berdiri di satu titik, lalu sebutkan gerakan satu per satu: membungkuk, meliuk, mengayun tangan, berjongkok. '
             'Tanyakan, "Apakah kakimu pindah?" Bila tidak pindah, itu nonlokomotor.'},
    {'kisi': 'PJ1',
     'judul': 'Gerak manipulatif',
     'isi': ['Manipulatif artinya gerak yang memakai atau memainkan benda.',
             'Contohnya melempar, menangkap, menendang, dan memukul bola.',
             'Menangkap bola: mata melihat bola, lalu kedua tangan menerimanya.',
             'Dalam permainan bola berkelompok, kita melempar dan menangkap bergantian bersama teman.'],
     'gambar': [img('soccer-ball', label='sepak bola'), img('basketball', label='bola basket')],
     'contoh': [{'teks': 'Ayah melempar bola, kamu menerimanya dengan kedua tangan. Itu gerak menangkap.'}],
     'ingat': 'Gerak manipulatif memakai benda, misalnya melempar, menangkap, dan menendang bola.',
     'ortu': 'Main lempar tangkap dengan bola kecil atau gulungan kaus kaki. Tanyakan, "Tanganmu memegang apa? Apa nama geraknya saat bola datang?" '
             'Pastikan anak memakai kata kerja yang tepat: melempar, menangkap, menendang.'},
    {'kisi': 'PJ1',
     'judul': 'Menjaga keseimbangan',
     'isi': ['Keseimbangan artinya badan tetap stabil dan tidak mudah jatuh.',
             'Saat berdiri satu kaki, kaki yang di lantai menjadi tumpuan.',
             'Rentangkan kedua tangan ke samping agar badan seimbang, dan lihat satu titik di depan.',
             'Pada duduk bertumpu tangan, kedua tangan menahan badan di lantai.'],
     'gambar': [lab(SATU_KAKI, 'satu kaki'), lab(DUDUK_TANGAN, 'duduk bertumpu tangan')],
     'contoh': [{'teks': 'Berjalan di garis lurus seperti titian: tangan terentang, mata ke depan, langkah pelan.'},
                {'teks': 'Duduk bertumpu tangan: kaki lurus, badan condong ke belakang, tangan menahan di lantai.'}],
     'ingat': 'Tangan terentang, mata menatap satu titik, dan kaki sebagai tumpuan membantu badan seimbang.',
     'ortu': 'Buat garis selotip di lantai dan ajak anak berjalan di atasnya, lalu berdiri satu kaki. Coba dengan tangan diturunkan dan dengan tangan terentang, '
             'agar ia merasakan bedanya. Latih juga duduk bertumpu tangan.'},

    # ---------------- PJ2: gerak berirama ----------------
    {'kisi': 'PJ2',
     'judul': 'Gerak berirama',
     'isi': ['Gerak berirama adalah gerak yang mengikuti irama atau ketukan musik.',
             'Musik pelan dibalas gerakan pelan. Musik cepat dibalas gerakan cepat.',
             'Senam dan menari adalah contoh gerak berirama.',
             'Bila bergerak bersama, semua mengikuti ketukan yang sama agar terlihat kompak.'],
     'gambar': [img('musical-note', label='musik'), img('drum', label='ketukan'), lab(MELIUK, 'meliuk')],
     'contoh': [{'teks': 'Lagu pelan: ayunkan tangan pelan-pelan. Lagu cepat: hentakkan kaki dengan cepat.'}],
     'ingat': 'Gerak berirama mengikuti ketukan musik: pelan untuk musik pelan, cepat untuk musik cepat.',
     'ortu': 'Putar satu lagu pelan dan satu lagu cepat, lalu ajak anak bergerak mengikutinya. Tanyakan apa yang berubah pada gerakannya saat lagu berganti.'},
    {'kisi': 'PJ2',
     'judul': 'Anggota tubuh saat menari',
     'isi': ['Saat bergerak mengikuti musik, banyak bagian tubuh yang ikut bergerak.',
             'Tangan melambai, kaki melangkah atau menghentak, dan kepala mengangguk.',
             'Badan, pinggang, dan bahu juga bisa bergoyang mengikuti irama.'],
     'gambar': [lab(MELIUK, 'meliuk'), img('person-cartwheeling', label='gerak lincah')],
     'ingat': 'Tangan, kaki, kepala, dan badan bergerak mengikuti irama musik.',
     'ortu': 'Putar lagu riang, lalu minta anak berhenti sejenak dan menunjuk sambil menyebut bagian tubuh yang tadi bergerak. '
             'Ulangi sampai ia bisa menyebut tiga atau lebih.'},

    # ---------------- PJ3: kebugaran dan hidup sehat ----------------
    {'kisi': 'PJ3',
     'judul': 'Bersepeda dan lari kecil',
     'isi': ['Kebugaran jasmani artinya badan kuat dan tidak mudah lelah.',
             'Bersepeda melatih otot kaki agar kuat, karena kaki mengayuh pedal.',
             'Lari kecil melatih jantung dan paru-paru. Jantung memompa darah, paru-paru dipakai bernapas.',
             'Kalau dilakukan rutin, badan menjadi bugar dan sehat.'],
     'gambar': [img('bicycle', label='bersepeda'), img('person-running', label='lari kecil')],
     'ingat': 'Bersepeda menguatkan otot kaki. Lari kecil melatih jantung dan paru-paru.',
     'ortu': 'Setelah anak berlari kecil, letakkan tangannya di dada agar terasa detak jantung dan napasnya. '
             'Jelaskan bahwa jantung dan paru-paru ikut berlatih, lalu kaitkan dengan kaki yang pegal setelah bersepeda.'},
    {'kisi': 'PJ3',
     'judul': 'Badan bersih dan sehat',
     'isi': ['Setelah berolahraga badan berkeringat dan cairan tubuh berkurang.',
             'Gantilah dengan minum air putih, bukan minuman manis.',
             'Mandi dan berganti baju membuat badan bersih dan segar.',
             'Cuci tangan dengan air dan sabun agar kuman hilang. Sikat gigi dua kali sehari.'],
     'gambar': [img('soap', label='sabun'), img('toothbrush', label='sikat gigi'), img('shower', label='mandi')],
     'contoh': [{'teks': 'Sehabis bermain di lapangan: minum air putih, cuci tangan pakai sabun, lalu mandi.'}],
     'ingat': 'Ganti keringat dengan air putih, cuci tangan pakai sabun, mandi, dan sikat gigi dua kali sehari.',
     'ortu': 'Buat rutinitas sepulang bermain: minum air putih, cuci tangan dengan sabun, mandi. Ajak anak menghitung kapan saja ia menyikat gigi dalam sehari '
             '(pagi dan malam sebelum tidur).'},
    {'kisi': 'PJ3',
     'judul': 'Menata ruang sebelum bermain',
     'isi': ['Sebelum bermain di dalam ruangan, kita menata ruang dulu.',
             'Geser meja dan kursi ke pinggir agar ruang menjadi lapang.',
             'Tujuannya supaya kita tidak tersandung, aman, dan nyaman bermain.'],
     'gambar': [img('chair', label='kursi'), img('house', label='ruangan')],
     'ingat': 'Menata ruang sebelum bermain membuat kita aman dan nyaman, tidak mudah tersandung.',
     'ortu': 'Sebelum anak bermain lompat tali atau bola di rumah, ajak ia memeriksa ruang dan memindahkan benda yang menghalangi. '
             'Tanyakan, "Kalau kursi ada di tengah, apa yang bisa terjadi?"'},
    {'kisi': 'PJ3',
     'judul': 'Menjaga lingkungan tetap bersih',
     'isi': ['Dalam ajaran Islam, kebersihan sebagian dari iman.',
             'Menjaga lingkungan bersih adalah perbuatan baik.',
             'Buang sampah pada tempatnya, sapu lantai, lap meja, dan rapikan kursi.',
             'Lingkungan yang bersih tidak bau dan tidak mengundang lalat, jadi kita sehat dan nyaman.'],
     'gambar': [img('wastebasket', label='tempat sampah'), img('house', label='lingkungan bersih')],
     'contoh': [{'teks': 'Piket kelas: menyapu lantai, membuang sampah ke tempatnya, dan mengelap meja.'}],
     'ingat': 'Kebersihan sebagian dari iman. Lingkungan bersih membuat kita sehat dan nyaman.',
     'ortu': 'Ajak anak membandingkan halaman yang penuh sampah dengan halaman bersih: mana yang bau, mana yang nyaman untuk bermain. '
             'Lalu minta ia menyebut dua tugas yang bisa ia kerjakan sendiri, misalnya menyapu dan membuang sampah.'},

    # ---------------- PJ4: aktivitas air ----------------
    {'kisi': 'PJ4',
     'judul': 'Berlatih di air',
     'isi': ['Gerak dasar di air dimulai dengan membasahi tubuh.',
             'Percikkan air ke kaki, tangan, dan dada dulu, supaya badan tidak kaget.',
             'Lalu belajar mengapung. Badan dibuat santai dan tidak tegang, jadi terapung di permukaan air.',
             'Latihan ini membuat kita tenang dan tidak takut air. Berlatihlah di kolam dangkal bersama orang dewasa.'],
     'gambar': [img('shower', label='basahi tubuh'), img('person-swimming', label='mengapung'), img('water-wave', label='air')],
     'ingat': 'Basahi tubuh dulu, lalu berlatih mengapung dengan badan santai di kolam dangkal bersama orang dewasa.',
     'ortu': 'Peragakan di kamar mandi atau bak: membasahi tubuh mulai dari kaki. Jelaskan bahwa badan yang tegang mudah tenggelam sedangkan badan santai mudah terapung, '
             'seperti daun di air. Aktivitas air hanya dilakukan dengan pengawasan penuh.'},

    # ---------------- PJ5: kerja sama dan syukur ----------------
    {'kisi': 'PJ5',
     'judul': 'Berdoa dan bersyukur',
     'isi': ['Sebelum berolahraga kita berdoa, misalnya mengucapkan bismillah.',
             'Berdoa berarti mengingat Allah swt. dan memohon kelancaran serta keselamatan.',
             'Sesudah kegiatan selesai dengan selamat, kita bersyukur dan mengucapkan alhamdulillah.',
             'Syukur artinya berterima kasih kepada Allah swt. atas nikmat, termasuk badan yang sehat.'],
     'gambar': [img('folded-hands', label='berdoa')],
     'contoh': [{'teks': 'Mulai kegiatan: "Bismillah". Selesai dengan selamat: "Alhamdulillah".'}],
     'ingat': 'Bismillah untuk memulai, alhamdulillah untuk bersyukur. Doa dan syukur menunjukkan kita ingat Allah swt.',
     'ortu': 'Biasakan anak berdoa sebelum bermain dan mengucap alhamdulillah sesudahnya. '
             'Jelaskan bahwa doa bukan untuk menang dalam permainan, tetapi tanda ingat kepada Allah swt. yang memberi badan sehat.'},
    {'kisi': 'PJ5',
     'judul': 'Sabar dan tolong-menolong',
     'isi': ['Sabar artinya mau menunggu giliran dan tetap tenang, juga saat kalah.',
             'Tolong-menolong artinya saling membantu, terutama saat teman kesulitan.',
             'Bila teman terjatuh, bantu ia berdiri dan antar ke UKS. Bila teman belum bisa, ajari pelan-pelan.',
             'Bekerja sama berarti mengerjakan sesuatu bersama dan saling membantu, misalnya membereskan bola dan kerucut setelah bermain.'],
     'gambar': [img('raised-hand', label='sabar'), img('thumbs-up', label='tolong-menolong')],
     'contoh': [{'teks': 'Dua anak memegang ujung tali, satu anak melompat. Mereka bergantian dan saling membantu. Itu kerja sama.'}],
     'ingat': 'Sabar itu tenang menunggu dan menerima. Tolong-menolong itu membantu teman yang kesulitan.',
     'ortu': 'Ceritakan kejadian di kelas: ada teman menyerobot, kalah bermain, atau terjatuh. Tanyakan, "Sikap apa yang baik? Apa yang akan kamu lakukan?" '
             'Biarkan anak menyebut nama sikapnya dan satu contoh perbuatan.'},
    {'kisi': 'PJ5',
     'judul': 'Menutup aurat dan salat tepat waktu',
     'isi': ['Anak muslim tetap menutup aurat saat berolahraga.',
             'Pilih pakaian olahraga yang sopan dan menutup aurat, bukan yang ketat, tipis, atau terbuka.',
             'Salat lima waktu adalah perintah Allah swt. dan harus dikerjakan tepat waktu.',
             'Kalau azan berkumandang saat kita bermain, berhentilah dan segera bersiap salat.'],
     'gambar': [img('mosque', label='salat'), img('person-walking', label='berolahraga')],
     'ingat': 'Menutup aurat dan salat tepat waktu tetap dilakukan, juga saat berolahraga.',
     'ortu': 'Bicarakan pakaian olahraga yang nyaman dan sopan untuk anak. Sepakati bahwa saat azan, permainan berhenti dulu. '
             'Sebut lima waktu salat: Subuh, Zuhur, Asar, Magrib, dan Isya.'},
]
