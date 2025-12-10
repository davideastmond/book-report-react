import { UserClient } from "@/clients/user-client";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RegistrationForm } from "./Registration-form";

describe("Registration form component tests", () => {
  vi.mock("next-auth/react", () => ({
    signIn: vi.fn(),
  }));

  it("should render the registration form", () => {
    const { getByLabelText } = render(<RegistrationForm />);
    expect(getByLabelText(/first name/i)).toBeDefined();
    expect(getByLabelText(/e-mail address/i)).toBeDefined();
    expect(getByLabelText(/choose a password/i)).toBeDefined();
    expect(getByLabelText(/confirm password/i)).toBeDefined();
    expect(getByLabelText(/date of birth/i)).toBeDefined();
    expect(getByLabelText(/gender/i)).toBeDefined();
  });
  it("should show validation errors for certain inputs", () => {
    const { getByLabelText, getByTestId, getByText } = render(
      <RegistrationForm />
    );

    const emailInput = getByLabelText(/e-mail address/i);
    const firstNameInput = getByLabelText(/first name/i);
    const lastNameInput = getByLabelText(/last name/i);

    const password1Input = getByLabelText(/choose a password/i);
    const password2Input = getByLabelText(/confirm password/i);
    const dateOfBirthInput = getByLabelText(/date of birth/i);
    const genderInput = getByLabelText(/gender/i);

    (emailInput as HTMLInputElement).value = "test@test.";
    (firstNameInput as HTMLInputElement).value = "Joe";
    (lastNameInput as HTMLInputElement).value = "Doe";
    (password1Input as HTMLInputElement).value = "password123";
    (password2Input as HTMLInputElement).value = "password124";
    (dateOfBirthInput as HTMLInputElement).value = new Date("2023-01-01")
      .toISOString()
      .split("T")[0];
    (genderInput as HTMLInputElement).value = "male";

    const formObject = getByTestId("registration-form");
    fireEvent.submit(formObject);

    expect(getByText(/invalid email/i)).toBeDefined();
    expect(getByText(/Passwords do not match/i)).toBeDefined();
  });
  it("Register function is called with correct data", () => {
    const mockRegister = vi.spyOn(UserClient, "registerUser");

    const { getByLabelText, getByTestId } = render(<RegistrationForm />);

    const emailInput = getByLabelText(/e-mail address/i);
    const firstNameInput = getByLabelText(/first name/i);
    const lastNameInput = getByLabelText(/last name/i);
    const password1Input = getByLabelText(/choose a password/i);
    const password2Input = getByLabelText(/confirm password/i);
    const dateOfBirthInput = getByLabelText(/date of birth/i);
    const genderInput = getByLabelText(/gender/i);

    (emailInput as HTMLInputElement).value = "test@test.com";
    (firstNameInput as HTMLInputElement).value = "Joe";
    (lastNameInput as HTMLInputElement).value = "Doe";
    (password1Input as HTMLInputElement).value = "password123";
    (password2Input as HTMLInputElement).value = "password123";
    (dateOfBirthInput as HTMLInputElement).value = new Date("2000-01-01")
      .toISOString()
      .split("T")[0];
    (genderInput as HTMLInputElement).value = "male";

    const formObject = getByTestId("registration-form");
    fireEvent.submit(formObject);

    expect(mockRegister).toHaveBeenCalledWith({
      email: "test@test.com",
      firstName: "Joe",
      lastName: "Doe",
      password1: "password123",
      password2: "password123",
      dob: "2000-01-01",
      gender: "male",
    });
  });
});
