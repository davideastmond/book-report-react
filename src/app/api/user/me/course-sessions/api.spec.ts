import { describe, expect, test, vi } from "vitest";
import { apiUserGetCoursesSessions } from "./api";

const serverSessionMock = vi.fn();
const courseSessionsResultsMock = vi.fn();
vi.mock("next-auth", () => {
  return {
    getServerSession: () => serverSessionMock(),
  };
});

vi.mock("@/db/index", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          fullJoin: () => ({
            fullJoin: () => courseSessionsResultsMock(),
          }),
          innerJoin: () => ({
            innerJoin: () => ({
              innerJoin: () => courseSessionsResultsMock(),
            }),
          }),
        }),
      }),
    }),
  },
}));
describe("API user course sessions [me] tests", () => {
  describe("apiUserGetCoursesSessions", () => {
    test("Returns unauthorized when no session", async () => {
      serverSessionMock.mockResolvedValueOnce(null);
      const { apiUserGetCoursesSessions } = await import("./api");
      const res = await apiUserGetCoursesSessions();
      expect(res).toEqual({
        success: false,
        message: "Unauthorized",
      });
    });
    // Test teacher and admin paths together using test.each
    test.each(["teacher", "admin"])("Return data for %s user", async (role) => {
      serverSessionMock.mockResolvedValueOnce({
        user: {
          id: "test-user-id",
          role,
        },
      });
      courseSessionsResultsMock.mockResolvedValue({});

      const result = await apiUserGetCoursesSessions();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();

      expect(result.message).toBe("admin");
    });
    test("Returns data for student user", async () => {
      serverSessionMock.mockResolvedValueOnce({
        user: {
          id: "student-user-id",
          role: "student",
        },
      });
      courseSessionsResultsMock.mockResolvedValue({});
      const result = await apiUserGetCoursesSessions();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.message).toBe("student");
    });
    test("request for student data receives a database error - expect an not successful response", async () => {
      serverSessionMock.mockResolvedValueOnce({
        user: {
          id: "student-user-id",
          role: "student",
        },
      });
      courseSessionsResultsMock.mockRejectedValueOnce(
        new Error("Database error")
      );
      const result = await apiUserGetCoursesSessions();

      expect(result.success).toBe(false);
      expect(
        result.message.includes("Failed to fetch course sessions for student:")
      ).toBe(true);
    });
  });
});
