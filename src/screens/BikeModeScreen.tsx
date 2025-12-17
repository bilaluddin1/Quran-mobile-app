/**
 * Bike Mode Screen - Main interface for bike riding
 * Hands-free operation with voice commands and audio feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { AudioService } from '../services/AudioService';
import { QuranDatabase } from '../services/QuranDatabase';
import { useBikeMode } from '../context/BikeModeContext';
import { RecitationStatus } from '../types/RecitationTypes';

const { width, height } = Dimensions.get('window');

const BikeModeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { bikeMode, setBikeMode } = useBikeMode();
  
  // State management
  const [recitationStatus, setRecitationStatus] = useState<RecitationStatus>('idle');
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [progress, setProgress] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    versesRecited: 0,
    pausesDetected: 0,
    mistakesDetected: 0,
    sessionDuration: 0,
  });
  
  // Refs for continuous operations
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartTime = useRef<number>(0);

  useEffect(() => {
    // Initialize bike mode
    initializeBikeMode();
    
    // Cleanup on unmount
    return () => {
      stopRecording();
    };
  }, []);

  const initializeBikeMode = async () => {
    try {
      await AudioService.initialize();
      await QuranDatabase.initialize();
      
      // Start wake word detection
      AudioService.startWakeWordDetection(handleWakeWordDetected);
      
      console.log('Bike mode initialized successfully');
    } catch (error) {
      console.error('Failed to initialize bike mode:', error);
      Alert.alert('Error', 'Failed to initialize bike mode');
    }
  };

  const handleWakeWordDetected = () => {
    console.log('Wake word detected!');
    Vibration.vibrate(100); // Short vibration feedback
    startRecording();
  };

  const startRecording = async () => {
    try {
      setRecitationStatus('recording');
      sessionStartTime.current = Date.now();
      
      // Start audio recording
      await AudioService.startRecording();
      
      // Start continuous processing
      startContinuousProcessing();
      
      // Provide audio feedback
      await AudioService.speak('Recording started. Begin your recitation.');
      
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
      setRecitationStatus('idle');
    }
  };

  const stopRecording = async () => {
    try {
      setRecitationStatus('idle');
      
      // Stop audio recording
      await AudioService.stopRecording();
      
      // Stop continuous processing
      stopContinuousProcessing();
      
      // Calculate session duration
      const duration = Date.now() - sessionStartTime.current;
      setSessionStats(prev => ({
        ...prev,
        sessionDuration: duration,
      }));
      
      // Provide audio feedback
      await AudioService.speak('Recording stopped. Session complete.');
      
      console.log('Recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const startContinuousProcessing = () => {
    recordingInterval.current = setInterval(async () => {
      try {
        // Process current audio chunk
        const result = await AudioService.processAudioChunk();
        
        if (result) {
          // Handle pause detection
          if (result.pauseDetected) {
            handlePauseDetected();
          }
          
          // Handle mistake detection
          if (result.mistakeDetected) {
            handleMistakeDetected(result.mistakeDetails);
          }
          
          // Handle verse completion
          if (result.verseCompleted) {
            handleVerseCompleted();
          }
        }
      } catch (error) {
        console.error('Error in continuous processing:', error);
      }
    }, 2000); // Process every 2 seconds
  };

  const stopContinuousProcessing = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
  };

  const handlePauseDetected = async () => {
    setSessionStats(prev => ({
      ...prev,
      pausesDetected: prev.pausesDetected + 1,
    }));
    
    // Provide voice feedback
    await AudioService.speak('Pause detected. Please continue your recitation.');
    
    // Vibration feedback
    Vibration.vibrate([100, 50, 100]);
  };

  const handleMistakeDetected = async (mistakeDetails: any) => {
    setSessionStats(prev => ({
      ...prev,
      mistakesDetected: prev.mistakesDetected + 1,
    }));
    
    // Provide voice feedback
    await AudioService.speak('Please correct the pronunciation and continue.');
    
    // Vibration feedback
    Vibration.vibrate([200, 100, 200]);
  };

  const handleVerseCompleted = async () => {
    setSessionStats(prev => ({
      ...prev,
      versesRecited: prev.versesRecited + 1,
    }));
    
    // Move to next verse
    const nextVerse = QuranDatabase.getNextVerse(currentSurah, currentAyah);
    if (nextVerse) {
      setCurrentSurah(nextVerse.surah);
      setCurrentAyah(nextVerse.verse);
      updateProgress();
    }
    
    // Provide encouragement
    await AudioService.speak('Excellent recitation. Continue to the next verse.');
    
    // Vibration feedback
    Vibration.vibrate(100);
  };

  const updateProgress = () => {
    const surahInfo = QuranDatabase.getSurahInfo(currentSurah);
    if (surahInfo) {
      const progressPercent = (currentAyah / surahInfo.totalVerses) * 100;
      setProgress(progressPercent);
    }
  };

  const getStatusColor = () => {
    switch (recitationStatus) {
      case 'recording':
        return '#F44336';
      case 'processing':
        return '#FF9800';
      case 'idle':
      default:
        return '#4CAF50';
    }
  };

  const getStatusText = () => {
    switch (recitationStatus) {
      case 'recording':
        return 'Recording...';
      case 'processing':
        return 'Processing...';
      case 'idle':
      default:
        return 'Ready';
    }
  };

  const getCurrentSurahName = () => {
    const surahInfo = QuranDatabase.getSurahInfo(currentSurah);
    return surahInfo ? surahInfo.nameEnglish : 'Unknown';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Surah Display */}
        <View style={styles.surahDisplay}>
          <Text style={styles.surahName}>{getCurrentSurahName()}</Text>
          <Text style={styles.ayahInfo}>Ayah {currentAyah}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* Recording Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.startButton,
              recitationStatus === 'recording' && styles.disabledButton,
            ]}
            onPress={startRecording}
            disabled={recitationStatus === 'recording'}
          >
            <LinearGradient
              colors={recitationStatus === 'recording' ? ['#ccc', '#999'] : ['#4CAF50', '#66BB6A']}
              style={styles.buttonGradient}
            >
              <Icon name="mic" size={40} color="#fff" />
              <Text style={styles.buttonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.stopButton,
              recitationStatus === 'idle' && styles.disabledButton,
            ]}
            onPress={stopRecording}
            disabled={recitationStatus === 'idle'}
          >
            <LinearGradient
              colors={recitationStatus === 'idle' ? ['#ccc', '#999'] : ['#F44336', '#EF5350']}
              style={styles.buttonGradient}
            >
              <Icon name="stop" size={40} color="#fff" />
              <Text style={styles.buttonText}>Stop</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Session Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sessionStats.versesRecited}</Text>
            <Text style={styles.statLabel}>Verses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sessionStats.pausesDetected}</Text>
            <Text style={styles.statLabel}>Pauses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sessionStats.mistakesDetected}</Text>
            <Text style={styles.statLabel}>Mistakes</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🚴‍♂️ Bike Mode Active - Say "Bismillah" to start
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  surahDisplay: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  surahName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  ayahInfo: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    minWidth: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  controlButton: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    overflow: 'hidden',
  },
  startButton: {
    // Additional styles if needed
  },
  stopButton: {
    // Additional styles if needed
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
});

export default BikeModeScreen;
