import React from 'react';
import { Home, Bookmark, Compass, User, Sparkles, Trophy } from 'lucide-react';
import { NavigationTab } from '../types';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
}) => {
  const tabs = [
    { id: 'beranda' as NavigationTab, label: 'Beranda', icon: Home },
    { id: 'top-charts' as NavigationTab, label: 'Top Charts', icon: Trophy },
    { id: 'jelajahi' as NavigationTab, label: 'Jelajahi', icon: Compass },
    { id: 'rak-bukuku' as NavigationTab, label: 'Rak Buku', icon: Bookmark, badge: savedCount },
    { id: 'pengaturan' as NavigationTab, label: 'Akun', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav 
        id="mobile-bottom-navbar"
        className="pointer-events-auto h-14 bg-neutral-900 text-white rounded-full shadow-2xl flex items-center justify-between px-3 w-full max-w-[340px] border border-white/10 backdrop-blur-md"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center justify-center transition-all cursor-pointer ${
                isActive ? 'w-10 h-10 rounded-full bg-white text-neutral-900 shadow-sm' : 'w-10 h-10 text-gray-400 hover:text-white'
              }`}
              title={tab.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              
              {/* Badge for Saved books */}
              {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
