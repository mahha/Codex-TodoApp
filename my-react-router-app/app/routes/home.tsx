import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { Link, useSearchParams } from "react-router";
import type { Todo } from "../lib/todos";
import { getTodoRepository, type TodoRepository } from "../lib/todos.server";

export function meta() {
  return [
    { title: "ToDo List" },
    { name: "description", content: "Personal tasks overview." },
  ];
}

export function createHomeLoader(repository: TodoRepository) {
  return async function loadHomeTodos() {
    const todos = await repository.listTodos();
    return { todos };
  };
}

export async function loader({ context }: Route.LoaderArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createHomeLoader(repository)();
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;
  const name = "name";
  const [searchParams] = useSearchParams();
  const [todoItems, setTodoItems] = useState<Todo[]>(todos);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  const currentStatus =
    searchParams.get("status") === "completed" ? "completed" : "active";

  useEffect(() => {
    setTodoItems(todos);
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todoItems.filter((todo) =>
      currentStatus === "completed" ? todo.completed : !todo.completed
    );
  }, [todoItems, currentStatus]);

  const toggleTodo = async (todo: Todo) => {
    const nextCompleted = !todo.completed;

    setErrorById((prev) => {
      if (!prev[todo.id]) {
        return prev;
      }
      const { [todo.id]: _ignored, ...rest } = prev;
      return rest;
    });
    setUpdatingIds((prev) => ({ ...prev, [todo.id]: true }));
    setTodoItems((prev) =>
      prev.map((item) =>
        item.id === todo.id ? { ...item, completed: nextCompleted } : item
      )
    );

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo.");
      }

      const data = (await response.json()) as { todo?: Todo };
      const updatedTodo = data.todo;
      if (updatedTodo) {
        setTodoItems((prev) =>
          prev.map((item) => (item.id === todo.id ? updatedTodo : item))
        );
      }
    } catch {
      setTodoItems((prev) =>
        prev.map((item) =>
          item.id === todo.id ? { ...item, completed: todo.completed } : item
        )
      );
      setErrorById((prev) => ({
        ...prev,
        [todo.id]: "更新に失敗しました。もう一度お試しください。",
      }));
    } finally {
      setUpdatingIds((prev) => {
        const { [todo.id]: _ignored, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-md px-6 pb-14 pt-8">
        <h1 className="text-center text-xl font-bold">ToDo App</h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          こんにちは、{name}さん
        </p>

        <section className="mt-6">
          <div className="flex items-center justify-center">
            <div className="inline-flex rounded-full border border-black/10 bg-black/5 p-1 text-xs font-medium text-black">
              {[
                { key: "active", label: "未完了" },
                { key: "completed", label: "完了" },
              ].map((tab) => {
                const isActive = currentStatus === tab.key;
                return (
                  <Link
                    key={tab.key}
                    to={`/?status=${tab.key}`}
                    viewTransition
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-4 py-1.5 transition ${
                      isActive
                        ? "bg-white text-black shadow-sm"
                        : "text-black/60 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <ul className="mt-6 space-y-5">
            {visibleTodos.map((todo) => {
              const isUpdating = Boolean(updatingIds[todo.id]);
              const inputId = `todo-${todo.id}`;
              return (
                <li key={todo.id} className="border-b border-black/15 pb-5">
                  <label className="flex items-start gap-4" htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="checkbox"
                      className="mt-1 h-4 w-4 flex-none rounded-sm border border-black"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      disabled={isUpdating}
                    />
                    <div>
                      <p
                        className={`text-sm font-normal ${
                          todo.completed
                            ? "text-neutral-400 line-through"
                            : "text-black"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          todo.completed ? "text-neutral-400" : "text-neutral-500"
                        }`}
                      >
                        {todo.description}
                      </p>
                      {isUpdating ? (
                        <p className="mt-2 text-xs text-neutral-500">
                          更新中...
                        </p>
                      ) : null}
                      {errorById[todo.id] ? (
                        <p className="mt-2 text-xs text-red-600">
                          {errorById[todo.id]}
                        </p>
                      ) : null}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            to="/todos/new"
            className="rounded-full bg-[#2920af] px-4 py-2 text-sm font-normal text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2920af]"
          >
            + Add
          </Link>
        </div>
      </div>
    </main>
  );
}
