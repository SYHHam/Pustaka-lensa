import React from 'react';
import { 
  Search, 
  SlidersHorizontal,
} from 'lucide-react';
import { Book } from '../types';
import { BookCarouselSection } from './BookCarouselSection';
import { CATEGORIES } from '../data/dummyBooks';
import { EventBannerCarousel } from './EventBannerCarousel';

interface DashboardViewProps {
  userName: string;
  books: Book[];
  onSelectBook: (book: Book) => void;
  onNavigateToExplore: () => void;
  onNavigateToShelves: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onSearchClick?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName = 'Budi',
  books,
  onSelectBook,
  onNavigateToExplore,
  onNavigateToShelves,
  onSelectCategory,
  selectedCategory = 'Semua Kategori',
  onSearchClick,
}) => {
  // Filtered by Selected Category (or All)
  const popularBooks = books
    .filter((b) => selectedCategory === 'Semua Kategori' || b.category === selectedCategory)
    .sort((a, b) => b.rating - a.rating);

  const newBooks = books
    .filter((b) => b.isNew && (selectedCategory === 'Semua Kategori' || b.category === selectedCategory));

  const readingBooks = books.filter((b) => b.status === 'reading');

  const handleSelectBookById = (bookId: string) => {
    const found = books.find(b => b.id === bookId);
    if (found) {
      onSelectBook(found);
    }
  };

  return (
    <div id="dashboard-view-root" className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* ===================================================================== */}
      {/* 1. Welcoming Sub-Header (Clean Editorial Style)                       */}
      {/* ===================================================================== */}
      <section id="dashboard-user-header" className="flex items-center justify-between pt-1">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Selamat membaca, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans">
            Temukan wawasan dan kebijaksanaan dalam setiap halaman buku pilihan.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. Infinite Looping Event & Announcement Banner Carousel              */}
      {/* ===================================================================== */}
      <EventBannerCarousel 
        books={books}
        onSelectBookById={handleSelectBookById}
        onNavigateToExplore={onNavigateToExplore}
      />

      {/* ===================================================================== */}
      {/* 4. Category Filter Pills Row (Dribbble Style)                         */}
      {/* ===================================================================== */}
      <section id="dashboard-category-selector" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-base font-bold text-gray-900">
            Pilih Kategori Bacaan
          </h2>
          <button
            onClick={onNavigateToExplore}
            className="text-xs font-semibold text-gray-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Lihat semua
          </button>
        </div>

        {/* Horizontal Scrollable Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`dashboard-cat-pill-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 text-xs font-sans rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100 font-medium'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. Carousels: Lanjutkan Membaca & Rekomendasi Terpopuler               */}
      {/* ===================================================================== */}
      <BookCarouselSection
        id="reading"
        title="Lanjutkan Membaca"
        subtitle="Bab dan halaman terakhir yang kamu buka"
        books={readingBooks}
        onSelectBook={onSelectBook}
        showProgress={true}
        showReadButton={true}
        emptyMessage="Belum ada buku yang sedang dibaca."
        emptyActionText="Eksplorasi Katalog"
        onEmptyAction={onNavigateToExplore}
      />

      <BookCarouselSection
        id="popular"
        title="Rekomendasi Populer"
        subtitle="Koleksi dengan apresiasi tertinggi oleh pembaca"
        books={popularBooks}
        onSelectBook={onSelectBook}
        showCategoryBadge={true}
        emptyMessage="Tidak ada buku yang ditemukan untuk kategori ini."
        emptyActionText="Lihat Semua Kategori"
        onEmptyAction={() => onSelectCategory('Semua Kategori')}
      />

      {newBooks.length > 0 && (
        <BookCarouselSection
          id="new-releases"
          title="Karya Terbaru Masuk"
          subtitle="Arsip kurasi teranyar yang baru ditambahkan"
          books={newBooks}
          onSelectBook={onSelectBook}
          showCategoryBadge={true}
          showNewBadge={true}
          emptyMessage="Belum ada buku baru."
          emptyActionText="Jelajahi Semua"
          onEmptyAction={onNavigateToExplore}
        />
      )}
    </div>
  );
};
