import { db } from "@/db/index";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await db.query.course.findMany();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      {
        error: "An server error occurred while fetching courses",
      },
      { status: 500 }
    );
  }
}
