"use server";
import { db } from "@/db/index";
import { course, courseSession, user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { eq } from "drizzle-orm";

/* 
This route will return a list of completed course sessions, grouped by the course they belong to.
*/
export async function apiGetGroupedCoursesSessionsByCourse(): Promise<
  ApiResult<GroupedCourseInfo[]>
> {
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

  return {
    success: true,
    message: null,
    data: completedSessions,
  };
}
