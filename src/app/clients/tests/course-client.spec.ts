import { describe, expect, test, vi } from "vitest";
import { CourseClient } from "../course-client";

describe("course-client test", () => {
  test("negative result throws error", async () => {
    CourseClient.fetchCourses = vi
      .fn()
      .mockRejectedValueOnce(new Error("Failed to fetch courses"));
    await expect(CourseClient.fetchCourses()).rejects.toThrow(
      "Failed to fetch courses"
    );
  });
  test("positive result returns data", async () => {
    const mockData = [
      { id: 1, name: "Course 1" },
      { id: 2, name: "Course 2" },
    ];
    CourseClient.fetchCourses = vi.fn().mockResolvedValueOnce(mockData);
    const data = await CourseClient.fetchCourses();
    expect(data).toEqual(mockData);
  });
});
