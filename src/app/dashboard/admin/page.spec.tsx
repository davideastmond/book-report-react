import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminPage from "./page";
const accessLevels = ["student", "admin"];
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

describe("Admin Page Tests", () => {
  it("User is not adminAuthorized, should see the permission denied page", () => {
    accessIdx = 0; // student
    const { getByText } = render(<AdminPage />);
    expect(
      getByText(/You do not have permission to view this page/i)
    ).toBeDefined();
  });
  it("shows welcome message when user is admin", () => {
    accessIdx = 1; // admin
    const { getByText } = render(<AdminPage />);
    expect(getByText(/welcome to the admin dashboard/i)).toBeDefined();
  });
});
