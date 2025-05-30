export const TaskType = {
  ASSIGNMENT: "assignment",
  EXAM: "exam",
  OTHER: "other",
} as const;
export type TaskType = (typeof TaskType)[keyof typeof TaskType];
