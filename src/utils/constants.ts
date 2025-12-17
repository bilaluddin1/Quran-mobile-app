/**
 * App Constants
 * Centralized constants for the Quran Recitation App
 */

// App Information
export const APP_INFO = {
  name: 'Quran Recitation App',
  version: '1.0.0',
  build: '2024.01.01',
  description: 'Bike-friendly Quran recitation app with voice recognition',
} as const;

// Colors
export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#E8F5E8',
  accent: '#66BB6A',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
  },
  border: '#E0E0E0',
  shadow: '#000000',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Audio Settings
export const AUDIO = {
  sampleRate: 44100,
  channels: 1,
  bitDepth: 16,
  silenceThreshold: -40, // dB
  minSilenceDuration: 1.0, // seconds
  maxRecordingDuration: 300, // seconds (5 minutes)
  wakeWords: ['بسم الله', 'bismillah', 'start recitation', 'begin'],
} as const;

// Recitation Settings
export const RECITATION = {
  defaultSurah: 1,
  defaultAyah: 1,
  maxSurahs: 114,
  accuracyThreshold: 70, // percentage
  similarityThreshold: 0.7, // 70% similarity
  maxMistakesPerVerse: 3,
  maxPausesPerVerse: 2,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  bikeModeSettings: 'bike_mode_settings',
  sessionHistory: 'bike_mode_sessions',
  userPreferences: 'user_preferences',
  quranData: 'quran_data',
  appSettings: 'app_settings',
} as const;

// API Endpoints (if needed for future features)
export const API = {
  baseUrl: 'https://api.quran.com',
  endpoints: {
    surahs: '/v1/surahs',
    verses: '/v1/verses',
    audio: '/v1/audio',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network connection error. Please check your internet connection.',
  audio: 'Audio recording error. Please check microphone permissions.',
  storage: 'Storage error. Please try again.',
  permission: 'Permission denied. Please grant required permissions.',
  initialization: 'Failed to initialize app. Please restart the application.',
  generic: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  sessionStarted: 'Recitation session started successfully.',
  sessionEnded: 'Recitation session completed successfully.',
  settingsSaved: 'Settings saved successfully.',
  dataExported: 'Data exported successfully.',
} as const;

// Validation Rules
export const VALIDATION = {
  minPasswordLength: 8,
  maxUsernameLength: 50,
  minUsernameLength: 3,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^\+?[\d\s-()]+$/,
} as const;

// Feature Flags
export const FEATURES = {
  wakeWordDetection: true,
  voiceFeedback: true,
  vibrationFeedback: true,
  backgroundMode: true,
  offlineMode: true,
  analytics: false,
  cloudSync: false,
} as const;
