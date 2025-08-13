import { CourseSessionClient } from "@/clients/course-session-client";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompletedCoursesSummaryPage from "./page";

const mockRoles = ["admin", "student"];
let roleIdx = 1;

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

describe("completed courses summary page tests", () => {
  it("should show message when user doesn't have access to page", async () => {
    roleIdx = 1;
    const { getByText } = render(<CompletedCoursesSummaryPage />);
    expect(
      getByText(/you do not have permission to view this page/i)
    ).toBeDefined();
  });
  it("the access message should not appear for admin users", async () => {
    CourseSessionClient.fetchGroupedCourseSessionByCourse = vi
      .fn()
      .mockResolvedValue([]);
    roleIdx = 0;
    const { queryByText } = render(<CompletedCoursesSummaryPage />);
    expect(
      queryByText(/you do not have permission to view this page/i)
    ).toBeNull();
  });
});
