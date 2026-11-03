/* Isi cerita dan kurikulum Kebun Hitung (Matematika Fase A, kelas 1). */
window.CONTENT = (() => {
  const W = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const words = (n) => {
    if (n < 10) return W[n];
    if (n === 10) return 'sepuluh';
    if (n === 11) return 'sebelas';
    if (n < 20) return W[n - 10] + ' belas';
    if (n === 100) return 'seratus';
    const t = Math.floor(n / 10), o = n % 10;
    return W[t] + ' puluh' + (o ? ' ' + W[o] : '');
  };
  const ikat = (n) => (n === 1 ? 'satu ikat' : words(n) + ' ikat');

  /* Urutan bab mengikuti buku Matematika kelas 1 Kurikulum Merdeka:
     bilangan sampai 10 -> sampai 20 -> penjumlahan & pengurangan sampai 20 -> puluhan dan satuan sampai 99 */
  const CHAPTERS = [
    {
      id: 1, title: 'Warung Baru Kancil', topic: 'Bilangan sampai 10', cp: 'Membilang dan membaca lambang bilangan sampai 10',
      customers: ['sari', 'kiki', 'bebek', 'tani'],
      modes: ['ambil', 'ambil', 'hitung'],
      levels: [{ min: 1, max: 5 }, { min: 3, max: 8 }, { min: 6, max: 10 }],
      intro: [
        { who: 'kancil', text: 'Hari ini warung tebuku buka untuk pertama kali!' },
        { who: 'kancil', text: 'Tapi aku tidak bisa menghitung sendirian. Mau membantuku?' },
        { who: 'sari', text: 'Permisi, Kancil! Aku Bu Sari, penjual es tebu. Aku pembeli pertamamu!' },
      ],
      outro: 'Warungku ramai sekali hari ini. Terima kasih sudah membantu!',
    },
    {
      id: 2, title: 'Pesanan Si Gajah', topic: 'Bilangan sampai 20', cp: 'Membilang sampai 20; sepuluh batang menjadi satu ikat',
      customers: ['gajah', 'tani', 'ijah', 'kiki'],
      modes: ['ambil', 'hitung', 'ambil'],
      levels: [{ min: 10, max: 10 }, { min: 11, max: 15 }, { min: 14, max: 20 }],
      intro: [
        { who: 'gajah', text: 'Halo Kancil! Aku Gajah Kecil. Aku lapar sekali, mau tebu yang banyak!' },
        { who: 'kancil', text: 'Wah, kalau tebunya banyak, gerobaknya bisa penuh.' },
        { who: 'kancil', text: 'Aku punya ide. Setiap sepuluh batang kita ikat jadi satu. Ayo coba!' },
      ],
      outro: 'Satu ikat sama dengan sepuluh batang. Kamu sudah hafal, hebat!',
    },
    {
      id: 3, title: 'Tambah Lagi, Dong!', topic: 'Penjumlahan sampai 20', cp: 'Penjumlahan dua bilangan cacah sampai 20',
      customers: ['kiki', 'sari', 'bebek', 'gajah'],
      modes: ['tambah'],
      levels: [{ sumMax: 10 }, { sumMax: 14 }, { sumMax: 20 }],
      intro: [
        { who: 'kiki', text: 'Kancil, aku mau tebu untuk adik-adikku. Eh, ternyata adikku banyak!' },
        { who: 'kancil', text: 'Tenang, Kiki. Kalau ada yang minta tambah, kita hitung lanjut saja.' },
        { who: 'kancil', text: 'Lima batang, tambah dua. Enam, tujuh! Jadi tujuh. Ayo kita coba.' },
      ],
      outro: 'Kalau ditambah, jumlahnya makin banyak. Kamu pintar menghitung lanjut!',
    },
    {
      id: 4, title: 'Ada yang Dikembalikan', topic: 'Pengurangan sampai 20', cp: 'Pengurangan dua bilangan cacah sampai 20',
      customers: ['ijah', 'tani', 'bebek', 'sari'],
      modes: ['kurang'],
      levels: [{ max: 10 }, { max: 14 }, { max: 20 }],
      intro: [
        { who: 'ijah', text: 'Aduh, Kancil. Nenek beli terlalu banyak. Boleh dikembalikan sebagian?' },
        { who: 'kancil', text: 'Boleh, Nek. Kalau ada yang dikembalikan, tebunya jadi berkurang.' },
        { who: 'kancil', text: 'Kita hitung mundur: delapan, kembalikan dua. Tujuh, enam! Sisa enam.' },
      ],
      outro: 'Kalau dikurangi, jumlahnya makin sedikit. Hitung mundurmu sudah lancar!',
    },
    {
      id: 5, title: 'Hari Pasar Besar', topic: 'Puluhan dan satuan sampai 99', cp: 'Nilai tempat bilangan cacah sampai 99',
      customers: ['tani', 'gajah', 'sari', 'ijah', 'kiki', 'bebek'],
      modes: ['ambil', 'hitung', 'ambil', 'hitung'],
      levels: [{ min: 21, max: 39 }, { min: 40, max: 69 }, { min: 70, max: 99 }],
      intro: [
        { who: 'tani', text: 'Kancil! Besok hari pasar besar. Semua orang mau tebu!' },
        { who: 'kancil', text: 'Pesanannya pasti besar. Untung ada ikat sepuluhan.' },
        { who: 'kancil', text: 'Tiga ikat dan empat batang, itu tiga puluh empat. Ayo kita siapkan!' },
      ],
      outro: 'Pasar besar sukses! Kamu sudah bisa puluhan dan satuan. Luar biasa!',
    },
  ];

  /* Dialog pembeli. {n} angka, {kata} kata bilangan, {nama} nama anak. */
  const LINES = {
    sari: {
      hi: ['Halo Kancil, halo {nama}!', 'Selamat pagi! Es tebuku laris, aku butuh tebu lagi.', 'Permisi, Kancil!'],
      order: ['Aku mau {n} batang tebu, ya.', 'Tolong siapkan {n} batang tebu.', 'Hari ini aku pesan {n} batang.'],
      thanks: ['Terima kasih! Es tebuku pasti segar.', 'Pas sekali! Kamu teliti.', 'Makasih, {nama}. Sampai jumpa!'],
    },
    tani: {
      hi: ['Permisi, Kancil. Pak Tani mau beli tebu.', 'Halo, Nak {nama}! Pak Tani lagi haus.', 'Siang, Kancil!'],
      order: ['Saya mau {n} batang untuk bekal di sawah.', 'Tolong {n} batang tebu, Nak.', '{n} batang saja, ya.'],
      thanks: ['Wah, cocok! Terima kasih, Nak.', 'Pak Tani senang sekali. Makasih!', 'Jempol buat kamu!'],
    },
    kiki: {
      hi: ['Hai hai! Kiki datang!', 'Kancil, Kancil! Aku mau tebu!', 'Halo {nama}, aku Kiki!'],
      order: ['Aku mau {n} batang, buat aku dan adik-adikku.', 'Boleh minta {n} batang?', 'Tebunya {n} batang, ya!'],
      thanks: ['Yeay! Terima kasih!', 'Asyik, adik-adikku pasti senang!', 'Kamu hebat, {nama}!'],
    },
    ijah: {
      hi: ['Permisi, Cucu. Nenek mau beli tebu.', 'Halo, Kancil. Nenek Ijah datang.', 'Selamat sore, Nak {nama}.'],
      order: ['Nenek minta {n} batang, ya.', 'Tolong siapkan {n} batang untuk Nenek.', 'Nenek mau {n} batang, pelan-pelan saja.'],
      thanks: ['Terima kasih, Cucu. Kamu pintar.', 'Nenek senang. Makasih, ya!', 'Pas! Nenek bangga padamu.'],
    },
    gajah: {
      hi: ['Halooo! Gajah Kecil lapar!', 'Kancil! Aku mau tebu yang banyak!', 'Hai {nama}! Aku datang lagi!'],
      order: ['Aku mau {n} batang! Banyak, kan?', 'Tolong {n} batang, ya!', 'Pesananku {n} batang tebu!'],
      thanks: ['Nyam nyam! Terima kasih!', 'Wah, pas! Kamu jago menghitung!', 'Perutku kenyang. Makasih!'],
    },
    bebek: {
      hi: ['Kwek kwek! Halo semua!', 'Permisi, Bebek Dodo lewat!', 'Halo {nama}! Kwek!'],
      order: ['Aku mau {n} batang. Kwek!', 'Tebunya {n} batang, ya. Kwek kwek!', 'Boleh pesan {n} batang?'],
      thanks: ['Kwek! Terima kasih!', 'Pas sekali! Kwek kwek!', 'Dodo senang! Makasih, {nama}!'],
    },
  };

  const PRAISE = ['Hebat!', 'Pintar sekali!', 'Tepat!', 'Kamu jago!', 'Keren!', 'Bagus sekali!'];
  const ENCOURAGE = ['Tidak apa-apa, kita coba lagi.', 'Hampir! Ayo kita cek bersama.', 'Pelan-pelan saja, aku bantu.'];

  const REFLECT = [
    { q: 'Satu ikat tebu berisi berapa batang?', opts: [5, 10, 20], ans: 10, chapter: 2 },
    { q: 'Kalau ditambah, tebunya jadi lebih banyak atau lebih sedikit?', opts: ['banyak', 'sedikit'], ans: 'banyak', chapter: 3 },
    { q: 'Kalau dikembalikan, tebunya jadi lebih banyak atau lebih sedikit?', opts: ['banyak', 'sedikit'], ans: 'sedikit', chapter: 4 },
    { q: 'Setelah sembilan, bilangan berapa?', opts: [8, 10, 11], ans: 10, chapter: 1 },
    { q: 'Dua ikat dan tiga batang, itu berapa?', opts: [23, 32, 5], ans: 23, chapter: 5 },
  ];

  return { words, ikat, CHAPTERS, LINES, PRAISE, ENCOURAGE, REFLECT };
})();
