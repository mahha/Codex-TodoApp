export type Todo = {
  id: string;
  title: string;
  description: string;
};

export const mockTodos: Todo[] = [
  {
    id: "todo-1",
    title: "Grocery Shopping",
    description: "Buy vegetables and fruits",
  },
  {
    id: "todo-2",
    title: "Finish Report",
    description: "Due by EOD",
  },
  {
    id: "todo-3",
    title: "Call Plumber",
    description: "Fix kitchen sink",
  },
  {
    id: "todo-4",
    title: "Workout",
    description: "1hour of cardio",
  },
  {
    id: "todo-5",
    title: "Read Book",
    description: "Chapter 5 pof ‘Atomic Habits’",
  },
];
