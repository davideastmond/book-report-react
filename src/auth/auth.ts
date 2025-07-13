/* eslint  @typescript-eslint/no-explicit-any: "off" */
import { db } from "@/db/index";
import { user as DrizzleDBUser } from "@/db/schema";

import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      if (!token.email) {
        throw Error("No email found in token");
      }

      const userFoundInDb = await db.query.user.findFirst({
        where: eq(DrizzleDBUser.email, token.email),
      });
      if (!userFoundInDb) throw Error("No user found");

      token = {
        ...token,
        id: userFoundInDb.id,
        role: userFoundInDb.role,
      };
      return token;
    },

    async session({ session, token }) {
      session = {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          role: token.role,
          firstName: token.firstName,
          lastName: token.lastName,
        } as any,
      };

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const queryUser = await db.query.user.findFirst({
          where: eq(DrizzleDBUser.email, credentials?.email as string),
        });

        if (!queryUser) {
          throw Error("Unable to validate the user credentials");
        }

        const passwordValidationResult = await compare(
          credentials?.password as string,
          queryUser.hashedPassword
        );

        if (!passwordValidationResult)
          throw Error("Invalid e-mail or password");
        return queryUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
