import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 10 Questions Array
const questions = [
  {
    question: "How do you usually react to unexpected life changes?",
    options: [
      {
        text: "I accept them easily and look for new opportunities.",
        type: "Sanguine",
      },
      { text: "I take control right away and act.", type: "Choleric" },
      {
        text: "I reflect and analyze the possible consequences.",
        type: "Melancholic",
      },
      {
        text: "I stay calm and ignore unnecessary fuss.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "Your role in a big group of mostly unfamiliar people:",
    options: [
      {
        text: "I quickly start conversations with everyone.",
        type: "Sanguine",
      },
      {
        text: "I express my opinion directly and may debate.",
        type: "Choleric",
      },
      {
        text: "I keep to myself or talk to just one friend.",
        type: "Melancholic",
      },
      {
        text: "I quietly enjoy the atmosphere.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "How do you behave when someone openly yells at you?",
    options: [
      {
        text: "I joke it off or try to soften the situation.",
        type: "Sanguine",
      },
      {
        text: "I respond sharply and defend my position.",
        type: "Choleric",
      },
      {
        text: "I feel deeply hurt and process it silently.",
        type: "Melancholic",
      },
      {
        text: "I barely react and wait for the person to calm down.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "When making an important decision, you usually:",
    options: [
      {
        text: "Trust your intuition or your current mood.",
        type: "Sanguine",
      },
      {
        text: "Make a confident, quick choice with little hesitation.",
        type: "Choleric",
      },
      {
        text: "Carefully weigh risks and look for the best option.",
        type: "Melancholic",
      },
      {
        text: "Prefer the option that requires the least effort.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "How do you relate to strict rules and deadlines?",
    options: [
      {
        text: "I often break them or forget about them.",
        type: "Sanguine",
      },
      {
        text: "If a rule blocks my goal, I ignore it.",
        type: "Choleric",
      },
      {
        text: "I follow them strictly and worry about mistakes.",
        type: "Melancholic",
      },
      {
        text: "I work calmly and still finish on time.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "How do you react to your own failures?",
    options: [
      {
        text: "I quickly move on to the next idea.",
        type: "Sanguine",
      },
      {
        text: "I get frustrated and push twice as hard.",
        type: "Choleric",
      },
      {
        text: "I fall into self-criticism and dwell on it.",
        type: "Melancholic",
      },
      {
        text: "I accept it and keep moving at my own pace.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "How do you plan weekends or group leisure time?",
    options: [
      {
        text: "Spontaneously, based on mood and friends.",
        type: "Sanguine",
      },
      {
        text: "I organize everything and direct the plan.",
        type: "Choleric",
      },
      {
        text: "I plan every detail well in advance.",
        type: "Melancholic",
      },
      {
        text: "I am fine with anything as long as it is comfortable.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "Choose the phrase that best describes you at work:",
    options: [
      {
        text: "Creative chaos is my best engine.",
        type: "Sanguine",
      },
      {
        text: "I deliver results at any cost and on time.",
        type: "Choleric",
      },
      {
        text: "Flawless quality matters most. Perfectionism.",
        type: "Melancholic",
      },
      {
        text: "I work methodically and steadily, without burnout.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "If someone tells a long, boring story:",
    options: [
      {
        text: "I try to smoothly change the topic.",
        type: "Sanguine",
      },
      {
        text: "I interrupt directly or say I am not interested.",
        type: "Choleric",
      },
      {
        text: "I keep listening patiently to avoid offending them.",
        type: "Melancholic",
      },
      {
        text: "I sit comfortably and nod politely.",
        type: "Phlegmatic",
      },
    ],
  },
  {
    question: "Your attitude toward conflicts:",
    options: [
      {
        text: "I dislike conflict and try to ease tension with humor.",
        type: "Sanguine",
      },
      {
        text: "I accept the challenge and confront issues directly.",
        type: "Choleric",
      },
      {
        text: "After conflict, I replay the conversation for a long time.",
        type: "Melancholic",
      },
      {
        text: "I avoid the issue and wait for it to settle on its own.",
        type: "Phlegmatic",
      },
    ],
  },
];

export default function Index() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({
    Sanguine: 0,
    Choleric: 0,
    Melancholic: 0,
    Phlegmatic: 0,
  });

  const handleAnswer = (selectedType: string) => {
    const newScores = { ...scores };
    newScores[selectedType as keyof typeof scores] += 1;
    setScores(newScores);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const getDominantTemperament = () => {
    let highestScore = -1;
    let dominant = "";
    Object.entries(scores).forEach(([temp, score]) => {
      if (score > highestScore) {
        highestScore = score;
        dominant = temp;
      }
    });
    return dominant;
  };

  const resetQuiz = () => {
    setHasStarted(false);
    setCurrentIndex(0);
    setScores({ Sanguine: 0, Choleric: 0, Melancholic: 0, Phlegmatic: 0 });
    setShowResult(false);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#F9FBFF", "#F0F4FB", "#EEF3F9"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {!hasStarted ? (
          <View style={styles.centerContainer}>
            <View style={styles.card}>
              <Text style={styles.kicker}>PERSONALITY TEST</Text>
              <Text style={styles.largeTitle}>Know Yourself</Text>
              <Text style={styles.subtitle}>
                10 questions to help identify your dominant temperament type.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
                onPress={() => setHasStarted(true)}
              >
                <Text style={styles.primaryButtonText}>Start</Text>
              </Pressable>
            </View>
          </View>
        ) : !showResult ? (
          <View style={styles.quizContainer}>
            <View style={styles.card}>
              <View style={styles.progressHeader}>
                <Text style={styles.caption}>
                  Question {currentIndex + 1} / {questions.length}
                </Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>

              <Text style={styles.questionText}>
                {questions[currentIndex].question}
              </Text>
              <View style={styles.optionsList}>
                {questions[currentIndex].options.map((option, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleAnswer(option.type)}
                    style={({ pressed }) => [
                      styles.optionRow,
                      pressed && styles.optionRowPressed,
                    ]}
                  >
                    <Text style={styles.optionRowText}>{option.text}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.centerContainer}>
            <View style={styles.card}>
              <Text style={styles.captionAction}>
                Your Dominant Temperament
              </Text>
              <Text style={styles.resultHighlight}>
                {getDominantTemperament()}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
                onPress={resetQuiz}
              >
                <Text style={styles.primaryButtonText}>Take Again</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF3F9",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 110,
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8ED",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 2,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  progressHeader: {
    marginBottom: 22,
  },
  progressBarBg: {
    height: 5,
    width: "100%",
    backgroundColor: "#E9E9EE",
    borderRadius: 999,
    marginTop: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#111111",
    borderRadius: 999,
  },
  largeTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#636366",
    marginBottom: 30,
  },
  caption: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.6,
  },
  captionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 29,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 24,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  optionsList: {
    width: "100%",
  },
  optionRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E7E7EC",
    marginBottom: 10,
    backgroundColor: "#FAFAFC",
  },
  optionRowPressed: {
    backgroundColor: "#F0F0F5",
  },
  optionRowText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  resultHighlight: {
    fontSize: 44,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 28,
    letterSpacing: -1,
  },
});
