import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { render } from "@testing-library/react";

import { afterEach, describe, expect, test, vi } from "vitest";
import AdminCourseWorkPage from "./page";

const accessLevels = ["admin", "student"];
let accessIdx = 0;

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/test.jpg",
        role: accessLevels[accessIdx],
      },
    },
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => {
  return {
    useParams: () => ({
      courseSessionId: "test-course-session-id",
    }),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      query: {},
    }),
  };
});

const CourseSessionClientSpy = vi
  .spyOn(CourseSessionClient, "fetchCourseSessionByIdAdmin")
  .mockResolvedValue({
    courseSessionData: {
      courseId: "test-course-session-id",
      courseName: "Test Course Session",
      sessionStart: new Date("2023-01-01"),
      sessionEnd: new Date("2023-12-31"),
      isCompleted: false,
    } as any,
    students: [],
    isEnrolled: true,
  });

const CourseWorkClientSpy = vi
  .spyOn(CourseWorkClient, "getCourseWorkForSession")
  .mockResolvedValue([
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
  ] as any);

describe("AdminCourseWorkPage tests", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  test("it renders for admin", async () => {
    accessIdx = 0;
    const { findByText } = render(<AdminCourseWorkPage />);
    expect(await findByText(/Course Work Manager\(Admin\)/)).toBeDefined();
    expect(CourseSessionClientSpy).toHaveBeenCalled();
    expect(CourseWorkClientSpy).toHaveBeenCalled();
  });
  test("shows appropriate messages for student access", async () => {
    accessIdx = 1;
    const { findByText } = render(<AdminCourseWorkPage />);
    expect(await findByText(/Verifying/)).toBeDefined();
    expect(CourseSessionClientSpy).not.toHaveBeenCalled();
    expect(CourseWorkClientSpy).not.toHaveBeenCalled();
  });
});
