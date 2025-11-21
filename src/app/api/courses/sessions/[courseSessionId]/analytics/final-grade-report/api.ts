"use server";
import { CourseSessionGradeCalculator } from "@/lib/controller/grades/calculations/course-session-grade-calculator";
import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { ApiResult } from "@/lib/types/api/api-return-type";

export async function apiGetFinalGradeReport(courseSessionId: string): Promise<
  ApiResult<{
    report: Record<string, SummarizedData>;
    courseData: {
      courseName: string | null;
      courseCode: string | null;
      sessionStart: string | null;
      sessionEnd: string | null;
      courseSessionId: string | null;
    };
  }>
> {
  const rawGradeData = await GradeController.getRawDataForCourseSessionById(
    courseSessionId
  );
  const calculator = new CourseSessionGradeCalculator(rawGradeData);
  const finalGradeReport = calculator.getFinalGradeReport();

  return {
    success: true,
    data: {
      report: finalGradeReport,
      courseData: {
        courseName: rawGradeData[0]?.courseName,
        courseCode: rawGradeData[0]?.courseCode,
        courseSessionId: rawGradeData[0]?.courseSessionId,
        sessionStart: rawGradeData[0]?.sessionStart?.toDateString() as string,
        sessionEnd: rawGradeData[0]?.sessionEnd?.toDateString() as string,
      },
    },
  };
}
