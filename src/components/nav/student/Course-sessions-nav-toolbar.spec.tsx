import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { CourseSessionsStudentNavToolbar } from "@/components/nav/student/Course-sessions-nav-toolbar";

describe("CourseSessionsNavToolbar", () => {
  test("renders CourseSessionsNavToolbar component", async () => {
    const { findByRole } = render(<CourseSessionsStudentNavToolbar />);
    const gradesLink = screen.getByText("Grades");
    expect(gradesLink).toBeDefined();

    const linkElement = await findByRole("link", {
      name: "Grades",
    });
    const href = linkElement.getAttribute("href");
    expect(href).toBe("/dashboard/student/grades");
  });
});
