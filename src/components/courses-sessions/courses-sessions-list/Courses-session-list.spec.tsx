import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CoursesSessionsList } from "./Courses-sessions-list";

describe("Courses Session List Component Tests", () => {
  it("renders the component with courses sessions", () => {
    const coursesSessions = [
      {
        courseSessionId: "1",
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        instructorLastName: "Doe",
        instructorFirstName: "John",
        sessionStart: new Date("2023-01-01"),
        sessionEnd: new Date("2023-05-01"),
        studentAllotment: 30,
        courseId: "course1",
      },
    ];

    const enrolled = { show: true, count: 25 };
    const linkable = true;

    const { getByText, getByTestId } = render(
      <CoursesSessionsList
        coursesSessions={coursesSessions as CourseSessionInfo[]}
        linkable={linkable}
        enrolled={enrolled}
      />
    );

    expect(getByText("CS101")).toBeDefined();
    expect(getByText("Introduction to Computer Science")).toBeDefined();
    expect(getByText("DOE, J")).toBeDefined();
    expect(
      getByText(new Date("2023-01-01").toLocaleDateString())
    ).toBeDefined();
    expect(
      getByText(new Date("2023-05-01").toLocaleDateString())
    ).toBeDefined();
    expect(getByText("30")).toBeDefined();
    expect(getByText("25")).toBeDefined();
  });
});
