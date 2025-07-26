import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CoursesSessionsList } from "./Courses-sessions-list";

const routerMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => routerMock(),
  }),
}));
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

    const { getByText } = render(
      <CoursesSessionsList
        coursesSessions={coursesSessions as CourseSessionInfo[]}
        linkable={linkable}
        enrolled={enrolled}
      />
    );

    expect(getByText("CS101")).toBeDefined();
    expect(getByText("Introduction to Computer Science")).toBeDefined();
    expect(getByText("Doe J")).toBeDefined();
    expect(
      getByText(new Date("2023-01-01").toLocaleDateString())
    ).toBeDefined();
    expect(
      getByText(new Date("2023-05-01").toLocaleDateString())
    ).toBeDefined();
    expect(getByText("30")).toBeDefined();
    expect(getByText("25")).toBeDefined();

    const link = getByText("CS101").closest("tr");

    // Simulate click on the linkable row
    fireEvent.click(link!);
    expect(routerMock).toHaveBeenCalled();
  });
});
