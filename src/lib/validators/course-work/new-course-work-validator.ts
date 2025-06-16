import z from "zod";

export const newCourseWorkValidator = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  gradeWeightId: z.string().min(1, "Grade weight ID is required"),
  taskType: z
    .enum([
      "assignment",
      "exam",
      "essay",
      "presentation",
      "research_paper",
      "other",
    ])
    .default("assignment"),
  dueDate: z.string().date(),
  gradeValueType: z.enum(["p", "l"]).default("p"),
});
