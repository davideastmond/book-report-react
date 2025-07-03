import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const { courseSessionId } = await urlData.params;
  if (!courseSessionId) {
    return NextResponse.json(
      { error: "Course session ID is required" },
      { status: 400 }
    );
  }

  const rawGradeData = await GradeController.getRawDataForCourseSessionById(
    courseSessionId
  );
  const calculator = new CourseSessionGradeCalculator(rawGradeData);
  const finalGradeReport = calculator.getFinalGradeReport();
  return NextResponse.json(finalGradeReport);
}
