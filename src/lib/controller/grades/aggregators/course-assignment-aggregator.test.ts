import { CourseGradingStats } from "@/lib/types/grading/stats/definition";

import { describe, expect, it } from "vitest";
import { aggregateCourseAssignmentData } from "./course-assignment-aggregator";

describe("Course Assignment Aggregator", () => {
  it("should aggregate course assignments correctly", async () => {
    const sampleInputData = [
      {
        studentId: "123",
        studentFirstName: "John",
        studentLastName: "Doe",
        academicTaskId: "task1",
        academicTaskName: "Assignment 1",
        academicTaskType: "Homework",
        percentageGrade: 85,
      },
      {
        studentId: "123",
        studentFirstName: "John",
        studentLastName: "Doe",
        academicTaskId: "task2",
        academicTaskName: "Assignment 2",
        academicTaskType: "Project",
        percentageGrade: 90,
      },
      {
        studentId: "456",
        studentFirstName: "Jane",
        studentLastName: "Smith",
        academicTaskId: "task1",
        academicTaskName: "Assignment 1",
        academicTaskType: "Homework",
        percentageGrade: 95,
      },
    ];

    const expectedOutput = [
      {
        studentId: "123",
        studentFirstName: "John",
        studentLastName: "Doe",
        assignments: [
          {
            academicTaskId: "task1",
            academicTaskName: "Assignment 1",
            academicTaskType: "Homework",
            grade: 85,
          },
          {
            academicTaskId: "task2",
            academicTaskName: "Assignment 2",
            academicTaskType: "Project",
            grade: 90,
          },
        ],
      },
      {
        studentId: "456",
        studentFirstName: "Jane",
        studentLastName: "Smith",
        assignments: [
          {
            academicTaskId: "task1",
            academicTaskName: "Assignment 1",
            academicTaskType: "Homework",
            grade: 95,
          },
        ],
      },
    ];

    const result = aggregateCourseAssignmentData(
      sampleInputData as CourseGradingStats[]
    );
    expect(result).toEqual(expectedOutput);
  });
});
