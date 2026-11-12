import { RideOption, RideOperatorId } from '../types';
import { RIDE_OPERATORS } from './storage';

export interface RideFilterState {
  petFriendly: boolean;
  wheelchair: boolean;
  topDriversOnly: boolean;
  sixSeater: boolean;
  applyFirstTimeVoucher: boolean;
}

export function generateRideOptions(
  pickup: string,
  dropoff: string,
  distanceKm: number = 8.5,
  filters: RideFilterState
): RideOption[] {
  // Current hour surge determination (mocked around current Singapore day/evening)
  const hour = new Date().getHours();
  const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
  const baseSurge = isPeak ? 1.4 : 1.05;

  const options: RideOption[] = [
    // TADA
    {
      id: 'opt-tada-std',
      operatorId: 'tada',
      operatorName: 'TADA',
      tierName: filters.sixSeater ? 'TADA XL (6-Seater)' : 'TADA Eco/Sedan',
      price: Math.round((4.0 + distanceKm * 0.72 + (filters.sixSeater ? 8 : 0)) * (isPeak ? 1.15 : 1.0) * 10) / 10,
      originalPrice: isPeak ? Math.round((4.0 + distanceKm * 0.72 + (filters.sixSeater ? 8 : 0)) * 1.35 * 10) / 10 : undefined,
      etaMinutes: 4,
      tripDurationMinutes: Math.round(distanceKm * 1.8 + 4),
      distanceKm,
      driverRating: 4.86,
      surgeMultiplier: isPeak ? 1.15 : 1.0,
      surgeLabel: isPeak ? 'Mild' : 'Normal',
      isPetFriendly: true,
      isWheelchairAccessible: true,
      isSixSeater: filters.sixSeater,
      isGreenEco: true,
      cancellationFree: true,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      estimatedArrival: 'In 24 mins',
      availableDriversNearby: 6,
    },
    // GRAB
    {
      id: 'opt-grab-std',
      operatorId: 'grab',
      operatorName: 'Grab',
      tierName: filters.sixSeater ? 'GrabCar 6-Seater' : 'JustGrab (Nearest Car)',
      price: Math.round((4.2 + distanceKm * 0.82 + (filters.sixSeater ? 10 : 0)) * baseSurge * 10) / 10,
      etaMinutes: 2,
      tripDurationMinutes: Math.round(distanceKm * 1.7 + 3),
      distanceKm,
      driverRating: 4.82,
      surgeMultiplier: baseSurge,
      surgeLabel: isPeak ? 'High' : 'Normal',
      isPetFriendly: filters.petFriendly,
      isWheelchairAccessible: filters.wheelchair,
      isSixSeater: filters.sixSeater,
      isGreenEco: false,
      cancellationFree: true,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      estimatedArrival: 'In 21 mins',
      availableDriversNearby: 14,
    },
    // GOJEK
    {
      id: 'opt-gojek-std',
      operatorId: 'gojek',
      operatorName: 'Gojek',
      tierName: filters.sixSeater ? 'GoCar XL' : 'GoCar Standard',
      price: Math.round((3.8 + distanceKm * 0.76 + (filters.sixSeater ? 9 : 0)) * (isPeak ? 1.28 : 1.02) * 10) / 10,
      etaMinutes: 3,
      tripDurationMinutes: Math.round(distanceKm * 1.8 + 3),
      distanceKm,
      driverRating: 4.79,
      surgeMultiplier: isPeak ? 1.28 : 1.02,
      surgeLabel: isPeak ? 'High' : 'Normal',
      isPetFriendly: false,
      isWheelchairAccessible: true,
      isSixSeater: filters.sixSeater,
      isGreenEco: false,
      cancellationFree: true,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      estimatedArrival: 'In 22 mins',
      availableDriversNearby: 9,
    },
    // CDG ZIG
    {
      id: 'opt-zig-std',
      operatorId: 'zig',
      operatorName: 'CDG Zig',
      tierName: filters.sixSeater ? 'MaxiCab (7-Seater)' : 'Comfort Taxi & Private Hire',
      price: Math.round((4.4 + distanceKm * 0.74 + (filters.sixSeater ? 12 : 0)) * (isPeak ? 1.20 : 1.0) * 10) / 10,
      etaMinutes: 5,
      tripDurationMinutes: Math.round(distanceKm * 1.6 + 5),
      distanceKm,
      driverRating: 4.88,
      surgeMultiplier: isPeak ? 1.20 : 1.0,
      surgeLabel: isPeak ? 'Mild' : 'Normal',
      isPetFriendly: true,
      isWheelchairAccessible: true,
      isSixSeater: filters.sixSeater,
      isGreenEco: true,
      cancellationFree: true,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      estimatedArrival: 'In 23 mins',
      availableDriversNearby: 11,
    },
    // RYDE
    {
      id: 'opt-ryde-std',
      operatorId: 'ryde',
      operatorName: 'Ryde',
      tierName: filters.sixSeater ? 'RydeXL' : 'RydeX / Pet',
      price: Math.round((3.9 + distanceKm * 0.75 + (filters.sixSeater ? 8.5 : 0)) * (isPeak ? 1.22 : 1.0) * 10) / 10,
      etaMinutes: 6,
      tripDurationMinutes: Math.round(distanceKm * 1.8 + 6),
      distanceKm,
      driverRating: 4.85,
      surgeMultiplier: isPeak ? 1.22 : 1.0,
      surgeLabel: isPeak ? 'Mild' : 'Normal',
      isPetFriendly: true,
      isWheelchairAccessible: true,
      isSixSeater: filters.sixSeater,
      isGreenEco: true,
      cancellationFree: true,
      pickupAddress: pickup,
      dropoffAddress: dropoff,
      estimatedArrival: 'In 25 mins',
      availableDriversNearby: 5,
    },
  ];

  // Apply filters
  let filtered = options.filter(opt => {
    if (filters.petFriendly && !opt.isPetFriendly) return false;
    if (filters.wheelchair && !opt.isWheelchairAccessible) return false;
    if (filters.topDriversOnly && opt.driverRating < 4.8) return false;
    return true;
  });

  // Apply voucher if selected (10% off)
  if (filters.applyFirstTimeVoucher) {
    filtered = filtered.map(opt => ({
      ...opt,
      discountApplied: Math.round(opt.price * 0.10 * 100) / 100,
      originalPrice: opt.originalPrice || opt.price,
      price: Math.round(opt.price * 0.90 * 10) / 10,
    }));
  }

  // Sort by price ascending
  return filtered.sort((a, b) => a.price - b.price);
}
