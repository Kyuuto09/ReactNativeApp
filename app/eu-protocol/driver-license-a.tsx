import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Alert,
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableWithoutFeedback, 
  View 
} from "react-native";

import { useProtocol } from "@/components/eu-protocol/ProtocolContext";
import { maskDate } from "@/components/eu-protocol/formatters";

export default function DriverLicenseAScreen() {
  const router = useRouter();
  const { draftProtocol, updateDraft } = useProtocol();

  const [licenseNumber, setLicenseNumber] = useState(draftProtocol.licenseNumber || "");
  const [category, setCategory] = useState(draftProtocol.category || "");
  const [validUntil, setValidUntil] = useState(draftProtocol.validUntil || "");

  const onNext = () => {
    if (!licenseNumber.trim() || !category.trim() || !validUntil.trim()) {
      Alert.alert("Missing Information", "Please fill in all license details.");
      return;
    }
    if (validUntil.length < 10) {
      Alert.alert("Invalid Date", "Please enter a fully formatted expiration date (DD.MM.YYYY).");
      return;
    }
    updateDraft({ licenseNumber, category, validUntil });
    router.push("/eu-protocol/damage-type");
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Driver License</Text>
          <Text style={styles.subtitle}>
            Enter the details of the driving license for Participant A.
          </Text>

          <View style={styles.form}>
            <InputField 
              label="License Number" 
              icon="card-outline" 
              placeholder="e.g. BXA 123456" 
              value={licenseNumber} 
              onChangeText={setLicenseNumber} 
              autoCapitalize="characters"
            />
            <InputField 
              label="Category" 
              icon="car-sport-outline" 
              placeholder="e.g. B, C1" 
              value={category} 
              onChangeText={setCategory} 
              autoCapitalize="characters"
            />
            <InputField 
              label="Valid Until" 
              icon="calendar-outline" 
              placeholder="DD.MM.YYYY" 
              value={validUntil} 
              onChangeText={(t: string) => setValidUntil(maskDate(t))} 
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]} 
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, icon, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#8E8E93" style={styles.icon} />
        <TextInput 
          style={styles.input} 
          placeholderTextColor="#9A9AA0"
          {...props} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { padding: 24, paddingBottom: 160 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#111111", marginBottom: 10, marginTop: 10, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#6E6E73", marginBottom: 40, lineHeight: 22 },
  form: { marginBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "700", color: "#111111", marginBottom: 8, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#F4F4F5", borderRadius: 14, borderWidth: 1, borderColor: "#E1E1E6", paddingHorizontal: 16, height: 56 },
  icon: { marginRight: 14 },
  input: { flex: 1, fontSize: 17, color: "#111111", fontWeight: "600", letterSpacing: 0.5 },
  nextButton: { backgroundColor: "#111111", height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", shadowColor: "#0E1B2A", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  pressed: { opacity: 0.85 },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
});
