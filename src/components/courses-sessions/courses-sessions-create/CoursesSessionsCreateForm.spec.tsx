import { CourseClient } from "@/clients/course-client";
import { CourseSessionClient } from "@/clients/course-session-client";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CoursesSessionsCreateForm } from "./CoursesSessionsCreateForm";
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/test.jpg",
        role: "admin",
      },
    },
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
describe("CoursesSessionsCreateForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors and and data is not submitted", async () => {
    const fetchCoursesSpy = vi
      .spyOn(CourseClient, "fetchCourses")
      .mockResolvedValue([
        { id: "courseId1", name: "Test Course", course_code: "TC101" },
      ]);

    const courseSessionSpy = vi
      .spyOn(CourseSessionClient, "createCourseSession")
      .mockImplementation(() => {
        return Promise.resolve();
      });

    const { getByLabelText, getByTestId, getByText, getAllByText } = render(
      <CoursesSessionsCreateForm />
    );
    expect(fetchCoursesSpy).toHaveBeenCalled();

    const courseIdSelect = getByLabelText(/course/i);
    const descriptionInput = getByLabelText(/description/i);
    const studentAllotmentInput = getByLabelText(/stu. allot./i);
    const sessionStartInput = getByLabelText(/starts/i);
    const sessionEndInput = getByLabelText(/ends/i);
    const submitButton = getByTestId("create-course-session-button");

    const courseSessionForm = getByTestId("create-course-session-form");
    [
      courseIdSelect,
      descriptionInput,
      studentAllotmentInput,
      sessionStartInput,
      sessionEndInput,
      submitButton,
    ].forEach((el) => {
      expect(el).toBeDefined();
    });

    // Submit without filling any fields
    fireEvent.submit(courseSessionForm);

    expect(getByText(/student allotment must be at least 1/i)).toBeDefined();
    expect(getByText(/course id is required/i)).toBeDefined();
    expect(getAllByText(/invalid date/i)).toHaveLength(2);
    // Ensure no API call was made
    expect(courseSessionSpy).not.toHaveBeenCalled();
  });
  it("renders fields and does initial fetch on mount", async () => {
    const fetchCoursesSpy = vi
      .spyOn(CourseClient, "fetchCourses")
      .mockResolvedValue([
        { id: "courseId1", name: "Test Course", course_code: "TC101" },
      ]);

    const courseSessionSpy = vi
      .spyOn(CourseSessionClient, "createCourseSession")
      .mockImplementation(() => {
        return Promise.resolve();
      });
    // Simulate component mount and check if fetchCourses was called
    const { getByLabelText, getByTestId } = render(
      <CoursesSessionsCreateForm />
    );
    expect(fetchCoursesSpy).toHaveBeenCalled();

    const courseIdSelect = getByLabelText(/course/i);
    const descriptionInput = getByLabelText(/description/i);
    const studentAllotmentInput = getByLabelText(/stu. allot./i);
    const sessionStartInput = getByLabelText(/starts/i);
    const sessionEndInput = getByLabelText(/ends/i);
    const submitButton = getByTestId("create-course-session-button");

    const courseSessionForm = getByTestId("create-course-session-form");
    [
      courseIdSelect,
      descriptionInput,
      studentAllotmentInput,
      sessionStartInput,
      sessionEndInput,
      submitButton,
    ].forEach((el) => {
      expect(el).toBeDefined();
    });

    // Supply form data
    (courseIdSelect as HTMLSelectElement).value = "courseId1";
    (descriptionInput as HTMLInputElement).value = "Test session description";
    (studentAllotmentInput as HTMLInputElement).value = "30";
    (sessionStartInput as HTMLInputElement).value = new Date("2023-01-01")
      .toISOString()
      .split("T")[0];
    (sessionEndInput as HTMLInputElement).value = new Date("2023-01-10")
      .toISOString()
      .split("T")[0];

    await waitFor(() => {
      (courseIdSelect as HTMLSelectElement).value = "courseId1";
    });
    fireEvent.submit(courseSessionForm);
    expect(courseSessionSpy).toHaveBeenCalled();
  });
});
