/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, it, vi } from "vitest";
import { CourseClient } from "../../clients/course-client";

describe("CourseClient tests", () => {
  it("should fetch courses successfully", async () => {
    const mockCourses = [
      { id: 1, name: "Course 1", code: "C1" },
      { id: 2, name: "Course 2", code: "C2" },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourses),
      })
    ) as any;

    const courses = await CourseClient.fetchCourses();
    expect(courses).toEqual(mockCourses);
  });

  it("should throw an error when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as any;

    await expect(CourseClient.fetchCourses()).rejects.toThrow(
      "Failed to fetch courses"
    );
  });
});
