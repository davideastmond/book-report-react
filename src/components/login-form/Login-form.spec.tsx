import { render } from "@testing-library/react";

import { beforeEach } from "node:test";
import { describe, expect, test, vi } from "vitest";
import { LoginForm } from "./Login-form";

const signInSpy = vi
  .spyOn(require("next-auth/react"), "signIn")
  .mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      error: null,
    });
  });

beforeEach(() => {
  vi.clearAllMocks();
});
describe("LoginForm", () => {
  test("renders correctly", () => {
    const { getByLabelText, getByRole } = render(<LoginForm />);
    expect(getByLabelText(/e-mail/i)).toBeDefined();
    expect(getByLabelText(/password/i)).toBeDefined();
    expect(getByRole("button", { name: /submit/i })).toBeDefined();
  });
  test("submit button doesn't fire signIn function when inputs are empty", () => {
    const { getByTestId } = render(<LoginForm />);
    const submitButton = getByTestId("login-submit-button");
    submitButton.click();
    expect(signInSpy).not.toHaveBeenCalled();
  });
  test("submit button triggers signIn function", () => {
    const { getByTestId, getByLabelText } = render(<LoginForm />);
    const emailInput = getByLabelText(/e-mail/i);
    const passwordInput = getByLabelText(/password/i);

    (emailInput as HTMLInputElement).value = "test@example.com";
    (passwordInput as HTMLInputElement).value = "password123";

    const submitButton = getByTestId("login-submit-button");
    submitButton.click();
    expect(signInSpy).toHaveBeenCalledWith("credentials", {
      callbackUrl: "/dashboard",
      email: "test@example.com",
      password: "password123",
      redirect: false,
    });
  });
});
