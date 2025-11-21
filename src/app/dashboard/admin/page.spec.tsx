import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPage from "./page";
const serverRedirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: () => serverRedirectMock(),
}));

vi.mock("next-auth", () => {
  return {
    getServerSession: vi
      .fn()
      .mockResolvedValueOnce({
        session: {
          user: {
            id: "user-1",
            email: "user1@example.com",
            name: "User One",
            role: "student",
          },
        },
      })
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

describe("Admin Page Tests", () => {
  it("User is not adminAuthorized, should see the permission denied page", async () => {
    await AdminPage();
    expect(serverRedirectMock).toHaveBeenCalled();
  });
  it("shows welcome message when user is admin", async () => {
    const { findByText } = render(<AdminPage />);
    await expect(findByText(/welcome to the admin dashboard/i)).toBeDefined();
  });
});
