// @vitest-environment node
/* eslint @typescript-eslint/no-unused-vars: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { describe, expect, it, vi } from "vitest";

import { POST as handler } from "@/api/courses/sessions/route";
import { NextRequest } from "next/server";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() => ({
    user: { name: "Test User", email: "test@example.com" },
    expires: "2025-12-31T23:59:59.999Z",
  })),
}));
const valuesMock = vi
  .fn()
  .mockRejectedValueOnce(new Error("DB error")) // first call -> error
  .mockResolvedValue(undefined); // subsequent calls -> success

vi.mock("drizzle-orm/postgres-js", () => {
  return {
    drizzle: () => ({
      insert: (..._args: any[]) => ({
        // handler should call .values(...). We forward to valuesMock so the spy is actually invoked.
        values: (...args: any[]) => valuesMock(...args),
      }),
    }),
  };
});
describe("POST /api/courses/sessions", () => {
  it("should return 500", async () => {
    const response = await handler({
      json: async () => ({
        courseId: "fake-id3",
        sessionStart: "2024-01-01",
        sessionEnd: "2024-05-05",
        description: "fake description test 3",
        studentAllotment: 20,
      }),
    } as NextRequest);
    expect(response.status).toBe(500);
  });
  it("Expect 201 response", async () => {
    // Mock the request
    const response = await handler({
      json: async () => ({
        courseId: "fake-id1",
        sessionStart: "2024-01-01",
        sessionEnd: "2024-05-05",
        description: "fake description test 1",
        studentAllotment: 20,
      }),
    } as NextRequest);
    expect(response.status).toBe(201);
  });
  it("should return 400 for invalid input", async () => {
    const response = await handler({
      json: async () => ({
        courseId: "fake-id2",
        sessionStart: "",
        sessionEnd: "2024-05-05",
        description: "fake description test 2",
        studentAllotment: 20,
      }),
    } as NextRequest);
    expect(response.status).toBe(400);
  });
});
