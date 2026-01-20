import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Route } from "./+types/home";
import Home from "./home";
import { mockTodos } from "../lib/todos";

describe("Home", () => {
  it("renders the todo list", () => {
    const props: Route.ComponentProps = {
      loaderData: { todos: mockTodos },
      params: {},
      matches: [] as unknown as Route.ComponentProps["matches"],
    };

    render(<Home {...props} />);

    expect(screen.getByText("My Tasks")).toBeTruthy();
    mockTodos.forEach((todo) => {
      expect(screen.getByText(todo.title)).toBeTruthy();
    });
  });
});
