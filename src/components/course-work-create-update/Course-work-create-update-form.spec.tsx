import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { AcademicTask } from "@/db/schema";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseWorkCreateUpdateForm } from "./Course-work-create-update-form";
describe("Course-work-create-update-form tests", () => {
  describe("rendering tests", () => {
    it("renders and calls the functions on load", async () => {
      vi.spyOn(CourseWorkClient, "getCourseWorkById").mockResolvedValue({
        id: "course-work-id",
        name: "Test Course Work",
        description: "This is a test course work description",
        dueDate: new Date("2023-12-31"),
        courseSessionId: "course-session-id",
        gradeWeightId: "weight-id",
        taskType: "assignment",
        gradeValueType: "p",
      } as AcademicTask);

      const courseSessionFetchSpy = vi
        .spyOn(CourseSessionClient, "fetchCourseSessionByIdAdmin")
        .mockResolvedValue({
          students: [
            {
              studentId: "student-id",
              studentFirstName: "John",
              studentLastName: "Doe",
              studentEmail: "john.doe@example.com",
              studentDob: new Date("2000-01-01"),
            },
          ],
          courseSessionData: {
            courseId: "course-session-id",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            sessionStart: new Date("2023-01-01"),
            sessionEnd: new Date("2023-06-01"),
            courseSessionId: "course-session-id",
            instructorId: "instructor-id",
            instructorFirstName: "Jane",
            instructorLastName: "Doe",
            description: "A basic course on computer science",
            studentAllotment: 30,
            allotmentCount: 25,
            isLocked: false,
            isCompleted: true,
            gradeWeightId: "weight-id",
          },
          isEnrolled: true,
        });
      const gradWeightingsFetchSpy = vi
        .spyOn(CourseSessionClient, "getCourseWeightings")
        .mockResolvedValue([]);

      const { findByText, findByRole } = render(
        <CourseWorkCreateUpdateForm
          courseSessionId="course-session-id"
          courseWorkId="course-work-id"
          isEditing={true}
        />
      );
      expect(courseSessionFetchSpy).toHaveBeenCalledWith("course-session-id");
      expect(gradWeightingsFetchSpy).toHaveBeenCalledWith("course-session-id");
      expect(await findByText(/edit course work details/i)).toBeDefined();
      expect(await findByText(/no grade weights defined/i)).toBeDefined();
      expect(await findByRole("button", { name: /update/i })).toBeDefined();
    });
  });
});
