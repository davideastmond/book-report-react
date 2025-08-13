/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, it, vi } from "vitest";
import { UserClient } from "../../clients/user-client";

describe("UserClient tests", () => {
  describe("registerUser", () => {
    it("should register user successfully", async () => {
      const mockResponse = new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      global.fetch = vi.fn(() => Promise.resolve(mockResponse)) as any;

      const data = { username: "testuser", password: "password123" };
      const response = await UserClient.registerUser(data);
      expect(response.ok).toBe(true);
    });

    it("should handle registration failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        })
      ) as any;

      const data = { username: "testuser", password: "password123" };
      await expect(UserClient.registerUser(data)).rejects.toThrow(
        "Failed to register user"
      );
    });
  });
  describe("getAllStudentsAdmin", () => {
    it("should fetch all students successfully", async () => {
      const mockStudents = [
        { id: "1", name: "Student One" },
        { id: "2", name: "Student Two" },
      ];

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStudents),
        })
      ) as any;

      const students = await UserClient.getAllStudentsAdmin();
      expect(students).toEqual(mockStudents);
    });

    it("should handle fetch failure", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
      ) as any;

      await expect(UserClient.getAllStudentsAdmin()).rejects.toThrow(
        "Failed to fetch students"
      );
    });
  });
  describe("getUserIdentity", () => {
    it("should throw an error", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        })
      ) as any;
      await expect(UserClient.getUserIdentity("123")).rejects.toThrow(
        "Failed to fetch user identity"
      );
    });
    it("should return user identity", async () => {
      const mockUser = { id: "123", name: "Test User" };
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        })
      ) as any;

      const user = await UserClient.getUserIdentity("123");
      expect(user).toEqual(mockUser);
    });
  });
});
