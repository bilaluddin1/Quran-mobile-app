/**
 * Settings Screen - Configuration for bike mode and app preferences
 * Allows users to customize their recitation experience
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useBikeMode, BikeModeSettings } from '../context/BikeModeContext';

const { width } = Dimensions.get('window');

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings, clearSessionHistory } = useBikeMode();
  const [localSettings, setLocalSettings] = useState<BikeModeSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof BikeModeSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Session History',
      'Are you sure you want to clear all your recitation session history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearSessionHistory();
            Alert.alert('Success', 'Session history has been cleared.');
          },
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    title: string;
    description: string;
    icon: string;
    children: React.ReactNode;
  }> = ({ title, description, icon, children }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <Icon name={icon} size={24} color="#2E7D32" style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <View style={styles.settingControl}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio Settings</Text>
          
          <SettingItem
            title="Voice Feedback"
            description="Get audio feedback during recitation"
            icon="volume-up"
          >
            <Switch
              value={localSettings.voiceFeedbackEnabled}
              onValueChange={(value) => handleSettingChange('voiceFeedbackEnabled', value)}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={localSettings.voiceFeedbackEnabled ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem
            title="Audio Quality"
            description="Choose audio recording quality"
            icon="high-quality"
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={localSettings.audioQuality}
                onValueChange={(value) => handleSettingChange('audioQuality', value)}
                style={styles.picker}
              >
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
          </SettingItem>

          <SettingItem
            title="Preferred Reciter"
            description="Select your preferred reciter voice"
            icon="record-voice-over"
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={localSettings.preferredReciter}
                onValueChange={(value) => handleSettingChange('preferredReciter', value)}
                style={styles.picker}
              >
                <Picker.Item label="Default" value="default" />
                <Picker.Item label="Male Voice" value="male" />
                <Picker.Item label="Female Voice" value="female" />
              </Picker>
            </View>
          </SettingItem>
        </View>

        {/* Interaction Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interaction Settings</Text>
          
          <SettingItem
            title="Wake Word Detection"
            description="Enable voice activation with 'Bismillah'"
            icon="mic"
          >
            <Switch
              value={localSettings.wakeWordEnabled}
              onValueChange={(value) => handleSettingChange('wakeWordEnabled', value)}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={localSettings.wakeWordEnabled ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem
            title="Vibration Feedback"
            description="Get haptic feedback for events"
            icon="vibration"
          >
            <Switch
              value={localSettings.vibrationEnabled}
              onValueChange={(value) => handleSettingChange('vibrationEnabled', value)}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={localSettings.vibrationEnabled ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>

          <SettingItem
            title="Auto Advance Verses"
            description="Automatically move to next verse"
            icon="skip-next"
          >
            <Switch
              value={localSettings.autoAdvanceVerses}
              onValueChange={(value) => handleSettingChange('autoAdvanceVerses', value)}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={localSettings.autoAdvanceVerses ? '#fff' : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Detection Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detection Sensitivity</Text>
          
          <SettingItem
            title="Pause Detection"
            description={`Sensitivity: ${localSettings.pauseDetectionSensitivity}/10`}
            icon="pause-circle-filled"
          >
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.max(1, localSettings.pauseDetectionSensitivity - 1);
                  handleSettingChange('pauseDetectionSensitivity', newValue);
                }}
              >
                <Icon name="remove" size={20} color="#2E7D32" />
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{localSettings.pauseDetectionSensitivity}</Text>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.min(10, localSettings.pauseDetectionSensitivity + 1);
                  handleSettingChange('pauseDetectionSensitivity', newValue);
                }}
              >
                <Icon name="add" size={20} color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </SettingItem>

          <SettingItem
            title="Mistake Detection"
            description={`Sensitivity: ${localSettings.mistakeDetectionSensitivity}/10`}
            icon="error-outline"
          >
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.max(1, localSettings.mistakeDetectionSensitivity - 1);
                  handleSettingChange('mistakeDetectionSensitivity', newValue);
                }}
              >
                <Icon name="remove" size={20} color="#2E7D32" />
              </TouchableOpacity>
              <Text style={styles.sliderValue}>{localSettings.mistakeDetectionSensitivity}</Text>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.min(10, localSettings.mistakeDetectionSensitivity + 1);
                  handleSettingChange('mistakeDetectionSensitivity', newValue);
                }}
              >
                <Icon name="add" size={20} color="#2E7D32" />
              </TouchableOpacity>
            </View>
          </SettingItem>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Settings</Text>
          
          <SettingItem
            title="Interface Language"
            description="Choose your preferred language"
            icon="language"
          >
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={localSettings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
                style={styles.picker}
              >
                <Picker.Item label="العربية (Arabic)" value="ar" />
                <Picker.Item label="English" value="en" />
              </Picker>
            </View>
          </SettingItem>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleClearHistory}>
            <Icon name="delete-forever" size={24} color="#F44336" />
            <Text style={styles.actionButtonText}>Clear Session History</Text>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.01.01</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
  settingControl: {
    marginLeft: 12,
  },
  pickerContainer: {
    width: 120,
    height: 40,
  },
  picker: {
    height: 40,
    width: 120,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#F44336',
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
});

export default SettingsScreen;
