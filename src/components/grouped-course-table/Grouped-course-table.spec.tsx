import { GroupedCourseInfo } from "@/lib/types/db/grouped-course-info";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GroupedCourseList } from "./Grouped-course-list";
describe("grouped course List", () => {
  it("renders the component correctly", () => {
    const groupedCourses: Partial<GroupedCourseInfo>[] = [
      {
        courseId: "1",
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        isCompleted: false,
        courseSessionInstructorFirstName: "Tea",
        courseSessionInstructorLastName: "Chuhr",
        courseSessionStart: new Date("2023-01-01"),
        courseSessionEnd: new Date("2023-05-01"),
      },
      {
        courseId: "2",
        courseCode: "CS102",
        courseName: "Data Structures",
        isCompleted: false,
        courseSessionInstructorFirstName: "John",
        courseSessionInstructorLastName: "Doe",
        courseSessionStart: new Date("2023-02-01"),
        courseSessionEnd: new Date("2023-06-01"),
      },
    ];
    const { getByText } = render(
      <GroupedCourseList
        groupedCourses={groupedCourses as GroupedCourseInfo[]}
      />
    );
    expect(getByText(/introduction to Computer Science/i)).toBeDefined();
    expect(getByText(/data structures/i)).toBeDefined();
  });
});
