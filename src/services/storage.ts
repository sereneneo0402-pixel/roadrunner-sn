import { 
  RideOperator, 
  RideOption, 
  RoutePreset, 
  NewsArticle, 
  TouristGuideRoute, 
  CorporateExpense, 
  QueuedOfflineAction, 
  AccessibilitySettings, 
  UserProfile, 
  HourlySurgeData,
  RideOperatorId
} from '../types';

export const RIDE_OPERATORS: Record<RideOperatorId, RideOperator> = {
  grab: {
    id: 'grab',
    name: 'Grab',
    tagline: 'GrabCar & JustGrab',
    color: '#00B14F',
    textColor: '#ffffff',
    bgLight: '#ecfdf5',
    borderColor: '#059669',
    pattern: 'solid',
    logoBadge: '🟢 GRAB',
    appDeepLink: 'grab://',
  },
  gojek: {
    id: 'gojek',
    name: 'Gojek',
    tagline: 'GoCar & GoCar XL',
    color: '#00AA13',
    textColor: '#ffffff',
    bgLight: '#f0fdf4',
    borderColor: '#16a34a',
    pattern: 'dots',
    logoBadge: '🟢 GOJEK',
    appDeepLink: 'gojek://',
  },
  tada: {
    id: 'tada',
    name: 'TADA',
    tagline: 'Zero-Commission Driver Fair Fares',
    color: '#F59E0B',
    textColor: '#ffffff',
    bgLight: '#fffbeb',
    borderColor: '#d97706',
    pattern: 'stripes',
    logoBadge: '🟡 TADA',
    appDeepLink: 'tada://',
  },
  ryde: {
    id: 'ryde',
    name: 'Ryde',
    tagline: 'RydeX & Pet-Friendly Rides',
    color: '#EF4444',
    textColor: '#ffffff',
    bgLight: '#fef2f2',
    borderColor: '#dc2626',
    pattern: 'grid',
    logoBadge: '🔴 RYDE',
    appDeepLink: 'ryde://',
  },
  zig: {
    id: 'zig',
    name: 'CDG Zig',
    tagline: 'ComfortDelGro Cabs & Private Hire',
    color: '#0284C7',
    textColor: '#ffffff',
    bgLight: '#f0f9ff',
    borderColor: '#0284c7',
    pattern: 'cross',
    logoBadge: '🔵 ZIG',
    appDeepLink: 'cdgzig://',
  },
};

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'preset-1',
    name: 'Changi Airport ✈️ ➔ Marina Bay Sands',
    pickup: 'Changi Airport Terminal 3, Arrival Hall',
    dropoff: 'Marina Bay Sands Hotel Tower 1',
    category: 'airport',
    distanceKm: 19.4,
    typicalMinutes: 22,
    description: 'Direct expressway via ECP. Fast transfer for travelers.',
    tag: 'Tourist Favorite',
  },
  {
    id: 'preset-2',
    name: 'Raffles Place (CBD) 🏢 ➔ Orchard Road 🛍️',
    pickup: 'One Raffles Place, Taxi Stand',
    dropoff: 'ION Orchard, Drop-off Bay',
    category: 'commute',
    distanceKm: 4.8,
    typicalMinutes: 12,
    description: 'Short city hop. Subject to peak hour ERP & CBD surcharge.',
    tag: 'Peak Commute',
  },
  {
    id: 'preset-3',
    name: 'HarbourFront MRT 🚡 ➔ Sentosa Resorts World 🏖️',
    pickup: 'HarbourFront Centre Taxi Pick-up',
    dropoff: 'Resorts World Sentosa, Casino / Universal Studios',
    category: 'tourist',
    distanceKm: 3.5,
    typicalMinutes: 9,
    description: 'Includes Sentosa gantry entry clearance.',
    tag: 'Weekend Rush',
  },
  {
    id: 'preset-4',
    name: 'Jurong East MRT 🚆 ➔ Raffles Place CBD 💼',
    pickup: 'Jurong East MRT Station Exit B',
    dropoff: 'Ocean Financial Centre, Collyer Quay',
    category: 'commute',
    distanceKm: 16.2,
    typicalMinutes: 24,
    description: 'Major East-West commuter route via AYE.',
    tag: 'Daily Commute',
  },
  {
    id: 'preset-5',
    name: 'Chinatown Point 🥟 ➔ Jewel Changi Airport 💎',
    pickup: 'Chinatown Point, New Bridge Road',
    dropoff: 'Jewel Changi Airport, Main Entrance',
    category: 'airport',
    distanceKm: 21.8,
    typicalMinutes: 26,
    description: 'Ideal airport departure run with baggage space.',
    tag: 'Airport Run',
  },
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'LTA Singapore Enhances Peak Hour Commute Corridor With Smart Traffic Lights',
    summary: 'The Land Transport Authority is piloting adaptive green light sequencing along Shenton Way and Orchard Boulevard to reduce bus and ride delays by up to 14%.',
    category: 'traffic',
    source: 'The Straits Times Commute',
    readTimeMinutes: 2,
    timestamp: '15 mins ago',
    isSavedOffline: true,
    relevanceScore: 98,
  },
  {
    id: 'news-2',
    title: 'Singapore Tech & Financial Hub Sees Growing Corporate Demand for Multi-App Ride Allowance',
    summary: 'A new survey of CBD firms shows 76% of employers are transitioning from fixed single-app vouchers to multi-operator aggregators to lower corporate travel expenses.',
    category: 'economy',
    source: 'Business Times SG',
    readTimeMinutes: 3,
    timestamp: '1 hour ago',
    isSavedOffline: true,
    relevanceScore: 92,
  },
  {
    id: 'news-3',
    title: 'Rainy Afternoon Expected Across Central Singapore: Ride Surge Advisory',
    summary: 'Meteorological Service Singapore forecasts thundery showers between 4 PM and 7 PM. Commuters are advised to compare Tada and Zig to avoid heavy dynamic surge fees.',
    category: 'traffic',
    source: 'SG Weather & Mobility Watch',
    readTimeMinutes: 1,
    timestamp: '2 hours ago',
    isSavedOffline: true,
    relevanceScore: 99,
  },
  {
    id: 'news-4',
    title: '5 Hidden Heritage Spots in Katong & Joo Chiat Accessible via Short Ride Hops',
    summary: 'Explore pastel Peranakan shophouses, award-winning laksa stalls, and boutique cafes without navigating multiple bus transfers in the humid weather.',
    category: 'travel',
    source: 'TimeOut Singapore',
    readTimeMinutes: 4,
    timestamp: '4 hours ago',
    isSavedOffline: true,
    relevanceScore: 85,
  },
  {
    id: 'news-5',
    title: 'Zero-Commission Driver Models: Why Tada and Ryde are Gaining Ground During Off-Peak',
    summary: 'Driver-first models allow operators to offer riders 15-20% discounts while retaining higher driver satisfaction and shorter pickup turnaround times.',
    category: 'economy',
    source: 'Vulcan Post Asia',
    readTimeMinutes: 3,
    timestamp: 'Yesterday',
    isSavedOffline: false,
    relevanceScore: 88,
  },
];

