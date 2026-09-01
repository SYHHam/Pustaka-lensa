export interface EventBanner {
  id: string;
  type: 'book_launch' | 'webinar' | 'challenge' | 'promo';
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  description: string;
  dateOrDuration: string;
  speakerOrAuthor?: string;
  relatedBookId?: string;
  actionText: string;
  actionType: 'open_book' | 'open_modal' | 'external';
  bgGradient: string;
  accentColor: string;
  iconName: 'sparkles' | 'video' | 'flame' | 'gift' | 'book';
  badge?: string;
  stats?: string;
}

export const DUMMY_EVENTS: EventBanner[] = [
  {
    id: 'event-launch-1',
    type: 'book_launch',
    tag: 'Rilis Eksklusif',
    tagColor: 'bg-emerald-500 text-white',
    title: 'Peluncuran Buku: Beyond Good and Evil (Edisi Kritis 2026)',
    subtitle: 'Karya Masterpiece Friedrich Nietzsche dengan Anotasi Baru',
    description: 'Terjemahan kontemporer perdana dilengkapi pengantar kontekstual dari pakar filsafat. Nikmati bab eksklusif pembuka sekarang juga!',
    dateOrDuration: 'Tersedia Sekarang',
    speakerOrAuthor: 'Friedrich Nietzsche',
    relatedBookId: 'book-7',
    actionText: 'Baca Rilis Perdana',
    actionType: 'open_book',
    bgGradient: 'from-zinc-950 via-stone-900 to-neutral-900',
    accentColor: '#10B981',
    iconName: 'sparkles',
    badge: 'Koleksi Baru',
    stats: '🔥 1.420 pembaca perdana hari ini',
  },
  {
    id: 'event-webinar-1',
    type: 'webinar',
    tag: 'Bedah Buku Live',
    tagColor: 'bg-blue-600 text-white',
    title: 'Webinar: Mengurai Psikologi Uang di Era Ketidakpastian',
    subtitle: 'Sesi Diskusi Eksklusif bersama Praktisi Finansial & Komunitas',
    description: 'Bedah tuntas 5 pelajaran abadi kekayaan dari buku Morgan Housel. Dapatkan e-certificate dan lembar kerja ringkasan finansial interaktif.',
    dateOrDuration: 'Sabtu, 5 September 2026 • 19.30 WIB',
    speakerOrAuthor: 'dr. Andika Pratama & Tim Kurator Pustaka',
    relatedBookId: 'book-2',
    actionText: 'Daftar Kursi Gratis',
    actionType: 'open_modal',
    bgGradient: 'from-neutral-950 via-slate-900 to-blue-950',
    accentColor: '#3B82F6',
    iconName: 'video',
    badge: 'Tersisa 45 Kursi',
    stats: '🎙️ Live via Google Meet & Pustaka Stage',
  },
  {
    id: 'event-challenge-1',
    type: 'challenge',
    tag: 'Tantangan Komunitas',
    tagColor: 'bg-amber-500 text-black',
    title: 'Tantangan 30 Hari: Tuntaskan 4 Buku Pengembangan Diri',
    subtitle: 'Bangun Kebiasaan Membaca 15 Menit Setiap Hari & Raih Badge Emas',
    description: 'Gabung bersama 8.500+ pembaca lainnya. Selesaikan minimal 1 bab per hari dan dapatkan badge kurator eksklusif serta voucher buku fisik.',
    dateOrDuration: '1 - 30 September 2026',
    actionText: 'Ikuti Tantangan',
    actionType: 'open_modal',
    bgGradient: 'from-zinc-950 via-stone-900 to-amber-950',
    accentColor: '#F59E0B',
    iconName: 'flame',
    badge: 'Hadiah Rp 5 Juta',
    stats: '🏆 8.540 peserta telah bergabung',
  },
  {
    id: 'event-promo-1',
    type: 'promo',
    tag: 'Akses Kurasi Spesial',
    tagColor: 'bg-purple-600 text-white',
    title: 'Pekan Arsip Klasik: Akses Bebas Koleksi Filsafat & Sejarah',
    subtitle: 'Kurasi 10 Naskah Terpilih Marcus Aurelius, Sun Tzu, & Plato',
    description: 'Nikmati seluruh fitur Reader Mode, anotasi, dan rangkuman audio tanpa batas selama sepekan penuh untuk seluruh koleksi sejarah pemikiran.',
    dateOrDuration: 'Berakhir dalam 3 Hari',
    actionText: 'Jelajahi Koleksi',
    actionType: 'open_modal',
    bgGradient: 'from-neutral-950 via-zinc-900 to-purple-950',
    accentColor: '#A855F7',
    iconName: 'gift',
    badge: 'Akses Terbuka',
    stats: '✨ 100% Bebas Kuota Akses',
  },
];
