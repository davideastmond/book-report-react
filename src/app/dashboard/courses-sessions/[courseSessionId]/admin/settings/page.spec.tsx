import { CourseSessionClient } from "@/clients/course-session-client";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CourseSessionSettingsPage from "./page";

const accessLevels = ["student", "admin"];
let accessIdx = 0;

vi.mock("next/navigation", () => {
  return {
    useParams: () => ({
      courseSessionId: "test-course-session-id",
    }),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      query: {},
    }),
  };
});

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/test.jpg",
        role: accessLevels[accessIdx],
      },
    },
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const fetchCourseSessionByIdAdminMockResult = {
  courseSessionData: {
    courseId: "course-123",
    courseName: "Test Course",
    courseCode: "TC101",
    courseSessionId: "session-123",
    sessionStart: new Date("2023-01-01"),
    sessionEnd: new Date("2023-06-01"),
    instructorId: "instructor-123",
    instructorFirstName: "John",
    instructorLastName: "Doe",
    description: "A test course session",
    studentAllotment: 30,
    allotmentCount: 25,
    isLocked: false,
    isCompleted: false,
    gradeWeightId: "weight-123",
  },
  students: [],
  isEnrolled: false,
};
const fetchCourseSessionSpy = vi
  .spyOn(CourseSessionClient, "fetchCourseSessionByIdAdmin")
  .mockResolvedValue(fetchCourseSessionByIdAdminMockResult);

describe("Settings Page", () => {
  it("renders content correctly", async () => {
    // Test rendering of the component
    accessIdx = 1; // Set to admin
    const { findByText, findByLabelText, findByTestId } = render(
      <CourseSessionSettingsPage />
    );
    expect(await findByText("Course Session Settings")).toBeDefined();
    expect(fetchCourseSessionSpy).toHaveBeenCalled();

    // Course Code and course name are displayed
    expect(await findByText(/TC101 - Test Course/i)).toBeDefined();

    // Description field is auto-populated
    const descriptionInputField = await findByLabelText(/description/i);
    expect((descriptionInputField as HTMLInputElement).value).toBe(
      "A test course session"
    );

    // Session start field is auto-populated
    const sessionStartInputField = await findByLabelText(/starts/i);
    expect((sessionStartInputField as HTMLInputElement).value).toBe(
      "2023-01-01"
    );

    // Session end field is auto-populated
    const sessionEndInputField = await findByLabelText(/ends/i);
    expect((sessionEndInputField as HTMLInputElement).value).toBe("2023-06-01");

    // isLocked checkbox is auto-populated
    const isLockedCheckbox = await findByLabelText(/locked/i);
    expect((isLockedCheckbox as HTMLInputElement).checked).toBe(false);

    // Update button is present
    expect(await findByTestId("update-session-dates-button")).toBeDefined();
  });
  describe("Integration tests", () => {
    it("description is updated", async () => {
      accessIdx = 1; // Set to admin
      const patchCourseSessionSpy = vi
        .spyOn(CourseSessionClient, "patchCourseSession")
        .mockResolvedValue();

      const { findByLabelText, findByTestId } = render(
        <CourseSessionSettingsPage />
      );

      const descriptionInputField = await findByLabelText(/description/i);

      const updateDescriptionForm = await findByTestId(
        "update-session-description-form"
      );
      await waitFor(() => {
        (descriptionInputField as HTMLInputElement).value =
          "An updated test course session";
      });

      fireEvent.submit(updateDescriptionForm);

      // Ensure the patchCourseSession method was called with the updated description
      expect(patchCourseSessionSpy).toHaveBeenCalledWith(
        "test-course-session-id",
        expect.objectContaining({
          description: "An updated test course session",
        })
      );
    });
  });
});
