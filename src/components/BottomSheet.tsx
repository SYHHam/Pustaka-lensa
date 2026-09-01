import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  BookOpen, 
  List, 
  ChevronRight, 
  ArrowRight,
  Heart,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Book } from '../types';

interface BottomSheetProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDetail: (book: Book) => void;
  onToggleSave: (bookId: string) => void;
  onOpenRating?: (book: Book) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  book,
  isOpen,
  onClose,
  onNavigateToDetail,
  onToggleSave,
  onOpenRating,
}) => {
  // Drag state for manual swipe-down gesture
  const [dragY, setDragY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [readMoreSynopsis, setReadMoreSynopsis] = useState<boolean>(false);

  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDragY(0);
      setIsClosing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle closing with smooth slide-down animation
  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragY(0);
    }, 240);
  }, [onClose]);

  // Touch / Pointer Event Handlers for Drag-Down Gesture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only initiate drag if user started touch on drag-handle or when scrollContainer is at the top
    const scrollPos = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
    if (scrollPos > 5) return;

    setIsDragging(true);
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startYRef.current;
    const now = performance.now();
    const dt = now - lastTimeRef.current;

    if (dt > 0) {
      velocityRef.current = (e.clientY - currentYRef.current) / dt;
    }
    currentYRef.current = e.clientY;
    lastTimeRef.current = now;

    // If dragging downward, follow finger smoothly; add elastic resistance if dragging upward
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(deltaY * 0.15);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    // Dismiss if dragged down more than 100px OR flicked downward with positive velocity
    if (dragY > 100 || velocityRef.current > 0.45) {
      triggerClose();
    } else {
      // Snap back to top
      setDragY(0);
    }
  };

  if (!isOpen || !book) return null;

  // Determine dynamic button texts
  let primaryButtonText = 'Mulai Membaca';
  if (book.status === 'reading' && book.progress > 0) {
    primaryButtonText = 'Lanjutkan Membaca';
  } else if (book.status === 'finished') {
    primaryButtonText = 'Baca Ulang';
  }

  const handlePrimaryClick = () => {
    onClose();
    onNavigateToDetail(book);
  };

  // Calculate backdrop opacity dynamically based on drag distance
  const backdropOpacity = isClosing 
    ? 0 
    : Math.max(0.1, 1 - (dragY > 0 ? dragY / 400 : 0));

  return (
    <div 
      id="bottom-sheet-root"
      className="fixed inset-0 z-50 flex items-end justify-center select-none"
      aria-labelledby="bottom-sheet-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark Dimming Backdrop */}
      <div
        id="bottom-sheet-backdrop"
        onClick={triggerClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-200"
        style={{ opacity: backdropOpacity }}
      />

      {/* Modern Rounded-3xl Sheet Container */}
      <div
        ref={sheetRef}
        id="bottom-sheet-panel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full max-w-lg bg-[#F8F9FA] rounded-t-[2.25rem] shadow-2xl z-10 max-h-[88vh] flex flex-col overflow-hidden pb-safe border-t border-gray-100 ${
          isDragging ? 'cursor-grabbing' : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform: isClosing 
            ? 'translateY(100%)' 
            : `translateY(${Math.max(0, dragY)}px)`,
          touchAction: 'none'
        }}
      >
        {/* Grab Handle Bar (Finger Drag Zone) */}
        <div className="pt-3 pb-2 flex flex-col items-center justify-center w-full cursor-grab active:cursor-grabbing">
          <div 
            id="bottom-sheet-handle-bar" 
            className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" 
          />
          <span className="text-[9px] text-gray-400 font-sans font-semibold tracking-wider mt-1 uppercase">
            Geser ke bawah untuk menutup
          </span>
        </div>

        {/* Top Floating Buttons (Back/Close & Bookmark Heart) */}
        <div className="flex items-center justify-between px-6 pt-1 pb-2">
          {/* Close/Back Button */}
          <button
            id="bottom-sheet-close-btn"
            onClick={triggerClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
            aria-label="Tutup panel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top-Right Heart Bookmark Button */}
          <div className="flex items-center gap-2">
            <button
              id="bottom-sheet-save-heart-btn"
              onClick={() => onToggleSave(book.id)}
              className={`w-9 h-9 rounded-full border shadow-xs flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                book.isSaved 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-white border-gray-200/80 text-gray-600 hover:text-red-500'
              }`}
              title={book.isSaved ? 'Disimpan dalam rak' : 'Simpan ke rak'}
            >
              <Heart className={`w-4 h-4 ${book.isSaved ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Content */}
        <div 
          ref={scrollContainerRef}
          className="px-6 py-2 overflow-y-auto space-y-5 no-scrollbar touch-pan-y"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Hero Book Presentation Card (Dribbble Styled) */}
          <div className="relative bg-white rounded-2xl p-4 border border-gray-200/60 shadow-xs flex gap-4 items-center">
            {/* Book Cover Thumbnail */}
            <div 
              className="w-24 aspect-[2/3] rounded-xl flex-shrink-0 shadow-md overflow-hidden relative flex flex-col justify-between p-2.5 text-white"
              style={{ 
                backgroundColor: book.coverColor,
                backgroundImage: `linear-gradient(135deg, ${book.coverColor} 0%, rgba(15,23,42,0.7) 100%)`
              }}
            >
              <div className="text-[8px] tracking-[0.2em] font-sans font-bold uppercase text-white/80">Lensa</div>
              <div>
                <p className="font-display text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-xs">
                  {book.title}
                </p>
              </div>
              <p className="font-sans text-[8px] uppercase tracking-wider text-white/80 truncate">{book.author}</p>
            </div>

            {/* Book Info Column */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-block bg-neutral-100 text-neutral-800 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full">
                  {book.category}
                </span>
                {book.isNew && (
                  <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                    Baru
                  </span>
                )}
              </div>

              <h3 
                id="bottom-sheet-title"
                className="font-display text-lg md:text-xl font-bold text-gray-900 leading-snug line-clamp-2"
              >
                {book.title}
              </h3>

              <p className="font-sans text-xs text-gray-500 font-medium">
                {book.author}
              </p>

              {/* Rating Pill + Page Count */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full text-xs font-bold text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                </div>
                <span className="text-xs text-gray-400 font-sans">
                  ({book.ratingCount} ulasan)
                </span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-500 font-sans">
                  {book.pageCount} Hal
                </span>
              </div>
            </div>
          </div>

          {/* Synopsis Card */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider">
                Tentang Buku
              </h4>
              <button
                onClick={() => setReadMoreSynopsis(!readMoreSynopsis)}
                className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
              >
                {readMoreSynopsis ? 'Ringkas' : 'Baca selengkapnya'}
              </button>
            </div>
            <p className={`text-xs text-gray-600 leading-relaxed font-sans ${readMoreSynopsis ? '' : 'line-clamp-3'}`}>
              {book.synopsisShort}
            </p>
          </div>

          {/* Quick Chapters Preview */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <List className="w-4 h-4 text-gray-700" />
                <span>Daftar Bab ({book.chapters.length} Bab)</span>
              </div>
              <button 
                onClick={handlePrimaryClick}
                className="text-xs font-semibold text-neutral-800 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              {book.chapters.slice(0, 3).map((ch, idx) => (
                <div 
                  key={ch.id} 
                  onClick={handlePrimaryClick}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-xs font-sans cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-800 truncate group-hover:text-black">
                      {ch.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator if currently reading */}
          {book.status === 'reading' && (
            <div className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-800">
                <span>Progres Membaca</span>
                <span className="text-neutral-900">{book.progress}% Selesai</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neutral-900 rounded-full transition-all"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Bottom Action Bar (Dribbble Pill Style) */}
        <div className="p-4 px-6 bg-white border-t border-gray-200/70 flex items-center gap-3">
          {/* Large Pill Primary Action Button */}
          <button
            id="bottom-sheet-primary-action-btn"
            onClick={handlePrimaryClick}
            className="flex-1 h-12 bg-neutral-900 text-white rounded-full text-xs md:text-sm font-sans font-bold hover:bg-black transition-all flex items-center justify-between px-5 shadow-md active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-300" />
              <span>{primaryButtonText}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
