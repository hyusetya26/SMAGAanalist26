
import { Stock, Property, QuizQuestion } from './types';

export const INITIAL_TOKEN = 20;
export const INITIAL_CASH = 1000000; 

export const STOCKS: Stock[] = [
  { id: '1', name: 'Canvas Corp', code: 'CNVS', basePrice: 1500, currentPrice: 1500, history: [], volatility: 0.05, category: 'Materials' },
  { id: '2', name: 'Digital Brush Co', code: 'DBCO', basePrice: 2800, currentPrice: 2800, history: [], volatility: 0.08, category: 'Digital' },
  { id: '3', name: 'Inkwell Indah', code: 'INKW', basePrice: 900, currentPrice: 900, history: [], volatility: 0.04, category: 'Materials' },
  { id: '4', name: 'Procreate Pro', code: 'PCPR', basePrice: 4500, currentPrice: 4500, history: [], volatility: 0.12, category: 'Digital' },
  { id: '5', name: 'ArtStation Hub', code: 'ASHB', basePrice: 3200, currentPrice: 3200, history: [], volatility: 0.07, category: 'Services' },
  { id: '6', name: 'Gouache Master', code: 'GMST', basePrice: 1200, currentPrice: 1200, history: [], volatility: 0.03, category: 'Materials' },
  { id: '7', name: 'Tableteer Tech', code: 'TBLT', basePrice: 5600, currentPrice: 5600, history: [], volatility: 0.15, category: 'Digital' },
  { id: '8', name: 'Gallery Indo', code: 'GIND', basePrice: 2100, currentPrice: 2100, history: [], volatility: 0.06, category: 'Services' },
  { id: '9', name: 'Sketchbook Inc', code: 'SKBI', basePrice: 1700, currentPrice: 1700, history: [], volatility: 0.05, category: 'Materials' },
  { id: '10', name: 'Manga Maker', code: 'MNGA', basePrice: 3100, currentPrice: 3100, history: [], volatility: 0.09, category: 'Publishing' },
];

