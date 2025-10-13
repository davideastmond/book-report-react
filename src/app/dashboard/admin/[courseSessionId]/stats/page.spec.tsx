import { CourseSessionClient } from "@/clients/course-session-client";
import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import CourseSessionStatsPage from "./page";
const mockRoles = ["admin", "student"];

let roleIdx = 0;
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/test.jpg",
        role: mockRoles[roleIdx],
      },
    },
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const routerMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => routerMock(),
  }),
  useParams: () => ({
    courseSessionId: "session123",
  }),
}));

describe("Admin Stats Page", () => {
  CourseSessionClient.getFinalGradeReport = vi.fn().mockResolvedValue({
    data: {
      average: 85,
      total: 100,
    },
  });

  CourseSessionClient.getCourseGradeAverage = vi.fn().mockResolvedValue({
    data: {
      average: 80,
      total: 100,
    },
  });

  CourseSessionClient.fetchCourseSessionByIdAdmin = vi.fn().mockResolvedValue({
    courseSessionData: {
      id: "session123",
      courseCode: "testcode",
      title: "Test Course Session",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
    },
  });

  test("renders correctly", async () => {
    roleIdx = 0; // Admin role
    const { findByText } = render(<CourseSessionStatsPage />);
    expect(await findByText(/Course Session Grade Avg\./i)).toBeDefined();
  });
});
