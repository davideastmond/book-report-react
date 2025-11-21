import { apiRegisterUser, RegistrationRequest } from "@/api/auth/register/api";
import { getAdminStudentData } from "@/api/user/admin/student-data/api";
import { apiGetEnrolledStudents } from "@/api/user/api";
import {
  apiGetUserIdentity,
  apiUpdateUserIdentityNames,
} from "@/api/user/identity/api";
import { apiUpdateUserIdentityGender } from "@/api/user/identity/gender/api";
import { apiUpdateUserIdentityPassword } from "@/api/user/identity/password/api";
import { User } from "@/db/schema";
import { AdminStudentDataAPIResponse } from "@/lib/types/admin-data/admin-student-data-api-response";
import { EnrolledStudent } from "@/lib/types/db/course-session-info";

export const UserClient = {
  registerUser: async (
    data: Record<string, FormDataEntryValue>
  ): Promise<void> => {
    const result = await apiRegisterUser(data as RegistrationRequest);
    if (!result.success) {
      throw Error(result.message!);
    }
  },
  getAllStudentsAdmin: async (): Promise<EnrolledStudent[]> => {
    const res = await apiGetEnrolledStudents();
    if (!res.success) {
      throw Error(res.message!);
    }
    return res.data!;
  },
  getUserIdentity: async (userId: string): Promise<Partial<User>> => {
    const res = await apiGetUserIdentity(userId);
    if (!res.success) {
      throw Error(res.message!);
    }
    return res.data!;
  },
  updateUserName: async (
    userId: string,
    data: Partial<User>
  ): Promise<Partial<User>> => {
    const result = await apiUpdateUserIdentityNames(userId, { ...data });
    if (!result.success) {
      throw Error(result.message!);
    }
    return result.data!;
  },
  updatePassword: async (userId: string, password: string): Promise<void> => {
    const result = await apiUpdateUserIdentityPassword(userId, password);
    if (!result.success) {
      throw Error(result.message!);
    }
  },
  updateUserGender: async (userId: string, gender: string): Promise<void> => {
    const result = await apiUpdateUserIdentityGender(
      userId,
      gender as "male" | "female" | "other"
    );
    if (!result.success) {
      throw Error(result.message!);
    }
  },
  getAdminUserData: async (
    userId: string
  ): Promise<AdminStudentDataAPIResponse> => {
    const result = await getAdminStudentData(userId);
    if (!result.success) {
      throw Error(result.message!);
    }
    return result.data!;
  },
};
