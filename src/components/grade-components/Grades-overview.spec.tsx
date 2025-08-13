import { GradesClient } from "@/clients/grades-client";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradesOverviewComponent } from "./Grades-overview";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: "user" },
      expires: "...",
    },
    status: "student",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));

describe("Grades Overview Component", () => {
  GradesClient.getGradesForStudentWithDateRange = vi.fn().mockResolvedValue({
    data: [],
    gpa: "3.6",
  });

  it("renders correctly", async () => {
    const { getByText, findByText, getByLabelText } = render(
      <GradesOverviewComponent />
    );
    expect(getByText(/grades overview/i)).toBeDefined();
    expect(getByLabelText(/session start/i)).toBeDefined();
    expect(getByLabelText(/session end/i)).toBeDefined();
    expect(await findByText(/cumulative gpa/i)).toBeDefined();
    expect(await findByText(/3\.6/i)).toBeDefined();
  });
});
