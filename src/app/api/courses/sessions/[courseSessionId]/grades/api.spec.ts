// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";
import {
  apiGetGradesForCourseSession,
  apiSubmitGradeUpdatesForCourseSession,
} from "./api";

const getServerSessionMock = vi.fn();

vi.mock("next-auth", () => {
  return {
    getServerSession: () => getServerSessionMock(),
  };
});

const mockGradeData = vi
  .fn()
  .mockImplementationOnce(() => [
    {
      id: "grade-1",
      studentId: "student-1",
      courseSessionId: "course-session-1",
      academicTaskId: "task-1",
      grade: 95,
    },
  ])
  .mockImplementationOnce(() => {
    throw new Error("Database error");
  });

vi.mock("@/db/index", () => ({
  db: {
    query: {
      academicGrade: {
        findMany: () => mockGradeData(),
        findFirst: () => ({
          where: vi.fn().mockResolvedValue({ id: "grade-1" }),
        }),
      },
    },
    update: () => ({
      set: () => ({
        where: vi.fn().mockResolvedValue(Promise.resolve()),
      }),
    }),
  },
}));

describe("grades api tests", () => {
  describe("apiGetGradesForCourseSession", () => {
    test("returns an error response when not authenticated", async () => {
      getServerSessionMock.mockResolvedValueOnce(null);
      const result = await apiGetGradesForCourseSession(
        "test-course-session-id"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized");
    });
    test("returns success response when authenticated", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          email: "user1@example.com",
          name: "User One",
          role: "admin",
        },
      });
      const result = await apiGetGradesForCourseSession(
        "test-course-session-id"
      );
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockGradeData).toHaveBeenCalled();
    });
    test("returns an error response when database query fails", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          email: "user1@example.com",
          name: "User One",
          role: "admin",
        },
      });
      const result = await apiGetGradesForCourseSession(
        "test-course-session-id"
      );

      expect(result.success).toBe(false);
      expect(result.message?.includes("Database error")).toBe(true);
    });
  });
  describe("apiSubmitGradeUpdatesForCourseSession", () => {
    test("receive an error response when not authenticated", async () => {
      getServerSessionMock.mockResolvedValueOnce(null);
      const result = await apiSubmitGradeUpdatesForCourseSession(
        "test-course-session-id",
        {
          "task-1": {
            student_1: {
              percentageGrade: 90,
            },
            student_2: {
              percentageGrade: 85,
            },
          },
          "task-2": {
            student_1: {
              percentageGrade: 50,
            },
            student_2: {
              percentageGrade: 50,
            },
          },
        }
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Unauthorized");
    });
    test("processes mock data and returns a success response", async () => {
      getServerSessionMock.mockResolvedValueOnce({
        user: {
          id: "user-1",
          email: "user1@example.com",
          name: "User One",
          role: "admin",
        },
      });
      const result = await apiSubmitGradeUpdatesForCourseSession(
        "test-course-session-id",
        {
          "task-1": {
            student_1: {
              percentageGrade: 90,
            },
            student_2: {
              percentageGrade: 85,
            },
          },
          "task-2": {
            student_1: {
              percentageGrade: 50,
            },
            student_2: {
              percentageGrade: 50,
            },
          },
        }
      );
      console.log(result);
      expect(result.success).toBe(true);
    });
  });
});
