"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { User, user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// sample URL: /api/user/identity?userId=12345
export async function apiGetUserIdentity(
  userId: string
): Promise<ApiResult<Partial<User>>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // Teachers and admins can access this endpoint
  // Students can only access their own identity

  // Ensures student can only access their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  // Retrieve the user identity from the database
  const userIdentity = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      email: user.email,
      dob: user.dob,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (userIdentity.length === 0) {
    return {
      success: false,
      message: "User not found",
    };
  }
  return {
    success: true,
    data: userIdentity[0],
  };
}

export async function apiUpdateUserIdentityNames(
  userId: string,
  updatedData: { firstName?: string; lastName?: string }
): Promise<ApiResult<Partial<User>>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // Ensures student can only update their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  try {
    const updatedUser = await db
      .update(user)
      .set(updatedData)
      .where(eq(user.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return {
        success: false,
        message: "User not found or not updated",
      };
    }
    return {
      success: true,
      data: updatedUser[0],
    };
  } catch (error) {
    console.error("Error updating user identity:", error);
    return {
      success: false,
      message: "An error occurred while updating user identity",
    };
  }
}
