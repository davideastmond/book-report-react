import { CourseSessionClient } from "@/clients/course-session-client";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FinalGradeReport from "./page";

const roles = ["admin", "student"];
let roleIdx = 0;
vi.mock("next/navigation", () => ({
  useParams: () => ({
    courseSessionId: "session123",
  }),
}));
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: roles[roleIdx] },
      expires: "...",
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));

vi.spyOn(CourseSessionClient, "getFinalGradeReport").mockResolvedValue({
  report: [
    {
      studentId: "studentId1",
      studentFirstName: "firstName",
      studentLastName: "lastName",
      finalGrade: 75,
      studentGender: "female",
      studentDob: new Date("2000-01-01"),
    },
  ],
  courseData: {
    courseSessionId: "course123",
    courseName: "Mocked Course Title",
    courseCode: "Ndfd",
    sessionStart: new Date().toISOString(),
    sessionEnd: new Date().toISOString(),
  },
});

describe("Final Grade Report", () => {
  // Add your tests here
  it("renders access message if not an admin", async () => {
    roleIdx = 1;
    const { findByText } = render(<FinalGradeReport />);
    expect(
      await findByText(/you do not have permission to view this page/i)
    ).toBeDefined();
  });
  it("it renders properly if user is an admin", async () => {
    roleIdx = 0;
    const { findByText, findByTestId } = render(<FinalGradeReport />);
    expect(await findByText(/final grade report/i)).toBeDefined();
    expect(await findByTestId("final-grade-table")).toBeDefined();
  });
});
