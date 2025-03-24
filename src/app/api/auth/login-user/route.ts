import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        {
          isSynced: false,
        },
        { status: 401 }
      );
    }
    const prisma = new PrismaClient();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          isSynced: true,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        isSynced: false,
      },
      { status: 402 }
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
