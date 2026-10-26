import { NextRequest, NextResponse } from "next/server";
import { addBlockedDate, removeBlockedDate } from "@/lib/bookingsService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, reason } = body;

    if (!date || !reason) {
      return NextResponse.json(
        { error: "Date and reason fields are required" },
        { status: 400 }
      );
    }

    await addBlockedDate(date, reason);
    return NextResponse.json({ success: true, message: `Date ${date} blocked successfully` });
  } catch (error: any) {
    console.error("Error adding blocked date:", error);
    return NextResponse.json(
      { error: error.message || "Failed to block date" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date query parameter is required" },
        { status: 400 }
      );
    }

    await removeBlockedDate(date);
    return NextResponse.json({ success: true, message: `Date ${date} unblocked successfully` });
  } catch (error: any) {
    console.error("Error removing blocked date:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unblock date" },
      { status: 500 }
    );
  }
}
