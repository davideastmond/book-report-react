import { describe, expect, it } from "vitest";
import { CourseSessionGradeCalculator } from "./course-session-grade-calculator";

describe("CourseSessionGradeCalculator", () => {
  describe("average student grade", () => {
    it("should return the average student grade", () => {
      // Test implementation for average student grade

      const sampleData: any[] = [
        {
          studentId: "1",
          studentFirstName: "student1FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 85,
        },
        {
          studentId: "1",
          studentFirstName: "student1FirstName",
          gradeWeightId: "weight2",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 100,
        },
        {
          studentId: "2",
          studentFirstName: "student2FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 90,
        },
        {
          studentId: "2",
          studentFirstName: "student2FirstName",
          gradeWeightId: "weight2",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 95,
        },
        {
          studentId: "3",
          studentFirstName: "student3FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 75,
        },
        {
          studentId: "3",
          studentFirstName: "student3FirstName",
          gradeWeightId: "weight2",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 75,
        },
      ];

      const calculator = new CourseSessionGradeCalculator(sampleData);
      const average = calculator.getAverageStudentGrade();
      expect(average).toBe(87);
    });
  });
  describe("highest and lowest grade", () => {
    it("should return the highest and lowest grade", () => {
      // Test implementation for highest and lowest grade

      const sampleData: any[] = [
        {
          studentId: "1",
          studentFirstName: "student1FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 100,
          percentageGrade: 85,
        },
        {
          studentId: "2",
          studentFirstName: "student2FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 100,
          percentageGrade: 90,
        },
        {
          studentId: "3",
          studentFirstName: "student3FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 100,
          percentageGrade: 75,
        },
      ];

      const calculator = new CourseSessionGradeCalculator(sampleData);
      const { min, max } = calculator.getHighestAndLowestGrade();
      // Expect an object containing the values
      expect(min).toEqual(
        expect.objectContaining({
          studentId: "3",
          studentFirstName: "student3FirstName",
          finalGrade: 75,
        })
      );
      expect(max).toEqual(
        expect.objectContaining({
          studentId: "2",
          studentFirstName: "student2FirstName",
          finalGrade: 90,
        })
      );
    });
  });
  describe("final grade report", () => {
    it("should return the final grade report", () => {
      // Test implementation for final grade report

      const sampleData: any[] = [
        {
          studentId: "1",
          studentFirstName: "student1FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 85,
        },
        {
          studentId: "1",
          studentFirstName: "student1FirstName",
          gradeWeightId: "weight2",
          gradeWeightName: "weight2Name",
          gradeWeightPercentage: 50,
          percentageGrade: 100,
        },
        {
          studentId: "2",
          studentFirstName: "student2FirstName",
          gradeWeightId: "weight1",
          gradeWeightName: "weight1Name",
          gradeWeightPercentage: 50,
          percentageGrade: 50,
        },
        {
          studentId: "2",
          studentFirstName: "student2FirstName",
          gradeWeightId: "weight2",
          gradeWeightName: "weight2Name",
          gradeWeightPercentage: 50,
          percentageGrade: 50,
        },
      ];

      const calculator = new CourseSessionGradeCalculator(sampleData);
      const finalReport = calculator.getFinalGradeReport();
      expect(finalReport).toEqual(
        expect.objectContaining({
          "1": expect.objectContaining({
            studentId: "1",
            studentFirstName: "student1FirstName",
            finalGrade: 93,
          }),
          "2": expect.objectContaining({
            studentId: "2",
            studentFirstName: "student2FirstName",
            finalGrade: 50,
          }),
        })
      );
    });
  });
});
