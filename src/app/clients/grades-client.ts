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
    const res = await fetch(
      `/api/user/grades?studentId=${studentId}&filter=allCourses&startDate=${
        startDate.toISOString().split("T")[0]
      }&endDate=${endDate.toISOString().split("T")[0]}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) {
      throw Error("Failed to fetch grades");
    }
    return res.json();
  },
};
