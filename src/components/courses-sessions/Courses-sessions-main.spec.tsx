import { CourseSessionClient } from "@/clients/course-session-client";
import { render } from "@testing-library/react";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoursesSessionsMain } from "./Courses-sessions-main";

const fetchCoursesAdminSpy = vi
  .spyOn(CourseSessionClient, "fetchCourseSessionsAdmin")
  .mockResolvedValue([]);

const fetchCoursesUserSpy = vi
  .spyOn(CourseSessionClient, "fetchCourseSessionsByStudent")
  .mockResolvedValue([]);

describe("Courses Sessions Main Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("admin user", () => {
    it("new course session link should be visible", async () => {
      // Mock the component and check if the link is rendered
      const { getByText } = render(<CoursesSessionsMain isAdmin={true} />);
      expect(getByText("+ New Course Session")).toBeDefined();
      expect(getByText("No course sessions found.")).toBeDefined();
      expect(fetchCoursesAdminSpy).toHaveBeenCalled();
      expect(fetchCoursesUserSpy).not.toHaveBeenCalled();
    });
  });
  describe("student user", () => {
    it("new course session link should not be visible", async () => {
      // Mock the component and check if the link is not rendered
      const { queryByText } = render(<CoursesSessionsMain isAdmin={false} />);
      expect(queryByText("+ New Course Session")).toBeNull();
      expect(queryByText("No course sessions found.")).toBeDefined();
      expect(fetchCoursesUserSpy).toHaveBeenCalled();
      expect(fetchCoursesAdminSpy).not.toHaveBeenCalled();
    });
  });
});
