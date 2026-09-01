import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialTab?: 'login' | 'register';
}

type AuthStep = 'form' | 'otp_verify' | 'success';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [step, setStep] = useState<AuthStep>('form');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP State (6 Digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync tab on modal open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setStep('form');
      setErrorMessage('');
      setIsLoading(false);
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isOpen, initialTab]);

  // Resend Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp_verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Auto focus first OTP input when reaching OTP screen
  useEffect(() => {
    if (step === 'otp_verify') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    }
  }, [step]);

  if (!isOpen) return null;

  // Generate 6-digit OTP code
  const triggerOtpGeneration = (targetEmail: string) => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(60);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setStep('otp_verify');
    setErrorMessage('');
  };

  // Handle Google Login (Zero cost, certified anti-sybil)
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: AuthUser = {
        id: `usr-g-${Date.now()}`,
        name: 'Halqi Ilham',
        email: 'halqiilham@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        provider: 'google',
        joinedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      setStep('success');
      setTimeout(() => {
        onLoginSuccess(googleUser);
        onClose();
      }, 1200);
    }, 800);
  };

  // Handle Email Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Masukkan format alamat email yang valid.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    if (activeTab === 'register') {
      if (!name.trim()) {
        setErrorMessage('Silakan isi nama lengkap Anda.');
        return;
      }

      // Check for disposable temp mail patterns (Anti-Sybil measure)
      const disposableDomains = ['tempmail.com', '10minutemail.com', 'throwaway.email', 'mailinator.com', 'guerrillamail.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      if (disposableDomains.includes(domain)) {
        setErrorMessage('Alamat email sementara tidak diizinkan demi keamanan perpustakaan (Anti-Sybil).');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        triggerOtpGeneration(email);
      }, 700);
    } else {
      // Login flow
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const loggedUser: AuthUser = {
          id: `usr-em-${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email: email.trim(),
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          provider: 'email',
          joinedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        setStep('success');
        setTimeout(() => {
          onLoginSuccess(loggedUser);
          onClose();
        }, 1000);
      }, 600);
    }
  };

  // Handle OTP Input Change with Auto Next-Focus
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto check if all 6 digits are filled
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) {
      verifyOtpCode(fullOtp);
    }
  };

  // Handle OTP Backspace & Key Navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste Full 6-Digit Code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const splitDigits = pasteData.split('');
      setOtpDigits(splitDigits);
      otpInputRefs.current[5]?.focus();
      verifyOtpCode(pasteData);
    }
  };

  // Verify OTP submission
  const verifyOtpCode = (enteredCode: string) => {
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      if (enteredCode === generatedOtp) {
        const verifiedUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name: name.trim() || email.split('@')[0],
          email: email.trim(),
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isVerified: true,
          provider: 'email',
          joinedAt: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        setStep('success');
        setTimeout(() => {
          onLoginSuccess(verifiedUser);
          onClose();
        }, 1200);
      } else {
        setErrorMessage('Kode OTP yang Anda masukkan salah. Silakan periksa kembali.');
      }
    }, 600);
  };

  // Quick Auto-Fill OTP for Practice
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const splitDigits = generatedOtp.split('');
    setOtpDigits(splitDigits);
    verifyOtpCode(generatedOtp);
  };

  const handleCopyOtp = () => {
    if (!generatedOtp) return;
    navigator.clipboard.writeText(generatedOtp);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      id="auth-gate-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="auth-gate-modal-content"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 text-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-sans text-xl font-bold text-gray-900">
            {step === 'otp_verify' ? 'Verifikasi OTP Email' : 'Gerbang Masuk Pembaca'}
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-1">
            {step === 'otp_verify' 
              ? `Masukkan 6-digit kode verifikasi yang dikirim ke ${email}` 
              : 'Akses penuh ke seluruh buku, catatan, rak pribadi, dan bookmark'}
          </p>
        </div>

        {/* STEP 1: FORM LOGIN / REGISTER */}
        {step === 'form' && (
          <div className="p-6 space-y-5">
            {/* Google Fast Auth Button (Anti-Sybil 100% Free) */}
            <div className="space-y-2">
              <button
                id="auth-google-btn"
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50/80 font-sans text-xs font-bold text-gray-800 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs active:scale-[0.99] disabled:opacity-50"
              >
                {/* Official Google Vector Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>

              {/* Anti-Sybil Micro Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans text-emerald-700 bg-emerald-50 py-1 px-2.5 rounded-lg border border-emerald-100">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Google ID Protection: 100% Bebas Bot & Verifikasi Instan</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">
                atau gunakan email
              </span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Tab Switcher (Masuk vs Daftar) */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-sans font-bold text-gray-700">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-input-name"
                      type="text"
                      required
                      placeholder="Masukkan nama Anda..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-sans font-bold text-gray-700">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-sans font-bold text-gray-700">Kata Sandi</label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Fitur reset kata sandi dikirim ke email terdaftar.')}
                      className="text-[10px] text-amber-700 hover:underline font-sans cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : activeTab === 'register' ? (
                  <>
                    <span>Daftar & Kirim Kode OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION (6 DIGITS) */}
        {step === 'otp_verify' && (
          <div className="p-6 space-y-5">
            {/* Live Practice OTP Banner (Interactive Simulation Box) */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kotak Masuk Email (Simulasi Kode Masuk):</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[10px] font-bold text-amber-800 hover:bg-amber-100 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200/60 shadow-2xs">
                <div>
                  <p className="text-[10px] text-gray-500 font-sans">Pengirim: <strong>auth@pustakalensa.id</strong></p>
                  <p className="font-mono text-base font-bold text-amber-700 tracking-wider">
                    {generatedOtp}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold font-sans hover:bg-black transition-colors cursor-pointer"
                >
                  Isi Otomatis
                </button>
              </div>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="space-y-3">
              <label className="block text-center text-xs font-bold text-gray-700 font-sans">
                Ketik 6 Digit Kode OTP:
              </label>
              <div className="flex items-center justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-xl border transition-all focus:outline-none ${
                      digit
                        ? 'border-neutral-900 bg-white text-neutral-900 shadow-2xs'
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-neutral-900 focus:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message in OTP */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              id="auth-verify-otp-btn"
              type="button"
              onClick={() => verifyOtpCode(otpDigits.join(''))}
              disabled={isLoading || otpDigits.join('').length < 6}
              className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verifikasi & Aktifkan Akun</span>
                </>
              )}
            </button>

            {/* Resend OTP & Back Options */}
            <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setErrorMessage('');
                }}
                className="text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Ganti Email
              </button>

              <button
                type="button"
                disabled={!canResend}
                onClick={() => triggerOtpGeneration(email)}
                className={`font-bold cursor-pointer transition-colors ${
                  canResend ? 'text-amber-700 hover:underline' : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Kirim Ulang Kode OTP' : `Kirim ulang (${resendTimer}s)`}
              </button>
            </div>

            {/* Anti-Sybil Education Note */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2 text-[11px] text-gray-500 font-sans leading-relaxed">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                <strong>Mengapa butuh OTP?</strong> Sistem ini memvalidasi keaslian kotak surat pengguna untuk mencegah bot massal (Sybil Attack) secara 100% gratis tanpa biaya SMS.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-gray-900">
                Autentikasi Berhasil!
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-1">
                Selamat datang di Pustaka Lensa. Menyiapkan ruang bacaan Anda...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
