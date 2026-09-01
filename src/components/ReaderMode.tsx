import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  Type, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Check,
  BookOpen,
  Sparkles,
  Layers,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Book, 
  ReaderSettings, 
  ReaderFontFamily, 
  ReaderLineSpacing, 
  ReaderTheme 
} from '../types';

interface ReaderModeProps {
  book: Book;
  initialChapterIndex?: number;
  onClose: () => void;
  onUpdateProgress: (bookId: string, progress: number, currentChapter: number, currentPage: number) => void;
  onFinishBook: (bookId: string) => void;
}

const AVAILABLE_FONTS: { id: ReaderFontFamily; label: string; sub: string; className: string }[] = [
  { id: 'source-serif', label: 'Source Serif 4', sub: 'Serif Nyaman', className: 'font-reader-source' },
  { id: 'literata', label: 'Literata', sub: 'Serif Elegan', className: 'font-reader-literata' },
  { id: 'lora', label: 'Lora', sub: 'Serif Halus', className: 'font-reader-lora' },
  { id: 'garamond', label: 'EB Garamond', sub: 'Serif Klasik', className: 'font-reader-garamond' },
  { id: 'merriweather', label: 'Merriweather', sub: 'Serif Tegas', className: 'font-reader-merriweather' },
  { id: 'jakarta', label: 'Plus Jakarta Sans', sub: 'Sans Modern', className: 'font-reader-jakarta' },
  { id: 'sans', label: 'Inter', sub: 'Sans Netral', className: 'font-sans-ui' },
];

