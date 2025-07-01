import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, user } from "@/db/schema";
import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/* 
This route will return a list of completed course sessions, grouped by the course they belong to.
*/
export async function GET() {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const completedSessions: GroupedCourseInfo[] = await db
    .select({
      courseId: course.id,
      courseCode: course.course_code,
      courseSessionInstructorId: courseSession.instructorId,
      courseSessionInstructorFirstName: user.firstName,
      courseSessionInstructorLastName: user.lastName,
      courseName: course.name,
      courseSessionId: courseSession.id,
      courseSessionStart: courseSession.sessionStart,
      courseSessionEnd: courseSession.sessionEnd,
      isCompleted: courseSession.isCompleted,
    })
    .from(courseSession)
    .where(eq(courseSession.isCompleted, true))
    .fullJoin(course, eq(course.id, courseSession.courseId))
    .fullJoin(user, eq(user.id, courseSession.instructorId));

  return NextResponse.json(completedSessions);
}
