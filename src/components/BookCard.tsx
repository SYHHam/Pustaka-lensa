import React from 'react';
import { Book } from '../types';
import { Star, ChevronRight, ArrowRight, Heart } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  showProgress?: boolean;
  showCategoryBadge?: boolean;
  showNewBadge?: boolean;
  showReadButton?: boolean;
  fixedWidth?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  showProgress = false,
  showCategoryBadge = false,
  showNewBadge = false,
  showReadButton = false,
  fixedWidth = true,
}) => {
  return (
    <div
      id={`book-card-${book.id}`}
      onClick={() => onClick(book)}
      className={`group cursor-pointer flex-shrink-0 flex flex-col justify-between select-none bg-white rounded-2xl p-3 border border-gray-200/70 shadow-xs hover:shadow-md transition-all duration-200 ${
        fixedWidth ? 'w-[170px] sm:w-[195px]' : 'w-full'
      }`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div>
        {/* Book Cover Container with Rounded Corners & Bookmark Overlay */}
        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-xs">
          {/* Cover Surface with Gradient */}
          <div 
            className="w-full h-full p-3.5 flex flex-col justify-between text-white relative"
            style={{ 
              backgroundColor: book.coverColor,
              backgroundImage: `linear-gradient(145deg, ${book.coverColor} 0%, rgba(15,23,42,0.75) 100%)`
            }}
          >
            {/* Subtle inner grid/dot pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>

            {/* Top info on cover */}
            <div className="flex justify-between items-start z-10">
              <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-white/80 font-bold">
                Lensa
              </span>

              {/* Bookmark status indicator */}
              {book.isSaved && (
                <div className="p-1 bg-white/20 backdrop-blur-xs rounded-full">
                  <Heart className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              )}
            </div>

            {/* Middle Title on Cover */}
            <div className="my-auto z-10 py-1">
              <h4 className="font-display text-xs sm:text-sm font-bold leading-tight line-clamp-3 text-white drop-shadow-xs">
                {book.title}
              </h4>
            </div>

            {/* Bottom Author on Cover */}
            <div className="z-10 flex items-center justify-between">
              <p className="font-sans text-[8px] uppercase tracking-wider text-white/80 font-medium truncate max-w-[80%]">
                {book.author}
              </p>
            </div>
          </div>

          {/* New Badge in top left */}
          {showNewBadge && book.isNew && (
            <div 
              id={`book-card-badge-new-${book.id}`}
              className="absolute top-2 left-2 bg-amber-400 text-amber-950 text-[8px] font-sans font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
            >
              Baru
            </div>
          )}
        </div>

        {/* Card Details (Under Cover) */}
        <div className="mt-2.5 space-y-1">
          {/* Optional Category Pill */}
          {showCategoryBadge && (
            <div>
              <span className="inline-block bg-gray-100 text-gray-700 text-[9px] font-sans font-semibold px-2 py-0.5 rounded-full">
                {book.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-sans text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-black transition-colors pt-0.5">
            {book.title}
          </h3>

          {/* Author & Rating Row */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-sans">
            <span className="truncate max-w-[65%] font-medium">{book.author}</span>
            <div className="flex items-center gap-0.5 font-bold text-amber-600 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Progress Bar & percentage if currently reading */}
          {showProgress && (
            <div className="pt-1.5 space-y-1 border-t border-gray-100 mt-1.5">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neutral-900 rounded-full transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
              <p className="font-sans text-[9px] text-gray-500 font-semibold">
                {book.progress}% Selesai
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Optional "Baca Sekarang" button or Round Action Icon */}
      {showReadButton && (
        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] font-sans font-bold text-gray-700">Lanjut Baca</span>
          <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center group-hover:bg-black transition-colors">
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
      )}
    </div>
  );
};
