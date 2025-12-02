import { describe, expect, test, vi } from "vitest";
import { apiGetEnrolledStudents } from "./api";
const getServerSessionMock = vi.fn();
const dbMock = vi.fn();
vi.mock("next-auth", () => {
  return {
    getServerSession: () => getServerSessionMock(),
  };
});

vi.mock("@/db/index", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => dbMock(),
      }),
    }),
  },
}));

describe("get enrolled students tests", () => {
  test("returns unauthorized when not authenticated", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const res = await apiGetEnrolledStudents();

    expect(res.success).toBe(false);
    expect(res.message).toBe("Unauthorized");
  });
  test("returns forbidden when user is not admin or teacher", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      user: {
        id: "user-1",
        role: "student",
      },
    });
    const res = await apiGetEnrolledStudents();
    expect(res.success).toBe(false);
    expect(res.message).toBe("Forbidden access");
  });
  test("returns success when user has authorized access", async () => {
    dbMock.mockResolvedValueOnce([]);
    getServerSessionMock.mockResolvedValueOnce({
      user: {
        id: "user-1",
        role: "admin",
      },
    });
    const res = await apiGetEnrolledStudents();
    expect(res.success).toBe(true);
    expect(res.data).toBeInstanceOf(Array);
  });
  test("handles errors during database query", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      user: {
        id: "user-1",
        role: "admin",
      },
    });
    dbMock.mockRejectedValueOnce(new Error("DB error"));
    const res = await apiGetEnrolledStudents();
    expect(res.success).toBe(false);
    expect(res.message).toBe(
      "An error occurred while fetching users: DB error"
    );
  });
});
