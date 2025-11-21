"use server";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { registrationValidator } from "@/lib/validators/registration/registration-validator";
import { hashSync } from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type RegistrationRequest = {
  email: string;
  password1: string;
  password2: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female" | "other";
};
export async function apiRegisterUser(
  registrationData: RegistrationRequest
): Promise<ApiResult<null>> {
  try {
    registrationValidator.parse(registrationData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation Error",
      };
    }
  }
  const { email } = registrationData;

  try {
    // Attempt to register the user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message + " - Error while checking user",
    };
  }

  try {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      hashedPassword: hashSync(registrationData.password1, 10),
      dob: new Date(registrationData.dob),
      gender: registrationData.gender,
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message + " - Error while inserting user",
    };
  }
}
