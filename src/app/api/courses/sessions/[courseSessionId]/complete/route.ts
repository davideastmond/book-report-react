import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { academicTask, courseSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// This endpoint marks a course session as complete.
export async function PATCH(
  _: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authRequest = await getServerSession(authOptions);
  if (!authRequest || !authRequest.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (!["admin", "teacher"].includes(authRequest.user.role)) {
    return NextResponse.json(
      {
        error: "Unauthorized access.",
      },
      { status: 403 }
    );
  }
  const { courseSessionId } = await urlData.params;

  // Find a course session by ID. Make sure it exists. Make sure it's in the correct state

  try {
    const fndCourse = await db.query.courseSession.findFirst({
      where: eq(courseSession.id, courseSessionId),
    });
    if (!fndCourse) {
      return NextResponse.json(
        {
          error: "Course session not found.",
        },
        { status: 404 }
      );
    }

    if (fndCourse.isCompleted) {
      return NextResponse.json(
        {
          error: "Course session is already marked as complete.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching course session:", error);
    return NextResponse.json(
      {
        error: "Error fetching course session: " + (error as Error).message,
      },
      { status: 500 }
    );
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
        return NextResponse.json(
          {
            error: "All course work must have a weight percentage.",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching course work: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
  try {
    await db
      .update(courseSession)
      .set({ isCompleted: true })
      .where(eq(courseSession.id, courseSessionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Error marking course session as complete: " +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}
