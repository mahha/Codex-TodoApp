import type { Todo, TodoInput } from "./todos";
import { getSqliteDatabase, type SqliteDatabase } from "./db.server";

type TodoRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
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
});

export function createD1TodoRepository(db: D1Database): TodoRepository {
  const listTodos = async () => {
    const result = await db
      .prepare(
        "SELECT id, title, description, created_at FROM todos ORDER BY created_at DESC"
      )
      .all<TodoRow>();
    return result.results.map(mapTodoRow);
  };

  const getTodo = async (id: string) => {
    const result = await db
      .prepare("SELECT id, title, description, created_at FROM todos WHERE id = ?")
      .bind(id)
      .first<TodoRow>();
    return result ? mapTodoRow(result) : null;
  };

  const createTodo = async (input: TodoInput) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await db
      .prepare(
        "INSERT INTO todos (id, title, description, created_at) VALUES (?, ?, ?, ?)"
      )
      .bind(id, input.title, input.description, createdAt)
      .run();
    return { id, title: input.title, description: input.description, createdAt };
  };

  const updateTodo = async (id: string, input: Partial<TodoInput>) => {
    const existing = await getTodo(id);
    if (!existing) {
      return null;
    }

    const title = input.title ?? existing.title;
    const description = input.description ?? existing.description;
    await db
      .prepare("UPDATE todos SET title = ?, description = ? WHERE id = ?")
      .bind(title, description, id)
      .run();
    return { ...existing, title, description };
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
        "SELECT id, title, description, created_at FROM todos ORDER BY created_at DESC"
      )
      .all() as TodoRow[];
    return rows.map(mapTodoRow);
  };

  const getTodo = async (id: string) => {
    const row = db
      .prepare("SELECT id, title, description, created_at FROM todos WHERE id = ?")
      .get(id) as TodoRow | undefined;
    return row ? mapTodoRow(row) : null;
  };

  const createTodo = async (input: TodoInput) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    db.prepare(
      "INSERT INTO todos (id, title, description, created_at) VALUES (?, ?, ?, ?)"
    ).run(id, input.title, input.description, createdAt);
    return { id, title: input.title, description: input.description, createdAt };
  };

  const updateTodo = async (id: string, input: Partial<TodoInput>) => {
    const existing = await getTodo(id);
    if (!existing) {
      return null;
    }

    const title = input.title ?? existing.title;
    const description = input.description ?? existing.description;
    db.prepare("UPDATE todos SET title = ?, description = ? WHERE id = ?").run(
      title,
      description,
      id
    );
    return { ...existing, title, description };
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
