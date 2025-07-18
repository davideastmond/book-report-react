import { render } from "@testing-library/react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { DashboardLanding } from "./Dashboard-landing";
const authenticationStatuses = ["authenticated", "unauthenticated", "loading"];
let authIndex = 0;
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: "user" },
      expires: "...",
    },
    status: authenticationStatuses[authIndex],
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));

const mockCall = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockCall,
  }),
}));
describe("dashboard landing page tests", () => {
  afterAll(() => {
    vi.clearAllMocks();
  });
  it("should render the dashboard landing page for authenticated users", () => {
    authIndex = 0;
    const { getByText } = render(<DashboardLanding />);
    expect(getByText("Dashboard")).toBeDefined();
    expect(getByText("Welcome to the dashboard!")).toBeDefined();
  });
  it("should redirect unauthenticated users to the login page", () => {
    authIndex = 1; // Set status to unauthenticated
    const { container } = render(<DashboardLanding />);
    expect(container.firstChild).toBeNull(); // Should not render anything
    expect(mockCall).toHaveBeenCalledWith("/login");
  });
  it("should show a spinner while loading", () => {
    authIndex = 2; // Set status to loading
    const { getByTestId } = render(<DashboardLanding />);
    expect(getByTestId("spinner")).toBeDefined();
  });
});
