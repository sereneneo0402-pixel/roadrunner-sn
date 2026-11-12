import React from 'react';
import { AccessibilitySettings } from '../types';
import { Translations } from '../i18n/translations';
import { Type, Eye, Volume2, Sparkles, Check, X } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  t: Translations;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-xl font-bold text-slate-900">
                {t.accessibilityTitle}
              </h2>
              <p className="text-xs text-slate-500">
                Tailor readability, visual contrast & speech for your comfort
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Text Size Control */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Type className="w-4 h-4 text-sky-600" />
              {t.textSize}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, textSize: 'normal' })}
                className={`py-3 px-4 rounded-xl text-center border-2 transition-all cursor-pointer ${
                  settings.textSize === 'normal'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-sm block font-medium">{t.textNormal}</span>
                <span className="text-xs text-slate-400">100%</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, textSize: 'large' })}
                className={`py-3 px-4 rounded-xl text-center border-2 transition-all cursor-pointer ${
                  settings.textSize === 'large'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-base block font-bold">{t.textLarge}</span>
                <span className="text-xs text-slate-400">120%</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, textSize: 'extra-large' })}
                className={`py-3 px-4 rounded-xl text-center border-2 transition-all cursor-pointer ${
                  settings.textSize === 'extra-large'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-lg block font-extrabold">{t.textExtraLarge}</span>
                <span className="text-xs text-slate-400">140%</span>
              </button>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800 text-sm">{t.highContrast}</div>
              <div className="text-xs text-slate-500">Increases borders, stark edges & text weight</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.highContrast}
              onClick={() => onUpdateSettings({ ...settings, highContrast: !settings.highContrast })}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${
                settings.highContrast ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Color Vision Palette */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Eye className="w-4 h-4 text-sky-600" />
              {t.colorMode}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'none', label: t.normalVision, desc: 'Full standard color spectrum' },
                { id: 'protanopia', label: t.redGreenProtan, desc: 'Avoids red-green overlap' },
                { id: 'deuteranopia', label: t.greenDeutan, desc: 'Enhanced green contrast' },
                { id: 'tritanopia', label: t.blueTritan, desc: 'Distinct blue-yellow markers' },
                { id: 'monochrome', label: t.monochrome, desc: 'Pure high-contrast black & white' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, colorblindMode: opt.id as any })}
                  className={`p-3 text-left rounded-xl border-2 transition-all cursor-pointer ${
                    settings.colorblindMode === opt.id
                      ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{opt.label}</span>
                    {settings.colorblindMode === opt.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Speech Narration Speed */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Volume2 className="w-4 h-4 text-sky-600" />
              {t.speechSpeed}
            </label>
            <div className="flex items-center gap-2">
              {[
                { speed: 0.8, label: '0.8x (Gentle)' },
                { speed: 1.0, label: '1.0x (Normal)' },
                { speed: 1.2, label: '1.2x (Brisk)' },
              ].map(s => (
                <button
                  key={s.speed}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, speechSpeed: s.speed })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
                    settings.speechSpeed === s.speed
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
