export const TaskType = {
  ASSIGNMENT: "assignment",
  EXAM: "exam",
  ESSAY: "essay",
  PRESENTATION: "presentation",
  RESEARCH_PAPER: "research_paper",
  OTHER: "other",
} as const;
export type TaskType = (typeof TaskType)[keyof typeof TaskType];
