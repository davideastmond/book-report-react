/* This route fetches the maximum and minimum student grades for a specific course session. */

import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const { courseSessionId } = await urlData.params;

  // Validate courseSessionId
  if (!courseSessionId) {
    return NextResponse.json(
      { error: "Course session ID is required" },
      { status: 400 }
    );
  }
  try {
    const rawGradeData = await GradeController.getRawDataForCourseSessionById(
      courseSessionId
    );

    const statsGenerator: CourseSessionGradeCalculator =
      new CourseSessionGradeCalculator(rawGradeData);
    const data = statsGenerator.getHighestAndLowestGrade();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Operation failed" + (error as Error).message },
      { status: 500 }
    );
  }
}