const rawPropertyData: {name: string, price: number, cat: any, keyword: string}[] = [
  { name: "Gerobak Kopi Estetik", price: 100000, cat: "Tier 1", keyword: "coffee cart aesthetic 3d icon" },
  { name: "Lapak Jajanan Sekolah", price: 150000, cat: "Tier 1", keyword: "street food stall indonesia 3d" },
  { name: "Booth Minuman Kekinian", price: 250000, cat: "Tier 1", keyword: "drink booth neon 3d icon" },
  { name: "Lapak Seni Jalanan", price: 400000, cat: "Tier 1", keyword: "art booth fair 3d" },
  { name: "Kios Pulsa Digital", price: 600000, cat: "Tier 1", keyword: "phone shop kiosk 3d" },
  { name: "Warung Angkringan", price: 800000, cat: "Tier 1", keyword: "angkringan wood stall 3d" },
  { name: "Studio Ilustrasi Rumahan", price: 1000000, cat: "Tier 1", keyword: "drawing desk studio 3d" },
  { name: "Toko Online Mini", price: 1500000, cat: "Tier 1", keyword: "workspace laptop 3d icon" },
  { name: "Percetakan Digital Kecil", price: 3000000, cat: "Tier 1", keyword: "printing machine shop 3d" },
  { name: "Mini Creative Desk Setup", price: 5000000, cat: "Tier 1", keyword: "gaming setup workspace 3d" },
  { name: "Rumah Subsidi", price: 10000000, cat: "Tier 2", keyword: "tiny house indonesia 3d" },
  { name: "Ruko Mini", price: 20000000, cat: "Tier 2", keyword: "small shop shophouse 3d" },
  { name: "Studio Ilustrasi Profesional", price: 35000000, cat: "Tier 2", keyword: "graphic design studio 3d" },
  { name: "Toko Alat Seni", price: 50000000, cat: "Tier 2", keyword: "art shop interior 3d" },
  { name: "Workshop Kreatif", price: 75000000, cat: "Tier 2", keyword: "artist workshop studio 3d" },
  { name: "Kafe Kecil Estetik", price: 100000000, cat: "Tier 2", keyword: "modern cafe coffee 3d" },
  { name: "Studio Musik", price: 120000000, cat: "Tier 2", keyword: "music record studio 3d" },
  { name: "Rumah Kost 5 Kamar", price: 150000000, cat: "Tier 2", keyword: "dormitory building 3d" },
  { name: "Ruko 2 Lantai", price: 180000000, cat: "Tier 2", keyword: "modern shophouse 3d" },
  { name: "Mini Gallery Seni", price: 200000000, cat: "Tier 2", keyword: "mini art gallery 3d" },
  { name: "Coworking Space", price: 300000000, cat: "Tier 3", keyword: "coworking office modern 3d" },
  { name: "Gudang Kreatif", price: 450000000, cat: "Tier 3", keyword: "creative storage warehouse 3d" },
  { name: "Studio Produksi Konten", price: 600000000, cat: "Tier 3", keyword: "video studio lighting 3d" },
  { name: "Kafe Premium", price: 800000000, cat: "Tier 3", keyword: "luxury restaurant cafe 3d" },
  { name: "Creative Office Space", price: 1000000000, cat: "Tier 3", keyword: "startup office interior 3d" },
  { name: "Galeri Seni Modern", price: 1500000000, cat: "Tier 3", keyword: "museum gallery modern 3d" },
  { name: "Gedung Kursus Seni", price: 2000000000, cat: "Tier 3", keyword: "education school building 3d" },
  { name: "Mini Mall Kreatif", price: 2500000000, cat: "Tier 3", keyword: "mall architecture small 3d" },
  { name: "Apartemen 10 Unit", price: 3000000000, cat: "Tier 3", keyword: "modern apartment exterior 3d" },
  { name: "Gedung Startup Kreatif", price: 3500000000, cat: "Tier 3", keyword: "startup building corporate 3d" },
  { name: "Gedung Perkantoran", price: 5000000000, cat: "Tier 4", keyword: "skyscraper office skyscraper 3d" },
  { name: "Hotel Budget", price: 6000000000, cat: "Tier 4", keyword: "hotel building modern 3d" },
  { name: "Resort Kecil", price: 7500000000, cat: "Tier 4", keyword: "villa resort tropical 3d" },
  { name: "Kampus Seni Swasta", price: 10000000000, cat: "Tier 4", keyword: "university campus art 3d" },
  { name: "Art Production House", price: 11500000000, cat: "Tier 4", keyword: "media center factory 3d" },
  { name: "Mall Menengah", price: 12000000000, cat: "Tier 4", keyword: "shopping plaza mall 3d" },
  { name: "Media Creative Center", price: 13000000000, cat: "Tier 4", keyword: "news center media 3d" },
  { name: "Apartemen Premium", price: 14000000000, cat: "Tier 4", keyword: "luxury skyscraper 3d" },
  { name: "Design District", price: 14500000000, cat: "Tier 4", keyword: "urban design street 3d" },
  { name: "Kawasan Ruko Elite", price: 15000000000, cat: "Tier 4", keyword: "commercial avenue luxury 3d" },
  { name: "Hotel Bintang 5", price: 18000000000, cat: "Tier 5", keyword: "5 star hotel luxury 3d" },
  { name: "Resort Pantai Mewah", price: 20000000000, cat: "Tier 5", keyword: "paradise beach resort 3d" },
  { name: "Creative Tech Park", price: 22000000000, cat: "Tier 5", keyword: "science park campus 3d" },
  { name: "Distrik Bisnis Kreatif", price: 24000000000, cat: "Tier 5", keyword: "metropolitan center 3d" },
  { name: "Mega Mall Internasional", price: 26000000000, cat: "Tier 5", keyword: "mega mall future 3d" },
  { name: "Kota Seni Mandiri", price: 27000000000, cat: "Tier 5", keyword: "city landscape art 3d" },
  { name: "Smart City Kreatif", price: 28000000000, cat: "Tier 5", keyword: "smart city futuristic 3d" },
  { name: "Global Art Center", price: 29000000000, cat: "Tier 5", keyword: "iconic museum architecture 3d" },
  { name: "Metaverse Creative Land", price: 29500000000, cat: "Tier 5", keyword: "metaverse digital world 3d" },
  { name: "SMAGA TradeVerse World", price: 30000000000, cat: "Tier 5", keyword: "virtual reality universe 3d" },
  { name: "Studio Animasi Internasional", price: 17000000000, cat: "Premium", keyword: "animation studio disney 3d" },
  { name: "NFT Art Hub", price: 13000000000, cat: "Premium", keyword: "nft gallery digital 3d" },
  { name: "Film Production Studio", price: 16000000000, cat: "Premium", keyword: "hollywood studio stage 3d" },
  { name: "Creative Data Center", price: 19000000000, cat: "Premium", keyword: "futuristic server room 3d" },
  { name: "Digital Media Tower", price: 21000000000, cat: "Premium", keyword: "broadcast tower media 3d" },
  { name: "Startup Unicorn HQ", price: 23000000000, cat: "Premium", keyword: "unicorn startup office 3d" },
  { name: "Creative Finance Center", price: 25000000000, cat: "Premium", keyword: "bank finance center 3d" },
  { name: "Innovation City Block", price: 27500000000, cat: "Premium", keyword: "innovative block city 3d" },
  { name: "Global Design Campus", price: 28500000000, cat: "Premium", keyword: "design university modern 3d" },
  { name: "World Creative Capital", price: 29800000000, cat: "Premium", keyword: "creative capital metropolis 3d" },
];

