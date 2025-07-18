import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminStatsNav } from "./Admin-stats-nav";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ courseSessionId: "123" })),
}));
describe("AdminStatsNav", () => {
  it("renders the navigation with correct links", () => {
    const { getByText, getByRole } = render(<AdminStatsNav />);

    expect(getByText("Assignments Stats")).toBeDefined();
    const link = getByRole("link", { name: "Assignments Stats" }).getAttribute(
      "href"
    );
    expect(link).toBe("/dashboard/admin/123/stats/assignments");
  });
});
