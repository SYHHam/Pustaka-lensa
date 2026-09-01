import { Book } from '../types';

export const DUMMY_QUOTES = [
  "Membaca adalah jendela dunia yang tak pernah tertutup.",
  "Buku adalah kapal yang membawa kita menjelajahi samudra pengetahuan tak bertepi.",
  "Satu jam membaca adalah obat paling mujarab untuk meredakan keriuhan pikiran.",
  "Pikiran yang terlatih membaca akan selalu menemukan jalan di tengah kebuntuan.",
  "Membaca bukan sekadar mengisi waktu, melainkan menyalakan lentera jiwa.",
  "Dalam setiap lembaran terdapat kebijaksanaan abadi yang menanti untuk dipahami.",
  "Buku yang baik adalah sahabat karib yang tak pernah berkhianat.",
  "Ketenangan sejati bermula ketika kita larut dalam keindahan untaian kata.",
  "Setiap buku baru adalah kehidupan kedua yang dianugerahkan kepada pembacanya."
];

export const CATEGORIES = [
  "Semua Kategori",
  "Pengembangan Diri",
  "Bisnis & Kewirausahaan",
  "Sains & Teknologi",
  "Keterampilan Kerja",
  "Kesehatan & Gaya Hidup",
  "Bahasa & Sastra",
  "Filsafat & Kebijaksanaan"
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'filosofi-teras',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    category: 'Pengembangan Diri',
    coverColor: '#2D3748',
    accentColor: '#4A5568',
    synopsisShort: 'Panduan praktis filsafat Stoa kuno untuk melatih mental tangguh, mengendalikan emosi negatif, dan meraih ketenangan batin di zaman modern yang serba bising.',
    synopsisFull: 'Filosofi Teras adalah pengantar filosofi Stoa yang disajikan secara segar, relevan, dan membumi untuk pembaca Indonesia modern. Melalui konsep Dikotomi Kendali (Dichotomy of Control), buku ini mengajarkan kita untuk membedakan dengan tegas hal-hal yang berada di bawah kendali kita dan hal-hal yang berada di luar kendali kita. Dengan memahami batas kendali ini, kita dapat membebaskan diri dari rasa cemas berlebih, amarah yang sia-sia, serta ketergantungan pada pengakuan eksternal. Sebuah karya esensial bagi siapa saja yang mendambakan ketenangan pikiran di tengah dinamika dunia yang kerap tak menentu.',
    pageCount: 320,
    estimatedReadTime: '~5.5 jam baca',
    rating: 4.8,
    ratingCount: 342,
    ratingBreakdown: { 5: 280, 4: 45, 3: 12, 2: 3, 1: 2 },
    status: 'reading',
    progress: 65,
    currentChapterIndex: 1,
    currentPageIndex: 0,
    isSaved: true,
    isNew: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Rian Anggara',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Buku yang benar-benar mengubah cara saya memandang masalah pekerjaan. Konsep dikotomi kendali sangat praktis diaplikasikan setiap hari.',
        timeAgo: '2 hari lalu'
      },
      {
        id: 'c2',
        authorName: 'Siti Rahmawati',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Gaya bahasanya renyah dan tidak kaku seperti buku filsafat pada umumnya. Sangat merekomendasikan untuk siapa pun yang sering overthinking.',
        timeAgo: '5 hari lalu'
      },
      {
        id: 'c3',
        authorName: 'Dimas Wicaksono',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 4,
        content: 'Ilustrasi dan analoginya sangat kena. Membaca bab tentang mengendalikan respon mental membuat saya jauh lebih tenang.',
        timeAgo: '1 minggu lalu'
      }
    ],
    chapters: [
      {
        id: 'ft-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Mengapa Kita Mudah Khawatir?',
        subtitle: 'Akar dari Kegalauan Pikiran Manusia Modern',
        content: `Pernahkah Anda merasa cemas yang luar biasa saat menunggu balasan pesan penting? Atau merasa hari Anda seketika rusak hanya karena macet di jalan raya atau perkataan sepintas dari rekan kerja? Kita hidup di era di mana stimulus informasi mengalir tanpa henti, membawa serta ratusan hal kecil yang siap memicu kepanikan di dalam kepala kita.

Filsafat Stoa, yang lahir lebih dari dua ribu tahun silam di Yunani dan Roma kuno, tidak dimulai dari menara gading teori yang abstrak. Para filsuf Stoa seperti Zeno, Epictetus, Seneca, dan Marcus Aurelius adalah orang-orang yang bergulat langsung dengan realitas keras kehidupan—mulai dari perbudakan, pengasingan, hingga intrik politik kekaisaran.

Tujuan utama Filosofi Teras bukan untuk menghilangkan emosi secara total atau menjadikan kita manusia tanpa perasaan seperti robot. Sebaliknya, tujuannya adalah melatih kepekaan kita agar tidak diperbudak oleh nafsu liar dan persepsi keliru yang kita ciptakan sendiri di dalam pikiran kita.`
      },
      {
        id: 'ft-ch2',
        chapterNumber: 2,
        title: 'Bab 2 — Dikotomi Kendali',
        subtitle: 'Memilah Batas Nyata Antara Kuasa dan Harapan',
        content: `Inti paling fundamental dari seluruh ajaran Filosofi Teras dapat diringkas dalam satu prinsip sederhana namun revolusioner: Dikotomi Kendali (Dichotomy of Control). Epictetus, seorang mantan budak yang kemudian menjadi guru filsafat ternama, mengawali risalahnya dengan kalimat tegas: "Ada hal-hal yang berada di bawah kendali kita, dan ada hal-hal yang tidak berada di bawah kendali kita."

Hal-hal yang berada di bawah kendali kita meliputi: pertimbangan kita, dorongan kehendak, hasrat, penolakan, dan dengan kata lain, segala hal yang merupakan tindakan kita sendiri. 

Sebaliknya, hal-hal yang berada di luar kendali kita mencakup: tubuh kita, harta benda kita, reputasi kita, jabatan publik, dan tindakan orang lain.

Kapan pun kita menggantungkan kebahagiaan atau ketenangan batin pada hal-hal yang berada di luar kendali kita, kita sedang menyerahkan kemerdekaan jiwa kita kepada nasib dan kehendak orang lain. Inilah pintu masuk utama dari kekecewaan, keputusasaan, dan kemarahan.`
      },
      {
        id: 'ft-ch3',
        chapterNumber: 3,
        title: 'Bab 3 — Membingkai Ulang Persepsi',
        subtitle: 'Bukan Kejadian yang Mengganggu Kita, Melainkan Makna yang Kita Berikan',
        content: `Marcus Aurelius dalam buku hariannya 'Meditations' menulis: "Singkirkan penilaianmu, maka rasa terluka akan hilang seketika. Singkirkan rasa terluka, maka luka itu sendiri lenyap."

Kejadian di alam semesta ini pada dasarnya bersikap netral. Hujan deras yang mengguyur kota tidak berniat membuat Anda kesal; ia hanya hukum alam fisika yang bekerja. Macetnya lalu lintas tidak sedang berkomplot melawan Anda; ia adalah konsekuensi wajar dari ribuan kendaraan yang melintas bersamaan.

Yang menjadikan suatu kejadian terasa 'buruk', 'menyebalkan', atau 'menghancurkan' adalah opini dan interpretasi yang secara sadar kita tempelkan pada peristiwa tersebut. Saat Anda mampu memisahkan fakta telanjang dari drama interpretasi pikiran, Anda akan menemukan ketenangan yang tak tergoyahkan.`
      }
    ]
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Pengembangan Diri',
    coverColor: '#1A365D',
    accentColor: '#2B6CB0',
    synopsisShort: 'Perubahan luar biasa berakar dari kebiasaan-kebiasaan kecil (atomik) yang konsisten. Temukan cara membangun kebiasaan baik dan meruntuhkan kebiasaan buruk dengan 4 Hukum Perubahan Perilaku.',
    synopsisFull: 'Perubahan kecil yang tampaknya sepele hari ini dapat berlipat ganda menjadi hasil yang luar biasa di masa depan jika diulang secara konsisten. James Clear memaparkan strategi berbasis ilmu kognitif dan perilaku untuk membentuk kebiasaan positif dan membuang kebiasaan merusak. Buku ini membongkar mitos bahwa perubahan besar membutuhkan motivasi heroik, dan menggantinya dengan pendekatan sistematis melalui 4 Hukum Perubahan Perilaku: Menjadikannya Terlihat, Menjadikannya Menarik, Menjadikannya Mudah, dan Menjadikannya Memuaskan.',
    pageCount: 352,
    estimatedReadTime: '~6 jam baca',
    rating: 4.9,
    ratingCount: 512,
    ratingBreakdown: { 5: 460, 4: 42, 3: 8, 2: 1, 1: 1 },
    status: 'reading',
    progress: 40,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: true,
    isNew: false,
    comments: [
      {
        id: 'ac1',
        authorName: 'Fajar Nugroho',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Metode habit stacking dan aturan 2 menit benar-benar berhasil mengubah rutinitas pagi saya secara drastis!',
        timeAgo: '1 hari lalu'
      },
      {
        id: 'ac2',
        authorName: 'Nadia Safira',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Buku wajib untuk siapa saja yang ingin memperbaiki kualitas hidup tanpa merasa kewalahan.',
        timeAgo: '4 hari lalu'
      }
    ],
    chapters: [
      {
        id: 'ah-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Kekuatan Dahsyat Kebiasaan Atomik',
        subtitle: 'Mengapa Peningkatan 1% Setiap Hari Menghasilkan Transformasi Raksasa',
        content: `Sangat mudah melebih-lebihkan pentingnya satu momen penentu dan meremehkan nilai membuat perbaikan kecil setiap hari. Kita sering meyakinkan diri sendiri bahwa kesuksesan besar membutuhkan tindakan besar. Baik itu menurunkan berat badan, membangun bisnis, menulis buku, atau mencapai tujuan lainnya, kita menekan diri kita untuk melakukan perbaikan yang mengguncang bumi agar semua orang membicarakannya.

Namun perbaikan 1% sering kali tidak terlihat atau bahkan terasa sama sekali dalam jangka pendek. Tetapi dalam jangka panjang, dampaknya bisa sangat mengejutkan. Jika Anda bisa menjadi 1% lebih baik setiap hari selama satu tahun, Anda akan berakhir 37 kali lebih baik pada saat tahun itu berakhir.

Sebaliknya, jika Anda menjadi 1% lebih buruk setiap hari selama satu tahun, Anda akan merosot hampir ke titik nol. Apa yang dimulai sebagai kemenangan kecil atau kemunduran sepele akan terakumulasi menjadi sesuatu yang jauh lebih masif.`
      },
      {
        id: 'ah-ch2',
        chapterNumber: 2,
        title: 'Bab 2 — Kebiasaan Berbasis Identitas',
        subtitle: 'Ubah Siapa Diri Anda, Bukan Hanya Apa yang Ingin Anda Capai',
        content: `Banyak orang memulai proses perubahan kebiasaan dengan berfokus pada HASIL yang ingin mereka capai. Ini membawa kita pada kebiasaan berbasis hasil. Alternatifnya adalah membangun kebiasaan berbasis IDENTITAS. Dengan pendekatan ini, kita mulai dengan berfokus pada ingin menjadi ORANG SEPERTI APA kita nanti.

Bayangkan dua orang yang menolak sebatang rokok. Ketika ditawari rokok, orang pertama berkata: "Tidak, terima kasih. Saya sedang mencoba berhenti merokok." Ini terdengar masuk akal, tetapi orang ini masih percaya bahwa ia adalah seorang perokok yang sedang berusaha melakukan hal lain.

Orang kedua menolak dengan berkata: "Tidak, terima kasih. Saya bukan perokok." Perbedaan kecil dalam kata-kata ini menandakan pergeseran identitas yang mendasar. Merokok adalah bagian dari kehidupan masa lalunya, bukan masa kininya.`
      }
    ]
  },
  {
    id: 'psikologi-uang',
    title: 'Psikologi Uang: Pelajaran Abadi Kekayaan',
    author: 'Morgan Housel',
    category: 'Bisnis & Kewirausahaan',
    coverColor: '#2C3E50',
    accentColor: '#34495E',
    synopsisShort: 'Kesuksesan finansial bukan melulu soal kepintaran matematika atau rumus investasi, melainkan bagaimana Anda mengendalikan perilaku dan emosi terhadap uang.',
    synopsisFull: 'Melalui 19 cerita pendek yang memikat, Morgan Housel mengeksplorasi cara-cara aneh bagaimana manusia berpikir tentang uang dan mengajarkan cara mengelola finansial dengan lebih bijak. Sukses dengan uang bukanlah tentang apa yang Anda ketahui, tetapi tentang bagaimana Anda berperilaku. Dan perilaku adalah hal yang sulit diajarkan, bahkan kepada orang yang sangat pintar sekalipun.',
    pageCount: 280,
    estimatedReadTime: '~4.8 jam baca',
    rating: 4.7,
    ratingCount: 289,
    ratingBreakdown: { 5: 220, 4: 50, 3: 14, 2: 3, 1: 2 },
    status: 'reading',
    progress: 25,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: true,
    isNew: false,
    comments: [
      {
        id: 'pu1',
        authorName: 'Hendra Gunawan',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Buku finansial terbaik yang pernah saya baca. Tidak ada rumus rumit, hanya kebijaksanaan hidup nyata.',
        timeAgo: '3 hari lalu'
      }
    ],
    chapters: [
      {
        id: 'pu-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Tidak Ada Orang yang Gila',
        subtitle: 'Pengalaman Pribadi Membentuk Cara Kita Memandang Uang',
        content: `Pengalaman pribadi Anda dengan uang mungkin hanya mencakup 0,00000001% dari apa yang terjadi di dunia, tetapi mungkin membentuk 80% dari cara Anda berpikir tentang bagaimana dunia bekerja.

Itulah mengapa orang-orang yang sama pintarnya bisa memiliki pandangan yang sangat bertolak belakang tentang bagaimana dan mengapa uang harus diinvestasikan atau dibelanjakan. Seseorang yang tumbuh dalam masa inflasi tinggi akan memandang pasar finansial dengan kacamata yang sama sekali berbeda dibandingkan orang yang tumbuh dalam masa pertumbuhan ekonomi yang stabil.`
      }
    ]
  },
  {
    id: 'seni-berbicara',
    title: 'Seni Berbicara Kepada Siapa Saja',
    author: 'Larry King',
    category: 'Keterampilan Kerja',
    coverColor: '#4A3B32',
    accentColor: '#7A6253',
    synopsisShort: 'Rahasia berkomunikasi dengan percaya diri, memecah kecanggungan, dan membangun koneksi mendalam dalam setiap perjumpaan personal maupun profesional.',
    synopsisFull: 'Larry King membagikan rahasia komunikasinya yang telah diasah selama puluhan tahun mewawancarai ribuan tokoh terkemuka dunia. Kunci utama dari percakapan yang hidup dan berkesan bukan terletak pada kepandaian berkata-kata semata, melainkan pada ketulusan mendengar dan rasa ingin tahu yang mendalam terhadap lawan bicara kita.',
    pageCount: 240,
    estimatedReadTime: '~4 jam baca',
    rating: 4.6,
    ratingCount: 195,
    ratingBreakdown: { 5: 140, 4: 42, 3: 10, 2: 2, 1: 1 },
    status: 'not_started',
    progress: 0,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: false,
    isNew: false,
    comments: [
      {
        id: 'sb1',
        authorName: 'Kartika Sari',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Sangat membantu untuk introver yang sering canggung memulai obrolan dengan orang baru.',
        timeAgo: '1 minggu lalu'
      }
    ],
    chapters: [
      {
        id: 'sb-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Bicara dari Ketulusan',
        subtitle: 'Mendengarkan adalah Separuh Keberhasilan Komunikasi',
        content: `Tidak ada orang yang pernah belajar sesuatu saat mereka sedang berbicara. Saya mengingatkan diri saya setiap pagi: tidak ada hal yang saya katakan hari ini yang akan mengajarkan saya sesuatu yang baru. Jadi jika saya ingin belajar hari ini, saya harus mendengarkan.

Banyak orang mengira pembicara yang hebat adalah mereka yang bisa mendominasi panggung dan mengalirkan kata-kata tanpa jeda. Kenyataan sesungguhnya adalah bahwa pendengar yang baik jauh lebih memikat dan langka daripada pembicara yang fasih.`
      }
    ]
  },
  {
    id: 'berani-tidak-disukai',
    title: 'Berani Tidak Disukai',
    author: 'Ichiro Kishimi & Fumitake Koga',
    category: 'Filsafat & Kebijaksanaan',
    coverColor: '#3D3A37',
    accentColor: '#5C5753',
    synopsisShort: 'Fenomena global dari Jepang yang mengajarkan kebebasan batin melalui dialog filosofis psikologi Adler: membebaskan diri dari ekspektasi orang lain.',
    synopsisFull: 'Menggunakan dialog intim antara seorang pemuda yang ragu dengan seorang filsuf bijak di tepi kota, buku ini menguraikan konsep psikologi Alfred Adler yang revolusioner. Adler meyakini bahwa masa lalu tidak menentukan masa depan kita, bahwa semua masalah manusia pada hakikatnya adalah masalah hubungan interpersonal, dan bahwa kebebasan sejati tercapai saat kita memiliki keberanian untuk tidak disukai orang lain.',
    pageCount: 320,
    estimatedReadTime: '~5.5 jam baca',
    rating: 4.8,
    ratingCount: 420,
    ratingBreakdown: { 5: 350, 4: 55, 3: 12, 2: 2, 1: 1 },
    status: 'finished',
    progress: 100,
    currentChapterIndex: 2,
    currentPageIndex: 0,
    isSaved: true,
    isNew: false,
    comments: [
      {
        id: 'bd1',
        authorName: 'Arif Prasetya',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Format dialog Socrates-nya sangat menarik. Membaca buku ini seperti sedang berkonsultasi langsung dengan guru bijak.',
        timeAgo: '2 minggu lalu'
      }
    ],
    chapters: [
      {
        id: 'bd-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Menolak Trauma Masa Lalu',
        subtitle: 'Teleologi Melawan Etiologi',
        content: `Filsuf: Adler mengajarkan bahwa dalam psikologi individu, kita tidak berfokus pada penyebab masa lalu (etiologi), melainkan pada tujuan masa kini (teleologi).

Pemuda: Bagaimana mungkin? Jika seseorang dikurung di kamar oleh orang tuanya saat kecil, bukankah wajar jika ia menjadi takut keluar rumah saat dewasa?

Filsuf: Menurut Adler, orang tersebut tidak takut keluar rumah KARENA trauma masa kecilnya. Sebaliknya, ia MEMILIH rasa takut itu sebagai sarana untuk mencapai tujuannya saat ini—yaitu tetap berada di dalam ruangan agar diperhatikan dan dilindungi oleh orang sekitarnya.`
      }
    ]
  },
  {
    id: 'inovasi-algoritma',
    title: 'Inovasi & Algoritma Masa Depan',
    author: 'Dr. Rian Pratama',
    category: 'Sains & Teknologi',
    coverColor: '#203A43',
    accentColor: '#2C5364',
    synopsisShort: 'Eksplorasi mendalam bagaimana kecerdasan artifisial, komputasi kuantum, dan jaringan saraf tiruan sedang merombak lanskap peradaban manusia.',
    synopsisFull: 'Sebuah tinjauan komprehensif dari pakar ilmu komputer mengenai gelombang revolusi kecerdasan buatan. Buku ini membahas fondasi matematis machine learning secara lugas, implikasi etis automatisasi masif, hingga bagaimana manusia dapat bersinergi dengan algoritma generatif untuk mempercepat penemuan sains di bidang kedokteran dan energi bersih.',
    pageCount: 310,
    estimatedReadTime: '~5 jam baca',
    rating: 4.7,
    ratingCount: 160,
    ratingBreakdown: { 5: 120, 4: 32, 3: 6, 2: 1, 1: 1 },
    status: 'not_started',
    progress: 0,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: false,
    isNew: true,
    comments: [
      {
        id: 'ia1',
        authorName: 'Bambang Irawan',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Penjelasan arsitektur transformer dan model neural networks-nya sangat jernih dan mudah dipahami.',
        timeAgo: '3 hari lalu'
      }
    ],
    chapters: [
      {
        id: 'ia-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Fajar Kecerdasan Sintetis',
        subtitle: 'Dari Logika Simbolik Menuju Pembelajaran Mesin Skala Besar',
        content: `Kecerdasan bukanlah sihir; ia adalah proses pemrosesan informasi, pengenalan pola, dan adaptasi terhadap umpan balik lingkungan. Selama puluhan tahun, para ilmuwan mencoba mengkodekan setiap aturan dunia ke dalam sistem komputer baris demi baris.

Namun lompatan terbesar baru terjadi ketika kita membiarkan mesin belajar sendiri dari data dalam jumlah masif melalui arsitektur jaringan saraf tiruan yang meniru plastisitas otak biologis.`
      }
    ]
  },
  {
    id: 'mata-jiwa-senja',
    title: 'Mata Jiwa di Ufuk Senja',
    author: 'Larasati Wibowo',
    category: 'Bahasa & Sastra',
    coverColor: '#4A303D',
    accentColor: '#6B475A',
    synopsisShort: 'Kumpulan prosa liris dan refleksi puitis tentang memori, kepulangan, keheningan, dan makna perjalanan hidup di tanah Nusantara.',
    synopsisFull: 'Larasati Wibowo merajut kata-kata dengan keanggunan luar biasa dalam kumpulan prosa reflektif ini. Mengambil latar pesisir Jawa dan lembah-lembah sunyi di pedalaman, buku ini mengajak pembaca merenungi hubungan manusia dengan alam, rasa kehilangan yang bertransformasi menjadi kekuatan, serta kehangatan perjumpaan yang membekas abadi.',
    pageCount: 220,
    estimatedReadTime: '~3.5 jam baca',
    rating: 4.9,
    ratingCount: 178,
    ratingBreakdown: { 5: 160, 4: 15, 3: 3, 2: 0, 1: 0 },
    status: 'not_started',
    progress: 0,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: false,
    isNew: true,
    comments: [
      {
        id: 'mj1',
        authorName: 'Dewi Lestari',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Setiap kalimatnya seperti puisi yang menyejukkan hati. Sangat cocok dibaca di sore hari sambil menyeruput teh hangat.',
        timeAgo: '4 hari lalu'
      }
    ],
    chapters: [
      {
        id: 'mj-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Di Tepian Rindu yang Mengendap',
        subtitle: 'Menyusuri Jejak Langkah di Pesisir Utara',
        content: `Angin senja membawa aroma garam dan kenangan yang tak pernah benar-benar pupus. Di batas cakrawala, matahari meluncur pelan, menyisakan semburat jingga keemasan yang memantul di atas ombak tenang.

Kita sering kali terburu-buru mengejar apa yang ada di depan mata, hingga lupa bahwa hal-hal paling berharga kerap bersembunyi dalam keheningan yang kita lewati tanpa sempat menyapanya.`
      }
    ]
  },
  {
    id: 'gaya-hidup-minimalis',
    title: 'Gaya Hidup Minimalis Praktis',
    author: 'Kenjiro Sato',
    category: 'Kesehatan & Gaya Hidup',
    coverColor: '#394145',
    accentColor: '#525E64',
    synopsisShort: 'Panduan merampingkan kepemilikan materi, menjernihkan ruang fisik, dan membebaskan energi mental untuk hal-hal yang sungguh bermakna.',
    synopsisFull: 'Minimalisme bukan tentang hidup dalam kekurangan atau memiliki ruangan putih kosong tanpa dekorasi. Minimalisme adalah seni menyingkirkan hal-hal yang tidak esensial agar kita memiliki ruang, waktu, dan energi untuk hal-hal yang benar-benar memberikan nilai sejati dalam kehidupan kita.',
    pageCount: 260,
    estimatedReadTime: '~4.2 jam baca',
    rating: 4.7,
    ratingCount: 215,
    ratingBreakdown: { 5: 170, 4: 35, 3: 8, 2: 1, 1: 1 },
    status: 'not_started',
    progress: 0,
    currentChapterIndex: 0,
    currentPageIndex: 0,
    isSaved: false,
    isNew: true,
    comments: [
      {
        id: 'gh1',
        authorName: 'Yusuf Maulana',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        content: 'Sangat aplikatif dan tidak muluk-muluk. Rumah jadi jauh lebih rapi dan pikiran jadi lebih jernih.',
        timeAgo: '5 hari lalu'
      }
    ],
    chapters: [
      {
        id: 'gh-ch1',
        chapterNumber: 1,
        title: 'Bab 1 — Beban Benda yang Tak Terlihat',
        subtitle: 'Korelasi Antara Kekacauan Fisik dan Beban Pikiran',
        content: `Setiap barang yang Anda miliki menuntut sepotong kecil perhatian mental Anda. Barang tersebut harus dibeli, dibersihkan, dirawat, diperbaiki, disimpan, dan akhirnya dibuang.

Ketika kita dikelilingi oleh ratusan benda yang sebenarnya tidak pernah kita gunakan, otak kita tanpa sadar terus menerus memproses stimulus visual yang melelahkan.`
      }
    ]
  }
];
