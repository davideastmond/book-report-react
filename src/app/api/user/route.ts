import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (!["admin", "teacher"].includes(authSession.user.role)) {
    return NextResponse.json(
      {
        error: "Forbidden access",
      },
      { status: 403 }
    );
  }

  try {
    const res = await db
      .select({
        studentId: user.id,
        studentFirstName: user.firstName,
        studentLastName: user.lastName,
        studentEmail: user.email,
        studentDob: user.dob,
      })
      .from(user)
      .where(eq(user.role, "student"));

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
