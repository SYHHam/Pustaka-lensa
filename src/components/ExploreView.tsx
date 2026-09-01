import React, { useState } from 'react';
import { Compass, Filter, Search } from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES } from '../data/dummyBooks';
import { BookCard } from './BookCard';

interface ExploreViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  books,
  onSelectBook,
  selectedCategory,
  onSelectCategory,
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const filteredBooks = books.filter((book) => {
    const matchesCat = selectedCategory === 'Semua Kategori' || book.category === selectedCategory;
    const matchesSearch = 
      book.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(localSearch.toLowerCase()) ||
      book.synopsisShort.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="explore-view-root" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Jelajahi Katalog Buku
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-sans">
          Temukan karya-karya terpilih untuk mengasah pemikiran dan memperluas wawasan.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="explore-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari judul buku atau penulis..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200/80 rounded-full text-xs font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
          />
        </div>

        {/* Category Info */}
        <div className="text-xs font-sans text-gray-500 font-medium self-end sm:self-center">
          Menampilkan <span className="text-gray-900 font-bold">{filteredBooks.length}</span> Buku
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`explore-cat-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 text-xs font-sans rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100 font-medium'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center text-gray-500 space-y-2 shadow-xs">
          <p className="font-sans text-base font-bold text-gray-900">Tidak Ada Buku yang Sesuai</p>
          <p className="text-xs font-sans">Coba pilih kategori lain atau sesuaikan kata kunci pencarianmu.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={onSelectBook}
                showCategoryBadge={true}
                showNewBadge={true}
                fixedWidth={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
