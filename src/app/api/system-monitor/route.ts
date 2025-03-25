import { startMonitoring } from "@/lib/monitorCron";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    startMonitoring();
    return NextResponse.json({ message: "System monitoring triggered!" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Monitoring failed!" }, { status: 500 });
  }
}
