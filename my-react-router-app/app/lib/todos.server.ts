import type { Todo, TodoInput } from "./todos";
import { getSqliteDatabase, type SqliteDatabase } from "./db.server";

type TodoRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  completed: number;
};

export type TodoRepository = {
  listTodos: () => Promise<Todo[]>;
  getTodo: (id: string) => Promise<Todo | null>;
  createTodo: (input: TodoInput) => Promise<Todo>;
  updateTodo: (id: string, input: Partial<TodoInput>) => Promise<Todo | null>;
  deleteTodo: (id: string) => Promise<boolean>;
};

const mapTodoRow = (row: TodoRow): Todo => ({
  id: row.id,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
  completed: Boolean(row.completed),
});

export function createD1TodoRepository(db: D1Database): TodoRepository {
  const listTodos = async () => {
    const result = await db
      .prepare(
        "SELECT id, title, description, created_at, completed FROM todos ORDER BY created_at DESC"
      )
      .all<TodoRow>();
    return result.results.map(mapTodoRow);
  };

  const getTodo = async (id: string) => {
    const result = await db
      .prepare(
        "SELECT id, title, description, created_at, completed FROM todos WHERE id = ?"
      )
      .bind(id)
      .first<TodoRow>();
    return result ? mapTodoRow(result) : null;
  };

  const createTodo = async (input: TodoInput) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const completed = input.completed ? 1 : 0;
    await db
      .prepare(
        "INSERT INTO todos (id, title, description, created_at, completed) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(id, input.title, input.description, createdAt, completed)
      .run();
    return {
      id,
      title: input.title,
      description: input.description,
      createdAt,
      completed: Boolean(completed),
    };
  };

  const updateTodo = async (id: string, input: Partial<TodoInput>) => {
    const existing = await getTodo(id);
    if (!existing) {
      return null;
    }

    const title = input.title ?? existing.title;
    const description = input.description ?? existing.description;
    const completed = input.completed ?? existing.completed;
    await db
      .prepare(
        "UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?"
      )
      .bind(title, description, completed ? 1 : 0, id)
      .run();
    return { ...existing, title, description, completed };
  };

  const deleteTodo = async (id: string) => {
    const result = await db
      .prepare("DELETE FROM todos WHERE id = ?")
      .bind(id)
      .run();
    return result.meta.changes > 0;
  };

  return { listTodos, getTodo, createTodo, updateTodo, deleteTodo };
}

export function createSqliteTodoRepository(db: SqliteDatabase): TodoRepository {
  const listTodos = async () => {
    const rows = db
      .prepare(
        "SELECT id, title, description, created_at, completed FROM todos ORDER BY created_at DESC"
      )
      .all() as TodoRow[];
    return rows.map(mapTodoRow);
  };

  const getTodo = async (id: string) => {
    const row = db
      .prepare(
        "SELECT id, title, description, created_at, completed FROM todos WHERE id = ?"
      )
      .get(id) as TodoRow | undefined;
    return row ? mapTodoRow(row) : null;
  };

  const createTodo = async (input: TodoInput) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const completed = input.completed ? 1 : 0;
    db.prepare(
      "INSERT INTO todos (id, title, description, created_at, completed) VALUES (?, ?, ?, ?, ?)"
    ).run(id, input.title, input.description, createdAt, completed);
    return {
      id,
      title: input.title,
      description: input.description,
      createdAt,
      completed: Boolean(completed),
    };
  };

  const updateTodo = async (id: string, input: Partial<TodoInput>) => {
    const existing = await getTodo(id);
    if (!existing) {
      return null;
    }

    const title = input.title ?? existing.title;
    const description = input.description ?? existing.description;
    const completed = input.completed ?? existing.completed;
    db.prepare(
      "UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?"
    ).run(title, description, completed ? 1 : 0, id);
    return { ...existing, title, description, completed };
  };

  const deleteTodo = async (id: string) => {
    const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
    return result.changes > 0;
  };

  return { listTodos, getTodo, createTodo, updateTodo, deleteTodo };
}

type RepositoryOptions = {
  env?: Env;
  sqliteDb?: SqliteDatabase;
};

export async function getTodoRepository(
  options: RepositoryOptions = {}
): Promise<TodoRepository> {
  if (options.env?.DB) {
    return createD1TodoRepository(options.env.DB);
  }

  const db = options.sqliteDb ?? (await getSqliteDatabase());
  return createSqliteTodoRepository(db);
}
