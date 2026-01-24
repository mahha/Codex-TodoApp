import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { TodoRepository } from "../lib/todos.server";
import NewTodo, {
  createNewTodoAction,
  type NewTodoActionData,
} from "./todos.new";

const createRepository = () => {
  const createdTodo = {
    id: "todo-1",
    title: "Draft roadmap",
    description: "Outline goals and milestones.",
    createdAt: "2025-01-01T00:00:00.000Z",
    completed: false,
  };

  return {
    listTodos: vi.fn().mockResolvedValue([]),
    getTodo: vi.fn().mockResolvedValue(null),
    createTodo: vi.fn().mockResolvedValue(createdTodo),
    updateTodo: vi.fn().mockResolvedValue(createdTodo),
    deleteTodo: vi.fn().mockResolvedValue(true),
  } satisfies TodoRepository;
};

describe("NewTodo", () => {
  it("renders the form fields", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <NewTodo />,
        },
      ],
      { initialEntries: ["/"] }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText("新しいTodoを追加")).toBeTruthy();
    expect(screen.getByLabelText("タイトル")).toBeTruthy();
    expect(screen.getByLabelText("説明")).toBeTruthy();
    expect(screen.getByRole("button", { name: "作成する" })).toBeTruthy();
  });
});

describe("createNewTodoAction", () => {
  it("returns validation errors when required fields are missing", async () => {
    const repository = createRepository();
    const action = createNewTodoAction(repository);
    const formData = new FormData();
    formData.set("title", "   ");
    formData.set("description", "");

    const response = await action({
      request: new Request("http://localhost/todos/new", {
        method: "POST",
        body: formData,
      }),
    });

    expect(response.status).toBe(400);
    const data = (await response.json()) as NewTodoActionData;
    expect(data.errors).toEqual({
      title: "タイトルを入力してください。",
      description: "説明を入力してください。",
    });
    expect(repository.createTodo).not.toHaveBeenCalled();
  });

  it("redirects after successful creation", async () => {
    const repository = createRepository();
    const action = createNewTodoAction(repository);
    const formData = new FormData();
    formData.set("title", "  Ship new release ");
    formData.set("description", "  Coordinate docs and QA ");

    const response = await action({
      request: new Request("http://localhost/todos/new", {
        method: "POST",
        body: formData,
      }),
    });

    expect(repository.createTodo).toHaveBeenCalledWith({
      title: "Ship new release",
      description: "Coordinate docs and QA",
      completed: false,
    });
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/");
  });
});
