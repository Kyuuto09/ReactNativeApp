import { Stack } from "expo-router";

import { ProtocolProvider } from "@/components/eu-protocol/ProtocolContext";

export default function EuProtocolLayout() {
  return (
    <ProtocolProvider>
      <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#111111",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Main",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="datetime" 
        options={{ 
          title: "Step 1 of 4",
          headerBackTitle: " ",
        }} 
      />
      <Stack.Screen 
        name="participant-a" 
        options={{ 
          title: "Step 2 of 4",
          headerBackTitle: " ",
        }} 
      />
      <Stack.Screen 
        name="driver-license-a" 
        options={{ 
          title: "Step 3 of 4",
          headerBackTitle: " ",
        }} 
      />
      <Stack.Screen 
        name="damage-type" 
        options={{ 
          title: "Step 4 of 4",
          headerBackTitle: " ",
        }} 
      />
      <Stack.Screen 
        name="view/[id]" 
        options={{ 
          title: "Protocol Record",
          headerBackTitle: " ",
        }} 
      />
    </Stack>
    </ProtocolProvider>
  );
}
