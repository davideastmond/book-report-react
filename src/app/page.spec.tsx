import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: "student" },
      expires: "...",
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));
describe("Page", () => {
  it("renders link to the dashboard and image, and the landing page links ", () => {
    const { container, getByTestId, getByAltText } = render(<Page />);
    expect(container).toBeDefined();
    expect(getByTestId("app-logo-link")).toBeDefined();
    expect(getByAltText("app-logo")).toBeDefined();
  });
});
