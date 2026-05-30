import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Required to smoothly animate text on the native thread without JS bridge latency
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function AnimationsScreen() {
  const progress = useSharedValue(0);
  const targetRef = useRef(0);

  const handleNext = () => {
    // We use a strict target reference to prevent mid-flight physics values from over-stacking past 100%
    targetRef.current = targetRef.current >= 100 ? 0 : targetRef.current + 25;
    
    progress.value = withSpring(targetRef.current, {
      damping: 16,
      stiffness: 90,
      mass: 1,
    });
  };

  const animatedProgressStyle = useAnimatedStyle(() => {
    // Because progress.value interpolates on every frame, the color organically glides
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 25, 50, 75, 100],
      ["#E5E5EA", "#34C759", "#32ADE6", "#FFCC00", "#FF3B30"]
    );

    return {
      width: `${Math.max(0, Math.min(100, progress.value))}%`,
      backgroundColor,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(progress.value)}%`,
      defaultValue: `${Math.round(progress.value)}%`,
    } as any;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient
        colors={["#F9FBFF", "#F0F4FB", "#EEF3F9"]}
        locations={[0, 0.45, 1]}
        style={styles.bgGradient}
      />
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>ANIMATIONS</Text>
          <Text style={styles.title}>Reanimated Progress</Text>
          <Text style={styles.subtitle}>
            A smoothly interpolating progress bar built with React Native Reanimated.
          </Text>
        </View>

        <View style={styles.interactivePanel}>
          <Text style={styles.panelTitle}>Interactive Component</Text>
          <Text style={styles.panelDescription}>
            Look at the color smoothly interpolating from green to red (lorem)
          </Text>

          {/* Progress Bar Container */}
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}>
              <AnimatedTextInput
                underlineColorAndroid="transparent"
                editable={false}
                animatedProps={animatedTextProps}
                style={styles.progressText}
              />
            </Animated.View>
          </View>

          {/* Action Button */}
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Trigger Progress</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF3F9",
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  headerCard: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    color: "#111111",
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#636366",
    fontWeight: "500",
  },
  interactivePanel: {
    padding: 24,
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.5)",
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  panelDescription: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
    marginBottom: 32,
  },
  progressBarBackground: {
    width: "100%",
    height: 40,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  progressBarFill: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },
  progressText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
  nextButton: {
    backgroundColor: "#111111",
    borderRadius: 18,
    paddingVertical: 18,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    shadowColor: "#111111",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  nextButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
