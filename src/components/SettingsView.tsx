import React, { useState } from 'react';
import { 
  AlertCircle, 
  MessageCircle, 
  UserCog, 
  Globe, 
  Camera, 
  Lock, 
  LogOut, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Send, 
  Heart,
  X,
  BookOpen,
  Info,
  Calendar,
  Layers,
  ArrowLeft,
  Target,
  Compass,
  Bot,
  CheckCircle2,
  ChevronDown,
  Search,
  HelpCircle,
  FileText,
  Quote,
  Award,
  Users,
  BookMarked,
  Lightbulb,
  MessageCircleQuestion
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_FAQS } from './FAQModal';
import { AuthUser } from '../types';

export type SettingsSubView = 'main' | 'setting-akun' | 'about-us' | 'feedback';

interface SettingsViewProps {
  userName: string;
  onUpdateUserName: (name: string) => void;
  userAvatar?: string;
  onUpdateAvatar?: (avatarUrl: string) => void;
  initialSubView?: SettingsSubView;
  currentUser?: AuthUser | null;
  isLoggedIn?: boolean;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
  onLogout?: () => void;
}

type ActiveSubView = SettingsSubView;

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  userName, 
  onUpdateUserName,
  userAvatar = PRESET_AVATARS[0],
  onUpdateAvatar,
  initialSubView = 'main',
  currentUser,
  isLoggedIn = true,
  onOpenAuthModal,
  onLogout
}) => {
  const [activeSubView, setActiveSubView] = useState<ActiveSubView>(initialSubView);
  
  // About Us Local State (FAQ within About Us)
  const [aboutFaqCategory, setAboutFaqCategory] = useState<string>('Semua');
  const [aboutFaqSearch, setAboutFaqSearch] = useState<string>('');
  const [aboutFaqOpenId, setAboutFaqOpenId] = useState<string | null>('tp-1');
  
  // Setting Akun State
  const [currentAvatar, setCurrentAvatar] = useState<string>(userAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const [newUsernameInput, setNewUsernameInput] = useState<string>(userName);
  const [lastUsernameChangeDate, setLastUsernameChangeDate] = useState<string | null>(() => {
    return localStorage.getItem('pustaka_username_change_date');
  });
  const [usernameSavedMsg, setUsernameSavedMsg] = useState<string | null>(null);
  
  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Logout Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Feedback State
  const [feedbackCategory, setFeedbackCategory] = useState('Saran Fitur');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Check 1x/month username rule
  const canChangeUsername = () => {
    if (!lastUsernameChangeDate) return true;
    const lastDate = new Date(lastUsernameChangeDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 30;
  };

  const getDaysUntilNextChange = () => {
    if (!lastUsernameChangeDate) return 0;
    const lastDate = new Date(lastUsernameChangeDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsernameInput.trim()) return;

    if (!canChangeUsername()) {
      setUsernameSavedMsg(`Username hanya dapat diubah 1x per bulan. Coba lagi dalam ${getDaysUntilNextChange()} hari.`);
      return;
    }

    onUpdateUserName(newUsernameInput.trim());
    const todayStr = new Date().toISOString();
    setLastUsernameChangeDate(todayStr);
    localStorage.setItem('pustaka_username_change_date', todayStr);
    setUsernameSavedMsg('Username berhasil diperbarui! (Dapat diubah kembali dalam 30 hari)');
    setTimeout(() => setUsernameSavedMsg(null), 4000);
  };

  const handleSelectAvatar = (url: string) => {
    setCurrentAvatar(url);
    if (onUpdateAvatar) {
      onUpdateAvatar(url);
    }
  };

  const handleCustomAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      handleSelectAvatar(customAvatarUrl.trim());
      setCustomAvatarUrl('');
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);

    if (!oldPassword) {
      setPasswordErrorMsg('Mohon masukkan kata sandi lama.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setPasswordSuccessMsg('Kata sandi berhasil diperbarui dengan aman!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(null), 3500);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackText('');
      setFeedbackEmail('');
      setActiveSubView('main');
    }, 2200);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggedOut(true);
    setTimeout(() => {
      setIsLoggedOut(false);
      if (onLogout) {
        onLogout();
      } else {
        onUpdateUserName('Budi');
      }
      setActiveSubView('main');
    }, 1200);
  };

  return (
    <div id="profile-settings-root" className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Profil & Pengaturan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">
            Kelola akun pembaca, tentang Pustaka Lensa, dan kirim masukan.
          </p>
        </div>

        {activeSubView !== 'main' && (
          <button
            onClick={() => setActiveSubView('main')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-sans font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
        )}
      </div>

      {/* Profile Overview Card (Clean Header) */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={currentAvatar} 
                alt={userName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-gray-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-sans font-bold text-gray-900">{userName}</h2>
                {isLoggedIn ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Terverifikasi
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold">
                    Tamu (Belum Masuk)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold">
                  {currentUser?.email || 'pembaca@pustakalensa.id'}
                </span>
                <span className="text-[11px] text-gray-400 font-sans">
                  {currentUser?.provider === 'google' ? 'Google Account' : 'Email OTP Verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeSubView === 'main' && (
              <>
                <button
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-sans font-bold text-amber-900 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isLoggedIn ? 'Ganti / Masuk Akun' : 'Masuk / Daftar'}</span>
                </button>

                <button
                  onClick={() => setActiveSubView('setting-akun')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-sans font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Edit Akun</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MAIN MENU LIST (When activeSubView === 'main') */}
      {/* ========================================================================= */}
      {activeSubView === 'main' && (
        <div className="space-y-4">
          {/* Menu Action Cards */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs divide-y divide-gray-100">
            {/* 1. About Us (Icon Bulat & Tanda Seru di Dalam) */}
            <button
              onClick={() => setActiveSubView('about-us')}
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    About Us
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    Visi literasi terbuka, kurasi karya, dan komitmen akses bebas biaya.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 2. Feedback */}
            <button
              onClick={() => setActiveSubView('feedback')}
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Feedback & Saran
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    Kirimkan usulan fitur, perbaikan bacaan, atau pengalaman membacamu.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3. Setting Akun */}
            <button
              onClick={() => setActiveSubView('setting-akun')}
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-gray-900 group-hover:text-black transition-colors">
                    Setting Akun
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    Foto profil (PP), ubah username (1x/bulan), kata sandi (PW), & keluar akun.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* 4. Versi Web Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm font-bold text-gray-900">Versi Web</h3>
                  <span className="bg-neutral-900 text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                    v2.4.1
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Build 2026.8 • Platform Literasi Terbuka & Reader Engine Stabil
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Check className="w-3 h-3" /> Terkini
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ABOUT US SUB-VIEW (Tentang, Visi, Misi & FAQ — Pustaka Lensa) */}
      {/* ========================================================================= */}
      {activeSubView === 'about-us' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            {/* Header with Circle & Exclamation Icon */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold text-amber-600 uppercase tracking-widest block">
                  Informasi Resmi Platform
                </span>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-gray-900">
                  Tentang, Visi, Misi & FAQ — Pustaka Lensa
                </h2>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Mengenal platform buku digital edukatif terbuka, kurasi tim internal, dan panduan lengkap.
                </p>
              </div>
            </div>

            {/* Section 1: Tentang Pustaka Lensa */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-sans text-base font-bold text-gray-900">
                  Tentang Pustaka Lensa
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-sans leading-relaxed pl-1 sm:pl-2">
                <p>
                  <strong className="text-gray-900">Pustaka Lensa</strong> adalah platform buku digital yang terbuka untuk semua kalangan — tanpa membatasi diri pada kelompok usia atau profesi tertentu. Siapa pun yang ingin membaca dan belajar bisa mengakses koleksi buku edukatif di sini, kapan saja dan di mana saja.
                </p>
                <p>
                  Nama <em>"Pustaka Lensa"</em> sendiri sederhana: <strong className="text-gray-900">pustaka</strong> yang terbuka luas, seperti perpustakaan bagi siapa saja yang ingin mampir dan membaca.
                </p>
                <p>
                  Berbeda dari platform berbagi buku pada umumnya, seluruh koleksi di Pustaka Lensa dikurasi langsung oleh tim internal — bukan platform terbuka di mana sembarang orang bisa mengunggah buku. Pendekatan ini dipilih untuk menjaga kualitas dan kredibilitas setiap bacaan yang tersedia.
                </p>
              </div>
            </div>

            {/* Callout Box: Transparansi Penggunaan AI */}
            <div className="p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200/80 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-blue-900">
                <Bot className="w-4 h-4 text-blue-600 shrink-0" />
                <h4 className="font-sans text-xs sm:text-sm font-bold">
                  Transparansi Penggunaan AI
                </h4>
              </div>
              <div className="space-y-2 text-xs text-blue-950/80 font-sans leading-relaxed">
                <p>
                  Pustaka Lensa dibangun secara kolaboratif antara tim pengembang dan kecerdasan buatan (AI) — baik dalam proses desain platform maupun penyusunan sebagian konten. Ini kami sampaikan secara terbuka, bukan untuk ditutup-tutupi.
                </p>
                <p>
                  Yang perlu digarisbawahi: penggunaan AI di sini bukan sekadar <em>"minta generate, langsung publish"</em>. Setiap konten yang melibatkan AI tetap melalui proses verifikasi terhadap sumber-sumber terpercaya dan disesuaikan dengan kaidah edukatif, sebelum akhirnya ditinjau dan dipublikasikan oleh tim. Tujuannya sederhana: memanfaatkan AI sebagai alat bantu untuk bekerja lebih efisien, tanpa mengorbankan akurasi dan kredibilitas informasi yang sampai ke pembaca.
                </p>
              </div>
            </div>

            {/* Section 2: Tujuan Pustaka Lensa */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-sans text-base font-bold text-gray-900">
                  Tujuan Pustaka Lensa
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed pl-1 sm:pl-2">
                Pustaka Lensa hadir sebagai jawaban atas satu masalah yang cukup mendasar: <strong className="text-gray-900">minat baca masyarakat yang masih rendah</strong>. Di tengah banyaknya distraksi digital, membaca sering jadi aktivitas yang terpinggirkan — padahal membaca adalah salah satu cara paling sederhana untuk terus belajar dan berkembang.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/70 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <h4 className="font-sans text-xs font-bold text-gray-900">Buku Berkualitas & Akses Mudah</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Menghadirkan buku-buku berkualitas yang mudah diakses, sehingga tidak ada lagi alasan "susah cari bacaan bagus".
                  </p>
                </div>

                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/70 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-sans text-xs font-bold text-gray-900">Membaca Hidup & Personal</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Membuat pengalaman membaca digital terasa lebih hidup dan personal — mendekati sensasi membaca buku fisik.
                  </p>
                </div>

                <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/70 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-sans text-xs font-bold text-gray-900">Kebiasaan Bertahap</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Menumbuhkan kebiasaan membaca lewat target harian dan pelacakan progres konsisten tanpa terasa memaksa.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Visi & Misi */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-sans text-base font-bold text-gray-900">
                  Visi & Misi
                </h3>
              </div>

              {/* Visi Quote Block */}
              <div className="p-5 bg-neutral-900 text-white rounded-2xl space-y-2 relative overflow-hidden shadow-xs">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Quote className="w-4 h-4 inline" />
                  <span>Visi Resmi</span>
                </div>
                <p className="font-serif italic text-sm sm:text-base leading-relaxed text-neutral-100">
                  "Menjadi platform buku digital edukatif terpercaya yang menumbuhkan minat baca dan memperluas akses pengetahuan bagi masyarakat luas."
                </p>
              </div>

              {/* Misi 5 Pillars */}
              <div className="space-y-2.5 pt-1">
                <h4 className="font-sans text-xs font-bold text-gray-700 uppercase tracking-wider">
                  5 Misi Utama Pustaka Lensa:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      num: '1',
                      title: 'Koleksi Berkualitas & Kredibel',
                      desc: 'Menyediakan koleksi buku digital edukatif yang berkualitas, kredibel, dan mudah dipahami untuk berbagai kebutuhan belajar.',
                    },
                    {
                      num: '2',
                      title: 'Kemudahan Akses Ilmu',
                      desc: 'Memudahkan akses ilmu pengetahuan kapan saja dan di mana saja melalui platform yang praktis dan mudah digunakan.',
                    },
                    {
                      num: '3',
                      title: 'Budaya Literasi Menarik',
                      desc: 'Menumbuhkan budaya literasi dan kebiasaan membaca di tengah masyarakat melalui penyajian konten yang menarik dan relevan.',
                    },
                    {
                      num: '4',
                      title: 'Dukungan Self-Learning',
                      desc: 'Mendukung proses belajar mandiri (self-learning) dengan kurasi materi yang terstruktur dan sesuai kebutuhan pengguna.',
                    },
                    {
                      num: '5',
                      title: 'Inovasi Berkelanjutan',
                      desc: 'Terus berinovasi dalam pengembangan konten dan pengalaman membaca digital mengikuti perkembangan zaman.',
                    },
                  ].map((misi, idx) => (
                    <div
                      key={misi.num}
                      className={`p-3.5 rounded-2xl border border-gray-200/80 bg-gray-50/60 flex items-start gap-3 ${
                        idx === 4 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {misi.num}
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="font-sans text-xs font-bold text-gray-900">
                          {misi.title}
                        </h5>
                        <p className="text-[11px] text-gray-600 font-sans leading-relaxed">
                          {misi.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: FAQ Terintegrasi (Pertanyaan yang Sering Diajukan) */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    <MessageCircleQuestion className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold text-gray-900">
                      FAQ (Pertanyaan yang Sering Diajukan)
                    </h3>
                    <p className="text-[11px] text-gray-500 font-sans">
                      Jawaban lengkap seputar platform, akun, mode baca, rating, dan dukungan.
                    </p>
                  </div>
                </div>

                {/* Category Filter Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['Semua', 'Tentang Platform', 'Akun & Penggunaan', 'Fitur Membaca', 'Rating & Komentar', 'Bantuan Lainnya'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setAboutFaqCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                        aboutFaqCategory === cat
                          ? 'bg-neutral-900 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan FAQ (misal: gratis, AI, font, login, bookmark)..."
                  value={aboutFaqSearch}
                  onChange={(e) => setAboutFaqSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans focus:outline-none focus:border-neutral-900 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-2.5">
                {OFFICIAL_FAQS
                  .filter((faq) => {
                    const matchCat = aboutFaqCategory === 'Semua' || faq.category === aboutFaqCategory;
                    const matchSearch =
                      faq.question.toLowerCase().includes(aboutFaqSearch.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(aboutFaqSearch.toLowerCase()) ||
                      faq.category.toLowerCase().includes(aboutFaqSearch.toLowerCase());
                    return matchCat && matchSearch;
                  })
                  .map((faq) => {
                    const isOpen = aboutFaqOpenId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-2xl overflow-hidden transition-colors bg-white shadow-2xs"
                      >
                        <button
                          type="button"
                          onClick={() => setAboutFaqOpenId(isOpen ? null : faq.id)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 bg-gray-50/70 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-sans font-bold text-amber-600 uppercase tracking-wider">
                              {faq.category}
                            </span>
                            <h5 className="font-sans text-xs sm:text-sm font-bold text-gray-900">
                              {faq.question}
                            </h5>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-neutral-900' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4 pt-2 bg-white border-t border-gray-100"
                            >
                              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Bottom Callout & Quick Link to Feedback */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Punya masukan atau ingin berdiskusi lebih lanjut dengan tim Pustaka Lensa?</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView('feedback')}
                className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white font-bold text-xs hover:bg-black shrink-0 transition-colors cursor-pointer text-center"
              >
                Kirim Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FEEDBACK SUB-VIEW */}
      {/* ========================================================================= */}
      {activeSubView === 'feedback' && (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-bold text-gray-900">Feedback & Masukan Pembaca</h2>
                <p className="text-xs text-gray-500 font-sans">Suaramu membantu kami menyempurnakan perpustakaan ini.</p>
              </div>
            </div>

            {feedbackSuccess ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-sans text-base font-bold text-emerald-900">Terima Kasih Banyak!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Masukan dan saranmu telah kami terima. Tim kurasi kami membaca setiap pesan dari pembaca.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-5">
                {/* Category Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Kategori Masukan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Saran Fitur', 'Usulan Buku Baru', 'Laporan Tampilan', 'Pujian & Lainnya'].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFeedbackCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                          feedbackCategory === cat
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Experience */}
                <div className="space-y-2">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Kepuasan Pengalaman Membaca
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                          feedbackRating >= star
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                            : 'bg-gray-100 text-gray-400 border border-transparent'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 font-sans ml-2">
                      {feedbackRating === 5 ? 'Sangat Memuaskan' : feedbackRating === 4 ? 'Bagus' : 'Cukup'}
                    </span>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Email Kontak (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                {/* Feedback Content */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Tuliskan Masukan atau Saranmu
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ceritakan saran fitur yang kamu harapkan, kendala saat membaca naskah, atau judul buku yang ingin ditambahkan..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-sans font-bold hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Feedback</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SETTING AKUN SUB-VIEW (PP, Username 1x/bln, PW, Logout) */}
      {/* ========================================================================= */}
      {activeSubView === 'setting-akun' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Sub-Section 1: Foto Profil (PP) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-7 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-gray-900">Foto Profil (PP)</h3>
                <p className="text-xs text-gray-500 font-sans">Pilih avatar favorit atau masukkan tautan foto profilmu.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img 
                src={currentAvatar} 
                alt="Selected Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md ring-2 ring-neutral-900"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-3 flex-1 w-full">
                <span className="text-xs font-sans font-bold text-gray-700 block">Pilihan Avatar Kurasi</span>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvatar(url)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        currentAvatar === url 
                          ? 'border-neutral-900 ring-2 ring-neutral-900/30 scale-110' 
                          : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomAvatarSubmit} className="flex gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://tautan-gambar-foto-kamu.jpg"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 bg-neutral-900 text-white rounded-xl text-xs font-sans font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Pakai URL
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sub-Section 2: Username (Hanya 1x / Bulan) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-gray-900">Ubah Username</h3>
                  <p className="text-xs text-gray-500 font-sans">Nama identitas pembaca di komunitas Pustaka Lensa.</p>
                </div>
              </div>

              {/* Status Limit Badge */}
              {canChangeUsername() ? (
                <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Dapat Diubah
                </span>
              ) : (
                <span className="text-[10px] font-sans font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {getDaysUntilNextChange()} Hari Tersisa
                </span>
              )}
            </div>

            {/* 1x/Month Rule Banner */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-sans flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Ketentuan Penggantian Username (1x / Bulan):</strong>
                <span>Untuk menjaga integritas profil pembaca dan riwayat bacaan, username hanya dapat diubah 1 kali setiap 30 hari.</span>
              </div>
            </div>

            <form onSubmit={handleSaveUsername} className="space-y-3">
              <div>
                <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Username Baru
                </label>
                <input
                  type="text"
                  value={newUsernameInput}
                  disabled={!canChangeUsername()}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  placeholder="Masukkan username baru..."
                  className="w-full h-11 px-4 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-semibold"
                />
              </div>

              {usernameSavedMsg && (
                <div className="text-xs font-sans font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{usernameSavedMsg}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={!canChangeUsername() || newUsernameInput === userName}
                  className="px-6 py-2.5 bg-neutral-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-full text-xs font-sans font-bold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Simpan Username
                </button>
              </div>
            </form>
          </div>

          {/* Sub-Section 3: Ubah Password (PW) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-7 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans text-base font-bold text-gray-900">Ubah Kata Sandi (PW)</h3>
                <p className="text-xs text-gray-500 font-sans">Perbarui kata sandi untuk keamanan akses akun pembaca.</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                  Kata Sandi Lama
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-bold text-gray-700 uppercase tracking-wider">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {passwordErrorMsg && (
                <div className="text-xs font-sans font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              {passwordSuccessMsg && (
                <div className="text-xs font-sans font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-sans font-bold hover:bg-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>

          {/* Sub-Section 4: Keluar Akun (Logout) */}
          <div className="bg-white rounded-3xl border border-red-100 p-6 md:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="font-sans text-base font-bold text-red-700">Keluar dari Akun</h3>
                <p className="text-xs text-gray-500 font-sans">
                  Selesaikan sesi pembaca saat ini pada perangkat ini.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-full text-xs font-sans font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOGOUT CONFIRMATION */}
      {/* ========================================================================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-sans text-base font-bold text-gray-900">Konfirmasi Keluar Akun</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Apakah kamu yakin ingin keluar dari akun <strong>{userName}</strong>? Riwayat dan koleksi rak buku akan tetap tersimpan di peramban ini.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-10 rounded-full border border-gray-200 text-xs font-sans font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 h-10 rounded-full bg-red-600 hover:bg-red-700 text-xs font-sans font-bold text-white transition-colors cursor-pointer shadow-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT SUCCESS NOTIFICATION */}
      {isLoggedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-sans text-sm font-bold text-gray-900">Berhasil Keluar</h4>
            <p className="text-xs text-gray-500 font-sans">Sampai jumpa lagi di sesi baca berikutnya!</p>
          </div>
        </div>
      )}
    </div>
  );
};
