import { apiGetCourses } from "@/api/courses/api";
import { db } from "@/db/index";
import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: () => ({
    query: {
      course: {
        findMany: vi.fn(),
      },
    },
  }),
}));

describe("apiGetCourses", () => {
  afterEach(() => vi.restoreAllMocks());
  test("should fetch courses successfully", async () => {
    const mockCourses = [
      { id: 1, name: "Course 1", description: "Description 1" },
      { id: 2, name: "Course 2", description: "Description 2" },
    ];
    const successFullMockCall = vi.fn().mockResolvedValueOnce(mockCourses);
    db.query.course.findMany = successFullMockCall;
    const result = await apiGetCourses();

    expect(successFullMockCall).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Array);
  });
  test("handles errors when fetching courses", async () => {
    db.query.course.findMany = vi
      .fn()
      .mockRejectedValueOnce(new Error("DB error"));
    const result = await apiGetCourses();
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to fetch courses");
  });
});
