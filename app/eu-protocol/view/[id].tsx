import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { useProtocol } from "@/components/eu-protocol/ProtocolContext";

export default function ViewProtocolScreen() {
  const { id } = useLocalSearchParams();
  const { savedProtocols } = useProtocol();

  const protocol = savedProtocols.find((p) => p.id === id);

  if (!protocol) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Protocol not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Protocol {protocol.id.toUpperCase()}</Text>
        <Text style={styles.headerBadge}>VERIFIED</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accident Info</Text>
        <DetailRow label="Date" value={protocol.date} />
        <DetailRow label="Time" value={protocol.time} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driver Data</Text>
        <DetailRow label="Name" value={`${protocol.firstName} ${protocol.lastName}`} />
        <DetailRow label="Phone" value={protocol.phone} />
        <DetailRow label="Date of Birth" value={protocol.dob} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle & License</Text>
        <DetailRow label="Plate Number" value={protocol.licensePlate} />
        <DetailRow label="License No" value={protocol.licenseNumber} />
        <DetailRow label="Category" value={protocol.category} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Damage Assessment</Text>
        <DetailRow label="Impact Side" value={protocol.impactSide} />
        <View style={styles.detailBox}>
          <Text style={styles.detailBoxText}>{protocol.description}</Text>
        </View>
        {protocol.photoUri && (
          <Image source={{ uri: protocol.photoUri }} style={styles.photo} />
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 24, paddingBottom: 100 },
  notFound: { fontSize: 18, color: "#8E8E93", textAlign: "center", marginTop: 40 },
  headerBlock: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111111", letterSpacing: -0.5 },
  headerBadge: { fontSize: 12, fontWeight: "800", color: "#34C759", backgroundColor: "rgba(52, 199, 89, 0.15)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, overflow: "hidden" },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#8E8E93", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F4F4F5" },
  rowLabel: { fontSize: 16, color: "#6E6E73", fontWeight: "500" },
  rowValue: { fontSize: 17, color: "#111111", fontWeight: "700" },
  detailBox: { backgroundColor: "#F4F4F5", padding: 18, borderRadius: 14, marginTop: 12 },
  detailBoxText: { fontSize: 16, color: "#111111", lineHeight: 24, fontWeight: "500" },
  photo: { width: "100%", height: 260, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: "#E1E1E6" }
});
