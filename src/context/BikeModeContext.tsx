/**
 * Bike Mode Context - Global state management for bike mode
 * Handles bike mode settings, preferences, and session data
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BikeModeSettings {
  wakeWordEnabled: boolean;
  voiceFeedbackEnabled: boolean;
  vibrationEnabled: boolean;
  autoAdvanceVerses: boolean;
  pauseDetectionSensitivity: number; // 1-10
  mistakeDetectionSensitivity: number; // 1-10
  preferredReciter: string;
  audioQuality: 'low' | 'medium' | 'high';
  language: 'ar' | 'en';
}

export interface BikeModeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  versesRecited: number;
  pausesDetected: number;
  mistakesDetected: number;
  totalDuration: number;
  averageAccuracy: number;
  surahsCompleted: number[];
}

export interface BikeModeContextType {
  bikeMode: boolean;
  setBikeMode: (enabled: boolean) => void;
  settings: BikeModeSettings;
  updateSettings: (newSettings: Partial<BikeModeSettings>) => void;
  currentSession: BikeModeSession | null;
  startSession: () => void;
  endSession: () => void;
  updateSession: (updates: Partial<BikeModeSession>) => void;
  sessionHistory: BikeModeSession[];
  clearSessionHistory: () => void;
}

const defaultSettings: BikeModeSettings = {
  wakeWordEnabled: true,
  voiceFeedbackEnabled: true,
  vibrationEnabled: true,
  autoAdvanceVerses: true,
  pauseDetectionSensitivity: 5,
  mistakeDetectionSensitivity: 5,
  preferredReciter: 'default',
  audioQuality: 'medium',
  language: 'ar',
};

const BikeModeContext = createContext<BikeModeContextType | undefined>(undefined);

interface BikeModeProviderProps {
  children: ReactNode;
}

export const BikeModeProvider: React.FC<BikeModeProviderProps> = ({ children }) => {
  const [bikeMode, setBikeModeState] = useState<boolean>(false);
  const [settings, setSettingsState] = useState<BikeModeSettings>(defaultSettings);
  const [currentSession, setCurrentSession] = useState<BikeModeSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<BikeModeSession[]>([]);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
    loadSessionHistory();
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    saveSettings();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('bike_mode_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettingsState({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load bike mode settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('bike_mode_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save bike mode settings:', error);
    }
  };

  const loadSessionHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('bike_mode_sessions');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Convert date strings back to Date objects
        const historyWithDates = parsedHistory.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        }));
        setSessionHistory(historyWithDates);
      }
    } catch (error) {
      console.error('Failed to load session history:', error);
    }
  };

  const saveSessionHistory = async (history: BikeModeSession[]) => {
    try {
      await AsyncStorage.setItem('bike_mode_sessions', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save session history:', error);
    }
  };

  const setBikeMode = (enabled: boolean) => {
    setBikeModeState(enabled);
    if (!enabled && currentSession) {
      endSession();
    }
  };

  const updateSettings = (newSettings: Partial<BikeModeSettings>) => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
  };

  const startSession = () => {
    const newSession: BikeModeSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      versesRecited: 0,
      pausesDetected: 0,
      mistakesDetected: 0,
      totalDuration: 0,
      averageAccuracy: 0,
      surahsCompleted: [],
    };
    setCurrentSession(newSession);
  };

  const endSession = () => {
    if (currentSession) {
      const endedSession: BikeModeSession = {
        ...currentSession,
        endTime: new Date(),
        totalDuration: currentSession.endTime 
          ? currentSession.endTime.getTime() - currentSession.startTime.getTime()
          : Date.now() - currentSession.startTime.getTime(),
      };
      
      const updatedHistory = [endedSession, ...sessionHistory].slice(0, 50); // Keep last 50 sessions
      setSessionHistory(updatedHistory);
      saveSessionHistory(updatedHistory);
      setCurrentSession(null);
    }
  };

  const updateSession = (updates: Partial<BikeModeSession>) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const clearSessionHistory = async () => {
    setSessionHistory([]);
    try {
      await AsyncStorage.removeItem('bike_mode_sessions');
    } catch (error) {
      console.error('Failed to clear session history:', error);
    }
  };

  const contextValue: BikeModeContextType = {
    bikeMode,
    setBikeMode,
    settings,
    updateSettings,
    currentSession,
    startSession,
    endSession,
    updateSession,
    sessionHistory,
    clearSessionHistory,
  };

  return (
    <BikeModeContext.Provider value={contextValue}>
      {children}
    </BikeModeContext.Provider>
  );
};

export const useBikeMode = (): BikeModeContextType => {
  const context = useContext(BikeModeContext);
  if (context === undefined) {
    throw new Error('useBikeMode must be used within a BikeModeProvider');
  }
  return context;
};

// Export the context for direct access if needed
export { BikeModeContext };
