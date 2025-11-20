import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useAutoTheme from '../hooks/useAutoTheme'; 
export default function HomeScreen() {
  const theme = useAutoTheme();

  // Choose theme styles dynamically
  const backgroundColor =
    theme === 'light' ? '#f2f2f2' : theme === 'green' ? '#e6ffe6' : '#000000';

  const textColor =
    theme === 'light' ? '#0077b6' : theme === 'green' ? '#006400' : '#61dafb';

  const subTextColor = theme === 'dark' ? '#fff' : '#333';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Welcome to Timer App!
      </Text>

      <Text style={[styles.subtitle, { color: subTextColor }]}>
        Use the tabs below to access Clock, Timer, and Stopwatch.
      </Text>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  themeText: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
