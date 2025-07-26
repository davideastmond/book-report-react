import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";
import { ClassListFinalGradeTable } from "./Class-list-final-grade-table";
describe("ClassListFinalGradeTable", () => {
  const dummySummarizedData = [
    {
      studentId: "1",
      studentFirstName: "John",
      studentLastName: "Doe",
      finalGrade: 85.5,
      studentGender: "male",
    },
    {
      studentId: "2",
      studentFirstName: "Jane",
      studentLastName: "Smith",
      finalGrade: 92.0,
      studentGender: "male",
    },
  ];
  it("renders the table with data", () => {
    render(
      <ClassListFinalGradeTable
        data={dummySummarizedData as SummarizedData[]}
      />
    );
    expect(screen.getByText("Student First N.")).toBeDefined();
    expect(screen.getByText("Student Last N.")).toBeDefined();
    expect(screen.getByText("Final Grade")).toBeDefined();
    expect(screen.getByText("John")).toBeDefined();
    expect(screen.getByText("Doe")).toBeDefined();
    expect(screen.getByText("85.50")).toBeDefined();
    expect(screen.getByText("Jane")).toBeDefined();
    expect(screen.getByText("Smith")).toBeDefined();
    expect(screen.getByText("92.00")).toBeDefined();
  });
  it("renders no data available when data is null", () => {
    render(<ClassListFinalGradeTable data={null} />);
    expect(screen.getByText("No data available")).toBeDefined();
  });
});
