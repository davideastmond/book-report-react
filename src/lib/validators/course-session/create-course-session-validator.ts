import { z } from "zod";

export const createCourseSessionValidator = z
  .object({
    courseId: z.string().min(1, "Course ID is required"),
    sessionStart: z.string().date(),
    sessionEnd: z.string().date(),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters")
      .optional(),
    studentAllotment: z.coerce
      .number()
      .min(1, "Student allotment must be at least 1"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.sessionStart);
      const endDate = new Date(data.sessionEnd);

      console.log("studentAllotment", data.studentAllotment);
      return startDate < endDate;
    },
    { message: "Ensure dates are valid", path: ["sessionStart", "sessionEnd"] }
  );