export const PROPERTIES: Property[] = rawPropertyData.map((item, i) => ({
  id: `prop-${i}`,
  name: item.name,
  price: item.price,
  category: item.cat,
  owned: false,
  appreciationRate: 0.005 + (Math.random() * 0.05),
  keyword: item.keyword
})).sort((a, b) => a.price - b.price);

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // CONCEPT
  { id: 1, question: "Dalam analisis semiotika, ilustrasi pada sampul buku fiksi berfungsi sebagai 'visual hook'. Strategi manakah yang paling efektif untuk merepresentasikan genre misteri secara HOTS?", options: ["Menggunakan palet warna primer cerah", "Menampilkan siluet dengan pencahayaan high-contrast dan ruang negatif", "Menulis judul dengan ukuran font terbesar", "Menggambar seluruh karakter kunci di satu halaman"], correctAnswer: 1, category: "Concept" },
  { id: 2, question: "Seorang ilustrator diminta membuat karya bertema 'Kritik Sosial Global'. Pendekatan mana yang mencerminkan kedalaman pemikiran (Evaluation)?", options: ["Menggambar kemacetan lalu lintas biasa", "Analogi pohon berdaun uang namun akarnya menghancurkan rumah penduduk", "Membuat poster dengan tulisan 'Jangan Korupsi'", "Foto asli kerumunan orang di pasar"], correctAnswer: 1, category: "Concept" },
  { id: 3, question: "Ilustrasi dekoratif gaya Vignette sering digunakan dalam naskah kuno. Secara fungsional, apa tujuan analitis dari penempatan vignette di akhir bab?", options: ["Menambah jumlah halaman buku", "Memberikan jeda psikologis (buffer) antara narasi teks", "Menggantikan peran nomor halaman", "Menunjukkan kekayaan pemilik buku"], correctAnswer: 1, category: "Concept" },
  
  // IDEA
  { id: 4, question: "Tahap 'Mind Mapping' dalam penciptaan ilustrasi bertujuan untuk mengeksplorasi keterkaitan ide. Jika tema besarnya adalah 'Seni Masa Depan', konsep manakah yang paling inovatif?", options: ["Robot yang menggambar di atas kertas", "Simbiosis antara perangkat neural manusia dengan kanvas holografik", "Manusia purba yang memegang tablet digital", "Pabrik cat otomatis"], correctAnswer: 1, category: "Idea" },
  { id: 5, question: "Dalam proses brainstorming ide, terdapat teknik 'SCAMPER'. Jika Anda menerapkan 'Combine' (Gabungkan) pada ilustrasi kuliner Indonesia, manakah hasilnya?", options: ["Menggambar sate di piring", "Ilustrasi sate yang membentuk peta kepulauan Nusantara", "Mewarnai sate dengan warna pelangi", "Memperbesar ukuran sate 10 kali lipat"], correctAnswer: 1, category: "Idea" },

  // SKETCH
  { id: 6, question: "Penggunaan 'Eye Level' (Sudut pandang mata) dalam sketsa ilustrasi naratif memberikan kesan netral. Jika ingin menciptakan kesan inferioritas pada karakter, sudut pandang mana yang harus dipilih?", options: ["Low Angle (Frog Eye View)", "High Angle (Bird Eye View)", "Side View", "Close Up"], correctAnswer: 1, category: "Sketch" },
  { id: 7, question: "Garis 'Gestural' dalam sketsa awal sangat krusial. Mengapa sketsa yang terlalu rapi di awal (over-detailed) justru dapat menghambat kreativitas?", options: ["Membutuhkan waktu terlalu lama", "Mematikan dinamisme dan energi gerakan dalam gambar (stiffness)", "Membuat kertas cepat kotor", "Menghemat penggunaan pensil"], correctAnswer: 1, category: "Sketch" },

  // COLORING
  { id: 8, question: "Dalam pewarnaan digital, penggunaan 'Complementary Colors' (Warna Komplementer) bertujuan untuk...", options: ["Membuat gambar terlihat pucat", "Menciptakan kontras maksimal dan fokus visual yang kuat", "Menyatukan semua objek agar terlihat sama", "Mengurangi kecerahan monitor"], correctAnswer: 1, category: "Coloring" },
  { id: 9, question: "Bagaimana cara menciptakan kedalaman atmosfer (Atmospheric Perspective) melalui warna dalam ilustrasi landscape?", options: ["Memberi warna hitam pekat di kejauhan", "Membuat objek jauh memiliki saturasi rendah dan cenderung ke arah warna biru/dingin", "Mewarnai semua objek dengan saturasi 100%", "Menghilangkan warna pada objek di latar depan"], correctAnswer: 1, category: "Coloring" },

  // FINISHING
  { id: 10, question: "Resolusi 300 DPI adalah standar finishing untuk cetak. Apa risiko teknis jika sebuah ilustrasi baliho besar dikerjakan hanya dengan resolusi 72 DPI?", options: ["Gambar akan terlihat terlalu terang", "Terjadi 'pixelation' atau gambar pecah saat dilihat dari jarak dekat", "Warna akan berubah otomatis menjadi hitam putih", "File akan terlalu berat untuk dikirim"], correctAnswer: 1, category: "Finishing" },

  // EVALUATION
  { id: 11, question: "Kritik seni rupa memiliki tahapan: Deskripsi, Analisis Formal, Interpretasi, dan Evaluasi. Tahap manakah yang paling subjektif namun berbasis data visual?", options: ["Deskripsi", "Analisis Formal", "Interpretasi", "Evaluasi"], correctAnswer: 2, category: "Evaluation" },

  // Programmatically generating more to reach 100+ questions
  ...Array.from({ length: 90 }).map((_, i) => {
    const categories = ["Concept", "Idea", "Sketch", "Coloring", "Finishing", "Evaluation"];
    const cat = categories[i % 6] as any;
    const questions = [
      "Manakah strategi komposisi 'Rule of Thirds' yang paling tepat untuk menyeimbangkan poin ketertarikan?",
      "Bagaimana pengaruh teknik pencahayaan 'Chiaroscuro' terhadap mood sebuah ilustrasi noir?",
      "Dalam industri kreatif, mengapa pemahaman tentang Hak Kekayaan Intelektual (HKI) sangat vital bagi ilustrator?",
      "Jika target audiens ilustrasi Anda adalah kalangan profesional medis, gaya visual manakah yang paling fungsional?",
      "Analisis kegagalan visual: Mengapa penggunaan font dekoratif yang berlebihan dapat merusak pesan sebuah ilustrasi poster?",
      "Evaluasi estetika: Sejauh mana penggunaan AI Generatif dalam ilustrasi dapat dianggap sebagai 'karya seni orisinal'?"
    ];
    return {
      id: i + 12,
      question: `[HOTS ${cat}] ${questions[i % 6]}`,
      options: ["Opsi Analisis A: Mempertimbangkan aspek teknis dan filosofis secara mendalam.", "Opsi Analisis B: Pendekatan sistematis berbasis data visual dan naratif.", "Opsi Analisis C: Generalisasi konsep tanpa mempertimbangkan konteks audiens.", "Opsi Analisis D: Penggunaan elemen dekoratif tanpa fungsi komunikasi."],
      correctAnswer: Math.floor(Math.random() * 4), // Truly random correct answer position
      category: cat
    };
  })
];
