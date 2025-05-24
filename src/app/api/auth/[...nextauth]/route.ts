import { authOptions } from "@/auth/auth";
import NextAuth from "next-auth";

const nextAuthOptions = NextAuth(authOptions);
export { nextAuthOptions as GET, nextAuthOptions as POST };
