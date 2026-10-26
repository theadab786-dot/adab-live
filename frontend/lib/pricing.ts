import { BookingPayload } from "./schemas";

export interface LineupItem {
  slug: string;
  name: string;
  basePrice: number;
}

export interface MusicianItem {
  id: string;
  role: string;
  pricePerEvent: number;
}

export interface SoundItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

/**
 * Calculates total estimated price dynamically based on user selection.
 */
export function calculateBookingEstimate(
  payload: Partial<BookingPayload>,
  lineups: LineupItem[],
  musicians: MusicianItem[],
  soundCatalog: SoundItem[]
): { total: number; breakdown: { label: string; amount: number }[] } {
  const breakdown: { label: string; amount: number }[] = [];
  let total = 0;

  const { serviceType, band, sound, event } = payload;

  // 1. Band Lineup / Custom Musicians
  if (serviceType === "live-band" || serviceType === "both") {
    if (band?.presetId) {
      const selectedLineup = lineups.find((l) => l.slug === band.presetId);
      if (selectedLineup) {
        total += selectedLineup.basePrice;
        breakdown.push({
          label: `Live Band (${selectedLineup.name})`,
          amount: selectedLineup.basePrice,
        });
      }
    } else if (band?.customMusicianIds && band.customMusicianIds.length > 0) {
      let customBandTotal = 0;
      band.customMusicianIds.forEach((mId: string) => {
        const musician = musicians.find((m) => m.id === mId);
        if (musician) {
          customBandTotal += musician.pricePerEvent;
          breakdown.push({
            label: `Musician: ${musician.role}`,
            amount: musician.pricePerEvent,
          });
        }
      });
      total += customBandTotal;
    }
  }

  // 2. Sound Setup Packages & Addons
  if (serviceType === "sound-setup" || serviceType === "both") {
    if (sound?.packageId) {
      const pkg = soundCatalog.find((s) => s.id === sound.packageId);
      if (pkg) {
        total += pkg.price;
        breakdown.push({
          label: `Sound Package: ${pkg.name}`,
          amount: pkg.price,
        });
      }
    }
    if (sound?.addonIds && sound.addonIds.length > 0) {
      sound.addonIds.forEach((addonId: string) => {
        const addon = soundCatalog.find((s) => s.id === addonId);
        if (addon) {
          total += addon.price;
          breakdown.push({
            label: `Sound Addon: ${addon.name}`,
            amount: addon.price,
          });
        }
      });
    }
  }

  // 3. Duration adjustment (base prices cover up to 3 hours; +15% per additional hour)
  if (event?.durationHours && event.durationHours > 3) {
    const extraHours = event.durationHours - 3;
    const extraCharge = Math.round(total * 0.15 * extraHours);
    if (extraCharge > 0) {
      total += extraCharge;
      breakdown.push({
        label: `Extended Duration (${extraHours} extra hrs)`,
        amount: extraCharge,
      });
    }
  }

  return { total, breakdown };
}
