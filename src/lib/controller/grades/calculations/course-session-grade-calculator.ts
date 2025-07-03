import { CourseGradingStats } from "@/lib/types/grading/stats/definition";

type StudentRoster = {
  studentFirstName: string;
  studentLastName: string;
  studentId: string;
  studentGender: string;
  studentDob: Date;
};

type SummarizedData = {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  finalGrade: number;
  studentGender: string;
  studentDob: Date;
};

export class CourseSessionGradeCalculator {
  private courseGradingStats: CourseGradingStats[];
  private studentRoster: Map<string, StudentRoster> = new Map();
  private assignmentCount: Map<string, Map<string, number>> = new Map();
  private summedWeights: Record<
    string,
    Map<string, { sum: number; percentageWorth: number }>
  > = {};

  constructor(courseGradingStats: CourseGradingStats[] = []) {
    // Initialize the generator with the course grading stats
    this.courseGradingStats = courseGradingStats;
  }

  public getHighestAndLowestGrade() {
    this.getStudentRoster();
    this.getAssignmentCount();
    this.sumGradesForEachStudent();
    const finalGrades = this.calculateFinalGrade();

    return this.getMinMax(finalGrades);
  }

  public getAverageStudentGrade(): number {
    this.getStudentRoster();
    this.getAssignmentCount();
    this.sumGradesForEachStudent();
    const finalGrades = this.calculateFinalGrade();

    return this._getAverageStudentGrade(finalGrades);
  }

  public getFinalGradeReport() {
    this.getStudentRoster();
    this.getAssignmentCount();
    this.sumGradesForEachStudent();
    const finalGrades = this.calculateFinalGrade();

    return finalGrades;
  }

  private getStudentRoster() {
    for (const dataEntry of this.courseGradingStats) {
      const studentId = dataEntry.studentId as string;
      const studentFirstName = dataEntry.studentFirstName as string;
      const studentLastName = dataEntry.studentLastName as string;

      if (!this.studentRoster.has(studentId)) {
        this.studentRoster.set(studentId, {
          studentFirstName,
          studentLastName,
          studentId,
          studentGender: dataEntry.studentGender as string,
          studentDob: dataEntry.studentDob as Date,
        });
      }
    }
  }

  private calculateFinalGrade() {
    // This will hold the final grade for each student and be returned
    const studentFinalGradeData: Record<string, SummarizedData> = {};

    for (const [studentId, v] of Object.entries(this.summedWeights)) {
      let studentFinalGrade = 0;
      for (const [weightId, sumPercentageData] of v.entries()) {
        // Grab the info
        const assignmentDataByStudent = this.assignmentCount.get(studentId);

        const calculation =
          (sumPercentageData.sum * sumPercentageData.percentageWorth) /
          (assignmentDataByStudent!.get(weightId)! * 100);
        studentFinalGrade += calculation;
      }
      const { studentFirstName, studentLastName } =
        this.studentRoster.get(studentId)!;

      studentFinalGradeData[studentId] = {
        studentId: studentId,
        studentFirstName: studentFirstName,
        studentLastName: studentLastName,
        finalGrade: Math.ceil(studentFinalGrade),
        studentGender: this.studentRoster.get(studentId)!.studentGender,
        studentDob: this.studentRoster.get(studentId)!.studentDob,
      };
    }
    return studentFinalGradeData;
  }
  private sumGradesForEachStudent() {
    // We have studentIds and weightIds with assignment counts

    for (const [studentId] of Object.entries(
      Object.fromEntries(this.assignmentCount)
    )) {
      const sumForWeightings: Map<
        string,
        { sum: number; percentageWorth: number }
      > = new Map(); // string is the weightId
      const filteredElementsByStudentId = this.courseGradingStats.filter(
        (e) => e.studentId === studentId
      );

      for (const el of filteredElementsByStudentId) {
        if (!sumForWeightings.has(el.gradeWeightId!)) {
          sumForWeightings.set(el.gradeWeightId!, {
            sum: el.percentageGrade!,
            percentageWorth: el.gradeWeightPercentage!,
          });
        } else {
          const { sum, percentageWorth } = sumForWeightings.get(
            el.gradeWeightId!
          )!;

          sumForWeightings.set(el.gradeWeightId!, {
            sum: sum! + el.percentageGrade!,
            percentageWorth: percentageWorth,
          });
        }
      }
      this.summedWeights[studentId] = sumForWeightings;
    }
  }
  private getAssignmentCount() {
    for (const dataEntry of this.courseGradingStats) {
      if (!this.assignmentCount.has(dataEntry.studentId!)) {
        const weightElement = new Map<string, number>();
        weightElement.set(dataEntry.gradeWeightId!, 1);
        this.assignmentCount.set(dataEntry.studentId!, weightElement);
      } else {
        // If it does have the studentId, check if it has the weight
        const currentAssignmentElement = this.assignmentCount.get(
          dataEntry.studentId!
        );

        if (!currentAssignmentElement!.has(dataEntry.gradeWeightId!)) {
          currentAssignmentElement!.set(dataEntry.gradeWeightId!, 1);
          this.assignmentCount.set(
            dataEntry.studentId!,
            currentAssignmentElement!
          );
        } else {
          // It has the weight, increment the assignment count
          const currentAssignmentCount = currentAssignmentElement!.get(
            dataEntry.gradeWeightId!
          );

          currentAssignmentElement!.set(
            dataEntry.gradeWeightId!,
            currentAssignmentCount! + 1
          );
          this.assignmentCount.set(
            dataEntry.studentId!,
            currentAssignmentElement!
          );
        }
      }
    }
  }
  private getMinMax(data: Record<string, SummarizedData>) {
    const elements = Object.entries(data).map(([, v]) => {
      return v;
    });

    const sortedElements = [...elements].sort((a, b) => {
      if (a.finalGrade < b.finalGrade) return -1;
      if (a.finalGrade > b.finalGrade) return 1;
      if (a.finalGrade == b.finalGrade) return 0;
      return 0;
    });

    if (sortedElements.length === 1) {
      return { min: sortedElements[0], max: sortedElements[0] };
    } else {
      return {
        min: sortedElements[0],
        max: sortedElements[sortedElements.length - 1],
      };
    }
  }
  private _getAverageStudentGrade(
    data: Record<string, SummarizedData>
  ): number {
    const totalStudents = Object.keys(data).length;

    const sum = Object.entries(data)
      .map(([, v]) => v)
      .reduce((acc, cv) => {
        return acc + cv.finalGrade;
      }, 0);

    return Math.ceil(sum / totalStudents);
  }
}
