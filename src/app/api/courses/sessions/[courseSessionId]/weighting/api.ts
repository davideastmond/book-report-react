"use server";

import { db } from "@/db/index";
import { academicTask, GradeWeight, gradeWeight } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function apiGetCourseWeightings(
  courseSessionId: string
): Promise<ApiResult<GradeWeight[]>> {
  try {
    const weights = await db.query.gradeWeight.findMany({
      where: eq(gradeWeight.courseSessionId, courseSessionId),
    });
    return {
      success: true,
      data: weights,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching weights: " + (error as Error).message,
    };
  }
}

export async function apiCreateCourseWeighting(
  courseSessionId: string,
  payload: GradeWeight[]
): Promise<ApiResult<void>> {
  // Validate the request body
  try {
    weightDataValidator.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Validation error: " + error.errors.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      message: "Unknown validation error",
    };
  }

  // The weightings for a course session need to add up to 100%
  // The validator should ensure this.
  // Since this is a POST request, we assume the weightings are being created or updated.

  // Any existing academic tasks that reference these weights also need to be nullified
  try {
    console.info(
      "Nullifying academic tasks that reference these weights for course session:",
      courseSessionId
    );
    await db
      .update(academicTask)
      .set({ gradeWeightId: null })
      .where(eq(academicTask.courseSessionId, courseSessionId));
  } catch (error) {
    console.error(
      "Error nullifying academic tasks referencing these weights:",
      (error as Error).message
    );
  }

  try {
    console.info(
      "Attempting to delete existing weights for course session:",
      courseSessionId
    );
    await db
      .delete(gradeWeight)
      .where(eq(gradeWeight.courseSessionId, courseSessionId));
  } catch (error) {
    console.error("Error deleting existing weights:", (error as Error).message);
  }

  // Now insert the new weights.
  const dataToInsert = payload.map((w) => {
    const elementId = crypto.randomUUID();
    return {
      courseSessionId: courseSessionId,
      id: elementId,
      name: w.name,
      percentage: w.percentage,
      keyTag: `keyTag_${elementId}`,
    };
  });

  try {
    console.info("Inserting new weights for course session:", courseSessionId);
    await db.insert(gradeWeight).values(dataToInsert);
    console.info(`Inserted ${dataToInsert.length} weights successfully`);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error inserting new weights:", (error as Error).message);
    return {
      success: false,
      message: "Error inserting new weights: " + (error as Error).message,
    };
  }
}
