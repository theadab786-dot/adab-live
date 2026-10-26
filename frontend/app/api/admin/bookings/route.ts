import { NextRequest, NextResponse } from "next/server";
import { getAllBookings } from "@/lib/bookingsService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    const bookings = await getAllBookings(status);
    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking requests", bookings: [] },
      { status: 500 }
    );
  }
}
