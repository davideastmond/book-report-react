"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { AcademicTask, academicTask, gradeWeight } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { AcademicTaskWithWeighting } from "@/lib/types/course-work/definitions";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import z from "zod";

// This route handles creating new course work for a course session.
export async function apiCreateCourseWork(
  courseSessionId: string,
  data: Partial<AcademicTask>
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  // User needs to be an admin or teacher
  if (!["admin", "teacher"].includes(authSession.user.role)) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  try {
    newCourseWorkValidator.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Validation error" + error.errors.map((e) => e.message).join(", "),
      };
    }
  }
  const {
    name,
    description,
    taskType,
    dueDate,
    gradeValueType,
    gradeWeightId,
  } = data;
  try {
    await db
      .insert(academicTask)
      .values({
        id: crypto.randomUUID(),
        courseSessionId,
        name: name!,
        description,
        taskType,
        dueDate: dueDate ? new Date(dueDate) : null,
        gradeValueType,
        gradeWeightId,
      })
      .returning({ insertedId: academicTask.id });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating course work:", error);
    return {
      success: false,
      message: "Failed to create course work: " + (error as Error).message,
    };
  }
}

// Get the course work for a specific course session.
export async function apiGetCourseWorkForSession(
  courseSessionId: string
): Promise<ApiResult<AcademicTaskWithWeighting[]>> {
  // Think about the user role, a student should be able to see the course work for a course session
  try {
    const courseWorks = await db
      .select({
        id: academicTask.id,
        name: academicTask.name,
        description: academicTask.description,
        taskType: academicTask.taskType,
        dueDate: academicTask.dueDate,
        gradeWeightPercentage: gradeWeight.percentage,
        gradeWeightId: academicTask.gradeWeightId,
        gradeWeightName: gradeWeight.name,
        courseSessionId: academicTask.courseSessionId,
      })
      .from(academicTask)
      .where(eq(academicTask.courseSessionId, courseSessionId))
      .fullJoin(gradeWeight, eq(academicTask.gradeWeightId, gradeWeight.id));
    return {
      success: true,
      data: courseWorks as AcademicTaskWithWeighting[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch course work: " + (error as Error).message,
    };
  }
}
