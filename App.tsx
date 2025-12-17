/**
 * Quran Recitation App - Main Mobile App Component
 * Bike-friendly Android app for Quran recitation
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import our custom components
import BikeModeScreen from './src/screens/BikeModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import { AudioService } from './src/services/AudioService';
import { QuranDatabase } from './src/services/QuranDatabase';
import { BikeModeProvider } from './src/context/BikeModeContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      await requestPermissions();
      
      // Initialize services
      await AudioService.initialize();
      await QuranDatabase.initialize();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert('Initialization Error', 'Failed to initialize the app. Please restart.');
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WAKE_LOCK,
        PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allGranted) {
        setPermissionsGranted(true);
      } else {
        Alert.alert(
          'Permissions Required',
          'This app needs microphone and storage permissions to work properly.',
          [{ text: 'OK', onPress: () => requestPermissions() }]
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  if (!permissionsGranted || !isInitialized) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Icon name="mic" size={80} color="#2E7D32" />
          <Text style={styles.loadingTitle}>Quran Recitation App</Text>
          <Text style={styles.loadingSubtitle}>
            {!permissionsGranted ? 'Requesting permissions...' : 'Initializing...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider>
      <BikeModeProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
          <Stack.Navigator
            initialRouteName="BikeMode"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2E7D32',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="BikeMode"
              component={BikeModeScreen}
              options={{
                title: '🚴‍♂️ Bike Mode',
                headerLeft: () => (
                  <Icon name="bike" size={24} color="#fff" style={{ marginLeft: 16 }} />
                ),
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                title: '⚙️ Settings',
              }}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{
                title: '📊 Progress',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BikeModeProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default App;
