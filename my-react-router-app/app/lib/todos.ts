export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
};
export type TodoInput = {
  title: string;
  description: string;
  completed?: boolean;
};
