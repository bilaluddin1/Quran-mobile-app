/**
 * Recitation Types - TypeScript definitions for recitation functionality
 * Defines types for audio processing, validation, and user interactions
 */

export type RecitationStatus = 'idle' | 'recording' | 'processing' | 'paused' | 'error';

export type RecitationMode = 'practice' | 'bike' | 'guided' | 'free';

export type AudioQuality = 'low' | 'medium' | 'high';

export type Language = 'ar' | 'en' | 'ur' | 'tr';

export type RecitationSpeed = 'slow' | 'medium' | 'fast';

export interface RecitationSession {
  id: string;
  mode: RecitationMode;
  startTime: Date;
  endTime?: Date;
  status: RecitationStatus;
  currentSurah: number;
  currentAyah: number;
  versesCompleted: number;
  totalVerses: number;
  accuracy: number;
  mistakes: RecitationMistake[];
  pauses: PauseEvent[];
  audioQuality: AudioQuality;
  settings: RecitationSettings;
}

export interface RecitationMistake {
  id: string;
  type: 'pronunciation' | 'omission' | 'addition' | 'timing';
  severity: 'low' | 'medium' | 'high';
  position: number;
  expectedText?: string;
  recitedText?: string;
  timestamp: Date;
  surah: number;
  ayah: number;
  wordIndex?: number;
  correction?: string;
  isCorrected: boolean;
}

export interface PauseEvent {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  reason: 'natural' | 'mistake' | 'user' | 'system';
  surah: number;
  ayah: number;
  position: number;
}

export interface RecitationSettings {
  mode: RecitationMode;
  language: Language;
  speed: RecitationSpeed;
  audioQuality: AudioQuality;
  voiceFeedback: boolean;
  vibrationFeedback: boolean;
  autoAdvance: boolean;
  pauseDetection: boolean;
  mistakeDetection: boolean;
  wakeWordDetection: boolean;
  backgroundMode: boolean;
  sensitivity: {
    pause: number; // 1-10
    mistake: number; // 1-10
    audio: number; // 1-10
  };
}

export interface AudioProcessingResult {
  success: boolean;
  transcribedText?: string;
  confidence: number;
  language: Language;
  duration: number;
  audioLevel: number;
  quality: AudioQuality;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  accuracy: number;
  confidence: number;
  mistakes: RecitationMistake[];
  missingWords: string[];
  extraWords: string[];
  suggestions: string[];
  score: number; // 0-100
}

export interface WakeWordEvent {
  word: string;
  confidence: number;
  timestamp: Date;
  language: Language;
}

export interface RecitationProgress {
  sessionId: string;
  surah: number;
  ayah: number;
  totalVerses: number;
  completedVerses: number;
  progressPercentage: number;
  timeSpent: number;
  averageAccuracy: number;
  mistakesCount: number;
  pausesCount: number;
}

export interface RecitationStats {
  totalSessions: number;
  totalTime: number;
  totalVerses: number;
  averageAccuracy: number;
  totalMistakes: number;
  totalPauses: number;
  favoriteSurahs: number[];
  improvementTrend: number[];
  streakDays: number;
  lastSessionDate?: Date;
}

export interface RecitationGoal {
  id: string;
  type: 'verses' | 'time' | 'accuracy' | 'surahs';
  target: number;
  current: number;
  deadline?: Date;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface RecitationNotification {
  id: string;
  type: 'mistake' | 'pause' | 'achievement' | 'reminder' | 'encouragement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    type: 'navigate' | 'retry' | 'continue';
    data?: any;
  };
}

export interface RecitationFeedback {
  type: 'positive' | 'constructive' | 'correction';
  message: string;
  timestamp: Date;
  surah: number;
  ayah: number;
  isAudio: boolean;
  isVisual: boolean;
  isVibration: boolean;
}

// Event types for the recitation system
export type RecitationEvent = 
  | { type: 'SESSION_STARTED'; payload: { sessionId: string; mode: RecitationMode } }
  | { type: 'SESSION_ENDED'; payload: { sessionId: string; stats: RecitationStats } }
  | { type: 'VERSE_STARTED'; payload: { surah: number; ayah: number } }
  | { type: 'VERSE_COMPLETED'; payload: { surah: number; ayah: number; accuracy: number } }
  | { type: 'MISTAKE_DETECTED'; payload: RecitationMistake }
  | { type: 'PAUSE_DETECTED'; payload: PauseEvent }
  | { type: 'WAKE_WORD_DETECTED'; payload: WakeWordEvent }
  | { type: 'SETTINGS_UPDATED'; payload: Partial<RecitationSettings> }
  | { type: 'GOAL_ACHIEVED'; payload: RecitationGoal }
  | { type: 'FEEDBACK_GIVEN'; payload: RecitationFeedback };

// Utility types
export type RecitationCallback<T = any> = (data: T) => void;

export type RecitationError = {
  code: string;
  message: string;
  timestamp: Date;
  context?: any;
};

export type RecitationState = {
  status: RecitationStatus;
  currentSession?: RecitationSession;
  settings: RecitationSettings;
  stats: RecitationStats;
  goals: RecitationGoal[];
  notifications: RecitationNotification[];
  errors: RecitationError[];
};
