import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { Todo } from "@/types/todo";

type TodoItemProps = {
  item: Todo;
  onToggle?: () => void;
  onDelete?: () => void;
};

const formatReminder = (reminderAt: string) => {
  const date = new Date(reminderAt);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const ACTION_WIDTH = 76;

export function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  const statusLabel = item.completed ? "done" : "to-do";
  const details = [statusLabel];
  const priorityColor =
    item.priority === "low"
      ? "#34C759"
      : item.priority === "medium"
        ? "#FF9F0A"
        : item.priority === "high"
          ? "#FF3B30"
          : "#8E8E93";
  const statusColor = item.completed ? "#C7C7CC" : priorityColor;

  if (item.priority) {
    details.push(`priority: ${item.priority}`);
  }

  if (item.reminderAt) {
    const reminderLabel = formatReminder(item.reminderAt);
    if (reminderLabel) {
      details.push(`reminder: ${reminderLabel}`);
    }
  } else if (item.dueDate) {
    details.push(`date: ${item.dueDate}`);
  }

  if (item.userId > 0) {
    details.push(`user #${item.userId}`);
  }

  const renderRightActions = () => (
    <View style={styles.actionWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${item.todo}`}
        onPress={onDelete}
        style={({ pressed }) => [
          styles.swipeAction,
          pressed && styles.swipeActionPressed,
        ]}
      >
        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      rightThreshold={36}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeContainer}
    >
      <View style={styles.card}>
        <View style={styles.surfaceHighlight} />
        <View
          style={[styles.rowContent, item.completed && styles.rowContentDone]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.toggleArea,
              pressed && styles.cardPressed,
            ]}
            onPress={onToggle}
          >
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <View style={styles.contentWrap}>
              <Text style={[styles.title, item.completed && styles.titleDone]}>
                {item.todo}
              </Text>
              <View style={styles.metaRow}>
                <Text style={[styles.meta, item.completed && styles.metaDone]}>
                  {details.join(" • ")}
                </Text>
                {item.priority ? (
                  <View
                    style={[
                      styles.priorityPill,
                      { backgroundColor: statusColor },
                    ]}
                  >
                    <Text style={styles.priorityText}>{item.priority}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  card: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.8,
  },
  surfaceHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  rowContentDone: {
    opacity: 0.6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 7,
  },
  contentWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  metaDone: {
    color: "#C7C7CC",
  },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  priorityPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  actionWrap: {
    width: ACTION_WIDTH + 18,
    marginLeft: -18,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FF3B30",
  },
  swipeAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
  },
  swipeActionPressed: {
    opacity: 0.72,
  },
});
