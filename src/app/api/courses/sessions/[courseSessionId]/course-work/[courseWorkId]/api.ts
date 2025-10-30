"use server";
import { db } from "@/db/index";
import { AcademicTask, academicTask } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { eq } from "drizzle-orm";
import z from "zod";

export async function apiGetCourseWorkById(
  courseWorkId: string
): Promise<ApiResult<AcademicTask>> {
  try {
    const foundAcademicTask = await db.query.academicTask.findFirst({
      where: eq(academicTask.id, courseWorkId),
    });

    if (!foundAcademicTask) {
      return {
        success: false,
        message: "Academic task (course work) not found",
      };
    }

    return {
      success: true,
      data: foundAcademicTask,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching course work: " + (error as Error).message,
    };
  }
}

export async function apiUpdateCourseWorkAttributesById(
  courseWorkId: string,
  data: Partial<AcademicTask>
): Promise<ApiResult<null>> {
  try {
    // Validate the body content if necessary
    newCourseWorkValidator.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Validation error: " + error.errors.map((e) => e.message).join(", "),
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
    const updatedAcademicTask = await db
      .update(academicTask)
      .set({
        name,
        description,
        taskType,
        dueDate: dueDate ? new Date(dueDate) : null,
        gradeValueType,
        gradeWeightId,
      })
      .where(eq(academicTask.id, courseWorkId))
      .returning();

    if (updatedAcademicTask.length === 0) {
      return {
        success: false,
        message: "Academic task (course work) not found for update",
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error updating course work: " + (error as Error).message,
    };
  }
}
