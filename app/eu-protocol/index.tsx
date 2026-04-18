import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EuProtocolLanding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Ionicons name="document-text" size={56} color="#111111" />
        </View>
        <Text style={styles.title}>EU Protocol{"\n"}Reporting</Text>
        <Text style={styles.description}>
          Fast and secure accident reporting online. 
          The process takes less than 10 minutes.
        </Text>

        <View style={styles.features}>
          <FeatureItem icon="shield-checkmark" text="Legally binding document" />
          <FeatureItem icon="flash" text="No police required" />
          <FeatureItem icon="copy" text="Convenient autofill" />
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.buttonWrapper,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/eu-protocol/datetime")}
      >
        <Text style={styles.buttonText}>Create Protocol</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={20} color="#111111" style={styles.featureIcon} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: "#6E6E73",
    lineHeight: 24,
    marginBottom: 40,
    paddingRight: 20,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
  buttonWrapper: {
    marginHorizontal: 24,
    marginBottom: 130, // Elevated elegantly safely above the bottom tab bar
    height: 64,
    borderRadius: 18,
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
});
