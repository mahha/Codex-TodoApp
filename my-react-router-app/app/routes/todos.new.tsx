import type { Route } from "./+types/todos.new";
import { Form, Link, redirect, useActionData } from "react-router";
import { getTodoRepository, type TodoRepository } from "../lib/todos.server";

type ActionData = {
  errors?: {
    title?: string;
    description?: string;
  };
  values?: {
    title?: string;
    description?: string;
  };
};

export type NewTodoActionData = ActionData;

export function meta() {
  return [
    { title: "New Todo" },
    { name: "description", content: "Create a new todo item." },
  ];
}

export function createNewTodoAction(repository: TodoRepository) {
  return async function newTodoAction({
    request,
  }: Pick<Route.ActionArgs, "request">) {
    const formData = await request.formData();
    const rawTitle = formData.get("title");
    const rawDescription = formData.get("description");

    const title =
      typeof rawTitle === "string" ? rawTitle.trim() : "";
    const description =
      typeof rawDescription === "string" ? rawDescription.trim() : "";

    const errors: ActionData["errors"] = {};
    if (!title) {
      errors.title = "タイトルを入力してください。";
    }
    if (!description) {
      errors.description = "説明を入力してください。";
    }

    if (errors.title || errors.description) {
      return Response.json(
        {
          errors,
          values: {
            title: typeof rawTitle === "string" ? rawTitle : "",
            description:
              typeof rawDescription === "string" ? rawDescription : "",
          },
        },
        { status: 400 }
      );
    }

    await repository.createTodo({ title, description, completed: false });
    return redirect("/");
  };
}

export async function action({ context, request }: Route.ActionArgs) {
  const repository = await getTodoRepository({ env: context.cloudflare.env });
  return createNewTodoAction(repository)({ request });
}

export default function NewTodo() {
  const actionData = useActionData<NewTodoActionData>();
  const errors = actionData?.errors ?? {};
  const values = actionData?.values ?? {};

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-md px-6 pb-14 pt-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            New Task
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-black">
            新しいTodoを追加
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            今日やることを入力して、リストに追加しましょう。
          </p>
        </header>

        <Form method="post" className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-black">
              タイトル
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={values.title}
              aria-invalid={Boolean(errors.title) || undefined}
              aria-describedby={errors.title ? "title-error" : undefined}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-[#2920af] focus:ring-2 focus:ring-[#2920af]/20"
              placeholder="例: 企画書のドラフトを作る"
            />
            {errors.title ? (
              <p
                id="title-error"
                role="alert"
                className="mt-2 text-xs text-red-600"
              >
                {errors.title}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-black"
            >
              説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              defaultValue={values.description}
              aria-invalid={Boolean(errors.description) || undefined}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none transition focus:border-[#2920af] focus:ring-2 focus:ring-[#2920af]/20"
              placeholder="例: 目的、締切、関係者をメモする"
            />
            {errors.description ? (
              <p
                id="description-error"
                role="alert"
                className="mt-2 text-xs text-red-600"
              >
                {errors.description}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/"
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="rounded-full bg-[#2920af] px-5 py-2 text-sm font-medium text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2920af]"
            >
              作成する
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