export const TOURIST_GUIDES: TouristGuideRoute[] = [
  {
    id: 'tourist-1',
    title: 'Marina Bay & Gardens by the Bay Sunset Hop',
    area: 'Downtown Marina Bay',
    description: 'Iconic panoramic route covering Marina Bay Sands, Flower Dome, Cloud Forest, and Supertree Grove.',
    recommendedTime: '4:30 PM - 5:15 PM (Before evening CBD surge starts)',
    insiderTip: 'Pick up at Sands Expo Basement rather than Hotel Tower 1 to avoid hotel concourse taxi congestion.',
    peakHourWarning: 'Avoid 6:00 PM - 7:30 PM: CBD ERP gantry adds $3.00 and dynamic surge spikes to 1.6x.',
    attractions: ['Supertree Grove', 'Spectra Light & Water Show', 'Cloud Forest', 'Marina Bay Waterfront'],
    estimatedGrabPrice: 19.5,
    estimatedGojekPrice: 18.2,
    estimatedTadaPrice: 15.6,
    bestOperatorTip: 'Tada has no platform surcharge around Marina Bay during early evening.',
    esimDiscountAvailable: true,
  },
  {
    id: 'tourist-2',
    title: 'Historic Heritage Trail: Chinatown to Little India',
    area: 'Central Heritage Belt',
    description: 'Sensory journey through Singapore’s rich multicultural tapestry, ancient temples, and vibrant street bazaars.',
    recommendedTime: '10:00 AM - 11:30 AM (Cool morning weather, minimal traffic)',
    insiderTip: 'Ask your driver to drop you off at Sri Veeramakaliamman Temple side lane for safe, pedestrian-friendly walking.',
    peakHourWarning: 'Serangoon Road gets congested on weekend evenings. Budget 10 extra minutes travel time.',
    attractions: ['Buddha Tooth Relic Temple', 'Sri Mariamman Temple', 'Tekka Centre Food Court', 'Mustafa Centre'],
    estimatedGrabPrice: 14.8,
    estimatedGojekPrice: 13.5,
    estimatedTadaPrice: 12.0,
    bestOperatorTip: 'Gojek and Tada offer rapid 2-minute pickups in the Chinatown conservation precinct.',
    esimDiscountAvailable: true,
  },
  {
    id: 'tourist-3',
    title: 'Sentosa Island Resorts & Beach Gateway',
    area: 'Southern Islands',
    description: 'From city hustle to tropical breeze at Palawan Beach, Universal Studios, and S.E.A. Aquarium.',
    recommendedTime: '9:15 AM (Pre-opening crowd) or 8:30 PM (Post-fireworks departure)',
    insiderTip: 'Hotel or attraction bookings automatically waive the Sentosa $6.00 vehicular island admission fee! Show your booking confirmation at the gantry.',
    peakHourWarning: 'Sentosa Gateway experiences queue build-ups between 5:30 PM and 7:00 PM as day visitors exit.',
    attractions: ['Universal Studios Singapore', 'S.E.A. Aquarium', 'Palawan Beach Suspension Bridge', 'Wings of Time'],
    estimatedGrabPrice: 24.0,
    estimatedGojekPrice: 22.5,
    estimatedTadaPrice: 18.9,
    bestOperatorTip: 'CDG Zig taxis use metered Sentosa bypass routes that frequently beat surge prices by $5+.',
    esimDiscountAvailable: true,
  },
  {
    id: 'tourist-4',
    title: 'Jewel Changi Rainforest & Canopy Experience',
    area: 'Changi East',
    description: 'World-renowned HSBC Rain Vortex, Shiseido Forest Valley, and seamless baggage drop privileges.',
    recommendedTime: 'Anytime! Best 3 hours prior to international flight departure',
    insiderTip: 'Pre-book a 6-seater via Road Runner if traveling with 3+ large luggage bags—cheaper than booking 2 separate sedans.',
    peakHourWarning: 'East Coast Parkway (ECP) outbound is smooth; inbound toward city has morning peak slowdowns.',
    attractions: ['HSBC Rain Vortex Waterfall', 'Canopy Park', 'Early Check-In Lounge', 'Changi Jurassic Mile'],
    estimatedGrabPrice: 28.5,
    estimatedGojekPrice: 27.0,
    estimatedTadaPrice: 23.5,
    bestOperatorTip: 'Book Tada or Ryde for flat airport rate with zero baggage or airport location markup.',
    esimDiscountAvailable: true,
  },
];

