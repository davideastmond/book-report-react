import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssignmentsPage from "./page";

const mockRoles = ["admin", "teacher", "student"];
let mockRoleIndex = 2;
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: mockRoles[mockRoleIndex] },
      expires: "...",
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({
    courseSessionId: "mockedCourseSessionId",
  })),
}));

vi.mock("@/components/assignments-overview/Assignments-overview", () => ({
  AssignmentsOverview: () => <div>Mocked Assignments Overview</div>,
}));

describe("Assignments Page", () => {
  it("renders correctly - isAdminAuthorized is false", async () => {
    // Test implementation
    mockRoleIndex = 2;
    const { findByText } = render(<AssignmentsPage />);
    const result = await findByText(
      /You do not have permission to view this page/
    );
    expect(result).toBeDefined();
  });

  it("renders correctly - isAdminAuthorized is true", () => {
    // Change mockRoleIndex
    mockRoleIndex = 0; // Set to 'admin' role
    const { queryByText } = render(<AssignmentsPage />);
    const result = queryByText(/You do not have permission to view this page/);
    expect(result).toBeNull();
  });
});
