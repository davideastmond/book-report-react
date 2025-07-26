import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import {
  CourseSessionDataAPIResponse,
  CourseSessionInfo,
} from "@/lib/types/db/course-session-info";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseGradingMain } from "./Course-grading-main";

vi.mock("next/navigation", () => ({
  useParams: () => ({
    courseSessionId: "session123",
  }),
}));
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: "student" },
      expires: "...",
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));

CourseWorkClient.getCourseWorkForSession = vi.fn(() => {
  return Promise.resolve([
    {
      id: "work123",
      title: "Test Assignment",
      description: "This is a test assignment",
      dueDate: new Date("2023-12-31"),
      maxPoints: 100,
      gradeWeightName: "Final Exam",
      gradeWeightId: "weight123",
      courseSessionId: "session123",
      gradeWeightPercentage: 50,
    },
  ]);
});

CourseSessionClient.fetchGradesForCourseSession = vi.fn(() => {
  return Promise.resolve([
    {
      id: "grade123",
      userId: "student123",
      academicTaskId: "taskId1",
      courseSessionId: "session123",
      percentageGrade: 85,
      instructorFeedback: "Good job!",
    },
  ]);
});
describe("CourseGradingMain", () => {
  const dummyData = {
    courseSessionData: {
      courseId: "course123",
      courseName: "Test Course",
      courseCode: "TC101",
      courseSessionId: "session123",
      sessionStart: new Date("2023-01-01"),
      sessionEnd: new Date("2023-12-31"),
      instructorId: "instructor123",
      instructorFirstName: "John",
      instructorLastName: "Doe",
      gradeWeightId: "weight123",
    } as Partial<CourseSessionInfo>,
    students: [
      {
        studentId: "student123",
        studentFirstName: "Jane",
        studentLastName: "Smith",
        studentDob: new Date("2000-01-01"),
        studentEmail: "jane.smith@example.com",
      },
    ],
    isEnrolled: true,
  };
  it("renders without crashing", () => {
    render(
      <CourseGradingMain
        courseData={dummyData as CourseSessionDataAPIResponse}
      />
    );
    // The grading table is rendered
    expect(screen.getByTestId("grading-table")).toBeDefined();
    expect(screen.getByText(/test course/i)).toBeDefined();
    expect(screen.getByText(/smith jane/i)).toBeDefined();
    expect(screen.getByText(/TC101/i)).toBeDefined();
  });
});
