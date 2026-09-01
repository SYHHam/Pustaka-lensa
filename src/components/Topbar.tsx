import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, BookOpen, Check, LogOut, User as UserIcon } from 'lucide-react';
import { Book } from '../types';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  isLoggedIn?: boolean;
  onNavigateToSettings?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  books,
  onSelectBook,
  userName = "Budi",
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  userEmail = "pembaca@pustakalensa.id",
  isLoggedIn = true,
  onNavigateToSettings,
  onOpenAuthModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filtered books for search dropdown
  const searchResults = searchQuery.trim()
    ? books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      id="main-topbar"
      className="sticky top-0 z-50 h-16 bg-[#F8F9FA] border-b border-gray-200/80 px-4 md:px-8 flex items-center justify-between shadow-xs transition-all"
    >
      {/* Left: Search Bar with Clean Rounded Styling */}
      <div ref={searchContainerRef} className="relative w-full max-w-xs md:max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            id="topbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Cari judul buku, penulis, topik..."
            autoComplete="off"
            spellCheck="false"
            className="w-full h-10 pl-10 pr-9 bg-white border border-gray-200/80 rounded-full text-xs text-gray-900 placeholder-gray-400 font-sans focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              id="topbar-clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Search Dropdown */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div 
            id="search-results-dropdown"
            className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-xl p-2 max-h-80 overflow-y-auto z-40 border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-2 text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              Hasil Pencarian ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500 font-sans">
                Tidak ada buku yang cocok dengan "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                {searchResults.map((book) => (
                  <button
                    key={book.id}
                    id={`search-item-${book.id}`}
                    onClick={() => {
                      onSelectBook(book);
                      setIsSearchFocused(false);
                      onSearchChange('');
                    }}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <div 
                      className="w-8 h-11 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold shadow-xs"
                      style={{ backgroundColor: book.coverColor }}
                    >
                      <BookOpen className="w-4 h-4 opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 group-hover:text-black truncate font-sans">
                        {book.title}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate font-sans">
                        {book.author} · <span className="font-semibold">{book.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            id="topbar-notif-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasNewNotification(false);
            }}
            className="w-10 h-10 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer relative active:scale-95"
            title="Pemberitahuan"
          >
            <Bell className="w-4 h-4" />
            {hasNewNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 shadow-xs"></span>
            )}
          </button>

          {showNotifications && (
            <div 
              id="topbar-notif-dropdown"
              className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl p-4 border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-sans text-xs font-bold text-gray-900">Notifikasi</span>
                <span className="text-[10px] text-gray-400 font-sans">Baru</span>
              </div>
              <div className="py-3 space-y-2 text-xs text-gray-600 font-sans">
                <div className="p-2.5 rounded-xl bg-gray-50 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Koleksi baru tersedia</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">3 judul baru ditambahkan ke katalog minggu ini.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Pill OR Login Button */}
        {isLoggedIn ? (
          <div ref={userMenuRef} className="relative">
            <button
              id="topbar-user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 bg-white border border-gray-200/80 rounded-full shadow-xs hover:bg-gray-50 transition-all cursor-pointer"
            >
              <img 
                src={userAvatar} 
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline font-sans text-xs font-semibold text-gray-800">
                {userName}
              </span>
            </button>

            {showUserMenu && (
              <div 
                id="topbar-user-dropdown"
                className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl p-2 border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
                  <p className="text-[10px] text-gray-500 font-sans truncate">{userEmail}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                    ✓ Terverifikasi Anti-Sybil
                  </span>
                </div>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateToSettings) onNavigateToSettings();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-sans flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>Pengaturan Akun</span>
                </button>

                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onOpenAuthModal) onOpenAuthModal('login');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-xl transition-colors font-sans flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ganti / Masuk Akun Lain</span>
                </button>

                <div className="border-t border-gray-100 pt-1">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-sans flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              id="topbar-login-gate-btn"
              onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
              className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-black text-white font-sans text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Masuk / Daftar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
