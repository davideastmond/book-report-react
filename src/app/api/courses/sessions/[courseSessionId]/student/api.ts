"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { courseSession, roster } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { isMaxAllotment } from "@/lib/utils/db/course-enrollment-helpers";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function apiAddStudentToCourseSession(
  courseSessionId: string,
  studentId: string
): Promise<ApiResult<void>> {
  // TODO: Could we make these queries more efficient by combining them?
  // Count the roster for this course session
  const isCourseFull = await isMaxAllotment(courseSessionId);
  if (isCourseFull) {
    return {
      success: false,
      message: "Course session is full",
    };
  }

  // Check that the user is a student and user is not already part of the course
  const studentInRoster = await db.query.roster.findFirst({
    where: and(
      eq(roster.courseSessionId, courseSessionId),
      eq(roster.studentId, studentId)
    ),
  });

  if (studentInRoster) {
    return {
      success: false,
      message: `StudentID ${studentId} already enrolled in this course session`,
    };
  }

  // Check if the course session is locked
  const foundSession = await db.query.courseSession.findFirst({
    where: eq(courseSession?.id, courseSessionId),
  });

  if (foundSession && foundSession.isLocked) {
    return {
      success: false,
      message: `Course session ${courseSessionId} is locked and cannot be modified`,
    };
  }

  await db.insert(roster).values({
    id: crypto.randomUUID(),
    courseSessionId: courseSessionId,
    studentId: studentId,
  });
  return {
    success: true,
  };
}

export async function apiRemoveStudentFromCourseSession(
  courseSessionId: string,
  studentId: string
): Promise<ApiResult<void>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  // For security, if this is a student making the request, ensure they are only trying to remove themselves
  if (
    authSession.user.role === "student" &&
    authSession.user.id !== studentId
  ) {
    return {
      success: false,
      message: "Unauthorized to remove another student",
    };
  }

  // Let's try to get the data we need for this next step in one query

  const query = await db
    .select({
      studentId: roster.studentId,
      courseSessionId: roster.courseSessionId,
      isLocked: courseSession.isLocked,
    })
    .from(roster)
    .where(
      and(
        eq(roster.courseSessionId, courseSessionId),
        eq(roster.studentId, studentId)
      )
    )
    .fullJoin(courseSession, eq(courseSession.id, roster.courseSessionId));

  const retrievedData = query[0];

  // Check that retrieved data is defined
  if (!retrievedData) {
    return {
      success: false,
      message: `No enrollment found for StudentID ${studentId} in CourseSessionID ${courseSessionId}`,
    };
  }

  // Check if student is enrolled
  if (retrievedData.studentId !== studentId) {
    return {
      success: false,
      message: `StudentID ${studentId} not enrolled in this course session`,
    };
  }

  // Check that the course session isn't locked
  if (retrievedData.isLocked) {
    return {
      success: false,
      message: `Course session ${courseSessionId} is locked and cannot be modified`,
    };
  }

  await db
    .delete(roster)
    .where(
      and(
        eq(roster.courseSessionId, courseSessionId),
        eq(roster.studentId, studentId)
      )
    );
  return {
    success: true,
  };
}
