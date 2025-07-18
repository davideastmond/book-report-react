import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseSessionsNavToolbar } from "./Course-sessions-nav-toolbar";

const courseSessionIdOptions = ["123", undefined];
const idFromSearchParamsOptions = ["fallbackId", null];
let csIdx = 0;
let idIdx = 0;
vi.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));
vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ courseSessionId: courseSessionIdOptions[csIdx] })),
  useSearchParams: vi.fn(
    () =>
      new URLSearchParams({ id: idFromSearchParamsOptions[idIdx] as string })
  ),
}));
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        role: "admin",
      },
    },
  }),
}));
describe("Course sessions nav toolbar", () => {
  it("links are rendered correctly for admin users - courseSessionId is defined", async () => {
    const { findByText, findByRole } = render(<CourseSessionsNavToolbar />);
    const textElement = await findByText("Exams and Course Work");

    expect(textElement).toBeDefined();
    const linkElement = (
      await findByRole("link", { name: "Exams and Course Work" })
    ).getAttribute("href");
    expect(linkElement).toBe(
      "/dashboard/courses-sessions/123/admin/course-work"
    );
  });
  it("links are rendered correctly for admin users with fallback value: courseSessionId is undefined", async () => {
    csIdx = 1;
    idIdx = 0; // idFromSearchParams is fallbackId
    const { findByText, findByRole } = render(<CourseSessionsNavToolbar />);
    const textElement = await findByText("Exams and Course Work");

    expect(textElement).toBeDefined();
    const linkElement = (
      await findByRole("link", { name: "Exams and Course Work" })
    ).getAttribute("href");
    expect(linkElement).toBe(
      "/dashboard/courses-sessions/fallbackId/admin/course-work"
    );
  });
  it("Renders null when no courseSessionId or fall back is available", () => {
    csIdx = 1;
    idIdx = 1; // idFromSearchParams is null
    const { container } = render(<CourseSessionsNavToolbar />);
    expect(container.firstChild).toBeNull();
  });
});
