import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from '../context/AuthContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0066cc',
    accent: '#10b981',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="home" options={{ title: "Home" }} />
          <Stack.Screen name="billgeneration" options={{ title: "Generate Bill" }} />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
