import { db } from "@/db/index";
import { user } from "@/db/schema";
import { registrationValidator } from "@/lib/validators/registration/registration-validator";
import { hashSync } from "bcrypt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const requestBody = (await req.json()) as {
    email: string;
    password1: string;
    password2: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: "male" | "female" | "other";
  };
  try {
    registrationValidator.parse(requestBody);
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
  const { email } = requestBody;

  try {
    // Attempt to register the user
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        { status: 409 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message + " - Error while checking user",
      },
      { status: 500 }
    );
  }

  try {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      email: requestBody.email,
      hashedPassword: hashSync(requestBody.password1, 10),
      dob: new Date(requestBody.dob),
      gender: requestBody.gender,
    });
    return NextResponse.json({
      status: "ok",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message + " - Error while inserting user",
      },
      { status: 500 }
    );
  }
}
