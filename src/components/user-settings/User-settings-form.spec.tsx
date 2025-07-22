import { UserClient } from "@/clients/user-client";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserSettingsForm } from "./User-settings-form";

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        role: "admin",
        id: "12345",
      },
    },
  }),
}));
const fetchSpy = vi.spyOn(UserClient, "getUserIdentity").mockResolvedValue({
  firstName: "testFirstName",
  lastName: "testLastName",
  email: "testuser@example.com",
  id: "12345",
  dob: new Date("1990-01-01"),
  gender: "female",
});
describe("UserSettingsForm", () => {
  it("loads pre-populated user settings data", async () => {
    const { findByLabelText } = render(<UserSettingsForm />);
    expect(fetchSpy).toHaveBeenCalledWith("12345");

    const firstNameInput = await findByLabelText(/first name/i);
    const lastNameInput = await findByLabelText(/last name/i);
    const genderSelectInput = await findByLabelText(/gender/i);

    const password1Input = await findByLabelText("* Password:");
    const password2Input = await findByLabelText(/confirm password/i);

    expect(password1Input).toBeDefined();
    expect(password2Input).toBeDefined();

    expect((firstNameInput as HTMLInputElement).value).toBe("testFirstName");
    expect((lastNameInput as HTMLInputElement).value).toBe("testLastName");
    expect((genderSelectInput as HTMLSelectElement).value).toBe("female");

    expect(firstNameInput).toBeDefined();
    expect(lastNameInput).toBeDefined();
    expect(genderSelectInput).toBeDefined();
  });

  describe("Form submission scenarios", () => {
    describe("user first name and last name", () => {
      it("updates user first name and last name", async () => {
        const { findByLabelText, findByTestId } = render(<UserSettingsForm />);
        const updateUserSpy = vi
          .spyOn(UserClient, "updateUserName")
          .mockResolvedValue({});

        const firstNameInput = await findByLabelText(/first name/i);
        const lastNameInput = await findByLabelText(/last name/i);

        fireEvent.change(firstNameInput, { target: { value: "NewFirstName" } });
        fireEvent.change(lastNameInput, { target: { value: "NewLastName" } });

        const userUpdateForm = await findByTestId("update-user-form");
        fireEvent.submit(userUpdateForm);

        expect(updateUserSpy).toHaveBeenCalledWith("12345", {
          firstName: "NewFirstName",
          lastName: "NewLastName",
        });
      });
      it("shows error when first name is empty", async () => {
        const { findByLabelText, findByText, findByTestId } = render(
          <UserSettingsForm />
        );
        const updateUserSpy = vi.spyOn(UserClient, "updateUserName");

        const firstNameInput = await findByLabelText(/first name/i);
        const lastNameInput = await findByLabelText(/last name/i);

        fireEvent.change(firstNameInput, { target: { value: "" } });
        fireEvent.change(lastNameInput, { target: { value: "LastName" } });

        const userUpdateForm = await findByTestId("update-user-form");
        fireEvent.submit(userUpdateForm);

        const errorMessage = await findByText("First name is required");
        expect(errorMessage).toBeDefined();
        expect(updateUserSpy).not.toHaveBeenCalled();
      });
      it("shows error when last name is empty", async () => {
        const { findByLabelText, findByText, findByTestId } = render(
          <UserSettingsForm />
        );
        const updateUserSpy = vi.spyOn(UserClient, "updateUserName");

        const firstNameInput = await findByLabelText(/first name/i);
        const lastNameInput = await findByLabelText(/last name/i);

        fireEvent.change(firstNameInput, { target: { value: "FirstName" } });
        fireEvent.change(lastNameInput, { target: { value: "" } });

        const userUpdateForm = await findByTestId("update-user-form");
        fireEvent.submit(userUpdateForm);

        const errorMessage = await findByText(/Last name is required/i);
        expect(errorMessage).toBeDefined();
        expect(updateUserSpy).not.toHaveBeenCalled();
      });
    });
    describe("gender validation", () => {
      it("shows validation error if gender is undefined", async () => {
        const { findByLabelText, findByText, findByTestId } = render(
          <UserSettingsForm />
        );

        const updateUserSpy = vi.spyOn(UserClient, "updateUserGender");

        const genderSelectInput = await findByLabelText(/gender/i);
        fireEvent.change(genderSelectInput, { target: { value: "" } });

        const genderUpdateForm = await findByTestId("gender-form");
        fireEvent.submit(genderUpdateForm);

        const errorMessage = await findByText(/gender is required/i);
        expect(errorMessage).toBeDefined();
        expect(updateUserSpy).not.toHaveBeenCalled();
      });
      it("update user gender successful and no validation errors", async () => {
        const { findByLabelText, findByTestId, findByText } = render(
          <UserSettingsForm />
        );

        const updateUserSpy = vi
          .spyOn(UserClient, "updateUserGender")
          .mockResolvedValue();

        const genderSelectInput = await findByLabelText(/gender/i);
        fireEvent.change(genderSelectInput, { target: { value: "other" } });

        const genderUpdateForm = await findByTestId("gender-form");
        fireEvent.submit(genderUpdateForm);

        expect(updateUserSpy).toHaveBeenCalledWith("12345", "other");
        const toastNotification = await findByText(
          "Gender updated successfully."
        );
        // Toast notification
        expect(toastNotification).toBeDefined();
      });
    });
    describe("password validation", () => {
      it("shows error when passwords do not match", async () => {
        const { findByLabelText, queryAllByText, findByTestId } = render(
          <UserSettingsForm />
        );

        const updatePasswordSpy = vi.spyOn(UserClient, "updatePassword");
        const password1Input = await findByLabelText("* Password:");
        const password2Input = await findByLabelText(/confirm password/i);

        fireEvent.change(password1Input, { target: { value: "password123" } });
        fireEvent.change(password2Input, {
          target: { value: "differentPassword" },
        });

        const passwordUpdateForm = await findByTestId("update-password-form");
        fireEvent.submit(passwordUpdateForm);

        const errorMessage = queryAllByText(/passwords do not match/i);
        expect(updatePasswordSpy).not.toHaveBeenCalled();
        expect(errorMessage).toHaveLength(2);
      });
      it("empty password fields trigger a validation error", async () => {
        const { findByLabelText, findByText, findByTestId } = render(
          <UserSettingsForm />
        );
        const updatePasswordSpy = vi.spyOn(UserClient, "updatePassword");

        const password1Input = await findByLabelText("* Password:");
        const password2Input = await findByLabelText(/confirm password/i);

        fireEvent.change(password1Input, { target: { value: "" } });
        fireEvent.change(password2Input, { target: { value: "" } });

        const passwordUpdateForm = await findByTestId("update-password-form");
        fireEvent.submit(passwordUpdateForm);

        const password1ErrorMessage = await findByText("Password is required");
        const password2ErrorMessage = await findByText(
          /Confirm password is required/i
        );
        expect(password1ErrorMessage).toBeDefined();
        expect(password2ErrorMessage).toBeDefined();
        expect(updatePasswordSpy).not.toHaveBeenCalled();
      });
      it("does not show error when passwords match", async () => {
        const { findByLabelText, queryByText, findByTestId } = render(
          <UserSettingsForm />
        );
        const updatePasswordSpy = vi
          .spyOn(UserClient, "updatePassword")
          .mockResolvedValue();

        const password1Input = await findByLabelText("* Password:");
        const password2Input = await findByLabelText(/confirm password/i);

        fireEvent.change(password1Input, { target: { value: "password123" } });
        fireEvent.change(password2Input, { target: { value: "password123" } });

        const passwordUpdateForm = await findByTestId("update-password-form");
        fireEvent.submit(passwordUpdateForm);

        const errorMessage = queryByText("Passwords do not match");
        expect(errorMessage).toBeNull();
        expect(updatePasswordSpy).toHaveBeenCalledWith("12345", "password123");

        // Shows a toast notification
        const toastNotification = queryByText("Password updated successfully");
        expect(toastNotification).toBeDefined();
      });
    });
  });
});
