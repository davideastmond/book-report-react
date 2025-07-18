import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StudentList } from "./Student-list";

describe("Student List ", () => {
  // Placeholder for future tests
  it("student data is empty - should see the 'no data' message", () => {
    const { getByText } = render(<StudentList students={[]} linkable={true} />);
    expect(getByText(/no data/i)).toBeDefined();
    // Check for the table headers
    const headers = ["Name", "Email", "DOB"];
    headers.forEach((header) => {
      expect(getByText(header)).toBeDefined();
    });
  });
  it("it should render a table with the student data and callback is invoked", () => {
    const mockStudents = [
      {
        studentId: "1",
        studentFirstName: "John",
        studentLastName: "Doe",
        studentEmail: "john.doe@example.com",
        studentDob: new Date("2000-01-01"),
      },
      {
        studentId: "2",
        studentFirstName: "Jane",
        studentLastName: "Smith",
        studentDob: new Date("2001-02-02"),
        studentEmail: "jane.smith@example.com",
      },
      {
        studentId: "3",
        studentFirstName: "Alice",
        studentLastName: "Johnson",
        studentEmail: "alice.johnson@example.com",
        studentDob: new Date("2002-03-03"),
      },
    ];

    const onStudentClickStub = vi.fn();
    const { getByText } = render(
      <StudentList
        students={mockStudents}
        linkable={true}
        onStudentClick={onStudentClickStub}
      />
    );
    expect(getByText("Doe J")).toBeDefined();
    expect(getByText("Smith J")).toBeDefined();
    expect(getByText("Johnson A")).toBeDefined();

    // Emails should be displayed
    expect(getByText("john.doe@example.com")).toBeDefined();
    expect(getByText("jane.smith@example.com")).toBeDefined();
    expect(getByText("alice.johnson@example.com")).toBeDefined();

    const studentElement = getByText("Doe J");
    studentElement.click();

    expect(onStudentClickStub).toHaveBeenCalledWith("1");
  });
  it("Disabled prop should prevent click events", () => {
    const mockStudents = [
      {
        studentId: "1",
        studentFirstName: "John",
        studentLastName: "Doe",
        studentEmail: "john.doe@example.com",
        studentDob: new Date("2000-01-01"),
      },
    ];

    const onStudentClickStub = vi.fn();
    const { getByText } = render(
      <StudentList
        students={mockStudents}
        linkable={true}
        onStudentClick={onStudentClickStub}
        disabled={true}
      />
    );

    const studentElement = getByText("Doe J");
    studentElement.click();

    expect(onStudentClickStub).not.toHaveBeenCalled();
  });
});
