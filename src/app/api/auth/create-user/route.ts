import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationSchema = z.object({
  name: z.string(),
  email: z.string(),
  externalId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error,
          isSynced: false,
        },
        { status: 400 }
      );
    }
    const { name, email, externalId } = validation.data;
    const prisma = new PrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
          isSynced: false,
        },
        { status: 401 }
      );
    }
    await prisma.user.create({
      data: {
        name,
        email,
        externalId,
      },
    });
    return NextResponse.json(
      {
        isSynced: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error,
      },
      { status: 500 }
    );
  }
}
