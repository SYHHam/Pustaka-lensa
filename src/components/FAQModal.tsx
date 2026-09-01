import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  X, 
  BookOpen, 
  Sparkles, 
  Send,
  MessageCircleQuestion,
  FileCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const OFFICIAL_FAQS: FAQItem[] = [
  // Tentang Platform
  {
    id: 'tp-1',
    category: 'Tentang Platform',
    question: 'Apa itu Pustaka Lensa?',
    answer: 'Pustaka Lensa adalah platform buku digital edukatif yang terbuka untuk semua kalangan, menyediakan koleksi e-book berkualitas untuk siapa saja yang ingin terus belajar — kapan saja dan di mana saja.',
  },
  {
    id: 'tp-2',
    category: 'Tentang Platform',
    question: 'Apakah Pustaka Lensa gratis?',
    answer: 'Sebagian besar koleksi di Pustaka Lensa dapat diakses secara gratis untuk mendukung akses literasi terbuka masyarakat luas.',
  },
  {
    id: 'tp-3',
    category: 'Tentang Platform',
    question: 'Apakah saya bisa upload buku saya sendiri ke Pustaka Lensa?',
    answer: 'Tidak. Pustaka Lensa adalah platform tertutup — seluruh koleksi buku diunggah dan dikurasi langsung oleh tim internal Pustaka Lensa untuk memastikan kualitas dan kredibilitas kontennya. Pengguna dapat membaca, menyimpan, memberi rating, dan meninggalkan komentar.',
  },
  {
    id: 'tp-4',
    category: 'Tentang Platform',
    question: 'Buku-buku di Pustaka Lensa membahas topik apa saja?',
    answer: 'Beragam kategori edukatif terkurasi, di antaranya: Pengembangan Diri, Bisnis & Kewirausahaan, Sains & Teknologi, Sejarah & Budaya, Keterampilan Kerja, Kesehatan & Gaya Hidup, serta Bahasa & Sastra.',
  },
  {
    id: 'tp-5',
    category: 'Tentang Platform',
    question: 'Siapa yang bisa menggunakan Pustaka Lensa?',
    answer: 'Semua orang, dari segala usia dan latar belakang — pelajar, mahasiswa, profesional, maupun masyarakat umum yang ingin membaca dan belajar lebih banyak.',
  },
  {
    id: 'tp-6',
    category: 'Tentang Platform',
    question: 'Apakah Pustaka Lensa menggunakan AI?',
    answer: 'Ya, secara terbuka kami sampaikan bahwa platform ini dibangun secara kolaboratif dengan bantuan AI, baik dalam proses desain maupun sebagian penyusunan konten. Namun, setiap konten yang melibatkan AI tetap melalui proses verifikasi ketat terhadap sumber-sumber terpercaya dan disesuaikan dengan kaidah edukatif sebelum ditinjau dan dipublikasikan oleh tim — bukan asal generate lalu langsung diterbitkan.',
  },

  // Akun & Penggunaan
  {
    id: 'ak-1',
    category: 'Akun & Penggunaan',
    question: 'Bagaimana cara mulai membaca di Pustaka Lensa?',
    answer: 'Daftar atau masuk ke akun Anda, jelajahi koleksi buku melalui katalog Beranda atau Jelajahi, lalu pilih buku yang ingin dibaca dan klik tombol "Mulai Membaca".',
  },
  {
    id: 'ak-2',
    category: 'Akun & Penggunaan',
    question: 'Apakah saya perlu login untuk membaca buku?',
    answer: 'Ya, login diperlukan agar progres bacaan, buku yang disimpan di rak, target membaca harian, dan riwayat baca Anda tersimpan secara presisi di profil masing-masing.',
  },
  {
    id: 'ak-3',
    category: 'Akun & Penggunaan',
    question: 'Bagaimana cara melanjutkan buku yang belum selesai dibaca?',
    answer: 'Progres baca Anda tersimpan otomatis. Cukup buka halaman Beranda atau Dashboard, lalu pilih buku pada bagian "Lanjutkan Membaca" — Anda akan langsung diarahkan ke bab dan lembaran terakhir yang sedang dibaca.',
  },
  {
    id: 'ak-4',
    category: 'Akun & Penggunaan',
    question: 'Apa itu "Target Membaca Harian"?',
    answer: 'Fitur yang membantu Anda membangun kebiasaan membaca secara konsisten — Anda dapat memantau dan menyelesaikan target durasi dan bab membaca per hari sesuai kemampuan dan kesibukan.',
  },
  {
    id: 'ak-5',
    category: 'Akun & Penggunaan',
    question: 'Apakah saya bisa membaca buku secara offline?',
    answer: 'Pustaka Lensa dirancang sebagai web reader modern dengan sinkronisasi penyimpanan lokal otomatis di peramban (browser) perangkat Anda.',
  },

  // Fitur Membaca
  {
    id: 'fm-1',
    category: 'Fitur Membaca',
    question: 'Apakah saya bisa mengubah ukuran atau jenis huruf saat membaca?',
    answer: 'Bisa! Di dalam Reader Mode, tersedia pengaturan ukuran huruf (slider kontinu), pemilihan font tipografi (Source Serif, Literata, Lora, Garamond, Merriweather, Plus Jakarta Sans), jarak spasi baris, serta tema Terang & Gelap (Dark Mode).',
  },
  {
    id: 'fm-2',
    category: 'Fitur Membaca',
    question: 'Bagaimana cara berpindah bab saat membaca?',
    answer: 'Buka panel Daftar Isi (ikon list/buku) di dalam Reader Mode untuk melompat langsung ke bab mana pun yang Anda inginkan dengan satu klik.',
  },
  {
    id: 'fm-3',
    category: 'Fitur Membaca',
    question: 'Apakah saya bisa menandai halaman tertentu secara manual?',
    answer: 'Bisa, gunakan fitur tombol Bookmark pita yang tersedia di panel pembaca untuk menyematkan penanda manual pada bab atau halaman favorit Anda.',
  },

  // Rating & Komentar
  {
    id: 'rk-1',
    category: 'Rating & Komentar',
    question: 'Apakah saya bisa memberi rating dan komentar pada buku?',
    answer: 'Bisa. Pada lembar detail buku, Anda dapat memberikan penilaian bintang (1-5) dan menuliskan ulasan atau pandangan Anda untuk membantu pembaca lainnya.',
  },
  {
    id: 'rk-2',
    category: 'Rating & Komentar',
    question: 'Apakah komentar saya bisa diedit atau dihapus?',
    answer: 'Ulasan Anda ditampilkan secara transparan bersama nama dan foto profil Anda dalam komunitas pembaca Pustaka Lensa.',
  },

  // Bantuan Lainnya
  {
    id: 'bl-1',
    category: 'Bantuan Lainnya',
    question: 'Saya menemukan kendala teknis, ke mana saya bisa melapor?',
    answer: 'Anda dapat mengirimkan pesan langsung melalui menu Pusat Bantuan (Help Center) atau form Feedback & Masukan di menu Pengaturan.',
  },
  {
    id: 'bl-2',
    category: 'Bantuan Lainnya',
    question: 'Bagaimana cara mengelola atau mengubah profil akun?',
    answer: 'Buka menu Pengaturan -> Setting Akun untuk mengubah nama pengguna (1x per bulan), memperbarui foto profil/avatar, mengganti kata sandi, atau keluar akun.',
  },
];

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('tp-1');

  if (!isOpen) return null;

  const filteredFaqs = OFFICIAL_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageCircleQuestion className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-gray-900">
                Tanya Jawab (FAQ)
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Pertanyaan umum seputar penggunaan Pustaka Lensa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search in FAQ */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pertanyaan seputar bacaan, akun, fitur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-full text-xs font-sans focus:outline-none focus:border-neutral-900 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="p-4 sm:p-6 pt-2 overflow-y-auto space-y-3 flex-1">
          {filteredFaqs.map((faq) => {
            const isOpenAccordion = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpenAccordion ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-sans font-bold text-amber-600 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-gray-900">
                      {faq.question}
                    </h4>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpenAccordion ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpenAccordion && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 pt-1 bg-white border-t border-gray-100"
                    >
                      <p className="text-xs text-gray-600 font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400">
              Tidak ada pertanyaan yang sesuai dengan kata kunci pencarian.
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-center gap-2 text-xs text-gray-500">
          <FileCheck2 className="w-4 h-4 text-emerald-500" />
          <span>Siap diperbarui dengan dokumen naskah FAQ aslimu kapan saja!</span>
        </div>
      </div>
    </div>
  );
};
