import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CreateTodoForm } from "@/components/todos/CreateTodoForm";
import { TodoList } from "@/components/todos/TodoList";
import { fetchTodos } from "@/services/todos-api";
import {
  deleteTodoFromDb,
  getTodosFromDb,
  hasSeededTodosDb,
  initTodosDb,
  insertTodo,
  markTodosDbSeeded,
  updateTodoCompletionInDb,
  upsertTodos,
} from "@/services/todos-db";
import {
  cancelTodoNotification,
  isFutureReminder,
  scheduleTodoNotification,
} from "@/services/notifications-service";
import { Todo } from "@/types/todo";

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(
    () => todos.filter((item) => item.completed).length,
    [todos],
  );

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initTodosDb();

      const storedTodos = await getTodosFromDb();
      if (storedTodos.length === 0) {
        const hasSeededTodos = await hasSeededTodosDb();
        if (hasSeededTodos) {
          setTodos([]);
        } else {
          const apiTodos = await fetchTodos();
          await upsertTodos(apiTodos, "api");
          await markTodosDbSeeded();
          setTodos(apiTodos);
        }
      } else {
        setTodos(storedTodos);
      }
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateTodo = (values: {
    title: string;
    dueDate: string;
    dueTime: string;
    priority: "low" | "medium" | "high";
    reminderAt: string;
  }) => {
    const newTodo: Todo = {
      id: Date.now(),
      todo: values.title,
      dueDate: values.dueDate,
      reminderAt: values.reminderAt,
      notificationId: null,
      priority: values.priority,
      completed: false,
      userId: 0,
    };

    setTodos((prev) => [newTodo, ...prev]);
    scheduleTodoNotification({
      todoId: newTodo.id,
      title: newTodo.todo,
      reminderAt: newTodo.reminderAt,
    })
      .then((notificationId) => {
        const todoWithNotification = { ...newTodo, notificationId };
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === newTodo.id ? todoWithNotification : todo,
          ),
        );
        return insertTodo(todoWithNotification);
      })
      .catch((err) => {
        console.error("Failed to save todo reminder", err);
        insertTodo(newTodo).catch((saveError) =>
          console.error("Failed to save todo to DB", saveError),
        );
      });
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      return;
    }

    const nextCompleted = !todo.completed;

    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: nextCompleted,
              notificationId: nextCompleted ? null : t.notificationId,
            }
          : t,
      ),
    );

    const syncReminder = nextCompleted
      ? cancelTodoNotification(todo.notificationId).then(() => null)
      : isFutureReminder(todo.reminderAt)
        ? scheduleTodoNotification({
            todoId: todo.id,
            title: todo.todo,
            reminderAt: todo.reminderAt,
          })
        : Promise.resolve(null);

    syncReminder
      .then((notificationId) => {
        setTodos((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, notificationId } : t,
          ),
        );
        return updateTodoCompletionInDb(id, nextCompleted, notificationId);
      })
      .catch((err) => console.error("Failed to toggle todo", err));
  };

  const deleteTodo = async (todo: Todo) => {
    setTodos((prev) => prev.filter((item) => item.id !== todo.id));

    try {
      await cancelTodoNotification(todo.notificationId);
      await deleteTodoFromDb(todo.id);
    } catch (err) {
      console.error("Failed to delete todo", err);
      void loadTodos();
    }
  };

  const handleDeleteTodo = (id: number) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      return;
    }

    void deleteTodo(todo);
  };

  useFocusEffect(
    useCallback(() => {
      void loadTodos();
    }, [loadTodos]),
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("todos:changed", () => {
      void loadTodos();
    });

    return () => subscription.remove();
  }, [loadTodos]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
            onDelete={handleDeleteTodo}
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
