import { User } from "@/db/schema";
import { AdminStudentDataAPIResponse } from "@/lib/types/admin-data/admin-student-data-api-response";
import { EnrolledStudent } from "@/lib/types/db/course-session-info";

export const UserClient = {
  registerUser: async (data: Record<string, any>): Promise<Response> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Failed to register user");
    }
    return res;
  },
  getAllStudentsAdmin: async (): Promise<EnrolledStudent[]> => {
    const res = await fetch("/api/user");
    if (!res.ok) {
      throw Error("Failed to fetch students");
    }
    return res.json();
  },
  getUserIdentity: async (userId: string): Promise<Partial<User>> => {
    const res = await fetch(`/api/user/identity?userId=${userId}`);
    if (!res.ok) {
      throw Error("Failed to fetch user identity");
    }
    return res.json();
  },
  updateUserName: async (
    userId: string,
    data: Partial<User>
  ): Promise<Partial<User>> => {
    const res = await fetch(`/api/user/identity?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw Error("Failed to update user identity");
    }
    return res.json();
  },
  updatePassword: async (userId: string, password: string): Promise<void> => {
    const res = await fetch(`/api/user/identity/password?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      throw Error("Failed to update password");
    }
  },
  updateUserGender: async (userId: string, gender: string): Promise<void> => {
    const res = await fetch(`/api/user/identity/gender?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gender }),
    });
    if (!res.ok) {
      throw Error("Failed to update gender");
    }
  },
  getAdminUserData: async (
    userId: string
  ): Promise<AdminStudentDataAPIResponse> => {
    const res = await fetch(`/api/user/admin/student-data?userId=${userId}`);
    if (!res.ok) {
      throw Error("Failed to fetch user courses");
    }
    return res.json();
  },
};
