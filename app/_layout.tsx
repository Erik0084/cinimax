import { Stack } from "expo-router";
import "./globals.css";

export default async function RootLayout() {
  return (
    <>
      {/* <StatusBar hidden={true} /> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="profiles/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="series/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
