import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Route } from "./+types/home";
import Home from "./home";
import type { Todo } from "../lib/todos";

describe("Home", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    cleanup();
  });

  const buildTodos = (): Todo[] => [
    {
      id: "todo-1",
      title: "Active Task",
      description: "Needs to be done",
      createdAt: new Date().toISOString(),
      completed: false,
    },
    {
      id: "todo-2",
      title: "Completed Task",
      description: "Already done",
      createdAt: new Date().toISOString(),
      completed: true,
    },
  ];

  const renderHome = (initialEntry: string, todos: Todo[]) => {
    const props: Route.ComponentProps = {
      loaderData: { todos },
      params: {},
      matches: [] as unknown as Route.ComponentProps["matches"],
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <Home {...props} />,
        },
      ],
      { initialEntries: [initialEntry] }
    );

    render(<RouterProvider router={router} />);
  };

  it("renders tabs and filters active todos by default", () => {
    const todos = buildTodos();
    renderHome("/", todos);

    expect(screen.getByText("ToDo App")).toBeTruthy();
    expect(screen.getByRole("link", { name: "+ Add" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "未完了" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "完了" })).toBeTruthy();
    expect(screen.getByText("Active Task")).toBeTruthy();
    expect(screen.queryByText("Completed Task")).toBeNull();
  });

  it("moves a todo between tabs when toggled", async () => {
    const todos = buildTodos();
    const updatedTodo = { ...todos[0], completed: true };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ todo: updatedTodo }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    renderHome("/?status=active", todos);

    const activeCheckbox = screen.getByRole("checkbox", {
      name: /Active Task/,
    });
    fireEvent.click(activeCheckbox);

    await waitFor(() => {
      expect(screen.queryByText("Active Task")).toBeNull();
    });

    fireEvent.click(screen.getByRole("link", { name: "完了" }));

    await waitFor(() => {
      expect(screen.getByText("Active Task")).toBeTruthy();
    });
  });
});
