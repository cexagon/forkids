#!/usr/bin/env python3
"""Menyusun latihan/soal.js dari kisi-kisi ASAS ganjil kelas 1 (T.P 2026/2027).
Pilihan benar ditulis pertama, lalu diacak dengan seed tetap supaya kunci tidak selalu 'a'.
Jalankan: python3 latihan/_buat_soal.py"""
import json, random

INK = '#3d2b1f'

def svg(body, w=240, h=140):
    return {'svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img">{body}</svg>'}

def line(d, color=INK, sw=8):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'

ZIGZAG = svg(line('M20 100 L55 40 L90 100 L125 40 L160 100 L195 40 L220 90'))
import math
def _spiral():
    pts=[]
    for k in range(0, 3*72+1):
        t=k*math.pi/36; r=3+7.2*t/math.pi
        pts.append(f"{120+r*math.cos(t):.1f} {75+r*math.sin(t):.1f}")
    return 'M' + ' L'.join(pts)
SPIRAL = svg(line(_spiral(), INK, 7), 240, 150)
LURUS = svg(line('M25 70 H215'))
def tri(x, y, s, c): return f'<path d="M{x} {y-s} L{x+s} {y+s*0.8} L{x-s} {y+s*0.8} Z" fill="{c}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
def circ(x, y, r, c): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" stroke="{INK}" stroke-width="4"/>'
def sq(x, y, s, c): return f'<rect x="{x-s}" y="{y-s}" width="{2*s}" height="{2*s}" rx="4" fill="{c}" stroke="{INK}" stroke-width="4"/>'
SEGITIGA = svg(tri(120, 70, 50, '#F5B82E'))
PERSEGI_PANJANG = svg(f'<rect x="40" y="35" width="160" height="80" rx="4" fill="#7CC6E8" stroke="{INK}" stroke-width="5"/>', 240, 150)
BENTUK_ACAK = svg(tri(45, 50, 26, '#F5B82E') + circ(120, 45, 24, '#E8742A') + sq(195, 50, 22, '#7CC6E8') + tri(80, 115, 22, '#F5B82E') + sq(150, 115, 20, '#7CC6E8') + tri(215, 112, 20, '#F5B82E') + circ(30, 120, 16, '#E8742A'), 250, 150)
POLA = svg(circ(28, 70, 20, '#E8742A') + tri(78, 72, 22, '#F5B82E') + circ(128, 70, 20, '#E8742A') + tri(178, 72, 22, '#F5B82E') + circ(228, 70, 20, '#E8742A')
           + f'<rect x="258" y="45" width="50" height="50" rx="10" fill="#fff" stroke="{INK}" stroke-width="4" stroke-dasharray="8 6"/><text x="283" y="83" text-anchor="middle" font-size="34" font-weight="800" fill="{INK}" font-family="sans-serif">?</text>', 320, 140)
TOPENG = svg(f'<path d="M40 30 Q120 0 200 30 Q215 90 180 120 Q120 150 60 120 Q25 90 40 30Z" fill="#F7C873" stroke="{INK}" stroke-width="5"/>'
             f'<ellipse cx="88" cy="62" rx="18" ry="12" fill="{INK}"/><ellipse cx="152" cy="62" rx="18" ry="12" fill="{INK}"/>'
             f'<path d="M118 70 l-8 22 h18" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
             + line('M80 104 Q120 134 160 104', INK, 6), 240, 150)
UNGU = svg(f'<circle cx="120" cy="70" r="56" fill="#8E44C9" stroke="{INK}" stroke-width="4"/>')
def garis_bilangan():
    s = f'<line x1="20" y1="100" x2="380" y2="100" stroke="{INK}" stroke-width="4"/>'
    for i in range(11):
        x = 20 + i * 36
        s += f'<line x1="{x}" y1="92" x2="{x}" y2="108" stroke="{INK}" stroke-width="4"/><text x="{x}" y="132" text-anchor="middle" font-size="20" font-weight="700" fill="{INK}" font-family="sans-serif">{i}</text>'
    for i in range(3, 7):
        x1, x2 = 20 + i * 36, 20 + (i + 1) * 36
        s += f'<path d="M{x1} 88 Q{(x1+x2)/2} 50 {x2-4} 86" fill="none" stroke="#E8742A" stroke-width="4"/><path d="M{x2-12} 80 L{x2-3} 88 L{x2-1} 76" fill="none" stroke="#E8742A" stroke-width="4" stroke-linecap="round"/>'
    s += f'<circle cx="{20+3*36}" cy="100" r="8" fill="#E8742A"/>'
    return svg(s, 400, 145)

