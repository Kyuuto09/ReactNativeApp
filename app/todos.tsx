import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CreateTodoForm } from "@/components/todos/CreateTodoForm";
import { TodoList } from "@/components/todos/TodoList";
import { fetchTodos } from "@/services/todos-api";
import { Todo } from "@/types/todo";

export default function TodosScreen() {
  const [apiTodos, setApiTodos] = useState<Todo[]>([]);
  const [createdTodos, setCreatedTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todos = useMemo(
    () => [...createdTodos, ...apiTodos],
    [createdTodos, apiTodos],
  );

  const completedCount = useMemo(
    () => todos.filter((item) => item.completed).length,
    [todos],
  );

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextTodos = await fetchTodos();
      setApiTodos(nextTodos);
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = (values: {
    title: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }) => {
    const newTodo: Todo = {
      id: Date.now(),
      todo: values.title,
      dueDate: values.dueDate,
      priority: values.priority,
      completed: false,
      userId: 0,
    };

    setCreatedTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: number) => {
    setCreatedTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    setApiTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#F9FBFF", "#F0F4FB", "#EEF3F9"]}
        locations={[0, 0.45, 1]}
        style={styles.bgGradient}
      />
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>TASK LIST</Text>
          <Text style={styles.title}>My Todos</Text>
          <Text style={styles.subtitle}>
            Loaded from DummyJSON API. Total: {todos.length} • Completed:{" "}
            {completedCount}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#111111" />
            <Text style={styles.stateText}>Loading tasks...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
              onPress={loadTodos}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            headerComponent={<CreateTodoForm onCreate={handleCreateTodo} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF3F9",
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  headerCard: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#0E1B2A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    color: "#111111",
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#636366",
    fontWeight: "500",
  },
  centerState: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 12,
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    backgroundColor: "rgba(255,255,255,0.34)",
    overflow: "hidden",
  },
  stateText: {
    fontSize: 15,
    color: "#636366",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#FF3B30",
    fontWeight: "600",
  },
  retryButton: {
    marginTop: 6,
    backgroundColor: "#111111",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
