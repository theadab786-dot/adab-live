"use client";

import React from "react";
import { Music, Speaker, Calendar, UserCheck, ShieldCheck, ChevronUp, ChevronDown } from "lucide-react";
import lineups from "../../data/lineups.json";
import musicians from "../../data/musicians.json";
import soundCatalog from "../../data/sound.json";
import { calculateBookingEstimate } from "@/lib/pricing";
import { ServiceType } from "@/lib/schemas";

export interface SummaryProps {
  serviceType: ServiceType;
  presetLineupId?: string;
  customMusicianIds: string[];
  soundPackageId?: string;
  soundAddonIds: string[];
  eventDate?: string;
  eventTime?: string;
  durationHours: number;
  city?: string;
  venue?: string;
}

export function Summary({
  serviceType,
  presetLineupId,
  customMusicianIds,
  soundPackageId,
  soundAddonIds,
  eventDate,
  eventTime,
  durationHours,
  city,
  venue,
}: SummaryProps) {
  // Compute live estimate using backend pricing engine
  const { total, breakdown } = calculateBookingEstimate(
    {
      serviceType,
      band: {
        presetId: presetLineupId,
        customMusicianIds,
      },
      sound: {
        packageId: soundPackageId,
        addonIds: soundAddonIds,
      },
      event: {
        eventType: "Selected Event",
        date: eventDate || "2026-10-01",
        time: eventTime || "18:00",
        durationHours: durationHours || 3,
        venue: venue || "Venue",
        city: city || "City",
        expectedGuests: 100,
      },
    },
    lineups,
    musicians,
    soundCatalog
  );

  return (
    <div className="h-full flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 font-display">Live Booking Estimate</h3>
          <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Estimate Only
          </span>
        </div>

        {/* Selected Service Type Indicator */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-500 font-medium">Selected Service:</span>
          <span className="font-bold text-slate-900 capitalize">
            {serviceType === "both"
              ? "Live Band & Sound Setup"
              : serviceType === "live-band"
              ? "Live Band Only"
              : "Sound Setup Only"}
          </span>
        </div>

        {/* Itemized Price Breakdown */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {breakdown.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-4 text-center">
              Make selections to view itemized breakdown
            </div>
          ) : (
            breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-700 font-medium">{item.label}</span>
                <span className="font-bold text-slate-900">₹{item.amount.toLocaleString("en-IN")}</span>
              </div>
            ))
          )}
        </div>

        {/* Event Details Summary Snippet if provided */}
        {(eventDate || venue || city) && (
          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900">Event Overview:</div>
            {eventDate && <div>• Date: {eventDate} {eventTime ? `at ${eventTime}` : ""} ({durationHours} hrs)</div>}
            {(venue || city) && <div>• Location: {venue ? `${venue}, ` : ""}{city}</div>}
          </div>
        )}
      </div>

      {/* Total Display */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Estimated Total</span>
          <span className="text-3xl font-extrabold text-purple-600 font-display">₹{total.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Final price is confirmed by the band owner after reviewing event logistics and location distance.
        </p>
      </div>
    </div>
  );
}

