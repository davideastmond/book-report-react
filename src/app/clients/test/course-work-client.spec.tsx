/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { AcademicTask } from "@/db/schema";
import { describe, expect, it, vi } from "vitest";
import { CourseWorkClient } from "../course-work-client";

describe("CourseWorkClient tests", () => {
  describe("createCourseWork", () => {
    it("should create course work successfully", async () => {
      const mockResponse = new Response(null, {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const data = { title: "New Assignment" } as Partial<AcademicTask>;
      await CourseWorkClient.createCourseWork({
        data,
        courseSessionId: "courseId",
      });
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/courses/sessions/courseId/course-work`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(data),
        })
      );
    });
    it("should handle create failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: () =>
            Promise.resolve({ error: "Failed to create course work" }),
        })
      ) as any;

      await expect(
        CourseWorkClient.createCourseWork({
          data: { name: "New Assignment" },
          courseSessionId: "courseId",
        })
      ).rejects.toThrow("Failed to create course work");
    });
  });
  describe("getCourseWorkForSession", () => {
    it("should fetch course work successfully", async () => {
      const mockCourseWork = [
        { id: "1", title: "Assignment 1" },
        { id: "2", title: "Assignment 2" },
      ];

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCourseWork),
        })
      ) as any;

      const courseWork = await CourseWorkClient.getCourseWorkForSession(
        "courseId"
      );
      expect(courseWork).toEqual(mockCourseWork);
    });

    it("should handle fetch failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: () => Promise.resolve({ error: "Failed to fetch course work" }),
        })
      ) as any;

      await expect(
        CourseWorkClient.getCourseWorkForSession("courseId")
      ).rejects.toThrow("Failed to fetch course work");
    });
    it("error is undefined, should throw 'Unknown error'", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: () => Promise.resolve({}),
        })
      ) as any;

      await expect(
        CourseWorkClient.getCourseWorkForSession("courseId")
      ).rejects.toThrow("Failed to fetch course work: Unknown error");
    });
  });
  describe("getCourseWorkById", () => {
    it("should fetch course work by ID successfully", async () => {
      const mockCourseWork = { id: "1", title: "Assignment 1" };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCourseWork),
        })
      ) as any;

      const courseWork = await CourseWorkClient.getCourseWorkById({
        courseSessionId: "courseId",
        courseWorkId: "1",
      });
      expect(courseWork).toEqual(mockCourseWork);
    });

    it("should handle fetch failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.resolve({ error: "Course work not found" }),
        })
      ) as any;

      await expect(
        CourseWorkClient.getCourseWorkById({
          courseSessionId: "courseId",
          courseWorkId: "1",
        })
      ).rejects.toThrow("Course work not found");
    });
    it("error is undefined, should throw 'Unknown error'", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.resolve({}),
        })
      ) as any;

      await expect(
        CourseWorkClient.getCourseWorkById({
          courseSessionId: "courseId",
          courseWorkId: "1",
        })
      ).rejects.toThrow("Failed to fetch course work by ID: Unknown error");
    });
  });
  describe("updateCourseWorkAttributesById", () => {
    it("should update course work attributes successfully", async () => {
      const mockResponse = new Response(null, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const data = { title: "Updated Assignment" } as Partial<AcademicTask>;
      await CourseWorkClient.updateCourseWorkAttributesById(
        "courseId",
        "1",
        data
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/courses/sessions/courseId/course-work/1`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(data),
        })
      );
    });
    it("should handle update failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: () =>
            Promise.resolve({ error: "Failed to update course work" }),
        })
      ) as any;

      await expect(
        CourseWorkClient.updateCourseWorkAttributesById("courseId", "1", {
          name: "Updated Assignment",
        })
      ).rejects.toThrow("Failed to update course work");
    });
    it("error is undefined, should throw 'Unknown error'", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          json: () => Promise.resolve({}),
        })
      ) as any;

      await expect(
        CourseWorkClient.updateCourseWorkAttributesById("courseId", "1", {
          name: "Updated Assignment",
        })
      ).rejects.toThrow(
        "Failed to update course work attributes: Unknown error"
      );
    });
  });
});
