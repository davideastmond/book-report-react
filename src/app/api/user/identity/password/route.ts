import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing userId query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const password = body.password;

  if (!password || password.length < 8) {
    //TODO: Add more password validation rules as needed
    return NextResponse.json(
      {
        error: "Password must be at least 8 characters long",
      },
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // A user is found, update the user's password, using bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(user).set({ hashedPassword }).where(eq(user.id, userId));

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to update password:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update password" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
