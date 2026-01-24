import type { Route } from "./+types/home";
import { mockTodos } from "../lib/todos";

export function meta() {
  return [
    { title: "ToDo List" },
    { name: "description", content: "Personal tasks overview." },
  ];
}

export function loader() {
  return { todos: mockTodos };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;
  const name = "name";

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-md px-6 pb-14 pt-8">
        <h1 className="text-center text-xl font-bold">ToDo App</h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          こんにちは、{name}さん
        </p>

        <section className="mt-6">
          <ul className="space-y-5">
            {todos.map((todo) => (
              <li key={todo.id} className="border-b border-black/15 pb-5">
                <div className="flex items-start gap-4">
                  <span
                    className="mt-1 h-4 w-4 flex-none rounded-sm border border-black"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-normal text-black">
                      {todo.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {todo.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-[#2920af] px-4 py-2 text-sm font-normal text-white"
          >
            + Add Task
          </button>
        </div>
      </div>
    </main>
  );
}
