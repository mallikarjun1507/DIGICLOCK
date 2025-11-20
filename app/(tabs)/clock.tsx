import { Audio } from 'expo-av';
import { Plus } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import useAutoTheme from '../hooks/useAutoTheme';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState<string>('');
  const [alarmSet, setAlarmSet] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmTimeoutRef = useRef<number | null>(null);

  const theme = useAutoTheme();

  //  THEME COLORS
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
        ? '#2e7d32'
        : '#61dafb';

  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const buttonBg =
    theme === 'light'
      ? 'rgba(0,119,182,0.2)'
      : theme === 'green'
        ? 'rgba(46,125,50,0.15)'
        : 'rgba(97,218,251,0.2)';

  //  Update current time
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  //  Alarm sound
  async function playAlarmSound() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm.mp3'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );

      setSound(sound);
      setIsAlarmPlaying(true);
      await sound.playAsync();

      const timeoutId = setTimeout(() => stopAlarmSound(), 45000);
      alarmTimeoutRef.current = Number(timeoutId);
    } catch (error) {
      console.error('🎵 Alarm error:', error);
    }
  }

  async function stopAlarmSound() {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (err) {
        console.error('Error stopping alarm:', err);
      }
      setSound(null);
    }
    setIsAlarmPlaying(false);

    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    if (sound) {
      return () => {
        sound.unloadAsync();
      };
    }
  }, [sound]);


  const parseAlarmTime = (input: string) => {
    const match = input.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;

    let [_, hourStr, minuteStr, period] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (isNaN(hours) || isNaN(minutes) || minutes < 0 || minutes >= 60)
      return null;

    if (period) {
      period = period.toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }

    return { hours, minutes };
  };

  useEffect(() => {
    if (!alarmSet || !alarmTime || !alarmEnabled) return;

    const parsed = parseAlarmTime(alarmTime);
    if (!parsed) return;

    const now = new Date();
    if (
      now.getHours() === parsed.hours &&
      now.getMinutes() === parsed.minutes &&
      now.getSeconds() === 0
    ) {
      playAlarmSound();
      Alert.alert(' Alarm!', `It's ${alarmTime}`);
      setAlarmSet(false);
    }
  }, [time]);

  //  Clock calculations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;
  const clockSize = 300;
  const center = clockSize / 2;
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const numberRadius = clockSize / 2 - 30;
  const highlightDigital = minutes === 0;

  const handleSetAlarm = () => {
    const parsed = parseAlarmTime(alarmTime);
    if (!parsed) {
      Alert.alert('Invalid Input', 'Enter valid time like "07:45 AM" or "19:30".');
      return;
    }

    const now = new Date();
    const alarmDate = new Date();
    alarmDate.setHours(parsed.hours, parsed.minutes, 0, 0);

    if (alarmDate <= now) {
      Alert.alert('Invalid Time', 'Please select a future time.');
      return;
    }

    setAlarmSet(true);
    setAlarmEnabled(true);
    setModalVisible(false);
    Alert.alert(' Alarm Set', `Alarm is set for ${alarmTime}`);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Clock */}
      <View
        style={[
          styles.clock,
          {
            width: clockSize,
            height: clockSize,
            borderRadius: clockSize / 2,
            borderColor: primaryColor,
            backgroundColor:
              theme === 'light'
                ? '#fafafa'  
                : theme === 'green'
                  ? '#ccffcc' 
                  : '#111111', 
          },
        ]}
      >

        {numbers.map((num) => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = center + numberRadius * Math.cos(angle) - 10;
          const y = center + numberRadius * Math.sin(angle) - 10;
          return (
            <Text
              key={num}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                color: textColor,
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {num}
            </Text>
          );
        })}

        {/*  Hands */}
        <View
          style={[
            styles.hand,
            {
              height: clockSize * 0.25,
              backgroundColor: primaryColor,
              top: center - clockSize * 0.25,
              left: center - 4,
              transform: [{ rotate: `${hourDeg}deg` }],
            },
          ]}
        />
        <View
          style={[
            styles.hand,
            {
              height: clockSize * 0.35,
              backgroundColor: textColor,
              top: center - clockSize * 0.35,
              left: center - 3,
              transform: [{ rotate: `${minuteDeg}deg` }],
            },
          ]}
        />
        <View
          style={[
            styles.hand,
            {
              height: clockSize * 0.4,
              backgroundColor: '#ff0000',
              top: center - clockSize * 0.4,
              left: center - 1.5,
              transform: [{ rotate: `${secondDeg}deg` }],
            },
          ]}
        />
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: textColor,
            position: 'absolute',
            top: center - 6,
            left: center - 6,
          }}
        />
      </View>

      {/*  Digital time */}
      <Text
        style={[
          styles.digitalTime,
          {
            color: highlightDigital ? '#ffcc00' : primaryColor,
            fontSize: highlightDigital ? 40 : 32,
          },
        ]}
      >
        {time.toLocaleTimeString()}
      </Text>

      {isAlarmPlaying && (
        <Pressable
          onPress={stopAlarmSound}
          style={{
            marginTop: 20,
            backgroundColor: '#ff3b30',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Stop Alarm</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.fab, { backgroundColor: primaryColor }]}
      >
        <Plus color="#fff" size={28} />
      </Pressable>

      {/*  Alarm Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: buttonBg }]}>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold' }}>
              Set Alarm (HH:MM AM/PM)
            </Text>

            <TextInput
              style={[styles.input, { borderColor: primaryColor, color: textColor }]}
              placeholder="e.g. 07:45 AM"
              placeholderTextColor="#888"
              keyboardType="default"
              maxLength={8}
              value={alarmTime}
              onChangeText={setAlarmTime}
            />

            <View style={{ flexDirection: 'row', marginTop: 15, gap: 10 }}>
              <Pressable
                onPress={handleSetAlarm}
                style={[styles.modalButton, { backgroundColor: primaryColor }]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Set</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: '#888' }]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {alarmSet && (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: buttonBg,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: primaryColor, fontWeight: 'bold', marginRight: 10 }}>
            Alarm set for {alarmTime}
          </Text>
          <Switch
            value={alarmEnabled}
            onValueChange={setAlarmEnabled}
            thumbColor={alarmEnabled ? primaryColor : '#ccc'}
            trackColor={{ false: '#ccc', true: buttonBg }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  clock: {
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  hand: { position: 'absolute', width: 8, borderRadius: 4, transformOrigin: 'center bottom' },
  digitalTime: { marginTop: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    width: 150,
    padding: 8,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 260,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
