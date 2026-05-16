export type TodoPriority = "low" | "medium" | "high";

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  priority?: TodoPriority;
  dueDate?: string;
  reminderAt?: string | null;
  notificationId?: string | null;
};

export type TodosResponse = {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
};
