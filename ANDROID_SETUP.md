# Android Setup Guide

This guide will help you set up the Android development environment for the Quran Recitation App.

## Prerequisites

### 1. Install Android Studio
1. Download Android Studio from: https://developer.android.com/studio
2. Install Android Studio with default settings
3. Open Android Studio and complete the setup wizard

### 2. Set up Android SDK
1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. Install the following:
   - **Android SDK Platform 33** (Android 13)
   - **Android SDK Build-Tools 33.0.0**
   - **Android SDK Platform-Tools**
   - **Android SDK Tools**
   - **Android Emulator**

### 3. Set Environment Variables
Add these to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Java (if not already set)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.jdk/Contents/Home
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### 4. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Go to **Tools** → **AVD Manager**
3. Click **Create Virtual Device**
4. Choose **Phone** → **Pixel 4** (or any device)
5. Download **API Level 33** (Android 13) if not already downloaded
6. Click **Next** → **Finish**

## Running the App

### Option 1: With Emulator
1. Start your AVD from Android Studio
2. Run the app:
   ```bash
   npm run android
   ```

### Option 2: With Physical Device
1. Enable **Developer Options** on your Android device:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
2. Enable **USB Debugging**:
   - Go to **Settings** → **Developer Options**
   - Enable **USB Debugging**
3. Connect your device via USB
4. Run the app:
   ```bash
   npm run android
   ```

### Option 3: Build APK Only
```bash
./build-android.sh
```

## Troubleshooting

### Common Issues

1. **"ANDROID_HOME not set"**
   - Make sure you've set the environment variables correctly
   - Restart your terminal after setting them

2. **"No devices found"**
   - Make sure your emulator is running or device is connected
   - Check `adb devices` to see connected devices

3. **"Gradle build failed"**
   - Make sure you have the correct Android SDK versions installed
   - Try cleaning the project: `cd android && ./gradlew clean`

4. **"Metro bundler not found"**
   - The metro.config.js file has been created
   - Try running `npx react-native start` first

### Verification Commands

Check if everything is set up correctly:

```bash
# Check Android SDK
echo $ANDROID_HOME

# Check connected devices
adb devices

# Check Java version
java -version

# Check React Native setup
npx react-native doctor
```

## Next Steps

Once the environment is set up:

1. **Start Metro bundler** (in one terminal):
   ```bash
   npx react-native start
   ```

2. **Run the app** (in another terminal):
   ```bash
   npm run android
   ```

The app should now build and run on your Android device or emulator!

## Features to Test

- 🚴‍♂️ **Bike Mode**: Say "Bismillah" to start recording
- 🎤 **Voice Recognition**: Test Arabic speech recognition
- 📊 **Progress Tracking**: Check session statistics
- ⚙️ **Settings**: Configure app preferences
- 🔊 **Audio Feedback**: Test voice guidance

---

**Note**: This app is specifically designed for Android and includes bike-friendly features for hands-free Quran recitation while cycling.
