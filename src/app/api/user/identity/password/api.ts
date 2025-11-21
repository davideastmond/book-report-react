"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiUpdateUserIdentityPassword(
  userId: string,
  password: string
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  if (!password || password.length < 8) {
    //TODO: Add more password validation rules as needed
    return {
      success: false,
      message: "Password must be at least 8 characters long",
    };
  }

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // A user is found, update the user's password, using bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(user).set({ hashedPassword }).where(eq(user.id, userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update password:", error);
    return {
      success: false,
      message: "Failed to update password",
    };
  }
}
