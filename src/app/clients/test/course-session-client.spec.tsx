/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, it, vi } from "vitest";
import { CourseSessionClient } from "../course-session-client";

describe("CourseSessionClient tests", () => {
  describe("createCourseSession", () => {
    it("should create course session successfully", async () => {
      const mockResponse = new Response(null, {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await CourseSessionClient.createCourseSession({
        courseId: "courseId",
        sessionStart: new Date("2023-01-01"),
        sessionEnd: new Date("2023-01-02"),
        description: "Test Session",
        studentAllotment: 30,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            courseId: "courseId",
            sessionStart: new Date("2023-01-01"),
            sessionEnd: new Date("2023-01-02"),
            description: "Test Session",
            studentAllotment: 30,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
    it("should throw an error when create course session fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.createCourseSession({
          courseId: "courseId",
          sessionStart: new Date("2023-01-01"),
          sessionEnd: new Date("2023-01-02"),
          description: "Test Session",
          studentAllotment: 30,
        })
      ).rejects.toThrow("Failed to create course");
    });
  });
  describe("patchCourseSession", () => {
    it("should patch course session successfully", async () => {
      const mockResponse = new Response(null, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await CourseSessionClient.patchCourseSession("sessionId", {
        description: "Updated Description",
        sessionStart: new Date("2023-01-03"),
        sessionEnd: new Date("2023-01-04"),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions/sessionId",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            description: "Updated Description",
            sessionStart: new Date("2023-01-03"),
            sessionEnd: new Date("2023-01-04"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
    it("should not throw an error when patch course session succeeds", async () => {
      const mockResponse = new Response(null, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.patchCourseSession("sessionId", {
          description: "Updated Description",
          sessionStart: new Date("2023-01-03"),
          sessionEnd: new Date("2023-01-04"),
        })
      ).resolves.not.toThrow();
    });
  });
  describe("fetchCourseSessionsAdmin", () => {
    it("should fetch course sessions successfully", async () => {
      const mockResponse = new Response(JSON.stringify({ sessions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const result = await CourseSessionClient.fetchCourseSessionsAdmin();

      expect(result).toEqual({ sessions: [] });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/user/admin/me/course-sessions",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error when fetching course sessions fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.fetchCourseSessionsAdmin()
      ).rejects.toThrow("Failed to fetch course sessions");
    });
  });
  describe("fetchCourseSessionsByStudent", () => {
    it("should fetch course sessions by student successfully", async () => {
      const mockResponse = new Response(JSON.stringify({ sessions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const result = await CourseSessionClient.fetchCourseSessionsByStudent();

      expect(result).toEqual({ sessions: [] });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/user/me/course-sessions",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error when fetching course sessions by student fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.fetchCourseSessionsByStudent()
      ).rejects.toThrow("Failed to fetch course sessions");
    });
  });
  describe("fetchCourseSessionByIdAdmin", () => {
    it("should fetch course session by ID successfully", async () => {
      const mockResponse = new Response(
        JSON.stringify({ session: { id: "sessionId" } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const result = await CourseSessionClient.fetchCourseSessionByIdAdmin(
        "sessionId"
      );

      expect(result).toEqual({ session: { id: "sessionId" } });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions/sessionId",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error when fetching course session by ID fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.fetchCourseSessionByIdAdmin("sessionId")
      ).rejects.toThrow("Failed to fetch course sessions");
    });
  });
  describe("addStudentToCourseSession", () => {
    it("should add student to course session successfully", async () => {
      const mockResponse = new Response(null, {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await CourseSessionClient.addStudentToCourseSession({
        courseSessionId: "sessionId",
        studentId: "studentId",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions/sessionId/student",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ studentId: "studentId" }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error when adding student to course session fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.addStudentToCourseSession({
          courseSessionId: "sessionId",
          studentId: "studentId",
        })
      ).rejects.toThrow("Failed to add user to course session");
    });
  });
  describe("removeStudentFromCourseSession", () => {
    it("should remove student from course session successfully", async () => {
      const mockResponse = new Response(null, {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await CourseSessionClient.removeStudentFromCourseSession({
        courseSessionId: "sessionId",
        studentId: "studentId",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions/sessionId/student",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({ studentId: "studentId" }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should throw an error when removing student from course session fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(
        CourseSessionClient.removeStudentFromCourseSession({
          courseSessionId: "sessionId",
          studentId: "studentId",
        })
      ).rejects.toThrow("Failed to remove user from session");
    });
  });
  describe("fetchAvailableCourses", () => {
    it("should fetch course session by ID successfully - show completed true", async () => {
      const mockResponse = new Response(
        JSON.stringify({ session: { id: "sessionId" } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const result = await CourseSessionClient.fetchAvailableCourses(true);

      expect(result).toEqual({ session: { id: "sessionId" } });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions?showCompleted=true",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
    it("should fetch course session by ID successfully - show completed false", async () => {
      const mockResponse = new Response(
        JSON.stringify({ session: { id: "sessionId" } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const result = await CourseSessionClient.fetchAvailableCourses();

      expect(result).toEqual({ session: { id: "sessionId" } });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/courses/sessions?showCompleted=false",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
    it("should throw an error when fetching available courses fails", async () => {
      const mockResponse = new Response(null, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      await expect(CourseSessionClient.fetchAvailableCourses()).rejects.toThrow(
        "Failed to fetch available courses"
      );
    });
  });
});
