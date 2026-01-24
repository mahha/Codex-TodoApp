import type { Route } from "./+types/api.todos";
import { getTodoRepository, type TodoRepository } from "../lib/todos.server";
import type { TodoInput } from "../lib/todos";

type TodoPayload = {
  title: string;
  description: string;
  completed?: boolean;
};

const badRequest = (message: string) =>
  Response.json({ error: message }, { status: 400 });

const methodNotAllowed = () =>
  Response.json({ error: "Method Not Allowed" }, { status: 405 });

const isTodoPayload = (value: unknown): value is TodoPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TodoPayload>;
  const completedValid =
    candidate.completed === undefined || typeof candidate.completed === "boolean";
  return (
    typeof candidate.title === "string" &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === "string" &&
    candidate.description.trim().length > 0 &&
    completedValid
  );
};

export function createTodosHandlers(repository: TodoRepository) {
  return {
    async loader() {
      const todos = await repository.listTodos();
      return Response.json({ todos });
    },
    async action({ request }: Pick<Route.ActionArgs, "request">) {
      if (request.method !== "POST") {
        return methodNotAllowed();
      }

      let payload: TodoInput;
      try {
        const body = await request.json();
        if (!isTodoPayload(body)) {
          return badRequest("Invalid todo payload.");
        }
        payload = {
          title: body.title.trim(),
          description: body.description.trim(),
          completed: body.completed,
        };
      } catch {
        return badRequest("Invalid JSON payload.");
      }

      const todo = await repository.createTodo(payload);
      return Response.json({ todo }, { status: 201 });
    },
  };
}

export async function loader({ context }: Route.LoaderArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createTodosHandlers(repository).loader();
}

export async function action({ context, request }: Route.ActionArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createTodosHandlers(repository).action({ request });
}
