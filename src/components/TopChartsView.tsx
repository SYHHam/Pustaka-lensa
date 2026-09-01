import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  Star, 
  BookOpen, 
  ArrowUpRight, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { Book } from '../types';

interface TopChartsViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onNavigateToExplore?: () => void;
}

type LeaderboardPeriod = 'minggu-ini' | 'bulan-ini' | 'sepanjang-masa';
type LeaderboardCategory = 'semua' | 'pengembangan-diri' | 'bisnis' | 'filsafat';

export const TopChartsView: React.FC<TopChartsViewProps> = ({
  books,
  onSelectBook,
  onNavigateToExplore,
}) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('minggu-ini');
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>('semua');

  // Sort books by popularity/rating calculation
  const rankedBooks = [...books].sort((a, b) => {
    const scoreA = a.rating * a.ratingCount;
    const scoreB = b.rating * b.ratingCount;
    return scoreB - scoreA;
  });

  const filteredBooks = rankedBooks.filter((book) => {
    if (selectedCategory === 'semua') return true;
    if (selectedCategory === 'pengembangan-diri') return book.category === 'Pengembangan Diri';
    if (selectedCategory === 'bisnis') return book.category === 'Bisnis & Kewirausahaan';
    if (selectedCategory === 'filsafat') return book.category === 'Filsafat & Pemikiran';
    return true;
  });

  const podium1 = filteredBooks[0];
  const podium2 = filteredBooks[1];
  const podium3 = filteredBooks[2];
  const remainingRanks = filteredBooks.slice(3);

  return (
    <div id="top-charts-view-root" className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Header Banner */}
      <section className="bg-gradient-to-br from-neutral-950 via-zinc-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-amber-900/30">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-sans font-bold border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Papan Peringkat Literasi 2026</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Top Charts & Buku Terpopuler
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
            Daftar karya paling banyak dibaca, diapresiasi, dan diselesaikan oleh komunitas Pustaka Lensa secara real-time.
          </p>
        </div>
      </section>

      {/* Filter Row: Period & Category Tabs */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'semua' as LeaderboardCategory, label: 'Semua Kategori' },
            { id: 'pengembangan-diri' as LeaderboardCategory, label: 'Pengembangan Diri' },
            { id: 'bisnis' as LeaderboardCategory, label: 'Bisnis & Finansial' },
            { id: 'filsafat' as LeaderboardCategory, label: 'Filsafat' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-sans rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full self-start sm:self-auto">
          {[
            { id: 'minggu-ini' as LeaderboardPeriod, label: 'Minggu Ini' },
            { id: 'bulan-ini' as LeaderboardPeriod, label: 'Bulan Ini' },
            { id: 'sepanjang-masa' as LeaderboardPeriod, label: 'All-Time' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 text-xs font-sans rounded-full transition-all cursor-pointer ${
                period === p.id
                  ? 'bg-white text-gray-900 font-bold shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* TOP 3 PODIUM HERO SECTION */}
      {podium1 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
          {/* Rank #2 Podium */}
          {podium2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => onSelectBook(podium2)}
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-full order-2 md:order-1 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 font-sans font-bold text-sm flex items-center justify-center border border-slate-300">
                  #2
                </span>
                <span className="text-[11px] text-emerald-600 font-sans font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +2 Peringkat
                </span>
              </div>

              <div className="flex gap-3.5 items-center mb-4">
                <div 
                  className="w-16 h-22 rounded-xl shadow-md shrink-0 flex flex-col justify-between p-2 text-white text-[8px]"
                  style={{ backgroundColor: podium2.coverColor }}
                >
                  <span className="font-bold opacity-80 uppercase">Top 2</span>
                  <p className="font-display font-bold leading-tight line-clamp-2">{podium2.title}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-sans uppercase font-bold block truncate">
                    {podium2.author}
                  </span>
                  <h3 className="font-display text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                    {podium2.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{podium2.rating}</span>
                    <span className="text-gray-400 text-[10px] font-normal">({podium2.ratingCount})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>⏱️ {podium2.estimatedReadTime}</span>
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  Baca <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          )}

          {/* Rank #1 Champion Podium (Elevated in Center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelectBook(podium1)}
            className="bg-gradient-to-b from-amber-50 via-white to-white rounded-3xl p-6 border-2 border-amber-400/60 shadow-lg cursor-pointer hover:shadow-xl transition-all flex flex-col justify-between order-1 md:order-2 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-black text-[10px] font-sans font-bold px-4 py-1 rounded-bl-2xl shadow-xs flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>JUARA #1 TERLARIS</span>
            </div>

            <div className="flex items-center gap-2 mb-4 pt-2">
              <span className="w-11 h-11 rounded-2xl bg-amber-400 text-black font-sans font-extrabold text-base flex items-center justify-center shadow-md">
                #1
              </span>
              <div>
                <span className="text-xs text-amber-700 font-bold block font-sans">🔥 Sedang Tren Minggu Ini</span>
                <span className="text-[10px] text-gray-400">1.840+ pembaca aktif</span>
              </div>
            </div>

            <div className="flex gap-4 items-center mb-4">
              <div 
                className="w-20 h-28 rounded-2xl shadow-xl shrink-0 flex flex-col justify-between p-2.5 text-white text-[9px] transform group-hover:scale-105 transition-transform"
                style={{ backgroundColor: podium1.coverColor }}
              >
                <span className="font-bold opacity-80 uppercase">No. 1</span>
                <p className="font-display font-bold leading-tight line-clamp-3">{podium1.title}</p>
                <span className="text-[7px] opacity-70 truncate">{podium1.author}</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-gray-400 font-sans uppercase font-bold block truncate">
                  {podium1.author}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                  {podium1.title}
                </h3>
                <p className="text-xs text-gray-500 font-sans line-clamp-2 mt-1">
                  {podium1.synopsisShort}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{podium1.rating}</span>
                  <span className="text-gray-400 text-xs font-normal">({podium1.ratingCount} ulasan)</span>
                </div>
              </div>
            </div>

            <button className="w-full h-10 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
              <span>Buka Bacaan Juara</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Rank #3 Podium */}
          {podium3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => onSelectBook(podium3)}
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-full order-3 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 font-sans font-bold text-sm flex items-center justify-center border border-amber-300">
                  #3
                </span>
                <span className="text-[11px] text-gray-500 font-sans font-medium flex items-center gap-1">
                  ⭐ Stabil di Top 3
                </span>
              </div>

              <div className="flex gap-3.5 items-center mb-4">
                <div 
                  className="w-16 h-22 rounded-xl shadow-md shrink-0 flex flex-col justify-between p-2 text-white text-[8px]"
                  style={{ backgroundColor: podium3.coverColor }}
                >
                  <span className="font-bold opacity-80 uppercase">Top 3</span>
                  <p className="font-display font-bold leading-tight line-clamp-2">{podium3.title}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-sans uppercase font-bold block truncate">
                    {podium3.author}
                  </span>
                  <h3 className="font-display text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                    {podium3.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{podium3.rating}</span>
                    <span className="text-gray-400 text-[10px] font-normal">({podium3.ratingCount})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>⏱️ {podium3.estimatedReadTime}</span>
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  Baca <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          )}
        </section>
      )}

      {/* REMAINING RANKS LIST (#4 to #10) */}
      <section className="space-y-3">
        <h2 className="font-sans text-base font-bold text-gray-900">
          Peringkat Lengkap #{4} s/d #{filteredBooks.length}
        </h2>

        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden divide-y divide-gray-100">
          {remainingRanks.map((book, idx) => {
            const currentRank = idx + 4;
            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rank Number */}
                  <span className="w-8 font-sans font-bold text-base sm:text-lg text-gray-400 text-center shrink-0 group-hover:text-neutral-900 transition-colors">
                    {currentRank}
                  </span>

                  {/* Book Cover Micro */}
                  <div 
                    className="w-12 h-16 rounded-xl shadow-xs shrink-0 flex flex-col justify-between p-1.5 text-white text-[7px]"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <span className="font-bold opacity-75 truncate">{book.author}</span>
                    <p className="font-bold leading-none line-clamp-2">{book.title}</p>
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 font-sans uppercase font-semibold block truncate">
                      {book.author} · {book.category}
                    </span>
                    <h3 className="font-sans text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                      {book.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-sans mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {book.rating}
                      </span>
                      <span>•</span>
                      <span>{book.pageCount} Hal</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{book.estimatedReadTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Pill */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="h-9 px-4 rounded-full bg-gray-100 group-hover:bg-neutral-900 group-hover:text-white text-gray-700 text-xs font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <span>Baca</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
