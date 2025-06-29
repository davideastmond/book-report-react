import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { genderValidator } from "@/lib/validators/identity/gender-validator";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function PUT(req: NextRequest) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const queryParams = req.nextUrl.searchParams;
  if (!queryParams.has("userId")) {
    return NextResponse.json(
      { error: "Missing userId query parameter" },
      { status: 400 }
    );
  }
  const userId = queryParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid userId query parameter" },
      { status: 400 }
    );
  }

  // Ensures student can only access their own identity
  if (authSession.user.role === "student" && authSession.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  try {
    genderValidator.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors,
        },
        { status: 400 }
      );
    }
  }
  const { gender } = body;
  try {
    await db.update(user).set({ gender }).where(eq(user.id, userId));
    return NextResponse.json(
      {
        message: "Gender updated successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to update gender",
      },
      { status: 500 }
    );
  }
}
