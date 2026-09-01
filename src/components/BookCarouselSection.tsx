import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface BookCarouselSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  books: Book[];
  onSelectBook: (book: Book) => void;
  showProgress?: boolean;
  showCategoryBadge?: boolean;
  showNewBadge?: boolean;
  showReadButton?: boolean;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
}

export const BookCarouselSection: React.FC<BookCarouselSectionProps> = ({
  id,
  title,
  subtitle,
  books,
  onSelectBook,
  showProgress = false,
  showCategoryBadge = false,
  showNewBadge = false,
  showReadButton = false,
  emptyMessage = "Belum ada buku di bagian ini",
  emptyActionText = "Jelajahi koleksi",
  onEmptyAction,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id={`section-${id}`} className="relative my-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-sans text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Arrow Controls */}
        {books.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              id={`carousel-prev-${id}`}
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll kiri"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              id={`carousel-next-${id}`}
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll kanan"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* Content: Carousel or Empty State */}
      {books.length === 0 ? (
        <div 
          id={`carousel-empty-${id}`}
          className="w-full bg-white rounded-2xl border border-gray-200/70 p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <BookOpen className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 font-sans">{emptyMessage}</p>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Koleksi buku siap dieksplorasi kapan saja.
            </p>
          </div>
          {onEmptyAction && (
            <button
              onClick={onEmptyAction}
              className="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-sans font-semibold hover:bg-black transition-all cursor-pointer shadow-xs"
            >
              {emptyActionText} →
            </button>
          )}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          id={`carousel-container-${id}`}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={onSelectBook}
              showProgress={showProgress}
              showCategoryBadge={showCategoryBadge}
              showNewBadge={showNewBadge}
              showReadButton={showReadButton}
            />
          ))}
        </div>
      )}
    </section>
  );
};
