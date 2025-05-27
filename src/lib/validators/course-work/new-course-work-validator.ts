import z from "zod";

export const newCourseWorkValidator = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  taskType: z.enum(["assignment", "exam", "other"]).default("assignment"),
  dueDate: z.string().date(),
});
