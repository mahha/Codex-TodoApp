import type { Route } from "./+types/api.todos.$id";
import { getTodoRepository, type TodoRepository } from "../lib/todos.server";
import type { TodoInput } from "../lib/todos";

type PartialTodoPayload = Partial<TodoInput>;

const badRequest = (message: string) =>
  Response.json({ error: message }, { status: 400 });

const notFound = () => Response.json({ error: "Not Found" }, { status: 404 });

const methodNotAllowed = () =>
  Response.json({ error: "Method Not Allowed" }, { status: 405 });

const parsePartialPayload = (value: unknown): PartialTodoPayload | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as PartialTodoPayload;
  const payload: PartialTodoPayload = {};

  if (candidate.title !== undefined) {
    if (typeof candidate.title !== "string" || candidate.title.trim().length === 0) {
      return null;
    }
    payload.title = candidate.title.trim();
  }

  if (candidate.description !== undefined) {
    if (
      typeof candidate.description !== "string" ||
      candidate.description.trim().length === 0
    ) {
      return null;
    }
    payload.description = candidate.description.trim();
  }

  if (candidate.completed !== undefined) {
    if (typeof candidate.completed !== "boolean") {
      return null;
    }
    payload.completed = candidate.completed;
  }

  if (
    payload.title === undefined &&
    payload.description === undefined &&
    payload.completed === undefined
  ) {
    return null;
  }

  return payload;
};

export function createTodoByIdHandlers(repository: TodoRepository) {
  return {
    async loader({ params }: Pick<Route.LoaderArgs, "params">) {
      if (!params.id) {
        return badRequest("Todo id is required.");
      }

      const todo = await repository.getTodo(params.id);
      if (!todo) {
        return notFound();
      }

      return Response.json({ todo });
    },
    async action({ params, request }: Pick<Route.ActionArgs, "params" | "request">) {
      if (!params.id) {
        return badRequest("Todo id is required.");
      }

      if (request.method === "PUT") {
        let payload: PartialTodoPayload | null = null;
        try {
          payload = parsePartialPayload(await request.json());
        } catch {
          return badRequest("Invalid JSON payload.");
        }

        if (!payload) {
          return badRequest("Invalid todo payload.");
        }

        const todo = await repository.updateTodo(params.id, payload);
        if (!todo) {
          return notFound();
        }

        return Response.json({ todo });
      }

      if (request.method === "DELETE") {
        const removed = await repository.deleteTodo(params.id);
        if (!removed) {
          return notFound();
        }

        return Response.json({ deleted: true });
      }

      return methodNotAllowed();
    },
  };
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createTodoByIdHandlers(repository).loader({ params });
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createTodoByIdHandlers(repository).action({ params, request });
}
