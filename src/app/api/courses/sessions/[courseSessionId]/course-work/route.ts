import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { academicTask, gradeWeight } from "@/db/schema";
import { newCourseWorkValidator } from "@/lib/validators/course-work/new-course-work-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// This route handles creating new course work for a course session.
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
  if (!courseSessionId) {
    return NextResponse.json(
      {
        error: "Course session ID is required",
      },
      { status: 400 }
    );
  }

  // User needs to be an admin or teacher
  if (!["admin", "teacher"].includes(authSession.user.role)) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      { status: 403 }
    );
  }

  const requestBody = await req.json();
  try {
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
  const {
    name,
    description,
    taskType,
    dueDate,
    gradeValueType,
    gradeWeightId,
  } = requestBody;
  try {
    const insertedDocument = await db
      .insert(academicTask)
      .values({
        id: crypto.randomUUID(),
        courseSessionId,
        name,
        description,
        taskType,
        dueDate: dueDate ? new Date(dueDate) : null,
        gradeValueType,
        gradeWeightId,
      })
      .returning({ insertedId: academicTask.id });
    return NextResponse.json(
      {
        message: `Course work created: id ${insertedDocument[0].insertedId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course work:", error);
    return NextResponse.json(
      {
        error: "Failed to create course work: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Get the course work for a specific course session.
export async function GET(
  _: NextRequest,
  urlData: {
    params: Promise<{ courseSessionId: string }>;
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

  // Think about the user role, a student should be able to see the course work for a course session
  const { courseSessionId } = await urlData.params;
  if (!courseSessionId) {
    return NextResponse.json(
      {
        error: "Course session ID is required",
      },
      { status: 400 }
    );
  }

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
      .innerJoin(gradeWeight, eq(academicTask.gradeWeightId, gradeWeight.id));
    return NextResponse.json(courseWorks);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch course work: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
