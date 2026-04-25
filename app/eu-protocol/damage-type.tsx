import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import { Image } from "expo-image";
import { useProtocol } from "@/components/eu-protocol/ProtocolContext";

const SIDES = ["Front", "Rear", "Left Side", "Right Side"];

export default function DamageTypeScreen() {
  const router = useRouter();
  const { draftProtocol, submitProtocol } = useProtocol();

  const [selectedSide, setSelectedSide] = useState(draftProtocol.impactSide || "");
  const [description, setDescription] = useState(draftProtocol.description || "");
  const [photoUri, setPhotoUri] = useState<string | null>(draftProtocol.photoUri || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onNext = async () => {
    if (!selectedSide || !description.trim()) {
      Alert.alert("Missing Information", "Please specify the impact side and provide a description.");
      return;
    }
    
    try {
      await submitProtocol({ impactSide: selectedSide, description, photoUri });
      Alert.alert("Success", "Europrotocol successfully documented and archived!");
      router.dismissAll();
    } catch (e) {
      Alert.alert("Error", "Failed to save protocol.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Damage Type</Text>
          <Text style={styles.subtitle}>
            Please indicate the side of the impact and provide a short description of the visible damage.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Impact Side</Text>
            <View style={styles.chipsContainer}>
              {SIDES.map((side) => {
                const isActive = selectedSide === side;
                return (
                  <Pressable 
                    key={side}
                    onPress={() => setSelectedSide(side)}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {side}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: 24 }]}>Short Description</Text>
            <View style={[styles.inputWrapper, styles.multilineWrapper]}>
               <TextInput 
                  style={[styles.input, styles.multilineInput]} 
                  placeholderTextColor="#9A9AA0"
                  placeholder="e.g. Scratched bumper and broken left headlight."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
            </View>

            <Text style={[styles.label, { marginTop: 24 }]}>Photo Evidence</Text>
            <Pressable style={styles.photoBox} onPress={pickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={28} color="#8E8E93" />
                  <Text style={styles.photoBoxText}>Attach a photo</Text>
                </>
              )}
            </Pressable>
          </View>

          <Pressable 
            style={({ pressed }) => [styles.nextButton, pressed && styles.pressed, { backgroundColor: "#34C759" }]} 
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>Submit Protocol</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { padding: 24, paddingBottom: 160 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#111111", marginBottom: 10, marginTop: 10, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#6E6E73", marginBottom: 40, lineHeight: 22 },
  form: { marginBottom: 40 },
  label: { fontSize: 13, fontWeight: "700", color: "#111111", marginBottom: 12, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: "#E1E1E6", backgroundColor: "#F4F4F5" },
  chipActive: { backgroundColor: "#111111", borderColor: "#111111" },
  chipText: { fontSize: 15, fontWeight: "600", color: "#6E6E73" },
  chipTextActive: { color: "#FFFFFF" },
  inputWrapper: { backgroundColor: "#F4F4F5", borderRadius: 14, borderWidth: 1, borderColor: "#E1E1E6", paddingHorizontal: 16 },
  multilineWrapper: { height: 120, paddingTop: 16 },
  input: { fontSize: 17, color: "#111111", fontWeight: "600", letterSpacing: 0.5 },
  multilineInput: { flex: 1, textAlignVertical: "top" },
  photoBox: { height: 120, backgroundColor: "#F4F4F5", borderRadius: 14, borderWidth: 1, borderColor: "#E1E1E6", borderStyle: "dashed", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photoPreview: { width: "100%", height: "100%" },
  photoBoxText: { fontSize: 15, fontWeight: "600", color: "#8E8E93", marginTop: 8 },
  nextButton: { height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", shadowColor: "#0E1B2A", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  pressed: { opacity: 0.85 },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
});
