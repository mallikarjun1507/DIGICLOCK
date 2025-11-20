import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme'; 

export default function TabsLayout() {
  const { scheme, colors } = useTheme();

  //  Define icon color sets based on theme
  const iconColors = {
    light: {
      active: '#0077b6',   
      inactive: '#666666',
    },
    green: {
      active: '#2e7d32',   
      inactive: '#6ea96e',
    },
    dark: {
      active: '#61dafb',  
      inactive: '#aaaaaa',
    },
  };

  const themeIcons = iconColors[scheme] || iconColors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeIcons.active,
        tabBarInactiveTintColor: themeIcons.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: scheme === 'dark' ? '#333' : '#ccc',
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={focused ? themeIcons.active : themeIcons.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="clock"
        options={{
          title: 'Clock',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="time"
              size={size}
              color={focused ? themeIcons.active : themeIcons.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="timer"
              size={size}
              color={focused ? themeIcons.active : themeIcons.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stopwatch"
        options={{
          title: 'Stopwatch',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="stopwatch"
              size={size}
              color={focused ? themeIcons.active : themeIcons.inactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
