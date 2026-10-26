import { z } from "zod";

export const ServiceTypeSchema = z.enum(["live-band", "sound-setup", "both"]);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

export const BandSelectionSchema = z.object({
  presetId: z.string().optional(), // 'solo', 'duet', 'full-band'
  customMusicianIds: z.array(z.string()).default([]), // ['drummer', 'guitarist', etc.]
});

export const SoundSelectionSchema = z.object({
  packageId: z.string().optional(),
  addonIds: z.array(z.string()).default([]),
});

export const EventDetailsSchema = z.object({
  eventType: z.string().min(2, "Event type is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a valid date"),
  time: z.string().min(1, "Start time is required"),
  durationHours: z.number().min(1, "Duration must be at least 1 hour").max(12, "Duration cannot exceed 12 hours"),
  venue: z.string().min(2, "Venue name is required"),
  city: z.string().min(2, "City is required"),
  expectedGuests: z.number().min(1, "Please specify expected number of guests"),
});

export const ContactDetailsSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Valid contact number is required"),
  email: z.string().email("Valid email address is required"),
  notes: z.string().optional(),
  customQuoteRequested: z.boolean().default(false),
  hp: z.string().max(0, "Bot detected").optional().default(""), // Honeypot field
});

export const BookingSchema = z.object({
  serviceType: ServiceTypeSchema,
  band: BandSelectionSchema.optional(),
  sound: SoundSelectionSchema.optional(),
  event: EventDetailsSchema,
  contact: ContactDetailsSchema,
  estimateTotal: z.number().nonnegative(),
});

export type BookingPayload = z.infer<typeof BookingSchema>;

export const BlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
  createdAt: z.string().optional(),
});

export type BlockedDatePayload = z.infer<typeof BlockedDateSchema>;
