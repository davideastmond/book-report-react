import { apiToggleLockedStatusForCourseSession } from "@/api/courses/sessions/[courseSessionId]/lock/api";

import { describe, expect, test, vi } from "vitest";

const dbMock = vi
  .fn()
  .mockImplementationOnce(() => Promise.resolve())
  .mockImplementationOnce(() => Promise.reject(new Error("DB error")));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: {
      role: "admin",
    },
  }),
}));
vi.mock("@/db/index", () => ({
  db: {
    update: () => ({
      set: () => ({
        where: dbMock,
      }),
    }),
  },
}));
describe("api - courses/sessions/[courseSessionId]/lock", () => {
  // Tests will be added here in the future

  test("lock is toggled successfully", async () => {
    const result = await apiToggleLockedStatusForCourseSession(
      "test-session-id"
    );
    expect(result.success).toBe(true);
    expect(dbMock).toHaveBeenCalled();
  });
  test("handles DB errors gracefully", async () => {
    const result = await apiToggleLockedStatusForCourseSession(
      "test-session-id"
    );
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to toggle lock status: DB error");
  });
});
