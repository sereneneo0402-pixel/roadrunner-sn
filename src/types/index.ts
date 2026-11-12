export type LanguageCode = 
  | 'en'     // English
  | 'zh-SG'  // 简体中文 (Singapore)
  | 'zh-TW'  // 繁體中文
  | 'ms'     // Bahasa Melayu (Official Singapore Language)
  | 'ta'     // தமிழ் (Official Singapore Language)
  | 'ja'     // 日本語
  | 'ko'     // 한국어
  | 'id'     // Bahasa Indonesia
  | 'es'     // Español
  | 'fr';    // Français

export type RideOperatorId = 'grab' | 'gojek' | 'tada' | 'ryde' | 'zig';

export interface RideOperator {
  id: RideOperatorId;
  name: string;
  tagline: string;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  pattern: 'stripes' | 'dots' | 'grid' | 'cross' | 'solid';
  logoBadge: string;
  appDeepLink: string;
}

export interface RideOption {
  id: string;
  operatorId: RideOperatorId;
  operatorName: string;
  tierName: string;
  price: number;
  originalPrice?: number;
  discountApplied?: number;
  etaMinutes: number;
  tripDurationMinutes: number;
  distanceKm: number;
  driverRating: number;
  surgeMultiplier: number;
  surgeLabel: 'Normal' | 'Mild' | 'High' | 'Severe';
  isPetFriendly: boolean;
  isWheelchairAccessible: boolean;
  isSixSeater: boolean;
  isGreenEco: boolean;
  cancellationFree: boolean;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedArrival: string;
  availableDriversNearby: number;
}

export interface RoutePreset {
  id: string;
  name: string;
  pickup: string;
  dropoff: string;
  category: 'commute' | 'tourist' | 'airport' | 'cbd';
  distanceKm: number;
  typicalMinutes: number;
  description: string;
  tag: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'local' | 'economy' | 'traffic' | 'lifestyle' | 'travel';
  source: string;
  readTimeMinutes: number;
  timestamp: string;
  isSavedOffline: boolean;
  imageUrl?: string;
  relevanceScore: number;
}

export interface TouristGuideRoute {
  id: string;
  title: string;
  area: string;
  description: string;
  recommendedTime: string;
  insiderTip: string;
  peakHourWarning: string;
  attractions: string[];
  estimatedGrabPrice: number;
  estimatedGojekPrice: number;
  estimatedTadaPrice: number;
  bestOperatorTip: string;
  esimDiscountAvailable: boolean;
}

export interface CorporateExpense {
  id: string;
  tripDate: string;
  operator: string;
  pickup: string;
  dropoff: string;
  amount: number;
  purpose: 'Client Meeting' | 'Late Night Commute' | 'Airport Transfer' | 'Team Transport';
  status: 'Approved' | 'Pending Review' | 'Flagged';
  receiptId: string;
  policyCompliant: boolean;
}

export interface QueuedOfflineAction {
  id: string;
  timestamp: number;
  actionType: 'book_ride' | 'save_article' | 'add_expense' | 'update_preferences' | 'redeem_voucher';
  description: string;
  payload: any;
  status: 'pending' | 'syncing' | 'completed';
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  simplifiedLanguage: boolean;
  screenReaderOptimized: boolean;
  speechSpeed: number; // 0.8, 1.0, 1.2
  audioNarrationEnabled: boolean;
  reducedMotion: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'commuter' | 'tourist' | 'corporate';
  preferredLanguage: LanguageCode;
  monthlySavings: number;
  tripsCount: number;
  corporateAllowance?: {
    total: number;
    used: number;
    currency: string;
  };
  hasFirstTimeVoucher: boolean;
  eSimClaimed: boolean;
}

export interface HourlySurgeData {
  hour: string;
  displayHour: string;
  averageFare: number;
  surgeIndex: number; // 1.0 to 2.2
  grabPrice: number;
  gojekPrice: number;
  tadaPrice: number;
  rydePrice: number;
  zigPrice: number;
  isPeak: boolean;
  recommendation: string;
}