# orang lidi untuk PJOK
def orang(body):
    return {'svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180" role="img"><g fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>'}
KEPALA = lambda x, y: f'<circle cx="{x}" cy="{y}" r="15" fill="#F7C873"/>'
BERDIRI = orang(KEPALA(80, 30) + '<path d="M80 45 V110 M80 110 L70 165 M80 110 L90 165 M80 60 L62 100 M80 60 L98 100"/>')
PESAWAT = orang(KEPALA(28, 78) + '<path d="M43 82 L104 88 M104 88 L106 165 M104 88 L152 80 M62 84 L58 50 M62 84 L66 118"/>' + '<path d="M70 168 H140" stroke-width="4"/>')
BERGANTUNG = orang('<path d="M15 18 H145" stroke-width="9"/>' + KEPALA(80, 62) + '<path d="M70 18 L76 48 M90 18 L84 48 M80 77 V130 M80 130 L72 172 M80 130 L88 172"/>')
BERLARI = orang(KEPALA(88, 30) + '<path d="M86 45 L76 105 M76 105 L106 130 L100 165 M76 105 L52 140 L30 135 M82 62 L110 82 L128 66 M82 62 L56 74 L46 96"/>')
MELOMPAT = orang(KEPALA(80, 26) + '<path d="M80 41 V98 M80 98 L60 128 L76 150 M80 98 L100 128 L84 150 M80 55 L54 22 M80 55 L106 22"/>' + '<path d="M30 172 H130" stroke-width="4" stroke-dasharray="6 8"/>')

def img(nama, n=None, label=None):
    d = {'img': f'aset/{nama}.svg'}
    if n: d['n'] = n
    if label: d['label'] = label
    return d

rng = random.Random(20261124)
def pg(tanya, benar, salah, gambar=None, bahas=None, acak=True, suara=None):
    pil = [benar] + salah
    order = list(range(3))
    if acak: rng.shuffle(order)
    q = {'jenis': 'pg', 'tanya': tanya, 'pilihan': [pil[i] for i in order], 'jawab': order.index(0)}
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    if suara: q['suara'] = suara
    return q
def isian(tanya, terima, gambar=None, bahas=None, suara=None):
    q = {'jenis': 'isian', 'tanya': tanya, 'terima': terima}
    if suara: q['suara'] = suara
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    return q
def bs(tanya, benar, gambar=None, bahas=None):
    q = {'jenis': 'bs', 'tanya': tanya, 'benar': benar}
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    return q

