import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/bookingsService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || (status !== "confirmed" && status !== "declined")) {
      return NextResponse.json(
        { error: "Invalid status parameter. Must be 'confirmed' or 'declined'" },
        { status: 400 }
      );
    }

    const result = await updateBookingStatus(resolvedParams.id, status);

    if (!result.success) {
      return NextResponse.json(
        { error: `Failed to update booking status for ID ${resolvedParams.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking request status updated to ${status}. Customer notification email sent.`,
      booking: result.booking,
    });
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
