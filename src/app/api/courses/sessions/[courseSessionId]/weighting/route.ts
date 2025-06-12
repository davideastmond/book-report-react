import { authOptions } from "@/auth/auth";

import { db } from "@/db/index";
import { academicTask, gradeWeight } from "@/db/schema";
import { WeightingData } from "@/lib/types/weighting/weighting-data";
import { weightDataValidator } from "@/lib/validators/weightings/weight-data-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  _: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { courseSessionId } = await urlData.params;

  try {
    const weights = await db.query.gradeWeight.findMany({
      where: eq(gradeWeight.courseSessionId, courseSessionId),
    });
    return NextResponse.json(weights);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching weights: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { courseSessionId } = await urlData.params;
  const requestBody = (await req.json()) as WeightingData;

  // Validate the request body
  try {
    weightDataValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Invalid request data",
      },
      { status: 400 }
    );
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
  const dataToInsert = requestBody.map((w) => {
    return {
      courseSessionId: courseSessionId,
      id: crypto.randomUUID(),
      ...w,
    };
  });

  try {
    console.info("Inserting new weights for course session:", courseSessionId);
    await db.insert(gradeWeight).values(dataToInsert);
    console.info(`Inserted ${dataToInsert.length} weights successfully`);
    return NextResponse.json({
      success: true,
      message: "Course weighting created successfully",
    });
  } catch (error) {
    console.error("Error inserting new weights:", (error as Error).message);
    return NextResponse.json(
      {
        error: "Failed to create course weighting",
      },
      { status: 500 }
    );
  }
}
