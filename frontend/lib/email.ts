import { Resend } from "resend";
import { BookingPayload } from "./schemas";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@adablive.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "booking@adablive.com";

export async function sendBookingNotificationEmails(booking: BookingPayload & { id: string }) {
  if (!resend) {
    console.log("[DEV MODE EMAIL DISPATCH]");
    console.log("Owner Email Notification Body:", {
      to: OWNER_EMAIL,
      subject: `[New Booking Request] ${booking.event.eventType} - ${booking.event.date}`,
      booking,
    });
    console.log("Customer Confirmation Email Body:", {
      to: booking.contact.email,
      subject: `Booking Request Received - Adab Live`,
      customerName: booking.contact.name,
    });
    return { success: true, mode: "mock" };
  }

  try {
    // 1. Send Email to Band Owner
    await resend.emails.send({
      from: `Adab Live Bookings <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `🎵 New Booking Request: ${booking.contact.name} (${booking.event.date})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>New Booking Request Received!</h2>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Customer:</strong> ${booking.contact.name} (${booking.contact.email} | ${booking.contact.phone})</p>
          <h3>Event Details</h3>
          <ul>
            <li><strong>Type:</strong> ${booking.event.eventType}</li>
            <li><strong>Date:</strong> ${booking.event.date} at ${booking.event.time}</li>
            <li><strong>Duration:</strong> ${booking.event.durationHours} hours</li>
            <li><strong>Venue:</strong> ${booking.event.venue}, ${booking.event.city}</li>
            <li><strong>Expected Guests:</strong> ${booking.event.expectedGuests}</li>
          </ul>
          <h3>Selected Services</h3>
          <p><strong>Service Type:</strong> ${booking.serviceType}</p>
          <p><strong>Estimated Total:</strong> ₹${booking.estimateTotal.toLocaleString("en-IN")}</p>
          ${booking.contact.notes ? `<p><strong>Notes/Requests:</strong> ${booking.contact.notes}</p>` : ""}
        </div>
      `,
    });

    // 2. Send Acknowledgement Email to Customer
    await resend.emails.send({
      from: `Adab Live <${FROM_EMAIL}>`,
      to: booking.contact.email,
      subject: `We received your booking request! - Adab Live`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>Hello ${booking.contact.name},</h2>
          <p>Thank you for reaching out to <strong>Adab Live</strong>!</p>
          <p>We have received your booking request for <strong>${booking.event.date}</strong> at <strong>${booking.event.venue}, ${booking.event.city}</strong>.</p>
          <p>Our team is currently reviewing your event details and schedule availability. We will confirm your request shortly via email or phone.</p>
          <br/>
          <p>Best regards,<br/><strong>Adab Live Team</strong></p>
        </div>
      `,
    });

    return { success: true, mode: "live" };
  } catch (error) {
    console.error("Failed to send emails via Resend:", error);
    return { success: false, error };
  }
}

export async function sendBookingStatusEmail(
  booking: BookingPayload & { id: string },
  newStatus: "confirmed" | "declined"
) {
  if (!resend) {
    console.log("[DEV MODE STATUS EMAIL DISPATCH]");
    console.log("Customer Status Email:", {
      to: booking.contact.email,
      newStatus,
      bookingId: booking.id,
    });
    return { success: true, mode: "mock" };
  }

  const isConfirmed = newStatus === "confirmed";
  const subject = isConfirmed
    ? `🎉 Your Booking Request is CONFIRMED! - Adab Live (${booking.event.date})`
    : `Update regarding your booking request - Adab Live (${booking.event.date})`;

  const html = isConfirmed
    ? `
      <div style="font-family: sans-serif; padding: 20px; color: #111;">
        <h2>Great News, ${booking.contact.name}!</h2>
        <p>Your booking request for <strong>${booking.event.date}</strong> at <strong>${booking.event.venue}</strong> has been <strong>CONFIRMED</strong> by the band owner.</p>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p>We have locked in your date on our calendar. Our team will contact you shortly to coordinate final logistics and sound checks.</p>
        <br/>
        <p>Warm regards,<br/><strong>Adab Live Team</strong></p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; padding: 20px; color: #111;">
        <h2>Hello ${booking.contact.name},</h2>
        <p>Thank you for your interest in <strong>Adab Live</strong>.</p>
        <p>Regrettably, we are unable to accept your booking request for <strong>${booking.event.date}</strong> due to schedule conflicts or capacity constraints.</p>
        <p>If you have an alternative date in mind, please feel free to submit a new request or reply to this email directly.</p>
        <br/>
        <p>Best regards,<br/><strong>Adab Live Team</strong></p>
      </div>
    `;

  try {
    await resend.emails.send({
      from: `Adab Live <${FROM_EMAIL}>`,
      to: booking.contact.email,
      subject,
      html,
    });
    return { success: true, mode: "live" };
  } catch (error) {
    console.error("Failed to send status email via Resend:", error);
    return { success: false, error };
  }
}
