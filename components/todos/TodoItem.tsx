import { Pressable, StyleSheet, Text, View } from "react-native";

import { Todo } from "@/types/todo";

type TodoItemProps = {
  item: Todo;
  onToggle?: () => void;
};

export function TodoItem({ item, onToggle }: TodoItemProps) {
  const statusLabel = item.completed ? "done" : "to-do";
  const details = [statusLabel];

  if (item.priority) {
    details.push(`priority: ${item.priority}`);
  }

  if (item.dueDate) {
    details.push(`date: ${item.dueDate}`);
  }

  if (item.userId > 0) {
    details.push(`user #${item.userId}`);
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onToggle}
    >
      <View style={styles.surfaceHighlight} />
      <View style={[styles.rowContent, item.completed && styles.rowContentDone]}>
        <View
          style={[
            styles.statusDot,
            item.completed ? styles.statusDone : styles.statusPending,
          ]}
        />
        <View style={styles.contentWrap}>
          <Text style={[styles.title, item.completed && styles.titleDone]}>
            {item.todo}
          </Text>
          <Text style={[styles.meta, item.completed && styles.metaDone]}>
            {details.join(" • ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.34)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.82)",
    paddingHorizontal: 14,
    paddingVertical: 12,
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
  statusDone: {
    backgroundColor: "#34C759",
  },
  statusPending: {
    backgroundColor: "#FF9500",
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
});