export const HOURLY_SURGE_DATA: HourlySurgeData[] = [
  { hour: '00:00', displayHour: '12 AM', averageFare: 16.5, surgeIndex: 1.1, grabPrice: 17.5, gojekPrice: 16.0, tadaPrice: 15.0, rydePrice: 15.5, zigPrice: 18.0, isPeak: false, recommendation: 'Late night standard rates.' },
  { hour: '02:00', displayHour: '2 AM', averageFare: 17.0, surgeIndex: 1.15, grabPrice: 18.0, gojekPrice: 16.5, tadaPrice: 15.5, rydePrice: 16.0, zigPrice: 19.0, isPeak: false, recommendation: 'Night surcharge applies to taxis.' },
  { hour: '04:00', displayHour: '4 AM', averageFare: 15.5, surgeIndex: 1.0, grabPrice: 16.0, gojekPrice: 15.0, tadaPrice: 14.5, rydePrice: 15.0, zigPrice: 17.0, isPeak: false, recommendation: 'Quiet roads, fast airport runs.' },
  { hour: '06:00', displayHour: '6 AM', averageFare: 16.0, surgeIndex: 1.05, grabPrice: 16.5, gojekPrice: 15.5, tadaPrice: 14.8, rydePrice: 15.2, zigPrice: 17.5, isPeak: false, recommendation: 'Early birds save before surge.' },
  { hour: '07:00', displayHour: '7 AM', averageFare: 21.0, surgeIndex: 1.35, grabPrice: 23.0, gojekPrice: 21.5, tadaPrice: 18.5, rydePrice: 19.0, zigPrice: 22.0, isPeak: true, recommendation: 'Morning peak begins. Tada is 19% cheaper.' },
  { hour: '08:00', displayHour: '8 AM', averageFare: 26.5, surgeIndex: 1.70, grabPrice: 29.0, gojekPrice: 27.5, tadaPrice: 22.0, rydePrice: 23.5, zigPrice: 28.0, isPeak: true, recommendation: 'Heavy peak surge. Wait 25 mins or choose Tada.' },
  { hour: '09:00', displayHour: '9 AM', averageFare: 24.0, surgeIndex: 1.55, grabPrice: 26.0, gojekPrice: 24.5, tadaPrice: 20.5, rydePrice: 21.5, zigPrice: 25.0, isPeak: true, recommendation: 'Peak tapering down near Raffles Place.' },
  { hour: '10:00', displayHour: '10 AM', averageFare: 17.5, surgeIndex: 1.10, grabPrice: 18.0, gojekPrice: 17.0, tadaPrice: 15.5, rydePrice: 16.0, zigPrice: 18.5, isPeak: false, recommendation: 'Ideal mid-morning travel window.' },
  { hour: '12:00', displayHour: '12 PM', averageFare: 18.5, surgeIndex: 1.15, grabPrice: 19.5, gojekPrice: 18.0, tadaPrice: 16.5, rydePrice: 17.0, zigPrice: 19.0, isPeak: false, recommendation: 'Lunch hour mild demand.' },
  { hour: '14:00', displayHour: '2 PM', averageFare: 16.0, surgeIndex: 1.0, grabPrice: 16.5, gojekPrice: 15.5, tadaPrice: 14.5, rydePrice: 15.0, zigPrice: 17.0, isPeak: false, recommendation: 'Cheapest window of the day.' },
  { hour: '16:00', displayHour: '4 PM', averageFare: 17.5, surgeIndex: 1.10, grabPrice: 18.5, gojekPrice: 17.0, tadaPrice: 15.5, rydePrice: 16.5, zigPrice: 18.0, isPeak: false, recommendation: 'Travel now before 5:30 PM evening surge.' },
  { hour: '17:30', displayHour: '5:30 PM', averageFare: 23.5, surgeIndex: 1.50, grabPrice: 25.5, gojekPrice: 24.0, tadaPrice: 20.0, rydePrice: 21.0, zigPrice: 24.5, isPeak: true, recommendation: 'Evening rush begins. Heavy CBD demand.' },
  { hour: '18:30', displayHour: '6:30 PM', averageFare: 28.0, surgeIndex: 1.80, grabPrice: 31.0, gojekPrice: 29.0, tadaPrice: 23.5, rydePrice: 25.0, zigPrice: 29.5, isPeak: true, recommendation: 'Severe surge. Gojek & Tada have lowest surge multiplier.' },
  { hour: '19:30', displayHour: '7:30 PM', averageFare: 25.0, surgeIndex: 1.60, grabPrice: 27.5, gojekPrice: 25.5, tadaPrice: 21.0, rydePrice: 22.5, zigPrice: 26.0, isPeak: true, recommendation: 'Surge clearing outside CBD.' },
  { hour: '21:00', displayHour: '9 PM', averageFare: 18.0, surgeIndex: 1.15, grabPrice: 19.0, gojekPrice: 17.5, tadaPrice: 16.0, rydePrice: 16.5, zigPrice: 18.5, isPeak: false, recommendation: 'Evening leisure traffic, steady fares.' },
  { hour: '22:30', displayHour: '10:30 PM', averageFare: 17.0, surgeIndex: 1.10, grabPrice: 17.5, gojekPrice: 16.5, tadaPrice: 15.2, rydePrice: 15.8, zigPrice: 18.0, isPeak: false, recommendation: 'Smooth roads across island.' },
];

