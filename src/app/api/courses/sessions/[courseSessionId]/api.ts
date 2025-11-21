"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { isStudentEnrolled } from "@/lib/utils/db/course-enrollment-helpers";

import { eq } from "drizzle-orm";

import { getServerSession } from "next-auth";

export async function apiGetCoursesSessionById(courseSessionId: string) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    throw new Error("Unauthorized");
  }

  if (["admin", "teacher", "student"].includes(authSession.user.role)) {
    const { courseSessionData, students } = await doAdminQuery(courseSessionId);

    const isEnrolled = await isStudentEnrolled({
      courseSessionId,
      studentId: authSession.user.id,
    });
    // This should return one result. We also need to get the students that are in this course session
    const dataBeforeSending = {
      courseSessionData: {
        ...courseSessionData[0],
        allotmentCount: students.length,
      },
      isEnrolled,
      students,
    };

    // For privacy concerns, we do not send student data to students
    if (["student"].includes(authSession.user.role)) {
      dataBeforeSending.students = [];
    }
    return dataBeforeSending;
  }
  throw Error("Unauthorized access.");
}

async function doAdminQuery(courseSessionId: string) {
  const courseSessionData = await db
    .select({
      courseSessionId: courseSession.id,
      courseId: course.id,
      courseName: course.name,
      courseCode: course.course_code,
      sessionStart: courseSession.sessionStart,
      sessionEnd: courseSession.sessionEnd,
      instructorId: courseSession.instructorId,
      instructorFirstName: user.firstName,
      instructorLastName: user.lastName,
      description: courseSession.description,
      studentAllotment: courseSession.studentAllotment,
      isLocked: courseSession.isLocked,
      isCompleted: courseSession.isCompleted,
    })
    .from(courseSession)
    .where(eq(courseSession.id, courseSessionId))
    .leftJoin(user, eq(user.id, courseSession.instructorId))
    .leftJoin(course, eq(course.id, courseSession.courseId));

  if (courseSessionData.length === 0) {
    throw Error("Course session not found");
  }

  const studentsEnrolledInCourse = await db
    .select({
      studentId: user.id,
      studentFirstName: user.firstName,
      studentLastName: user.lastName,
      studentDob: user.dob,
      studentEmail: user.email,
    })
    .from(roster)
    .where(eq(roster.courseSessionId, courseSessionId))
    .innerJoin(user, eq(user.id, roster.studentId));
  return {
    courseSessionData,
    students: studentsEnrolledInCourse,
  };
}

export async function apiPatchCoursesSessionById(
  courseSessionId: string,
  requestBody: {
    sessionStart?: string;
    sessionEnd?: string;
    description?: string;
    studentAllotment?: number;
  }
): Promise<ApiResult<null>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!["admin", "teacher"].includes(authSession.user.role)) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    // Validate data structure here if necessary
    await db
      .update(courseSession)
      .set({
        sessionStart: requestBody.sessionStart
          ? new Date(requestBody.sessionStart)
          : undefined,
        sessionEnd: requestBody.sessionEnd
          ? new Date(requestBody.sessionEnd)
          : undefined,
        description: requestBody.description,
        studentAllotment: requestBody.studentAllotment,
      })
      .where(eq(courseSession.id, courseSessionId));
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update course session: " + (error as Error).message,
    };
  }
}
