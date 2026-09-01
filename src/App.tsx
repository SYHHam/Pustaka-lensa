import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, NavigationTab, CommentItem } from './types';
import { INITIAL_BOOKS } from './data/dummyBooks';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { ShelvesView } from './components/ShelvesView';
import { ExploreView } from './components/ExploreView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { TopChartsView } from './components/TopChartsView';
import { Footer } from './components/Footer';
import { FAQModal } from './components/FAQModal';
import { HelpCenterModal } from './components/HelpCenterModal';
import { BottomSheet } from './components/BottomSheet';
import { BookDetailPage } from './components/BookDetailPage';
import { ReaderMode } from './components/ReaderMode';

export default function App() {
  // Books Master State
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [userName, setUserName] = useState<string>('Budi');
  const [userAvatar, setUserAvatar] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('beranda');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Selection IDs
  const [selectedBookSheetId, setSelectedBookSheetId] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  const [selectedDetailBookId, setSelectedDetailBookId] = useState<string | null>(null);
  const [activeReadingBookId, setActiveReadingBookId] = useState<string | null>(null);
  const [readingInitialChapter, setReadingInitialChapter] = useState<number | undefined>(undefined);

  // Footer Modals State
  const [isFAQOpen, setIsFAQOpen] = useState<boolean>(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState<boolean>(false);

  // Derived Book Selections
  const selectedBookForSheet = books.find(b => b.id === selectedBookSheetId) || null;
  const selectedBookForDetail = books.find(b => b.id === selectedDetailBookId) || null;
  const activeReadingBook = books.find(b => b.id === activeReadingBookId) || null;

  // Click card -> Open Bottom Sheet
  const handleOpenBookSheet = useCallback((book: Book) => {
    setSelectedBookSheetId(book.id);
    setIsBottomSheetOpen(true);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  // Bottom Sheet Primary Action -> Navigate to Book Detail Page
  const handleNavigateToDetail = useCallback((book: Book) => {
    setSelectedDetailBookId(book.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedDetailBookId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Detail Page / Button -> Enter Reading Mode
  const handleEnterReaderMode = useCallback((startChapter?: number) => {
    if (selectedDetailBookId) {
      setReadingInitialChapter(typeof startChapter === 'number' ? startChapter : undefined);
      setActiveReadingBookId(selectedDetailBookId);
    }
  }, [selectedDetailBookId]);

  const handleCloseReaderMode = useCallback(() => {
    setActiveReadingBookId(null);
    setReadingInitialChapter(undefined);
  }, []);

  // Toggle Save to Shelf
  const handleToggleSave = useCallback((bookId: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          isSaved: !b.isSaved,
        };
      }
      return b;
    }));
  }, []);

  // Update Reading Progress during reading
  const handleUpdateProgress = useCallback((
    bookId: string,
    progress: number,
    currentChapter: number,
    currentPage: number
  ) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        // Only update if something actually changed to prevent pointless renders
        if (
          b.progress === progress &&
          b.currentChapterIndex === currentChapter &&
          b.currentPageIndex === currentPage
        ) {
          return b;
        }
        const newStatus = b.status === 'finished' ? 'finished' : 'reading';
        const newMaxProgress = Math.max(b.maxProgressReached || 0, progress);
        return {
          ...b,
          progress,
          currentChapterIndex: currentChapter,
          currentPageIndex: currentPage,
          maxProgressReached: newMaxProgress,
          status: newStatus,
        };
      }
      return b;
    }));
  }, []);

  // Manual Bookmark hook (Pita Bookmark)
  const handleSaveBookmark = useCallback((
    bookId: string,
    bookmark: { chapterIndex: number; pageIndex: number; timestamp: string } | null
  ) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          manualBookmark: bookmark,
        };
      }
      return b;
    }));
  }, []);

  // Auto-finish reading hook
  const handleFinishBook = useCallback((bookId: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          progress: 100,
          status: 'finished',
        };
      }
      return b;
    }));
  }, []);

  // Add Reader Comment
  const handleAddComment = useCallback((bookId: string, comment: CommentItem) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          comments: [comment, ...b.comments],
        };
      }
      return b;
    }));
  }, []);

  // Add / Update Rating
  const handleUpdateRating = useCallback((bookId: string, newRating: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const newRatingCount = b.ratingCount + 1;
        const newTotalScore = (b.rating * b.ratingCount) + newRating;
        const calculatedRating = Number((newTotalScore / newRatingCount).toFixed(1));
        const currentBreakdown = { ...b.ratingBreakdown };
        const key = newRating as 1|2|3|4|5;
        currentBreakdown[key] = (currentBreakdown[key] || 0) + 1;

        return {
          ...b,
          rating: calculatedRating,
          ratingCount: newRatingCount,
          ratingBreakdown: currentBreakdown,
        };
      }
      return b;
    }));
  }, []);

  const handleSelectCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('jelajahi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const savedCount = books.filter(b => b.isSaved).length;

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-neutral-900 font-sans flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      {!selectedBookForDetail && !activeReadingBook && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          savedCount={savedCount}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedBookForDetail && !activeReadingBook ? 'md:pl-64' : ''}`}>
        {/* Topbar only shown when on dashboard / standard pages */}
        {!selectedBookForDetail && !activeReadingBook && (
          <Topbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            books={books}
            onSelectBook={handleOpenBookSheet}
            userName={userName}
            userAvatar={userAvatar}
            onNavigateToSettings={() => {
              setActiveTab('pengaturan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Page Views Router */}
        <AnimatePresence mode="wait">
          {selectedBookForDetail ? (
            <motion.div
              key={`detail-${selectedBookForDetail.id}`}
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <BookDetailPage
                book={selectedBookForDetail}
                onBack={handleBackFromDetail}
                onEnterReaderMode={handleEnterReaderMode}
                onToggleSave={handleToggleSave}
                onAddComment={handleAddComment}
                onUpdateRating={handleUpdateRating}
              />
            </motion.div>
          ) : (
            <motion.main 
              key={`main-tab-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 max-w-[1200px] w-full mx-auto p-4 md:p-8 pb-24 md:pb-12"
            >
              {activeTab === 'beranda' && (
                <>
                  <DashboardView
                    books={books}
                    onSelectBook={handleOpenBookSheet}
                    onSelectCategory={handleSelectCategory}
                    onNavigateToShelves={() => setActiveTab('rak-bukuku')}
                    onNavigateToExplore={() => setActiveTab('jelajahi')}
                    userName={userName}
                  />

                  {/* Glassmorphism Home Footer with Horizontal Social Links, FAQ & Help Center */}
                  <Footer
                    onOpenFAQ={() => setIsFAQOpen(true)}
                    onOpenHelpCenter={() => setIsHelpCenterOpen(true)}
                    onNavigateToExplore={() => {
                      setActiveTab('jelajahi');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </>
              )}

              {activeTab === 'top-charts' && (
                <TopChartsView
                  books={books}
                  onSelectBook={handleOpenBookSheet}
                  onNavigateToExplore={() => setActiveTab('jelajahi')}
                />
              )}

              {activeTab === 'rak-bukuku' && (
                <ShelvesView
                  books={books}
                  onSelectBook={handleOpenBookSheet}
                  onNavigateToExplore={() => setActiveTab('jelajahi')}
                />
              )}

              {(activeTab === 'jelajahi' || activeTab === 'kategori') && (
                <ExploreView
                  books={books}
                  onSelectBook={handleOpenBookSheet}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}

              {activeTab === 'riwayat' && (
                <HistoryView
                  books={books}
                  onSelectBook={handleOpenBookSheet}
                />
              )}

              {activeTab === 'pengaturan' && (
                <SettingsView
                  userName={userName}
                  onUpdateUserName={setUserName}
                  userAvatar={userAvatar}
                  onUpdateAvatar={setUserAvatar}
                />
              )}
            </motion.main>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation Bar */}
        {!selectedBookForDetail && !activeReadingBook && (
          <MobileBottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedCount={savedCount}
          />
        )}
      </div>

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
      />

      {/* Help Center Modal */}
      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
        onOpenFAQ={() => setIsFAQOpen(true)}
      />

      {/* Dynamic Bottom Sheet */}
      <BottomSheet
        book={selectedBookForSheet}
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onNavigateToDetail={handleNavigateToDetail}
        onToggleSave={handleToggleSave}
        onOpenRating={(b) => {
          handleCloseBottomSheet();
          handleNavigateToDetail(b);
        }}
      />

      {/* Wattpad-Style Fullscreen Reading Mode with Gestures */}
      {activeReadingBook && (
        <ReaderMode
          book={activeReadingBook}
          initialChapterIndex={readingInitialChapter}
          onClose={handleCloseReaderMode}
          onUpdateProgress={handleUpdateProgress}
          onFinishBook={handleFinishBook}
        />
      )}
    </div>
  );
}
