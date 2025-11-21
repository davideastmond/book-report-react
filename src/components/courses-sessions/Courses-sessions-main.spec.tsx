import { CourseSessionClient } from "@/clients/course-session-client";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoursesSessionsMain } from "./Courses-sessions-main";

const serverSessionMock = vi
  .fn()
  .mockResolvedValueOnce({
    user: {
      id: "test-user-id",
      role: "admin",
    },
  })
  .mockResolvedValueOnce({
    user: {
      id: "test-user-id",
      role: "student",
    },
  });

vi.mock("next-auth", () => ({
  getServerSession: () => serverSessionMock(),
}));
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
      const page = await CoursesSessionsMain({
        isAdmin: true,
        userId: "fake-id",
      });
      const { findByText } = render(page);
      expect(await findByText(/new course session/i)).toBeDefined();
      expect(await findByText("No course sessions found.")).toBeDefined();
      expect(fetchCoursesAdminSpy).toHaveBeenCalled();
      expect(fetchCoursesUserSpy).not.toHaveBeenCalled();
    });
  });
  describe("student user", () => {
    it("new course session link should not be visible", async () => {
      // Mock the component and check if the link is not rendered
      const page = await CoursesSessionsMain({ isAdmin: false });
      const { findByText, queryByText } = render(page);
      expect(await findByText(/No course sessions found/i)).toBeDefined();
      expect(queryByText(/New Course Session/i)).toBeNull();
      expect(fetchCoursesAdminSpy).not.toHaveBeenCalled();
      expect(fetchCoursesUserSpy).toHaveBeenCalled();
      expect(page).toBeDefined();
    });
  });
});
