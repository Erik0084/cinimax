import { DownloadProvider } from '@/contexts/DownloadContext';
import AnimatedSplashScreen from '@components/layout/AnimatedSplashScreen';
import { Stack } from "expo-router";
import { useState } from 'react';
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
    <DownloadProvider>
      {/* <StatusBar hidden={true} /> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="media/movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/user" options={{ headerShown: false }} />
        <Stack.Screen name="media/profiles/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="media/player/offline/[filePath]" options={{ headerShown: false }} />
        <Stack.Screen name="features/other/see-all" options={{ headerShown: false }} />
        <Stack.Screen name="media/series/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="features/other/upcoming-series" options={{ headerShown: false }} />
        <Stack.Screen name="features/other/genre" options={{ headerShown: false }} />
        <Stack.Screen name="features/other/whislist" options={{ headerShown: false }} />
      </Stack>
    </DownloadProvider>
  );
}
