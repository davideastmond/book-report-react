import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import AdminGradingPage from "./page";

let roleIdx = 0;
let userDataIdx = 0;
const roles = ["user", "admin"];
const userData = [{ email: "test@example.com", role: roles[roleIdx] }, null];

const replaceMockFunction = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: userData[userDataIdx] },
  }),
}));

vi.mock("next/navigation", () => {
  return {
    useParams: () => ({
      courseSessionId: "test-course-session-id",
    }),
    useRouter: () => ({
      push: vi.fn(),
      replace: replaceMockFunction,
      query: {},
    }),
  };
});

CourseSessionClient.fetchCourseSessionByIdAdmin = vi.fn().mockResolvedValue({
  courseSessionData: {
    instructorFirstName: "Test",
    instructorLastName: "User",
    courseSessionId: "test-course-session-id",
  },
  students: [],
});

CourseSessionClient.fetchGradesForCourseSession = vi.fn().mockResolvedValue([]);
CourseWorkClient.getCourseWorkForSession = vi.fn().mockResolvedValue([]);

describe("Admin grade weighting page", () => {
  describe("authorization test cases", () => {
    test("adminAuthorized is null shows spinner", async () => {
      roleIdx = 0;
      userDataIdx = 1;
      const { getByTestId } = render(<AdminGradingPage />);

      expect(getByTestId(/spinner/)).toBeDefined();
    });
    test("non-admin redirects to dashboard", async () => {
      roleIdx = 0;
      userDataIdx = 0;

      render(<AdminGradingPage />);
      expect(replaceMockFunction).toHaveBeenCalledWith("/dashboard");
    });
    test("admin shows page", async () => {
      userDataIdx = 0;
      roleIdx = 1;
      userData[0]!.role = roles[roleIdx];
      const { findByText } = render(<AdminGradingPage />);
      expect(await findByText(/admin grading page/i)).toBeDefined();
    });
  });
});
