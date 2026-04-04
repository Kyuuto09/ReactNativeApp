import { Todo, TodosResponse } from "@/types/todo";

const TODOS_API_URL = "https://dummyjson.com/todos?limit=20";

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(TODOS_API_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: TodosResponse = await response.json();
  return data.todos.slice(0, 20);
}
