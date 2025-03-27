import { getUser } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = getUser();
    if (!user) {
      return NextResponse.json(
        {
          isSynced: false,
          message: "unAuthorized",
        },
        { status: 401 }
      );
    }
    const prisma = new PrismaClient();
    const alerts = await prisma.alert.findMany({});
    return NextResponse.json(
      {
        alerts,
        isSynced: true,
      },
      { status: 200 }
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
