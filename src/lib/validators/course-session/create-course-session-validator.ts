import { z } from "zod";

export const createCourseSessionValidator = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  sessionStart: z.string().date(),
  sessionEnd: z.string().date(),
});
