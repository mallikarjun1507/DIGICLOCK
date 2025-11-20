import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useTheme } from './hooks/useTheme';

export default function RootLayout() {
  const { scheme, colors } = useTheme(); 

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  //  Custom dynamic theme for navigation
  const CustomTheme =
    scheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: colors.background,
            text: colors.text,
            primary: colors.accent,
            card: '#111',
            border: '#333',
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            text: colors.text,
            primary: colors.accent,
            card: '#fff',
            border: '#ddd',
          },
        };

  return (
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/*  Dynamic Status Bar based on theme */}
      <StatusBar
        style={
          scheme === 'dark'
            ? 'light'
            : scheme === 'green'
            ? 'dark' 
            : 'dark' 
        }
        backgroundColor={colors.background}
      />
    </ThemeProvider>
  );
}