export const INITIAL_CORPORATE_EXPENSES: CorporateExpense[] = [
  {
    id: 'exp-101',
    tripDate: '2026-11-11 19:45',
    operator: 'GrabCar Premium',
    pickup: 'One Raffles Quay, Level 1',
    dropoff: 'Bishan Street 22',
    amount: 32.40,
    purpose: 'Late Night Commute',
    status: 'Approved',
    receiptId: 'RR-RCPT-8891',
    policyCompliant: true,
  },
  {
    id: 'exp-102',
    tripDate: '2026-11-10 14:15',
    operator: 'TADA Sedan',
    pickup: 'Marina Bay Financial Centre Tower 2',
    dropoff: 'Suntec City Convention Centre',
    amount: 14.20,
    purpose: 'Client Meeting',
    status: 'Approved',
    receiptId: 'RR-RCPT-8842',
    policyCompliant: true,
  },
  {
    id: 'exp-103',
    tripDate: '2026-11-08 09:30',
    operator: 'CDG Zig Taxi',
    pickup: 'Changi Airport Terminal 1',
    dropoff: 'One Raffles Place',
    amount: 28.50,
    purpose: 'Airport Transfer',
    status: 'Approved',
    receiptId: 'RR-RCPT-8790',
    policyCompliant: true,
  },
  {
    id: 'exp-104',
    tripDate: '2026-11-05 21:10',
    operator: 'Gojek GoCar XL',
    pickup: '79 Robinson Road',
    dropoff: 'Tampines Ave 4',
    amount: 38.60,
    purpose: 'Team Transport',
    status: 'Pending Review',
    receiptId: 'RR-RCPT-8712',
    policyCompliant: true,
  },
];

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'user-commuter',
    name: 'Rachel Tan (陈雨欣)',
    email: 'rachel.tan@commuter.sg',
    role: 'commuter',
    preferredLanguage: 'en',
    monthlySavings: 78.40,
    tripsCount: 26,
    corporateAllowance: {
      total: 350,
      used: 113.70,
      currency: 'SGD',
    },
    hasFirstTimeVoucher: true,
    eSimClaimed: false,
  },
  {
    id: 'user-tourist',
    name: 'Kenji Sato (佐藤 健二)',
    email: 'kenji.sato@tokyo-travel.jp',
    role: 'tourist',
    preferredLanguage: 'ja',
    monthlySavings: 42.10,
    tripsCount: 8,
    hasFirstTimeVoucher: true,
    eSimClaimed: true,
  },
  {
    id: 'user-corporate',
    name: 'Apex Global Financial Services (Admin)',
    email: 'travel-admin@apexfin.com.sg',
    role: 'corporate',
    preferredLanguage: 'en',
    monthlySavings: 492.50,
    tripsCount: 142,
    corporateAllowance: {
      total: 5000,
      used: 2840.00,
      currency: 'SGD',
    },
    hasFirstTimeVoucher: false,
    eSimClaimed: false,
  },
];

