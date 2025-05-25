import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
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
