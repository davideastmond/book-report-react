import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CourseSessionClient } from "@/clients/course-session-client";
import BrowseCoursesPage from "./page";
describe("browse courses page tests", () => {
  const fetchAvailableCoursesSpy = vi
    .spyOn(CourseSessionClient, "fetchAvailableCourses")
    .mockResolvedValue([]);

  it("renders the browse courses page", () => {
    const { getByText, getByTestId } = render(<BrowseCoursesPage />);
    expect(getByText(/show all courses/i)).toBeDefined();
    expect(getByTestId("showCompleted")).toBeDefined();
    expect(fetchAvailableCoursesSpy).toHaveBeenCalled();
  });
});