const STORAGE_KEYS = {
  SETTINGS: 'rr_accessibility_settings_v1',
  ACTIVE_PROFILE: 'rr_active_profile_v1',
  SAVED_NEWS: 'rr_saved_news_v1',
  EXPENSES: 'rr_corporate_expenses_v1',
  SYNC_QUEUE: 'rr_offline_sync_queue_v1',
  LAST_SYNC_TIME: 'rr_last_cloud_sync_timestamp_v1',
  SIMULATE_OFFLINE: 'rr_simulate_offline_mode_v1',
  BOOKED_RIDES: 'rr_booked_rides_history_v1',
};

// Storage Service with robust offline fallback & cloud sync simulation
export class StorageService {
  private static isBrowser = typeof window !== 'undefined';

  static getSettings(): AccessibilitySettings {
    const fallback: AccessibilitySettings = {
      textSize: 'normal',
      highContrast: false,
      colorblindMode: 'none',
      simplifiedLanguage: true,
      screenReaderOptimized: false,
      speechSpeed: 1.0,
      audioNarrationEnabled: false,
      reducedMotion: false,
    };
    if (!this.isBrowser) return fallback;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...fallback, ...JSON.parse(data) } : fallback;
    } catch {
      return fallback;
    }
  }

  static saveSettings(settings: AccessibilitySettings): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  static getProfile(): UserProfile {
    const fallback = MOCK_PROFILES[0];
    if (!this.isBrowser) return fallback;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  static saveProfile(profile: UserProfile): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Profile save error:', e);
    }
  }

  static getNews(): NewsArticle[] {
    if (!this.isBrowser) return INITIAL_NEWS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_NEWS);
      return data ? JSON.parse(data) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  }

  static toggleSaveNewsArticle(articleId: string): NewsArticle[] {
    const news = this.getNews().map(article => {
      if (article.id === articleId) {
        return { ...article, isSavedOffline: !article.isSavedOffline };
      }
      return article;
    });
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.SAVED_NEWS, JSON.stringify(news));
      this.enqueueOfflineAction({
        id: `sync-news-${Date.now()}`,
        timestamp: Date.now(),
        actionType: 'save_article',
        description: `Toggled offline bookmark for article ${articleId}`,
        payload: { articleId },
        status: 'pending',
      });
    }
    return news;
  }

  static getExpenses(): CorporateExpense[] {
    if (!this.isBrowser) return INITIAL_CORPORATE_EXPENSES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : INITIAL_CORPORATE_EXPENSES;
    } catch {
      return INITIAL_CORPORATE_EXPENSES;
    }
  }

  static addExpense(expense: Omit<CorporateExpense, 'id'>): CorporateExpense[] {
    const current = this.getExpenses();
    const newExpense: CorporateExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    const updated = [newExpense, ...current];
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      this.enqueueOfflineAction({
        id: `sync-exp-${Date.now()}`,
        timestamp: Date.now(),
        actionType: 'add_expense',
        description: `Logged corporate ride expense SGD $${expense.amount.toFixed(2)} (${expense.purpose})`,
        payload: newExpense,
        status: 'pending',
      });
    }
    return updated;
  }

  static getSyncQueue(): QueuedOfflineAction[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueueOfflineAction(action: QueuedOfflineAction): void {
    if (!this.isBrowser) return;
    try {
      const queue = this.getSyncQueue();
      queue.push(action);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Queue error:', e);
    }
  }

  static clearSyncQueue(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
    } catch (e) {
      console.warn('Clear queue error:', e);
    }
  }

  static getLastSyncTime(): string {
    if (!this.isBrowser) return 'Just now';
    try {
      const time = localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
      return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '5 mins ago';
    } catch {
      return 'Just now';
    }
  }

  static getSimulatedOffline(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(STORAGE_KEYS.SIMULATE_OFFLINE) === 'true';
  }

  static setSimulatedOffline(value: boolean): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.SIMULATE_OFFLINE, String(value));
  }

  static exportFullBackup(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      settings: this.getSettings(),
      news: this.getNews(),
      expenses: this.getExpenses(),
      syncQueue: this.getSyncQueue(),
    };
    return JSON.stringify(data, null, 2);
  }

  static resetDemoData(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SAVED_NEWS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.SIMULATE_OFFLINE);
  }
}
