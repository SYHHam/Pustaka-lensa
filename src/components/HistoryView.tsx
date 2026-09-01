import React from 'react';
import { Clock, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { Book } from '../types';

interface HistoryViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  books,
  onSelectBook,
}) => {
  const historyBooks = books.filter(b => b.progress > 0 || b.status === 'finished');

  return (
    <div id="history-view-root" className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Riwayat Bacaan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-sans">
          Jejak langkah aktivitas membaca dan bab-bab yang telah kamu pelajari.
        </p>
      </div>

      {historyBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center text-gray-500 space-y-2 shadow-xs">
          <p className="font-sans text-base font-bold text-gray-900">Belum Ada Riwayat</p>
          <p className="text-xs font-sans">Mulai membaca salah satu buku untuk melihat riwayat aktivitas di sini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/70 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {historyBooks.map((book, idx) => (
            <div 
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Book Thumb & Details */}
              <div className="flex items-center gap-4 min-w-0">
                <div 
                  className="w-12 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-xs"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <BookOpen className="w-5 h-5 opacity-90" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-sans font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                      {book.category}
                    </span>
                    {book.status === 'finished' ? (
                      <span className="text-[11px] font-sans font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    ) : (
                      <span className="text-[11px] font-sans text-gray-500 font-medium">
                        {book.progress}% selesai
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-sans font-bold text-gray-900 truncate group-hover:text-black transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate font-sans">
                    {book.author} · Terakhir dibuka: {idx === 0 ? 'Hari ini, 15:40' : `${idx + 1} hari lalu`}
                  </p>
                </div>
              </div>

              {/* Right arrow */}
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 group-hover:bg-neutral-900 group-hover:text-white transition-all flex items-center justify-center shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
