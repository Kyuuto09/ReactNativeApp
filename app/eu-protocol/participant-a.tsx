import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
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

export default function ParticipantAScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const onNext = () => {
    alert("Step 4: Driver License Data — is currently under development!");
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Participant A Data</Text>
          <Text style={styles.subtitle}>
            Please fill in the personal and vehicle details for the primary driver.
          </Text>

          <View style={styles.form}>
            <InputField 
              label="First Name" 
              icon="person-outline" 
              placeholder="e.g. John" 
              value={firstName} 
              onChangeText={setFirstName} 
            />
            <InputField 
              label="Last Name" 
              icon="people-outline" 
              placeholder="e.g. Doe" 
              value={lastName} 
              onChangeText={setLastName} 
            />
            <InputField 
              label="Date of Birth" 
              icon="calendar-outline" 
              placeholder="DD.MM.YYYY" 
              value={dob} 
              onChangeText={setDob} 
              keyboardType="numeric"
            />
            <InputField 
              label="Phone Number" 
              icon="call-outline" 
              placeholder="+380" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
            />
            <InputField 
              label="License Plate" 
              icon="car-outline" 
              placeholder="e.g. AA 1234 BB" 
              value={licensePlate} 
              onChangeText={setLicensePlate} 
              autoCapitalize="characters"
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 160, // Elegant space above navbar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6E6E73",
    marginBottom: 40,
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1E1E6",
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#111111",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  nextButton: {
    backgroundColor: "#111111",
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
