import { UserClient } from "@/clients/user-client";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StudentQueryPage from "./page";

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

UserClient.getAllStudentsAdmin = vi.fn().mockResolvedValue([]);
describe("student-query page", () => {
  it("non-admins should see a permission error message", () => {
    // This test will check if non-admin users see the permission message
    roleIdx = 1;
    const { getByText } = render(<StudentQueryPage />);
    expect(
      getByText("You do not have permission to view this page.")
    ).toBeDefined();
  });
  it("admins should see the Student Query title", () => {
    roleIdx = 0;
    const { getByText } = render(<StudentQueryPage />);
    expect(getByText(/student query/i)).toBeDefined();
  });
});