export const ReaderMode: React.FC<ReaderModeProps> = ({
  book,
  initialChapterIndex,
  onClose,
  onUpdateProgress,
  onFinishBook,
}) => {
  const savedScrollPositionRef = useRef<number>(0);

  // Reader Settings State (Default: Clean White, 17px, Source Serif 4)
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 17, // Continuous 13px - 26px
    fontFamily: 'source-serif',
    lineSpacing: 'normal',
    theme: 'light', // 'light' (Putih) or 'dark' (Hitam)
  });

  // UI Visibility States
  const [showControls, setShowControls] = useState(true);
  const [showSettingsUI, setShowSettingsUI] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showTOCDrawer, setShowTOCDrawer] = useState(false);

  // Chapter Interstitial Break Animation State
  const [chapterTransitionInfo, setChapterTransitionInfo] = useState<{
    show: boolean;
    chapterNumber: number;
    title: string;
    subtitle?: string;
  } | null>(null);

  // Chapter & Page Navigation State
  const [chapterIndex, setChapterIndex] = useState(() => {
    if (typeof initialChapterIndex === 'number' && initialChapterIndex >= 0 && initialChapterIndex < book.chapters.length) {
      return initialChapterIndex;
    }
    return Math.min(book.currentChapterIndex || 0, book.chapters.length - 1);
  });
  const [pageIndex, setPageIndex] = useState(() => {
    if (typeof initialChapterIndex === 'number') return 0;
    return Math.max(0, book.currentPageIndex || 0);
  });
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');

  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isTurningRef = useRef(false);

  // Progress synchronization ref
  const onUpdateProgressRef = useRef(onUpdateProgress);
  useEffect(() => {
    onUpdateProgressRef.current = onUpdateProgress;
  }, [onUpdateProgress]);

  const lastProgressSentRef = useRef<{ chapter: number; page: number; progress: number } | null>(null);

  // Lock parent body scroll and save position on mount
  useEffect(() => {
    savedScrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, savedScrollPositionRef.current);
    };
  }, []);

  const currentChapter = book.chapters[chapterIndex] || book.chapters[0];

  // =========================================================================
  // PAGINATION ENGINE: Calculates text flow dynamically based on continuous font size
  // =========================================================================
  const pages = useMemo(() => {
    if (!currentChapter || !currentChapter.content) return [''];

    const paragraphs = currentChapter.content.split('\n\n').filter(p => p.trim().length > 0);
    
    // Continuous estimation formula based on font size (13px to 26px)
    const baseWordsPerPage = Math.max(60, Math.round(330 - settings.fontSize * 11.5));

    const lineMultiplier = 
      settings.lineSpacing === 'tight' ? 1.2 :
      settings.lineSpacing === 'loose' ? 0.82 : 1.0;

    const targetWordsPerPage = Math.round(baseWordsPerPage * lineMultiplier);

    const calculatedPages: string[] = [];
    let currentPageParagraphs: string[] = [];
    let currentWordCount = 0;

    paragraphs.forEach((p) => {
      const words = p.split(/\s+/);
      if (currentWordCount + words.length > targetWordsPerPage && currentPageParagraphs.length > 0) {
        calculatedPages.push(currentPageParagraphs.join('\n\n'));
        currentPageParagraphs = [p];
        currentWordCount = words.length;
      } else {
        currentPageParagraphs.push(p);
        currentWordCount += words.length;
      }
    });

    if (currentPageParagraphs.length > 0) {
      calculatedPages.push(currentPageParagraphs.join('\n\n'));
    }

    return calculatedPages.length > 0 ? calculatedPages : [''];
  }, [currentChapter, settings.fontSize, settings.lineSpacing]);

  // Safe bounded page index
  const safePageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));

  // Overall book progress calculation
  const totalChapters = book.chapters.length;
  const currentProgressInChapter = (safePageIndex + 1) / Math.max(1, pages.length);
  const overallProgress = Math.min(
    99,
    Math.round(((chapterIndex + currentProgressInChapter * 0.9) / totalChapters) * 100)
  );

  // Sync reading progress
  useEffect(() => {
    const prev = lastProgressSentRef.current;
    if (
      !prev ||
      prev.chapter !== chapterIndex ||
      prev.page !== safePageIndex ||
      prev.progress !== overallProgress
    ) {
      lastProgressSentRef.current = {
        chapter: chapterIndex,
        page: safePageIndex,
        progress: overallProgress,
      };
      onUpdateProgressRef.current(book.id, overallProgress, chapterIndex, safePageIndex);
    }
  }, [chapterIndex, safePageIndex, pages.length, book.id, book.chapters.length, overallProgress]);

  // =========================================================================
  // CHAPTER TRANSITION BANNER
  // =========================================================================
  const triggerChapterBreakTransition = (nextChapterIdx: number) => {
    const nextChap = book.chapters[nextChapterIdx];
    if (nextChap) {
      setChapterTransitionInfo({
        show: true,
        chapterNumber: nextChap.chapterNumber,
        title: nextChap.title,
        subtitle: nextChap.subtitle,
      });
      setTimeout(() => {
        setChapterTransitionInfo(null);
      }, 400);
    }
  };

  // =========================================================================
  // SMOOTH PAGE TURN CONTROLLER
  // =========================================================================
  const executePageTurn = useCallback((direction: 'next' | 'prev') => {
    if (isTurningRef.current) return;
    isTurningRef.current = true;
    setTimeout(() => {
      isTurningRef.current = false;
    }, 320);

    setTurnDirection(direction);

    if (direction === 'next') {
      if (safePageIndex < pages.length - 1) {
        setPageIndex(prev => prev + 1);
      } else {
        // Last page of current chapter
        if (chapterIndex < book.chapters.length - 1) {
          const nextChapter = chapterIndex + 1;
          triggerChapterBreakTransition(nextChapter);
          setChapterIndex(nextChapter);
          setPageIndex(0);
        } else {
          // Finished book celebration!
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#18181B', '#3B82F6', '#10B981', '#F59E0B', '#6366F1']
          });
          onFinishBook(book.id);
          setTimeout(() => {
            onClose();
          }, 1400);
        }
      }
    } else {
      if (safePageIndex > 0) {
        setPageIndex(prev => prev - 1);
      } else {
        if (chapterIndex > 0) {
          const prevChap = chapterIndex - 1;
          triggerChapterBreakTransition(prevChap);
          setChapterIndex(prevChap);
          setPageIndex(0);
        }
      }
    }
  }, [safePageIndex, pages.length, chapterIndex, book.chapters, book.id, onFinishBook, onClose]);

  // =========================================================================
  // GESTURE & TAP NAVIGATION HANDLERS
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent) => {
    // If clicking on any interactive element or header/settings panel, ignore root gestures
    if ((e.target as HTMLElement).closest('button, input, select, textarea, #toc-drawer-panel, #settings-panel, #font-selection-popover, #reader-top-header, a, [role="button"]')) {
      return;
    }

    if (showTOCDrawer || showSettingsUI || showFontDropdown) {
      return;
    }

    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // If clicking directly on a button, header, or panel, never intercept
    if ((e.target as HTMLElement).closest('button, input, select, textarea, #toc-drawer-panel, #settings-panel, #font-selection-popover, #reader-top-header, a, [role="button"]')) {
      isDraggingRef.current = false;
      return;
    }

    // If an overlay/modal was active and clicked outside in the empty margin, close it without flipping page
    if (showTOCDrawer || showSettingsUI || showFontDropdown) {
      setShowTOCDrawer(false);
      setShowSettingsUI(false);
      setShowFontDropdown(false);
      isDraggingRef.current = false;
      return;
    }

    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const deltaX = e.clientX - dragStartXRef.current;
    const elapsedTime = Date.now() - dragStartTimeRef.current;
    const screenWidth = window.innerWidth || 400;
    const velocity = Math.abs(deltaX) / (elapsedTime || 1);

    // Swipe gestures
    if (deltaX < -screenWidth * 0.18 || (deltaX < -30 && velocity > 0.3)) {
      executePageTurn('next');
    } else if (deltaX > screenWidth * 0.18 || (deltaX > 30 && velocity > 0.3)) {
      executePageTurn('prev');
    } else if (Math.abs(deltaX) < 15 && elapsedTime < 300) {
      // Tap navigation
      const clickX = e.clientX;
      const leftBoundary = screenWidth * 0.3;
      const rightBoundary = screenWidth * 0.7;

      if (clickX < leftBoundary) {
        executePageTurn('prev');
      } else if (clickX > rightBoundary) {
        executePageTurn('next');
      } else {
        // Center tap: toggle header & controls
        setShowControls(prev => !prev);
      }
    }
  };

  // Jump to specific chapter from TOC Drawer
  const handleJumpToChapter = (idx: number) => {
    setChapterIndex(idx);
    setPageIndex(0);
    setShowTOCDrawer(false);
    triggerChapterBreakTransition(idx);
  };

  // =========================================================================
  // MODERN THEME DEFINITIONS (Clean Minimalist White / OLED Dark)
  // =========================================================================
  const currentTheme = useMemo(() => {
    switch (settings.theme) {
      case 'dark':
        return {
          paperBg: '#18181B',
          text: '#F4F4F5',
          mutedText: '#A1A1AA',
          border: '#27272A',
          cardBorder: '#3F3F46',
          accent: '#FFFFFF',
          cardBg: '#27272A',
          outerBg: '#09090B',
          dropCapBg: '#27272A',
          dropCapText: '#F4F4F5',
          name: 'Hitam',
        };
      case 'light':
      default:
        return {
          paperBg: '#FFFFFF',
          text: '#18181B',
          mutedText: '#71717A',
          border: '#E4E4E7',
          cardBorder: '#E4E4E7',
          accent: '#18181B',
          cardBg: '#FFFFFF',
          outerBg: '#F4F4F6',
          dropCapBg: '#F4F4F5',
          dropCapText: '#18181B',
          name: 'Putih',
        };
    }
  }, [settings.theme]);

  // Selected Font
  const selectedFontObj = useMemo(() => {
    return AVAILABLE_FONTS.find(f => f.id === settings.fontFamily) || AVAILABLE_FONTS[0];
  }, [settings.fontFamily]);

  const fontFamilyClass = selectedFontObj.className;

  // Line Height multiplier
  const lineSpacingMultiplier = 
    settings.lineSpacing === 'tight' ? 1.5 :
    settings.lineSpacing === 'loose' ? 2.0 : 1.75;

  // Current page text
  const currentPageText = pages[safePageIndex] || '';

  // Drop Cap on chapter opening page
  const firstParagraph = currentPageText.split('\n\n')[0] || '';
  const remainingParagraphs = currentPageText.split('\n\n').slice(1);
  const dropCapLetter = firstParagraph.charAt(0);
  const firstParagraphAfterLetter = firstParagraph.slice(1);
  const wordsInFirstParagraph = firstParagraphAfterLetter.split(' ');
  const smallCapsWords = wordsInFirstParagraph.slice(0, 3).join(' ');
  const normalFirstParagraphRest = wordsInFirstParagraph.slice(3).join(' ');

  // Helper to render clean page content
  const renderPageBody = (text: string, isFirstPageOfChapter: boolean) => {
    if (isFirstPageOfChapter && dropCapLetter) {
      return (
        <div 
          className={`flex-1 w-full text-justify hyphens-auto select-text leading-relaxed ${fontFamilyClass}`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: lineSpacingMultiplier,
            letterSpacing: '0.01em',
          }}
        >
          {/* First Paragraph with Modern Drop Cap */}
          <div className="mb-4 relative">
            <span
              className="float-left font-display font-bold text-4xl sm:text-5xl leading-none mr-3 px-2.5 py-1.5 rounded-xl select-none"
              style={{
                color: currentTheme.dropCapText,
                backgroundColor: currentTheme.dropCapBg,
                marginTop: '3px',
              }}
            >
              {dropCapLetter}
            </span>

            <span className="font-sans font-bold uppercase tracking-wider text-[0.85em] opacity-90 mr-1.5">
              {smallCapsWords}
            </span>

            <span>{normalFirstParagraphRest}</span>
          </div>

          {remainingParagraphs.map((para, idx) => (
            <p key={idx} className="mb-4 indent-4">
              {para}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div 
        className={`flex-1 w-full text-justify hyphens-auto select-text leading-relaxed space-y-4 whitespace-pre-line ${fontFamilyClass}`}
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: lineSpacingMultiplier,
          letterSpacing: '0.01em',
        }}
      >
        {text.split('\n\n').map((para, idx) => (
          <p key={idx} className={idx > 0 ? 'indent-4' : ''}>
            {para}
          </p>
        ))}
      </div>
    );
  };

  // Modern Motion animation variants for ultra-smooth realistic page flipping
  const pageVariants = {
    initial: (direction: 'next' | 'prev') => ({
      opacity: 0,
      x: direction === 'next' ? 40 : -40,
      rotateY: direction === 'next' ? 6 : -6,
      scale: 0.98,
      filter: 'blur(2px)',
    }),
    animate: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1], // Apple-style spring ease
      },
    },
    exit: (direction: 'next' | 'prev') => ({
      opacity: 0,
      x: direction === 'next' ? -40 : 40,
      rotateY: direction === 'next' ? -6 : 6,
      scale: 0.98,
      filter: 'blur(2px)',
      transition: {
        duration: 0.26,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div
      id="reader-mode-fullscreen-container"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`fixed inset-0 z-50 select-none overflow-hidden touch-none flex items-center justify-center transition-colors duration-300 perspective-book ${
        settings.theme === 'dark' || settings.theme === 'oled' ? 'dark' : ''
      }`}
      style={{
        height: '100dvh',
        width: '100vw',
        backgroundColor: currentTheme.outerBg,
        color: currentTheme.text,
      }}
    >
      {/* ===================================================================== */}
      {/* CHAPTER BREAK INTERSTITIAL BANNER OVERLAY                             */}
      {/* ===================================================================== */}
      {chapterTransitionInfo && (
        <div 
          id="chapter-break-overlay"
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-200"
          style={{ backgroundColor: currentTheme.paperBg, color: currentTheme.text }}
        >
          <div className="max-w-md space-y-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-gray-100 text-gray-800">
              Bab {chapterTransitionInfo.chapterNumber}
            </span>

            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              {chapterTransitionInfo.title}
            </h2>

            {chapterTransitionInfo.subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 font-sans">
                {chapterTransitionInfo.subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODERN FLOATING TOPBAR (Dribbble Glassmorphic Styling)                */}
      {/* ===================================================================== */}
      <header
        id="reader-top-header"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-4 left-4 right-4 max-w-4xl mx-auto h-14 px-3 sm:px-4 rounded-full border flex items-center justify-between z-40 backdrop-blur-md transition-all duration-300 ${
          showControls 
            ? 'opacity-100 translate-y-0 pointer-events-auto shadow-lg' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          backgroundColor: settings.theme === 'dark' ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: currentTheme.border,
          color: currentTheme.text,
        }}
      >
        {/* Left: Back button & TOC Drawer Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="reader-back-to-detail-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-9 px-3 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center gap-1.5 text-xs font-sans font-bold cursor-pointer transition-all active:scale-95 text-gray-800 dark:text-gray-200"
            title="Kembali"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Kembali</span>
          </button>

          <button
            id="reader-toc-drawer-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsUI(false);
              setShowFontDropdown(false);
              setShowTOCDrawer(true);
            }}
            className="h-9 px-3 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center gap-1.5 text-xs font-sans font-bold cursor-pointer transition-all active:scale-95 text-gray-800 dark:text-gray-200"
            title="Daftar Bab & Isi"
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Bab</span>
          </button>
        </div>

        {/* Center: Book Title */}
        <div className="text-center max-w-[35%] sm:max-w-[40%] truncate px-2">
          <h2 className="font-sans text-xs sm:text-sm font-bold truncate">
            {book.title}
          </h2>
          <span className="text-[10px] text-gray-400 font-sans block truncate">
            {currentChapter.title}
          </span>
        </div>

        {/* Right: Settings trigger & Quick Page Turn Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="reader-settings-toggle-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsUI(prev => !prev);
              setShowFontDropdown(false);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              showSettingsUI
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
            }`}
            title="Pengaturan Tampilan"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-full">
            <button
              id="reader-quick-prev-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executePageTurn('prev');
              }}
              disabled={chapterIndex === 0 && safePageIndex === 0}
              className="w-8 h-8 rounded-full disabled:opacity-30 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer text-gray-700 dark:text-gray-200"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              id="reader-quick-next-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executePageTurn('next');
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer text-gray-700 dark:text-gray-200"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* ULTRA-SMOOTH BOOK STAGE (Modern Rounded Paper Sheet)                 */}
      {/* ===================================================================== */}
      <div 
        id="physical-book-wrapper"
        className="relative flex items-center justify-center w-full h-full max-w-[680px] max-h-[920px] p-3 sm:p-6"
      >
        <AnimatePresence mode="popLayout" custom={turnDirection}>
          <motion.div
            key={`${chapterIndex}-${safePageIndex}`}
            custom={turnDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            id="physical-paper-sheet"
            className="w-full h-full flex flex-col justify-between overflow-hidden rounded-3xl shadow-xl relative"
            style={{
              backgroundColor: currentTheme.paperBg,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            {/* Running Header */}
            <div 
              id="running-header"
              className="w-full pt-6 pb-2 px-6 sm:px-12 flex items-center justify-between text-[10px] font-sans font-semibold tracking-wider uppercase select-none opacity-50"
              style={{ color: currentTheme.mutedText }}
            >
              <span className="truncate max-w-[50%]">
                {safePageIndex % 2 === 0 ? currentChapter?.title : book.title}
              </span>
              <span>
                Bab {chapterIndex + 1}
              </span>
            </div>

            {/* Main Content Area */}
            <main 
              id="page-text-content-wrapper"
              className="flex-1 w-full max-w-[620px] mx-auto px-6 sm:px-12 py-2 flex flex-col justify-start overflow-hidden relative"
            >
              {/* Chapter Header Banner on Page 1 of Chapter */}
              {safePageIndex === 0 && currentChapter?.subtitle && (
                <div 
                  className="mb-4 pb-3 border-b"
                  style={{ borderColor: currentTheme.border }}
                >
                  <span className="inline-block text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 mb-2">
                    Bagian {chapterIndex + 1}
                  </span>
                  <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                    {currentChapter.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-sans mt-1">
                    {currentChapter.subtitle}
                  </p>
                </div>
              )}

              {/* Rendered Text Body */}
              {renderPageBody(currentPageText, safePageIndex === 0)}
            </main>

            {/* Running Footer */}
            <footer 
              id="running-footer"
              className="w-full pb-6 pt-2 px-6 sm:px-12 flex items-center justify-between text-[11px] font-sans font-medium select-none opacity-60"
              style={{ color: currentTheme.mutedText }}
            >
              <span className="text-[10px] hidden sm:inline">
                Hal. {safePageIndex + 1} / {pages.length}
              </span>
              
              <span className="mx-auto font-sans text-xs font-bold">
                {safePageIndex + 1 + chapterIndex * 12}
              </span>

              <span className="text-[10px] font-bold">
                {overallProgress}%
              </span>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===================================================================== */}
      {/* TRANSPARENT BACKDROP FOR SETTINGS POPUP                              */}
      {/* ===================================================================== */}
      {showSettingsUI && (
        <div
          id="settings-ui-dismiss-backdrop"
          onClick={() => {
            setShowSettingsUI(false);
            setShowFontDropdown(false);
          }}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ===================================================================== */}
      {/* MODERN SETTINGS POP-UP (Clean Rounded White Card)                    */}
      {/* ===================================================================== */}
      <div
        id="settings-panel"
        className={`fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[460px] p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200/80 dark:border-zinc-800 shadow-2xl z-40 transition-all duration-300 ${
          showSettingsUI 
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
            : 'opacity-0 translate-y-6 pointer-events-none scale-95'
        }`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-900 dark:text-white" />
              <span className="text-xs font-sans font-bold text-gray-900 dark:text-white">
                Pengaturan Tampilan Baca
              </span>
            </div>

            <button
              id="settings-popup-close-btn"
              onClick={() => {
                setShowSettingsUI(false);
                setShowFontDropdown(false);
              }}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 1: Font Size Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-sans font-semibold text-gray-700 dark:text-gray-300">
              <span>Ukuran Teks</span>
              <span className="font-mono text-xs font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                {settings.fontSize} px
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-bold text-gray-400">A-</span>
              <input
                id="font-size-volume-slider"
                type="range"
                min="13"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-neutral-900 dark:accent-white bg-gray-200 dark:bg-zinc-700"
              />
              <span className="text-base font-bold text-gray-900 dark:text-white">A+</span>
            </div>
          </div>

          {/* Row 2: Font Family Dropdown */}
          <div className="relative">
            <div className="text-xs font-sans font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Jenis Huruf
            </div>

            <button
              id="font-dropdown-trigger-btn"
              type="button"
              onClick={() => setShowFontDropdown(prev => !prev)}
              className="w-full py-2.5 px-3.5 bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-gray-900 dark:text-white text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span className={selectedFontObj.className}>
                  {selectedFontObj.label}
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  ({selectedFontObj.sub})
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {showFontDropdown && (
              <div
                id="font-selection-popover"
                className="absolute left-0 right-0 bottom-full mb-2 p-2 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl z-50 max-h-52 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150"
              >
                {AVAILABLE_FONTS.map((f) => {
                  const isSelected = settings.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, fontFamily: f.id }));
                        setShowFontDropdown(false);
                      }}
                      className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold' 
                          : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${f.className}`}>
                          {f.label}
                        </span>
                        <span className="text-[10px] opacity-70">
                          · {f.sub}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Row 3: Line Spacing & Theme Segment Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
            {/* Line Spacing */}
            <div>
              <span className="text-[11px] font-sans font-semibold block mb-1 text-gray-600 dark:text-gray-400">
                Spasi Baris
              </span>
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                {[
                  { id: 'tight' as ReaderLineSpacing, label: 'Rapat' },
                  { id: 'normal' as ReaderLineSpacing, label: 'Normal' },
                  { id: 'loose' as ReaderLineSpacing, label: 'Lega' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSettings(prev => ({ ...prev, lineSpacing: s.id }))}
                    className={`flex-1 py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${
                      settings.lineSpacing === s.id
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white font-bold shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Picker */}
            <div>
              <span className="text-[11px] font-sans font-semibold block mb-1 text-gray-600 dark:text-gray-400">
                Mode Tema
              </span>
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                {[
                  { id: 'light' as ReaderTheme, label: 'Terang', icon: Sun },
                  { id: 'dark' as ReaderTheme, label: 'Gelap', icon: Moon },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = settings.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSettings(prev => ({ ...prev, theme: t.id }))}
                      className={`flex-1 py-1.5 text-xs font-sans rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white font-bold shadow-xs'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODERN TABLE OF CONTENTS (DAFTAR BAB & ISI) DRAWER                   */}
      {/* ===================================================================== */}
      {showTOCDrawer && (
        <div 
          id="toc-drawer-root"
          className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div 
            id="toc-drawer-backdrop"
            onClick={() => setShowTOCDrawer(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Container (Slide from left in clean modern white) */}
          <div 
            id="toc-drawer-panel"
            className="relative w-[85%] sm:w-[380px] h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-250 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400">
                  Daftar Isi
                </span>
                <h3 className="font-sans text-lg font-bold text-gray-900 dark:text-white">
                  Daftar Bab & Isi
                </h3>
                <p className="text-xs truncate max-w-[220px] text-gray-500 font-sans">
                  {book.title}
                </p>
              </div>
              <button
                id="toc-drawer-close-btn"
                type="button"
                onClick={() => setShowTOCDrawer(false)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {book.chapters.map((ch, idx) => {
                const isCurrent = chapterIndex === idx;

                return (
                  <button
                    key={ch.id}
                    id={`toc-chapter-item-${idx}`}
                    type="button"
                    onClick={() => handleJumpToChapter(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl flex items-start gap-3.5 transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm' 
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800/60 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <span 
                      className={`text-xs font-sans font-bold px-2 py-1 rounded-xl shrink-0 ${
                        isCurrent 
                          ? 'bg-white/20 text-white dark:bg-neutral-900/10 dark:text-neutral-900' 
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-sans font-bold truncate">
                          {ch.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                            Aktif
                          </span>
                        )}
                      </div>
                      {ch.subtitle && (
                        <p className={`text-xs font-sans line-clamp-1 mt-0.5 ${isCurrent ? 'opacity-80' : 'text-gray-500'}`}>
                          {ch.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 text-center text-xs font-sans text-gray-400">
              {book.chapters.length} Bab · {overallProgress}% Selesai
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
