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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1ea_0%,#f9f7f3_45%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-12 sm:py-16">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Today
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              My Tasks
            </h1>
            <p className="mt-3 max-w-lg text-base text-slate-600">
              A quick overview of what needs your focus next.
            </p>
          </div>
          <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            {todos.length} tasks
          </div>
        </header>

        <section className="mt-10 rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <ul className="space-y-4">
            {todos.map((todo) => {
              const statusClasses =
                todo.status === "done"
                  ? "bg-emerald-500 text-emerald-900"
                  : "bg-amber-400 text-amber-950";

              return (
                <li
                  key={todo.id}
                  className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-2 inline-flex h-3 w-3 flex-none rounded-full ${statusClasses}`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {todo.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {todo.description}
                      </p>
                      <span
                        className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClasses}`}
                      >
                        {todo.status === "done" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-sm text-slate-500 sm:flex-col sm:items-end">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {todo.tag}
                    </span>
                    <span className="font-medium text-slate-600">
                      {todo.dueLabel}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
