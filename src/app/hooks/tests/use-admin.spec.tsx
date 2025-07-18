/* eslint @typescript-eslint/no-explicit-any: "off" */
import { CourseSessionClient } from "@/clients/course-session-client";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAdmin } from "../use-admin";

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

CourseSessionClient.fetchCourseSessionByIdAdmin = vi.fn(() =>
  Promise.resolve({
    students: {
      studentId: {
        id: "student-id",
        name: "Mocked Student",
        email: "student@example.com",
      },
    },
    isEnrolled: true,
    courseSessionData: {},
  })
) as any;

describe("hooks - useAdmin", () => {
  it.each([
    [roles[0], true, true, true],
    [roles[1], true, false, true],
    [roles[2], false, false, false],
  ])(
    "should return isAdminEditable, isStrictlyAdmin and isBusy for role %s",
    async (_, expectedEditable, expectedStrict, expectedIsBusy) => {
      const { result } = renderHook(() => useAdmin("courseSessionId"));
      expect(result.current.isAdminEditable).toBe(expectedEditable);
      expect(result.current.isStrictlyAdmin).toBe(expectedStrict);

      await waitFor(() => {
        expect(result.current.isBusy).toBe(expectedIsBusy);
      });
      roleIndex += 1;
    }
  );
});
