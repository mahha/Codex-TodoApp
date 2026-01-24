export type SeedTodo = {
  title: string;
  description: string;
  completed: boolean;
};

export const seedTodos: SeedTodo[] = [
  {
    title: "Grocery Shopping",
    description: "Buy vegetables and fruits",
    completed: false,
  },
  {
    title: "Finish Report",
    description: "Due by EOD",
    completed: false,
  },
  {
    title: "Call Plumber",
    description: "Fix kitchen sink",
    completed: false,
  },
  {
    title: "Workout",
    description: "1hour of cardio",
    completed: false,
  },
  {
    title: "Read Book",
    description: "Chapter 5 pof 'Atomic Habits'",
    completed: false,
  },
];
