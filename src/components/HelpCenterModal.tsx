import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Mail, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFAQ?: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenFAQ,
}) => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketSubject && ticketMessage) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setTicketSubject('');
        setTicketMessage('');
        setTicketEmail('');
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-gray-900">
                Pusat Bantuan & Kontak
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Tim kurator Pustaka Lensa siap membantumu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick FAQ Link Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-sans text-xs font-bold text-amber-900 block">
                Pertanyaan yang sering ditanyakan?
              </span>
              <p className="text-[11px] text-amber-700 font-sans">
                Temukan jawaban cepat seputar cara membaca, font, dan buku gratis.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenFAQ?.();
              }}
              className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-xs font-sans font-bold hover:bg-amber-500 shrink-0 transition-colors cursor-pointer"
            >
              Buka FAQ
            </button>
          </div>

          {isSent ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-sans text-sm font-bold text-emerald-900">
                Pesan Kamu Berhasil Dikirim!
              </h4>
              <p className="text-xs text-emerald-700 font-sans">
                Terima kasih atas masukannya. Tim kurasi kami akan merespons melalui email secepat mungkin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 font-sans">
                  Email Kamu
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  className="w-full h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 font-sans">
                  Topik Pertanyaan / Usulan Buku
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Usulan karya filsafat baru / Kendala ukuran huruf"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 font-sans">
                  Isi Pesan
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan kebutuhan, saran, atau kendalamu di sini..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-sans text-gray-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-neutral-900 text-white text-xs font-sans font-bold flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-sm"
              >
                <span>Kirim Pesan ke Tim Bantuan</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
