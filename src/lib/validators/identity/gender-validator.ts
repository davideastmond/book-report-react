import { z } from "zod";

export const genderValidator = z.object({
  gender: z.enum(["male", "female", "other"]),
});
