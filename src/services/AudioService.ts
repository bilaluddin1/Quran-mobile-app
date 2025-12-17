/**
 * Audio Service - Native Android audio processing
 * Handles recording, speech recognition, and voice feedback
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import { PermissionsAndroid } from 'react-native';

export interface AudioProcessingResult {
  pauseDetected: boolean;
  mistakeDetected: boolean;
  verseCompleted: boolean;
  transcribedText?: string;
  mistakeDetails?: any;
  audioQuality?: number;
}

export interface WakeWordCallback {
  (): void;
}

class AudioServiceClass {
  private isRecording: boolean = false;
  private isInitialized: boolean = false;
  private wakeWordCallback: WakeWordCallback | null = null;
  private audioChunks: any[] = [];
  private currentAudioLevel: number = 0;
  private silenceThreshold: number = -40; // dB
  private minSilenceDuration: number = 1.0; // seconds
  private lastSpeechTime: number = 0;

  async initialize(): Promise<void> {
    try {
      // Initialize TTS
      await Tts.setDefaultLanguage('ar-SA'); // Arabic (Saudi Arabia)
      await Tts.setDefaultRate(0.5); // Slower rate for clarity
      await Tts.setDefaultPitch(1.0);

      // Initialize Voice recognition
      Voice.onSpeechStart = this.onSpeechStart;
      Voice.onSpeechEnd = this.onSpeechEnd;
      Voice.onSpeechResults = this.onSpeechResults;
      Voice.onSpeechError = this.onSpeechError;

      // Initialize Sound for playback
      Sound.setCategory('Playback');

      this.isInitialized = true;
      console.log('AudioService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioService:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        return Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    return true;
  }

  async startRecording(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error('Microphone permissions not granted');
      }

      // Start voice recognition
      await Voice.start('ar-SA'); // Arabic language
      this.isRecording = true;
      this.lastSpeechTime = Date.now();

      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<void> {
    try {
      if (this.isRecording) {
        await Voice.stop();
        this.isRecording = false;
        console.log('Recording stopped');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  async processAudioChunk(): Promise<AudioProcessingResult | null> {
    try {
      if (!this.isRecording) {
        return null;
      }

      // Simulate audio processing (in real implementation, this would process actual audio)
      const currentTime = Date.now();
      const timeSinceLastSpeech = currentTime - this.lastSpeechTime;

      // Check for pause detection
      const pauseDetected = timeSinceLastSpeech > this.minSilenceDuration * 1000;

      // Check for mistake detection (simplified)
      const mistakeDetected = Math.random() < 0.1; // 10% chance for demo

      // Check for verse completion (simplified)
      const verseCompleted = Math.random() < 0.05; // 5% chance for demo

      return {
        pauseDetected,
        mistakeDetected,
        verseCompleted,
        transcribedText: 'Sample transcribed text',
        audioQuality: 85, // Simulated quality score
      };
    } catch (error) {
      console.error('Error processing audio chunk:', error);
      return null;
    }
  }

  async speak(text: string): Promise<void> {
    try {
      await Tts.speak(text);
      console.log('TTS: Speaking -', text);
    } catch (error) {
      console.error('TTS error:', error);
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Tts.stop();
    } catch (error) {
      console.error('Failed to stop TTS:', error);
    }
  }

  startWakeWordDetection(callback: WakeWordCallback): void {
    this.wakeWordCallback = callback;
    
    // Start continuous listening for wake words
    this.startContinuousListening();
  }

  private async startContinuousListening(): Promise<void> {
    try {
      // Start voice recognition for wake word detection
      await Voice.start('ar-SA');
      
      // Set up wake word detection
      Voice.onSpeechResults = (e) => {
        if (e.value && e.value.length > 0) {
          const transcript = e.value[0].toLowerCase();
          
          // Check for wake words
          const wakeWords = ['بسم الله', 'bismillah', 'start recitation', 'begin'];
          const isWakeWord = wakeWords.some(word => transcript.includes(word));
          
          if (isWakeWord && this.wakeWordCallback) {
            this.wakeWordCallback();
          }
        }
      };
    } catch (error) {
      console.error('Failed to start continuous listening:', error);
    }
  }

  stopWakeWordDetection(): void {
    this.wakeWordCallback = null;
    Voice.stop();
  }

  // Voice recognition event handlers
  private onSpeechStart = (e: any) => {
    console.log('Speech started:', e);
    this.lastSpeechTime = Date.now();
  };

  private onSpeechEnd = (e: any) => {
    console.log('Speech ended:', e);
  };

  private onSpeechResults = (e: any) => {
    console.log('Speech results:', e);
    if (e.value && e.value.length > 0) {
      const transcript = e.value[0];
      console.log('Transcribed text:', transcript);
      
      // Process the transcribed text for Quran validation
      this.processTranscribedText(transcript);
    }
  };

  private onSpeechError = (e: any) => {
    console.error('Speech recognition error:', e);
  };

  private processTranscribedText(text: string): void {
    // This would contain logic to:
    // 1. Compare with expected Quran text
    // 2. Detect mistakes
    // 3. Identify pauses
    // 4. Track progress
    
    console.log('Processing transcribed text:', text);
  }

  // Audio level monitoring
  getCurrentAudioLevel(): number {
    return this.currentAudioLevel;
  }

  // Configuration methods
  setSilenceThreshold(threshold: number): void {
    this.silenceThreshold = threshold;
  }

  setMinSilenceDuration(duration: number): void {
    this.minSilenceDuration = duration;
  }

  // Cleanup
  async cleanup(): Promise<void> {
    try {
      await this.stopRecording();
      await this.stopSpeaking();
      this.stopWakeWordDetection();
      this.isInitialized = false;
      console.log('AudioService cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const AudioService = new AudioServiceClass();
