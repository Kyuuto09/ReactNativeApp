import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";

import { TodoPriority } from "@/types/todo";

type CreateTodoFormValues = {
  title: string;
  dueDate: string;
  priority: TodoPriority;
};

type CreateTodoFormProps = {
  onCreate: (values: CreateTodoFormValues) => void;
};

const priorities: TodoPriority[] = ["low", "medium", "high"];

const palette = {
  accent: "#111111",
  textPrimary: "#111111",
  textSecondary: "#3A3A3C",
  textMuted: "#6E6E73",
  surface: "#FFFFFF",
  surfaceSoft: "#F4F4F5",
  border: "#E1E1E6",
  borderStrong: "#CFCFD6",
  danger: "#2C2C2E",
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function CreateTodoForm({ onCreate }: CreateTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTodoFormValues>({
    defaultValues: {
      title: "",
      dueDate: formatDate(new Date()),
      priority: "medium",
    },
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, isOpen]);

  const toggleForm = () => {
    setIsOpen((prev) => !prev);
  };

  const submitForm = (values: CreateTodoFormValues) => {
    onCreate({
      ...values,
      title: values.title.trim(),
    });

    reset({
      title: "",
      dueDate: formatDate(new Date()),
      priority: "medium",
    });
    setIsOpen(false);
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={toggleForm}
        style={({ pressed }) => [
          styles.triggerButton,
          pressed && styles.triggerPressed,
        ]}
      >
        <Text style={styles.triggerText}>{isOpen ? "Close" : "Add Task"}</Text>
      </Pressable>

      {isOpen ? (
        <Animated.View
          style={[
            styles.formWrap,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.formTitle}>Create New Task</Text>

          <Controller
            control={control}
            name="title"
            rules={{
              required: "Task name is required.",
              minLength: {
                value: 2,
                message: "Task name should be at least 2 characters.",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g. Buy groceries"
                  placeholderTextColor="#9A9AA0"
                  style={[styles.input, errors.title && styles.inputError]}
                />
                {errors.title ? (
                  <Text style={styles.errorText}>{errors.title.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="dueDate"
            rules={{
              required: "Date is required.",
            }}
            render={({ field: { value } }) => (
              <View>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    { marginBottom: 10 },
                    errors.dueDate && styles.inputError,
                  ]}
                  value={value}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9A9AA0"
                  onChangeText={(text) => {
                    setValue("dueDate", text, { shouldValidate: true });
                  }}
                />

                {errors.dueDate ? (
                  <Text style={styles.errorText}>{errors.dueDate.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="priority"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityRow}>
                  {priorities.map((priority) => {
                    const isActive = value === priority;
                    let activeColor = palette.accent;
                    if (priority === "low") activeColor = "#34C759";
                    else if (priority === "medium") activeColor = "#FF9500";
                    else if (priority === "high") activeColor = "#FF3B30";

                    return (
                      <Pressable
                        key={priority}
                        onPress={() => onChange(priority)}
                        style={({ pressed }) => [
                          styles.priorityChip,
                          isActive && {
                            backgroundColor: activeColor,
                            borderColor: activeColor,
                          },
                          pressed && styles.priorityChipPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityChipText,
                            isActive && styles.priorityChipTextActive,
                          ]}
                        >
                          {priority}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          />

          <Pressable
            onPress={handleSubmit(submitForm)}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitPressed,
            ]}
          >
            <Text style={styles.submitText}>Create</Text>
          </Pressable>

          <Text style={styles.helperText}>
            New tasks are created with status: to-do
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  triggerButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: palette.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  triggerPressed: {
    opacity: 0.88,
  },
  triggerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  formWrap: {
    marginTop: 14,
  },
  formTitle: {
    fontSize: 18,
    color: palette.textPrimary,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceSoft,
    paddingHorizontal: 12,
    color: palette.textPrimary,
    fontSize: 15,
    marginBottom: 10,
  },
  inputError: {
    borderColor: palette.danger,
  },
  errorText: {
    marginTop: -4,
    marginBottom: 8,
    color: palette.danger,
    fontSize: 12,
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  priorityChip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceSoft,
    paddingVertical: 10,
    alignItems: "center",
  },
  priorityChipActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  priorityChipPressed: {
    opacity: 0.9,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textSecondary,
    textTransform: "capitalize",
  },
  priorityChipTextActive: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: palette.accent,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitPressed: {
    opacity: 0.88,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 10,
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "500",
  },
});
