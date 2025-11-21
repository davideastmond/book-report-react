import { CourseSessionClient } from "@/clients/course-session-client";
import { CourseWorkClient } from "@/clients/course-work-client";
import { AcademicTask } from "@/db/schema";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseWorkCreateUpdateForm } from "./Course-work-create-update-form";

describe("Course-work-create-update-form tests", () => {
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

  describe("submission tests", () => {
    it("create mode - submits course work data successfully", async () => {
      const createCourseWorkSpy = vi
        .spyOn(CourseWorkClient, "createCourseWork")
        .mockResolvedValue();
      vi.spyOn(CourseSessionClient, "getCourseWeightings").mockResolvedValue([
        {
          id: "weight-id",
          name: "Midterm Exam",
          percentage: 20,
          keyTag: "midterm_exam",
          courseSessionId: "course-session-id",
        },
      ]);

      const { findByRole, findByLabelText } = render(
        <CourseWorkCreateUpdateForm
          courseSessionId="course-session-id"
          courseWorkId="course-work-id"
        />
      );
      const nameInput = await findByLabelText(/title/i);

      const gradeValueTypeInput = await findByLabelText(/grade value type/i);
      const taskTypeInput = await findByLabelText(/task type/i);
      const gradeWeightGroupInput = await findByLabelText(
        /grade weight group/i
      );
      const descriptionInput = await findByLabelText(/description/i);
      const dueDateInput = await findByLabelText(/due date/i);

      (nameInput as HTMLInputElement).value = "Test Course Work";

      (gradeValueTypeInput as HTMLInputElement).value = "p";

      (gradeWeightGroupInput as HTMLInputElement).value = "weight-id";
      (descriptionInput as HTMLInputElement).value =
        "This is a test course work description";
      (dueDateInput as HTMLInputElement).value = "2023-12-31";
      (taskTypeInput as HTMLInputElement).value = "assignment";
      // Supply data to the form fields
      const submitButton = await findByRole("button", {
        name: /create course work/i,
      });
      submitButton.click();

      expect(createCourseWorkSpy).toBeCalled();
    });
    it("submits course work data successfully", async () => {
      const createCourseWorkSpy = vi
        .spyOn(CourseWorkClient, "updateCourseWorkAttributesById")
        .mockResolvedValue();
      const gradWeightingsFetchSpy = vi
        .spyOn(CourseSessionClient, "getCourseWeightings")
        .mockResolvedValue([
          {
            id: "weight-id",
            name: "Midterm Exam",
            percentage: 20,
            keyTag: "midterm_exam",
            courseSessionId: "course-session-id",
          },
        ]);

      const { findByRole, findByLabelText } = render(
        <CourseWorkCreateUpdateForm
          courseSessionId="course-session-id"
          courseWorkId="course-work-id"
          isEditing={true}
        />
      );
      expect(gradWeightingsFetchSpy).toHaveBeenCalled();
      const nameInput = await findByLabelText(/title/i);

      const gradeValueTypeInput = await findByLabelText(/grade value type/i);
      const taskTypeInput = await findByLabelText(/task type/i);
      const gradeWeightGroupInput = await findByLabelText(
        /grade weight group/i
      );
      const descriptionInput = await findByLabelText(/description/i);
      const dueDateInput = await findByLabelText(/due date/i);

      (nameInput as HTMLInputElement).value = "Test Course Work";

      (gradeValueTypeInput as HTMLInputElement).value = "p";

      (gradeWeightGroupInput as HTMLInputElement).value = "weight-id";
      (descriptionInput as HTMLInputElement).value =
        "This is a test course work description";
      (dueDateInput as HTMLInputElement).value = "2023-12-31";
      (taskTypeInput as HTMLInputElement).value = "assignment";
      // Supply data to the form fields
      const submitButton = await findByRole("button", { name: /update/i });
      submitButton.click();

      expect(createCourseWorkSpy).toHaveBeenCalledWith("course-work-id", {
        description: "This is a test course work description",
        dueDate: "2023-12-31",
        gradeValueType: "p",
        gradeWeightId: "weight-id",
        name: "Test Course Work",
        taskType: "assignment",
      });
    });

    it("handles submission errors gracefully", async () => {
      const createCourseWorkSpy = vi
        .spyOn(CourseWorkClient, "updateCourseWorkAttributesById")
        .mockImplementation(() => {
          throw Error("Submission failed");
        });

      const { findByRole, findByText } = render(
        <CourseWorkCreateUpdateForm
          courseSessionId="course-session-id"
          courseWorkId="course-work-id"
          isEditing={true}
        />
      );

      const submitButton = await findByRole("button", { name: /update/i });
      submitButton.click();

      expect(createCourseWorkSpy).toHaveBeenCalled();
      expect(await findByText(/submission failed/i)).toBeDefined();
    });
  });
  describe("rendering tests", () => {
    it("renders and calls the functions on load", async () => {
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
    it("renders when gradeWeight data is available", async () => {
      const gradWeightingsFetchSpy = vi
        .spyOn(CourseSessionClient, "getCourseWeightings")
        .mockResolvedValue([
          {
            id: "weight-id",
            name: "Midterm Exam",
            percentage: 20,
            keyTag: "midterm_exam",
            courseSessionId: "course-session-id",
          },
        ]);

      const { findByText } = render(
        <CourseWorkCreateUpdateForm
          courseSessionId="course-session-id"
          courseWorkId="course-work-id"
          isEditing={true}
        />
      );
      expect(gradWeightingsFetchSpy).toHaveBeenCalledWith("course-session-id");
      expect(await findByText(/midterm exam/i)).toBeDefined();
      expect(await findByText(/20%/i)).toBeDefined();
    });
  });
});
