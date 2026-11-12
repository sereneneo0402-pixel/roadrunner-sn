import React, { useState } from 'react';
import { RideOption, RoutePreset, UserProfile, AccessibilitySettings, LanguageCode } from '../types';
import { Translations } from '../i18n/translations';
import { ROUTE_PRESETS, RIDE_OPERATORS, StorageService } from '../services/storage';
import { generateRideOptions, RideFilterState } from '../services/rideEngine';
import { 
  Search, 
  MapPin, 
  Navigation, 
  ArrowUpDown, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Star, 
  Check, 
  AlertCircle,
  ExternalLink,
  Car,
  HeartHandshake
} from 'lucide-react';

interface RideFinderProps {
  profile: UserProfile;
  settings: AccessibilitySettings;
  language: LanguageCode;
  t: Translations;
  onBookingCreated: (option: RideOption) => void;
}

export const RideFinder: React.FC<RideFinderProps> = ({
  profile,
  settings,
  t,
  onBookingCreated,
}) => {
  const [pickup, setPickup] = useState<string>('One Raffles Place, Taxi Stand (CBD)');
  const [dropoff, setDropoff] = useState<string>('ION Orchard, Drop-off Bay');
  const [distanceKm, setDistanceKm] = useState<number>(4.8);
  const [activePresetId, setActivePresetId] = useState<string>('preset-2');

  const [filters, setFilters] = useState<RideFilterState>({
    petFriendly: false,
    wheelchair: false,
    topDriversOnly: false,
    sixSeater: false,
    applyFirstTimeVoucher: profile.hasFirstTimeVoucher,
  });

  const [bookedSuccessOption, setBookedSuccessOption] = useState<RideOption | null>(null);

  const rideOptions = generateRideOptions(pickup, dropoff, distanceKm, filters);

  const cheapestOption = rideOptions[0];
  const fastestOption = [...rideOptions].sort((a, b) => a.etaMinutes - b.etaMinutes)[0];

  const handleSelectPreset = (preset: RoutePreset) => {
    setActivePresetId(preset.id);
    setPickup(preset.pickup);
    setDropoff(preset.dropoff);
    setDistanceKm(preset.distanceKm);
  };

  const handleSwapAddresses = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  const handleBook = (option: RideOption) => {
    // Record into offline storage / sync queue
    StorageService.enqueueOfflineAction({
      id: `ride-${Date.now()}`,
      timestamp: Date.now(),
      actionType: 'book_ride',
      description: `Ride booked via ${option.operatorName} ($${option.price.toFixed(2)}) from ${pickup} to ${dropoff}`,
      payload: { option, pickup, dropoff },
      status: 'pending',
    });

    setBookedSuccessOption(option);
    onBookingCreated(option);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & First Time Voucher Banner (from BMC) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.compareRidesTitle}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.compareRidesSubtitle}
          </p>
        </div>

        {/* Voucher Callout Banner */}
        {profile.hasFirstTimeVoucher && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
                <Tag className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <span>{t.firstTimeVoucher}</span>
                  <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">RUNNER10</span>
                </div>
                <div className="text-[11px] text-amber-800">
                  {filters.applyFirstTimeVoucher ? '10% discount active on all options!' : 'Toggle on to apply 10% off'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFilters(f => ({ ...f, applyFirstTimeVoucher: !f.applyFirstTimeVoucher }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filters.applyFirstTimeVoucher
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-800 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              {filters.applyFirstTimeVoucher ? 'Applied' : t.applyVoucher}
            </button>
          </div>
        )}
      </div>

      {/* 2. Popular Routes Presets (One-click simplicity for non-technical users) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {t.presetDestinations}
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ROUTE_PRESETS.map(preset => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border-2 transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{preset.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {preset.distanceKm} km
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Address Input Search Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Pickup */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.whereFrom}</span>
            </label>
            <input
              type="text"
              value={pickup}
              onChange={e => {
                setPickup(e.target.value);
                setActivePresetId('');
              }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-600 bg-slate-50/50 text-slate-900 text-sm font-semibold"
              placeholder="e.g. Changi Airport T3, One Raffles Place"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="button"
              onClick={handleSwapAddresses}
              aria-label="Swap pickup and destination"
              className="w-10 h-10 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.whereTo}</span>
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={e => {
                setDropoff(e.target.value);
                setActivePresetId('');
              }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-600 bg-slate-50/50 text-slate-900 text-sm font-semibold"
              placeholder="e.g. Marina Bay Sands, Orchard Road"
            />
          </div>
        </div>

        {/* Filter Preferences Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500">
            {t.filterPreferences}:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                id: 'petFriendly',
                label: t.petFriendly,
                icon: '🐾',
                active: filters.petFriendly,
              },
              {
                id: 'wheelchair',
                label: t.wheelchairFriendly,
                icon: '♿',
                active: filters.wheelchair,
              },
              {
                id: 'topDriversOnly',
                label: t.topDriversOnly,
                icon: '⭐',
                active: filters.topDriversOnly,
              },
              {
                id: 'sixSeater',
                label: t.sixSeater,
                icon: '🚐',
                active: filters.sixSeater,
              },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, [f.id]: !prev[f.id as keyof RideFilterState] }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  f.active
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-2xs font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
                {f.active && <Check className="w-3 h-3 text-sky-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Best Deals Summary Highlight Bar */}
      {cheapestOption && fastestOption && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cheapest Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {t.cheapestOption}
              </span>
              <div className="text-xl font-black text-slate-900">
                {cheapestOption.operatorName} • SGD ${cheapestOption.price.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-700 font-medium">
                {cheapestOption.tierName} • {cheapestOption.etaMinutes} {t.minsAway}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleBook(cheapestOption)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {t.bookRideNow} {cheapestOption.operatorName}
            </button>
          </div>

          {/* Fastest Card */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-300 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                {t.fastestOption}
              </span>
              <div className="text-xl font-black text-slate-900">
                {fastestOption.operatorName} • {fastestOption.etaMinutes} {t.minsAway}
              </div>
              <div className="text-xs text-sky-700 font-medium">
                SGD ${fastestOption.price.toFixed(2)} • {fastestOption.availableDriversNearby} {t.nearbyDrivers}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleBook(fastestOption)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              {t.bookRideNow} {fastestOption.operatorName}
            </button>
          </div>
        </div>
      )}

      {/* 5. Complete Operator Comparison List (Grab, Gojek, Tada, Ryde, Zig) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>Available Platforms ({rideOptions.length})</span>
          <span>Sorted by Best Fare</span>
        </div>

        <div className="space-y-3">
          {rideOptions.map((option, index) => {
            const opMeta = RIDE_OPERATORS[option.operatorId];
            const isLowest = index === 0;

            return (
              <div
                key={option.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLowest ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                {/* Left: Operator Branding & Info */}
                <div className="flex items-start gap-4">
                  <div 
                    style={{ backgroundColor: opMeta?.color || '#0284c7' }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0"
                  >
                    {option.operatorName.slice(0, 3).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-black text-slate-900">
                        {option.operatorName}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        • {option.tierName}
                      </span>
                      {isLowest && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                          {t.cheapestOption}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {option.etaMinutes} {t.minsAway}
                      </span>
                      <span>•</span>
                      <span>~{option.tripDurationMinutes} {t.minsTrip}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-700 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {option.driverRating}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {option.availableDriversNearby} {t.nearbyDrivers}
                      </span>
                    </div>

                    {/* Surge indicator pill */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        option.surgeLabel === 'Severe' 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : option.surgeLabel === 'High' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {option.surgeMultiplier > 1 ? `${option.surgeMultiplier}x Surge` : 'Standard Fare'}
                      </span>

                      {option.cancellationFree && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Free Cancellation (4 mins)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Booking Action */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    {option.originalPrice && (
                      <div className="text-xs text-slate-400 line-through font-mono">
                        SGD ${option.originalPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      SGD ${option.price.toFixed(2)}
                    </div>
                    {option.discountApplied && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">
                        Voucher -$${option.discountApplied.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBook(option)}
                    className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>{t.bookRideNow} {option.operatorName}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Confirmation Toast / Modal */}
      {bookedSuccessOption && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Ride Booked on {bookedSuccessOption.operatorName}!
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Driver arriving in ~{bookedSuccessOption.etaMinutes} mins. Saved to offline queue.
                </p>
              </div>
            </div>
            <button
              onClick={() => setBookedSuccessOption(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
