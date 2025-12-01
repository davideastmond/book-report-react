/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, test, vi } from "vitest";
import { apiCreateCourseWork, apiGetCourseWorkForSession } from "./api";
const getServerSessionMock = vi.fn();
const courseWorksMock = vi.fn();

vi.mock("next-auth", () => {
  return {
    getServerSession: () => getServerSessionMock(),
  };
});

vi.mock("@/db/index", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve(),
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          fullJoin: () => courseWorksMock(),
        }),
      }),
    }),
  },
}));
describe("course work api tests", () => {
  describe("create course work", () => {
    test("returns unauthorized when not authenticated", async () => {
      getServerSessionMock.mockResolvedValueOnce(null);
      const res = await apiCreateCourseWork("test-course-session-id", {});

      expect(res.success).toBe(false);
      expect(res.message).toBe("Unauthorized");
    });
    test("returns forbidden when user is not admin or teacher", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          role: "student",
        },
      });
      const res = await apiCreateCourseWork("test-course-session-id", {});

      expect(res.success).toBe(false);
      expect(res.message).toBe("Forbidden");
    });
    test("returns validation error for invalid data", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          role: "teacher",
        },
      });
      const res = await apiCreateCourseWork("test-course-session-id", {
        name: "",
        gradeWeightId: "",
        dueDate: "invalid-date" as any,
      });

      expect(res.success).toBe(false);
      expect(res.message).toContain("Validation error");
    });
    test("returns success for valid data", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          role: "admin",
        },
      });
      const res = await apiCreateCourseWork("test-course-session-id", {
        name: "Test Assignment",
        taskType: "assignment",
        gradeValueType: "p",
        description: "A test assignment",
        dueDate: new Date("2025-10-01")
          .toISOString()
          .split("T")[0] as unknown as Date,
        gradeWeightId: "weight-1",
      });
      expect(res.success).toBe(true);
    });
  });
  describe("get course work for session", () => {
    test("returns a successful response with course work data", async () => {
      const mockCourseWorkData = [
        {
          id: "cw-1",
          name: "Assignment 1",
          description: "First assignment",
          taskType: "assignment",
          dueDate: new Date(),
          gradeValueType: "points",
          gradeWeightId: "weight-1",
        },
      ];
      courseWorksMock.mockResolvedValueOnce(mockCourseWorkData);
      const res = await apiGetCourseWorkForSession("test-course-session-id");
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockCourseWorkData);
    });
    test("db error causes unsuccessful response", async () => {
      courseWorksMock.mockRejectedValueOnce(new Error("DB error"));
      const res = await apiGetCourseWorkForSession("test-course-session-id");
      expect(res.success).toBe(false);
      expect(res.data).toBeUndefined();
      expect(res.message).toBe("Failed to fetch course work: DB error");
    });
  });
});
