"use server";
import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { StudentGradeCalculator } from "@/lib/controller/grades/calculations/student-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import {
  AdminStudentDataAPIResponse,
  CourseHistoryData,
} from "@/lib/types/admin-data/admin-student-data-api-response";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

export async function getAdminStudentData(
  userId: string
): Promise<ApiResult<AdminStudentDataAPIResponse>> {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return { success: false, message: "Unauthorized" };
  }

  // Only admins  can access this endpoint
  if (authSession.user.role !== "admin") {
    return { success: false, message: "Forbidden" };
  }

  // This user should exist
  const queryData = await db
    .select({
      studentFirstName: user.firstName,
      studentLastName: user.lastName,
      studentEmail: user.email,
      studentDob: user.dob,
      studentId: user.id,
      courseName: course.name,
      courseCode: course.course_code,
      courseSessionId: courseSession.id,
      sessionStart: courseSession.sessionStart,
      sessionEnd: courseSession.sessionEnd,
      isCompleted: courseSession.isCompleted,
    })
    .from(roster)
    .where(eq(roster.studentId, userId))
    .innerJoin(user, eq(user.id, roster.studentId))
    .innerJoin(courseSession, eq(courseSession.id, roster.courseSessionId))
    .innerJoin(course, eq(course.id, courseSession.courseId));

  const rawGradeReport = await GradeController.getRawGradeReport({
    studentId: userId,
  });
  const studentGradeCalculator = new StudentGradeCalculator(rawGradeReport);
  const calculatedStudentGrades = studentGradeCalculator.calculate();
  const collatedGradeData = studentGradeCalculator.collate(
    calculatedStudentGrades
  );

  // This route is designed to fetch all data for some student with userId
  // Return the basic user identity and all of the classes and grading stats

  // Let's first get all of the courses
  return {
    success: true,
    data: {
      studentData: {
        studentFirstName: queryData[0]?.studentFirstName || "",
        studentLastName: queryData[0]?.studentLastName || "",
        studentId: queryData[0]?.studentId || "",
        studentDob: null,
        studentEmail: null,
      },
      coursesData: queryData as CourseHistoryData[],
      gradesData: collatedGradeData,
    },
  };
}
