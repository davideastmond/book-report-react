import { object, z } from "zod";
export const registrationValidator = object({
  firstName: z.string().max(50).nonempty(),
  lastName: z.string().max(50).nonempty(),
  email: z.string().email().nonempty(),
  password1: z.string().min(8).max(50).nonempty(),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().date(),
});

export const registrationValidatorWithConfirmPassword = registrationValidator
  .extend({
    password2: z.string().min(8).max(50).nonempty(),
  })

  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
  });
