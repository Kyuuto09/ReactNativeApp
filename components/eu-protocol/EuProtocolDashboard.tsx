import { StyleSheet, Text, View } from "react-native";

export function EuProtocolDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.kicker}>EU-PROTOCOL</Text>
        <Text style={styles.title}>Module Initialized</Text>
        <Text style={styles.subtitle}>
          This is the foundation for the new EU protocol sub-application. You can build out the features and specialized components in this dedicated directory.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 24,
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
    fontSize: 28,
    lineHeight: 34,
    color: "#111111",
    fontWeight: "700",
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#636366",
    fontWeight: "500",
  },
});
