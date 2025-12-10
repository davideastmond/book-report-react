import * as GradeReportAPI from "@/api/courses/sessions/[courseSessionId]/analytics/final-grade-report/api";
import * as CourseSessionAPI from "@/api/courses/sessions/[courseSessionId]/api";
import * as StudentAPI from "@/api/courses/sessions/[courseSessionId]/student/api";
import * as CoursesSessionsApi from "@/api/courses/sessions/api";
import * as CourseSessionAdminApi from "@/api/user/admin/me/course-sessions/api";
import * as UserMeCoursesSessions from "@/api/user/me/course-sessions/api";
import { SummarizedData } from "@/lib/controller/grades/calculations/definitions";

import { CourseSessionInfo } from "@/lib/types/db/course-session-info";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { CourseSessionClient } from "./course-session-client";

vi.mock("@/api/courses/sessions/[courseSessionId]/api");
vi.mock("@/api/courses/sessions/[courseSessionId]/student/api");

describe("CourseSessionClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("createCourseSession", () => {
    it("throws error when API returns success: false", async () => {
      vi.spyOn(
        CoursesSessionsApi,
        "apiPostCreateCourseSession"
      ).mockResolvedValue({
        success: false,
        message: "Invalid course ID",
      });

      await expect(
        CourseSessionClient.createCourseSession({
          courseId: "invalid-id",
        })
      ).rejects.toThrow("Invalid course ID");
    });
  });
  describe("patchCourseSession", () => {
    it("builds payload with only provided fields", async () => {
      const spy = vi
        .spyOn(CourseSessionAPI, "apiPatchCoursesSessionById")
        .mockResolvedValue({ success: true });

      await CourseSessionClient.patchCourseSession("session-123", {
        description: "New description",
        sessionStart: new Date("2024-01-01"),
      });

      expect(spy).toHaveBeenCalledWith("session-123", {
        description: "New description",
        sessionStart: new Date("2024-01-01"),
      });
    });
  });
  describe("fetchCourseSessionsAdmin", () => {
    it("returns list of CourseSessionInfo", async () => {
      const spy = vi
        .spyOn(CourseSessionAdminApi, "apiAdminGetCoursesSessions")
        .mockResolvedValue({
          success: true,
          data: [],
        });

      const result = await CourseSessionClient.fetchCourseSessionsAdmin(
        "fake-user"
      );
      expect(spy).toHaveBeenCalledWith("fake-user");
      expect(result).toEqual([]);
    });
    it("throws error when API returns success: false", async () => {
      vi.spyOn(
        CourseSessionAdminApi,
        "apiAdminGetCoursesSessions"
      ).mockResolvedValue({
        success: false,
        message: "Unauthorized",
      });

      await expect(
        CourseSessionClient.fetchCourseSessionsAdmin("fake-user")
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("fetchCourseSessionsByStudent", () => {
    it("returns CourseSessionsAPIResponse on success", async () => {
      const spy = vi
        .spyOn(UserMeCoursesSessions, "apiUserGetCoursesSessions")
        .mockResolvedValue({
          success: true,
          message: "",
          data: [],
        });

      const result = await CourseSessionClient.fetchCourseSessionsByStudent();
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe("addStudentToCourseSession", () => {
    it("throws error when API returns success: false", async () => {
      vi.spyOn(StudentAPI, "apiAddStudentToCourseSession").mockResolvedValue({
        success: false,
        message: "Course is full",
      });

      await expect(
        CourseSessionClient.addStudentToCourseSession({
          courseSessionId: "session-123",
          studentId: "student-456",
        })
      ).rejects.toThrow("Course is full");
    });

    it("calls API with correct parameters on success", async () => {
      const spy = vi
        .spyOn(StudentAPI, "apiAddStudentToCourseSession")
        .mockResolvedValue({ success: true });

      await CourseSessionClient.addStudentToCourseSession({
        courseSessionId: "session-123",
        studentId: "student-456",
      });

      expect(spy).toHaveBeenCalledWith("session-123", "student-456");
    });
  });
  describe("removeStudentFromCourseSession", () => {
    test("throws error when API returns success: false", async () => {
      vi.spyOn(
        StudentAPI,
        "apiRemoveStudentFromCourseSession"
      ).mockResolvedValue({
        success: false,
        message: "Student not enrolled",
      });

      await expect(
        CourseSessionClient.removeStudentFromCourseSession({
          courseSessionId: "session-123",
          studentId: "student-456",
        })
      ).rejects.toThrow("Student not enrolled");
    });
    test("No error is thrown on a success response", async () => {
      const spy = vi
        .spyOn(StudentAPI, "apiRemoveStudentFromCourseSession")
        .mockResolvedValue({ success: true });

      await expect(async () =>
        CourseSessionClient.removeStudentFromCourseSession({
          courseSessionId: "session-123",
          studentId: "student-456",
        })
      ).not.toThrow();

      expect(spy).toHaveBeenCalledWith("session-123", "student-456");
    });
  });
  describe("fetchAvailableCourses", () => {
    test("throws an error when API returns success: false", async () => {
      vi.spyOn(
        CoursesSessionsApi,
        "apiGetAllAvailableCourses"
      ).mockResolvedValue({
        success: false,
        message: "Failed to fetch courses",
      });

      await expect(CourseSessionClient.fetchAvailableCourses()).rejects.toThrow(
        "Failed to fetch courses"
      );
    });
    test("returns data when API returns success: true", async () => {
      const mockData: CourseSessionInfo[] = [{}] as CourseSessionInfo[];

      vi.spyOn(
        CoursesSessionsApi,
        "apiGetAllAvailableCourses"
      ).mockResolvedValue({
        success: true,
        data: mockData,
      });

      const result = await CourseSessionClient.fetchAvailableCourses();

      expect(result).toEqual(mockData);
    });
  });
  describe("getFinalGradeReport", () => {
    it("transforms report object to array", async () => {
      const mockReport: Record<string, SummarizedData> = {
        student1: { finalGrade: 85, studentId: "student1" } as SummarizedData,
        student2: { finalGrade: 90, studentId: "student2" } as SummarizedData,
      };

      vi.spyOn(GradeReportAPI, "apiGetFinalGradeReport").mockResolvedValue({
        success: true,
        data: {
          courseData: {
            courseName: "Test Course",
            courseCode: "TC101",
            sessionStart: null,
            sessionEnd: null,
            courseSessionId: null,
          },
          report: mockReport,
        },
      });

      const result = await CourseSessionClient.getFinalGradeReport(
        "session-123"
      );

      expect(result.report).toEqual(Object.values(mockReport));
      expect(Array.isArray(result.report)).toBe(true);
    });
  });
});
