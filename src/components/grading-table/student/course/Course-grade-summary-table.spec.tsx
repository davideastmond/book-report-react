import { GradeSummaryData } from "@/lib/types/grading/student/definitions";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseGradeSummaryTable } from "./Course-grade-summary-table";

describe("Grades Overview Component", () => {
  it("Renders the component correctly", () => {
    const sampleData: Partial<GradeSummaryData> = {
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      coursePercentageAverage: 85,
      studentFirstName: "John",
      studentLastName: "Doe",
      sessionStart: new Date("2023-01-01"),
      sessionEnd: new Date("2023-05-01"),
    };

    const { getByText } = render(
      <CourseGradeSummaryTable
        gradeSummaryData={sampleData as GradeSummaryData}
      />
    );

    //Headers
    expect(getByText(/course code/i)).toBeDefined();
    expect(getByText(/course name/i)).toBeDefined();
    expect(getByText(/instr\./i)).toBeDefined();
    expect(getByText(/session start/i)).toBeDefined();
    expect(getByText(/session end/i)).toBeDefined();
    expect(getByText(/student name/i)).toBeDefined();
    expect(getByText(/grade/i)).toBeDefined();

    expect(getByText(/cs101/i)).toBeDefined();
    expect(getByText(/introduction to computer science/i)).toBeDefined();
    expect(getByText(/85/i)).toBeDefined();

    expect(getByText(/doe j/i)).toBeDefined();
  });
});
