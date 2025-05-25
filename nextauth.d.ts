import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: {
      role: "student" | "admin" | "teacher";
      id: string;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }
}
