/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LanguageCode, 
  UserProfile, 
  AccessibilitySettings, 
  RideOption, 
  TouristGuideRoute 
} from './types';
import { translations, languages } from './i18n/translations';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { AccessibilityModal } from './components/AccessibilityModal';
import { RideFinder } from './components/RideFinder';
import { AccessibleDashboard } from './components/AccessibleDashboard';
import { TouristRouteGuide } from './components/TouristRouteGuide';
import { CommuteNewsFeed } from './components/CommuteNewsFeed';
import { CorporatePass } from './components/CorporatePass';
import { OfflineSyncCenter } from './components/OfflineSyncCenter';
import { 
  Sparkles, 
  Check, 
  Car, 
  Layers, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('rides');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [settings, setSettings] = useState<AccessibilitySettings>(() => StorageService.getSettings());
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => StorageService.getSimulatedOffline());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => StorageService.getSyncQueue().length);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBmcModal, setShowBmcModal] = useState<boolean>(false);

  // Sync online status with window events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update language when profile changes
  useEffect(() => {
    if (profile.preferredLanguage) {
      setLanguage(profile.preferredLanguage);
    }
  }, [profile]);

  const t = translations[language] || translations.en;

  const handleUpdateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleSwitchProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
    if (newProfile.preferredLanguage) {
      setLanguage(newProfile.preferredLanguage);
    }
    setToastMessage(`Switched active profile to: ${newProfile.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSimulatedOffline = () => {
    const next = !isSimulatedOffline;
    setIsSimulatedOffline(next);
    StorageService.setSimulatedOffline(next);
    setToastMessage(next ? 'Simulated Offline Safe Mode activated' : 'Connected to Cloud Synchronization');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefreshSyncQueue = () => {
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  const handleBookingCreated = (option: RideOption) => {
    handleRefreshSyncQueue();
  };

  const handleTouristRouteSelect = (route: TouristGuideRoute) => {
    setCurrentTab('rides');
    setToastMessage(`Pre-filled route: ${route.title}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Font size classes based on accessibility settings
  const getTextSizeClass = () => {
    switch (settings.textSize) {
      case 'extra-large':
        return 'text-lg'; // Senior XL
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${
      settings.highContrast ? 'high-contrast' : ''
    } ${getTextSizeClass()}`}>
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onSelectLanguage={setLanguage}
        profile={profile}
        onSwitchProfile={handleSwitchProfile}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={handleToggleSimulatedOffline}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        settings={settings}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'rides' && (
          <RideFinder
            profile={profile}
            settings={settings}
            language={language}
            t={t}
            onBookingCreated={handleBookingCreated}
          />
        )}

        {currentTab === 'dashboard' && (
          <AccessibleDashboard
            settings={settings}
            profile={profile}
            language={language}
            t={t}
            onNavigateToRides={() => setCurrentTab('rides')}
          />
        )}

        {currentTab === 'tourist' && (
          <TouristRouteGuide
            profile={profile}
            t={t}
            onSelectRouteForBooking={handleTouristRouteSelect}
          />
        )}

        {currentTab === 'news' && (
          <CommuteNewsFeed
            t={t}
            isOnline={isOnline && !isSimulatedOffline}
          />
        )}

        {currentTab === 'corporate' && (
          <CorporatePass
            profile={profile}
            t={t}
          />
        )}

        {currentTab === 'sync' && (
          <OfflineSyncCenter
            profile={profile}
            onSwitchProfile={handleSwitchProfile}
            isOnline={isOnline}
            isSimulatedOffline={isSimulatedOffline}
            onToggleSimulatedOffline={handleToggleSimulatedOffline}
            pendingSyncCount={pendingSyncCount}
            onSyncCompleted={handleRefreshSyncQueue}
            t={t}
          />
        )}
      </main>

      {/* Footer & Business Model Canvas Reference */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              RR
            </div>
            <div>
              <span className="font-bold text-slate-900">Road Runner Singapore</span>
              <p className="text-[11px] text-slate-400">
                Cross-operator ride aggregation • Grab • Gojek • Tada • Ryde • CDG Zig
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowBmcModal(true)}
              className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 cursor-pointer bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Business Model Canvas Alignment</span>
            </button>

            <span className="text-slate-400">|</span>
            <span>10 Languages Supported</span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Offline-Ready PWA Architecture
            </span>
          </div>
        </div>
      </footer>

      {/* Accessibility Settings Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        t={t}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Business Model Canvas Alignment Modal */}
      {showBmcModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-600" />
                  Road Runner Business Model Canvas Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  How the 9 Strategyzer canvas blocks are realized in this applet
                </p>
              </div>
              <button
                onClick={() => setShowBmcModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">1. Key Partners</span>
                <p className="text-slate-600">
                  Zig, Grab, Gojek, Tada, Ryde & Online news magazines (integrated in RideFinder & CommuteNews).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">2. Key Activities</span>
                <p className="text-slate-600">
                  APIs pulling live pricing, surge indices, nearest driver, and commuter news feeds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">3. Key Value Propositions</span>
                <p className="text-slate-600">
                  Cheapest & fastest ride, personalized ride options (pet-friendly, wheelchair, top-rated drivers), peak hour cost reduction, tourist insider tips.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">4. Customer Relationships</span>
                <p className="text-slate-600">
                  Daily commute companion, push notification prompts, and commute-length news tailored to trip time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">5. Customer Segments</span>
                <p className="text-slate-600">
                  Young working adults (time value), Tourists (Singapore route guides & eSIM), Corporates (employee benefit pass).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">6. Channels</span>
                <p className="text-slate-600">
                  Mobile application, airport & CBD digital anchors, corporate sales team pass.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">7. Cost Structure</span>
                <p className="text-slate-600">
                  Asset-light (no vehicle fleets owned), marketing awareness, first-time discount vouchers (code RUNNER10).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block">8. Revenue Streams</span>
                <p className="text-slate-600">
                  Small commission from chosen operator, advertising space on digital anchor, 3P eSIM affiliate signups ($12/user).
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowBmcModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Canvas Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
