import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import useAutoTheme from "../hooks/useAutoTheme"; 

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

export default function TimerScreen() {
  const theme = useAutoTheme(); 

  //  Theme colors
  const backgroundColor =
    theme === "light"
      ? "#f2f2f2"
      : theme === "green"
      ? "#e6ffe6"
      : "#000000";

  const primaryColor =
    theme === "light"
      ? "#0077b6"
      : theme === "green"
      ? "#006400"
      : "#61dafb";

  const textColor = theme === "dark" ? "#fff" : "#000";
  const buttonBg =
    theme === "light"
      ? "rgba(0,119,182,0.2)"
      : theme === "green"
      ? "rgba(0,128,0,0.15)"
      : "rgba(97,218,251,0.2)";

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(hours * 3600 + minutes * 60 + seconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
  };

  useEffect(() => {
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const renderWheelItem = (item: number, selected: number) => (
    <View style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: item === selected ? 28 : 20,
          color:
            item === selected
              ? primaryColor
              : theme === "dark"
              ? "#888"
              : "#444",
          fontWeight: item === selected ? "bold" : "normal",
          opacity: item === selected ? 1 : 0.6,
        }}
      >
        {item.toString().padStart(2, "0")}
      </Text>
    </View>
  );

  const hoursRef = useRef<FlatList>(null);
  const minutesRef = useRef<FlatList>(null);
  const secondsRef = useRef<FlatList>(null);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: primaryColor }]}>Timer</Text>

      {/* Scrollable Pickers */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <FlatList
          ref={hoursRef}
          data={Array.from({ length: 24 }, (_, i) => i)}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
            setHours(index);
          }}
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width: 80 }}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          renderItem={({ item }) => renderWheelItem(item, hours)}
        />

        <FlatList
          ref={minutesRef}
          data={Array.from({ length: 60 }, (_, i) => i)}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
            setMinutes(index);
          }}
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width: 80 }}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          renderItem={({ item }) => renderWheelItem(item, minutes)}
        />

        <FlatList
          ref={secondsRef}
          data={Array.from({ length: 60 }, (_, i) => i)}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
            setSeconds(index);
          }}
          style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width: 80 }}
          contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          renderItem={({ item }) => renderWheelItem(item, seconds)}
        />
      </View>

      {/* Timer Display */}
      <Text style={[styles.time, { color: textColor }]}>
        {formatTime(timeLeft)}
      </Text>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={startTimer}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={stopTimer}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBg }]}
          onPress={resetTimer}
        >
          <Text style={[styles.buttonText, { color: primaryColor }]}>Reset</Text>
        </TouchableOpacity>
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  time: { fontSize: 42, fontWeight: "bold", marginBottom: 15 },
  buttons: { flexDirection: "row", marginTop: 10 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
