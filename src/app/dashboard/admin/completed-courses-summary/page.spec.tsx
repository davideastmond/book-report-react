import { describe, expect, it, vi } from "vitest";
import CompletedCoursesSummaryPage from "./page";
const serverRedirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: () => serverRedirectMock(),
}));

vi.mock("next-auth", () => {
  return {
    getServerSession: vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        session: {
          user: {
            id: "user-1",
            email: "user1@example.com",
            name: "User One",
            role: "admin",
          },
        },
      }),
  };
});
describe("completed courses summary page tests", () => {
  it("should redirect if user is not authorized to view page", async () => {
    await CompletedCoursesSummaryPage();
    expect(serverRedirectMock).toHaveBeenCalled();
  });
  // it("should render the completed courses summary page for admin user", async () => {
  //   roleIdx = 0;
  //   await CompletedCoursesSummaryPage();

  //   expect(serverRedirectMock).not.toHaveBeenCalled();
  // });
});
