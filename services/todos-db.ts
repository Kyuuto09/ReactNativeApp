import * as SQLite from "expo-sqlite";

import { Todo, TodoPriority } from "@/types/todo";

const DB_NAME = "todos.db";
const TODOS_SEEDED_KEY = "todos_seeded";

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
  reminderAt: string | null;
  notificationId: string | null;
  source: string;
  createdAt: number;
};

const addColumnIfMissing = async (
  database: SQLite.SQLiteDatabase,
  statement: string,
) => {
  try {
    await database.execAsync(statement);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("duplicate column")
    ) {
      return;
    }

    throw error;
  }
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
      reminderAt TEXT,
      notificationId TEXT,
      source TEXT NOT NULL DEFAULT 'local',
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  await addColumnIfMissing(database, "ALTER TABLE todos ADD COLUMN reminderAt TEXT;");
  await addColumnIfMissing(database, "ALTER TABLE todos ADD COLUMN notificationId TEXT;");
};

export const hasSeededTodosDb = async () => {
  const database = await openDb();
  const row = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    [TODOS_SEEDED_KEY],
  );

  return row?.value === "true";
};

export const markTodosDbSeeded = async () => {
  const database = await openDb();
  await database.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    [TODOS_SEEDED_KEY, "true"],
  );
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
    reminderAt: row.reminderAt ?? null,
    notificationId: row.notificationId ?? null,
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
        "INSERT OR REPLACE INTO todos (id, todo, completed, userId, priority, dueDate, reminderAt, notificationId, source, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          todo.id,
          todo.todo,
          todo.completed ? 1 : 0,
          todo.userId ?? 0,
          todo.priority ?? null,
          todo.dueDate ?? null,
          todo.reminderAt ?? null,
          todo.notificationId ?? null,
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
    "INSERT OR REPLACE INTO todos (id, todo, completed, userId, priority, dueDate, reminderAt, notificationId, source, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      todo.id,
      todo.todo,
      todo.completed ? 1 : 0,
      todo.userId ?? 0,
      todo.priority ?? null,
      todo.dueDate ?? null,
      todo.reminderAt ?? null,
      todo.notificationId ?? null,
      "local",
      Date.now(),
    ],
  );
};

export const updateTodoCompletionInDb = async (
  id: number,
  completed: boolean,
  notificationId?: string | null,
) => {
  const database = await openDb();
  await database.runAsync(
    "UPDATE todos SET completed = ?, notificationId = ? WHERE id = ?",
    [completed ? 1 : 0, notificationId ?? null, id],
  );
};

export const deleteTodoFromDb = async (id: number) => {
  const database = await openDb();
  await database.runAsync("DELETE FROM todos WHERE id = ?", [id]);
};

export const clearTodosDb = async () => {
  const database = await openDb();
  await database.runAsync("DELETE FROM todos");
};
