import { adminDb } from "./firebaseAdmin";
import { BookingPayload, BlockedDatePayload } from "./schemas";
import { sendBookingStatusEmail } from "./email";

export interface FirestoreBookingDoc extends BookingPayload {
  id: string;
  status: "pending" | "confirmed" | "declined";
  createdAt: string;
}

// In-memory dev storage fallback if Firestore is not configured
const devBookingsMemory: FirestoreBookingDoc[] = [
  {
    id: "ADB-109482",
    serviceType: "both",
    band: { presetId: "duet", customMusicianIds: [] },
    sound: { packageId: "pa-basic", addonIds: ["mics-bundle"] },
    event: {
      eventType: "Wedding Reception",
      date: "2026-10-15",
      time: "17:30",
      durationHours: 4,
      venue: "Sunset Ocean Resort",
      city: "Monterey, CA",
      expectedGuests: 120,
    },
    contact: {
      name: "Sarah Jenkins",
      phone: "+1 (555) 234-5678",
      email: "sarah.j@example.com",
      notes: "First dance song: Acoustic version of Perfect by Ed Sheeran",
      customQuoteRequested: false,
      hp: "",
    },
    estimateTotal: 920,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "ADB-308194",
    serviceType: "live-band",
    band: { presetId: "full-band", customMusicianIds: [] },
    sound: { addonIds: [] },
    event: {
      eventType: "Corporate Gala",
      date: "2026-11-02",
      time: "19:00",
      durationHours: 3,
      venue: "Metropolitan Convention Center",
      city: "San Francisco, CA",
      expectedGuests: 350,
    },
    contact: {
      name: "Marcus Vance",
      phone: "+1 (555) 876-5432",
      email: "mvance@corp-events.com",
      notes: "High energy set required for annual award ceremony",
      customQuoteRequested: true,
      hp: "",
    },
    estimateTotal: 1600,
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const devBlockedDatesMemory: { date: string; reason: string; createdAt?: string }[] = [
  { date: "2026-11-02", reason: "Confirmed event booking (ADB-308194)" },
  { date: "2026-12-25", reason: "Christmas Holiday - Private Off" },
];

export async function isDateBlockedOrConfirmed(dateStr: string): Promise<{ blocked: boolean; reason?: string }> {
  if (!adminDb) {
    const found = devBlockedDatesMemory.find((b) => b.date === dateStr);
    return found ? { blocked: true, reason: found.reason } : { blocked: false };
  }

  try {
    const blockedRef = adminDb.collection("blockedDates").doc(dateStr);
    const blockedDoc = await blockedRef.get();
    if (blockedDoc.exists) {
      const data = blockedDoc.data();
      return { blocked: true, reason: data?.reason || "Date manually blocked by band owner" };
    }

    const confirmedQuery = await adminDb
      .collection("bookings")
      .where("event.date", "==", dateStr)
      .where("status", "==", "confirmed")
      .limit(1)
      .get();

    if (!confirmedQuery.empty) {
      return { blocked: true, reason: "Band already has a confirmed booking on this date" };
    }

    return { blocked: false };
  } catch (error) {
    console.error("Error checking date blocking in Firestore:", error);
    return { blocked: false };
  }
}

export async function getAllBlockedDates(): Promise<{ date: string; reason: string }[]> {
  if (!adminDb) {
    return devBlockedDatesMemory;
  }

  try {
    const results: { date: string; reason: string }[] = [];

    const blockedSnapshot = await adminDb.collection("blockedDates").get();
    blockedSnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        date: doc.id || data.date,
        reason: data.reason || "Blocked by owner",
      });
    });

    const confirmedSnapshot = await adminDb
      .collection("bookings")
      .where("status", "==", "confirmed")
      .get();

    confirmedSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.event?.date && !results.some((r) => r.date === data.event.date)) {
        results.push({
          date: data.event.date,
          reason: `Confirmed event booking (${doc.id})`,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Error fetching all blocked dates from Firestore:", error);
    return devBlockedDatesMemory;
  }
}

export async function saveBookingToFirestore(payload: BookingPayload): Promise<string> {
  const customId = `ADB-${Math.floor(100000 + Math.random() * 900000)}`;

  const bookingDoc: FirestoreBookingDoc = {
    ...payload,
    id: customId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (adminDb) {
    try {
      await adminDb.collection("bookings").doc(customId).set(bookingDoc);
    } catch (error) {
      console.error("Failed to save booking to Firestore, saving to dev memory:", error);
      devBookingsMemory.unshift(bookingDoc);
    }
  } else {
    devBookingsMemory.unshift(bookingDoc);
  }

  return customId;
}

export async function getAllBookings(statusFilter?: string): Promise<FirestoreBookingDoc[]> {
  if (!adminDb) {
    if (statusFilter && statusFilter !== "all") {
      return devBookingsMemory.filter((b) => b.status === statusFilter);
    }
    return devBookingsMemory;
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection("bookings");
    if (statusFilter && statusFilter !== "all") {
      query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.get();
    const bookings: FirestoreBookingDoc[] = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as FirestoreBookingDoc);
    });

    return bookings.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  } catch (error) {
    console.error("Error fetching bookings from Firestore:", error);
    return devBookingsMemory;
  }
}

export async function updateBookingStatus(id: string, newStatus: "confirmed" | "declined"): Promise<{ success: boolean; booking?: FirestoreBookingDoc }> {
  let targetBooking: FirestoreBookingDoc | undefined;

  if (adminDb) {
    try {
      const docRef = adminDb.collection("bookings").doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Booking not found");
      }
      targetBooking = { id: doc.id, ...doc.data() } as FirestoreBookingDoc;
      targetBooking.status = newStatus;

      await docRef.update({ status: newStatus });

      if (newStatus === "confirmed" && targetBooking.event?.date) {
        await adminDb.collection("blockedDates").doc(targetBooking.event.date).set({
          date: targetBooking.event.date,
          reason: `Confirmed event booking (${id})`,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Firestore status update failed, using dev memory:", error);
    }
  }

  const devFound = devBookingsMemory.find((b) => b.id === id);
  if (devFound) {
    devFound.status = newStatus;
    targetBooking = devFound;
    if (newStatus === "confirmed" && devFound.event?.date) {
      devBlockedDatesMemory.push({
        date: devFound.event.date,
        reason: `Confirmed event booking (${id})`,
      });
    }
  }

  if (targetBooking) {
    await sendBookingStatusEmail(targetBooking, newStatus);
    return { success: true, booking: targetBooking };
  }

  return { success: false };
}

export async function addBlockedDate(date: string, reason: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection("blockedDates").doc(date).set({
        date,
        reason,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save blocked date to Firestore:", error);
    }
  }

  const existingIndex = devBlockedDatesMemory.findIndex((b) => b.date === date);
  if (existingIndex >= 0) {
    devBlockedDatesMemory[existingIndex].reason = reason;
  } else {
    devBlockedDatesMemory.push({ date, reason });
  }

  return true;
}

export async function removeBlockedDate(date: string): Promise<boolean> {
  if (adminDb) {
    try {
      await adminDb.collection("blockedDates").doc(date).delete();
    } catch (error) {
      console.error("Failed to delete blocked date from Firestore:", error);
    }
  }

  const index = devBlockedDatesMemory.findIndex((b) => b.date === date);
  if (index >= 0) {
    devBlockedDatesMemory.splice(index, 1);
  }

  return true;
}
