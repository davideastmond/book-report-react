import { CourseGradingStats } from "@/lib/types/grading/stats/definition";
import { AggregatedCourseAssignmentData } from "./definitions";

type AggregatedTaskData = {
  academicTaskId: string | null;
  academicTaskName: string | null;
  academicTaskType: string | null;
  grade: number | null;
};

export function aggregateCourseAssignmentData(
  input: CourseGradingStats[]
): AggregatedCourseAssignmentData[] {
  const aggregatedData: Record<
    string,
    {
      studentId: string | null;
      studentFirstName: string | null;
      studentLastName: string | null;
      assignments: AggregatedTaskData[];
    }
  > = {};

  input.forEach((entry) => {
    const { studentId } = entry;
    if (!aggregatedData[studentId as string]) {
      aggregatedData[studentId as string] = {
        studentId,
        studentFirstName: entry.studentFirstName,
        studentLastName: entry.studentLastName,
        assignments: [],
      };
    }

    aggregatedData[studentId as string].assignments.push({
      academicTaskId: entry.academicTaskId,
      academicTaskName: entry.academicTaskName,
      academicTaskType: entry.academicTaskType,
      grade: entry.percentageGrade,
    });
  });

  return Object.values(aggregatedData);
}
