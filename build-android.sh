#!/bin/bash

# Build script for Android-only Quran Recitation App

echo "🚀 Building Quran Recitation App for Android..."

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please set up the Android SDK."
    echo "   See ANDROID_SETUP.md for detailed instructions."
    echo "   Quick fix: export ANDROID_HOME=\$HOME/Library/Android/sdk"
    exit 1
fi

if ! command -v adb &> /dev/null; then
    echo "❌ Android SDK tools not found in PATH."
    echo "   Make sure to add Android SDK tools to your PATH."
    echo "   See ANDROID_SETUP.md for detailed instructions."
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java JDK."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Metro bundler in background
echo "🔄 Starting Metro bundler..."
npx react-native start &
METRO_PID=$!

# Wait a moment for Metro to start
sleep 5

# Build the app
echo "🔨 Building Android APK..."
cd android

# Create a simple gradle wrapper if it doesn't exist
if [ ! -f "gradlew" ]; then
    echo "Creating Gradle wrapper..."
    # This is a simplified approach - in a real project you'd use gradle wrapper
    echo "Please run: cd android && gradle wrapper"
    echo "Then run this script again."
    exit 1
fi

# Try to build
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo "❌ Build failed. Check the error messages above."
fi

# Stop Metro bundler
kill $METRO_PID 2>/dev/null

echo "🎉 Build process completed!"
