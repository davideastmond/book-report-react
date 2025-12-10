import { describe, expect, test, vi } from "vitest";
import { apiRegisterUser, RegistrationRequest } from "./api";

const userDbQueryMock = vi.fn();

vi.mock("@/db/index", () => ({
  db: {
    query: {
      user: {
        findFirst: () => userDbQueryMock(),
      },
    },
    insert: () => ({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));
describe("Register API", () => {
  describe("Validation tests", () => {
    const testCases = [
      [
        "Valid Data",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "John",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        true,
      ],
      [
        "Invalid Email",
        {
          email: "",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "John",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        false,
      ],
      [
        "empty password",
        {
          email: "test@example.com",
          password1: "",
          password2: "",
          firstName: "John",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        false,
      ],
      [
        "Passwords do not match",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password1234!",
          firstName: "John",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        false,
      ],
      [
        "First Name is empty",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        false,
      ],
      [
        "first name is longer than 50 characters",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "A".repeat(51),
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "female",
        },
        false,
      ],
      [
        "Invalid Dob format",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "Hayley",
          lastName: "Doe",
          dob: "0-01-01",
          gender: "male",
        },
        false,
      ],
      [
        "Gender preference not in enum",
        {
          email: "test@example.com",
          password1: "Password123!",
          password2: "Password123!",
          firstName: "John",
          lastName: "Doe",
          dob: "2000-01-01",
          gender: "otherGender",
        },
        false,
      ],
    ];
    test.each(testCases)(
      "should validate %s",
      async (name, requestData, expected) => {
        userDbQueryMock.mockReturnValue(null);
        const result = await apiRegisterUser(
          requestData as RegistrationRequest
        );
        expect(result.success).toBe(expected);
      }
    );
  });
});
