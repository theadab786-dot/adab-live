import { NextRequest, NextResponse } from "next/server";
import { getAllBlockedDates } from "@/lib/bookingsService";

export async function GET(req: NextRequest) {
  try {
    const blockedDates = await getAllBlockedDates();
    return NextResponse.json({ blockedDates });
  } catch (error: any) {
    console.error("Error fetching blocked dates route handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch blocked dates", blockedDates: [] },
      { status: 500 }
    );
  }
}
