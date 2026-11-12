import React, { useState } from 'react';
import { LanguageCode, UserProfile, AccessibilitySettings } from '../types';
import { languages, Translations } from '../i18n/translations';
import { 
  Car, 
  BarChart3, 
  Compass, 
  Newspaper, 
  Briefcase, 
  Cloud, 
  CloudOff, 
  Globe, 
  SlidersHorizontal, 
  User, 
  Volume2, 
  VolumeX,
  Zap
} from 'lucide-react';
import { SpeechService } from '../services/speech';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  profile: UserProfile;
  onSwitchProfile: (profile: UserProfile) => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  settings: AccessibilitySettings;
  onOpenAccessibility: () => void;
  t: Translations;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  profile,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  isOnline,
  pendingSyncCount,
  onOpenAccessibility,
  t,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const effectiveOnline = isOnline && !isSimulatedOffline;

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  const handleAudioSummary = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      const summaryText = `${t.appName}. ${t.tagline}. Current tab: ${currentTab}. You are currently ${effectiveOnline ? 'connected to the cloud' : 'operating in offline safe mode'}.`;
      setIsSpeaking(true);
      SpeechService.speak(summaryText, language, 1.0, () => {
        setIsSpeaking(false);
      });
    }
  };

  const navItems = [
    { id: 'rides', label: t.navRides, icon: Car },
    { id: 'dashboard', label: t.navDashboard, icon: BarChart3 },
    { id: 'tourist', label: t.navTourist, icon: Compass },
    { id: 'news', label: t.navNews, icon: Newspaper },
    { id: 'corporate', label: t.navCorporate, icon: Briefcase },
    { id: 'sync', label: t.navSync, icon: Cloud, badge: pendingSyncCount > 0 ? pendingSyncCount : null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <Zap className="w-3.5 h-3.5" /> Singapore Multi-App Ride Aggregator
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Grab • Gojek • TADA • Ryde • CDG Zig
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Audio Narration button */}
            <button
              onClick={handleAudioSummary}
              aria-label={isSpeaking ? t.audioNarrationStop : t.audioNarrationPlay}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                isSpeaking 
                  ? 'bg-amber-400 text-amber-950 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-sky-400" />}
              <span>{isSpeaking ? t.audioNarrationStop : t.audioNarrationPlay}</span>
            </button>

            {/* Offline Simulation Toggle */}
            <button
              onClick={onToggleSimulatedOffline}
              aria-label={isSimulatedOffline ? t.offlineMode : t.onlineMode}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                !effectiveOnline 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
              title="Click to toggle simulated offline mode"
            >
              {!effectiveOnline ? (
                <>
                  <CloudOff className="w-3 h-3 text-amber-400" />
                  <span>{t.offlineMode}</span>
                  {pendingSyncCount > 0 && (
                    <span className="bg-amber-400 text-amber-950 px-1 rounded-full text-[10px] font-bold">
                      {pendingSyncCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>{t.onlineMode}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('rides')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl font-black tracking-tighter">RR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                Road Runner
              </span>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-red-200">
                SG 🇸🇬
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Controls: Language, Accessibility, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <span className="sm:hidden">{currentLangObj.flag}</span>
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language (10 available)
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors cursor-pointer ${
                      language === lang.code ? 'bg-sky-50/80 font-bold text-sky-700' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Settings Button */}
          <button
            onClick={onOpenAccessibility}
            aria-label={t.accessibilityTitle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Adjust text size, contrast, or colorblind mode"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">{t.navSettings}</span>
          </button>

          {/* Active Profile Pill */}
          <button
            onClick={() => onSelectTab('sync')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            title={`Active: ${profile.name} (${profile.role})`}
          >
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-[11px]">
              {profile.name.charAt(0)}
            </div>
            <span className="hidden lg:inline font-semibold text-slate-900 max-w-[110px] truncate">
              {profile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav 
        aria-label="Primary Navigation"
        className="max-w-7xl mx-auto px-2 sm:px-6 overflow-x-auto scrollbar-none flex gap-1 border-t border-slate-100 py-1"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
