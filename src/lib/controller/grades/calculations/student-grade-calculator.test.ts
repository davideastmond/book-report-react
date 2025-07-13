import { RawGradeReportData } from "@/lib/types/grading/student/definitions";
import { describe, expect, test } from "vitest";
import { StudentGradeCalculator } from "./student-grade-calculator";
describe("Grade Calculator Tests", () => {
  test("should calculate the final grade correctly", () => {
    const rawGradeData = [
      {
        courseSessionId: "course1",
        gradeWeightId: "weight1",
        academicTaskId: "task1",
        percentageGrade: 85,
        gradeWeightPercentage: 60,
      },
      {
        courseSessionId: "course1",
        gradeWeightId: "weight2",
        academicTaskId: "task2",
        percentageGrade: 90,
        gradeWeightPercentage: 40,
      },
      {
        courseSessionId: "course2",
        gradeWeightId: "weight1",
        academicTaskId: "task1",
        percentageGrade: 75,
        gradeWeightPercentage: 90,
      },
      {
        courseSessionId: "course2",
        gradeWeightId: "weight2",
        academicTaskId: "task2",
        percentageGrade: 80,
        gradeWeightPercentage: 10,
      },
    ];
    const calculator = new StudentGradeCalculator(
      rawGradeData as RawGradeReportData[]
    );
    const result = calculator.calculate();
    expect(result).toEqual({
      course1: 87,
      course2: 76,
    });
  });
});
