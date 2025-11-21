"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { courseSession } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiToggleLockedStatusForCourseSession(
  courseSessionId: string
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // This route is only for admins / teachers
  if (["student"].includes(authSession.user.role)) {
    return {
      success: false,
      message: "Forbidden: Incorrect access level",
    };
  }

  try {
    await db
      .update(courseSession)
      .set({
        isLocked: sql`NOT ${courseSession.isLocked}`,
      })
      .where(eq(courseSession.id, courseSessionId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Failed to toggle lock status: " + (error as Error).message,
    };
  }
}
