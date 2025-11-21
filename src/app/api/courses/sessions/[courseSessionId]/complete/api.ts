"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { academicTask, courseSession, gradeWeight } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

// This endpoint marks a course session as complete.
export async function apiMarkCourseSessionAsCompleted(
  courseSessionId: string
): Promise<ApiResult<null>> {
  const authRequest = await getServerSession(authOptions);
  if (!authRequest || !authRequest.user) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  if (!["admin", "teacher"].includes(authRequest.user.role)) {
    return {
      success: false,
      message: "Unauthorized access.",
    };
  }

  // Find a course session by ID. Make sure it exists. Make sure it's in the correct state

  try {
    const fndCourse = await db.query.courseSession.findFirst({
      where: eq(courseSession.id, courseSessionId),
    });
    if (!fndCourse) {
      return {
        success: false,
        message: "Course session not found.",
      };
    }

    if (fndCourse.isCompleted) {
      return {
        success: false,
        message: "Course session is already completed.",
      };
    }
  } catch (error) {
    console.error("Error fetching course session:", error);
    return {
      success: false,
      message: "Error fetching course session: " + (error as Error).message,
    };
  }
  // As a validation measure, all course-work should have a weight percentage
  try {
    const results = await db.query.academicTask.findMany({
      where: eq(academicTask.courseSessionId, courseSessionId),
    });
    if (results.length > 0) {
      const allWeightsPresent = results.every(
        (task) => task.gradeWeightId !== null
      );
      if (!allWeightsPresent) {
        return {
          success: false,
          message: "All course work must have a weight percentage.",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Error validating course work weights: " + (error as Error).message,
    };
  }

  // There should also be at least one academic task for each grading weight
  // associated with the course session.
  // This is to prevent situations where a grading weight exists but no tasks are assigned to it.
  try {
    const tasksAndWeights = await db
      .select()
      .from(gradeWeight)
      .where(eq(gradeWeight.courseSessionId, courseSessionId))
      .leftJoin(academicTask, eq(gradeWeight.id, academicTask.gradeWeightId));

    const validation = tasksAndWeights.some(
      (item) => item.academic_task === null
    );
    if (validation) {
      return {
        success: false,
        status: 422,
        message:
          "weights-tasks-count-mismatch: Each grading weight must have at least one academic task assigned.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        "Error validating course work and weightings - matching tasks and weights are assigned: " +
        (error as Error).message,
    };
  }

  try {
    await db
      .update(courseSession)
      .set({ isCompleted: true })
      .where(eq(courseSession.id, courseSessionId));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        "Error marking course session as completed: " +
        (error as Error).message,
    };
  }
}
