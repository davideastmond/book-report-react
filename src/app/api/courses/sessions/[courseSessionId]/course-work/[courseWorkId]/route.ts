import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { academicTask } from "@/db/schema";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(
  req: Request,
  urlData: {
    params: Promise<{ courseSessionId: string; courseWorkId: string }>;
  }
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

  const { courseSessionId, courseWorkId } = await urlData.params;

  if (!courseSessionId || !courseWorkId) {
    return NextResponse.json(
      {
        error: "Course session ID and course work ID are required",
      },
      { status: 400 }
    );
  }

  try {
    const foundAcademicTask = await db.query.academicTask.findFirst({
      where: eq(academicTask.id, courseWorkId),
    });

    if (!foundAcademicTask) {
      return NextResponse.json(
        {
          error: "Academic task (course work) not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(foundAcademicTask);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching course work: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  urlData: {
    params: Promise<{ courseSessionId: string; courseWorkId: string }>;
  }
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

  const { courseSessionId, courseWorkId } = await urlData.params;
  if (!courseSessionId || !courseWorkId) {
    return NextResponse.json(
      {
        error: "Course session ID and course work ID are required",
      },
      { status: 400 }
    );
  }

  const requestBody = await req.json();
  try {
    // Validate the body content if necessary
    newCourseWorkValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors,
        },
        { status: 400 }
      );
    }
  }
  const { name, description, taskType, dueDate, gradeValueType } = requestBody;
  try {
    const updatedAcademicTask = await db
      .update(academicTask)
      .set({
        name,
        description,
        taskType,
        dueDate: dueDate ? new Date(dueDate) : null,
        gradeValueType,
      })
      .where(eq(academicTask.id, courseWorkId))
      .returning();

    if (updatedAcademicTask.length === 0) {
      return NextResponse.json(
        {
          error: "Academic task (course work) not found or no changes made",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAcademicTask[0]);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error updating course work: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
