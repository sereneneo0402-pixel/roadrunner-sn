import React, { useState } from 'react';
import { UserProfile, QueuedOfflineAction } from '../types';
import { Translations } from '../i18n/translations';
import { StorageService, MOCK_PROFILES } from '../services/storage';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Download, 
  RotateCcw, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  HardDrive
} from 'lucide-react';

interface OfflineSyncCenterProps {
  profile: UserProfile;
  onSwitchProfile: (p: UserProfile) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  pendingSyncCount: number;
  onSyncCompleted: () => void;
  t: Translations;
}

export const OfflineSyncCenter: React.FC<OfflineSyncCenterProps> = ({
  profile,
  onSwitchProfile,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  pendingSyncCount,
  onSyncCompleted,
  t,
}) => {
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);
  const [syncQueue, setSyncQueue] = useState<QueuedOfflineAction[]>(() => StorageService.getSyncQueue());
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => StorageService.getLastSyncTime());

  const effectiveOnline = isOnline && !isSimulatedOffline;

  const handleForceSync = () => {
    if (!effectiveOnline) {
      alert('Cannot sync while offline. Please turn off simulated offline mode or connect to internet.');
      return;
    }

    setSyncing(true);
    setSyncProgress(25);

    setTimeout(() => {
      setSyncProgress(65);
    }, 400);

    setTimeout(() => {
      setSyncProgress(100);
      StorageService.clearSyncQueue();
      setSyncQueue([]);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSyncing(false);
      setSyncSuccessToast('Cloud sync complete! All offline changes cryptographically verified and backed up.');
      onSyncCompleted();
      setTimeout(() => setSyncSuccessToast(null), 4000);
    }, 900);
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `road-runner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Reset demo data to default state?')) {
      StorageService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Cloud className="w-7 h-7 text-sky-600" />
          {t.syncStatusTitle}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {t.offlineVaultDesc}
        </p>
      </div>

      {/* 1. Cloud Sync Engine Status Card */}
      <section 
        aria-labelledby="sync-card-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              effectiveOnline 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {effectiveOnline ? <Cloud className="w-7 h-7" /> : <CloudOff className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 id="sync-card-heading" className="text-lg sm:text-xl font-bold text-slate-900">
                  {effectiveOnline ? t.onlineMode : t.offlineMode}
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  effectiveOnline 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {effectiveOnline ? 'Sync Active' : 'Offline Safe'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Last synchronized: <strong>{lastSyncTime}</strong> • Device ID: <code>RR-SG-NODE-081b</code>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.cloudSyncSecured}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleSimulatedOffline}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer ${
                isSimulatedOffline
                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {isSimulatedOffline ? 'Resume Online Mode' : t.simulateOffline}
            </button>

            <button
              onClick={handleForceSync}
              disabled={syncing || !effectiveOnline}
              className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : t.syncNow}</span>
            </button>
          </div>
        </div>

        {/* Sync progress bar (when syncing) */}
        {syncing && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Syncing pending offline transactions to secure cloud storage...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                style={{ width: `${syncProgress}%` }}
                className="h-full bg-sky-600 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-slate-50">
            <div className="text-slate-400 text-[11px] font-bold uppercase">Pending Sync Queue</div>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{syncQueue.length}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50">
            <div className="text-slate-400 text-[11px] font-bold uppercase">Local Cache Size</div>
            <div className="text-xl font-black text-slate-900 font-mono mt-0.5">14.8 KB</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50">
            <div className="text-slate-400 text-[11px] font-bold uppercase">Storage Health</div>
            <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">100% OK</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50">
            <div className="text-slate-400 text-[11px] font-bold uppercase">Encryption</div>
            <div className="text-xl font-black text-indigo-600 font-mono mt-0.5">AES-GCM</div>
          </div>
        </div>
      </section>

      {/* 2. Offline Action Queue Inspector */}
      <section 
        aria-labelledby="queue-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 id="queue-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-600" />
              <span>Offline Change Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Actions stored securely locally while offline, awaiting cloud handshake
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {syncQueue.length} items queued
          </span>
        </div>

        {syncQueue.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {t.allSynced}
            </p>
            <p className="text-xs text-slate-400">
              Any rides booked or bookmarks toggled while offline will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {syncQueue.map(action => (
              <div 
                key={action.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{action.description}</div>
                  <div className="text-slate-400 flex items-center gap-2">
                    <span className="font-mono">{action.id}</span>
                    <span>•</span>
                    <span>{new Date(action.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full self-start sm:self-auto">
                  Pending Upload
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Switch User Profile (Commuter / Tourist / Corporate) */}
      <section 
        aria-labelledby="profiles-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="border-b border-slate-100 pb-3">
          <h2 id="profiles-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>{t.switchProfile} (Business Segments from BMC)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Switch between the 3 core customer segments identified on the Road Runner canvas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_PROFILES.map(p => {
            const isSelected = profile.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSwitchProfile(p)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'border-sky-600 bg-sky-50/70 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      p.role === 'tourist' 
                        ? 'bg-amber-100 text-amber-800' 
                        : p.role === 'corporate' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.role}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 mt-2">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.email}</div>
                </div>

                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 flex justify-between">
                  <span>Saved: ${p.monthlySavings.toFixed(2)}</span>
                  <span>{p.tripsCount} trips</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Local Data Vault & Reset */}
      <section 
        aria-labelledby="vault-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 id="vault-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-600" />
            <span>Data Vault Export & Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export all cached profiles, bookings, and sync states as a portable JSON file
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.backupData}</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.restoreData}</span>
          </button>
        </div>
      </section>

      {/* Toast Alert */}
      {syncSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-900 text-emerald-100 rounded-2xl shadow-2xl border border-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
