// Route to get the requesting user's sessions

import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

  try {
    const result = await db
      .select({
        courseId: course.id,
        courseName: course.name,
        courseCode: course.course_code,
        courseSessionId: courseSession.id,
        sessionStart: courseSession.sessionStart,
        sessionEnd: courseSession.sessionEnd,
        instructorId: courseSession.instructorId,
        instructorFirstName: user.firstName,
        instructorLastName: user.lastName,
        studentAllotment: courseSession.studentAllotment,
      })
      .from(user)
      .where(eq(user.id, authSession?.user.id))
      .leftJoin(courseSession, eq(user.id, courseSession.instructorId))
      .leftJoin(course, eq(course.id, courseSession.courseId));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
