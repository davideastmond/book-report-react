"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { genderValidator } from "@/lib/validators/identity/gender-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import z from "zod";

export async function apiUpdateUserIdentityGender(
  userId: string,
  gender: "male" | "female" | "other"
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  // Ensures student can only access their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  try {
    genderValidator.parse({ gender });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((err) => err.message).join(", "),
      };
    }
  }

  try {
    await db.update(user).set({ gender }).where(eq(user.id, userId));
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to update gender: " + (err as Error).message,
    };
  }
}
