import { z } from "zod";

export const addStudentValidator = z.object({
  userId: z.string().uuid().nonempty(),
});
