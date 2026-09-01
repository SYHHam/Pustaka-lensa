export type BookStatus = 'not_started' | 'reading' | 'finished';

export interface CommentItem {
  id: string;
  authorName: string;
  avatarUrl: string;
  rating: number;
  content: string;
  timeAgo: string;
}

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverColor: string;
  accentColor?: string;
  synopsisShort: string;
  synopsisFull: string;
  pageCount: number;
  estimatedReadTime: string;
  rating: number;
  ratingCount: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  status: BookStatus;
  progress: number; // 0 to 100
  currentChapterIndex: number;
  currentPageIndex: number;
  maxProgressReached?: number;
  manualBookmark?: {
    chapterIndex: number;
    pageIndex: number;
    timestamp: string;
  } | null;
  isSaved: boolean;
  isNew: boolean;
  comments: CommentItem[];
  chapters: ChapterItem[];
}

export type ReaderFontFamily = 
  | 'source-serif' 
  | 'literata' 
  | 'lora' 
  | 'garamond' 
  | 'merriweather' 
  | 'jakarta' 
  | 'sans';

export type ReaderLineSpacing = 'tight' | 'normal' | 'loose';
export type ReaderTheme = 'light' | 'dark';

export interface ReaderSettings {
  fontSize: number; // continuous 13px - 26px
  fontFamily: ReaderFontFamily;
  lineSpacing: ReaderLineSpacing;
  theme: ReaderTheme;
}

export type NavigationTab = 
  | 'beranda'
  | 'top-charts'
  | 'rak-bukuku'
  | 'jelajahi'
  | 'kategori'
  | 'riwayat'
  | 'pengaturan';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
  provider: 'google' | 'email';
  joinedAt: string;
}
