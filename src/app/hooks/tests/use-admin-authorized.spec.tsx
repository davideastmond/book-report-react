import { cleanup, renderHook } from "@testing-library/react";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminAuthorized } from "../use-admin-authorized";

const roles = ["admin", "teacher", "user"];
let roleIndex = 0;
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: "Mocked User", role: roles[roleIndex] },
      expires: "...",
    },
    status: "authenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children, // Pass children directly
}));
describe("hooks - useAdminAuthorized", () => {
  beforeEach(() => {
    cleanup();
  });

  it.each([
    [roles[0], true],
    [roles[1], true],
    [roles[2], false],
  ])("should return true for admin role", (role, expected) => {
    const { result } = renderHook(() => useAdminAuthorized());
    expect(result.current.isAdminAuthorized).toBe(expected);
    roleIndex += 1;
  });
});
