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

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Akses & Biaya',
    question: 'Apakah seluruh buku di Pustaka Lensa benar-benar gratis?',
    answer: 'Ya, 100% gratis tanpa biaya tersembunyi. Seluruh karya klasik, ringkasan pemikiran, dan buku kurasi di sini ditujukan sebagai arsip literasi terbuka yang dapat diakses oleh siapa saja.',
  },
  {
    id: '2',
    category: 'Membaca',
    question: 'Bagaimana cara menyimpan progres halaman terakhir saya?',
    answer: 'Aplikasi ini secara otomatis mencatat bab dan persentase bacaanmu saat kamu membuka buku. Kamu juga dapat menekan tombol Bookmark manual di dalam lembar bacaan untuk penanda khusus.',
  },
  {
    id: '3',
    category: 'Fitur Reader',
    question: 'Bisakah saya mengubah ukuran huruf atau tema gelap?',
    answer: 'Tentu! Di pojok kanan atas lembar bacaan terdapat ikon pengaturan (huruf Aa) untuk mengatur continuous font size, jenis tipografi (Literata, Lora, Garamond, dsb.), dan mode gelap.',
  },
  {
    id: '4',
    category: 'Kustomisasi Konten',
    question: 'Kapan dokumen FAQ resmi saya akan dimasukkan?',
    answer: 'Begitu dokumen resmi kamu kirimkan, kami akan langsung memperbarui seluruh butir pertanyaan dan jawaban di panel ini secara presisi dan terstruktur!',
  },
];

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('1');

  if (!isOpen) return null;

  const filteredFaqs = DEFAULT_FAQS.filter(
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
