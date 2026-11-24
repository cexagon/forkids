#!/usr/bin/env python3
"""Pratinjau semua soal satu mapel (3 paket) sebagai HTML + PNG untuk diperiksa mata.
Pakai: python3 _pratinjau.py <mapel>  -> /tmp/pratinjau-<mapel>.png"""
import importlib, os, sys, subprocess, html
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
mid = sys.argv[1]
paket = importlib.import_module(f'_soal_{mid}').PAKET
def part(p):
    if 'teks' in p: return f'<span style="font-size:48px;color:#E8742A;font-weight:800">{html.escape(p["teks"])}</span>'
    if 'svg' in p: return f'<div style="width:260px">{p["svg"].replace("<svg ", "<svg style=\'width:100%;height:auto\' ")}</div>'
    n = p.get('n', 1)
    return '<div>' + ''.join(f'<img src="file://{HERE}/{p["img"]}" style="height:{56 if n>1 else 110}px">' for _ in range(n)) + (f'<div>{html.escape(p.get("label",""))}</div>' if p.get('label') else '') + '</div>'
out = ['<html><body style="font:16px sans-serif;background:#fff8e6;width:1500px;margin:10px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">']
for pi, soal in enumerate(paket, 1):
    out.append(f'<div><h2>Paket {pi}</h2>')
    for qi, q in enumerate(soal, 1):
        out.append(f'<div style="background:#fff;border:2px solid #e8d4a8;border-radius:12px;padding:8px;margin:6px 0"><b>{qi}. [{q.get("kisi")}] {q["jenis"]}</b> {html.escape(q["tanya"]).replace(chr(10),"<br>")}')
        if q.get('suara'): out.append(f'<div>🔊 {q["suara"]}</div>')
        if q.get('gambar'): out.append('<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + ''.join(part(p) for p in q['gambar']) + '</div>')
        if q['jenis'] == 'pg':
            opts = []
            for i, p in enumerate(q['pilihan']):
                mark = ' style="background:#d7f0c8"' if i == q['jawab'] else ''
                opts.append(f'<div{mark}>{"abc"[i]}. ' + (html.escape(p) if isinstance(p, str) else part(p)) + '</div>')
            out.append('<div style="display:flex;gap:12px;flex-wrap:wrap">' + ''.join(opts) + '</div>')
        elif q['jenis'] == 'isian': out.append(f'<div style="background:#d7f0c8">Terima: {html.escape(", ".join(q["terima"]))}</div>')
        else: out.append(f'<div style="background:#d7f0c8">Kunci: {"Benar" if q["benar"] else "Salah"}</div>')
        if q.get('bahas'): out.append(f'<div style="color:#7a5b3e">Bahas: {html.escape(q["bahas"])}</div>')
        out.append('</div>')
    out.append('</div>')
out.append('</div></body></html>')
p = f'/tmp/pratinjau-{mid}.html'; open(p, 'w').write(''.join(out))
js = f"""const {{chromium}}=require('/home/claude/.npm-global/lib/node_modules/playwright');(async()=>{{const b=await chromium.launch();const pg=await b.newPage({{viewport:{{width:1520,height:900}}}});await pg.goto('file://{p}');await pg.waitForTimeout(500);await pg.screenshot({{path:'/tmp/pratinjau-{mid}.png',fullPage:true}});await b.close();}})();"""
subprocess.run(['node', '-e', js], check=True)
print(f'/tmp/pratinjau-{mid}.png')
