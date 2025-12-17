# Quran Recitation App - Bike Mode

A React Native mobile application designed for hands-free Quran recitation while cycling. The app features voice recognition, audio feedback, and bike-friendly interface design.

## Features

### 🚴‍♂️ Bike Mode
- **Hands-free operation** with voice commands
- **Wake word detection** ("Bismillah" activation)
- **Voice feedback** for guidance and encouragement
- **Vibration alerts** for mistakes and pauses
- **Auto-advance verses** for continuous recitation

### 🎯 Recitation Features
- **Real-time audio processing** with pause and mistake detection
- **Accuracy tracking** with detailed statistics
- **Session management** with progress tracking
- **Multiple recitation modes** (practice, bike, guided)
- **Arabic text support** with transliteration and translation

### 📊 Progress Tracking
- **Session history** with detailed analytics
- **Achievement system** with milestones
- **Performance metrics** (accuracy, speed, consistency)
- **Export functionality** for data backup

### ⚙️ Customization
- **Adjustable sensitivity** for pause and mistake detection
- **Audio quality settings** (low, medium, high)
- **Language preferences** (Arabic, English)
- **Voice feedback options** with customizable reciter

## Technical Stack

- **React Native** 0.72.6
- **TypeScript** for type safety
- **React Navigation** for screen navigation
- **React Native Paper** for UI components
- **React Native Vector Icons** for icons
- **React Native Linear Gradient** for gradients
- **AsyncStorage** for local data persistence

### Audio Processing
- **@react-native-voice/voice** for speech recognition
- **react-native-tts** for text-to-speech
- **react-native-sound** for audio playback
- **react-native-audio-recorder-player** for recording

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   ├── StatusIndicator.tsx
│   └── index.ts
├── context/            # React Context for state management
│   └── BikeModeContext.tsx
├── screens/            # Main application screens
│   ├── BikeModeScreen.tsx
│   ├── SettingsScreen.tsx
│   └── ProgressScreen.tsx
├── services/           # Business logic and API services
│   ├── AudioService.ts
│   └── QuranDatabase.ts
├── types/              # TypeScript type definitions
│   └── RecitationTypes.ts
└── utils/              # Utility functions and constants
    ├── constants.ts
    ├── helpers.ts
    └── index.ts
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuranAppMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Android Setup**
   - Follow the detailed guide in [ANDROID_SETUP.md](./ANDROID_SETUP.md)
   - Install Android Studio and set up Android SDK
   - Set ANDROID_HOME environment variable
   - Create an Android Virtual Device (AVD) or connect a physical device

4. **Run the application**
   ```bash
   # Android (with emulator/device connected)
   npm run android
   
   # Or build APK directly
   ./build-android.sh
   ```

## Configuration

### Permissions
The app requires the following permissions:
- **Microphone** - for voice recognition and recording
- **Storage** - for saving session data and audio files
- **Wake Lock** - for background operation during cycling

### Audio Settings
- **Sample Rate**: 44.1kHz
- **Channels**: Mono
- **Bit Depth**: 16-bit
- **Silence Threshold**: -40dB
- **Min Silence Duration**: 1.0 seconds

## Usage

### Starting a Recitation Session
1. Open the app and navigate to Bike Mode
2. Say "Bismillah" or tap the Start button
3. Begin reciting the displayed verse
4. The app will provide real-time feedback

### Voice Commands
- **"Bismillah"** - Start recording
- **"Stop"** - End current session
- **"Next"** - Skip to next verse
- **"Repeat"** - Replay current verse

### Settings Configuration
- Adjust pause detection sensitivity (1-10)
- Configure mistake detection threshold (1-10)
- Select preferred audio quality
- Enable/disable voice feedback and vibrations

## Development

### Code Style
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Functional components** with hooks

### Testing
```bash
npm test
```

### Building
```bash
# Android Release
npm run build:android

# Clean build
npm run clean

# Build with custom script
./build-android.sh
```

## Security Considerations

This app follows security best practices:
- **No hardcoded credentials** or sensitive data
- **Local data storage** with AsyncStorage
- **Permission-based access** to device features
- **Input validation** for all user inputs
- **Error handling** with user-friendly messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## Roadmap

### Upcoming Features
- [ ] Cloud synchronization
- [ ] Multiple reciter voices
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Offline mode improvements
- [ ] Android Auto integration
- [ ] Wear OS support

### Performance Improvements
- [ ] Audio processing optimization
- [ ] Memory usage optimization
- [ ] Battery life improvements
- [ ] Faster startup time

---

**Note**: This app is designed specifically for bike riding scenarios. Always prioritize safety while cycling and use the app responsibly.
