import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { LiquidTabBar } from "@/components/LiquidTabBar";

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="todos"
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="eu-protocol"
        options={{
          title: "EU Protocol",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "planet" : "planet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: "To-do",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Personality Test",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "sparkles" : "sparkles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
