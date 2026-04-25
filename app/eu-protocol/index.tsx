import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtocol } from "@/components/eu-protocol/ProtocolContext";

export default function EuProtocolLanding() {
  const router = useRouter();
  const { savedProtocols, removeProtocol } = useProtocol();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList 
        data={savedProtocols}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
        ListHeaderComponent={
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

            <Pressable
              style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
              onPress={() => router.push("/eu-protocol/datetime")}
            >
              <Text style={styles.buttonText}>Create Protocol</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>

            {savedProtocols.length > 0 && (
              <View style={styles.divider}>
                <Text style={styles.dividerText}>Archived Protocols</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
            onPress={() => router.push(`/eu-protocol/view/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{item.date} • {item.time}</Text>
              <View style={styles.cardActions}>
                <Pressable onPress={() => {
                  Alert.alert("Destroy Protocol", "Are you sure you want to permanently delete this protocol from history?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => removeProtocol(item.id) }
                  ]);
                }}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </Pressable>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              </View>
            </View>
            <Text style={styles.cardName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.cardPlate}>ID: {item.id.toUpperCase()}</Text>
          </Pressable>
        )}
      />
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 24, paddingTop: 40 },
  iconWrapper: { width: 90, height: 90, borderRadius: 26, backgroundColor: "#F4F4F5", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "800", color: "#111111", marginBottom: 16, letterSpacing: 0.3 },
  description: { fontSize: 16, color: "#6E6E73", lineHeight: 24, marginBottom: 40, paddingRight: 20 },
  features: { gap: 16 },
  featureItem: { flexDirection: "row", alignItems: "center" },
  featureIcon: { marginRight: 12 },
  featureText: { fontSize: 16, fontWeight: "600", color: "#111111" },
  buttonWrapper: { marginTop: 40, height: 64, borderRadius: 18, backgroundColor: "#111111", flexDirection: "row", alignItems: "center", justifyContent: "center", shadowColor: "#0E1B2A", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", marginRight: 8 },
  divider: { marginTop: 48, marginBottom: 16, borderTopWidth: 1, borderTopColor: "#F4F4F5", paddingTop: 24 },
  dividerText: { fontSize: 14, fontWeight: "700", color: "#8E8E93", textTransform: "uppercase", letterSpacing: 0.5 },
  card: { backgroundColor: "#F9F9FA", borderRadius: 16, padding: 16, marginHorizontal: 24, marginBottom: 12, borderWidth: 1, borderColor: "#E1E1E6" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardDate: { fontSize: 13, fontWeight: "700", color: "#8E8E93" },
  cardName: { fontSize: 17, fontWeight: "700", color: "#111111", marginBottom: 4 },
  cardPlate: { fontSize: 14, color: "#6E6E73", fontWeight: "500", textTransform: "uppercase" },
});
