import { useEffect, useRef, useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
  dueTime: string;
  priority: TodoPriority;
  reminderAt: string;
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

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const getDefaultReminderDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date;
};

const getDateFromValues = (date: string, time: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const reminderDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    reminderDate.getFullYear() !== year ||
    reminderDate.getMonth() !== month - 1 ||
    reminderDate.getDate() !== day
  ) {
    return null;
  }

  return reminderDate;
};

const maskDateInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);

  return [year, month, day].filter(Boolean).join("-");
};

export function CreateTodoForm({ onCreate }: CreateTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const defaultReminderDate = getDefaultReminderDate();

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
    watch,
  } = useForm<CreateTodoFormValues>({
    defaultValues: {
      title: "",
      dueDate: formatDate(defaultReminderDate),
      dueTime: formatTime(defaultReminderDate),
      priority: "medium",
      reminderAt: defaultReminderDate.toISOString(),
    },
  });

  const dueDate = watch("dueDate");
  const dueTime = watch("dueTime");

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
    const reminderDate = getDateFromValues(values.dueDate, values.dueTime);

    if (!reminderDate) {
      setFormError("Use a complete date and time for the reminder.");
      return;
    }

    if (reminderDate.getTime() <= Date.now()) {
      setFormError("Choose a reminder time in the future.");
      return;
    }

    setFormError(null);
    onCreate({
      ...values,
      title: values.title.trim(),
      reminderAt: reminderDate.toISOString(),
    });

    const nextDefaultReminderDate = getDefaultReminderDate();
    reset({
      title: "",
      dueDate: formatDate(nextDefaultReminderDate),
      dueTime: formatTime(nextDefaultReminderDate),
      priority: "medium",
      reminderAt: nextDefaultReminderDate.toISOString(),
    });
    setIsOpen(false);
  };

  const handleTimePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setIsTimePickerOpen(false);
    }

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    setFormError(null);
    setValue("dueTime", formatTime(selectedDate), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const openTimePicker = () => {
    const currentReminderDate = getDateFromValues(dueDate, dueTime);

    if (!currentReminderDate) {
      setValue("dueTime", formatTime(new Date()), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setIsTimePickerOpen((prev) => !prev);
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
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Use YYYY-MM-DD.",
              },
            }}
            render={({ field: { onBlur, value } }) => (
              <View>
                <Text style={styles.label}>Reminder Date</Text>
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    setFormError(null);
                    setValue("dueDate", maskDateInput(text), {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9A9AA0"
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    errors.dueDate && styles.inputError,
                  ]}
                  maxLength={10}
                />

                {errors.dueDate ? (
                  <Text style={styles.errorText}>{errors.dueDate.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="dueTime"
            rules={{
              required: "Time is required.",
              pattern: {
                value: /^([01]\d|2[0-3]):[0-5]\d$/,
                message: "Use HH:MM.",
              },
            }}
            render={({ field: { value } }) => {
              const pickerValue = getDateFromValues(dueDate, value) ?? new Date();

              return (
              <View>
                <Text style={styles.label}>Reminder Time</Text>
                <Pressable
                  onPress={openTimePicker}
                  style={[
                    styles.timeButton,
                    errors.dueTime && styles.inputError,
                  ]}
                >
                  <Text style={styles.timeValue}>{value}</Text>
                  <Text style={styles.timeHint}>
                    {isTimePickerOpen ? "Done" : "Change"}
                  </Text>
                </Pressable>

                {isTimePickerOpen ? (
                  <View style={styles.timePickerShell}>
                    <DateTimePicker
                      value={pickerValue}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      themeVariant="light"
                      textColor={palette.textPrimary}
                      accentColor={palette.accent}
                      onChange={handleTimePickerChange}
                    />
                  </View>
                ) : null}

                {errors.dueTime ? (
                  <Text style={styles.errorText}>{errors.dueTime.message}</Text>
                ) : null}
              </View>
              );
            }}
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

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

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
            A reminder notification will be scheduled for the selected time.
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
  timeButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceSoft,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeValue: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  timeHint: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  timePickerShell: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: -2,
    marginBottom: 12,
    overflow: "hidden",
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
