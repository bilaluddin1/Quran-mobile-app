#!/bin/bash

# Quick Start Script for Quran Recitation App
# This script assumes Android Studio and SDK are already set up

echo "🚀 Quick Start - Quran Recitation App"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Metro is already running
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Metro bundler is already running"
else
    echo "🔄 Starting Metro bundler..."
    npx react-native start &
    METRO_PID=$!
    sleep 3
fi

# Check for connected devices
echo "📱 Checking for connected devices..."
DEVICES=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)

if [ $DEVICES -eq 0 ]; then
    echo "⚠️  No Android devices or emulators found"
    echo "   Please:"
    echo "   1. Start an Android emulator, OR"
    echo "   2. Connect an Android device with USB debugging enabled"
    echo ""
    echo "   Then run: npm run android"
else
    echo "✅ Found $DEVICES connected device(s)"
    echo "🚀 Starting the app..."
    npm run android
fi

echo ""
echo "🎉 Setup complete! The app should be building now."
echo ""
echo "📚 Next steps:"
echo "   - Test the bike mode by saying 'Bismillah'"
echo "   - Check the settings screen for configuration"
echo "   - View your progress in the progress screen"
echo ""
echo "📖 For detailed setup instructions, see ANDROID_SETUP.md"


