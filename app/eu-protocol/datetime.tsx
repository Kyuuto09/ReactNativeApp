import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Keyboard, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableWithoutFeedback, 
  View 
} from "react-native";

export default function EuProtocolDateTime() {
  const router = useRouter();

  const [date, setDate] = useState("18.04.2026");
  const [time, setTime] = useState("11:50");

  const onNext = () => {
    router.push("/eu-protocol/participant-a");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Date & Time of Accident</Text>
        <Text style={styles.subtitle}>
          Please specify the exact time the accident occurred. This is critical for the insurance company.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color="#8E8E93"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="DD.MM.YYYY"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#8E8E93"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Pressable style={styles.quickSetButton} onPress={() => setTime("12:00")}>
            <Ionicons name="refresh" size={16} color="#111111" />
            <Text style={styles.quickSetText}>Set current time</Text>
          </Pressable>
        </View>

        <Pressable 
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]} 
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
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
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E1E6",
    paddingHorizontal: 16,
    height: 60,
  },
  icon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#111111",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  quickSetButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: -8,
    padding: 8,
  },
  quickSetText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  nextButton: {
    marginTop: "auto",
    marginBottom: 130, // Elevated elegantly safely above the bottom tab bar
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
