export type Todo = {
  id: string;
  title: string;
  description: string;
  status: "open" | "done";
  tag: string;
  dueLabel: string;
};

export const mockTodos: Todo[] = [
  {
    id: "todo-1",
    title: "Design review with team",
    description: "Finalize the flow for the new onboarding screens.",
    status: "open",
    tag: "Design",
    dueLabel: "Today · 10:00",
  },
  {
    id: "todo-2",
    title: "Update project roadmap",
    description: "Align milestones with Q2 priorities and dependencies.",
    status: "open",
    tag: "Planning",
    dueLabel: "Today · 14:30",
  },
  {
    id: "todo-3",
    title: "Send weekly status report",
    description: "Share progress, blockers, and next steps.",
    status: "done",
    tag: "Ops",
    dueLabel: "Yesterday · 18:00",
  },
  {
    id: "todo-4",
    title: "Prepare demo assets",
    description: "Polish screenshots and narrative for the demo.",
    status: "open",
    tag: "Marketing",
    dueLabel: "Tomorrow · 09:00",
  },
];
