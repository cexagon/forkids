/* Ilustrasi vektor Kebun Hitung. Semua gambar adalah string SVG inline. */
window.ART = (() => {
  const KANCIL = (cls = '', mood = 'happy') => `
  <svg class="kancil ${cls} mood-${mood}" viewBox="0 0 160 160" role="img" aria-label="Kancil">
    <ellipse cx="80" cy="152" rx="56" ry="5" fill="rgba(0,0,0,.08)"/>
    <ellipse cx="36" cy="88" rx="9" ry="6" fill="#F3DDB8" transform="rotate(-30 36 88)"/>
    <rect x="50" y="108" width="8" height="40" rx="4" fill="#8A5428"/>
    <rect x="62" y="110" width="8" height="38" rx="4" fill="#7A4822"/>
    <rect x="94" y="110" width="8" height="38" rx="4" fill="#8A5428"/>
    <rect x="106" y="108" width="8" height="40" rx="4" fill="#7A4822"/>
    <ellipse cx="78" cy="98" rx="44" ry="26" fill="#B87333"/>
    <ellipse cx="82" cy="110" rx="28" ry="11" fill="#F3DDB8"/>
    <path d="M100 86 Q106 66 114 64 L128 74 Q122 94 112 102 Z" fill="#B87333"/>
    <g class="ear-l"><ellipse cx="106" cy="38" rx="7" ry="17" fill="#A8652B" transform="rotate(-22 106 38)"/><ellipse cx="106" cy="39" rx="3.5" ry="11" fill="#E9A97A" transform="rotate(-22 106 39)"/></g>
    <g class="ear-r"><ellipse cx="124" cy="36" rx="7" ry="17" fill="#A8652B" transform="rotate(12 124 36)"/><ellipse cx="124" cy="37" rx="3.5" ry="11" fill="#E9A97A" transform="rotate(12 124 37)"/></g>
    <circle cx="118" cy="62" r="22" fill="#B87333"/>
    <ellipse cx="136" cy="71" rx="15" ry="10" fill="#C98A4E"/>
    <ellipse cx="128" cy="78" rx="10" ry="5" fill="#F3DDB8"/>
    <circle cx="149" cy="67" r="4" fill="#3B2614"/>
    <g class="eye"><circle cx="121" cy="57" r="6" fill="#3B2614"/><circle cx="123" cy="55" r="2" fill="#fff"/></g>
    <circle cx="112" cy="70" r="4.5" fill="#F09A6B" opacity=".55"/>
    <path class="m-happy" d="M133 79 Q139 84 146 77" stroke="#3B2614" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle class="m-think" cx="140" cy="80" r="2.6" fill="#3B2614"/>
    <path class="m-cheer" d="M131 77 Q139 90 148 76 Z" fill="#3B2614"/>
    <path class="m-cheer" d="M135 80 Q139 85 144 79 Z" fill="#F09A6B"/>
  </svg>`;

  const STICK = `<svg viewBox="0 0 20 100" aria-hidden="true"><path d="M10 22 Q3 8 1 2 Q8 9 10 18 Q12 8 19 3 Q16 12 10 22z" fill="#4E9A3C"/><rect x="6.5" y="18" width="7" height="80" rx="3.5" fill="#B7CF52"/><rect x="7.3" y="18" width="2.2" height="80" rx="1.1" fill="#DCEA97"/><g stroke="#7E9A2E" stroke-width="1.6"><line x1="6.5" y1="40" x2="13.5" y2="40"/><line x1="6.5" y1="60" x2="13.5" y2="60"/><line x1="6.5" y1="80" x2="13.5" y2="80"/></g></svg>`;

  const BUNDLE = (() => {
    let s = '<svg viewBox="0 0 64 100" aria-hidden="true">';
    for (let i = 0; i < 10; i++) {
      const x = 5 + i * 5.1, y = 16 + (i % 2) * 4;
      s += `<path d="M${x + 3} ${y + 2} Q${x - 2} ${y - 9} ${x - 3} ${y - 14} Q${x + 3} ${y - 7} ${x + 4} ${y}z" fill="#4E9A3C"/>`;
      s += `<rect x="${x}" y="${y}" width="6.4" height="${80 - (i % 2) * 4}" rx="3.2" fill="${i % 2 ? '#A9C447' : '#B7CF52'}" stroke="#7E9A2E" stroke-width=".6"/>`;
    }
    s += '<rect x="2" y="54" width="60" height="9" rx="3" fill="#C8452D"/><circle cx="32" cy="58.5" r="5.5" fill="#A93622"/><path d="M32 62 l-6 9 M32 62 l6 9" stroke="#A93622" stroke-width="3" stroke-linecap="round"/>';
    return s + '</svg>';
  })();

  const stickAt = (x, y, h) => STICK.replace('<svg viewBox="0 0 20 100" aria-hidden="true">', `<svg x="${x}" y="${y}" width="20" height="${h}" viewBox="0 0 20 100">`);
  const PILE_ONE = `<svg viewBox="0 0 44 100" aria-hidden="true">${stickAt(0, 0, 100)}${stickAt(12, 4, 96)}${stickAt(24, 0, 100)}</svg>`;

  const SPROUT = `<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 42V22" stroke="#4E9A3C" stroke-width="3" stroke-linecap="round"/><path d="M20 30c-8 0-12-6-12-12 7 0 12 4 12 12z" fill="#6DB34F"/><path d="M20 28c0-7 5-12 13-12 0 7-5 12-13 12z" fill="#4E9A3C"/></svg>`;
  const FLOWER = `<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 42V12" stroke="#4E9A3C" stroke-width="3" stroke-linecap="round"/><path d="M20 32c-8 0-12-6-12-12 7 0 12 4 12 12z" fill="#6DB34F"/><path d="M20 30c0-7 5-12 13-12 0 7-5 12-13 12z" fill="#4E9A3C"/><g fill="#F59E2B"><circle cx="20" cy="4.5" r="4"/><circle cx="25" cy="8.5" r="4"/><circle cx="23" cy="14" r="4"/><circle cx="17" cy="14" r="4"/><circle cx="15" cy="8.5" r="4"/></g><circle cx="20" cy="9.6" r="3.2" fill="#FFE7A3"/></svg>`;
  const TREE = `<svg viewBox="0 0 40 44" aria-hidden="true"><rect x="17" y="26" width="6" height="16" rx="2" fill="#8A5428"/><circle cx="20" cy="18" r="13" fill="#4E9A3C"/><circle cx="12" cy="22" r="8" fill="#6DB34F"/><circle cx="28" cy="22" r="8" fill="#6DB34F"/><circle cx="16" cy="14" r="2.5" fill="#E8742A"/><circle cx="25" cy="19" r="2.5" fill="#E8742A"/></svg>`;

  const SPEAKER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#FCE7C8"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>`;
  const HOME = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`;
  const STAR = (on) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="${on ? '#F5B82E' : '#E6D9B8'}" stroke="${on ? '#D99A12' : '#D6C49A'}" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`;

  /* Latar: langit, bukit, warung tebu Kancil */
  const SCENE_BG_AT = (align, sign) => `
  <svg class="scene-bg" viewBox="0 0 800 220" preserveAspectRatio="${align} slice" aria-hidden="true">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B8"/><stop offset="1" stop-color="#FFF6DF"/></linearGradient></defs>
    <rect width="800" height="220" fill="url(#sky)"/>
    <circle cx="690" cy="56" r="30" fill="#FFD166"/>
    <g fill="#fff" opacity=".9"><ellipse cx="140" cy="60" rx="38" ry="14"/><ellipse cx="165" cy="52" rx="26" ry="16"/><ellipse cx="520" cy="42" rx="30" ry="12"/><ellipse cx="540" cy="36" rx="20" ry="13"/></g>
    <path d="M0 170 Q120 110 260 160 T520 150 T800 165 V220 H0z" fill="#CFE3A3"/>
    <path d="M0 190 Q160 150 330 185 T660 180 T800 190 V220 H0z" fill="#A9CF7A"/>
    <g id="tebu-field" fill="#7FB85A">${Array.from({ length: 26 }, (_, i) => `<path d="M${18 + i * 31} 220 v-${26 + (i % 3) * 6} l-5 -10 M${18 + i * 31} ${194 - (i % 3) * 6} l6 -9" stroke="#5C9B3C" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <g transform="translate(560 86)">
      <rect x="0" y="40" width="200" height="90" rx="8" fill="#D89A5B"/>
      <rect x="0" y="40" width="200" height="12" fill="#C47D3E"/>
      <path d="M-14 42 H214 L200 14 H0z" fill="#E8742A"/>
      <g fill="#FFF3D1">${Array.from({ length: 6 }, (_, i) => `<path d="M${-14 + i * 38} 42 h38 l-19 14z"/>`).join('')}</g>
      <rect x="-4" y="14" width="208" height="8" rx="4" fill="#C25A18"/>
      ${sign ? '<text x="100" y="78" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="22" fill="#FFF8E7">Warung Tebu</text><text x="100" y="104" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="18" fill="#FFE2B8">Kancil</text>' : '<rect x="24" y="64" width="152" height="46" rx="8" fill="#C47D3E" opacity=".5"/>'}
    </g>
  </svg>`;
  const SCENE_BG = SCENE_BG_AT('xMidYMax', true);
  const SCENE_BG_STALL = SCENE_BG_AT('xMaxYMax', false);

  /* Pembeli */
  const face = (x, y, skin) => `<circle cx="${x}" cy="${y}" r="26" fill="${skin}"/><circle cx="${x - 9}" cy="${y - 3}" r="3.4" fill="#3B2614"/><circle cx="${x + 9}" cy="${y - 3}" r="3.4" fill="#3B2614"/><circle cx="${x - 8}" cy="${y - 4}" r="1.1" fill="#fff"/><circle cx="${x + 10}" cy="${y - 4}" r="1.1" fill="#fff"/><path d="M${x - 8} ${y + 8} Q${x} ${y + 16} ${x + 8} ${y + 8}" stroke="#3B2614" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="${x - 16}" cy="${y + 6}" r="4" fill="#F09A6B" opacity=".5"/><circle cx="${x + 16}" cy="${y + 6}" r="4" fill="#F09A6B" opacity=".5"/>`;

  const CUSTOMERS = {
    sari: { name: 'Bu Sari', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Bu Sari"><ellipse cx="60" cy="144" rx="40" ry="4" fill="rgba(0,0,0,.08)"/><path d="M28 140 Q30 86 60 82 Q90 86 92 140z" fill="#E8574B"/><rect x="40" y="112" width="40" height="8" rx="4" fill="#FFF3D1"/><path d="M26 68 Q26 20 60 18 Q94 20 94 68 Q94 96 60 100 Q26 96 26 68z" fill="#F2A33A"/>${face(60, 56, '#F4C79A')}<rect x="20" y="96" width="18" height="22" rx="6" fill="#F4C79A"/><g transform="translate(12 60)"><rect x="0" y="40" width="22" height="30" rx="4" fill="#5DBBD8"/><rect x="0" y="36" width="22" height="6" rx="3" fill="#2C8DAA"/><rect x="9" y="26" width="4" height="14" fill="#E8742A"/></g></svg>` },
    tani: { name: 'Pak Tani', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Pak Tani"><ellipse cx="60" cy="144" rx="40" ry="4" fill="rgba(0,0,0,.08)"/><rect x="34" y="88" width="52" height="54" rx="12" fill="#3F7FB5"/><rect x="34" y="124" width="22" height="20" rx="6" fill="#2B5A82"/><rect x="64" y="124" width="22" height="20" rx="6" fill="#2B5A82"/>${face(60, 62, '#C98A5A')}<path d="M14 54 L60 18 L106 54z" fill="#E3B66B"/><path d="M14 54 Q60 66 106 54" stroke="#C4954A" stroke-width="5" fill="none"/><path d="M40 72 Q60 80 80 72" stroke="#3B2614" stroke-width="2.4" fill="none"/><rect x="96" y="80" width="6" height="60" rx="3" fill="#8A5428"/><path d="M99 80 q-14 -8 -12 -20 q14 6 12 20z" fill="#4E9A3C"/></svg>` },
    kiki: { name: 'Kiki Kelinci', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Kiki Kelinci"><ellipse cx="60" cy="144" rx="40" ry="4" fill="rgba(0,0,0,.08)"/><ellipse cx="46" cy="40" rx="9" ry="28" fill="#EDEDED" transform="rotate(-10 46 40)"/><ellipse cx="46" cy="42" rx="4.5" ry="20" fill="#F8B4C4" transform="rotate(-10 46 42)"/><ellipse cx="74" cy="40" rx="9" ry="28" fill="#EDEDED" transform="rotate(10 74 40)"/><ellipse cx="74" cy="42" rx="4.5" ry="20" fill="#F8B4C4" transform="rotate(10 74 42)"/><ellipse cx="60" cy="112" rx="30" ry="30" fill="#EDEDED"/><ellipse cx="60" cy="122" rx="16" ry="14" fill="#fff"/><circle cx="60" cy="74" r="28" fill="#EDEDED"/><circle cx="50" cy="70" r="3.6" fill="#3B2614"/><circle cx="70" cy="70" r="3.6" fill="#3B2614"/><circle cx="60" cy="80" r="3" fill="#F28FA8"/><path d="M54 86 Q60 92 66 86" stroke="#3B2614" stroke-width="2.2" fill="none" stroke-linecap="round"/><rect x="56" y="88" width="8" height="7" rx="2" fill="#fff" stroke="#D8D8D8"/><rect x="36" y="128" width="16" height="12" rx="6" fill="#DCDCDC"/><rect x="68" y="128" width="16" height="12" rx="6" fill="#DCDCDC"/></svg>` },
    ijah: { name: 'Nenek Ijah', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Nenek Ijah"><ellipse cx="60" cy="144" rx="40" ry="4" fill="rgba(0,0,0,.08)"/><path d="M26 142 Q28 90 60 86 Q92 90 94 142z" fill="#6B4C9A"/><path d="M30 100 h60" stroke="#F2D06B" stroke-width="3"/><path d="M30 112 h60" stroke="#F2D06B" stroke-width="3"/>${face(60, 58, '#E9B58B')}<path d="M30 48 Q60 14 90 48 Q90 36 60 30 Q30 36 30 48z" fill="#E6E6E6"/><circle cx="36" cy="40" r="8" fill="#E6E6E6"/><circle cx="84" cy="40" r="8" fill="#E6E6E6"/><circle cx="51" cy="55" r="7" fill="none" stroke="#3B2614" stroke-width="2"/><circle cx="69" cy="55" r="7" fill="none" stroke="#3B2614" stroke-width="2"/><path d="M58 55 h4" stroke="#3B2614" stroke-width="2"/><rect x="98" y="84" width="6" height="56" rx="3" fill="#8A5428"/></svg>` },
    gajah: { name: 'Gajah Kecil', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Gajah Kecil"><ellipse cx="60" cy="144" rx="44" ry="4" fill="rgba(0,0,0,.08)"/><ellipse cx="60" cy="106" rx="40" ry="34" fill="#9FB4D6"/><rect x="30" y="122" width="18" height="20" rx="7" fill="#8AA0C4"/><rect x="72" y="122" width="18" height="20" rx="7" fill="#8AA0C4"/><ellipse cx="22" cy="68" rx="18" ry="22" fill="#8AA0C4"/><ellipse cx="98" cy="68" rx="18" ry="22" fill="#8AA0C4"/><ellipse cx="22" cy="68" rx="11" ry="15" fill="#F8B4C4"/><ellipse cx="98" cy="68" rx="11" ry="15" fill="#F8B4C4"/><circle cx="60" cy="66" r="32" fill="#9FB4D6"/><circle cx="48" cy="60" r="3.6" fill="#3B2614"/><circle cx="72" cy="60" r="3.6" fill="#3B2614"/><path d="M60 74 q-16 10 -12 34 q2 10 12 8" stroke="#8AA0C4" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="60" cy="116" r="6" fill="#F8B4C4"/><circle cx="40" cy="70" r="4" fill="#F09A6B" opacity=".5"/><circle cx="80" cy="70" r="4" fill="#F09A6B" opacity=".5"/></svg>` },
    bebek: { name: 'Bebek Dodo', svg: `<svg viewBox="0 0 120 150" role="img" aria-label="Bebek Dodo"><ellipse cx="60" cy="144" rx="38" ry="4" fill="rgba(0,0,0,.08)"/><ellipse cx="60" cy="108" rx="36" ry="30" fill="#FFD95E"/><ellipse cx="34" cy="108" rx="14" ry="20" fill="#F2C340" transform="rotate(20 34 108)"/><circle cx="66" cy="62" r="28" fill="#FFD95E"/><path d="M90 66 q22 -4 22 8 q-2 10 -22 8z" fill="#F28C28"/><circle cx="76" cy="56" r="3.6" fill="#3B2614"/><circle cx="77" cy="54" r="1.1" fill="#fff"/><rect x="44" y="132" width="14" height="10" rx="4" fill="#F28C28"/><rect x="64" y="132" width="14" height="10" rx="4" fill="#F28C28"/><path d="M54 36 q6 -14 14 -4" stroke="#F2C340" stroke-width="5" fill="none" stroke-linecap="round"/></svg>` },
  };

  const ICON_APP = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="110" fill="#FFE9B8"/><path d="M0 400 Q130 330 260 380 T512 370 V512 H0z" fill="#A9CF7A"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${120 + i * 48}" y="${150 + (i % 2) * 20}" width="26" height="${260 - (i % 2) * 20}" rx="13" fill="${i % 2 ? '#A9C447' : '#B7CF52'}" stroke="#7E9A2E" stroke-width="4"/><path d="M${133 + i * 48} ${152 + (i % 2) * 20} q-26 -40 -30 -80 q30 28 30 80z" fill="#4E9A3C"/>`).join('')}<rect x="96" y="300" width="320" height="44" rx="18" fill="#C8452D"/><circle cx="256" cy="322" r="26" fill="#A93622"/></svg>`;

  return { KANCIL, STICK, BUNDLE, PILE_ONE, SPROUT, FLOWER, TREE, SPEAKER, HOME, STAR, LOCK, SCENE_BG, SCENE_BG_STALL, CUSTOMERS, ICON_APP };
})();
