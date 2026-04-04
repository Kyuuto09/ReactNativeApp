import { ReactElement } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Todo } from "@/types/todo";

import { TodoItem } from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  onToggle?: (id: number) => void;
  headerComponent?: ReactElement | null;
};

export function TodoList({ todos, onToggle, headerComponent }: TodoListProps) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={headerComponent ?? null}
      ListHeaderComponentStyle={headerComponent ? styles.header : undefined}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <TodoItem item={item} onToggle={() => onToggle?.(item.id)} />
      )}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No tasks found.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 110,
  },
  header: {
    marginBottom: 10,
  },
  separator: {
    height: 10,
  },
  emptyWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "500",
  },
});
