import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Video, 
  Flame, 
  Gift, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  X, 
  Share2, 
  Bell, 
  Bookmark,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { EventBanner, DUMMY_EVENTS } from '../data/dummyEvents';
import { Book } from '../types';

interface EventBannerCarouselProps {
  onSelectBookById?: (bookId: string) => void;
  onNavigateToExplore?: () => void;
  books: Book[];
}

export const EventBannerCarousel: React.FC<EventBannerCarouselProps> = ({
  onSelectBookById,
  onNavigateToExplore,
  books,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<EventBanner | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideDurationMs = 5000; // 5 seconds per slide before advancing

  const events = DUMMY_EVENTS;

  // Advance to next slide
  const handleNext = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  // Go to previous slide
  const handlePrev = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  // Auto loop timer
  useEffect(() => {
    if (isPaused || selectedEventModal) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, slideDurationMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, selectedEventModal, handleNext]);

  const currentEvent = events[currentIndex];

  const handleActionClick = (e: React.MouseEvent, event: EventBanner) => {
    e.stopPropagation();
    if (event.actionType === 'open_book' && event.relatedBookId && onSelectBookById) {
      onSelectBookById(event.relatedBookId);
    } else {
      setSelectedEventModal(event);
    }
  };

  const handleJoinEvent = (eventId: string) => {
    setJoinedEvents((prev) => ({ ...prev, [eventId]: true }));
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899']
    });
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'gift':
        return <Gift className="w-4 h-4 text-purple-400" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Drag swipe detection
  const touchStartXRef = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (diff < -40) {
      handleNext();
    } else if (diff > 40) {
      handlePrev();
    }
  };

  return (
    <section 
      id="dashboard-event-carousel-section" 
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h2 className="font-sans text-base font-bold text-gray-900">
            Agenda & Peluncuran Eksklusif
          </h2>
        </div>

        {/* Carousel Indicators & Arrows */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
            {events.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 'left' : 'right');
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-6 bg-neutral-900' 
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner Card Stage */}
      <div className="relative w-full h-[260px] sm:h-[280px] rounded-3xl overflow-hidden shadow-lg border border-gray-200/80 bg-neutral-950">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentEvent.id}
            custom={direction}
            initial={{ opacity: 0, x: direction === 'left' ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'left' ? -80 : 80 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => handleActionClick(e, currentEvent)}
            className={`absolute inset-0 p-5 sm:p-7 flex flex-col justify-between cursor-pointer bg-gradient-to-br ${currentEvent.bgGradient}`}
          >
            {/* Background Texture & Ambient Glow */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
            <div 
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: currentEvent.accentColor }}
            />

            {/* Top Bar inside Banner: Category Tag, Date/Badge */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-sans font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 ${currentEvent.tagColor}`}>
                  {getIcon(currentEvent.iconName)}
                  <span>{currentEvent.tag}</span>
                </span>

                {currentEvent.badge && (
                  <span className="hidden xs:inline-flex bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    {currentEvent.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans text-[11px] font-medium">{currentEvent.dateOrDuration}</span>
              </div>
            </div>

            {/* Middle: Title, Subtitle, Description */}
            <div className="relative z-10 max-w-2xl space-y-1.5 my-auto">
              <h3 className="font-display text-lg sm:text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-xs line-clamp-2">
                {currentEvent.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-sans line-clamp-1">
                {currentEvent.subtitle}
              </p>
              {currentEvent.stats && (
                <p className="text-[11px] font-sans font-medium text-emerald-300/90 pt-1">
                  {currentEvent.stats}
                </p>
              )}
            </div>

            {/* Bottom Bar: Action Button + Auto Slide Progress Bar */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-gray-400 font-sans">
                  {currentEvent.speakerOrAuthor ? `Bersama ${currentEvent.speakerOrAuthor}` : 'Terbuka untuk Semua Anggota'}
                </span>
              </div>

              <button
                onClick={(e) => handleActionClick(e, currentEvent)}
                className="h-9 px-4 rounded-full bg-white text-neutral-950 hover:bg-gray-100 text-xs font-sans font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer shrink-0"
              >
                <span>{currentEvent.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Live Loop Progress Line (Subtle bottom line that fills over 5s) */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden z-20">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: slideDurationMs / 1000, ease: 'linear' }}
              className="h-full bg-emerald-400/80"
            />
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* INTERACTIVE EVENT REGISTRATION / DETAIL MODAL                         */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedEventModal && (
          <div 
            id="event-detail-modal-root" 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEventModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-200 z-10 space-y-5 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Event Header Tag */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-sans font-bold px-3 py-1 rounded-full ${selectedEventModal.tagColor}`}>
                  {selectedEventModal.tag}
                </span>
                <span className="text-xs text-gray-500 font-sans">
                  {selectedEventModal.dateOrDuration}
                </span>
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {selectedEventModal.title}
                </h3>
                <p className="text-sm font-sans text-gray-600 leading-relaxed">
                  {selectedEventModal.description}
                </p>
              </div>

              {/* Event Key Highlights */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Waktu Acara</span>
                    <span className="font-bold text-gray-800">{selectedEventModal.dateOrDuration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px]">Penyelenggara</span>
                    <span className="font-bold text-gray-800">
                      {selectedEventModal.speakerOrAuthor || 'Kurasi Pustaka'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Join Action Area */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Tautan acara berhasil disalin ke clipboard!');
                    }
                  }}
                  className="h-11 px-4 rounded-full border border-gray-200 text-gray-700 text-xs font-sans font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>

                {joinedEvents[selectedEventModal.id] ? (
                  <div className="h-11 px-6 rounded-full bg-emerald-500 text-white text-xs font-sans font-bold flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terdaftar & Siap Mengikuti</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleJoinEvent(selectedEventModal.id)}
                    className="h-11 px-6 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-sans font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{selectedEventModal.actionText}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
