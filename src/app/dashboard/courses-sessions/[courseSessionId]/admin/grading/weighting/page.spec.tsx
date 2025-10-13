import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GradeWeightingPage from "./page";

const roles = ["user", "admin"];
let roleIdx = 0;
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { email: "test@example.com", role: roles[roleIdx] } },
  }),
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

describe("Weighting Page", () => {
  it("Shows permission error if not admin", () => {
    render(<GradeWeightingPage />);
    expect(
      screen.getByText("You do not have permission to view this page.")
    ).toBeDefined();
  });
  it("doesn't show the error if admin", () => {
    roleIdx = 1;
    render(<GradeWeightingPage />);
    expect(
      screen.queryByText("You do not have permission to view this page.")
    ).toBeNull();
  });
});
