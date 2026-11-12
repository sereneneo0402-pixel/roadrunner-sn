import React, { useState } from 'react';
import { TouristGuideRoute, UserProfile } from '../types';
import { Translations } from '../i18n/translations';
import { TOURIST_GUIDES, StorageService } from '../services/storage';
import { 
  Compass, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Wifi, 
  MapPin, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface TouristRouteGuideProps {
  profile: UserProfile;
  t: Translations;
  onSelectRouteForBooking: (route: TouristGuideRoute) => void;
}

export const TouristRouteGuide: React.FC<TouristRouteGuideProps> = ({
  profile,
  t,
  onSelectRouteForBooking,
}) => {
  const [esimClaimed, setEsimClaimed] = useState<boolean>(profile.eSimClaimed);
  const [esimModalOpen, setEsimModalOpen] = useState<boolean>(false);

  const handleClaimEsim = () => {
    setEsimClaimed(true);
    setEsimModalOpen(true);
    StorageService.enqueueOfflineAction({
      id: `esim-${Date.now()}`,
      timestamp: Date.now(),
      actionType: 'redeem_voucher',
      description: 'Redeemed Singapore 5G Tourist eSIM voucher (100GB for SGD $12.00)',
      payload: { code: 'SG-ESIM-5G-WELCOME', validDays: 14 },
      status: 'pending',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="w-7 h-7 text-sky-600" />
          {t.touristTitle}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {t.touristSubtitle}
        </p>
      </div>

      {/* 1. Partner Offer: Singapore 5G Tourist eSIM Banner (Directly from Business Model Canvas!) */}
      <section 
        aria-labelledby="esim-heading"
        className="bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-sky-700/40 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-400 text-slate-950 uppercase tracking-wide">
              <Wifi className="w-3.5 h-3.5" /> Changi Airport Arrival Partner Perk
            </span>
            <h2 id="esim-heading" className="text-xl sm:text-2xl font-black text-white">
              {t.esimPerkTitle}
            </h2>
            <p className="text-sm text-sky-100/90 leading-relaxed">
              {t.esimPerkDesc} Includes 100GB high-speed local data, 500 mins local calls, and 30 mins international calls.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-sky-300 line-through">SGD $15.00</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">SGD $12.00</div>
            </div>
            <button
              onClick={handleClaimEsim}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                esimClaimed 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-amber-400 text-amber-950 hover:bg-amber-300'
              }`}
            >
              {esimClaimed ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{esimClaimed ? 'eSIM Ready / View QR' : t.claimEsim}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Curated Tourist Routes Grid */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Curated Iconic Singapore Itineraries</span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            4 Routes
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOURIST_GUIDES.map(guide => (
            <div
              key={guide.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Title & Area */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-sky-700 uppercase tracking-wide">
                    <span>{guide.area}</span>
                    <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
                      Top Rated
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                {/* Best Visit Time & Local Insider Tip */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">{t.bestVisitTime}</span>
                      <span className="text-slate-600">{guide.recommendedTime}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 block">{t.insiderTips}</span>
                      <span className="text-amber-900">{guide.insiderTip}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-red-50/60 border border-red-200/70 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-red-950 block">{t.trafficWarning}</span>
                      <span className="text-red-900">{guide.peakHourWarning}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Key Highlights Along Route:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {guide.attractions.map(att => (
                      <span
                        key={att}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {att}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estimated Operator Fares comparison */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Estimated Ride Fares:</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-[10px] font-bold text-emerald-800">TADA</div>
                      <div className="font-mono font-extrabold text-slate-900">${guide.estimatedTadaPrice.toFixed(2)}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-600">Gojek</div>
                      <div className="font-mono font-extrabold text-slate-900">${guide.estimatedGojekPrice.toFixed(2)}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-600">Grab</div>
                      <div className="font-mono font-extrabold text-slate-900">${guide.estimatedGrabPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRouteForBooking(guide)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t.viewRouteOnMap}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* eSIM Modal */}
      {esimModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Singapore 5G eSIM Activated!
                </h3>
                <p className="text-xs text-slate-500">
                  Partnered with Singtel / StarHub local 5G
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-xs font-mono font-bold text-slate-700">QR Activation Code</div>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                {/* Simulated QR Pattern */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xs ${i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-transparent'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">LPA:1$singtel.esim$RR-SG-100GB-9842</p>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
              <li>100GB valid for 14 days island-wide in Singapore.</li>
              <li>Free incoming calls & 500 local minutes included.</li>
              <li>Saved offline in your Road Runner digital wallet.</li>
            </ul>

            <button
              onClick={() => setEsimModalOpen(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done & Keep in Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
