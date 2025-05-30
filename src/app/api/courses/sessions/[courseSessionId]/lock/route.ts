import { authOptions } from "@/auth/auth";
import { db } from "@/db/index";
import { courseSession } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  urlData: { params: Promise<{ courseSessionId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // This route is only for admins / teachers
  if (["student"].includes(authSession.user.role)) {
    return NextResponse.json(
      {
        error: "Forbidden: Incorrect access level",
      },
      { status: 403 }
    );
  }
  const { courseSessionId } = await urlData.params;
  try {
    await db
      .update(courseSession)
      .set({
        isLocked: sql`NOT ${courseSession.isLocked}`,
      })
      .where(eq(courseSession.id, courseSessionId));
    return NextResponse.json(
      { message: "Course session lock status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Error locking/unlocking course session: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
