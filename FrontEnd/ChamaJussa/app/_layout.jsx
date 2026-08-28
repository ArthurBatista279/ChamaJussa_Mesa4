import React from "react";
import { Stack, Redirect, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "../src/context/AppContext";

function RootLayoutNav() {
  const { autenticado } = useApp();
  const segments = useSegments();

  const inAuthGroup = segments[0] === "login"; 

  return (
    <>
      <StatusBar style="dark" />
      {/* Redirect declarativo — seguro no render cycle do expo-router */}
      {!autenticado && !inAuthGroup && <Redirect href="/login" />}
      {autenticado && inAuthGroup && <Redirect href="/" />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="detalhes/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </SafeAreaProvider>
  );
}

