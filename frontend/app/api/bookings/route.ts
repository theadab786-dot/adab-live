import { NextRequest, NextResponse } from "next/server";
import { BookingSchema } from "@/lib/schemas";
import { isDateBlockedOrConfirmed, saveBookingToFirestore } from "@/lib/bookingsService";
import { sendBookingNotificationEmails } from "@/lib/email";

// Simple in-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many booking requests submitted from this IP. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload with Zod
    const body = await req.json();
    const validationResult = BookingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid booking form submission", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const bookingPayload = validationResult.data;

    // 3. Honeypot Spam Protection
    if (bookingPayload.contact.hp && bookingPayload.contact.hp.length > 0) {
      console.warn(`[SPAM BOT BLOCKED] Honeypot field submitted from IP ${ip}`);
      // Return fake success to confuse spam bots
      return NextResponse.json({ success: true, bookingId: "ADB-SPAM-BLOCKED" });
    }

    // 4. Server-side Date Blocking Check
    const dateCheck = await isDateBlockedOrConfirmed(bookingPayload.event.date);
    if (dateCheck.blocked) {
      return NextResponse.json(
        {
          error: `Sorry, the date ${bookingPayload.event.date} is no longer available. (${dateCheck.reason})`,
          blocked: true,
        },
        { status: 409 }
      );
    }

    // 5. Save to Firestore
    const bookingId = await saveBookingToFirestore(bookingPayload);

    // 6. Dispatch Notification Emails
    const emailResult = await sendBookingNotificationEmails({
      ...bookingPayload,
      id: bookingId,
    });

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking request submitted successfully! An email confirmation has been sent.",
      emailStatus: emailResult,
    });
  } catch (error: any) {
    console.error("Error processing booking route handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error processing booking request" },
      { status: 500 }
    );
  }
}
