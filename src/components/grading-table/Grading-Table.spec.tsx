import { EnrolledStudent } from "@/lib/types/db/course-session-info";
import { TableData } from "@/lib/types/grading/student/definitions";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { GradingTable } from "./Grading-table";
describe("grading-table test", () => {
  test("Expect component to render with appropriate data", async () => {
    const students: Partial<EnrolledStudent>[] = [
      {
        studentId: "student1",
        studentFirstName: "John",
        studentLastName: "Doe",
        studentEmail: "john.doe@example.com",
      },
      {
        studentId: "student2",
        studentFirstName: "Jane",
        studentLastName: "Smith",
        studentEmail: "jane.smith@example.com",
      },
    ];

    const fakeTableData = {
      item1: {
        academicTaskId: "item1",
      },
      item2: {
        academicTaskId: "item2",
      },
    };
    // Render the GradingTable component with test data
    const { getByText, queryAllByText } = render(
      <GradingTable
        students={students as EnrolledStudent[]}
        courseWorkId={"test"}
        tableData={fakeTableData as TableData}
      />
    );
    expect(getByText("DOE, J")).toBeDefined();
    expect(queryAllByText(/student name/i)).toHaveLength(2);
    expect(queryAllByText(/dob/i)).toHaveLength(2);
  });
});
