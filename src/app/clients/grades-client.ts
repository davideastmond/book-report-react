import { apiGetGradesForStudentWithDateRange } from "@/api/user/grades/api";
import { GradeSummaryData } from "@/lib/types/grading/student/definitions";

export const GradesClient = {
  getGradesForStudentWithDateRange: async ({
    studentId,
    startDate,
    endDate = new Date(),
  }: {
    studentId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<{ data: GradeSummaryData[]; gpa: string | number }> => {
    const result = await apiGetGradesForStudentWithDateRange(
      studentId,
      startDate,
      endDate
    );
    if (!result.success) {
      throw new Error(result.message || "Failed to fetch grades");
    }
    return {
      data: result.data!.gradeSummaryData,
      gpa: result.data!.gpa,
    };
  },
};
