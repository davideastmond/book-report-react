import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { course, courseSession, roster, user } from "@/db/schema";
import { StudentGradeCalculator } from "@/lib/controller/grades/calculations/student-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins  can access this endpoint
  if (authSession.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.has("userId")) {
    return NextResponse.json(
      { error: "Missing userId query parameter" },
      { status: 400 }
    );
  }
  const userId = queryParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid userId query parameter" },
      { status: 400 }
    );
  }

  // This user should exist
  const data = await db
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
  return NextResponse.json(
    {
      studentData: {
        studentFirstName: data[0]?.studentFirstName || "",
        studentLastName: data[0]?.studentLastName || "",
        studentId: data[0]?.studentId || "",
      },
      coursesData: data,
      gradesData: collatedGradeData,
    },
    { status: 200 }
  );
}
