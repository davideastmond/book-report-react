import { GET as handler } from "@/api/courses/sessions/route";
import { NextRequest } from "next/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() => ({
    user: { name: "Test User", email: "test@example.com" },
    expires: "2025-12-31T23:59:59.999Z",
  })),
}));

vi.mock("drizzle-orm/postgres-js", () => {
  return {
    drizzle: () => ({
      select: () => ({
        from: () => ({
          where: () => ({
            innerJoin: vi.fn().mockImplementation(() => ({
              innerJoin: vi.fn().mockImplementation(() => Promise.resolve([])),
            })),
          }),
        }),
      }),
    }),
  };
});
describe("GET /api/courses/sessions", () => {
  test("returns 200 and list of sessions", async () => {
    const response = await handler({
      nextUrl: {
        searchParams: new URLSearchParams({
          showCompleted: "false",
        }),
      },
    } as NextRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([]));
  });
});
