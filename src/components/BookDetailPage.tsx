import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  BookOpen, 
  Clock, 
  Share2, 
  Send, 
  CheckCircle2, 
  List, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { Book, CommentItem } from '../types';

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
  onEnterReaderMode: (chapterIndex?: number) => void;
  onToggleSave: (bookId: string) => void;
  onAddComment: (bookId: string, comment: CommentItem) => void;
  onUpdateRating: (bookId: string, rating: number) => void;
  userName?: string;
  userAvatar?: string;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  onBack,
  onEnterReaderMode,
  onToggleSave,
  onAddComment,
  onUpdateRating,
  userName = 'Budi',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [userRating, setUserRating] = useState<number>(5);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);

  const pageContainerRef = useRef<HTMLDivElement>(null);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      authorName: `${userName} (Anda)`,
      avatarUrl: userAvatar,
      rating: userRating,
      content: newCommentText.trim(),
      timeAgo: 'Baru saja',
    };

    onAddComment(book.id, newComment);
    setNewCommentText('');
  };

  const handleSaveRating = () => {
    onUpdateRating(book.id, selectedStars);
    setShowRatingModal(false);
  };

  // Determine button text based on reading progress
  let primaryButtonText = 'Mulai Membaca';
  if (book.status === 'finished') {
    primaryButtonText = 'Baca Ulang';
  } else if (book.progress > 0) {
    primaryButtonText = `Lanjutkan Membaca (${book.progress}%)`;
  }

  // Calculate rating breakdown percentages
  const totalReviews = book.ratingCount || 1;
  const starBreakdowns = [5, 4, 3, 2, 1].map((stars) => {
    const count = book.ratingBreakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
    const percentage = Math.round((count / totalReviews) * 100);
    return { stars, percentage, count };
  });

  return (
    <div 
      ref={pageContainerRef}
      id="book-detail-page-container" 
      className="min-h-screen bg-[#F4F4F6] text-neutral-900 transition-opacity duration-300 pb-24"
    >
      {/* Top Floating Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 md:px-8 py-3 flex items-center justify-between max-w-4xl mx-auto">
        <button
          id="detail-back-button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-sans font-bold text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="detail-bookmark-toggle-btn"
            onClick={() => onToggleSave(book.id)}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-sans font-bold cursor-pointer ${
              book.isSaved
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {book.isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{book.isSaved ? 'Tersimpan' : 'Simpan Buku'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 md:px-6 pt-8 space-y-8">
        {/* Hero Section */}
        <div id="detail-hero-section" className="flex flex-col items-center text-center space-y-6">
          {/* Book Cover */}
          <div 
            className="w-44 md:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-gray-200/60 relative flex flex-col justify-between p-5 text-white transform hover:scale-[1.02] transition-transform duration-300"
            style={{ 
              backgroundColor: book.coverColor,
              backgroundImage: `linear-gradient(145deg, ${book.coverColor} 0%, rgba(15,23,42,0.8) 100%)`
            }}
          >
            <div className="flex justify-between items-start z-10">
              <span className="font-sans text-[8px] tracking-[0.2em] uppercase font-bold text-white/80">
                Pustaka Lensa
              </span>
              <BookOpen className="w-4 h-4 text-white/70" />
            </div>

            <div className="my-auto z-10 py-2">
              <h2 className="font-display text-lg md:text-xl font-bold leading-tight drop-shadow-sm">
                {book.title}
              </h2>
            </div>

            <div className="z-10 flex justify-between items-center text-[10px] font-sans uppercase tracking-wider text-white/80">
              <span>{book.author}</span>
            </div>
          </div>

          {/* Book Title & Author */}
          <div className="space-y-2 max-w-lg">
            <span className="inline-block bg-gray-200/80 text-gray-800 text-[10px] font-sans font-bold px-3 py-1 rounded-full">
              {book.category}
            </span>
            <h1 id="detail-book-title" className="font-sans text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>
            <p className="font-sans text-xs text-gray-500 font-medium">
              Karya Oleh <span className="text-gray-900 font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Rating Summary Bar & Finished Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-xs">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-3.5 h-3.5 ${star <= Math.round(book.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="font-sans font-bold text-xs text-gray-900">{book.rating}</span>
              <span className="font-sans text-gray-400 text-xs">({book.ratingCount} Ulasan)</span>
            </div>

            {book.status === 'finished' && (
              <div 
                id="badge-finished-reading"
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-full text-xs font-sans font-bold shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selesai Dibaca</span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="w-full max-w-md pt-2">
            <button
              id="detail-main-read-btn"
              onClick={() => onEnterReaderMode()}
              className="w-full py-4 px-6 bg-neutral-900 text-white text-sm font-sans font-bold rounded-full hover:bg-black transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{primaryButtonText}</span>
            </button>
          </div>
        </div>

        {/* Synopsis Section */}
        <section id="detail-synopsis-section" className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/70 shadow-xs space-y-4">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400">
            Sinopsis & Tinjauan
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-sans whitespace-pre-line">
            {book.synopsisFull}
          </p>

          {/* Metadata badges row */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs font-sans text-gray-500 font-medium">
            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>{book.pageCount} Halaman</span>
            </div>
            <span>·</span>
            <div>
              <span className="font-semibold text-gray-800">{book.category}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{book.estimatedReadTime}</span>
            </div>
          </div>
        </section>

        {/* DAFTAR ISI / CHAPTER LIST */}
        <section id="detail-chapters-section" className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/70 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-800" />
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
                Daftar Isi & Bab ({book.chapters.length} Bab)
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            {book.chapters.map((chapter, idx) => {
              const isCurrentReadingChapter = book.status === 'reading' && book.currentChapterIndex === idx;

              return (
                <button
                  key={chapter.id}
                  id={`detail-chapter-row-${idx}`}
                  onClick={() => onEnterReaderMode(idx)}
                  className="w-full p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between gap-4 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span 
                      className={`text-xs font-sans px-2.5 py-1 rounded-lg font-bold transition-colors ${
                        isCurrentReadingChapter 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-sans text-sm font-bold text-gray-900 group-hover:text-black truncate">
                          {chapter.title}
                        </h3>
                        {isCurrentReadingChapter && (
                          <span className="text-[10px] font-sans font-bold px-2 py-0.5 bg-neutral-900 text-white rounded-full">
                            Sedang Dibaca
                          </span>
                        )}
                      </div>
                      {chapter.subtitle && (
                        <p className="text-xs text-gray-500 font-sans line-clamp-1">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-neutral-900 group-hover:text-white transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Rating Breakdown */}
        <section id="detail-rating-breakdown-section" className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
              Penilaian Pembaca
            </h2>
            <button
              id="detail-give-rating-btn"
              onClick={() => setShowRatingModal(true)}
              className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-sans font-bold transition-colors cursor-pointer"
            >
              Beri Rating +
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="text-center sm:text-left">
              <div className="text-4xl font-sans font-bold text-gray-900">
                {book.rating}
              </div>
              <div className="flex justify-center sm:justify-start my-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-3.5 h-3.5 ${s <= Math.round(book.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 font-sans">
                {book.ratingCount} ulasan
              </p>
            </div>

            <div className="sm:col-span-2 space-y-2">
              {starBreakdowns.map(({ stars, percentage, count }) => (
                <div key={stars} className="flex items-center gap-2 text-xs font-sans">
                  <span className="w-3 text-right font-bold text-gray-700">{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reader Comments */}
        <section id="detail-comments-section" className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-900">
              Komentar & Diskusi ({book.comments.length})
            </h2>
          </div>

          <div className="space-y-4 divide-y divide-gray-100">
            {book.comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={comment.avatarUrl} 
                      alt={comment.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 font-sans block">
                        {comment.authorName}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-sans text-gray-400">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3 h-3 ${s <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span>·</span>
                        <span>{comment.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <form onSubmit={handleSendComment} className="pt-4 border-t border-gray-100 space-y-3">
            <label className="text-xs font-sans font-bold text-gray-700 uppercase tracking-wider block">
              Tulis Catatan Tanggapan
            </label>
            <div className="flex items-center gap-2 pb-1">
              <span className="text-xs text-gray-500 font-sans">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setUserRating(st)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${st <= userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                id="detail-comment-input"
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Bagikan pemikiran atau apresiasi Anda tentang buku ini..."
                className="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
              <button
                type="submit"
                id="detail-submit-comment-btn"
                className="px-5 h-11 bg-neutral-900 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-2 hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Modal Rating */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-100">
            <h3 className="font-sans text-base font-bold text-gray-900 text-center">
              Beri Penilaian Buku
            </h3>
            <p className="text-xs text-gray-500 text-center font-sans">
              Bagikan penilaianmu untuk membantu pembaca lain menemukan karya terbaik.
            </p>
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStars(s)}
                  className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star className={`w-8 h-8 ${s <= selectedStars ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-sans font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRating}
                className="flex-1 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-sans font-bold transition-all cursor-pointer shadow-xs"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
