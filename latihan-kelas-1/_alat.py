"""Alat bersama untuk menulis soal: pg(), isian(), bs(), img(), svg() dan gambar siap pakai.
Setiap soal WAJIB punya kisi=<kode indikator dari _kisi.py>."""
import json, random, math

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
def garis_bilangan(mulai=3, loncat=4):
    """Garis bilangan 0-10 dengan loncatan dari `mulai` sebanyak `loncat` (negatif = mundur, untuk pengurangan)."""
    s = f'<line x1="20" y1="100" x2="380" y2="100" stroke="{INK}" stroke-width="4"/>'
    for i in range(11):
        x = 20 + i * 36
        s += f'<line x1="{x}" y1="92" x2="{x}" y2="108" stroke="{INK}" stroke-width="4"/><text x="{x}" y="132" text-anchor="middle" font-size="20" font-weight="700" fill="{INK}" font-family="sans-serif">{i}</text>'
    step = 1 if loncat > 0 else -1
    for k in range(abs(loncat)):
        a = mulai + k * step; b = a + step
        x1, x2 = 20 + a * 36, 20 + b * 36
        tip = x2 - 4 * step
        s += f'<path d="M{x1} 88 Q{(x1+x2)/2} 50 {tip} 86" fill="none" stroke="#E8742A" stroke-width="4"/><path d="M{tip-8*step} 80 L{tip+step} 88 L{tip+3*step} 76" fill="none" stroke="#E8742A" stroke-width="4" stroke-linecap="round"/>'
    s += f'<circle cx="{20+mulai*36}" cy="100" r="8" fill="#E8742A"/>'
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

def pg(tanya, benar, salah, gambar=None, bahas=None, acak=True, suara=None, kisi=None):
    pil = [benar] + salah
    order = list(range(3))
    if acak: random.Random(tanya).shuffle(order)
    q = {'jenis': 'pg', 'tanya': tanya, 'pilihan': [pil[i] for i in order], 'jawab': order.index(0)}
    if kisi: q['kisi'] = kisi
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    if suara: q['suara'] = suara
    return q
def isian(tanya, terima, gambar=None, bahas=None, suara=None, kisi=None):
    q = {'jenis': 'isian', 'tanya': tanya, 'terima': terima}
    if kisi: q['kisi'] = kisi
    if suara: q['suara'] = suara
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    return q
def bs(tanya, benar, gambar=None, bahas=None, suara=None, kisi=None):
    q = {'jenis': 'bs', 'tanya': tanya, 'benar': benar}
    if kisi: q['kisi'] = kisi
    if suara: q['suara'] = suara
    if gambar: q['gambar'] = gambar
    if bahas: q['bahas'] = bahas
    return q

