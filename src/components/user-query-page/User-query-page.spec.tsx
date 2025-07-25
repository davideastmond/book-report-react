import { UserClient } from "@/clients/user-client";
import { render } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { UserQueryPage } from "./User-query-page";

describe("User-query-page tests", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("renders and calls the functions on load - not student data", async () => {
    const getAdminUserDataSpy = vi
      .spyOn(UserClient, "getAdminUserData")
      .mockResolvedValue({
        studentData: {
          studentFirstName: "John",
          studentLastName: "Doe",
          studentId: "12345",
          studentDob: new Date("2000-01-01"),
          studentEmail: "john.doe@example.com",
        },
        coursesData: [],
        gradesData: [],
      });

    const getAllStudentsAdminSpy = vi
      .spyOn(UserClient, "getAllStudentsAdmin")
      .mockResolvedValue([]);
    const { findByText } = render(<UserQueryPage />);
    expect(getAllStudentsAdminSpy).toHaveBeenCalled();
    expect(getAdminUserDataSpy).not.toHaveBeenCalled();

    const noStudentSelected = await findByText("No data");
    expect(noStudentSelected).toBeDefined();
  });
  it("renders and calls the functions on load - student data", async () => {
    const getAllStudentsAdminSpy = vi
      .spyOn(UserClient, "getAllStudentsAdmin")
      .mockResolvedValue([
        {
          studentFirstName: "John",
          studentLastName: "Doe",
          studentId: "12345",
          studentDob: new Date("2000-01-01"),
          studentEmail: "john.doe@example.com",
        },
      ]);

    // Since there is student data, the data should render
    const { findByTestId, getByLabelText } = render(<UserQueryPage />);

    expect(getAllStudentsAdminSpy).toHaveBeenCalled();

    expect(await findByTestId("user-search-component")).toBeDefined();
    const studentSearchInput = getByLabelText(/Enter student name or email/i);
    expect(studentSearchInput).toBeDefined();
  });
});
