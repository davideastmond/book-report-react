"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { EnrolledStudent } from "@/lib/types/db/course-session-info";

import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiGetEnrolledStudents(): Promise<
  ApiResult<EnrolledStudent[]>
> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!["admin", "teacher"].includes(authSession.user.role)) {
    return {
      success: false,
      message: "Forbidden access",
    };
  }

  try {
    const res = await db
      .select({
        studentId: user.id,
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        studentEmail: user.email,
        studentDob: user.dob,
      })
      .from(user)
      .where(eq(user.role, "student"));

    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      message:
        "An error occurred while fetching users: " + (error as Error).message,
    };
  }
}
