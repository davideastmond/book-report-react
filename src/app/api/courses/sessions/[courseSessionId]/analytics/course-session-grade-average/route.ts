import { authOptions } from "@/auth/auth";
import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";

import { GradeController } from "@/lib/controller/grades/grade-controller";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// this route is going to calculate the class average grade for a course session
export async function GET(
  _: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { courseSessionId } = await urlData.params;

  try {
    const rawReportData = await GradeController.getRawDataForCourseSessionById(
      courseSessionId
    );
    const calculator: CourseSessionGradeCalculator =
      new CourseSessionGradeCalculator(rawReportData);
    const courseSessionGradeAverage = calculator.getAverageStudentGrade();

    return NextResponse.json({
      courseSessionGradeAverage,
      courseSessionId,
      status: "ok",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch course session data: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
