import { Stack } from "expo-router";
import { useState } from 'react';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';
import "./globals.css";

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const handleAnimationFinish = () => {
    setShowCustomSplash(false);
  };

  if (showCustomSplash) {
    return (
      <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />
    );
  }

  return (
    <>
      {/* <StatusBar hidden={true} /> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="profiles/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="series/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="other/upcoming-series" options={{ headerShown: false }} />

      </Stack>
    </>
  );
}
