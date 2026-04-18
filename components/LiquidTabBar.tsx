import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function LiquidTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* 2. Main Glass Mask (Clips everything to the pill shape) */}
      <View style={styles.glassContainer}>
        {/* Layer 1: Base Frosted Blur (Simulates light passing through dense material) */}
        <BlurView
          intensity={20}
          tint="extraLight"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />

        {/* Layer 2: Light Refraction Gradient 
            Adds realism by showing light gathering at the top and bottom rims 
            while keeping the center purely frosted. */}
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.45)",
            "rgba(255, 255, 255, 0.05)",
            "rgba(255, 255, 255, 0.02)",
            "rgba(255, 255, 255, 0.25)",
          ]}
          locations={[0, 0.2, 0.8, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Layer 3: Glossy Liquid Reflection
            A focused, highly-transparent white pill at the very top edge 
            to simulate a physical, polished glass bump reflecting ambient light. */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 0)"]}
          locations={[0, 1]}
          style={styles.glossHighlight}
        />

        {/* Layer 4: Hard Bevel / Inner Edge 
            Provides the structural "thickness" of the glass casing to the user's eye. */}
        <View style={styles.innerBorder} />

        {/* Layer 5: Tab Interactive Content */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabBarItem
                key={route.key}
                route={route}
                options={options}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

function TabBarItem({ route, options, isFocused, onPress }: any) {
  // Reanimated physics for smooth, buttery interactions
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);

  useEffect(() => {
    // Elegant spring physics on selection
    scale.value = withSpring(isFocused ? 1.08 : 1, {
      damping: 14,
      stiffness: 280,
    });
    // Smooth opacity fade
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 250 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : route.name;

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {options.tabBarIcon &&
          options.tabBarIcon({
            focused: isFocused,
            color: isFocused ? "#111111" : "#76767A",
            size: 24,
          })}
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? "#111111" : "#76767A" },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    height: 72,
    borderRadius: 36,
    // Layer 0: Deep Exterior Shadow for pure float elevation (iOS only; Android struggles with transparent shadows)
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
  },
  glassContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    overflow: "hidden", // Clamps blurs and gradients perfectly to edges
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Bare minimum tint base
  },
  glossHighlight: {
    position: "absolute",
    top: 0,
    left: "12%",
    right: "12%",
    height: 14,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    opacity: 0.85,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255,255,255,0.8)",
  },
  tabsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.2,
  },
});
