import * as SQLite from "expo-sqlite";

import { Todo, TodoPriority } from "@/types/todo";

const DB_NAME = "todos.db";

let db: SQLite.SQLiteDatabase | null = null;

const openDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }

  return db;
};

type DbTodoRow = {
  id: number;
  todo: string;
  completed: number;
  userId: number;
  priority: TodoPriority | null;
  dueDate: string | null;
  source: string;
  createdAt: number;
};

export const initTodosDb = async () => {
  const database = await openDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY NOT NULL,
      todo TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      userId INTEGER NOT NULL DEFAULT 0,
      priority TEXT,
      dueDate TEXT,
      source TEXT NOT NULL DEFAULT 'local',
      createdAt INTEGER NOT NULL
    );
  `);
};

export const getTodosFromDb = async (): Promise<Todo[]> => {
  const database = await openDb();
  const rows = await database.getAllAsync<DbTodoRow>(
    "SELECT * FROM todos ORDER BY createdAt DESC, id DESC",
  );

  return rows.map((row) => ({
    id: row.id,
    todo: row.todo,
    completed: row.completed === 1,
    userId: row.userId,
    priority: row.priority ?? undefined,
    dueDate: row.dueDate ?? undefined,
  }));
};

export const upsertTodos = async (todos: Todo[], source = "api") => {
  if (todos.length === 0) {
    return;
  }

  const database = await openDb();
  await database.execAsync("BEGIN TRANSACTION;");

  try {
    for (const todo of todos) {
      const createdAt = Date.now();
      await database.runAsync(
        "INSERT OR REPLACE INTO todos (id, todo, completed, userId, priority, dueDate, source, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          todo.id,
          todo.todo,
          todo.completed ? 1 : 0,
          todo.userId ?? 0,
          todo.priority ?? null,
          todo.dueDate ?? null,
          source,
          createdAt,
        ],
      );
    }

    await database.execAsync("COMMIT;");
  } catch (error) {
    await database.execAsync("ROLLBACK;");
    throw error;
  }
};

export const insertTodo = async (todo: Todo) => {
  const database = await openDb();
  await database.runAsync(
    "INSERT OR REPLACE INTO todos (id, todo, completed, userId, priority, dueDate, source, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      todo.id,
      todo.todo,
      todo.completed ? 1 : 0,
      todo.userId ?? 0,
      todo.priority ?? null,
      todo.dueDate ?? null,
      "local",
      Date.now(),
    ],
  );
};

export const toggleTodoInDb = async (id: number) => {
  const database = await openDb();
  await database.runAsync(
    "UPDATE todos SET completed = CASE completed WHEN 1 THEN 0 ELSE 1 END WHERE id = ?",
    [id],
  );
};

export const clearTodosDb = async () => {
  const database = await openDb();
  await database.runAsync("DELETE FROM todos");
};
