import { Stack } from "expo-router";

export default function EuProtocolLayout() {
  return (
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
    </Stack>
  );
}
