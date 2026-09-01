import React from 'react';
import { Home, Bookmark, Compass, LayoutGrid, Clock, Settings, Sparkles, BookOpen, Trophy } from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  savedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, savedCount }) => {
  const menuItems = [
    { id: 'beranda' as NavigationTab, label: 'Beranda', icon: Home },
    { id: 'top-charts' as NavigationTab, label: 'Top Charts', icon: Trophy },
    { id: 'jelajahi' as NavigationTab, label: 'Jelajahi', icon: Compass },
    { id: 'rak-bukuku' as NavigationTab, label: 'Rak Bukuku', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'kategori' as NavigationTab, label: 'Kategori', icon: LayoutGrid },
    { id: 'riwayat' as NavigationTab, label: 'Riwayat Baca', icon: Clock },
    { id: 'pengaturan' as NavigationTab, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside 
      id="main-sidebar"
      className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[#F8F9FA] border-r border-gray-200/80 z-30 select-none justify-between p-4"
    >
      {/* Top Branding & Main Navigation */}
      <div className="space-y-6">
        {/* Modern Logo Header */}
        <div 
          id="sidebar-logo-brand"
          onClick={() => onSelectTab('beranda')}
          className="p-3 cursor-pointer group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-sans text-base font-bold text-gray-900 tracking-tight block">
              Pustaka Lensa
            </span>
            <span className="font-sans text-[10px] text-gray-400 font-medium">
              Eksplorasi Baca Modern
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full h-11 px-4 rounded-full flex items-center justify-between text-xs font-sans font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Card / Info */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-sans font-bold text-gray-800">Target Membaca</span>
        </div>
        <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
          3 dari 5 bab terselesaikan hari ini. Pertahankan streak bacaanmu!
        </p>
      </div>
    </aside>
  );
};
