import React, { useState } from 'react';
import { Bookmark, BookOpen, CheckCircle2, Clock, Compass } from 'lucide-react';
import { Book } from '../types';
import { BookCard } from './BookCard';

interface ShelvesViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onNavigateToExplore: () => void;
}

type ShelfTab = 'semua' | 'sedang-dibaca' | 'selesai' | 'disimpan';

export const ShelvesView: React.FC<ShelvesViewProps> = ({
  books,
  onSelectBook,
  onNavigateToExplore,
}) => {
  const [activeShelfTab, setActiveShelfTab] = useState<ShelfTab>('semua');

  // Filter books according to active shelf
  const filteredBooks = books.filter((b) => {
    if (activeShelfTab === 'sedang-dibaca') return b.status === 'reading';
    if (activeShelfTab === 'selesai') return b.status === 'finished';
    if (activeShelfTab === 'disimpan') return b.isSaved;
    return b.isSaved || b.status === 'reading' || b.status === 'finished';
  });

  const tabs = [
    { id: 'semua' as ShelfTab, label: 'Semua', icon: Bookmark },
    { id: 'sedang-dibaca' as ShelfTab, label: 'Sedang Dibaca', icon: BookOpen },
    { id: 'selesai' as ShelfTab, label: 'Selesai Dibaca', icon: CheckCircle2 },
    { id: 'disimpan' as ShelfTab, label: 'Disimpan', icon: Clock },
  ];

  return (
    <div id="shelves-view-root" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Rak Bukuku
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-sans">
          Koleksi buku kurasi yang telah kamu simpan, tandai, dan pelajari.
        </p>
      </div>

      {/* Shelf Filtering Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeShelfTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`shelf-tab-${tab.id}`}
              onClick={() => setActiveShelfTab(tab.id)}
              className={`px-4 py-2 text-xs font-sans rounded-full flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Books Grid or Empty State */}
      {filteredBooks.length === 0 ? (
        <div 
          id="shelves-empty-state"
          className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-12 shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-lg font-bold text-gray-900">
              Rak Masih Kosong
            </h3>
            <p className="text-xs text-gray-500 max-w-sm font-sans leading-relaxed">
              Belum ada buku di kategori rak ini. Jelajahi katalog dan simpan buku favoritmu untuk dibaca nanti.
            </p>
          </div>
          <button
            id="shelves-explore-btn"
            onClick={onNavigateToExplore}
            className="mt-2 px-5 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-sans font-bold flex items-center gap-2 hover:bg-black transition-all cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Koleksi →</span>
          </button>
        </div>
      ) : (
        <div 
          id="shelves-books-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2"
        >
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={onSelectBook}
              showProgress={book.status === 'reading'}
              showCategoryBadge={true}
              fixedWidth={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
