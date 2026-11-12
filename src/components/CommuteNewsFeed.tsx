import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { 
  Newspaper, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  WifiOff, 
  TrendingUp, 
  CloudRain, 
  Compass, 
  Layers,
  Check
} from 'lucide-react';

interface CommuteNewsFeedProps {
  t: Translations;
  isOnline: boolean;
}

export const CommuteNewsFeed: React.FC<CommuteNewsFeedProps> = ({ t, isOnline }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(() => StorageService.getNews());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bookmarkedToast, setBookmarkedToast] = useState<string | null>(null);

  const handleToggleBookmark = (articleId: string, title: string) => {
    const updated = StorageService.toggleSaveNewsArticle(articleId);
    setArticles(updated);
    setBookmarkedToast(`Updated offline status for: "${title.slice(0, 32)}..."`);
    setTimeout(() => setBookmarkedToast(null), 3000);
  };

  const categories = [
    { id: 'all', label: t.allNews, icon: Layers },
    { id: 'traffic', label: t.trafficWeather, icon: CloudRain },
    { id: 'economy', label: t.economy, icon: TrendingUp },
    { id: 'local', label: t.localNews, icon: Newspaper },
    { id: 'travel', label: t.lifestyle, icon: Compass },
  ];

  const filteredArticles = articles.filter(a => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-sky-600" />
            {t.newsTitle}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.newsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
          <span>All articles pre-cached for MRT subway reading</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Articles Feed */}
      <div className="space-y-4">
        {filteredArticles.map(article => (
          <article
            key={article.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {article.source}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {article.readTimeMinutes} {t.readTime}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400 font-medium">{article.timestamp}</span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Offline save toggle */}
            <div className="sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleToggleBookmark(article.id, article.title)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                  article.isSavedOffline
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
                aria-label={article.isSavedOffline ? t.savedOffline : t.saveForLater}
              >
                {article.isSavedOffline ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.savedOffline}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>{t.saveForLater}</span>
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Toast Notification */}
      {bookmarkedToast && (
        <div className="fixed bottom-6 left-6 z-50 p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{bookmarkedToast}</span>
        </div>
      )}
    </div>
  );
};