SOAL = [
 {'id': 'alislam', 'nama': 'Al-Islam', 'materi': 'Huruf hijaiah, Al-Fatihah, Rukun Iman, basmalah dan hamdalah, Rukun Islam, syahadat, kisah nabi', 'soal': [
   pg('Huruf hijaiah ini dibaca ....', 'ba', ['alif', 'ta'], gambar=[{'teks': 'ب'}]),
   isian('Huruf hijaiah ini dibaca ....', ['alif'], gambar=[{'teks': 'ا'}], bahas='ا adalah alif, huruf hijaiah yang pertama.'),
   pg('Surah Al-Fatihah artinya ....', 'pembukaan', ['penutup', 'pertolongan'], bahas='Al-Fatihah adalah surah pembuka Al-Qur\'an.'),
   pg('Sebelum makan, kita membaca ....', 'Bismillahirrahmanirrahim', ['Alhamdulillahirabbil ’alamin', 'Astagfirullah'], gambar=[img('red-apple')]),
   pg('Rukun Iman yang kedua adalah iman kepada ....', 'malaikat', ['Allah', 'kitab'], bahas='Urutan Rukun Iman: Allah, malaikat, kitab, rasul, hari akhir, qada dan qadar.'),
   isian('Teman meminjamkan pensilnya kepadamu. Kamu mengucapkan ....', ['terima kasih', 'jazakallah', 'jazakallahu khairan', 'jazakillah'], gambar=[img('pencil')], bahas='Kita berterima kasih dengan santun, misalnya "terima kasih" atau "jazakallahu khairan".'),
   pg('Syahadat yang berisi pengakuan bahwa Nabi Muhammad adalah utusan Allah disebut syahadat ....', 'rasul', ['tauhid', 'iman'], bahas='Syahadat tauhid: tiada Tuhan selain Allah. Syahadat rasul: Nabi Muhammad utusan Allah.'),
   pg('Di tempat ini kita mengerjakan Rukun Islam yang kedua, yaitu ....', 'salat', ['zakat', 'haji'], gambar=[img('mosque', label='masjid')]),
   isian('Nabi pertama dan manusia pertama adalah Nabi ....', ['adam', 'nabi adam'], bahas='Nabi Adam adalah nabi pertama dari 25 nabi.'),
   pg('Kapal besar ini mengingatkan kita pada mukjizat Nabi ....', 'Nuh', ['Musa', 'Ibrahim'], gambar=[img('sailboat')], bahas='Nabi Nuh membuat kapal besar yang menyelamatkan orang beriman dari banjir.'),
 ]},
 {'id': 'pancasila', 'nama': 'Pendidikan Pancasila', 'materi': 'Patuh aturan, identitas diri, bersikap baik kepada teman, lambang negara dan lagu kebangsaan', 'soal': [
   pg('Setelah selesai bermain, mainan sebaiknya ....', 'dirapikan kembali', ['dibiarkan berserakan', 'dilempar'], gambar=[img('teddy-bear')]),
   bs('Membuang sampah ke tempat sampah adalah perilaku patuh aturan.', True, gambar=[img('wastebasket')]),
   bs('Saat guru menjelaskan, kita boleh berlari-lari di kelas.', False, bahas='Saat guru menjelaskan, kita duduk dan mendengarkan.'),
   pg('Saat bermain ayunan bersama teman, kita harus ....', 'antre bergantian', ['merebut ayunan', 'mendorong teman']),
   bs('Anak pada gambar ini adalah anak perempuan.', True, gambar=[img('girl')], bahas='Anak pada gambar adalah anak perempuan.'),
   pg('Perempuan muslim menutup aurat dengan memakai ....', 'jilbab', ['topi pesta', 'baju renang'], gambar=[img('woman-with-headscarf')]),
   pg('Dina suka menggambar setiap hari. Menggambar adalah ... Dina.', 'hobi', ['nama', 'umur']),
   pg('Temanmu jatuh saat berlari. Sikapmu adalah ....', 'menolongnya', ['menertawakannya', 'meninggalkannya']),
   pg('Lambang negara Indonesia adalah ....', 'Garuda Pancasila', ['burung merpati', 'harimau']),
   isian('Lagu kebangsaan Indonesia adalah ....', ['indonesia raya'], bahas='Lagu kebangsaan kita adalah Indonesia Raya.'),
 ]},
 {'id': 'bindo', 'nama': 'Bahasa Indonesia', 'materi': 'Sumber bunyi, tanda baca, suku kata, kuman dan kebersihan, makanan sehat, gerak hewan, mendorong dan menarik', 'soal': [
   pg('Lonceng sekolah dipukul. Bunyinya ....', 'teng teng', ['guk guk', 'kukuruyuk'], gambar=[img('bell', label='lonceng')]),
   pg('Dengarkan suaranya. “Guk guk!” Itu suara hewan apa?', img('dog-face', label='anjing'), [img('rooster', label='ayam jago'), img('cat-face', label='kucing')], suara='aset/suara/anjing.mp3'),
   isian('Benda ini dipukul berbunyi dung dung. Namanya ....', ['drum', 'gendang', 'tambur', 'beduk', 'bedug'], gambar=[img('drum')]),
   pg('Siapa namamu ...\nTanda baca yang tepat adalah ....', '? (tanda tanya)', ['. (titik)', '! (tanda seru)'], bahas='Kalimat bertanya diakhiri tanda tanya (?).'),
   pg('Suku kata awal kata “bola” adalah ....', 'bo', ['la', 'ba'], gambar=[img('soccer-ball', label='bola')]),
   isian('Dengarkan suaranya. Tulis nama hewan itu.', ['kucing', 'kucin'], suara='aset/suara/kucing.mp3', bahas='Itu suara kucing: meong.'),
   pg('Kuman bisa membuat kita ....', 'sakit', ['kuat', 'pintar'], gambar=[img('microbe', label='kuman')]),
   pg('Agar tangan bersih dari kuman, kita mencuci tangan dengan air dan ....', 'sabun', ['pasir', 'minyak']),
   pg('Makanan mana yang sehat?', img('carrot', label='wortel'), [img('lollipop', label='permen'), img('french-fries', label='kentang goreng')]),
   pg('Anak itu ... troli belanja.', 'mendorong', ['menarik', 'melempar'], gambar=[img('shopping-cart')], bahas='Troli digerakkan dengan didorong ke depan.'),
 ]},
 {'id': 'matematika', 'nama': 'Matematika', 'materi': 'Membilang dan membandingkan sampai 10, penjumlahan dan pengurangan sampai 10, mengenal bentuk', 'soal': [
   pg('Ada berapa apel?', '7', ['6', '8'], gambar=[img('red-apple', n=7)]),
   pg('Tanda yang tepat untuk  8 ... 5  adalah ....', '>', ['<', '='], acak=True, bahas='8 lebih besar dari 5, jadi 8 > 5.'),
   pg('2, 4, 6, ..., 10\nAngka yang hilang adalah ....', '8', ['7', '9']),
   pg('Berapa bintang semuanya?', '7', ['6', '8'], gambar=[img('star', n=3), {'teks': '+'}, img('star', n=4)]),
   isian('6 + ... = 10', ['4', 'empat'], bahas='6 dan 4 jumlahnya 10.'),
   pg('Lihat garis bilangan. 3 + 4 = ....', '7', ['6', '8'], gambar=[garis_bilangan()]),
   pg('Ibu membeli 9 telur. 4 telur pecah. Telur yang masih utuh ada ....', '5', ['4', '6']),
   isian('8 − ... = 5', ['3', 'tiga'], bahas='8 dan 5 selisihnya 3.'),
   pg('Benda yang berbentuk lingkaran adalah ....', img('coin', label='koin'), [img('books', label='buku'), img('backpack', label='tas')]),
   isian('Ada berapa segitiga pada gambar?', ['3', 'tiga'], gambar=[BENTUK_ACAK], bahas='Segitiga berwarna kuning ada 3.'),
 ]},
 {'id': 'pjok', 'nama': 'PJOK', 'materi': 'Bertumpu, bergantung, keseimbangan, gerak berirama, sikap diam dan bergerak, keselamatan di kolam renang', 'soal': [
   pg('Gerakan pada gambar disebut sikap ....', 'pesawat', ['jongkok', 'duduk'], gambar=[PESAWAT], bahas='Berdiri satu kaki dengan tangan terentang disebut sikap pesawat.'),
   bs('Berdiri dengan satu kaki termasuk gerak keseimbangan.', True),
   pg('Gerak bergantung dilakukan pada ....', 'palang', ['kolam', 'bola'], gambar=[BERGANTUNG]),
   pg('Merangkak dengan tangan dan lutut adalah contoh gerak ....', 'bertumpu', ['bergantung', 'berenang']),
   pg('Melangkah ke depan dan ke samping mengikuti irama lagu disebut gerak ....', 'berirama', ['bergantung', 'berenang']),
   pg('Manakah yang termasuk sikap tubuh diam?', dict(BERDIRI, label='berdiri tegak'), [dict(BERLARI, label='berlari'), dict(MELOMPAT, label='melompat')]),
   pg('Bergerak membuat peredaran darah menjadi ....', 'lancar', ['berhenti', 'macet']),
   pg('Saat berenang, anak-anak harus ditemani ....', 'orang dewasa', ['adik bayi', 'kucing'], gambar=[img('person-swimming')]),
   bs('Kita boleh berlari-lari di pinggir kolam renang.', False, gambar=[img('no-entry')], bahas='Pinggir kolam licin. Kita berjalan pelan agar tidak jatuh.'),
   pg('Setelah selesai berolahraga, kita mengucapkan ....', 'Alhamdulillah', ['Bismillah', 'Astagfirullah']),
 ]},
 {'id': 'seni', 'nama': 'Seni Rupa', 'materi': 'Jenis garis, garis dan gerak di alam, bentuk geometris, topeng, bentuk berulang', 'soal': [
   pg('Garis pada gambar adalah garis ....', 'zig-zag', ['lurus', 'lengkung'], gambar=[ZIGZAG]),
   pg('Garis ini disebut garis ....', 'spiral', ['lurus', 'zig-zag'], gambar=[SPIRAL]),
   isian('Garis pada gambar adalah garis ....', ['lurus', 'garis lurus'], gambar=[LURUS]),
   pg('Gambar mana yang seperti garis bergelombang?', img('water-wave', label='ombak'), [img('high-voltage', label='petir'), img('books', label='buku')]),
   pg('Petir biasanya digambar dengan garis ....', 'zig-zag', ['lurus', 'spiral'], gambar=[img('high-voltage')]),
   pg('Bentuk ini disebut ....', 'segitiga', ['lingkaran', 'persegi'], gambar=[SEGITIGA]),
   isian('Bentuk ini disebut ....', ['persegi panjang', 'persegipanjang'], gambar=[PERSEGI_PANJANG]),
   pg('Ekspresi wajah topeng ini adalah ....', 'senang', ['sedih', 'marah'], gambar=[TOPENG]),
   pg('Topeng dari kertas dibuat dengan cara ....', 'dilipat dan digunting', ['dimasak', 'ditanam']),
   pg('Lingkaran, segitiga, lingkaran, segitiga, lingkaran, ...\nBentuk berikutnya adalah ....', 'segitiga', ['lingkaran', 'persegi'], gambar=[POLA]),
 ]},
 {'id': 'inggris', 'nama': 'Bahasa Inggris', 'materi': 'Greetings, How are you, Hi I am, My name is, numbers one to ten, I have, colors', 'soal': [
   pg('Pagi hari kita mengucapkan ....', 'Good morning', ['Good night', 'Good afternoon'], gambar=[img('sun')]),
   pg('Sebelum tidur malam kita mengucapkan ....', 'Good night', ['Good morning', 'Good afternoon']),
   pg('“How are you?”\nJawaban yang tepat adalah ....', 'I am fine, thank you', ['My name is Dina', 'Goodbye']),
   pg('“Hi” artinya ....', 'halo', ['selamat tinggal', 'terima kasih']),
   pg('“What is your name?”\nJawaban yang tepat adalah ....', 'My name is Dina', ['I am fine', 'I have a bag']),
   pg('Kata “your” pada “What is your name?” artinya ....', 'kamu (-mu)', ['aku', 'dia']),
   pg('How many apples?', 'five', ['three', 'seven'], gambar=[img('red-apple', n=5)]),
   isian('“Eight” dalam bahasa Indonesia adalah ....', ['delapan', '8']),
   pg('I have two ....', 'bags', ['books', 'balls'], gambar=[img('backpack', n=2)]),
   pg('Warna ini dalam bahasa Inggris adalah ....', 'purple', ['yellow', 'green'], gambar=[UNGU], bahas='Purple artinya ungu.'),
 ]},
]
SOAL[-1]['tambahan'] = True

