// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";
import { apiGetCourseWorkById, apiUpdateCourseWorkAttributesById } from "./api";
const dbMock = vi.fn();
const dbRetuningMock = vi.fn();
vi.mock("@/db/index", () => ({
  db: {
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => dbRetuningMock(),
        }),
      }),
    }),
    query: {
      courseWork: {
        findFirst: () => dbMock(),
      },
      academicTask: {
        findFirst: () => dbMock(),
      },
    },
  },
}));
describe("course work api tests", () => {
  describe("apiGetCourseWorkById", () => {
    test("Academic task isn't found. Returns not successful message", async () => {
      dbMock.mockResolvedValueOnce(null);
      const result = await apiGetCourseWorkById("non-existent-id");
      expect(result).toEqual({
        success: false,
        message: "Academic task (course work) not found",
      });
    });
    test("Academic task is found. Returns successful with data", async () => {
      const mockAcademicTask = {
        id: "existing-id",
        name: "Test Task",
        description: "This is a test task",
        taskType: "assignment",
        dueDate: new Date(),
        gradeValueType: "points",
        gradeWeightId: "weight-1",
      };
      dbMock.mockResolvedValueOnce(mockAcademicTask);
      const result = await apiGetCourseWorkById("existing-id");
      expect(result).toEqual({
        success: true,
        data: mockAcademicTask,
      });
    });
    test("Database error occurs. Returns not successful with error message", async () => {
      dbMock.mockRejectedValueOnce(new Error("Database error"));
      const result = await apiGetCourseWorkById("any-id");
      expect(result).toEqual({
        success: false,
        message: "Error fetching course work: Database error",
      });
    });
  });
  describe("apiUpdateCourseWorkAttributesById", () => {
    test("Validation error occurs. Returns not successful with validation messages", async () => {
      const invalidData = {
        name: "", // Assuming name cannot be empty
      };
      const result = await apiUpdateCourseWorkAttributesById(
        "any-id",
        invalidData
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain("Validation error:");
    });
    test("Academic task to update not found. Returns not successful message", async () => {
      const validData = {
        name: "Updated Task Name",
        description: "Updated description",
        taskType: "exam" as const,
        dueDate: new Date("2026-01-01")
          .toISOString()
          .split("T")[0] as unknown as Date,
        gradeValueType: "p" as const,
        gradeWeightId: "weight-2",
      };

      dbRetuningMock.mockResolvedValueOnce([]); // Simulate not found
      const result = await apiUpdateCourseWorkAttributesById(
        "non-existent-id",
        validData
      );
      expect(result).toEqual({
        success: false,
        message: "Academic task (course work) not found for update",
      });
    });
    test("Valid data provided. Returns successful update", async () => {
      const validData = {
        name: "Updated Task Name",
        description: "Updated description",
        taskType: "exam" as const,
        dueDate: new Date("2026-01-01")
          .toISOString()
          .split("T")[0] as unknown as Date,
        gradeValueType: "p" as const,
        gradeWeightId: "weight-2",
      };
      dbMock.mockResolvedValueOnce({}); // Mock successful update
      dbRetuningMock.mockResolvedValueOnce([{}]); // Mock returning updated record
      const result = await apiUpdateCourseWorkAttributesById(
        "existing-id",
        validData
      );
      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });
  });
});
