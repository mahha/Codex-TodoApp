import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import type { Route } from "./+types/home";
import Home from "./home";
import { seedTodos } from "../lib/seed-data";

const todos = seedTodos.map((todo, index) => ({
  id: `seed-${index + 1}`,
  title: todo.title,
  description: todo.description,
  createdAt: new Date().toISOString(),
  completed: todo.completed,
}));

describe("Home", () => {
  it("renders the todo list", () => {
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
      { initialEntries: ["/"] }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText("ToDo App")).toBeTruthy();
    expect(screen.getByRole("link", { name: "+ Add" })).toBeTruthy();
    todos.forEach((todo) => {
      expect(screen.getByText(todo.title)).toBeTruthy();
    });
  });
});