for s in SOAL:
    assert len(s['soal']) == 10, s['id']
    for q in s['soal']:
        if q['jenis'] == 'pg':
            assert len(q['pilihan']) == 3 and 0 <= q['jawab'] < 3
        for part in q.get('gambar', []):
            if 'img' in part:
                import os
                assert os.path.exists(os.path.join(os.path.dirname(__file__), part['img'])), part['img']
        for p in q.get('pilihan', []):
            if isinstance(p, dict) and 'img' in p:
                import os
                assert os.path.exists(os.path.join(os.path.dirname(__file__), p['img'])), p['img']

out = ('/* Soal latihan Asesmen Sumatif Akhir Semester Ganjil kelas 1, disusun dari kisi-kisi sekolah (T.P 2026/2027).\n'
       '   Dibuat oleh _buat_soal.py; ubah di sana lalu jalankan ulang. jenis: pg | isian | bs. */\n'
       'window.SOAL = ' + json.dumps(SOAL, ensure_ascii=False, indent=1) + ';\n')
import os
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'soal.js'), 'w').write(out)
from collections import Counter
print({s['id']: (Counter(q['jenis'] for q in s['soal']), ''.join('abc'[q['jawab']] if q['jenis']=='pg' else ('B' if q.get('benar') else 'S') if q['jenis']=='bs' else '_' for q in s['soal'])) for s in SOAL})
