import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { isStudentEnrolled } from "@/lib/utils/db/course-enrollment-helpers";
import { error } from "console";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error,
      },
      { status: 401 }
    );
  }
  const { courseSessionId } = await urlData.params;

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
    return NextResponse.json(dataBeforeSending);
  }
  return NextResponse.json(
    {
      error: "For admins only",
    },
    { status: 403 }
  );
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
    })
    .from(courseSession)
    .where(eq(courseSession.id, courseSessionId))
    .leftJoin(user, eq(user.id, courseSession.instructorId))
    .leftJoin(course, eq(course.id, courseSession.courseId));

  if (courseSessionData.length === 0) {
    throw new Error("Course session not found");
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
