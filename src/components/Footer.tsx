import React, { useState } from 'react';
import { 
  Send, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Heart,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onOpenFAQ?: () => void;
  onOpenHelpCenter?: () => void;
  onNavigateToExplore?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFAQ,
  onOpenHelpCenter,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer 
      id="app-global-footer" 
      className="mt-14 pt-8 pb-12 font-sans"
    >
      <div className="space-y-6">
        {/* Clean Editorial Bento Card for Newsletter (Viral Minimalist Paper Style) */}
        <div className="relative rounded-2xl p-6 sm:p-7 bg-[#FAF9F6] border border-[#E8E6DF] shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Newsletter Info */}
            <div className="space-y-1 text-center md:text-left max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-800 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Literasi Akses Terbuka</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display pt-1">
                Buletin Kurasi Pustaka Lensa
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Rangkuman karya klasik & wawasan filsafat terkurasi langsung ke emailmu setiap minggu.
              </p>
            </div>

            {/* Subscribe Form */}
            <div className="w-full md:w-auto shrink-0">
              {isSubscribed ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Email terdaftar! Selamat bergabung.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-80">
                  <input
                    type="email"
                    required
                    placeholder="Alamat email aktif..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-10 px-3.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Kirim</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Clean Single Horizontal Row: Brand + Socials + FAQ/Bantuan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          {/* Brand Info */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-neutral-900 tracking-tight">
              Pustaka Lensa
            </span>
            <span className="text-xs text-neutral-300">|</span>
            <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Bebas Biaya
            </span>
          </div>

          {/* Social Media & Help Action Chips (Strictly Horizontal) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-700 transition-colors shadow-2xs"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X</span>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-700 transition-colors shadow-2xs"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
              <span>TikTok</span>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-700 transition-colors shadow-2xs"
            >
              <Send className="w-3 h-3 text-blue-500" />
              <span>Telegram</span>
            </a>

            {/* FAQ Button */}
            <button
              onClick={onOpenFAQ}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-700 transition-colors cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>FAQ</span>
            </button>

            {/* Help Center Button */}
            <button
              onClick={onOpenHelpCenter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-medium text-neutral-700 transition-colors cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Bantuan</span>
            </button>
          </div>
        </div>

        {/* Minimal Subtle Copyright Note */}
        <div className="pt-3 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Pustaka Lensa. Platform Literasi Terbuka.</p>
          <p className="flex items-center gap-1 text-neutral-400">
            Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> untuk semua pembaca
          </p>
        </div>
      </div>
    </footer>
  );
};
