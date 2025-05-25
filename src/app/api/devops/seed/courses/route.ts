import { db } from "@/db/index";
import { course } from "@/db/schema";
import courses from "@/lib/courses/courses";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response("Admin password not set", { status: 500 });
  }

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return new Response("Authorization header not found", { status: 401 });
  }
  const [authType, authValue] = authorizationHeader.split(" ");
  if (authType !== "Bearer" || authValue !== adminPassword) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coursesWithUUIDs = courses.map((course) => ({
    ...course,
    id: crypto.randomUUID(),
  }));
  // This is going to seed the database with courses
  try {
    await db.insert(course).values(coursesWithUUIDs);
  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message + " - Database error",
    });
  }
  return NextResponse.json({
    message: adminPassword,
  });
};
