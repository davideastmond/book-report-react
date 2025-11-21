"use server";
import { calculateGPA } from "@/lib/controller/grades/calculations/gpa-calculator";
import { StudentGradeCalculator } from "@/lib/controller/grades/calculations/student-grade-calculator";
import { GradeController } from "@/lib/controller/grades/grade-controller";
import { ApiResult } from "@/lib/types/api/api-return-type";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";

/* 
Example endpoint
/api/user/grades?studentId=123&filter=courseSession&startDate=2023-01-01&endDate=2023-12-31
*/
export async function apiGetGradesForStudentWithDateRange(
  studentId: string,
  startDate: Date,
  endDate: Date
): Promise<ApiResult<{ gradeSummaryData: GradeSummaryData[]; gpa: string }>> {
  // TODO: do some date validation?
  try {
    // Create the raw report data
    const rawReportData =
      await GradeController.getRawGradeReportDataByDateRange({
        studentId: studentId!,
        startDate,
        endDate: endDate || new Date().toISOString(),
      });

    // Based on the raw data, determine the weighted grade
    const studentGradeCalculator = new StudentGradeCalculator(rawReportData);
    // Calculate the final grades by course session ID
    const calculatedStudentGrades = studentGradeCalculator.calculate();

    const apiResponse = studentGradeCalculator.collate(calculatedStudentGrades);

    const gpa = calculateGPA(calculatedStudentGrades)?.toFixed(1);

    return {
      success: true,
      data: { gradeSummaryData: apiResponse, gpa: gpa! },
    };
  } catch (error) {
    return {
      success: false,
      message: "Grades computation error: " + (error as Error).message,
    };
  }
}
