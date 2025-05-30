import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function GET() {
  // Get all course sessions for which the user is registered as student
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (["admin, teacher"].includes(authSession.user.role)) {
    try {
      const results = await adminGetMyCourses(authSession.user.id);
      return NextResponse.json(results);
    } catch (error) {
      console.error("Error fetching course sessions:", error);
      return NextResponse.json(
        {
          error: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }

  try {
    const res = await db
      .select({
        instructorFirstName: user.firstName,
        instructorLastName: user.lastName,
        courseSessionId: courseSession.id,
        courseId: course.id,
        courseName: course.name,
        courseCode: course.course_code,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        isCompleted: courseSession.isCompleted,
      })
      .from(roster)
      .where(eq(roster.studentId, authSession.user.id))
      .innerJoin(courseSession, eq(courseSession.id, roster.courseSessionId))
      .innerJoin(course, eq(course.id, courseSession.courseId))
      .innerJoin(user, eq(user.id, courseSession.instructorId));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching course sessions:", error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

async function adminGetMyCourses(userId: string, isCompleted: boolean = false) {
  const res = await db
    .select({
      instructorFirstName: user.firstName,
      instructorLastName: user.lastName,
      courseSessionId: courseSession.id,
      courseId: course.id,
      courseName: course.name,
      courseCode: course.course_code,
      sessionStart: courseSession.sessionStart,
      sessionEnd: courseSession.sessionEnd,
      isCompleted: courseSession.isCompleted,
    })
    .from(courseSession)
    .where(
      and(
        eq(courseSession.instructorId, userId),
        eq(courseSession.isCompleted, isCompleted)
      )
    )
    .fullJoin(course, eq(course.id, courseSession.courseId))
    .fullJoin(user, eq(user.id, courseSession.instructorId));

  return res;
}
