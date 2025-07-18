import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NavBar } from "./NavBar";

const roles = ["admin", "teacher", "user"];
const signOutMock = vi.fn();
let roleIndex = 0;

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(() => {
    return signOutMock();
  }),
  useSession: () => ({
    data: {
      user: {
        name: "Test User",
        role: roles[roleIndex],
        email: "test@test.com",
      },
    },
  }),
}));
vi.mock("./useAdminAuthorized", () => ({
  useAdminAuthorized: () => ({
    isAdminAuthorized: true,
  }),
}));
vi.mock("./useAdmin", () => ({
  useAdmin: () => ({
    isStrictlyAdmin: true,
  }),
}));
describe("Main NavBar tests", () => {
  describe("Admin NavBar tests", () => {
    it("should render the admin link when isStrictlyAdmin is true", () => {
      roleIndex = 0;
      const { getByText } = render(<NavBar />);
      expect(getByText("Admin")).toBeDefined();
    });

    it("should not render the admin link when isStrictlyAdmin is false", () => {
      roleIndex = 2;
      const { queryByText } = render(<NavBar />);
      expect(queryByText("Admin")).toBeNull();
    });
  });
  describe("Log out button functions", () => {
    it("should call signOut when the logout button is clicked", () => {
      const { getByText } = render(<NavBar />);
      const logoutButton = getByText(/log out/i);
      expect(logoutButton).toBeDefined();
      logoutButton.click();
      expect(signOutMock).toHaveBeenCalled();
    });
  });
  describe("Student role nav-bar", () => {
    it("My Grades link should render for student role", () => {
      roleIndex = 2;
      const { getByText } = render(<NavBar />);
      expect(getByText(/my grades/i)).toBeDefined();
    });
  });
});
