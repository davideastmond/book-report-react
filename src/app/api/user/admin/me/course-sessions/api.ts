// Route to get the requesting user's sessions
"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiAdminGetCoursesSessions() {
  const authSession = await getServerSession(authOptions);

  if (!authSession || !authSession.user) {
    throw new Error("Unauthorized");
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
        isCompleted: courseSession.isCompleted,
      })
      .from(user)
      .where(eq(user.id, authSession?.user.id))
      .leftJoin(courseSession, eq(user.id, courseSession.instructorId))
      .leftJoin(course, eq(course.id, courseSession.courseId));
    return result;
  } catch (error) {
    throw new Error("Failed to fetch course sessions for admin");
  }
}
