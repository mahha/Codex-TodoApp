import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openSqliteDatabase } from "../../app/lib/sqlite.server";
import { seedTodos } from "../../app/lib/seed-data";
import { createSqliteTodoRepository } from "../../app/lib/todos.server";
import { createHomeLoader } from "../../app/routes/home";
import { createTodosHandlers } from "../../app/routes/api.todos";
import { createTodoByIdHandlers } from "../../app/routes/api.todos.$id";

const migrationSql = readFileSync(
  resolve(process.cwd(), "db", "migrations", "202502140001_create_todos.sql"),
  "utf8"
);

const createDatabase = async () => {
  const db = await openSqliteDatabase(":memory:");
  db.exec(migrationSql);
  return db;
};

describe("Todo repository", () => {
  let db: Awaited<ReturnType<typeof createDatabase>> | null = null;

  afterEach(() => {
    db?.close();
    db = null;
  });

  it("creates, reads, updates, and deletes todos", async () => {
    db = await createDatabase();
    const repository = createSqliteTodoRepository(db);

    const created = await repository.createTodo({
      title: "Write docs",
      description: "Document API behavior",
    });

    expect(created.id).toBeTruthy();
    expect(created.title).toBe("Write docs");

    const fetched = await repository.getTodo(created.id);
    expect(fetched?.description).toBe("Document API behavior");

    const updated = await repository.updateTodo(created.id, {
      title: "Write docs v2",
    });
    expect(updated?.title).toBe("Write docs v2");

    const removed = await repository.deleteTodo(created.id);
    expect(removed).toBe(true);
  });
});

describe("Todo API handlers", () => {
  let db: Awaited<ReturnType<typeof createDatabase>> | null = null;

  afterEach(() => {
    db?.close();
    db = null;
  });

  it("returns todos from the list endpoint", async () => {
    db = await createDatabase();
    const repository = createSqliteTodoRepository(db);
    for (const todo of seedTodos) {
      await repository.createTodo(todo);
    }

    const { loader } = createTodosHandlers(repository);
    const response = await loader();
    const data = await response.json();

    expect(data.todos.length).toBe(seedTodos.length);
  });

  it("creates a todo via the POST handler", async () => {
    db = await createDatabase();
    const repository = createSqliteTodoRepository(db);
    const { action } = createTodosHandlers(repository);

    const request = new Request("http://example.com/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Ship feature",
        description: "Deploy to production",
      }),
    });

    const response = await action({ request });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.todo.title).toBe("Ship feature");
  });

  it("updates and deletes a todo via the id handlers", async () => {
    db = await createDatabase();
    const repository = createSqliteTodoRepository(db);
    const created = await repository.createTodo({
      title: "Initial",
      description: "Draft",
    });

    const handlers = createTodoByIdHandlers(repository);
    const updateRequest = new Request(
      `http://example.com/api/todos/${created.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      }
    );

    const updateResponse = await handlers.action({
      params: { id: created.id },
      request: updateRequest,
    });
    const updateData = await updateResponse.json();
    expect(updateData.todo.title).toBe("Updated");

    const deleteRequest = new Request(
      `http://example.com/api/todos/${created.id}`,
      { method: "DELETE" }
    );
    const deleteResponse = await handlers.action({
      params: { id: created.id },
      request: deleteRequest,
    });
    const deleteData = await deleteResponse.json();
    expect(deleteData.deleted).toBe(true);
  });
});

describe("Home loader", () => {
  let db: Awaited<ReturnType<typeof createDatabase>> | null = null;

  afterEach(() => {
    db?.close();
    db = null;
  });

  it("loads todos from the repository", async () => {
    db = await createDatabase();
    const repository = createSqliteTodoRepository(db);
    for (const todo of seedTodos) {
      await repository.createTodo(todo);
    }

    const loader = createHomeLoader(repository);
    const data = await loader();

    expect(data.todos.length).toBe(seedTodos.length);
  });
});
