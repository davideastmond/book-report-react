import {
  GradeSummaryData,
  RawGradeReportData,
} from "@/lib/types/grading/student/definitions";

type CourseSessionId = string;
type GradeWeightId = string;

type DataByCourseSession = Record<GradeWeightId, DataByWeightGroup>;

type DataByWeightGroup = {
  sum: number;
  totalElements: number;
  percentageWeight: number;
};

type WeightedFinalGrades = Record<CourseSessionId, number>;

export class StudentGradeCalculator {
  private input: RawGradeReportData[];
  constructor(input: RawGradeReportData[]) {
    this.input = input;
  }

  public calculate(): Record<CourseSessionId, number> {
    // The key is the courseSessionId, the values are the DataByCourseSession
    const groupedByWeightMarks = this.sumMarksByGradeWeightGroup();
    return this.getWeightedFinalGrade(groupedByWeightMarks);
  }

  public collate(data: Record<CourseSessionId, number>) {
    const apiResponse: GradeSummaryData[] = [];

    // Collate the data for an API Response
    for (const [k, v] of Object.entries(data)) {
      const foundData = this.input.find((d) => d.courseSessionId === k);
      if (!foundData) throw Error("When referencing data, it wasn't found");
      apiResponse.push({
        studentFirstName: foundData.studentFirstName,
        studentLastName: foundData.studentLastName,
        studentId: foundData.studentId,
        courseName: foundData.courseName,
        courseCode: foundData.courseCode,
        coursePercentageAverage: v,
        isCourseCompleted: foundData.isCourseCompleted,
        sessionStart: foundData.sessionStart,
        sessionEnd: foundData.sessionEnd,
        instructorFirstName: foundData.instructorFirstName,
        instructorLastName: foundData.instructorLastName,
        courseSessionId: foundData.courseSessionId,
      });
    }
    return apiResponse;
  }
  private sumMarksByGradeWeightGroup(): Record<
    CourseSessionId,
    DataByCourseSession
  > {
    const groupedWeightMarks: Record<CourseSessionId, DataByCourseSession> = {};
    for (const rawGrade of this.input) {
      const {
        gradeWeightId,
        percentageGrade,
        gradeWeightPercentage,
        courseSessionId,
      } = rawGrade;

      if (!groupedWeightMarks[courseSessionId as string]) {
        groupedWeightMarks[courseSessionId as string] = {};
        groupedWeightMarks[courseSessionId as string][gradeWeightId as string] =
          {
            sum: 0,
            totalElements: 0,
            percentageWeight: gradeWeightPercentage as number,
          };
      }
      if (
        groupedWeightMarks[courseSessionId as string] &&
        !(
          (gradeWeightId as string) in
          groupedWeightMarks[courseSessionId as string]
        )
      ) {
        groupedWeightMarks[courseSessionId as string][gradeWeightId as string] =
          {
            sum: 0,
            totalElements: 0,
            percentageWeight: gradeWeightPercentage as number,
          };
      }

      groupedWeightMarks[courseSessionId as string][
        gradeWeightId as string
      ].sum += percentageGrade || 0;
      groupedWeightMarks[courseSessionId as string][
        gradeWeightId as string
      ].totalElements += 1;
    }
    return groupedWeightMarks;
  }
  private getWeightedFinalGrade(
    groupedInput: Record<CourseSessionId, DataByCourseSession>
  ): WeightedFinalGrades {
    const weightedFinalGrades: WeightedFinalGrades = {};

    for (const [courseSessionId, weightedGrades] of Object.entries(
      groupedInput
    )) {
      let gradeSum = 0;
      for (const [, gradeData] of Object.entries(weightedGrades)) {
        gradeSum +=
          (gradeData.sum * gradeData.percentageWeight) /
          (gradeData.totalElements * 100);
      }
      weightedFinalGrades[courseSessionId] = Math.ceil(gradeSum);
    }
    return weightedFinalGrades;
  }
}
