import React, { useState } from 'react';
import { AccessibilitySettings, HourlySurgeData, LanguageCode, UserProfile } from '../types';
import { Translations } from '../i18n/translations';
import { HOURLY_SURGE_DATA, RIDE_OPERATORS } from '../services/storage';
import { SpeechService } from '../services/speech';
import { 
  Volume2, 
  VolumeX, 
  Table, 
  BarChart2, 
  Sparkles, 
  Clock, 
  PiggyBank, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AccessibleDashboardProps {
  settings: AccessibilitySettings;
  profile: UserProfile;
  language: LanguageCode;
  t: Translations;
  onNavigateToRides: () => void;
}

export const AccessibleDashboard: React.FC<AccessibleDashboardProps> = ({
  settings,
  profile,
  language,
  t,
  onNavigateToRides,
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedHour, setSelectedHour] = useState<string>('08:00');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simulatedMonthlyRides, setSimulatedMonthlyRides] = useState<number>(20);

  const activeHourData = HOURLY_SURGE_DATA.find(d => d.hour === selectedHour) || HOURLY_SURGE_DATA[5];

  // Plain-English narrative text for non-technical users
  const narrativeSummary = `
    Right now in Singapore, TADA is the most affordable ride at $${activeHourData.tadaPrice.toFixed(2)}, saving you $${(activeHourData.grabPrice - activeHourData.tadaPrice).toFixed(2)} compared to Grab.
    At ${activeHourData.displayHour}, demand is ${activeHourData.isPeak ? 'at peak surge levels (multiplier ' + activeHourData.surgeIndex + 'x)' : 'at standard flat rates'}.
    Recommendation: ${activeHourData.recommendation}. 
    Our data shows off-peak fares drop by approximately 38% between 2:00 PM and 4:00 PM.
  `.trim();

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speak(narrativeSummary, language, settings.speechSpeed, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Color mapping based on colorblind settings
  const getOperatorColor = (opId: string) => {
    if (settings.colorblindMode === 'monochrome') {
      const shades: Record<string, string> = {
        grab: '#1e293b',
        gojek: '#475569',
        tada: '#0f172a',
        ryde: '#334155',
        zig: '#64748b',
      };
      return shades[opId] || '#334155';
    }
    if (settings.colorblindMode === 'protanopia' || settings.colorblindMode === 'deuteranopia') {
      const accessibleShades: Record<string, string> = {
        grab: '#0284c7', // Sky Blue
        gojek: '#0d9488', // Teal
        tada: '#d97706', // Amber
        ryde: '#7c3aed', // Purple
        zig: '#2563eb', // Royal Blue
      };
      return accessibleShades[opId] || '#0284c7';
    }
    const defaultColors: Record<string, string> = {
      grab: '#00B14F',
      gojek: '#00AA13',
      tada: '#F59E0B',
      ryde: '#EF4444',
      zig: '#0284C7',
    };
    return defaultColors[opId] || '#0284c7';
  };

  // Operator comparisons for active hour
  const operatorFares = [
    { id: 'tada', name: 'TADA', price: activeHourData.tadaPrice, pattern: 'pattern-stripes' },
    { id: 'ryde', name: 'Ryde', price: activeHourData.rydePrice, pattern: 'pattern-dots' },
    { id: 'gojek', name: 'Gojek', price: activeHourData.gojekPrice, pattern: '' },
    { id: 'zig', name: 'CDG Zig', price: activeHourData.zigPrice, pattern: 'pattern-stripes' },
    { id: 'grab', name: 'Grab', price: activeHourData.grabPrice, pattern: '' },
  ].sort((a, b) => a.price - b.price);

  const maxPrice = Math.max(...operatorFares.map(f => f.price));
  const minPrice = Math.min(...operatorFares.map(f => f.price));

  const monthlyProjectedSavings = Math.round(simulatedMonthlyRides * 4.60);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.dashboardTitle}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.dashboardSubtitle}
          </p>
        </div>

        {/* View mode toggle: Visual Chart vs Accessible Table */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'chart'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.chartView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.tableView}</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Plain-Language Narrative Card with Text-to-Speech */}
      <section 
        aria-labelledby="narrative-heading"
        className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 id="narrative-heading" className="text-base sm:text-lg font-bold text-sky-100">
                {t.narrativeSummaryTitle}
              </h2>
            </div>

            {/* Read Aloud Button */}
            <button
              onClick={handleToggleSpeech}
              aria-label={isSpeaking ? t.audioNarrationStop : t.audioNarrationPlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                isSpeaking 
                  ? 'bg-amber-400 text-amber-950 animate-bounce' 
                  : 'bg-white text-slate-900 hover:bg-sky-50'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-900" />
                  <span>{t.audioNarrationStop}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>{t.audioNarrationPlay}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium bg-white/5 p-4 rounded-2xl border border-white/10">
            {narrativeSummary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-sky-200 pt-2">
            <div className="flex items-center gap-1.5 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lowest Fare: <strong>TADA ($15.00 - $22.00)</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Peak Alert: 8:00 AM & 6:30 PM surge up to 1.8x</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Operator Fare Comparison Section */}
      <section 
        aria-labelledby="comparison-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 id="comparison-heading" className="text-lg sm:text-xl font-bold text-slate-900">
              {t.operatorFareComparison}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Comparing standard 10 km route across Singapore at {activeHourData.displayHour}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Lowest Price: ${minPrice.toFixed(2)}</span>
            <span className="mx-1 text-slate-300">|</span>
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span>Highest: ${maxPrice.toFixed(2)}</span>
          </div>
        </div>

        {viewMode === 'chart' ? (
          /* Visual Accessible Horizontal Bar Chart with Dual Encoding (Color + Pattern + Numeric Labels) */
          <div className="space-y-4 pt-2">
            {operatorFares.map((op, idx) => {
              const opMeta = RIDE_OPERATORS[op.id as keyof typeof RIDE_OPERATORS];
              const percentage = Math.round((op.price / maxPrice) * 100);
              const isCheapest = op.price === minPrice;
              const savingsFromMax = maxPrice - op.price;

              return (
                <div key={op.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200">
                        #{idx + 1}
                      </span>
                      <span className="font-extrabold">{op.name}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({opMeta ? opMeta.tagline.split('&')[0] : ''})
                      </span>
                      {isCheapest && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                          {t.cheapestOption}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {savingsFromMax > 0 && (
                        <span className="text-emerald-600 text-xs font-semibold">
                          Save ${savingsFromMax.toFixed(2)}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                        SGD ${op.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar with Pattern Fill & Shape Indicator */}
                  <div 
                    className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden p-1 flex items-center relative"
                    role="progressbar"
                    aria-valuenow={op.price}
                    aria-valuemin={0}
                    aria-valuemax={maxPrice}
                    aria-label={`${op.name}: $${op.price.toFixed(2)}`}
                  >
                    <div
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getOperatorColor(op.id)
                      }}
                      className={`h-full rounded-lg transition-all duration-500 relative flex items-center justify-between px-3 text-white font-bold text-xs ${op.pattern}`}
                    >
                      <span className="truncate drop-shadow-sm font-semibold">{percentage}% of max</span>
                      <span className="text-[11px] font-mono drop-shadow-sm">${op.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Accessible HTML Data Table with Full ARIA markup */
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <caption className="sr-only">
                Live Ride Operator Fare Comparison Table for Singapore
              </caption>
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="p-3.5">Rank</th>
                  <th scope="col" className="p-3.5">Ride Operator</th>
                  <th scope="col" className="p-3.5">Estimated Fare</th>
                  <th scope="col" className="p-3.5">Price vs Highest</th>
                  <th scope="col" className="p-3.5">Driver Commission Model</th>
                  <th scope="col" className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operatorFares.map((op, idx) => {
                  const savings = maxPrice - op.price;
                  return (
                    <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500">#{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{op.name}</td>
                      <td className="p-3.5 font-mono font-extrabold text-slate-900">
                        SGD ${op.price.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        {savings > 0 ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            -${savings.toFixed(2)} (-{Math.round((savings / maxPrice) * 100)}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Baseline (Highest)</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {op.id === 'tada' ? '0% Driver Commission (Flat Fee)' : op.id === 'zig' ? 'Metered / CDG Tariff' : '15-20% Commission'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={onNavigateToRides}
                          className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. 24-Hour Surge & Wait-Time Forecast Timeline */}
      <section 
        aria-labelledby="forecast-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 id="forecast-heading" className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              {t.surgeTimelineTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select any time of day to inspect pricing surge and driver availability forecast
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Low Surge (1.0x - 1.1x)
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Moderate (1.2x - 1.4x)
            </span>
            <span className="flex items-center gap-1 font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Peak Surge (1.5x - 1.8x)
            </span>
          </div>
        </div>

        {/* Hour selector pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {HOURLY_SURGE_DATA.map(item => {
            const isSelected = item.hour === selectedHour;
            const badgeBg = item.surgeIndex >= 1.5 
              ? 'border-red-300 bg-red-50/50 text-red-900' 
              : item.surgeIndex >= 1.2 
              ? 'border-amber-300 bg-amber-50/50 text-amber-900' 
              : 'border-emerald-300 bg-emerald-50/50 text-emerald-900';

            return (
              <button
                key={item.hour}
                type="button"
                onClick={() => setSelectedHour(item.hour)}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  isSelected 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-105' 
                    : `${badgeBg} hover:border-slate-400`
                }`}
              >
                <span className="text-xs font-extrabold">{item.displayHour}</span>
                <span className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-700'}`}>
                  ${item.tadaPrice.toFixed(1)}
                </span>
                <span className={`text-[10px] font-bold mt-0.5 px-1 rounded ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : item.isPeak ? 'bg-red-200/80 text-red-900' : 'bg-emerald-200/80 text-emerald-900'
                }`}>
                  {item.surgeIndex}x
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Hour Details Box */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                Detailed Forecast for {activeHourData.displayHour}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeHourData.isPeak ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeHourData.isPeak ? 'Peak Traffic & Surcharges' : 'Smooth Travel (Off-Peak)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {activeHourData.recommendation}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Estimated Avg Fare</div>
              <div className="text-lg font-black text-slate-900 font-mono">SGD ${activeHourData.averageFare.toFixed(2)}</div>
            </div>
            <button
              onClick={onNavigateToRides}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Search Rides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Non-Technical Fare Factor Breakdown & Cumulative Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why Does the Price Change? (Accessible Breakdown) */}
        <section 
          aria-labelledby="factors-heading"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 id="factors-heading" className="text-lg font-bold text-slate-900">
              {t.fareBreakdown}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            A transparent look into what creates your ride fare in Singapore
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                title: 'Base Flag-Down Fare (~$3.80 - $4.40)',
                desc: 'Standard pickup starting fee set by LTA regulations.',
                pct: '25%',
                color: 'bg-sky-500',
              },
              {
                title: 'Distance Traveled (~$0.70 - $0.85 / km)',
                desc: 'Covers fuel, vehicle depreciation, and road mileage.',
                pct: '45%',
                color: 'bg-indigo-500',
              },
              {
                title: 'Dynamic Surge & Weather Demand',
                desc: 'Multiplies fare up to 1.8x during heavy rainfall or CBD evening rush.',
                pct: '20%',
                color: 'bg-amber-500',
              },
              {
                title: 'Operator Commission (0% to 20%)',
                desc: 'TADA charges 0% driver commission, which is why their fares stay lower.',
                pct: '10%',
                color: 'bg-emerald-500',
              },
            ].map(item => (
              <div key={item.title} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span>{item.title}</span>
                  </div>
                  <span className="font-mono text-slate-500">{item.pct}</span>
                </div>
                <p className="text-xs text-slate-500 pl-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cumulative Savings & Value Calculator */}
        <section 
          aria-labelledby="savings-heading"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
              <h2 id="savings-heading" className="text-lg font-bold text-slate-900">
                {t.monthlySavingsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Based on always selecting the lowest operator via Road Runner
            </p>

            <div className="mt-4 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Your Savings This Month
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-900 font-mono mt-1">
                  SGD ${profile.monthlySavings.toFixed(2)}
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-1">
                  Across {profile.tripsCount} compared trips
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <TrendingDown className="w-7 h-7" />
              </div>
            </div>

            {/* Interactive Calculator Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <label htmlFor="ride-slider">Calculate Your Monthly Savings:</label>
                <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-mono">
                  {simulatedMonthlyRides} rides / month
                </span>
              </div>
              <input
                id="ride-slider"
                type="range"
                min="5"
                max="60"
                step="5"
                value={simulatedMonthlyRides}
                onChange={e => setSimulatedMonthlyRides(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
                aria-label="Number of monthly rides"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>5 rides (occasional)</span>
                <span>20 rides (commuter)</span>
                <span>60 rides (daily pro)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div className="text-xs">
              <div className="text-slate-400">Projected Annual Savings</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ~SGD ${(monthlyProjectedSavings * 12).toLocaleString()} / year
              </div>
            </div>
            <button
              onClick={onNavigateToRides}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Start Saving
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
