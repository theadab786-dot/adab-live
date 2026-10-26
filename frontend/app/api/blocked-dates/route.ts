import { NextRequest, NextResponse } from "next/server";
import { getAllBlockedDates } from "@/lib/bookingsService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const blockedDates = await getAllBlockedDates();
    return NextResponse.json({ blockedDates: blockedDates || [] });
  } catch (error: any) {
    console.error("Error fetching blocked dates route handler:", error);
    return NextResponse.json({ blockedDates: [] });
  }
}
