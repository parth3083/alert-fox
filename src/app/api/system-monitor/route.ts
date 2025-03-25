import { NextResponse } from "next/server";
import { monitorSystem } from "@/lib/alertService";

export async function GET() {
  try {
    await monitorSystem();
    return NextResponse.json({ message: "System monitoring triggered!" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Monitoring failed!" }, { status: 500 });
  }
}