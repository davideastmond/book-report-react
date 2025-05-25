import { EnrolledStudent } from "@/lib/types/db/course-session-info";

export const UserClient = {
  getAllStudentsAdmin: async (): Promise<EnrolledStudent[]> => {
    const res = await fetch("/api/user");
    if (!res.ok) {
      throw new Error("Failed to fetch students");
    }
    return res.json();
  },
};
