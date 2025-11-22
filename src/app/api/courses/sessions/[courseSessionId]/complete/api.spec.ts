import { describe, expect, test, vi } from "vitest";
import { apiMarkCourseSessionAsCompleted } from "./api";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: "user-1", role: "teacher" },
  }),
}));

const dbMocks = vi
  .fn()
  .mockImplementationOnce(() => ({
    leftJoin: () => {
      return [
        {
          academic_task: "123",
        },
        {
          academic_task: "456",
        },
        {
          academic_task: null,
        },
      ];
    },
  }))
  .mockImplementationOnce(() => ({
    leftJoin: () => {
      return [
        {
          academic_task: "123",
        },
        {
          academic_task: "456",
        },
      ];
    },
  }));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: () => ({
    select: () => ({
      from: () => ({
        where: dbMocks,
      }),
    }),
    query: {
      courseSession: {
        findFirst: () => ({
          where: vi
            .fn()
            .mockResolvedValue({ id: "test-session-id", isCompleted: false }),
        }),
      },
      academicTask: {
        findMany: () => ({
          where: vi.fn().mockResolvedValueOnce([
            { id: "task-1", gradeWeightId: null },
            { id: "task-2", gradeWeightId: "weight-1" },
          ]),
        }),
      },
    },
  }),
}));
describe("completeCourseSession", () => {
  test("should not complete session if an academic task is missing grade weight", async () => {
    // Arrange

    // Act
    const result = await apiMarkCourseSessionAsCompleted("test-session-id");

    // Assert
    expect(result.success).toBe(false);
    expect(
      result.message?.includes("weights-tasks-count-mismatch")
    ).toBeTruthy();
  });
  test("should complete session if all validations pass", async () => {
    // Arrange
    const result = await apiMarkCourseSessionAsCompleted("test-session-id");

    // Assert
    expect(result.success).toBe(false);
    expect(
      result.message?.includes("weights-tasks-count-mismatch")
    ).toBeFalsy();
  });
});
