A modern, minimal, and smooth Timer App built using Expo SDK 54, React Native, and Expo Router.
The app includes features like animated timers, haptic feedback, custom wheel pickers, and a clean UI optimized for Android devices.

 #Features

 Start, Pause & Reset Timer

 Beautiful UI with gradients & blur effects

 Wheel Picker for hours, minutes, seconds

 Haptics feedback (expo-haptics)

 Smooth animations (Reanimated v4)

 Safe-area & gesture handler support

 Android adaptive icon support

 Light & Dark mode ready

 Background timer support (optional)

 #Tech Stack
Category	      Technology

Framework	   Expo SDK 54, React Native 0.81
Navigation	   Expo Router (v6)
Animations	   react-native-reanimated v4
UI	            expo-linear-gradient, expo-blur, lucide-react-native
Device APIs 	expo-notifications, expo-haptics, expo-device
Picker	      react-native-wheel-picker-expo
Icons        	@expo/vector-icons, Lucide Icons
Build Tools  	EAS Build, Gradle (for local APK)


#Installation
1. Clone the repository
  git clone https://github.com/mallikarjun1507/DIGICLOCK.git

   cd DIGICLOCK

# 2. Install dependencies
   npm install

#3. Start the app
   npx expo start

   Scan the QR with Expo Go

  # Building the APK

   npm install -g eas-cli
   eas build:configure
   eas build -p android --profile preview

