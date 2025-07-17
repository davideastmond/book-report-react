import { UserClient } from "@/clients/user-client";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserSearch } from "./User-Search";
describe("User Query Page", () => {
  const mockStudents = [
    {
      studentId: "1",
      studentFirstName: "John",
      studentLastName: "Doe",
      studentEmail: "john.doe@example.com",
      studentDob: new Date("2000-01-01"),
    },
    {
      studentId: "2",
      studentFirstName: "Jane",
      studentLastName: "Smith",
      studentEmail: "jane.smith@example.com",
      studentDob: new Date("2001-02-02"),
    },
    {
      studentId: "3",
      studentFirstName: "Alice",
      studentLastName: "Johnson",
      studentEmail: "alice.johnson@example.com",
      studentDob: new Date("2002-03-03"),
    },
  ];
  it("It renders search results after typing into the search field", async () => {
    const mockGetAllStudents = vi
      .spyOn(UserClient, "getAllStudentsAdmin")
      .mockResolvedValueOnce(mockStudents);
    const onUserSelect = vi.fn();

    // Used the findBy queries to wait for the elements to appear
    const { findByPlaceholderText, findByTestId, findByText } = render(
      <UserSearch onUserSelect={onUserSelect} />
    );

    // Simulate typing into the search field
    fireEvent.change(await findByPlaceholderText(/search for students/i), {
      target: { value: "Doe" },
    });
    expect(mockGetAllStudents).toHaveBeenCalled();
    // The search results should be visible
    expect(await findByTestId("user-search-results")).toBeDefined();
    expect(await findByText(/john.doe/i)).toBeDefined();
  });
});
