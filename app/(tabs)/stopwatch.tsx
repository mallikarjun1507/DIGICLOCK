import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import useAutoTheme from '../hooks/useAutoTheme'; // 👈 Import the same theme hook

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}:${String(milliseconds).padStart(2, '0')}`;
};

export default function StopwatchScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const theme = useAutoTheme(); 

  // Theme-based colors
  const backgroundColor =
    theme === 'light'
      ? '#f2f2f2'
      : theme === 'green'
      ? '#e6ffe6'
      : '#000000';

  const primaryColor =
    theme === 'light'
      ? '#0077b6'
      : theme === 'green'
      ? '#006400'
      : '#61dafb';

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const buttonBg =
    theme === 'light'
      ? 'rgba(0,119,182,0.2)'
      : theme === 'green'
      ? 'rgba(0,128,0,0.15)'
      : 'rgba(97,218,251,0.2)';

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10) as unknown as number;
    }
  };

  const stopStopwatch = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    stopStopwatch();
    setTime(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryColor }]}>Stopwatch</Text>

      <Text style={[styles.time, { color: textColor }]}>
        {formatTime(time)}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={startStopwatch}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            Start
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={stopStopwatch}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            Stop
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={resetStopwatch}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  time: { fontSize: 52, fontWeight: 'bold', marginBottom: 20 },
  buttons: { flexDirection: 'row', marginTop: 10 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 6,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
