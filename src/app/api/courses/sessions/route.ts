import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, user } from "@/db/schema";
import { createCourseSessionValidator } from "@/lib/validators/course-session/create-course-session-validator";
import { eq, or } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const requestBody = await request.json();

  // Validate the request body
  try {
    createCourseSessionValidator.parse(requestBody);
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
  const { courseId, sessionStart, sessionEnd, description, studentAllotment } =
    requestBody;

  try {
    await db.insert(courseSession).values({
      id: crypto.randomUUID(),
      courseId: courseId,
      sessionStart: new Date(sessionStart),
      sessionEnd: new Date(sessionEnd),
      instructorId: authSession.user.id,
      description: description || null,
      studentAllotment: studentAllotment,
    });
    return NextResponse.json(
      { message: "Course created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "An error occurred while creating the course:" +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// This route gets all available courses for browsing purposes
export async function GET(req: NextRequest) {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const showCompleted = req.nextUrl.searchParams.get("showCompleted");
  const conditionalQuery =
    showCompleted === "true"
      ? or(
          eq(courseSession.isCompleted, true),
          eq(courseSession.isCompleted, false)
        )
      : eq(courseSession.isCompleted, false);

  try {
    const availableCourses = await db
      .select({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.course_code,
        courseSessionId: courseSession.id,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        instructorId: user.id,
        instructorFirstName: user.firstName,
        instructorLastName: user.lastName,
        description: courseSession.description,
        studentAllotment: courseSession.studentAllotment,
        isLocked: courseSession.isLocked,
        isCompleted: courseSession.isCompleted,
      })
      .from(courseSession)
      .where(conditionalQuery)
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .innerJoin(user, eq(user.id, courseSession.instructorId));
    return NextResponse.json(availableCourses);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "An error occurred while fetching courses:" +
          (error as Error).message,
      },
      { status: 500 }
    );
  }
}
