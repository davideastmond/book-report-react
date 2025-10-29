"use server";
import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";

import { GradeController } from "@/lib/controller/grades/grade-controller";

// this route is going to calculate the class average grade for a course session
export async function apiGetCourseGradeAverage(courseSessionId: string) {
  try {
    const rawReportData = await GradeController.getRawDataForCourseSessionById(
      courseSessionId
    );
    const calculator: CourseSessionGradeCalculator =
      new CourseSessionGradeCalculator(rawReportData);
    const courseSessionGradeAverage = calculator.getAverageStudentGrade();
    return {
      success: true,
      data: {
        courseSessionGradeAverage,
        courseSessionId,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Failed to fetch course session data: " + (error as Error).message,
    };
  }
}
