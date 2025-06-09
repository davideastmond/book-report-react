import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// sample URL: /api/user/identity?userId=12345
export async function GET(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Teachers and admins can access this endpoint
  // Students can only access their own identity
  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.has("userId")) {
    return new Response(
      JSON.stringify({ error: "Missing userId query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const userId = queryParams.get("userId");
  if (!userId) {
    return (
      NextResponse.json({ error: "Invalid userId query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Ensures student can only access their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return (
      NextResponse.json({ error: "Forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Retrieve the user identity from the database
  const userIdentity = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (userIdentity.length === 0) {
    return (
      NextResponse.json({ error: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }
  return NextResponse.json(userIdentity[0], {
    status: 200,
  });
}

export async function PUT(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.has("userId")) {
    return new Response(
      JSON.stringify({ error: "Missing userId query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const userId = queryParams.get("userId");
  if (!userId) {
    return (
      NextResponse.json({ error: "Invalid userId query parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Ensures student can only update their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return (
      NextResponse.json({ error: "Forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const updatedData = {
    firstName: body.firstName,
    lastName: body.lastName,
  };

  try {
    const updatedUser = await db
      .update(user)
      .set(updatedData)
      .where(eq(user.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return (
        NextResponse.json({ error: "User not found or not updated" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(updatedUser[0], {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user identity:", error);
    return (
      NextResponse.json({ error: "Failed to update user identity" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
