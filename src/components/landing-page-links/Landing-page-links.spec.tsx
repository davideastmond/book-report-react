import { renderHook } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { LandingPageLinks } from "./Landing-page-links";

const routerMock = vi.fn();
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerMock,
  }),
}));

describe("LandingPageLinks Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should redirect authenticated users to the dashboard", async () => {
    authIndex = 0; // Set status to authenticated
    const { result } = renderHook(() => LandingPageLinks());
    expect(result.current).toBeNull(); // Should not render anything
    expect(routerMock).toHaveBeenCalledWith("/dashboard");
  });
  it("should render login and register links for unauthenticated users", async () => {
    authIndex = 1; // Set status to unauthenticated
    const { result } = renderHook(() => LandingPageLinks());
    expect(result.current).not.toBeNull(); // Should render links
    expect(result.current!.props.children).toHaveLength(2); // Should have two links
  });
});
