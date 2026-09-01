import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Flame, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Award, 
  ChevronRight, 
  Sparkles,
  BarChart3,
  LineChart
} from 'lucide-react';
import { Book } from '../types';

interface InteractiveReadingStatsProps {
  books: Book[];
}

type TimeRange = '7d' | '30d' | '1y';
type MetricType = 'minutes' | 'pages' | 'chapters';

export const InteractiveReadingStats: React.FC<InteractiveReadingStatsProps> = ({ books }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [metric, setMetric] = useState<MetricType>('minutes');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  // Dynamic calculated stats from actual books
  const finishedCount = books.filter((b) => b.status === 'finished').length;
  const readingBooks = books.filter((b) => b.status === 'reading');
  const readingCount = readingBooks.length;

  // Mocked realistic reading activity datasets
  const data7Days = [
    { label: 'Sen', fullDate: '25 Ags', minutes: 35, pages: 28, chapters: 2, peak: '21.00 WIB' },
    { label: 'Sel', fullDate: '26 Ags', minutes: 45, pages: 36, chapters: 3, peak: '20.30 WIB' },
    { label: 'Rab', fullDate: '27 Ags', minutes: 20, pages: 18, chapters: 1, peak: '07.15 WIB' },
    { label: 'Kam', fullDate: '28 Ags', minutes: 60, pages: 52, chapters: 4, peak: '22.00 WIB' },
    { label: 'Jum', fullDate: '29 Ags', minutes: 50, pages: 42, chapters: 3, peak: '21.45 WIB' },
    { label: 'Sab', fullDate: '30 Ags', minutes: 85, pages: 74, chapters: 5, peak: '15.30 WIB' },
    { label: 'Min', fullDate: '31 Ags (Hari ini)', minutes: 65, pages: 58, chapters: 4, peak: '10.00 WIB' },
  ];

  const data30Days = [
    { label: 'Mgg 1', fullDate: '1 - 7 Ags', minutes: 240, pages: 195, chapters: 14, peak: 'Malam' },
    { label: 'Mgg 2', fullDate: '8 - 14 Ags', minutes: 310, pages: 260, chapters: 19, peak: 'Malam' },
    { label: 'Mgg 3', fullDate: '15 - 21 Ags', minutes: 280, pages: 230, chapters: 16, peak: 'Sore' },
    { label: 'Mgg 4', fullDate: '22 - 31 Ags', minutes: 360, pages: 308, chapters: 22, peak: 'Malam' },
  ];

  const data1Year = [
    { label: 'Jan', fullDate: 'Januari 2026', minutes: 920, pages: 780, chapters: 52, peak: '21:00' },
    { label: 'Feb', fullDate: 'Februari 2026', minutes: 840, pages: 710, chapters: 48, peak: '21:30' },
    { label: 'Mar', fullDate: 'Maret 2026', minutes: 1100, pages: 940, chapters: 65, peak: '22:00' },
    { label: 'Apr', fullDate: 'April 2026', minutes: 980, pages: 820, chapters: 56, peak: '20:45' },
    { label: 'Mei', fullDate: 'Mei 2026', minutes: 1250, pages: 1040, chapters: 72, peak: '21:15' },
    { label: 'Jun', fullDate: 'Juni 2026', minutes: 1020, pages: 890, chapters: 60, peak: '22:30' },
    { label: 'Jul', fullDate: 'Juli 2026', minutes: 1340, pages: 1150, chapters: 80, peak: '21:00' },
    { label: 'Ags', fullDate: 'Agustus 2026', minutes: 1190, pages: 1010, chapters: 71, peak: '21:30' },
  ];

  const currentDataset = timeRange === '7d' ? data7Days : timeRange === '30d' ? data30Days : data1Year;

  // Metric metadata
  const metricConfig = {
    minutes: {
      name: 'Waktu Baca',
      unit: 'Menit',
      color: '#10B981', // Emerald
      stroke: '#059669',
      gradientId: 'minutesGradient',
      totalFormatted: timeRange === '7d' ? '360 Menit (6 Jam)' : timeRange === '30d' ? '1.190 Menit (19,8 Jam)' : '8.640 Menit (144 Jam)',
      avgFormatted: timeRange === '7d' ? '51,4 Menit/hari' : timeRange === '30d' ? '297,5 Menit/minggu' : '1.080 Menit/bulan',
    },
    pages: {
      name: 'Halaman Dibaca',
      unit: 'Halaman',
      color: '#3B82F6', // Blue
      stroke: '#2563EB',
      gradientId: 'pagesGradient',
      totalFormatted: timeRange === '7d' ? '308 Halaman' : timeRange === '30d' ? '993 Halaman' : '7.340 Halaman',
      avgFormatted: timeRange === '7d' ? '44 Hal/hari' : timeRange === '30d' ? '248 Hal/minggu' : '917 Hal/bulan',
    },
    chapters: {
      name: 'Bab Dituntaskan',
      unit: 'Bab',
      color: '#F59E0B', // Amber
      stroke: '#D97706',
      gradientId: 'chaptersGradient',
      totalFormatted: timeRange === '7d' ? '22 Bab' : timeRange === '30d' ? '71 Bab' : '504 Bab',
      avgFormatted: timeRange === '7d' ? '3,1 Bab/hari' : timeRange === '30d' ? '17,7 Bab/minggu' : '63 Bab/bulan',
    },
  };

  const currentConfig = metricConfig[metric];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1 z-50">
          <div className="font-bold text-gray-200 border-b border-white/10 pb-1 flex items-center justify-between gap-4">
            <span>{data.fullDate}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Puncak: {data.peak}</span>
          </div>
          <div className="pt-1 space-y-0.5 font-sans">
            <div className="flex items-center justify-between gap-4 text-emerald-300 font-semibold">
              <span>⏱️ Waktu Baca:</span>
              <span>{data.minutes} Menit</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-blue-300 font-semibold">
              <span>📖 Halaman:</span>
              <span>{data.pages} Hal</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-amber-300 font-semibold">
              <span>🔖 Bab Tuntas:</span>
              <span>{data.chapters} Bab</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="dashboard-interactive-stats-section" 
      className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-sm space-y-6"
    >
      {/* Top Header Row with Title and Range Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="font-sans text-base sm:text-lg font-bold text-gray-900">
              Aktivitas & Diagram Baca Interaktif
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-sans">
            Pantau ritme membaca, rekor konsistensi, dan wawasan pertumbuhanmu
          </p>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full self-start sm:self-auto">
          {[
            { id: '7d' as TimeRange, label: '7 Hari' },
            { id: '30d' as TimeRange, label: '30 Hari' },
            { id: '1y' as TimeRange, label: '2026' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 text-xs font-sans rounded-full transition-all cursor-pointer ${
                timeRange === t.id
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Tabs & Chart Style Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'minutes' as MetricType, label: 'Waktu Baca', icon: Clock },
            { id: 'pages' as MetricType, label: 'Halaman', icon: BookOpen },
            { id: 'chapters' as MetricType, label: 'Bab Tuntas', icon: CheckCircle2 },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = metric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className={`px-3.5 py-1.5 text-xs font-sans rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-bold shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle between Smooth Area Chart and Bar Chart */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === 'area'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-400 hover:text-gray-700'
            }`}
            title="Diagram Kurva Halus"
          >
            <LineChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-400 hover:text-gray-700'
            }`}
            title="Diagram Batang"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dynamic Chart Stage */}
      <div className="w-full h-64 sm:h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={metric} 
                stroke={currentConfig.stroke} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#${currentConfig.gradientId})`} 
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: currentConfig.stroke }}
              />
            </AreaChart>
          ) : (
            <BarChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={metric} radius={[8, 8, 0, 0]}>
                {currentDataset.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === currentDataset.length - 1 ? currentConfig.stroke : currentConfig.color} 
                    opacity={index === currentDataset.length - 1 ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stat Highlight Row Below Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Metric 1: Total Period */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-sans font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Total {currentConfig.name}</span>
          </div>
          <div className="font-sans text-sm sm:text-base font-bold text-gray-900">
            {currentConfig.totalFormatted}
          </div>
        </div>

        {/* Metric 2: Average */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-sans font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Rata-Rata Ritme</span>
          </div>
          <div className="font-sans text-sm sm:text-base font-bold text-gray-900">
            {currentConfig.avgFormatted}
          </div>
        </div>

        {/* Metric 3: Active Streak */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-sans font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Streak Konsisten</span>
          </div>
          <div className="font-sans text-sm sm:text-base font-bold text-orange-600 flex items-center gap-1">
            <span>5 Hari Aktif</span>
            <span className="text-[10px] font-normal text-gray-400">🔥 +15%</span>
          </div>
        </div>

        {/* Metric 4: Finished Books */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-sans font-medium mb-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Target Buku 2026</span>
          </div>
          <div className="font-sans text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
            <span>{finishedCount}/12 Buku</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-semibold">
              On Track
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
